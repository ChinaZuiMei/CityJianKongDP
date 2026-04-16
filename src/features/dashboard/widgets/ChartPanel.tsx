import React, { Suspense } from 'react';
import type { EChartsOption } from 'echarts';
import { PanelShell } from '../ui/PanelShell';

const ReactECharts = React.lazy(() => import('echarts-for-react'));

export const ChartPanel = ({
  title,
  subtitle,
  option,
  accent = 'sky',
  className,
}: {
  title: string;
  subtitle?: string;
  option: EChartsOption;
  accent?: 'sky' | 'cyan';
  className?: string;
}) => {
  return (
    <PanelShell title={title} subtitle={subtitle} accent={accent} className={className}>
      <Suspense fallback={<div className="h-full min-h-[140px] rounded-lg border border-sky-300/10 bg-slate-950/16" />}>
        <ReactECharts option={option} notMerge lazyUpdate style={{ width: '100%', height: '100%' }} />
      </Suspense>
    </PanelShell>
  );
};
