import React from "react";

export type BadgeStatus = 
  | "ACTIVE" 
  | "OFFLINE" 
  | "VALIDATING" 
  | "BOARDED" 
  | "IN_TRANSIT" 
  | "COMPLETED" 
  | "DELIVERED" 
  | "QUEUED" 
  | "ALERT";

interface StatusBadgeProps {
  status: BadgeStatus | string;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className = "" }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  const config: Record<string, { bg: string; text: string; border: string; dot: string; defaultLabel: string }> = {
    ACTIVE: {
      bg: "bg-teal-500/10",
      text: "text-teal-400",
      border: "border-teal-500/30",
      dot: "bg-teal-400",
      defaultLabel: "Activo / Seguro",
    },
    OFFLINE: {
      bg: "bg-amber-500/10",
      text: "text-amber-300",
      border: "border-amber-500/30",
      dot: "bg-amber-400",
      defaultLabel: "100% Offline",
    },
    VALIDATING: {
      bg: "bg-sky-500/10",
      text: "text-sky-300",
      border: "border-sky-500/30",
      dot: "bg-sky-400 animate-ping",
      defaultLabel: "Validando...",
    },
    BOARDED: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-300",
      border: "border-emerald-500/30",
      dot: "bg-emerald-400",
      defaultLabel: "Embarcado",
    },
    IN_TRANSIT: {
      bg: "bg-indigo-500/10",
      text: "text-indigo-300",
      border: "border-indigo-500/30",
      dot: "bg-indigo-400 animate-pulse",
      defaultLabel: "En Tránsito GPS",
    },
    COMPLETED: {
      bg: "bg-slate-800",
      text: "text-slate-300",
      border: "border-slate-700",
      dot: "bg-slate-400",
      defaultLabel: "Completado",
    },
    DELIVERED: {
      bg: "bg-teal-500/10",
      text: "text-teal-300",
      border: "border-teal-500/30",
      dot: "bg-teal-400",
      defaultLabel: "Entregado en Asiento",
    },
    QUEUED: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/30",
      dot: "bg-amber-400",
      defaultLabel: "En Cola Offline",
    },
    ALERT: {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/30",
      dot: "bg-rose-400 animate-ping",
      defaultLabel: "Alerta de Seguridad",
    },
  };

  const current = config[normalized] || {
    bg: "bg-slate-800",
    text: "text-slate-300",
    border: "border-slate-700",
    dot: "bg-slate-400",
    defaultLabel: status,
  };

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.bg} ${current.text} ${current.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      <span>{label || current.defaultLabel}</span>
    </span>
  );
}
