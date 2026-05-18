import React from 'react';
import {AnimatePresence} from 'motion/react';
import {AlarmPanel} from '../dashboard';
import type {WorkshopRuntimeData} from './types';
import tankImage from '../../mingfanImg/罐子.png';
import shipImage from '../../mingfanImg/chaungjian.png';

const tankIds = ['F0101A', 'F0101B', 'F0101C', 'F0101D'];

const sidePanels = [
    {
        title: '蒸汽流量',
        subtitle: '明矾车间',
        theme: 'red',
        instant: '0.0 m³/h',
        total: '11765.3 m³',
    },
    {
        title: '蒸汽流量',
        subtitle: '老厂聚铝',
        theme: 'blue',
        instant: '5.4 m³/h',
        total: '150307.7 m³',
    },
    {
        title: '蒸汽流量',
        subtitle: '恒光',
        theme: 'blue',
        instant: '0.0 m³/h',
        total: '0.0 m³',
    },
];

export function WorkshopEightView({
                                      alarmData,
                                      activeAlarms,
                                      isAlarmPanelOpen,
                                      setIsAlarmPanelOpen,
                                  }: WorkshopRuntimeData) {
    return (
        <>
            <AnimatePresence>
                <AlarmPanel
                    alarms={activeAlarms}
                    alarmData={alarmData}
                    isOpen={isAlarmPanelOpen}
                    onClose={() => setIsAlarmPanelOpen(false)}
                />
            </AnimatePresence>

            <main className="workshop-eight-stage">
                <div className="workshop-eight-main-column">
                    <section className="workshop-eight-stage__top">
                        <div className="workshop-eight-section-block">
                            <div className="workshop-eight-section-heading">主画面</div>
                            <div className="workshop-eight-tank-row">
                                {tankIds.map((tankId) => (
                                    <div key={tankId} className="workshop-eight-tank-item">
                                        <div className="workshop-eight-tank-item__label">{tankId}</div>
                                        <img src={tankImage} alt={tankId} className="workshop-eight-tank-item__image"
                                             draggable="false"/>
                                        <div className="workshop-eight-tank-item__metrics">
                                            <div className="workshop-eight-tank-item__metric">0.0 A</div>
                                            <div className="workshop-eight-tank-item__metric">0.00 Mpa</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="workshop-eight-stage__bottom">
                        <div className="workshop-eight-section-block workshop-eight-section-block--bottom">
                            <div className="workshop-eight-section-heading">产量统计</div>
                            <div className="workshop-eight-production-header">
                                <div className="workshop-eight-production-title">产线1包装统计</div>
                                <div className="workshop-eight-ship-count">
                                    <span className="workshop-eight-ship-count__label">当前数量:</span>
                                    <span className="workshop-eight-ship-count__value">1431 P</span>
                                </div>
                            </div>

                        </div>

                        <div className="workshop-eight-ship-scene" aria-hidden>
                            <span className="workshop-eight-ship-scene__wake workshop-eight-ship-scene__wake--rear"/>
                            <span className="workshop-eight-ship-scene__wake workshop-eight-ship-scene__wake--mid"/>
                        </div>

                        <img src={shipImage} alt="流光船舰" className="workshop-eight-ship" draggable="false"/>
                    </section>
                </div>

                <aside className="workshop-eight-side-cards">
                    {sidePanels.map((card, index) => (
                        <section
                            key={`${card.title}-${card.subtitle}-${index}`}
                            className={card.theme === 'red' ? 'workshop-eight-flow-card workshop-eight-flow-card--red' : 'workshop-eight-flow-card workshop-eight-flow-card--blue'}
                        >
                            <div className="workshop-eight-flow-card__header">
                                <div className="workshop-eight-flow-card__title">{card.title}</div>
                                <div className="workshop-eight-flow-card__subtitle">{card.subtitle}</div>
                            </div>
                            <div className="workshop-eight-flow-card__row">
                                <span className="workshop-eight-flow-card__label">瞬时流量:</span>
                                <span className="workshop-eight-flow-card__value">{card.instant}</span>
                            </div>
                            <div className="workshop-eight-flow-card__row">
                                <span className="workshop-eight-flow-card__label">累计流量:</span>
                                <span className="workshop-eight-flow-card__value">{card.total}</span>
                            </div>
                        </section>
                    ))}
                </aside>
            </main>
        </>
    );
}
