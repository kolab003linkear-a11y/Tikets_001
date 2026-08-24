import { useState } from "react";
import { type AuthUser } from "wasp/auth";
import {
  createAdminTransitTrip,
  createOrUpdateTransitRoute,
  getAdminTransitStatsAndRoutes,
  updateTransitTripStatus,
  useQuery,
} from "wasp/client/operations";
import {
  Bus,
  Route as RouteIcon,
  Radio,
  Users,
  Plus,
  Search,
  Filter,
  Clock,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { Breadcrumb } from "../../layout/Breadcrumb";
import { DefaultLayout } from "../../layout/DefaultLayout";
import { LoadingSpinner } from "../../layout/LoadingSpinner";

export function TransitAdminPage({ user }: { user: AuthUser }) {
  const { data, isLoading, error, refetch } = useQuery(
    getAdminTransitStatsAndRoutes,
  );

  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Route Form State
  const [routeName, setRouteName] = useState("");
  const [originCity, setOriginCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("4.5");

  // Trip Form State
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [busUnitNumber, setBusUnitNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [departureTime, setDepartureTime] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      await createOrUpdateTransitRoute({
        routeName,
        originCity,
        destinationCity,
        estimatedHours: parseFloat(estimatedHours),
      });

      setIsRouteModalOpen(false);
      setRouteName("");
      setOriginCity("");
      setDestinationCity("");
      setEstimatedHours("4.5");
      refetch();
    } catch (err: any) {
      setFormError(err?.message || "Error al crear la ruta interprovincial.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      await createAdminTransitTrip({
        routeId: selectedRouteId,
        busUnitNumber,
        driverName,
        departureTime: departureTime ? new Date(departureTime).toISOString() : new Date().toISOString(),
      });

      setIsTripModalOpen(false);
      setSelectedRouteId("");
      setBusUnitNumber("");
      setDriverName("");
      setDepartureTime("");
      refetch();
    } catch (err: any) {
      setFormError(err?.message || "Error al programar el viaje de bus.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTripStatusChange = async (tripId: string, newStatus: string) => {
    try {
      await updateTransitTripStatus({
        tripId,
        status: newStatus as any,
      });
      refetch();
    } catch (err: any) {
      alert(`Error al actualizar el viaje: ${err?.message}`);
    }
  };

  const routes = data?.routes || [];
  const trips = data?.trips || [];
  const stats = data?.stats || {
    totalRoutes: 0,
    totalTrips: 0,
    inTransitCount: 0,
    scheduledCount: 0,
    totalBoarded: 0,
  };

  const filteredTrips = trips.filter((t: any) => {
    const bus = t.busUnitNumber || "";
    const driver = t.driverName || "";
    const rName = t.route?.routeName || t.routeTitle || "";

    const matchesSearch =
      bus.toLowerCase().includes(searchFilter.toLowerCase()) ||
      driver.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rName.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DefaultLayout user={user}>
      <Breadcrumb pageName="Gestión de Transporte Interprovincial" />

      <div className="flex flex-col gap-6">
        {/* Banner de Estado */}
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-4 text-indigo-300">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Bus className="h-6 w-6 text-indigo-400" />
              <div>
                <h2 className="font-semibold text-indigo-200">
                  Módulo de Transporte Interprovincial & Flota de Buses
                </h2>
                <p className="text-xs text-indigo-300/80">
                  Programación de itinerarios, asignación de choferes, emisión de enlaces de seguimiento GPS y control del manifiesto por Cédula.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setFormError(null);
                  setIsRouteModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-md bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 border border-slate-700 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Nueva Ruta
              </button>

              <button
                onClick={() => {
                  if (routes.length > 0) setSelectedRouteId(routes[0].id);
                  setFormError(null);
                  setIsTripModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Programar Viaje
              </button>
            </div>
          </div>
        </div>

        {/* Tarjetas KPI Resumen */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-sm border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Rutas Habilitadas</span>
              <RouteIcon className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{stats.totalRoutes}</p>
            <span className="text-xs text-muted-foreground">Trayectos entre ciudades</span>
          </div>

          <div className="rounded-sm border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Buses en Tránsito</span>
              <Radio className="h-4 w-4 text-emerald-500 animate-pulse" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{stats.inTransitCount}</p>
            <span className="text-xs text-emerald-500 font-medium">Transmitiendo GPS activo</span>
          </div>

          <div className="rounded-sm border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Viajes Programados</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{stats.scheduledCount}</p>
            <span className="text-xs text-muted-foreground">En itinerario próximo</span>
          </div>

          <div className="rounded-sm border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Abordajes por Cédula</span>
              <Users className="h-4 w-4 text-purple-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{stats.totalBoarded}</p>
            <span className="text-xs text-muted-foreground">Pasajeros verificados offline</span>
          </div>
        </div>

        {/* Rutas Registradas */}
        <div className="rounded-sm border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
            <RouteIcon className="h-4 w-4 text-indigo-400" />
            Rutas Interprovinciales Configuradas
          </h3>
          {isLoading ? (
            <div className="py-6 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {routes.map((r: any) => (
                <div key={r.id} className="rounded-md border border-border/80 bg-muted/30 p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-xs text-foreground line-clamp-1">{r.routeName}</h4>
                    <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                      {r.estimatedHours}h Est.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{r.originCity} ➔ {r.destinationCity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tabla de Viajes & Monitoreo de Flota */}
        <div className="rounded-sm border border-border bg-card shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 border-b border-border">
            <div>
              <h3 className="text-base font-semibold text-foreground">Programación de Viajes & Telemetría en Vivo</h3>
              <p className="text-xs text-muted-foreground">
                Consulte las unidades en ruta, conductores asignados y enlaces de rastreo GPS para familiares.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar bus, chofer o ruta..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full rounded-md border border-border bg-background py-1.5 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-md border border-border bg-background py-1.5 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="ALL">Todos los estados</option>
                  <option value="SCHEDULED">SCHEDULED (Programado)</option>
                  <option value="BOARDING">BOARDING (Abordando)</option>
                  <option value="IN_TRANSIT">IN_TRANSIT (En Carretera)</option>
                  <option value="COMPLETED">COMPLETED (Llegada)</option>
                  <option value="CANCELLED">CANCELLED (Suspendido)</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground">
                <thead className="bg-muted/50 border-b border-border uppercase text-[10px] font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3">Unidad & Conductor</th>
                    <th className="px-6 py-3">Ruta Asignada</th>
                    <th className="px-6 py-3">Salida Programada</th>
                    <th className="px-6 py-3">Rastreo GPS / Share Token</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3 text-right">Acción Operativa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTrips.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No se encontraron viajes programados en itinerario.
                      </td>
                    </tr>
                  ) : (
                    filteredTrips.map((trip: any) => {
                      const rTitle = trip.route?.routeName || trip.routeTitle || "Ruta Interprovincial";
                      const depDate = new Date(trip.departureTime);

                      return (
                        <tr key={trip.id} className="hover:bg-muted/30 transition">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-foreground">{trip.busUnitNumber}</div>
                            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Users className="h-3 w-3" />
                              Chofer: {trip.driverName}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-foreground">
                            {rTitle}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-foreground font-medium">
                              {isNaN(depDate.getTime()) ? trip.departureTime : depDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {isNaN(depDate.getTime()) ? "" : depDate.toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {trip.shareToken ? (
                              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-indigo-400">
                                <Radio className="h-3 w-3" />
                                {trip.shareToken.substring(0, 16)}...
                              </span>
                            ) : (
                              <span className="text-[11px] text-muted-foreground">Sin Token GPS</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {trip.status === "IN_TRANSIT" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                                <Radio className="h-3 w-3 animate-pulse" /> IN_TRANSIT
                              </span>
                            )}
                            {trip.status === "SCHEDULED" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                                SCHEDULED
                              </span>
                            )}
                            {trip.status === "BOARDING" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
                                BOARDING
                              </span>
                            )}
                            {trip.status === "COMPLETED" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-500/20">
                                COMPLETED
                              </span>
                            )}
                            {trip.status === "CANCELLED" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-rose-400 border border-rose-500/20">
                                CANCELLED
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <select
                              value={trip.status}
                              onChange={(e) => handleTripStatusChange(trip.id, e.target.value)}
                              className="rounded border border-border bg-background py-1 px-2 text-[11px] text-foreground focus:outline-none"
                            >
                              <option value="SCHEDULED">SCHEDULED</option>
                              <option value="BOARDING">BOARDING</option>
                              <option value="IN_TRANSIT">IN_TRANSIT</option>
                              <option value="COMPLETED">COMPLETED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Nueva Ruta */}
      {isRouteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <RouteIcon className="h-5 w-5 text-indigo-400" />
                Nueva Ruta Interprovincial
              </h3>
              <button
                onClick={() => setIsRouteModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="rounded bg-rose-500/10 p-2.5 text-xs text-rose-400 border border-rose-500/20">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateRoute} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">Nombre de la Ruta *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Quito (Carcelén) ➔ Guayaquil (Terminal)"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  className="w-full rounded border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-foreground mb-1">Ciudad Origen *</label>
                  <input
                    type="text"
                    required
                    placeholder="Quito"
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    className="w-full rounded border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-1">Ciudad Destino *</label>
                  <input
                    type="text"
                    required
                    placeholder="Guayaquil"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    className="w-full rounded border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Duración Estimada (Horas) *</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                  className="w-full rounded border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsRouteModalOpen(false)}
                  className="rounded px-4 py-2 font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? "Guardando..." : "Guardar Ruta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Programar Viaje */}
      {isTripModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Bus className="h-5 w-5 text-indigo-400" />
                Programar Viaje de Bus
              </h3>
              <button
                onClick={() => setIsTripModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="rounded bg-rose-500/10 p-2.5 text-xs text-rose-400 border border-rose-500/20">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateTrip} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">Ruta Asignada *</label>
                <select
                  required
                  value={selectedRouteId}
                  onChange={(e) => setSelectedRouteId(e.target.value)}
                  className="w-full rounded border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {routes.map((r: any) => (
                    <option key={r.id} value={r.id}>
                      {r.routeName} ({r.estimatedHours}h)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Unidad de Bus / Cooperativa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Unidad 14 - Flota Imbabura"
                  value={busUnitNumber}
                  onChange={(e) => setBusUnitNumber(e.target.value)}
                  className="w-full rounded border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Conductor Asignado *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Raúl Fuentes"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full rounded border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Fecha & Hora de Salida *</label>
                <input
                  type="datetime-local"
                  required
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full rounded border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsTripModalOpen(false)}
                  className="rounded px-4 py-2 font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? "Guardando..." : "Programar Itinerario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
