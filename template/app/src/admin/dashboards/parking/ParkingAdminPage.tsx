import { useState } from "react";
import { type AuthUser } from "wasp/auth";
import {
  createOrUpdateParkingFacility,
  getAdminParkingStatsAndFacilities,
  manualCloseParkingSession,
  useQuery,
} from "wasp/client/operations";
import {
  Car,
  Building2,
  Clock,
  DollarSign,
  Plus,
  Edit2,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Breadcrumb } from "../../layout/Breadcrumb";
import { DefaultLayout } from "../../layout/DefaultLayout";
import { LoadingSpinner } from "../../layout/LoadingSpinner";

export function ParkingAdminPage({ user }: { user: AuthUser }) {
  const { data, isLoading, error, refetch } = useQuery(
    getAdminParkingStatsAndFacilities,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<any | null>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Form State
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [hourlyTariff, setHourlyTariff] = useState("2.50");
  const [gracePeriodMins, setGracePeriodMins] = useState("15");
  const [totalBays, setTotalBays] = useState("100");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenCreateModal = () => {
    setEditingFacility(null);
    setName("");
    setLocation("");
    setHourlyTariff("2.50");
    setGracePeriodMins("15");
    setTotalBays("100");
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (facility: any) => {
    setEditingFacility(facility);
    setName(facility.name || "");
    setLocation(facility.location || "");
    setHourlyTariff(
      typeof facility.hourlyTariff === "number"
        ? facility.hourlyTariff.toString()
        : facility.hourlyTariff?.toString() || "2.50",
    );
    setGracePeriodMins((facility.gracePeriodMins || 15).toString());
    setTotalBays((facility.totalBays || 100).toString());
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmitFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      await createOrUpdateParkingFacility({
        id: editingFacility?.id,
        name,
        location,
        hourlyTariff: parseFloat(hourlyTariff),
        gracePeriodMins: parseInt(gracePeriodMins, 10),
        totalBays: parseInt(totalBays, 10),
      });

      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      setFormError(err?.message || "Error al guardar la instalación de parqueo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForceCloseSession = async (sessionId: string, newStatus: string) => {
    try {
      await manualCloseParkingSession({
        sessionId,
        status: newStatus as any,
      });
      refetch();
    } catch (err: any) {
      alert(`Error al cerrar sesión: ${err?.message}`);
    }
  };

  const facilities = data?.facilities || [];
  const sessions = data?.sessions || [];
  const stats = data?.stats || {
    totalFacilities: 0,
    totalBays: 0,
    totalActiveVehicles: 0,
    totalRevenue: 0,
    occupiedPercentage: 0,
  };

  const filteredSessions = sessions.filter((s: any) => {
    const plate = s.vehicle?.plateNumber || s.plateNumber || "";
    const facName = s.facility?.name || s.facilityName || "";
    const matchesSearch =
      plate.toLowerCase().includes(searchFilter.toLowerCase()) ||
      facName.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DefaultLayout user={user}>
      <Breadcrumb pageName="Gestión de Parqueaderos LPR" />

      <div className="flex flex-col gap-6">
        {/* Banner de Estado */}
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4 text-blue-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="h-6 w-6 text-blue-400" />
              <div>
                <h2 className="font-semibold text-blue-200">
                  Módulo de Gestión de Parqueaderos & Lectura LPR
                </h2>
                <p className="text-xs text-blue-300/80">
                  Monitoreo de recintos en tiempo real, ajuste de tarifarios por hora, tiempos de gracia y liquidación manual de sesiones.
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Nueva Instalación
            </button>
          </div>
        </div>

        {/* Tarjetas KPI Resumen */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-sm border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Instalaciones LPR</span>
              <Building2 className="h-4 w-4 text-blue-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{stats.totalFacilities}</p>
            <span className="text-xs text-muted-foreground">Recintos configurados</span>
          </div>

          <div className="rounded-sm border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Vehículos Estacionados</span>
              <Car className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{stats.totalActiveVehicles}</p>
            <span className="text-xs text-emerald-500 font-medium">De {stats.totalBays} plazas totales</span>
          </div>

          <div className="rounded-sm border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Ocupación Global</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{stats.occupiedPercentage}%</p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${Math.min(stats.occupiedPercentage, 100)}%` }}
              />
            </div>
          </div>

          <div className="rounded-sm border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Recaudación LPR</span>
              <DollarSign className="h-4 w-4 text-purple-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              ${stats.totalRevenue.toFixed(2)}
            </p>
            <span className="text-xs text-muted-foreground">Cobros automáticos procesados</span>
          </div>
        </div>

        {/* Tarjetas de Instalaciones LPR */}
        <div className="rounded-sm border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-400" />
            Recintos de Parqueo & Tarifarios Horarios
          </h3>
          {isLoading ? (
            <div className="py-6 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {facilities.map((fac: any) => {
                const activeCount = fac.activeVehicles ?? fac.sessions?.length ?? 0;
                const capacityPct = fac.totalBays > 0 ? Math.round((activeCount / fac.totalBays) * 100) : 0;
                const tariffVal = typeof fac.hourlyTariff === "number" ? fac.hourlyTariff : parseFloat(fac.hourlyTariff || "0");

                return (
                  <div key={fac.id} className="rounded-md border border-border/80 bg-muted/30 p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">{fac.name}</h4>
                        <p className="text-[11px] text-muted-foreground">{fac.location}</p>
                      </div>
                      <button
                        onClick={() => handleOpenEditModal(fac)}
                        className="p-1 text-muted-foreground hover:text-blue-400 transition"
                        title="Editar tarifario / plazas"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Ocupación de plazas:</span>
                        <span className="font-semibold text-foreground">{activeCount} / {fac.totalBays} ({capacityPct}%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            capacityPct > 90 ? "bg-rose-500" : capacityPct > 70 ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.min(capacityPct, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50">
                      <span>Tarifa: <strong className="text-foreground">${tariffVal.toFixed(2)}/h</strong></span>
                      <span>Gracia: <strong className="text-foreground">{fac.gracePeriodMins} min</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tabla de Sesiones LPR en Vivo */}
        <div className="rounded-sm border border-border bg-card shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 border-b border-border">
            <div>
              <h3 className="text-base font-semibold text-foreground">Sesiones de Parqueo LPR & Historial</h3>
              <p className="text-xs text-muted-foreground">
                Monitoree lecturas ópticas de placas a la entrada/salida y ejecute cierres manuales de emergencia.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por placa o instalación..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full rounded-md border border-border bg-background py-1.5 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-md border border-border bg-background py-1.5 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="ALL">Todas las sesiones</option>
                  <option value="ACTIVE">ACTIVE (En Parqueadero)</option>
                  <option value="COMPLETED">COMPLETED (Liquidado)</option>
                  <option value="PAYMENT_FAILED">PAYMENT_FAILED (Error Cobro)</option>
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
                    <th className="px-6 py-3">Placa Vehículo</th>
                    <th className="px-6 py-3">Recinto / Instalación</th>
                    <th className="px-6 py-3">Entrada & Puerta</th>
                    <th className="px-6 py-3">Cobro Debitados</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3 text-right">Acción Manual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSessions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No se encontraron sesiones de parqueo activas o pasadas.
                      </td>
                    </tr>
                  ) : (
                    filteredSessions.map((sess: any) => {
                      const plate = sess.vehicle?.plateNumber || sess.plateNumber || "SIN-PLACA";
                      const facName = sess.facility?.name || sess.facilityName || "Parqueadero General";
                      const amount = typeof sess.totalBilled === "number" ? sess.totalBilled : parseFloat(sess.totalBilled || "0");

                      return (
                        <tr key={sess.id} className="hover:bg-muted/30 transition">
                          <td className="px-6 py-4">
                            <div className="inline-block rounded border border-slate-700 bg-slate-900 px-2 py-1 font-mono text-xs font-bold text-amber-400 tracking-wider">
                              {plate}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-foreground">
                            {facName}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-foreground">
                              {new Date(sess.entryTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {sess.entryGateId || "GATE-01"}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-foreground">
                            ${amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            {sess.status === "ACTIVE" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                                ● ACTIVE (Estacionado)
                              </span>
                            )}
                            {sess.status === "COMPLETED" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                                <CheckCircle2 className="h-3 w-3" /> COMPLETED (Salida)
                              </span>
                            )}
                            {sess.status === "PAYMENT_FAILED" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-rose-400 border border-rose-500/20">
                                <AlertTriangle className="h-3 w-3" /> PAYMENT_FAILED
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {sess.status === "ACTIVE" ? (
                              <button
                                onClick={() => handleForceCloseSession(sess.id, "COMPLETED")}
                                className="rounded bg-blue-600/20 px-2.5 py-1 text-[11px] font-medium text-blue-300 hover:bg-blue-600/30 border border-blue-500/30"
                              >
                                Forzar Salida & Liquidad
                              </button>
                            ) : (
                              <span className="text-[11px] text-muted-foreground">Finalizado</span>
                            )}
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

      {/* Modal de Creación / Edición de Instalación de Parqueo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-400" />
                {editingFacility ? "Editar Instalación & Tarifas" : "Nueva Instalación de Parqueo"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
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

            <form onSubmit={handleSubmitFacility} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">Nombre de la Instalación *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Parqueadero Quicentro Norte"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Ubicación / Dirección *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Av. Naciones Unidas y 6 de Diciembre"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium text-foreground mb-1">Tarifa/Hora ($) *</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0.50"
                    required
                    value={hourlyTariff}
                    onChange={(e) => setHourlyTariff(e.target.value)}
                    className="w-full rounded border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-foreground mb-1">Gracia (Min) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={gracePeriodMins}
                    onChange={(e) => setGracePeriodMins(e.target.value)}
                    className="w-full rounded border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-foreground mb-1">Plazas Totales *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={totalBays}
                    onChange={(e) => setTotalBays(e.target.value)}
                    className="w-full rounded border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded px-4 py-2 font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? "Guardando..." : "Guardar Instalación"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
