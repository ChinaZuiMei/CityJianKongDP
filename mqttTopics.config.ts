/**
 * 各车间 MQTT 主题统一配置（车间名称 ↔ 主题一一对应，不使用通配符）
 * Broker 地址见 .env.local / .env.dev 中的 MQTT_URL
 */

type WorkshopMqttEntry = {
    workshopId: string;
    workshopName: string;
    topicCode: string;
    envKey: string;
    topic: string;
};

const MQTT_TOPIC_DEFAULTS = {
    JL_OLD: '/JH/sensor/JLLC/pub',
    XJLYW: '/JH/sensor/XJLYW/pub',
    XJLFY: '/JH/sensor/XJLFY/pub',
    JLXCGZ: '/JH/sensor/JLXCGZ/pub',
    DTLSL: '/JH/sensor/DTLSL/pub',
    JLLST: '/JH/sensor/JLLST/pub',
    YTLSL: '/JH/sensor/YTLSL/pub',
    MFCJ: '/JH/sensor/MFCJ/pub',
} as const;

function normalizeMqttTopic(topic: string): string {
    const trimmed = topic.trim();
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function topicFromEnv(envKey: keyof typeof MQTT_TOPIC_DEFAULTS): string {
    const value = process.env[`MQTT_TOPIC_${envKey}`]?.trim();
    return normalizeMqttTopic(value || MQTT_TOPIC_DEFAULTS[envKey]);
}

/** 车间 ↔ MQTT 主题完整映射表（共 8 个车间） */
export const WORKSHOP_MQTT_TOPICS: WorkshopMqttEntry[] = [
    {
        workshopId: 'workshop-01',
        workshopName: '聚铝老厂',
        topicCode: 'JL_OLD',
        envKey: 'MQTT_TOPIC_JL_OLD',
        topic: topicFromEnv('JL_OLD'),
    },
    {
        workshopId: 'workshop-02',
        workshopName: '新聚铝液位',
        topicCode: 'XJLYW',
        envKey: 'MQTT_TOPIC_XJLYW',
        topic: topicFromEnv('XJLYW'),
    },
    {
        workshopId: 'workshop-03',
        workshopName: '新聚铝反应',
        topicCode: 'XJLFY',
        envKey: 'MQTT_TOPIC_XJLFY',
        topic: topicFromEnv('XJLFY'),
    },
    {
        workshopId: 'workshop-04',
        workshopName: '聚铝新厂干燥',
        topicCode: 'JLXCGZ',
        envKey: 'MQTT_TOPIC_JLXCGZ',
        topic: topicFromEnv('JLXCGZ'),
    },
    {
        workshopId: 'workshop-05',
        workshopName: '低铁硫酸铝',
        topicCode: 'DTLSL',
        envKey: 'MQTT_TOPIC_DTLSL',
        topic: topicFromEnv('DTLSL'),
    },
    {
        workshopId: 'workshop-06',
        workshopName: '聚合硫酸铁',
        topicCode: 'JLLST',
        envKey: 'MQTT_TOPIC_JLLST',
        topic: topicFromEnv('JLLST'),
    },
    {
        workshopId: 'workshop-07',
        workshopName: '液体硫酸铝',
        topicCode: 'YTLSL',
        envKey: 'MQTT_TOPIC_YTLSL',
        topic: topicFromEnv('YTLSL'),
    },
    {
        workshopId: 'workshop-08',
        workshopName: '明矾车间',
        topicCode: 'MFCJ',
        envKey: 'MQTT_TOPIC_MFCJ',
        topic: topicFromEnv('MFCJ'),
    },
];

export function resolveMqttTopics(): string[] {
    return WORKSHOP_MQTT_TOPICS.map((item) => item.topic);
}

export function findWorkshopByTopic(topic: string): WorkshopMqttEntry | undefined {
    const normalized = normalizeMqttTopic(topic);
    return WORKSHOP_MQTT_TOPICS.find((item) => normalizeMqttTopic(item.topic) === normalized);
}

export function findWorkshopTopic(workshopId: string): string | undefined {
    return WORKSHOP_MQTT_TOPICS.find((item) => item.workshopId === workshopId)?.topic;
}
