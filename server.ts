import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import mqtt from "mqtt";
import fs from "fs";
import { 
  initDatabase, 
  saveSensorData, 
  saveAlarmRecords, 
  getLatestSensorData, 
  getActiveAlarms,
  getHistoryData 
} from "./db.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

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
  const mqttClient = mqtt.connect('ws://106.12.13.32:8083/mqtt', {
    username: 'zdzn',
    password: 'zdzn@1234',
    clientId: 'server_client_' + Math.random().toString(16).substring(2, 8),
  });

  mqttClient.on('connect', () => {
    console.log('✅ 服务器 MQTT 已连接');
    mqttClient.subscribe('/sensor/jl_old/pub', (err) => {
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
      const data = await getHistoryData(startTime, endTime, limit);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 获取最新 MQTT 数据文件
  app.get("/api/mqtt/latest", (req, res) => {
    try {
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
      server: { middlewareMode: true },
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🚀 服务器启动成功！`);
    console.log(`📍 访问地址: http://localhost:${PORT}`);
    console.log(`📊 API 文档: http://localhost:${PORT}/api/health`);
    console.log(`💾 MQTT 数据文件: mqtt_latest_data.json\n`);
  });
}

startServer();
