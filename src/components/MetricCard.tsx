import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  colorScheme: 'blue' | 'emerald' | 'amber' | 'indigo' | 'slate';
  isLoading?: boolean;
}

const colorPresets = {
  blue: {
    bg: 'bg-blue-50/70',
    icon: 'text-blue-600',
    border: 'border-blue-100',
    gradient: 'from-blue-500/5 to-transparent',
  },
  emerald: {
    bg: 'bg-emerald-50/70',
    icon: 'text-emerald-600',
    border: 'border-emerald-100',
    gradient: 'from-emerald-500/5 to-transparent',
  },
  amber: {
    bg: 'bg-amber-50/70',
    icon: 'text-amber-600',
    border: 'border-amber-100',
    gradient: 'from-amber-500/5 to-transparent',
  },
  indigo: {
    bg: 'bg-indigo-50/70',
    icon: 'text-indigo-600',
    border: 'border-indigo-100',
    gradient: 'from-indigo-500/5 to-transparent',
  },
  slate: {
    bg: 'bg-slate-50/70',
    icon: 'text-slate-600',
    border: 'border-slate-100',
    gradient: 'from-slate-500/5 to-transparent',
  },
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'blue',
  isLoading = false,
}: MetricCardProps) {
  const scheme = colorPresets[colorScheme];

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">
        <div className="relative flex items-start justify-between">
          <div className="space-y-2 w-2/3">
            <div className="h-3.5 w-1/2 rounded bg-slate-200" />
            <div className="h-7 w-2/3 rounded bg-slate-200 mt-1" />
          </div>
          <div className="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200" />
        </div>
        
        <div className="relative mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5">
          <div className="h-3 w-1/3 rounded bg-slate-100" />
          <div className="h-3 w-1/4 rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <div className={`kpi-card relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-slate-300`}>
      {/* Decorative gradient corner */}
      <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${scheme.gradient} blur-xl`} />

      <div className="relative flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {title}
          </span>
          <h3 className="font-sans text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>
        
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${scheme.bg} ${scheme.border} border shadow-inner`}>
          <Icon className={`h-4.5 w-4.5 ${scheme.icon}`} />
        </div>
      </div>

      {(trend || subtitle) && (
        <div className="relative mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5">
          {trend ? (
            <div className="flex items-center gap-1.5">
              <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                trend.isPositive 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'bg-rose-50 text-rose-700'
              }`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              {trend.label && (
                <span className="text-[10px] font-semibold text-slate-400">
                  {trend.label}
                </span>
              )}
            </div>
          ) : <div />}

          {subtitle && (
            <span className="text-[10px] font-semibold text-slate-500 max-w-[180px] truncate" title={subtitle}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
