import React from 'react';
import {Settings, X} from 'lucide-react';
import {cn} from '../../../utils/cn';
import {PAUSE_DURATION_PRESETS, type DashboardDisplaySettings, type PauseDurationChoice} from '../settings/types';
import type {CarouselRuntimeStatus} from '../settings/useWorkshopCarousel';

export type WorkshopConnectionStatus = {
    id: string;
    name: string;
    connected: boolean;
    lastUpdatedAt?: number;
};

function formatPauseCountdown(pauseForever: boolean, pauseRemainingSec: number | null): string | null {
    if (pauseForever) return '永久';
    if (pauseRemainingSec === null) return null;
    if (pauseRemainingSec >= 60) {
        const minutes = Math.floor(pauseRemainingSec / 60);
        const seconds = pauseRemainingSec % 60;
        return `${minutes}分${seconds.toString().padStart(2, '0')}秒`;
    }
    return `${pauseRemainingSec}秒`;
}

export function DashboardSettingsModal({
                                           open,
                                           onClose,
                                           settings,
                                           onSettingsChange,
                                           onRestoreDefaults,
                                           workshopStatuses,
                                           carouselStatus,
                                           statusLabel,
                                           currentIndex,
                                           totalWorkshops,
                                           currentWorkshopName,
                                           nextWorkshopName,
                                           rotateRemainingSec,
                                           cooldownRemainingSec,
                                           pauseRemainingSec,
                                           pauseForever,
                                           isPaused,
                                           selectedPauseChoice,
                                           onPauseChoiceChange,
                                           onPauseCarousel,
                                           onResumeCarousel,
                                       }: {
    open: boolean;
    onClose: () => void;
    settings: DashboardDisplaySettings;
    onSettingsChange: (settings: DashboardDisplaySettings) => void;
    onRestoreDefaults: () => void;
    workshopStatuses: WorkshopConnectionStatus[];
    carouselStatus: CarouselRuntimeStatus;
    statusLabel: string;
    currentIndex: number;
    totalWorkshops: number;
    currentWorkshopName: string;
    nextWorkshopName: string;
    rotateRemainingSec: number;
    cooldownRemainingSec: number;
    pauseRemainingSec: number | null;
    pauseForever: boolean;
    isPaused: boolean;
    selectedPauseChoice: PauseDurationChoice;
    onPauseChoiceChange: (choice: PauseDurationChoice) => void;
    onPauseCarousel: () => void;
    onResumeCarousel: () => void;
}) {
    const connectedCount = workshopStatuses.filter((item) => item.connected).length;
    const carouselControlsDisabled = !settings.carouselEnabled;
    const pauseCountdownLabel = formatPauseCountdown(pauseForever, pauseRemainingSec);

    React.useEffect(() => {
        if (!open) return undefined;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose, open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <button
                type="button"
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
                aria-label="关闭设置"
                onClick={onClose}
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="dashboard-settings-title"
                className="panel-frame relative z-10 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border bg-slate-950/92 shadow-[0_24px_80px_rgba(2,8,23,0.55)]"
            >
                <div className="flex items-center justify-between border-b border-sky-400/20 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Settings size={22} className="text-sky-300"/>
                        <h2 id="dashboard-settings-title" className="text-xl font-black tracking-[0.12em] text-sky-50">
                            大屏设置
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-sky-400/30 p-2 text-sky-100 transition-colors hover:border-sky-200 hover:bg-sky-500/10"
                        aria-label="关闭"
                    >
                        <X size={18}/>
                    </button>
                </div>

                <div className="overflow-y-auto px-6 py-5">
                    <section className="space-y-4">
                        <h3 className="text-sm font-black tracking-[0.18em] text-sky-200">车间轮播</h3>

                        <label
                            className="flex items-center justify-between gap-4 rounded-lg border border-sky-400/20 bg-slate-900/40 px-4 py-3">
                            <span className="font-semibold text-slate-100">启用车间轮播</span>
                            <input
                                type="checkbox"
                                checked={settings.carouselEnabled}
                                onChange={(event) => onSettingsChange({
                                    ...settings,
                                    carouselEnabled: event.target.checked
                                })}
                                className="h-5 w-5 accent-sky-400"
                            />
                        </label>

                        {!settings.carouselEnabled ? (
                            <p className="text-xs text-slate-400">已关闭车间轮播，下方轮播参数与暂停控制不可编辑。</p>
                        ) : null}

                        <div
                            className={cn(
                                'space-y-4',
                                carouselControlsDisabled && 'pointer-events-none opacity-45',
                            )}
                            aria-disabled={carouselControlsDisabled}
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label
                                    className="flex flex-col gap-2 rounded-lg border border-sky-400/20 bg-slate-900/40 px-4 py-3">
                                    <span className="text-sm font-semibold text-slate-200">每车间停留（秒）</span>
                                    <input
                                        type="number"
                                        min={5}
                                        max={300}
                                        disabled={carouselControlsDisabled}
                                        value={settings.rotateIntervalSec}
                                        onChange={(event) => onSettingsChange({
                                            ...settings,
                                            rotateIntervalSec: Number(event.target.value) || 10,
                                        })}
                                        className="rounded-md border border-sky-400/25 bg-slate-950/80 px-3 py-2 font-mono text-slate-100 disabled:cursor-not-allowed"
                                    />
                                </label>
                                <label
                                    className="flex flex-col gap-2 rounded-lg border border-sky-400/20 bg-slate-900/40 px-4 py-3">
                                    <span className="text-sm font-semibold text-slate-200">手动切换后冷却（秒）</span>
                                    <input
                                        type="number"
                                        min={30}
                                        max={600}
                                        disabled={carouselControlsDisabled}
                                        value={settings.manualCooldownSec}
                                        onChange={(event) => onSettingsChange({
                                            ...settings,
                                            manualCooldownSec: Number(event.target.value) || 180,
                                        })}
                                        className="rounded-md border border-sky-400/25 bg-slate-950/80 px-3 py-2 font-mono text-slate-100 disabled:cursor-not-allowed"
                                    />
                                    <span className="text-xs text-slate-400">默认 180 秒（3 分钟）</span>
                                </label>
                            </div>

                            <div
                                className="rounded-lg border border-sky-400/20 bg-slate-900/35 px-4 py-3 text-sm text-slate-200">
                                <div>当前：{currentIndex + 1}/{totalWorkshops} · {currentWorkshopName}</div>
                                <div className="mt-1">下一间：{nextWorkshopName}</div>
                                {settings.carouselEnabled ? (
                                    <div className="mt-1">切换倒计时：{rotateRemainingSec}s</div>
                                ) : null}
                                {cooldownRemainingSec > 0 ? (
                                    <div className="mt-1 text-amber-200">手动冷却剩余：{cooldownRemainingSec}s</div>
                                ) : null}
                                {isPaused && pauseCountdownLabel ? (
                                    <div
                                        className="mt-2 rounded-md border border-amber-400/30 bg-amber-500/10 px-3 py-2">
                                        <div
                                            className="text-xs font-semibold tracking-[0.12em] text-amber-200/90">暂停倒计时
                                        </div>
                                        <div className="mt-1 font-mono text-2xl font-black text-amber-100">
                                            {pauseCountdownLabel}
                                        </div>
                                    </div>
                                ) : null}
                                <div
                                    className={cn('mt-2 font-semibold', carouselStatus === 'rotating' ? 'text-emerald-300' : 'text-amber-300')}>
                                    状态：{statusLabel}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <label className="text-sm font-semibold text-slate-200">暂停时长</label>
                                <select
                                    disabled={carouselControlsDisabled}
                                    value={selectedPauseChoice === 'forever' ? 'forever' : String(selectedPauseChoice)}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        onPauseChoiceChange(value === 'forever' ? 'forever' : Number(value));
                                    }}
                                    className="rounded-md border border-sky-400/25 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 disabled:cursor-not-allowed"
                                >
                                    {PAUSE_DURATION_PRESETS.map((preset) => (
                                        <option key={preset.label} value={String(preset.value)}>
                                            {preset.label}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    disabled={carouselControlsDisabled || isPaused}
                                    onClick={onPauseCarousel}
                                    className="rounded-md border border-amber-400/40 bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-100 enabled:hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    暂停轮播
                                </button>
                                <button
                                    type="button"
                                    onClick={onResumeCarousel}
                                    disabled={carouselControlsDisabled || !isPaused}
                                    className="rounded-md border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-100 enabled:hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    继续轮播
                                </button>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-400">
                                「继续轮播」可主动取消暂停；若处于手动切换冷却，仍需等冷却结束后再自动轮播。
                            </p>
                        </div>
                    </section>

                    <section className="mt-8 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black tracking-[0.18em] text-sky-200">MQTT 连接状态</h3>
                            <span
                                className="text-sm font-semibold text-slate-300">{connectedCount}/{workshopStatuses.length} 已连接</span>
                        </div>
                        <div className="overflow-hidden rounded-lg border border-sky-400/20">
                            {workshopStatuses.map((workshop) => (
                                <div
                                    key={workshop.id}
                                    className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 border-b border-sky-400/10 bg-slate-900/30 px-4 py-3 last:border-b-0"
                                >
                                    <div className="flex items-center gap-2 font-semibold text-slate-100">
                                        <span
                                            className={cn(
                                                'h-2.5 w-2.5 rounded-full',
                                                workshop.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500',
                                            )}
                                        />
                                        {workshop.name}
                                    </div>
                                    <span className={workshop.connected ? 'text-emerald-300' : 'text-amber-300'}>
                                        {workshop.connected ? '已连接' : '连接中'}
                                    </span>
                                    <span className="font-mono text-xs text-slate-400">
                                        {workshop.lastUpdatedAt
                                            ? new Date(workshop.lastUpdatedAt).toLocaleTimeString()
                                            : '—'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-sky-400/20 px-6 py-4">
                    <button
                        type="button"
                        onClick={onRestoreDefaults}
                        className="rounded-md border border-slate-500/40 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-slate-800/60"
                    >
                        恢复默认
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-sky-400/40 bg-sky-500/15 px-5 py-2 text-sm font-bold text-sky-100 hover:bg-sky-500/25"
                    >
                        保存并关闭
                    </button>
                </div>
            </div>
        </div>
    );
}
