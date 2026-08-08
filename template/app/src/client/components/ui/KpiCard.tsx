import React from "react";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "primary" | "secondary" | "accent" | "alert" | "warning";
  badge?: string;
  className?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "primary",
  badge,
  className = "",
}: KpiCardProps) {
  const variantStyles = {
    primary: "border-slate-800 bg-slate-900/90 text-white shadow-slate-950/50",
    secondary: "border-sky-500/30 bg-sky-950/20 text-white shadow-sky-950/30",
    accent: "border-teal-500/30 bg-teal-950/20 text-white shadow-teal-950/30",
    alert: "border-rose-500/30 bg-rose-950/20 text-white shadow-rose-950/30",
    warning: "border-amber-500/30 bg-amber-950/20 text-white shadow-amber-950/30",
  };

  const iconStyles = {
    primary: "bg-[#0A2540] text-sky-400 border border-sky-500/20",
    secondary: "bg-sky-500/10 text-sky-400 border border-sky-500/30",
    accent: "bg-[#14B8A6]/10 text-teal-400 border border-teal-500/30",
    alert: "bg-[#F43F5E]/10 text-rose-400 border border-rose-500/30",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:border-slate-700 hover:shadow-xl ${variantStyles[variant]} ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyles[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-extrabold tracking-tight text-white font-['Satoshi',sans-serif]">
          {value}
        </div>
        {badge && (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-400 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
}
