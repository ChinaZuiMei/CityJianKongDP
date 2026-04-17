import React from 'react';
import { ScadaData } from '../model/types';
import './TankDataPanel.css';
import titleBg from '../../../images/小标题图片.png';

interface TankDataPanelProps {
  data: ScadaData;
}

export const TankDataPanel: React.FC<TankDataPanelProps> = ({ data }) => {
  // 计算百分比
  const getPercentage = (value: number, max: number) => {
    return Math.min((value / max) * 100, 100);
  };

  return (
    <aside className="tank-data-panel">
      {/* 储罐液位监控面板 */}
      <section className="sci-panel single">
        <div className="sci-panel-header">
          <img src={titleBg} alt="" className="title-bg-image" />
          <div className="sci-panel-title">罐区可视化参数</div>
          <div className="sci-panel-subtitle">TANK AREA PARAMETERS</div>
        </div>
        <div className="sci-panel-body">
          {/* 储罐液位数据 */}
          <div className="tank-row">
            <div className="tank-label">1# 盐酸罐</div>
            <div className="tank-track" data-min="0">
              <span 
                className="tank-dot" 
                style={{ left: `${getPercentage(data.hcl_tank1_level, 3.6)}%` }}
              />
            </div>
            <div className="tank-value">
              {data.hcl_tank1_level.toFixed(2)}<em>m</em>
            </div>
          </div>

          <div className="tank-row">
            <div className="tank-label">2# 盐酸罐</div>
            <div className="tank-track" data-min="0">
              <span 
                className="tank-dot" 
                style={{ left: `${getPercentage(data.hcl_tank2_level, 3.6)}%` }}
              />
            </div>
            <div className="tank-value">
              {data.hcl_tank2_level.toFixed(2)}<em>m</em>
            </div>
          </div>

          <div className="tank-row">
            <div className="tank-label">3# 盐酸罐</div>
            <div className="tank-track" data-min="0">
              <span 
                className="tank-dot" 
                style={{ left: `${getPercentage(data.hcl_tank3_level, 3.6)}%` }}
              />
            </div>
            <div className="tank-value">
              {data.hcl_tank3_level.toFixed(2)}<em>m</em>
            </div>
          </div>

          <div className="tank-row">
            <div className="tank-label">1# 硫酸罐</div>
            <div className="tank-track" data-min="0">
              <span 
                className="tank-dot" 
                style={{ left: `${getPercentage(data.h2so4_tank1_level, 6.2)}%` }}
              />
            </div>
            <div className="tank-value">
              {data.h2so4_tank1_level.toFixed(2)}<em>m</em>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
};
