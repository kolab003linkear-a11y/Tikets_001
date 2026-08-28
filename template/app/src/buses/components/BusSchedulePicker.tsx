import {
  Bus,
  Calendar,
  ChevronLeft,
  Clock,
  MapPin,
  ShieldCheck,
  Ticket as TicketIcon,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { useNavigate, useParams } from "react-router";
import { KpiCard } from "../../client/components/ui/KpiCard";
import { StatusBadge } from "../../client/components/ui/StatusBadge";
import { getSchedulesByRoute, mockRoutes } from "../operations";

export interface BusSchedule {
  id: string;
  routeId: string;
  departureTime: Date;
  arrivalTime: Date | null;
  busUnitNumber: string;
  driverName: string | null;
  basePrice: number;
  totalSeats: number;
  isActive: boolean;
  availableSeats?: number;
}

export function BusSchedulePicker() {
  const { routeSlug } = useParams<{ routeSlug: string }>();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const route = mockRoutes.find((r) => r.slug === routeSlug);
  const [rawSchedules, setRawSchedules] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    if (route) {
      getSchedulesByRoute({ routeSlug: route.slug }, {}).then((result: any[]) => {
        if (!cancelled) setRawSchedules(result);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [route, routeSlug]);

  const schedules = rawSchedules.filter((s: any) => {
    const depDate = new Date(s.departureTime).toISOString().split("T")[0];
    return depDate === selectedDate;
  });

  const handleDateChange = (daysOffset: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + daysOffset);
    setSelectedDate(newDate.toISOString().split("T")[0]);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("es-EC", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!route) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400">
        Ruta no encontrada.{" "}
        <button
          onClick={() => navigate(routes.BusRoutesRoute.to)}
          className="text-teal-400 hover:underline"
        >
          Volver a rutas
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="rounded-3xl border border-sky-500/30 bg-gradient-to-r from-[#0A2540] via-slate-900 to-slate-950 p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center space-x-4">
            <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-3.5 text-[#0EA5E9] shadow-inner">
              <Bus className="h-8 w-8 text-[#0EA5E9]" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="font-['Satoshi',sans-serif] text-xl font-bold tracking-tight text-white">
                  {route.origin} → {route.destination}
                </h2>
                <StatusBadge status="ACTIVE" label="Servicio Activo" />
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Duración estimada: {route.durationHours.toFixed(1)} horas •
                Selecciona tu horario y asiento
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Date Selector */}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <Calendar className="h-5 w-5 text-slate-400" />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="flex-1 border-none bg-transparent text-sm font-bold text-white outline-none"
        />
        <div className="flex gap-1">
          <button
            onClick={() => handleDateChange(-1)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:bg-slate-700"
          >
            -1d
          </button>
          <button
            onClick={() => handleDateChange(1)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:bg-slate-700"
          >
            +1d
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          title="Horarios para"
          value={schedules.length}
          subtitle={new Date(selectedDate).toLocaleDateString("es-EC")}
          icon={Clock}
          variant="primary"
          badge="Disponible"
        />
        <KpiCard
          title="Precio Base"
          value="$25.00"
          subtitle="Clase Económica"
          icon={TicketIcon}
          variant="accent"
          badge="USD"
        />
        <KpiCard
          title="Asientos"
          value="40"
          subtitle="Por unidad estándar"
          icon={Users}
          variant="secondary"
          badge="Reservado"
        />
      </div>

      {/* Schedules Grid */}
      <div className="space-y-4">
        <h3 className="font-['Satoshi',sans-serif] text-xs font-bold uppercase tracking-wider text-slate-400">
          Horarios Disponibles ({schedules.length})
        </h3>

        {schedules.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-center text-sm text-slate-400">
            No hay buses programados para esta fecha.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {schedules.map((schedule: any) => (
              <WaspRouterLink
                key={schedule.id}
                to={routes.BusSeatMapRoute.build({
                  params: { scheduleId: schedule.id },
                }) as never}
                className="group block rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-md transition-all duration-200 hover:border-sky-500/30 hover:bg-slate-900 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-xl border border-teal-500/20 bg-teal-500/10 p-2.5 text-teal-400">
                      <Bus className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-mono text-sm font-bold text-white">
                        {formatTime(schedule.departureTime)}
                      </span>
                      <p className="text-xs text-slate-500">
                        {new Date(schedule.departureTime).toLocaleDateString("es-EC", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="rounded-lg border border-slate-800 bg-[#0A2540] px-2.5 py-1 font-mono text-xs font-bold text-[#0EA5E9]">
                      ${Number(schedule.basePrice).toFixed(2)}
                    </span>
                    <div className="mt-1 flex items-center gap-1 rounded-lg border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-xs text-sky-400">
                      <ShieldCheck className="h-3 w-3" />
                      <span>
                        Quedan {schedule.availableSeats ?? schedule.totalSeats}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3 text-xs text-slate-400">
                  <span>Unidad: {schedule.busUnitNumber}</span>
                  <span>Chofer: {schedule.driverName || "Por asignar"}</span>
                </div>

                <div className="mt-2 text-xs font-bold text-teal-400 group-hover:text-teal-300">
                  Seleccionar asiento →
                </div>
              </WaspRouterLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
