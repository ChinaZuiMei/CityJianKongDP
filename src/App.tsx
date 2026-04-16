import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { ScadaData, AlarmData, Alarm, DEFAULT_DATA } from './types';
import { Header } from './components/Header';
import { AlarmPanel } from './components/AlarmPanel';
import { ScrollDashboard } from './components/ScrollDashboard';

export default function App() {
  const workshops = ['一号车间', '二号车间', '三号车间', '成品库房'];
  const [scadaData, setScadaData] = useState<ScadaData>(DEFAULT_DATA);
  const [mqttConnected, setMqttConnected] = useState(false);
  const [alarmData, setAlarmData] = useState<AlarmData>({});
  const [activeAlarms, setActiveAlarms] = useState<Alarm[]>([]);
  const [isAlarmPanelOpen, setIsAlarmPanelOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(workshops[0]);

  useEffect(() => {
    // 通过后端 API 获取 MQTT 数据
    const fetchMqttData = async () => {
      try {
        const response = await fetch('/api/mqtt/latest');
        const result = await response.json();
        
        if (result.success && result.data) {
          setMqttConnected(true);
          const payload = result.data;
          const mqttData = payload.data;
          
          // 提取报警数据
          const alarms: AlarmData = {};
          for (const [key, value] of Object.entries(mqttData)) {
            if (key.includes('报警') && !key.includes('设定值')) {
              alarms[key] = (value as any).value === true;
            }
          }
          setAlarmData(alarms);
          
          setScadaData(prev => ({
            ...prev,
            tank1_temp: mqttData['反应槽1温度值']?.value ?? prev.tank1_temp,
            tank2_temp: mqttData['反应槽2温度值']?.value ?? prev.tank2_temp,
            acid_flow_instant: mqttData['盐酸硫酸流量-瞬时']?.value ?? prev.acid_flow_instant,
            acid_flow_total: mqttData['盐酸硫酸流量-累计']?.value ?? prev.acid_flow_total,
            waste_flow_instant: mqttData['东氟废水流量-瞬时']?.value ?? prev.waste_flow_instant,
            waste_flow_total: (mqttData['东氟废水流量-累计整数']?.value ?? 0) + (mqttData['东氟废水流量-累计小数']?.value ?? 0),
            hcl_tank1_level: mqttData['1#盐酸罐液位值']?.value ?? prev.hcl_tank1_level,
            hcl_tank2_level: mqttData['2#盐酸罐液位值']?.value ?? prev.hcl_tank2_level,
            hcl_tank3_level: mqttData['3#盐酸罐液位值']?.value ?? prev.hcl_tank3_level,
            h2so4_tank1_level: mqttData['1#硫酸罐液位值']?.value ?? prev.h2so4_tank1_level,
            leak1: mqttData['1#泄漏检测值']?.value ?? prev.leak1,
            leak2: mqttData['2#泄漏检测值']?.value ?? prev.leak2,
            leak3: mqttData['3#泄漏检测值']?.value ?? prev.leak3,
            loading_instant: mqttData['装车流量-瞬时']?.value ?? prev.loading_instant,
            loading_total: (mqttData['装车流量-累计整数']?.value ?? 0) + (mqttData['装车流量-累计小数']?.value ?? 0),
            old_fan_v: mqttData['老厂风机电流值']?.value ?? prev.old_fan_v,
            old_pump1_v: mqttData['老厂水泵1电流值']?.value ?? prev.old_pump1_v,
            old_pump2_v: mqttData['老厂水泵2电流值']?.value ?? prev.old_pump2_v,
            old_pump3_v: mqttData['老厂水泵3电流值']?.value ?? prev.old_pump3_v,
            drum_fan_v: mqttData['滚筒风机电流']?.value ?? prev.drum_fan_v,
            drum_pump1_v: mqttData['滚筒水泵1电流']?.value ?? prev.drum_pump1_v,
            drum_pump2_v: mqttData['滚筒水泵2电流']?.value ?? prev.drum_pump2_v,
            drum_centrifuge_v: mqttData['老厂离心机电流值']?.value ?? prev.drum_centrifuge_v,
          }));
        } else {
          setMqttConnected(false);
        }
      } catch (error) {
        console.error('获取 MQTT 数据失败:', error);
        setMqttConnected(false);
      }
    };

    // 立即获取一次数据
    fetchMqttData();
    
    // 每 3 秒轮询一次
    const interval = setInterval(fetchMqttData, 3000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        const response = await fetch('/api/alarms/active');
        const result = await response.json();
        if (result.success) {
          setActiveAlarms(result.data);
        }
      } catch (error) {
        console.error('获取报警列表失败:', error);
      }
    };

    fetchAlarms();
    const interval = setInterval(fetchAlarms, 10000);
    return () => clearInterval(interval);
  }, []);

  const alarmCount = Object.values(alarmData).filter(v => v === true).length;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-transparent text-slate-900 font-sans selection:bg-sky-300/50">
      <Header
        connected={mqttConnected}
        alarmCount={alarmCount}
        onAlarmClick={() => setIsAlarmPanelOpen(!isAlarmPanelOpen)}
        workshops={workshops}
        selectedWorkshop={selectedWorkshop}
        onWorkshopChange={setSelectedWorkshop}
      />
      
      <AnimatePresence>
        <AlarmPanel 
          alarms={activeAlarms} 
          alarmData={alarmData} 
          isOpen={isAlarmPanelOpen}
          onClose={() => setIsAlarmPanelOpen(false)}
        />
      </AnimatePresence>
      
      <main className="relative flex-1 overflow-hidden bg-transparent">
        <ScrollDashboard data={scadaData} alarmData={alarmData} />
      </main>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
}
