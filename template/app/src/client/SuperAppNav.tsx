import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Ticket as TicketIcon, 
  Car, 
  Bus, 
  UtensilsCrossed, 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  UserCheck, 
  QrCode,
  Sparkles,
  Camera,
  Footprints
} from "lucide-react";
import { StatusBadge } from "./components/ui/StatusBadge";

export type ActiveRole = "ATTENDEE" | "DRIVER" | "TRANSIT_DRIVER" | "GATE_STAFF" | "RUNNER";

interface SuperAppNavProps {
  activeRole: ActiveRole;
  onRoleChange: (role: ActiveRole) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
}

export function SuperAppNav({
  activeRole,
  onRoleChange,
  isOffline,
  onToggleOffline
}: SuperAppNavProps) {
  const location = useLocation();

  const navItems = [
    { name: "Entradas & QR", path: "/tickets", icon: TicketIcon, roleAccess: ["ATTENDEE", "GATE_STAFF"] },
    { name: "Parqueadero LPR", path: "/parking", icon: Car, roleAccess: ["ATTENDEE", "DRIVER"] },
    { name: "Buses & Rutas", path: "/transit", icon: Bus, roleAccess: ["ATTENDEE", "TRANSIT_DRIVER"] },
    { name: "Comida al Asiento", path: "/concessions", icon: UtensilsCrossed, roleAccess: ["ATTENDEE", "RUNNER"] },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/85 border-b border-slate-800 text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#0A2540] via-[#0EA5E9] to-[#14B8A6] flex items-center justify-center shadow-lg shadow-sky-500/20 border border-sky-500/30">
              <QrCode className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="font-extrabold text-lg tracking-tight text-white font-['Satoshi',sans-serif]">
                  Ticket<span className="text-[#0EA5E9]">Safe</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Resilient
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Mobility & Access Suite</p>
            </div>
          </div>

          {/* Module Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-slate-900/60 p-1 rounded-2xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-[#0A2540] text-sky-400 border border-sky-500/30 shadow-inner"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Controls: Persona Switcher & Offline Simulator */}
          <div className="flex items-center space-x-3">
            {/* Offline Simulation Toggle */}
            <button
              type="button"
              onClick={onToggleOffline}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                isOffline
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse"
                  : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600"
              }`}
              title="Simular pérdida total de conexión (Modo Avión)"
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-teal-400" />}
              <span>{isOffline ? "Modo Offline" : "En Línea"}</span>
            </button>

            {/* Persona/Role Selector */}
            <div className="relative flex items-center">
              <select
                value={activeRole}
                onChange={(e) => onRoleChange(e.target.value as ActiveRole)}
                className="bg-slate-900 text-xs font-bold text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-teal-500 cursor-pointer shadow-sm"
              >
                <option value="ATTENDEE">🎟️ Asistente / Pasajero</option>
                <option value="DRIVER">🚗 Conductor (Parqueadero)</option>
                <option value="TRANSIT_DRIVER">🚌 Chofer de Bus (Cédula)</option>
                <option value="GATE_STAFF">📱 Operador de Molinete</option>
                <option value="RUNNER">🏃 Runner de Graderías</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
