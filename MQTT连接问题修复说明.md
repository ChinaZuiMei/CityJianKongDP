# MQTT 连接问题修复说明

## 问题描述
部署到线上后，前端一直显示"MQTT 连接中..."，无法正常连接。

## 问题原因
前端在浏览器中直接通过 WebSocket 连接 MQTT 服务器（ws://106.12.13.32:8083/mqtt）会遇到以下问题：
1. **跨域问题**：浏览器的同源策略限制
2. **网络限制**：生产环境可能无法直接访问外部 MQTT 服务器
3. **防火墙限制**：服务器防火墙可能阻止 WebSocket 连接

## 解决方案
改为通过后端 API 获取 MQTT 数据，架构调整为：

```
MQTT 服务器 (106.12.13.32:8083)
        ↓
    后端服务器 (server.ts)
        ↓ (HTTP API)
    前端浏览器 (App.tsx)
```

### 修改内容

#### 1. 前端修改 (src/App.tsx)
- **移除**：直接连接 MQTT 的代码
- **新增**：通过 HTTP API 轮询获取数据

```typescript
// 旧方案（已移除）
const client = createMqttClient((_topic, payload) => {
  // 处理 MQTT 消息
});

// 新方案
const fetchMqttData = async () => {
  const response = await fetch('/api/mqtt/latest');
  const result = await response.json();
  // 处理数据
};

// 每 3 秒轮询一次
setInterval(fetchMqttData, 3000);
```

#### 2. API 路径修改
- **旧路径**：`http://localhost:3000/api/...` 或 `http://127.0.0.1:3000/api/...`
- **新路径**：`/api/...` （相对路径，自动适配部署环境）

#### 3. 后端保持不变
后端 `server.ts` 已经实现了：
- MQTT 客户端连接
- 数据保存到 `mqtt_latest_data.json`
- 提供 `/api/mqtt/latest` API 接口

## 部署步骤

### 1. 重新打包前端
```bash
npm run build
```

打包结果：
- `dist/index.html` - 0.41 kB
- `dist/assets/index-CLr4hUMX.css` - 40.09 kB
- `dist/assets/index-DyqXDmsu.js` - 420.40 kB (优化后，从 797KB 减少到 420KB)

### 2. 上传到服务器

#### 使用宝塔面板：
1. **上传新的 dist 目录**
   - 文件管理 → `/www/wwwroot/scada-system/`
   - 删除旧的 `dist` 目录
   - 上传新的 `dist` 目录

2. **上传新的 src/App.tsx**
   - 上传到 `/www/wwwroot/scada-system/src/`
   - 覆盖旧文件

3. **重启 Node 项目**
   - 网站 → Node项目
   - 找到 SCADA 项目
   - 点击 `重启`

#### 使用命令行：
```bash
# 进入项目目录
cd /www/wwwroot/scada-system

# 备份旧文件
cp -r dist dist-backup-$(date +%Y%m%d)

# 上传新的 dist 目录（覆盖）
# 使用 scp 或 ftp 工具上传

# 重启服务
pm2 restart scada-system
```

### 3. 验证修复

访问网站后，检查：

1. **顶部导航栏**
   - 应该显示 "MQTT 已连接"（绿色）
   - 如果后端 MQTT 连接成功

2. **浏览器控制台**
   - 按 F12 打开开发者工具
   - 查看 Console 标签
   - 应该看到：`📨 MQTT 数据接收: 2026-04-06 xx:xx:xx`

3. **数据更新**
   - 观察页面数据是否实时更新
   - 每 3 秒应该刷新一次

4. **后端日志**
   - 宝塔面板 → Node项目 → 日志
   - 应该看到：
     ```
     ✅ 服务器 MQTT 已连接
     📨 MQTT 数据接收: 聚铝老厂
     💾 数据已写入文件: mqtt_latest_data.json
     ```

## 优势对比

### 旧方案（前端直连 MQTT）
❌ 受浏览器同源策略限制  
❌ 需要开放 MQTT WebSocket 端口  
❌ 可能被防火墙拦截  
❌ 难以调试和监控  

### 新方案（后端代理）
✅ 不受浏览器限制  
✅ 只需开放 HTTP 端口（3000）  
✅ 更安全（MQTT 凭证不暴露给前端）  
✅ 易于调试和监控  
✅ 可以添加数据缓存和处理  
✅ 支持负载均衡  

## 性能说明

### 数据更新频率
- **前端轮询**：每 3 秒请求一次
- **后端 MQTT**：实时接收（约每 5 秒）
- **实际延迟**：最多 3 秒

### 网络流量
- 每次请求约 5-10 KB
- 每分钟约 20 次请求
- 每小时约 6-12 MB 流量

### 优化建议
如果需要更实时的数据，可以：
1. 减少轮询间隔（如改为 1 秒）
2. 使用 Server-Sent Events (SSE)
3. 使用 WebSocket（通过后端代理）

## 故障排查

### 问题 1：仍然显示"MQTT 连接中..."

**检查后端 MQTT 连接：**
```bash
# 查看后端日志
pm2 logs scada-system

# 应该看到
✅ 服务器 MQTT 已连接
```

**如果后端也连接失败：**
1. 检查服务器网络是否能访问 106.12.13.32:8083
   ```bash
   telnet 106.12.13.32 8083
   ```
2. 检查防火墙规则
3. 检查 MQTT 服务器是否正常

### 问题 2：数据不更新

**检查 API 是否正常：**
```bash
# 在服务器上测试
curl http://localhost:3000/api/mqtt/latest

# 应该返回 JSON 数据
```

**检查浏览器网络请求：**
1. F12 → Network 标签
2. 查看 `/api/mqtt/latest` 请求
3. 检查响应状态码和数据

### 问题 3：报警不显示

**检查报警 API：**
```bash
curl http://localhost:3000/api/alarms/active
```

**检查数据库：**
```bash
# MySQL
mysql -u root -p
USE jiankong_zhongdei;
SELECT * FROM alarm_records WHERE alarm_status = true ORDER BY timestamp DESC LIMIT 10;
```

## 配置文件检查

### .env.local
确保配置正确：
```env
DB_ENV=production
DB_PROD_HOST=192.168.4.54
DB_PROD_PORT=1433
DB_PROD_USER=sa
DB_PROD_PASSWORD=zdzn@2026
DB_PROD_NAME=djycs
```

### server.ts
MQTT 配置（无需修改）：
```javascript
const mqttClient = mqtt.connect('ws://106.12.13.32:8083/mqtt', {
  username: 'zdzn',
  password: 'zdzn@1234',
  clientId: 'server_client_' + Math.random().toString(16).substring(2, 8),
});
```

## 后续优化方向

1. **添加数据缓存**
   - 在后端缓存最近的数据
   - 减少数据库查询

2. **使用 WebSocket**
   - 后端作为 WebSocket 服务器
   - 前端连接后端 WebSocket
   - 实现真正的实时推送

3. **添加心跳检测**
   - 前端定期检查后端状态
   - 后端定期检查 MQTT 连接

4. **添加重连机制**
   - 后端 MQTT 断线自动重连
   - 前端 API 请求失败自动重试

## 总结

通过将 MQTT 连接从前端移到后端，解决了生产环境的连接问题。新架构更加稳定、安全、易于维护。

---

**修复时间**：2026-04-06  
**影响范围**：前端 MQTT 连接方式  
**向下兼容**：是（后端 API 保持不变）  
**需要重新部署**：是（需要更新 dist 目录）
