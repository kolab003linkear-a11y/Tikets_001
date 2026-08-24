import { type AuthUser } from "wasp/auth";
import {
  getAdminGlobalSummaryStats,
  getDailyStats,
  useQuery,
} from "wasp/client/operations";
import {
  DollarSign,
  Users,
  Ticket,
  Car,
  Bus,
  UtensilsCrossed,
  Shield,
  CheckCircle2,
  Radio,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../../client/utils";
import { DefaultLayout } from "../../layout/DefaultLayout";
import { RevenueAndProfitChart } from "./RevenueAndProfitChart";
import { SourcesTable } from "./SourcesTable";
import { TotalPageViewsCard } from "./TotalPageViewsCard";
import { TotalPayingUsersCard } from "./TotalPayingUsersCard";
import { TotalRevenueCard } from "./TotalRevenueCard";
import { TotalSignupsCard } from "./TotalSignupsCard";

export function AnalyticsDashboardPage({ user }: { user: AuthUser }) {
  const { data: stats, isLoading, error } = useQuery(getDailyStats);
  const { data: globalStats, isLoading: isGlobalLoading } = useQuery(
    getAdminGlobalSummaryStats,
  );

  const g = globalStats || {
    usersCount: 0,
    rolesCount: {
      USER: 0,
      GATE_STAFF: 0,
      BUS_DRIVER: 0,
      CONCESSION_RUNNER: 0,
      ADMIN: 0,
    },
    tickets: { totalTickets: 0, activeTickets: 0, usedTickets: 0 },
    parking: {
      totalBays: 0,
      activeVehicles: 0,
      parkingRevenue: 0,
      occupiedPercentage: 0,
    },
    transit: { totalTrips: 0, inTransitBuses: 0 },
    concessions: {
      totalConcessionOrders: 0,
      pendingConcessionOrders: 0,
      concessionRevenue: 0,
    },
    totalGlobalRevenue: 0,
  };

  if (error) {
    return (
      <DefaultLayout user={user}>
        <div className="flex h-full items-center justify-center">
          <div className="bg-card rounded-lg p-8 shadow-lg">
            <p className="text-2xl font-bold text-red-500">Error</p>
            <p className="text-muted-foreground mt-2 text-sm">
              {error.message || "Something went wrong while fetching stats."}
            </p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout user={user}>
      <div className="space-y-6">
        {/* Banner Principal de la Super-App */}
        <div className="rounded-lg border border-teal-500/20 bg-slate-900/90 p-6 shadow-md border-l-4 border-l-teal-500">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-teal-500/10 px-2.5 py-0.5 text-xs font-semibold text-teal-400 border border-teal-500/20">
                  Panel de Administración General
                </span>
                <span className="text-xs text-muted-foreground">
                  Super-App de Ticketing & Logística
                </span>
              </div>
              <h1 className="mt-2 text-xl font-bold text-white">
                Resumen Ejecutivo Unificado
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Monitoreo consolidado en tiempo real de entradas criptográficas, parqueaderos LPR, buses interprovinciales y concesiones en estadios.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                  Ingresos Consolidados Total
                </span>
                <span className="text-xl font-black text-teal-400">
                  ${g.totalGlobalRevenue.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjetas KPI Consolidadas de la Super-App */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {/* 1. Usuarios & Roles */}
          <Link
            to="/admin/users"
            className="group rounded-sm border border-border bg-card p-5 shadow-sm hover:border-teal-500/50 transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Usuarios & Roles
              </span>
              <Users className="h-4 w-4 text-teal-500 group-hover:scale-110 transition" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {g.usersCount}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="text-[10px] bg-slate-800 text-teal-300 px-1.5 py-0.5 rounded font-mono">
                {g.rolesCount.GATE_STAFF} Puerta
              </span>
              <span className="text-[10px] bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
                {g.rolesCount.BUS_DRIVER} Choferes
              </span>
              <span className="text-[10px] bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                {g.rolesCount.CONCESSION_RUNNER} Runners
              </span>
            </div>
          </Link>

          {/* 2. Tickets & Eventos */}
          <Link
            to="/admin/events"
            className="group rounded-sm border border-border bg-card p-5 shadow-sm hover:border-teal-500/50 transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Ticketing & Accesos
              </span>
              <Ticket className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {g.tickets.totalTickets}
            </p>
            <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
              <span>{g.tickets.activeTickets} Activos</span>
              <span className="text-emerald-400 font-medium">
                {g.tickets.usedTickets} Validados
              </span>
            </div>
          </Link>

          {/* 3. Parqueaderos LPR */}
          <Link
            to="/admin/parking"
            className="group rounded-sm border border-border bg-card p-5 shadow-sm hover:border-blue-500/50 transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Parqueaderos LPR
              </span>
              <Car className="h-4 w-4 text-blue-500 group-hover:scale-110 transition" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {g.parking.occupiedPercentage}%
            </p>
            <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
              <span>{g.parking.activeVehicles} / {g.parking.totalBays} plazas</span>
              <span className="text-purple-400 font-semibold">${g.parking.parkingRevenue.toFixed(2)}</span>
            </div>
          </Link>

          {/* 4. Transporte Interprovincial */}
          <Link
            to="/admin/transit"
            className="group rounded-sm border border-border bg-card p-5 shadow-sm hover:border-indigo-500/50 transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Flota Buses
              </span>
              <Bus className="h-4 w-4 text-indigo-500 group-hover:scale-110 transition" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {g.transit.inTransitBuses}
            </p>
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
              <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span>En carretera activos</span>
            </div>
          </Link>

          {/* 5. Concesiones en Estadios */}
          <Link
            to="/admin/concessions"
            className="group rounded-sm border border-border bg-card p-5 shadow-sm hover:border-amber-500/50 transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Concesiones
              </span>
              <UtensilsCrossed className="h-4 w-4 text-amber-500 group-hover:scale-110 transition" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {g.concessions.pendingConcessionOrders}
            </p>
            <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
              <span>En preparación</span>
              <span className="text-amber-400 font-semibold">${g.concessions.concessionRevenue.toFixed(2)}</span>
            </div>
          </Link>
        </div>

        {/* Sección OpenSaaS Base Analytics */}
        <div className="relative pt-4">
          <div
            className={cn({
              "opacity-25": !stats,
            })}
          >
            <div className="2xl:gap-7.5 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
              <TotalPageViewsCard
                totalPageViews={stats?.dailyStats.totalViews}
                prevDayViewsChangePercent={
                  stats?.dailyStats.prevDayViewsChangePercent
                }
              />
              <TotalRevenueCard
                dailyStats={stats?.dailyStats}
                weeklyStats={stats?.weeklyStats}
                isLoading={isLoading}
              />
              <TotalPayingUsersCard
                dailyStats={stats?.dailyStats}
                isLoading={isLoading}
              />
              <TotalSignupsCard
                dailyStats={stats?.dailyStats}
                isLoading={isLoading}
              />
            </div>

            <div className="2xl:mt-7.5 2xl:gap-7.5 mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6">
              <RevenueAndProfitChart
                weeklyStats={stats?.weeklyStats}
                isLoading={isLoading}
              />

              <div className="col-span-12 xl:col-span-8">
                <SourcesTable sources={stats?.dailyStats?.sources} />
              </div>
            </div>
          </div>

          {!stats && (
            <div className="bg-background/50 absolute inset-0 flex items-start justify-center pt-12">
              <div className="bg-card rounded-lg p-8 shadow-lg text-center">
                <p className="text-foreground text-2xl font-bold">
                  Sin estadísticas diarias OpenSaaS
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  Las métricas base aparecerán cuando la tarea programada se ejecute.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
