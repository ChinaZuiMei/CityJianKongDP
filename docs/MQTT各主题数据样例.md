# MQTT 各主题数据样例

> 采集时间：2026/5/23 10:36:05
> Broker：`ws://47.115.212.129:8083/mqtt`
> 等待窗口：120000ms
> 数据目录：`docs/mqtt-samples/`

## 汇总

| 车间     | MQTT 主题                 | 是否收到 | 条数 | 数据文件                                                                                  |
|--------|-------------------------|------|----|---------------------------------------------------------------------------------------|
| 聚铝老厂   | `/sensor/jl_old/pub`    | 否    | 0  | [聚铝老厂__sensor_jl_old_pub.json](./mqtt-samples/聚铝老厂__sensor_jl_old_pub.json)           |
| 新聚铝液位  | `/JH/sensor/XJLYW/pub`  | 是    | 24 | [新聚铝液位__JH_sensor_XJLYW_pub.json](./mqtt-samples/新聚铝液位__JH_sensor_XJLYW_pub.json)     |
| 新聚铝反应  | `/JH/sensor/XJLFY/pub`  | 是    | 24 | [新聚铝反应__JH_sensor_XJLFY_pub.json](./mqtt-samples/新聚铝反应__JH_sensor_XJLFY_pub.json)     |
| 聚铝新厂干燥 | `/JH/sensor/JLXCGZ/pub` | 是    | 24 | [聚铝新厂干燥__JH_sensor_JLXCGZ_pub.json](./mqtt-samples/聚铝新厂干燥__JH_sensor_JLXCGZ_pub.json) |
| 低铁硫酸铝  | `/JH/sensor/DTLSL/pub`  | 是    | 24 | [低铁硫酸铝__JH_sensor_DTLSL_pub.json](./mqtt-samples/低铁硫酸铝__JH_sensor_DTLSL_pub.json)     |
| 聚合硫酸铁  | `/JH/sensor/JLLST/pub`  | 是    | 24 | [聚合硫酸铁__JH_sensor_JLLST_pub.json](./mqtt-samples/聚合硫酸铁__JH_sensor_JLLST_pub.json)     |
| 液体硫酸铝  | `/JH/sensor/YTLSL/pub`  | 是    | 24 | [液体硫酸铝__JH_sensor_YTLSL_pub.json](./mqtt-samples/液体硫酸铝__JH_sensor_YTLSL_pub.json)     |
| 明矾车间   | `/JH/sensor/MFCJ/pub`   | 是    | 24 | [明矾车间__JH_sensor_MFCJ_pub.json](./mqtt-samples/明矾车间__JH_sensor_MFCJ_pub.json)         |

## 各主题数据文件

### 聚铝老厂

- 主题：`/sensor/jl_old/pub`
- 文件：`docs/mqtt-samples/聚铝老厂__sensor_jl_old_pub.json`

### 新聚铝液位

- 主题：`/JH/sensor/XJLYW/pub`
- 文件：`docs/mqtt-samples/新聚铝液位__JH_sensor_XJLYW_pub.json`

### 新聚铝反应

- 主题：`/JH/sensor/XJLFY/pub`
- 文件：`docs/mqtt-samples/新聚铝反应__JH_sensor_XJLFY_pub.json`

### 聚铝新厂干燥

- 主题：`/JH/sensor/JLXCGZ/pub`
- 文件：`docs/mqtt-samples/聚铝新厂干燥__JH_sensor_JLXCGZ_pub.json`

### 低铁硫酸铝

- 主题：`/JH/sensor/DTLSL/pub`
- 文件：`docs/mqtt-samples/低铁硫酸铝__JH_sensor_DTLSL_pub.json`

### 聚合硫酸铁

- 主题：`/JH/sensor/JLLST/pub`
- 文件：`docs/mqtt-samples/聚合硫酸铁__JH_sensor_JLLST_pub.json`

### 液体硫酸铝

- 主题：`/JH/sensor/YTLSL/pub`
- 文件：`docs/mqtt-samples/液体硫酸铝__JH_sensor_YTLSL_pub.json`

### 明矾车间

- 主题：`/JH/sensor/MFCJ/pub`
- 文件：`docs/mqtt-samples/明矾车间__JH_sensor_MFCJ_pub.json`
