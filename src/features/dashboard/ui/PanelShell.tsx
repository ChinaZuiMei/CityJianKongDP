import React from 'react';
import { cn } from '../../../utils/cn';

type PanelShellProps = React.PropsWithChildren<{
  title: string;
  subtitle?: string;
  accent?: 'sky' | 'cyan';
  className?: string;
  bodyClassName?: string;
}>;

export const PanelShell = ({
  title,
  subtitle,
  accent = 'sky',
  className,
  bodyClassName,
  children,
}: PanelShellProps) => {
  const accentClass = accent === 'cyan' ? 'panel-shell-cyan' : 'panel-shell-sky';
  const titleClass = accent === 'cyan' ? 'panel-shell__title-cyan' : 'panel-shell__title-sky';

  return (
    <section className={cn('panel-shell panel-shell__frame', accentClass, className)}>
      <div className="panel-shell__header">
        <div className={cn('panel-shell__title', titleClass)}>{title}</div>
        {subtitle ? <div className="panel-shell__subtitle">{subtitle}</div> : null}
      </div>
      <div className={cn('panel-shell__body', bodyClassName)}>{children}</div>
    </section>
  );
};
