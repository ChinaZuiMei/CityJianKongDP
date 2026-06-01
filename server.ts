import "./loadEnv.js";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import mqtt from "mqtt";
import fs from "fs";
import os from "os";
import {
  initDatabase,
  saveSensorData,
  saveAlarmRecords,
  getLatestSensorData,
  getActiveAlarms,
  getHistoryData
} from "./db.config.js";
import {findWorkshopByTopic, getWorkshopMqttTopics, resolveMqttTopics} from "./mqttTopics.config.js";
import {loadedAppEnv} from "./loadEnv.js";

const mqttCacheDir = path.join(process.cwd(), "mqtt_cache");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appEnv = loadedAppEnv;

function payloadMatchesWorkshop(
    payload: { workshopId?: string; workshopName?: string },
    workshopEntry: { topicCode: string; workshopName: string },
) {
    const payloadId = payload.workshopId?.trim();
    const payloadName = payload.workshopName?.trim();

    if (payloadId === workshopEntry.topicCode) return true;
    if (payloadName === workshopEntry.workshopName) return true;
    if (workshopEntry.topicCode === 'JL_OLD' && (payloadId === 'JH_JL_OLD' || payloadName === '聚铝老厂')) {
        return true;
    }
    return false;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.APP_PORT || 3000);
  const HOST = process.env.APP_HOST || "0.0.0.0";
    const mqttUrl = process.env.MQTT_URL || "ws://47.115.212.129:8083/mqtt";
  const mqttUsername = process.env.MQTT_USERNAME || "zdzn";
  const mqttPassword = process.env.MQTT_PASSWORD || "zdzn@1234";
    const mqttTopics = resolveMqttTopics();

  // 中间件
  app.use(cors());
  app.use(express.json());

  // 初始化数据库
  try {
    await initDatabase();
  } catch (error) {
    console.error('数据库初始化失败，请检查配置');
  }

  // 连接 MQTT 并保存数据
  const mqttClient = mqtt.connect(mqttUrl, {
    username: mqttUsername,
    password: mqttPassword,
    clientId: 'server_client_' + Math.random().toString(16).substring(2, 8),
  });

  mqttClient.on('connect', () => {
    console.log('✅ 服务器 MQTT 已连接');
    console.log(`🌍 当前环境: ${appEnv}`);
    console.log(`🔗 MQTT 地址: ${mqttUrl}`);
      console.log(`📡 MQTT 主题 (${mqttTopics.length}):`);
      getWorkshopMqttTopics().forEach((item) => console.log(`   - ${item.workshopName}: ${item.topic}`));
      mqttClient.subscribe(mqttTopics, (err) => {
      if (!err) {
        console.log('✅ 服务器已订阅 MQTT 主题');
      }
    });
  });

  mqttClient.on('message', async (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());

      // 打印接收到的数据
      console.log('\n📨 MQTT 数据接收:', new Date().toLocaleString());
      console.log('车间:', payload.workshopName);
      console.log('时间戳:', payload.timestamp);

      // 将数据写入文件（覆盖模式）
      const dataFilePath = path.join(process.cwd(), 'mqtt_latest_data.json');
      const formattedData = JSON.stringify(payload, null, 2);
      fs.writeFileSync(dataFilePath, formattedData, 'utf8');
      console.log('💾 数据已写入文件: mqtt_latest_data.json');

        const workshopEntry = findWorkshopByTopic(topic);
        if (workshopEntry) {
            if (!fs.existsSync(mqttCacheDir)) {
                fs.mkdirSync(mqttCacheDir, {recursive: true});
            }
            const cacheFilePath = path.join(mqttCacheDir, `${workshopEntry.topicCode}.json`);
            fs.writeFileSync(cacheFilePath, formattedData, 'utf8');
            console.log(`💾 车间缓存: mqtt_cache/${workshopEntry.topicCode}.json`);
        }

      // 保存传感器数据到数据库
      await saveSensorData(payload);
      console.log('✅ 传感器数据已保存到数据库');

      // 保存报警记录到数据库
      const alarmCount = await saveAlarmRecords(payload);

      if (alarmCount > 0) {
        console.log(`⚠️  检测到 ${alarmCount} 个活动报警`);
      }

      console.log('-----------------------------------');
    } catch (error) {
      console.error('❌ 处理 MQTT 消息失败:', error.message);
    }
  });

  // API 路由
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Industrial SCADA Backend Ready" });
  });

  // 获取最新传感器数据
  app.get("/api/sensor/latest", async (req, res) => {
    try {
      const data = await getLatestSensorData();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 获取活动报警列表
  app.get("/api/alarms/active", async (req, res) => {
    try {
      const alarms = await getActiveAlarms();
      res.json({ success: true, data: alarms });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 获取历史数据
  app.get("/api/sensor/history", async (req, res) => {
    try {
      const { startTime, endTime, limit } = req.query;
      const parsedLimit = typeof limit === 'string' ? Number(limit) : 100;
      const data = await getHistoryData(startTime, endTime, Number.isFinite(parsedLimit) ? parsedLimit : 100);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

    // 获取最新 MQTT 数据（?workshopId=workshop-02 按车间读取独立缓存）
  app.get("/api/mqtt/latest", (req, res) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
    try {
        const workshopId = typeof req.query.workshopId === 'string' ? req.query.workshopId : undefined;
        if (workshopId) {
            const workshopEntry = getWorkshopMqttTopics().find((item) => item.workshopId === workshopId);
            if (!workshopEntry) {
                res.json({success: false, message: `未知车间: ${workshopId}`});
                return;
            }
            const cacheFilePath = path.join(mqttCacheDir, `${workshopEntry.topicCode}.json`);
            if (fs.existsSync(cacheFilePath)) {
                const data = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
                res.json({success: true, data});
                return;
            }

            const dataFilePath = path.join(process.cwd(), 'mqtt_latest_data.json');
            if (fs.existsSync(dataFilePath)) {
                const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
                if (payloadMatchesWorkshop(data, workshopEntry)) {
                    res.json({success: true, data});
                    return;
                }
            }

            res.json({
                success: false,
                message: `暂无 ${workshopEntry.workshopName} 的 MQTT 缓存`,
            });
            return;
        }

      const dataFilePath = path.join(process.cwd(), 'mqtt_latest_data.json');
      if (fs.existsSync(dataFilePath)) {
        const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
        res.json({ success: true, data });
      } else {
        res.json({ success: false, message: '暂无数据' });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === "true" ? false : undefined,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, HOST, () => {
    const localUrl = `http://localhost:${PORT}`;
    const networkAddress = Object.values(os.networkInterfaces())
      .flat()
      .find((item) => item?.family === "IPv4" && !item.internal)?.address;
    const networkUrl = networkAddress ? `http://${networkAddress}:${PORT}` : null;

    console.log(`\n🚀 服务器启动成功！`);
    console.log(`📍 本机访问: ${localUrl}`);
    if (networkUrl) {
      console.log(`🌐 局域网访问: ${networkUrl}`);
    }
    console.log(`📊 API 文档: ${localUrl}/api/health`);
    console.log(`💾 MQTT 数据文件: mqtt_latest_data.json\n`);
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRNOTAVAIL") {
      console.error(`启动失败：当前电脑没有可绑定的地址 ${HOST}:${PORT}`);
      console.error("请把 APP_HOST 改成 0.0.0.0、127.0.0.1，或当前电脑实际的局域网 IP。");
      process.exit(1);
    }

    if (error.code === "EADDRINUSE") {
      console.error(`启动失败：端口 ${PORT} 已被占用，请修改 APP_PORT 或关闭占用该端口的进程。`);
      process.exit(1);
    }

    throw error;
  });
}

startServer();
