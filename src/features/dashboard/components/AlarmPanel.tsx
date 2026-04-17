import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Activity, Database, Settings } from 'lucide-react';
import { ALARM_MAPPING, formatAlarmDisplayName } from '../lib/alarmUtils';
import { Alarm, AlarmData } from '../model/types';

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
        className="fixed inset-0 z-40 bg-transparent"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.2 }}
        className="fixed right-4 top-20 z-50 w-96 overflow-hidden rounded-xl border border-red-400/70 bg-slate-950 shadow-[0_18px_44px_rgba(2,8,23,0.55)]"
      >
        <div className="flex items-center justify-between border-b border-red-400/60 bg-[#17090c] px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-700 animate-pulse" />
            <span className="text-base font-black text-red-200">活动报警</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-red-400/70 bg-[#2b0e14] px-2.5 py-1 text-xs font-black text-red-100">
              {activeAlarmCount}
            </span>
            <button onClick={onClose} className="text-red-200 transition-colors hover:text-white">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 5L15 15M5 15L15 5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="max-h-[calc(100vh-200px)] space-y-2 overflow-y-auto bg-slate-950 p-4">
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
                  className="rounded-lg border border-red-400/55 bg-[#160b12] p-3 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 text-red-300">{icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-red-100">{alarmType}报警</span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-300">{screenName}</span>
                      </div>
                      <div className="break-words text-base leading-tight font-medium text-slate-100">
                        {formatAlarmDisplayName(alarmName)}
                      </div>
                      {mapping && (
                        <div className="mt-1 text-sm text-sky-300">
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
