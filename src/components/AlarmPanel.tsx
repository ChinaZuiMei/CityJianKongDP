import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Activity, Database, Settings } from 'lucide-react';
import { Alarm, AlarmData } from '../types';
import { ALARM_MAPPING, formatAlarmDisplayName } from '../utils/alarmUtils';

export const AlarmPanel = ({ alarms, alarmData, isOpen, onClose }: { alarms: Alarm[], alarmData: AlarmData, isOpen: boolean, onClose: () => void }) => {
  const activeAlarmCount = Object.values(alarmData).filter(v => v === true).length;
  
  if (!isOpen || activeAlarmCount === 0) return null;
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-sky-200/35 backdrop-blur-sm z-40"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.2 }}
        className="fixed right-4 top-20 w-96 bg-white/95 backdrop-blur-md border-2 border-red-400 rounded-xl shadow-2xl overflow-hidden z-50"
      >
        <div className="bg-red-50 border-b border-red-300 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-700 animate-pulse" />
            <span className="text-red-900 font-black text-base">活动报警</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-black">
              {activeAlarmCount}
            </span>
            <button onClick={onClose} className="text-red-800 hover:text-red-950 transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 5L15 15M5 15L15 5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(100vh-200px)] p-4 space-y-2">
          {Object.entries(alarmData)
            .filter(([_, isActive]) => isActive)
            .map(([alarmName, _], index) => {
              let alarmType = '未知';
              let icon = <AlertTriangle size={16} />;
              
              if (alarmName.includes('温度')) {
                alarmType = '温度';
                icon = <Activity size={16} />;
              } else if (alarmName.includes('液位')) {
                alarmType = '液位';
                icon = <Database size={16} />;
              } else if (alarmName.includes('泄漏')) {
                alarmType = '泄漏';
                icon = <AlertTriangle size={16} />;
              } else if (alarmName.includes('电流')) {
                alarmType = '电流';
                icon = <Settings size={16} />;
              } else if (alarmName.includes('流量')) {
                alarmType = '流量';
                icon = <Activity size={16} />;
              }
              
              const mapping = ALARM_MAPPING[alarmName];
              const screenName = mapping?.screen === 'main' ? '主画面' : 
                               mapping?.screen === 'tanks' ? '罐区' : 
                               mapping?.screen === 'external' ? '外部设备' : '未知';
              
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-red-50/90 border border-red-200 rounded-lg p-3 hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-red-700 mt-1 flex-shrink-0">{icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-red-900 text-sm font-bold">{alarmType}报警</span>
                        <span className="text-slate-500 text-xs">·</span>
                        <span className="text-slate-600 text-xs">{screenName}</span>
                      </div>
                      <div className="text-slate-900 text-base font-medium leading-tight break-words">
                        {formatAlarmDisplayName(alarmName)}
                      </div>
                      {mapping && (
                        <div className="text-sky-800 text-sm mt-1">
                          → {mapping.label}
                        </div>
                      )}
                    </div>
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse flex-shrink-0 mt-2" />
                  </div>
                </motion.div>
              );
            })}
        </div>
      </motion.div>
    </>
  );
};
