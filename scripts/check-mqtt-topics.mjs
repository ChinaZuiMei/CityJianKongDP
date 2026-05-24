import mqtt from 'mqtt';
import {WORKSHOP_MQTT_TOPICS} from '../mqttTopics.config.ts';

const mqttUrl = process.env.MQTT_URL || 'ws://47.115.212.129:8083/mqtt';
const mqttUsername = process.env.MQTT_USERNAME || 'zdzn';
const mqttPassword = process.env.MQTT_PASSWORD || 'zdzn@1234';
const waitMs = Number(process.env.MQTT_CHECK_WAIT_MS || 12000);

const topics = WORKSHOP_MQTT_TOPICS.map((item) => ({
    workshopName: item.workshopName,
    topic: item.topic,
}));

const received = new Map(topics.map((item) => [item.topic, []]));

function finish(client, code) {
    console.log('\n========== 检测结果 ==========');
    for (const item of topics) {
        const messages = received.get(item.topic) ?? [];
        const status = messages.length > 0 ? '有数据' : '无消息';
        console.log(`[${status}] ${item.workshopName}`);
        console.log(`         主题: ${item.topic}`);
        if (messages.length > 0) {
            const sample = messages[0];
            console.log(`         样例: workshopName=${sample.workshopName ?? '-'}, timestamp=${sample.timestamp ?? '-'}`);
        }
    }
    const activeCount = [...received.values()].filter((list) => list.length > 0).length;
    console.log(`\n汇总: ${activeCount}/${topics.length} 个主题在 ${waitMs}ms 内收到消息`);
    client.end(true);
    process.exit(code);
}

console.log(`连接: ${mqttUrl}`);
console.log(`等待: ${waitMs}ms\n`);

const client = mqtt.connect(mqttUrl, {
    username: mqttUsername,
    password: mqttPassword,
    clientId: `topic_check_${Date.now()}`,
    reconnectPeriod: 0,
    connectTimeout: 10000,
});

const timeout = setTimeout(() => {
    console.error(`\n超时: ${waitMs}ms 内未完成检测`);
    finish(client, 1);
}, waitMs + 15000);

client.on('connect', () => {
    console.log('✅ Broker 连接成功\n');
    const topicList = topics.map((item) => item.topic);
    client.subscribe(topicList, (err, granted) => {
        if (err) {
            console.error('❌ 订阅失败:', err.message);
            clearTimeout(timeout);
            finish(client, 1);
            return;
        }

        console.log('✅ 订阅结果:');
        for (const item of granted ?? []) {
            const ok = !item.qos || item.qos >= 0;
            console.log(`   ${ok ? 'OK' : 'FAIL'} ${item.topic} (qos=${item.qos})`);
        }
        console.log(`\n监听中，等待各主题推送（${waitMs}ms）...\n`);
        setTimeout(() => {
            clearTimeout(timeout);
            finish(client, 0);
        }, waitMs);
    });
});

client.on('message', (topic, message) => {
    let payload = {};
    try {
        payload = JSON.parse(message.toString());
    } catch {
        payload = {raw: message.toString().slice(0, 120)};
    }
    const list = received.get(topic) ?? [];
    list.push(payload);
    received.set(topic, list);
    const workshopName = payload.workshopName ?? '-';
    console.log(`📨 ${topic} <- ${workshopName}`);
});

client.on('error', (err) => {
    console.error('❌ MQTT 错误:', err.message);
    clearTimeout(timeout);
    client.end(true);
    process.exit(1);
});
