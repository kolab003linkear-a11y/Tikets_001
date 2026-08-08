import React, { useState } from "react";
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
  Sparkles
} from "lucide-react";

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
    { name: "Tickets & QRs", path: "/tickets", icon: TicketIcon, roleAccess: ["ATTENDEE", "GATE_STAFF"] },
    { name: "LPR Parking", path: "/parking", icon: Car, roleAccess: ["ATTENDEE", "DRIVER"] },
    { name: "Transit & Buses", path: "/transit", icon: Bus, roleAccess: ["ATTENDEE", "TRANSIT_DRIVER"] },
    { name: "In-Seat Concessions", path: "/concessions", icon: UtensilsCrossed, roleAccess: ["ATTENDEE", "RUNNER"] },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <QrCode className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  SuperApp
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Resilient
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Ticketing • LPR Parking • Intercity Transit</p>
            </div>
          </div>

          {/* Module Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-inner"
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
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isOffline
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse"
                  : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600"
              }`}
              title="Simulate 100% Offline Connectivity Loss"
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isOffline ? "Offline Mode" : "Online"}</span>
            </button>

            {/* Persona/Role Selector */}
            <div className="relative flex items-center">
              <select
                value={activeRole}
                onChange={(e) => onRoleChange(e.target.value as ActiveRole)}
                className="bg-slate-900/90 text-xs font-semibold text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="ATTENDEE">🎟️ Attendee / Passenger</option>
                <option value="DRIVER">🚗 Urban Driver</option>
                <option value="TRANSIT_DRIVER">🚌 Bus Driver (Terminal)</option>
                <option value="GATE_STAFF">📱 Gate Staff Scanner</option>
                <option value="RUNNER">🏃 Concession Runner</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
