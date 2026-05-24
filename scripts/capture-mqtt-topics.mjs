import mqtt from 'mqtt';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import dotenv from 'dotenv';
import {WORKSHOP_MQTT_TOPICS} from '../mqttTopics.config.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

for (const envFile of ['.env', '.env.local', '.env.dev']) {
    dotenv.config({path: path.join(projectRoot, envFile), override: true});
}

const mqttUrl = process.env.MQTT_URL || 'ws://47.115.212.129:8083/mqtt';
const mqttUsername = process.env.MQTT_USERNAME || 'zdzn';
const mqttPassword = process.env.MQTT_PASSWORD || 'zdzn@1234';
const waitMs = Number(process.env.MQTT_CAPTURE_WAIT_MS || 120000);
const outDir = path.resolve(projectRoot, 'docs/mqtt-samples');
const docPath = path.resolve(projectRoot, 'docs/MQTT各主题数据样例.md');

const configuredTopics = WORKSHOP_MQTT_TOPICS.map((item) => ({
    workshopId: item.workshopId,
    workshopName: item.workshopName,
    topicCode: item.topicCode,
    topic: item.topic,
}));

const subscribeTopics = configuredTopics.map((item) => item.topic);
const latestByTopic = new Map();
const messageCountByTopic = new Map();

function normalizeTopicKey(topic) {
    const trimmed = topic.trim();
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function topicToFilename(item) {
    const slug = item.topic.replace(/^\/+/, '').replace(/[/#]/g, '_');
    return `${item.workshopName}__${slug}.json`;
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }
}

function buildMarkdown() {
    const lines = [
        '# MQTT 各主题数据样例',
        '',
        `> 采集时间：${new Date().toLocaleString('zh-CN', {hour12: false})}`,
        `> Broker：\`${mqttUrl}\``,
        `> 等待窗口：${waitMs}ms`,
        `> 数据目录：\`docs/mqtt-samples/\``,
        '',
        '## 汇总',
        '',
        '| 车间 | MQTT 主题 | 是否收到 | 条数 | 数据文件 |',
        '|------|-----------|----------|------|----------|',
    ];

    for (const item of configuredTopics) {
        const count = messageCountByTopic.get(item.topic) ?? 0;
        const file = topicToFilename(item);
        lines.push(
            `| ${item.workshopName} | \`${item.topic}\` | ${count > 0 ? '是' : '否'} | ${count} | [${file}](./mqtt-samples/${file}) |`,
        );
    }

    lines.push('', '## 各主题数据文件', '');
    for (const item of configuredTopics) {
        const file = topicToFilename(item);
        lines.push(`### ${item.workshopName}`, '', `- 主题：\`${item.topic}\``, `- 文件：\`docs/mqtt-samples/${file}\``, '');
    }

    return lines.join('\n');
}

function saveAllFiles() {
    ensureDir(outDir);
    const index = [];

    for (const item of configuredTopics) {
        const payload = latestByTopic.get(item.topic);
        const fileName = topicToFilename(item);
        const filePath = path.join(outDir, fileName);
        const count = messageCountByTopic.get(item.topic) ?? 0;

        const envelope = payload ?? {
            workshopId: item.workshopId,
            workshopName: item.workshopName,
            topic: item.topic,
            capturedAt: new Date().toISOString(),
            status: 'no_message',
            data: {},
        };

        if (payload) {
            envelope._captureMeta = {
                topic: item.topic,
                topicCode: item.topicCode,
                messageCount: count,
                capturedAt: new Date().toISOString(),
            };
        }

        fs.writeFileSync(filePath, JSON.stringify(envelope, null, 2), 'utf8');
        index.push({
            workshopId: item.workshopId,
            workshopName: item.workshopName,
            topic: item.topic,
            topicCode: item.topicCode,
            file: `docs/mqtt-samples/${fileName}`,
            hasData: Boolean(payload),
            messageCount: count,
            timestamp: payload?.timestamp ?? null,
        });
    }

    fs.writeFileSync(
        path.join(outDir, '_index.json'),
        JSON.stringify({broker: mqttUrl, capturedAt: new Date().toISOString(), workshops: index}, null, 2),
        'utf8',
    );
}

console.log(`Broker: ${mqttUrl}`);
console.log(`输出目录: ${outDir}`);
console.log(`订阅 ${subscribeTopics.length} 个主题，等待 ${waitMs}ms...\n`);
subscribeTopics.forEach((t) => console.log(`  - ${t}`));
console.log('');

ensureDir(outDir);

const client = mqtt.connect(mqttUrl, {
    username: mqttUsername,
    password: mqttPassword,
    clientId: `capture_${Date.now()}`,
    reconnectPeriod: 0,
    connectTimeout: 15000,
});

const hardTimeout = setTimeout(() => {
    console.error('\n硬超时');
    saveAllFiles();
    fs.writeFileSync(docPath, buildMarkdown(), 'utf8');
    client.end(true);
    process.exit(1);
}, waitMs + 25000);

client.on('connect', () => {
    console.log('✅ 已连接\n');
    client.subscribe(subscribeTopics, (err) => {
        if (err) {
            console.error('❌ 订阅失败:', err.message);
            clearTimeout(hardTimeout);
            process.exit(1);
        }
        setTimeout(() => {
            clearTimeout(hardTimeout);
            saveAllFiles();
            fs.writeFileSync(docPath, buildMarkdown(), 'utf8');

            console.log('\n========== 采集完成 ==========');
            let ok = 0;
            for (const item of configuredTopics) {
                const count = messageCountByTopic.get(item.topic) ?? 0;
                if (count > 0) ok++;
                console.log(`${count > 0 ? '✅' : '❌'} ${item.workshopName}`);
                console.log(`    ${item.topic} -> ${topicToFilename(item)} (${count} 条)`);
            }
            console.log(`\n汇总: ${ok}/${configuredTopics.length}`);
            console.log(`索引: docs/mqtt-samples/_index.json`);

            client.end(true);
            process.exit(ok === configuredTopics.length ? 0 : 2);
        }, waitMs);
    });
});

client.on('message', (topic, message) => {
    const key = normalizeTopicKey(topic);
    const matched = configuredTopics.find(
        (item) => normalizeTopicKey(item.topic) === key || item.topic === topic,
    );
    const storeKey = matched?.topic ?? key;

    let payload;
    try {
        payload = JSON.parse(message.toString());
    } catch {
        payload = {
            workshopName: matched?.workshopName ?? null,
            timestamp: new Date().toISOString(),
            timestampMs: Date.now(),
            data: {raw: message.toString()},
        };
    }

    latestByTopic.set(storeKey, payload);
    messageCountByTopic.set(storeKey, (messageCountByTopic.get(storeKey) ?? 0) + 1);
    console.log(`📨 ${topic} <- ${payload.workshopName ?? matched?.workshopName ?? '-'}`);
});

client.on('error', (err) => {
    console.error('❌ MQTT 错误:', err.message);
    clearTimeout(hardTimeout);
    process.exit(1);
});
