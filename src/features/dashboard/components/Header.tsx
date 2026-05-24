import React from 'react';
import {Clock, ChevronDown, AlertTriangle, Settings} from 'lucide-react';
import {cn} from '../../../utils/cn';

export const Header = ({
                           currentTime,
                           alarmCount,
                           onAlarmClick,
                           workshops,
                           selectedWorkshop,
                           onWorkshopChange,
                           onOpenSettings,
                           carouselHint,
                       }: {
    alarmCount: number,
    currentTime: Date,
    onAlarmClick: () => void,
    workshops: Array<{ id: string; name: string; enabled: boolean }>,
    selectedWorkshop: string,
    onWorkshopChange: (workshopId: string) => void,
    onOpenSettings: () => void,
    carouselHint?: string | null,
}) => {
    const [isWorkshopOpen, setIsWorkshopOpen] = React.useState(false);
    const workshopMenuRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        const handlePointerDown = (event: MouseEvent) => {
            if (!workshopMenuRef.current?.contains(event.target as Node)) {
                setIsWorkshopOpen(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, []);

    return (
        <div
            className="panel-frame fixed inset-x-0 top-0 z-50 box-border min-h-[56px] bg-transparent px-0 py-2 font-mono text-slate-100">
            <div
                className="absolute left-5 top-1/2 flex -translate-y-1/2 items-center gap-4 text-[17px] font-semibold tracking-[0.04em]">
                <div className="flex items-center gap-2.5">
                    <Clock size={20} className="text-sky-300"/>
                    {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
                </div>
                <button
                    type="button"
                    onClick={onOpenSettings}
                    className="panel-frame data-glow flex items-center gap-2 rounded-md border bg-transparent px-4 py-1.5 text-[17px] font-bold transition-colors hover:border-sky-300/50"
                >
                    <Settings size={18} className="text-sky-300"/>
                    设置
                    {carouselHint ? (
                        <span className={cn(
                            'text-sm font-semibold',
                            carouselHint.startsWith('已暂停') ? 'text-amber-300' : 'text-emerald-300',
                        )}>
                            {carouselHint}
                        </span>
                    ) : null}
                </button>
            </div>
            <div ref={workshopMenuRef} className="absolute right-5 top-1/2 flex -translate-y-1/2 items-center gap-4">
                <button
                    onClick={onAlarmClick}
                    className={cn("flex cursor-pointer items-center gap-2 text-[17px] font-semibold tracking-[0.04em] transition-opacity hover:opacity-80", alarmCount > 0 ? "text-red-300" : "text-emerald-300")}
                >
                    <AlertTriangle size={18} className={alarmCount > 0 ? "animate-pulse" : ""}/>
                    {alarmCount > 0 ? `${alarmCount} 个报警` : '系统正常'}
                </button>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsWorkshopOpen((open) => !open)}
                        className="panel-frame data-glow flex items-center gap-3 rounded-md border bg-transparent px-4 py-1.5 text-[17px] font-bold transition-colors hover:border-sky-300/50"
                    >
                        <span className="panel-title-glow text-sm font-black tracking-[0.18em]">车间</span>
                        <span>{workshops.find((workshop) => workshop.id === selectedWorkshop)?.name ?? ''}</span>
                        <ChevronDown size={18}
                                     className={cn("transition-transform", isWorkshopOpen ? "rotate-180" : "")}/>
                    </button>
                    {isWorkshopOpen ? (
                        <div
                            className="panel-frame absolute right-0 top-full mt-2 w-48 rounded-lg border bg-slate-950/85 p-2 shadow-[0_12px_36px_rgba(2,8,23,0.45)] backdrop-blur-md">
                            {workshops.filter((workshop) => workshop.enabled).map((workshop) => (
                                <button
                                    key={workshop.id}
                                    type="button"
                                    onClick={() => {
                                        onWorkshopChange(workshop.id);
                                        setIsWorkshopOpen(false);
                                    }}
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-bold transition-colors",
                                        workshop.id === selectedWorkshop
                                            ? "bg-sky-500/20 text-sky-100"
                                            : "text-slate-100 hover:bg-sky-500/10 hover:text-sky-100",
                                    )}
                                >
                                    <span>{workshop.name}</span>
                                    {workshop.id === selectedWorkshop ?
                                        <span className="text-xs text-sky-200">当前</span> : null}
                                </button>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};
