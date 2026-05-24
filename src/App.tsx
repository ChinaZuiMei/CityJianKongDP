import React from 'react';
import {DashboardSettingsModal, Header, useDashboardRuntime} from './features/dashboard';
import topDecorImage from './images/网站顶部图片.png';
import bottomDecorImage from './images/网站底部图.png';
import sideDecorImage from './images/网站侧边图.png';

export default function App() {
    const {
        currentTime,
        workshops,
        selectedWorkshopDefinition,
        scadaData,
        mqttConnected,
        alarmData,
        activeAlarms,
        alarmCount,
        isAlarmPanelOpen,
        isSettingsOpen,
        selectedWorkshop,
        settings,
        setSettings,
        restoreDefaults,
        setIsAlarmPanelOpen,
        setIsSettingsOpen,
        handleWorkshopChange,
        workshopConnectionStatuses,
        carousel,
        selectedPauseChoice,
        handlePauseChoiceChange,
        handlePauseCarousel,
        handleResumeCarousel,
    } = useDashboardRuntime();

    const currentWorkshopName = selectedWorkshopDefinition?.name ?? '';

    return (
        <div
            className="relative flex h-screen w-screen flex-col overflow-x-hidden overflow-y-auto bg-transparent text-slate-900 font-sans selection:bg-sky-300/50">
            <div className="site-background" aria-hidden/>
            <div className="site-decor-layer" aria-hidden>
                <img src={topDecorImage} alt="" className="site-decor site-decor--top" draggable="false"/>
                <img src={bottomDecorImage} alt="" className="site-decor site-decor--bottom" draggable="false"/>
                <img src={sideDecorImage} alt="" className="site-decor site-decor--left" draggable="false"/>
                <img src={sideDecorImage} alt="" className="site-decor site-decor--right" draggable="false"/>
            </div>
            <div className="site-title-box">
                <div className="site-title">建衡实业IOT面板</div>
                <div className="site-title-divider" aria-hidden/>
                <div className="site-title-subtitle">JIANHENG INDUSTRIAL IOT CONTROL PANEL</div>
            </div>
            <Header
                currentTime={currentTime}
                alarmCount={alarmCount}
                onAlarmClick={() => setIsAlarmPanelOpen(!isAlarmPanelOpen)}
                workshops={workshops}
                selectedWorkshop={selectedWorkshop}
                onWorkshopChange={handleWorkshopChange}
                onOpenSettings={() => setIsSettingsOpen(true)}
                carouselHint={carousel.headerHint}
            />
            <DashboardSettingsModal
                open={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                settings={settings}
                onSettingsChange={setSettings}
                onRestoreDefaults={restoreDefaults}
                workshopStatuses={workshopConnectionStatuses}
                carouselStatus={carousel.runtimeStatus}
                statusLabel={carousel.statusLabel}
                currentIndex={carousel.currentIndex}
                totalWorkshops={workshops.filter((workshop) => workshop.enabled).length}
                currentWorkshopName={currentWorkshopName}
                nextWorkshopName={carousel.nextWorkshopName}
                rotateRemainingSec={carousel.rotateRemainingSec}
                cooldownRemainingSec={carousel.cooldownRemainingSec}
                pauseRemainingSec={carousel.pauseRemainingSec}
                pauseForever={carousel.pauseForever}
                isPaused={carousel.isPaused}
                selectedPauseChoice={selectedPauseChoice}
                onPauseChoiceChange={handlePauseChoiceChange}
                onPauseCarousel={handlePauseCarousel}
                onResumeCarousel={handleResumeCarousel}
            />
            <div className="contents" key={selectedWorkshop}>
                {selectedWorkshopDefinition?.render({
                    currentTime,
                    scadaData,
                    mqttConnected,
                    alarmData,
                    activeAlarms,
                    alarmCount,
                    isAlarmPanelOpen,
                    setIsAlarmPanelOpen,
                })}
            </div>
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-full h-36"/>
        </div>
    );
}
