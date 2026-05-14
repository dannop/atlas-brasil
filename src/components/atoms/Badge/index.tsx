import classNames from 'classnames';
import type { ReactNode } from 'react';

interface IProps {
    children: ReactNode;
    variant?: 'default' | 'brand' | 'muted';
    className?: string;
}

const variantMap = {
    default: 'bg-surface-elevated text-slate-200 border-slate-700',
    brand: 'bg-brand-900/40 text-brand-200 border-brand-700/60',
    muted: 'bg-slate-800/60 text-slate-400 border-slate-700/60',
};

const Badge = ({ children, variant = 'default', className }: IProps) => (
    <span
        className={classNames(
            'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
            variantMap[variant],
            className,
        )}
    >
        {children}
    </span>
);

export default Badge;
