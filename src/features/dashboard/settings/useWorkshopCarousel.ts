import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {DashboardDisplaySettings, PauseDurationChoice} from './types';

export type WorkshopSelectSource = 'manual' | 'carousel' | 'init';

export type CarouselRuntimeStatus =
    | 'disabled'
    | 'frozen'
    | 'paused'
    | 'cooldown'
    | 'rotating';

export function useWorkshopCarousel({
                                        workshopIds,
                                        workshopNamesById,
                                        settings,
                                        selectedWorkshop,
                                        onSelectWorkshop,
                                        freeze,
                                    }: {
    workshopIds: string[];
    workshopNamesById: Record<string, string>;
    settings: DashboardDisplaySettings;
    selectedWorkshop: string;
    onSelectWorkshop: (workshopId: string, source: WorkshopSelectSource) => void;
    freeze: boolean;
}) {
    const [rotateRemainingSec, setRotateRemainingSec] = useState(settings.rotateIntervalSec);
    const [cooldownRemainingSec, setCooldownRemainingSec] = useState(0);
    const [pauseRemainingSec, setPauseRemainingSec] = useState<number | null>(null);
    const [pauseForever, setPauseForever] = useState(false);

    const selectedWorkshopRef = useRef(selectedWorkshop);

    selectedWorkshopRef.current = selectedWorkshop;

    useEffect(() => {
        setRotateRemainingSec(settings.rotateIntervalSec);
    }, [settings.rotateIntervalSec]);

    const currentIndex = Math.max(0, workshopIds.indexOf(selectedWorkshop));
    const nextWorkshopId = workshopIds[(currentIndex + 1) % workshopIds.length] ?? selectedWorkshop;
    const nextWorkshopName = workshopNamesById[nextWorkshopId] ?? nextWorkshopId;

    const onManualSwitch = useCallback(() => {
        setCooldownRemainingSec(settings.manualCooldownSec);
        setRotateRemainingSec(settings.rotateIntervalSec);
    }, [settings.manualCooldownSec, settings.rotateIntervalSec]);

    const pauseCarousel = useCallback((choice: PauseDurationChoice) => {
        if (choice === 'forever') {
            setPauseForever(true);
            setPauseRemainingSec(null);
            return;
        }
        setPauseForever(false);
        setPauseRemainingSec(Math.max(10, Math.round(choice)));
    }, []);

    const resumeCarousel = useCallback(() => {
        setPauseForever(false);
        setPauseRemainingSec(null);
    }, []);

    const isPaused = pauseForever || pauseRemainingSec !== null;

    useEffect(() => {
        const timer = window.setInterval(() => {
            if (!pauseForever) {
                setPauseRemainingSec((current) => {
                    if (current === null) return null;
                    if (current <= 1) return null;
                    return current - 1;
                });
            }

            setCooldownRemainingSec((current) => (current > 0 ? current - 1 : 0));

            if (freeze || pauseForever || pauseRemainingSec !== null) return;

            if (!settings.carouselEnabled || workshopIds.length <= 1) return;

            setRotateRemainingSec((current) => {
                if (current > 1) return current - 1;

                const index = workshopIds.indexOf(selectedWorkshopRef.current);
                const safeIndex = index >= 0 ? index : 0;
                const nextId = workshopIds[(safeIndex + 1) % workshopIds.length];
                if (nextId) {
                    onSelectWorkshop(nextId, 'carousel');
                }
                return settings.rotateIntervalSec;
            });
        }, 1000);

        return () => window.clearInterval(timer);
    }, [
        freeze,
        onSelectWorkshop,
        pauseForever,
        pauseRemainingSec,
        settings.carouselEnabled,
        settings.rotateIntervalSec,
        workshopIds,
    ]);

    const runtimeStatus: CarouselRuntimeStatus = useMemo(() => {
        if (!settings.carouselEnabled) return 'disabled';
        if (freeze) return 'frozen';
        if (pauseForever || pauseRemainingSec !== null) return 'paused';
        if (cooldownRemainingSec > 0) return 'cooldown';
        return 'rotating';
    }, [cooldownRemainingSec, freeze, pauseForever, pauseRemainingSec, settings.carouselEnabled]);

    const statusLabel = useMemo(() => {
        if (!settings.carouselEnabled) return '轮播已关闭';

        if (pauseForever) {
            return freeze ? '轮播已暂停（永久）· 面板打开中' : '轮播已暂停（永久）';
        }

        if (pauseRemainingSec !== null) {
            const pauseText = `轮播已暂停（剩余 ${pauseRemainingSec}s）`;
            return freeze ? `${pauseText} · 面板打开中` : pauseText;
        }

        switch (runtimeStatus) {
            case 'frozen':
                return '轮播已冻结（设置/报警面板打开）';
            case 'cooldown':
                return `手动切换冷却中（剩余 ${cooldownRemainingSec}s）`;
            case 'rotating':
                return `轮播中（${rotateRemainingSec}s 后切换）`;
            default:
                return '';
        }
    }, [
        cooldownRemainingSec,
        freeze,
        pauseForever,
        pauseRemainingSec,
        rotateRemainingSec,
        runtimeStatus,
        settings.carouselEnabled,
    ]);

    const headerHint = useMemo(() => {
        if (!settings.carouselEnabled) return null;

        if (pauseForever) return '已暂停 · 永久';

        if (pauseRemainingSec !== null) {
            return `已暂停 · ${pauseRemainingSec}s`;
        }

        if (runtimeStatus === 'rotating') return `轮播中 · ${rotateRemainingSec}s`;

        if (cooldownRemainingSec > 0) return `冷却中 · ${cooldownRemainingSec}s`;

        return null;
    }, [
        cooldownRemainingSec,
        pauseForever,
        pauseRemainingSec,
        rotateRemainingSec,
        runtimeStatus,
        settings.carouselEnabled,
    ]);

    return {
        currentIndex,
        nextWorkshopName,
        rotateRemainingSec,
        cooldownRemainingSec,
        pauseRemainingSec,
        pauseForever,
        isPaused,
        runtimeStatus,
        statusLabel,
        headerHint,
        onManualSwitch,
        pauseCarousel,
        resumeCarousel,
    };
}
