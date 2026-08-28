import {
  Bus,
  Clock,
  MapPin,
  Search,
  ShieldCheck,
  Ticket as TicketIcon,
} from "lucide-react";
import { useState } from "react";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { KpiCard } from "../../client/components/ui/KpiCard";
import { StatusBadge } from "../../client/components/ui/StatusBadge";
import { mockRoutes } from "../operations";

export function BusRoutesList() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRoutes = mockRoutes.filter(
    (r) =>
      r.isActive &&
      (r.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.slug.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const activeRoutes = mockRoutes.filter((r) => r.isActive).length;
  const totalRoutes = mockRoutes.length;

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-500/30 bg-gradient-to-r from-[#0A2540] via-slate-900 to-slate-950 p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center space-x-4">
            <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-3.5 text-[#0EA5E9] shadow-inner">
              <Bus className="h-8 w-8 text-[#0EA5E9]" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="font-['Satoshi',sans-serif] text-xl font-bold tracking-tight text-white">
                  Buses Interprovinciales TicketSafe
                </h2>
                <StatusBadge status="ACTIVE" label="Red Nacional Activa" />
              </div>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-300">
                Viaja entre provincias con boletos digitales seguros, asientos
                reservados y tracking en vivo. Todo desde una sola app.
              </p>
            </div>
          </div>

          <span className="rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1.5 font-mono text-xs font-bold text-teal-400">
            <ShieldCheck className="mr-1.5 inline h-3.5 w-3.5" />
            Sin Papel • 100% Digital
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          title="Rutas Disponibles"
          value={activeRoutes}
          subtitle="Interprovinciales activas"
          icon={MapPin}
          variant="primary"
          badge="Nacional"
        />
        <KpiCard
          title="Tiempo Estimado"
          value="8-12h"
          subtitle="Rutas principales"
          icon={Clock}
          variant="accent"
          badge="Directo"
        />
        <KpiCard
          title="Asientos Seguros"
          value="40"
          subtitle="Por unidad estándar"
          icon={TicketIcon}
          variant="secondary"
          badge="Reservado"
        />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar origen, destino o ruta (ej: Quito - Guayaquil)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3.5 pr-4 pl-11 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
        />
      </div>

      {/* Routes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-['Satoshi',sans-serif] text-xs font-bold uppercase tracking-wider text-slate-400">
            Rutas Disponibles ({filteredRoutes.length})
          </h3>
          {totalRoutes > activeRoutes && (
            <span className="text-xs text-slate-500">
              {totalRoutes - activeRoutes} ruta(s) inactivas ocultas
            </span>
          )}
        </div>

        {filteredRoutes.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-sm text-slate-400">
            No se encontraron rutas para "{searchQuery}". Intenta con otro origen/destino.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRoutes.map((route) => (
              <WaspRouterLink
                key={route.id}
                to={routes.BusScheduleRoute.build({
                  params: { routeSlug: route.slug },
                }) as never}
                className="group block rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-md transition-all duration-200 hover:border-sky-500/30 hover:bg-slate-900 hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-sky-400" />
                      <span className="font-mono text-xs font-bold text-sky-400">
                        {route.slug.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-['Satoshi',sans-serif] text-base font-bold text-white">
                      {route.origin}
                    </h4>
                    <p className="text-xs text-slate-400">
                      → {route.destination}
                    </p>
                  </div>

                  <div className="flex flex-col items-end space-y-1">
                    <span className="rounded-lg border border-slate-800 bg-[#0A2540] px-2.5 py-1 font-mono text-xs font-bold text-[#0EA5E9]">
                      {route.durationHours.toFixed(1)}h
                    </span>
                    <StatusBadge status="ACTIVE" label="Disponible" />
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-800 pt-3 text-xs text-slate-400">
                  <span className="font-bold text-teal-400 group-hover:text-teal-300">
                    Ver horarios y reservar asiento →
                  </span>
                </div>
              </WaspRouterLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
