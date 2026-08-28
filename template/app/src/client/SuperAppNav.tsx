import {
  Bus,
  CalendarDays,
  Car,
  QrCode,
  ShieldCheck,
  Ticket as TicketIcon,
  UtensilsCrossed,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { useLocation } from "react-router";

export type ActiveRole =
  | "ATTENDEE"
  | "DRIVER"
  | "TRANSIT_DRIVER"
  | "GATE_STAFF"
  | "RUNNER"
  | "EVENT_MANAGER";

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
  onToggleOffline,
}: SuperAppNavProps) {
  const location = useLocation();

  const navItems = [
    {
      name: "Eventos OchoyMedio",
      path: "#events",
      icon: CalendarDays,
      roleAccess: ["EVENT_MANAGER"],
    },
    {
      name: "Buses Interprovinciales",
      path: routes.BusRoutesRoute.to,
      icon: Bus,
      roleAccess: ["ATTENDEE", "TRANSIT_DRIVER"],
    },
    {
      name: "Entradas & QR",
      path: "/tickets",
      icon: TicketIcon,
      roleAccess: ["ATTENDEE", "GATE_STAFF"],
    },
    {
      name: "Parqueadero LPR",
      path: "/parking",
      icon: Car,
      roleAccess: ["ATTENDEE", "DRIVER"],
    },
    {
      name: "Buses & Rutas",
      path: "/transit",
      icon: Bus,
      roleAccess: ["ATTENDEE", "TRANSIT_DRIVER"],
    },
    {
      name: "Comida al Asiento",
      path: "/concessions",
      icon: UtensilsCrossed,
      roleAccess: ["ATTENDEE", "RUNNER"],
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/85 font-sans text-slate-100 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-18 flex items-center justify-between py-2">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-500/30 bg-gradient-to-br from-[#0A2540] via-[#0EA5E9] to-[#14B8A6] shadow-lg shadow-sky-500/20">
              <QrCode className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="font-['Satoshi',sans-serif] text-lg font-extrabold tracking-tight text-white">
                  Tikets<span className="text-[#0EA5E9]">Linkear</span>
                </span>
                <span className="inline-flex items-center rounded-full border border-teal-500/20 bg-teal-500/10 px-2 py-0.5 text-[10px] font-bold text-teal-400">
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  Resilient
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400">
                Mobility & Access Suite
              </p>
            </div>
          </div>

          {/* Module Navigation Links */}
          <nav className="hidden items-center space-x-1.5 rounded-2xl border border-slate-800 bg-slate-900/60 p-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <WaspRouterLink
                  key={item.path}
                  to={item.path as never}
                  onClick={(event) => {
                    if (item.path === "#events") {
                      event.preventDefault();
                      onRoleChange("EVENT_MANAGER");
                    }
                  }}
                  className={`flex items-center space-x-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "border border-sky-500/30 bg-[#0A2540] text-sky-400 shadow-inner"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </WaspRouterLink>
              );
            })}
          </nav>

          {/* Controls: Persona Switcher & Offline Simulator */}
          <div className="flex items-center space-x-3">
            {/* Offline Simulation Toggle */}
            <button
              type="button"
              onClick={onToggleOffline}
              className={`flex items-center space-x-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all active:scale-95 ${
                isOffline
                  ? "animate-pulse border-amber-500/40 bg-amber-500/20 text-amber-300"
                  : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600"
              }`}
              title="Simular pérdida total de conexión (Modo Avión)"
            >
              {isOffline ? (
                <WifiOff className="h-3.5 w-3.5 text-amber-400" />
              ) : (
                <Wifi className="h-3.5 w-3.5 text-teal-400" />
              )}
              <span>{isOffline ? "Modo Offline" : "En Línea"}</span>
            </button>

            {/* Persona/Role Selector */}
            <div className="relative flex items-center">
              <select
                value={activeRole}
                onChange={(e) => onRoleChange(e.target.value as ActiveRole)}
                className="cursor-pointer rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-200 shadow-sm focus:border-teal-500 focus:outline-none"
              >
                <option value="ATTENDEE">🎟️ Asistente / Pasajero</option>
                <option value="DRIVER">🚗 Conductor (Parqueadero)</option>
                <option value="TRANSIT_DRIVER">
                  🚌 Chofer de Bus (Cédula)
                </option>
                <option value="GATE_STAFF">📱 Operador de Molinete</option>
                <option value="RUNNER">🏃 Runner de Graderías</option>
                <option value="EVENT_MANAGER">🎬 Gestión de eventos</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
