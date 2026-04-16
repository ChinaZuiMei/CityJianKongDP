import mysql from 'mysql2/promise';
import mssql from 'mssql';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const DB_ENV = process.env.DB_ENV || 'local';

// MySQL 配置（本地）
const mysqlConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'jiankong_zhongdei',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+08:00'
};

// SQL Server 配置（线上）
const mssqlConfig = {
  server: process.env.DB_PROD_HOST || '192.168.4.54',
  port: parseInt(process.env.DB_PROD_PORT || '1433'),
  user: process.env.DB_PROD_USER || 'sa',
  password: process.env.DB_PROD_PASSWORD || 'zdzn@2026',
  database: process.env.DB_PROD_NAME || 'djycs',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let mysqlPool = null;
let mssqlPool = null;

async function initConnection() {
  try {
    if (DB_ENV === 'local') {
      mysqlPool = mysql.createPool(mysqlConfig);
      console.log('✅ MySQL 连接池已创建（本地环境）');
    } else {
      mssqlPool = await mssql.connect(mssqlConfig);
      console.log('✅ SQL Server 连接成功（线上环境）');
    }
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    throw error;
  }
}

export async function initDatabase() {
  try {
    await initConnection();
    
    if (DB_ENV === 'local') {
      await initMySQLTables();
    } else {
      await initMSSQLTables();
    }
    
    console.log('✅ 数据库初始化成功');
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
    throw error;
  }
}

async function initMySQLTables() {
  const connection = await mysqlPool.getConnection();
  
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${mysqlConfig.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.query(`USE ${mysqlConfig.database}`);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sensor_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        workshop_id VARCHAR(50),
        workshop_name VARCHAR(100),
        timestamp DATETIME,
        timestamp_ms BIGINT,
        tank1_temp DECIMAL(10,3),
        tank2_temp DECIMAL(10,3),
        acid_flow_instant DECIMAL(10,3),
        acid_flow_total DECIMAL(15,3),
        waste_flow_instant DECIMAL(10,3),
        waste_flow_total DECIMAL(15,3),
        hcl_tank1_level DECIMAL(10,3),
        hcl_tank2_level DECIMAL(10,3),
        hcl_tank3_level DECIMAL(10,3),
        h2so4_tank1_level DECIMAL(10,3),
        leak1 DECIMAL(10,3),
        leak2 DECIMAL(10,3),
        leak3 DECIMAL(10,3),
        loading_instant DECIMAL(10,3),
        loading_total DECIMAL(15,3),
        old_fan_v DECIMAL(10,3),
        old_pump1_v DECIMAL(10,3),
        old_pump2_v DECIMAL(10,3),
        old_pump3_v DECIMAL(10,3),
        drum_fan_v DECIMAL(10,3),
        drum_pump1_v DECIMAL(10,3),
        drum_pump2_v DECIMAL(10,3),
        drum_centrifuge_v DECIMAL(10,3),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_timestamp (timestamp),
        INDEX idx_workshop (workshop_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS alarm_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        alarm_type VARCHAR(100),
        alarm_name VARCHAR(200),
        alarm_status BOOLEAN,
        alarm_value DECIMAL(10,3),
        alarm_unit VARCHAR(20),
        workshop_id VARCHAR(50),
        workshop_name VARCHAR(100),
        timestamp DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_timestamp (timestamp),
        INDEX idx_type (alarm_type),
        INDEX idx_status (alarm_status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
  } finally {
    connection.release();
  }
}

async function initMSSQLTables() {
  await mssqlPool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='sensor_data' AND xtype='U')
    CREATE TABLE sensor_data (
      id INT IDENTITY(1,1) PRIMARY KEY,
      workshop_id NVARCHAR(50),
      workshop_name NVARCHAR(100),
      timestamp DATETIME,
      timestamp_ms BIGINT,
      tank1_temp DECIMAL(10,3),
      tank2_temp DECIMAL(10,3),
      acid_flow_instant DECIMAL(10,3),
      acid_flow_total DECIMAL(15,3),
      waste_flow_instant DECIMAL(10,3),
      waste_flow_total DECIMAL(15,3),
      hcl_tank1_level DECIMAL(10,3),
      hcl_tank2_level DECIMAL(10,3),
      hcl_tank3_level DECIMAL(10,3),
      h2so4_tank1_level DECIMAL(10,3),
      leak1 DECIMAL(10,3),
      leak2 DECIMAL(10,3),
      leak3 DECIMAL(10,3),
      loading_instant DECIMAL(10,3),
      loading_total DECIMAL(15,3),
      old_fan_v DECIMAL(10,3),
      old_pump1_v DECIMAL(10,3),
      old_pump2_v DECIMAL(10,3),
      old_pump3_v DECIMAL(10,3),
      drum_fan_v DECIMAL(10,3),
      drum_pump1_v DECIMAL(10,3),
      drum_pump2_v DECIMAL(10,3),
      drum_centrifuge_v DECIMAL(10,3),
      created_at DATETIME DEFAULT GETDATE()
    )
  `);
  
  await mssqlPool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='alarm_records' AND xtype='U')
    CREATE TABLE alarm_records (
      id INT IDENTITY(1,1) PRIMARY KEY,
      alarm_type NVARCHAR(100),
      alarm_name NVARCHAR(200),
      alarm_status BIT,
      alarm_value DECIMAL(10,3),
      alarm_unit NVARCHAR(20),
      workshop_id NVARCHAR(50),
      workshop_name NVARCHAR(100),
      timestamp DATETIME,
      created_at DATETIME DEFAULT GETDATE()
    )
  `);
}

export async function saveSensorData(data) {
  try {
    const mqttData = data.data;
    const sensorData = {
      workshop_id: data.workshopId,
      workshop_name: data.workshopName,
      timestamp: data.timestamp,
      timestamp_ms: data.timestampMs,
      tank1_temp: mqttData['反应槽1温度值']?.value,
      tank2_temp: mqttData['反应槽2温度值']?.value,
      acid_flow_instant: mqttData['盐酸硫酸流量-瞬时']?.value,
      acid_flow_total: mqttData['盐酸硫酸流量-累计']?.value,
      waste_flow_instant: mqttData['东氟废水流量-瞬时']?.value,
      waste_flow_total: (mqttData['东氟废水流量-累计整数']?.value || 0) + (mqttData['东氟废水流量-累计小数']?.value || 0),
      hcl_tank1_level: mqttData['1#盐酸罐液位值']?.value,
      hcl_tank2_level: mqttData['2#盐酸罐液位值']?.value,
      hcl_tank3_level: mqttData['3#盐酸罐液位值']?.value,
      h2so4_tank1_level: mqttData['1#硫酸罐液位值']?.value,
      leak1: mqttData['1#泄漏检测值']?.value,
      leak2: mqttData['2#泄漏检测值']?.value,
      leak3: mqttData['3#泄漏检测值']?.value,
      loading_instant: mqttData['装车流量-瞬时']?.value,
      loading_total: (mqttData['装车流量-累计整数']?.value || 0) + (mqttData['装车流量-累计小数']?.value || 0),
      old_fan_v: mqttData['老厂风机电流值']?.value,
      old_pump1_v: mqttData['老厂水泵1电流值']?.value,
      old_pump2_v: mqttData['老厂水泵2电流值']?.value,
      old_pump3_v: mqttData['老厂水泵3电流值']?.value,
      drum_fan_v: mqttData['滚筒风机电流']?.value,
      drum_pump1_v: mqttData['滚筒水泵1电流']?.value,
      drum_pump2_v: mqttData['滚筒水泵2电流']?.value,
      drum_centrifuge_v: mqttData['老厂离心机电流值']?.value,
    };
    
    if (DB_ENV === 'local') {
      const [result] = await mysqlPool.query('INSERT INTO sensor_data SET ?', sensorData);
      return result.insertId;
    } else {
      const request = mssqlPool.request();
      Object.keys(sensorData).forEach(key => request.input(key, sensorData[key]));
      const result = await request.query(`
        INSERT INTO sensor_data (workshop_id, workshop_name, timestamp, timestamp_ms,
          tank1_temp, tank2_temp, acid_flow_instant, acid_flow_total, waste_flow_instant, waste_flow_total,
          hcl_tank1_level, hcl_tank2_level, hcl_tank3_level, h2so4_tank1_level,
          leak1, leak2, leak3, loading_instant, loading_total,
          old_fan_v, old_pump1_v, old_pump2_v, old_pump3_v,
          drum_fan_v, drum_pump1_v, drum_pump2_v, drum_centrifuge_v)
        VALUES (@workshop_id, @workshop_name, @timestamp, @timestamp_ms,
          @tank1_temp, @tank2_temp, @acid_flow_instant, @acid_flow_total, @waste_flow_instant, @waste_flow_total,
          @hcl_tank1_level, @hcl_tank2_level, @hcl_tank3_level, @h2so4_tank1_level,
          @leak1, @leak2, @leak3, @loading_instant, @loading_total,
          @old_fan_v, @old_pump1_v, @old_pump2_v, @old_pump3_v,
          @drum_fan_v, @drum_pump1_v, @drum_pump2_v, @drum_centrifuge_v);
        SELECT SCOPE_IDENTITY() AS id;
      `);
      return result.recordset[0].id;
    }
  } catch (error) {
    console.error('❌ 保存传感器数据失败:', error.message);
    throw error;
  }
}

export async function saveAlarmRecords(data) {
  try {
    const mqttData = data.data;
    const alarms = [];
    
    for (const [key, value] of Object.entries(mqttData)) {
      if (key.includes('报警') && !key.includes('设定值')) {
        let alarmType = '未知';
        if (key.includes('温度')) alarmType = '温度报警';
        else if (key.includes('液位')) alarmType = '液位报警';
        else if (key.includes('泄漏')) alarmType = '泄漏报警';
        else if (key.includes('电流')) alarmType = '电流报警';
        else if (key.includes('流量')) alarmType = '流量报警';
        
        alarms.push({
          alarm_type: alarmType,
          alarm_name: key,
          alarm_status: value.value,
          alarm_value: null,
          alarm_unit: value.unit,
          workshop_id: data.workshopId,
          workshop_name: data.workshopName,
          timestamp: data.timestamp
        });
      }
    }
    
    const activeAlarms = alarms.filter(alarm => alarm.alarm_status === true);
    
    if (activeAlarms.length > 0) {
      if (DB_ENV === 'local') {
        await mysqlPool.query(
          `INSERT INTO alarm_records (alarm_type, alarm_name, alarm_status, alarm_value, alarm_unit, workshop_id, workshop_name, timestamp) VALUES ?`,
          [activeAlarms.map(alarm => [alarm.alarm_type, alarm.alarm_name, alarm.alarm_status, alarm.alarm_value, alarm.alarm_unit, alarm.workshop_id, alarm.workshop_name, alarm.timestamp])]
        );
      } else {
        for (const alarm of activeAlarms) {
          await mssqlPool.request()
            .input('alarm_type', alarm.alarm_type)
            .input('alarm_name', alarm.alarm_name)
            .input('alarm_status', alarm.alarm_status)
            .input('alarm_value', alarm.alarm_value)
            .input('alarm_unit', alarm.alarm_unit)
            .input('workshop_id', alarm.workshop_id)
            .input('workshop_name', alarm.workshop_name)
            .input('timestamp', alarm.timestamp)
            .query(`INSERT INTO alarm_records (alarm_type, alarm_name, alarm_status, alarm_value, alarm_unit, workshop_id, workshop_name, timestamp)
                    VALUES (@alarm_type, @alarm_name, @alarm_status, @alarm_value, @alarm_unit, @workshop_id, @workshop_name, @timestamp)`);
        }
      }
    }
    
    return activeAlarms.length;
  } catch (error) {
    console.error('❌ 保存报警记录失败:', error.message);
    throw error;
  }
}

export async function getLatestSensorData() {
  try {
    if (DB_ENV === 'local') {
      const [rows] = await mysqlPool.query('SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 1');
      return rows[0];
    } else {
      const result = await mssqlPool.request().query('SELECT TOP 1 * FROM sensor_data ORDER BY timestamp DESC');
      return result.recordset[0];
    }
  } catch (error) {
    console.error('❌ 获取传感器数据失败:', error.message);
    throw error;
  }
}

export async function getActiveAlarms() {
  try {
    if (DB_ENV === 'local') {
      const [rows] = await mysqlPool.query('SELECT * FROM alarm_records WHERE alarm_status = true ORDER BY timestamp DESC LIMIT 50');
      return rows;
    } else {
      const result = await mssqlPool.request().query('SELECT TOP 50 * FROM alarm_records WHERE alarm_status = 1 ORDER BY timestamp DESC');
      return result.recordset;
    }
  } catch (error) {
    console.error('❌ 获取报警列表失败:', error.message);
    throw error;
  }
}

export async function getHistoryData(startTime, endTime, limit = 100) {
  try {
    if (DB_ENV === 'local') {
      const [rows] = await mysqlPool.query('SELECT * FROM sensor_data WHERE timestamp BETWEEN ? AND ? ORDER BY timestamp DESC LIMIT ?', [startTime, endTime, limit]);
      return rows;
    } else {
      const result = await mssqlPool.request()
        .input('startTime', startTime)
        .input('endTime', endTime)
        .input('limit', limit)
        .query('SELECT TOP (@limit) * FROM sensor_data WHERE timestamp BETWEEN @startTime AND @endTime ORDER BY timestamp DESC');
      return result.recordset;
    }
  } catch (error) {
    console.error('❌ 获取历史数据失败:', error.message);
    throw error;
  }
}

export default DB_ENV === 'local' ? mysqlPool : mssqlPool;
