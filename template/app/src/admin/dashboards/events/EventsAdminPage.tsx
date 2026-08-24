import { useState } from "react";
import { type AuthUser } from "wasp/auth";
import {
  createAdminTicket,
  getAdminTicketsAndStats,
  updateAdminTicketStatus,
  useQuery,
} from "wasp/client/operations";
import {
  Ticket as TicketIcon,
  Calendar,
  CheckCircle2,
  ShieldAlert,
  Plus,
  Search,
  Filter,
  Building2,
  User as UserIcon,
} from "lucide-react";
import { Breadcrumb } from "../../layout/Breadcrumb";
import { DefaultLayout } from "../../layout/DefaultLayout";
import { LoadingSpinner } from "../../layout/LoadingSpinner";

export function EventsAdminPage({ user }: { user: AuthUser }) {
  const { data, isLoading, error, refetch } = useQuery(getAdminTicketsAndStats);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Form State
  const [eventTitle, setEventTitle] = useState("");
  const [venueName, setVenueName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [zone, setZone] = useState("");
  const [row, setRow] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      await createAdminTicket({
        eventTitle,
        venueName,
        eventDate: eventDate ? new Date(eventDate).toISOString() : new Date().toISOString(),
        zone,
        row,
        seatNumber,
        userEmail: userEmail || undefined,
      });

      setIsModalOpen(false);
      // Reset form
      setEventTitle("");
      setVenueName("");
      setEventDate("");
      setZone("");
      setRow("");
      setSeatNumber("");
      setUserEmail("");
      refetch();
    } catch (err: any) {
      setFormError(err?.message || "Error al crear el boleto/evento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      await updateAdminTicketStatus({
        ticketId,
        status: newStatus as any,
      });
      refetch();
    } catch (err: any) {
      alert(`Error al actualizar estado: ${err?.message}`);
    }
  };

  const tickets = data?.tickets || [];
  const stats = data?.stats || {
    totalTickets: 0,
    activeCount: 0,
    usedCount: 0,
    transferredCount: 0,
    cancelledCount: 0,
    totalEvents: 0,
  };
  const events = data?.events || [];

  const filteredTickets = tickets.filter((t: any) => {
    const matchesSearch =
      t.eventTitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.venueName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.zone.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (t.user?.email && t.user.email.toLowerCase().includes(searchFilter.toLowerCase()));
    
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DefaultLayout user={user}>
      <Breadcrumb pageName="Gestión de Eventos y Tickets" />

      <div className="flex flex-col gap-6">
        {/* Banner de Estado */}
        <div className="rounded-lg border border-teal-500/20 bg-teal-500/10 p-4 text-teal-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TicketIcon className="h-6 w-6 text-teal-400" />
              <div>
                <h2 className="font-semibold text-teal-200">
                  Módulo Operativo de Eventos & Entradas Digitales
                </h2>
                <p className="text-xs text-teal-300/80">
                  Panel de administración de recintos, emisión masiva de boletos criptográficos y auditoría de ingresos en molinete.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal-500 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Crear Evento / Boleto
            </button>
          </div>
        </div>

        {/* Tarjetas KPI Resumen */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-sm border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Eventos Activos</span>
              <Calendar className="h-4 w-4 text-teal-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{stats.totalEvents}</p>
            <span className="text-xs text-muted-foreground">Espectáculos registrados</span>
          </div>

          <div className="rounded-sm border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Tickets Emitidos</span>
              <TicketIcon className="h-4 w-4 text-blue-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{stats.totalTickets}</p>
            <span className="text-xs text-emerald-500 font-medium">{stats.activeCount} activos</span>
          </div>

          <div className="rounded-sm border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Accesos Validados</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{stats.usedCount}</p>
            <span className="text-xs text-muted-foreground">Escaneos exitosos en puerta</span>
          </div>

          <div className="rounded-sm border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Transferidos / Cancelados</span>
              <ShieldAlert className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{stats.transferredCount + stats.cancelledCount}</p>
            <span className="text-xs text-muted-foreground">
              {stats.transferredCount} transferidos / {stats.cancelledCount} anulados
            </span>
          </div>
        </div>

        {/* Resumen de Eventos Registrados */}
        {events.length > 0 && (
          <div className="rounded-sm border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4 text-teal-400" />
              Eventos en Cartelera
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((evt: any, i: number) => (
                <div key={i} className="rounded-md border border-border/80 bg-muted/30 p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-sm text-foreground line-clamp-1">{evt.eventTitle}</h4>
                    <span className="rounded bg-teal-500/10 px-2 py-0.5 text-[10px] font-semibold text-teal-400 border border-teal-500/20">
                      {evt.ticketCount} Boletos
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {evt.venueName}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(evt.eventDate).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50">
                    <span>Validados en Puerta:</span>
                    <span className="font-semibold text-emerald-400">{evt.usedCount} / {evt.ticketCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabla Principal de Boletos */}
        <div className="rounded-sm border border-border bg-card shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 border-b border-border">
            <div>
              <h3 className="text-base font-semibold text-foreground">Boletos Emitidos & Estado de Custodia</h3>
              <p className="text-xs text-muted-foreground">
                Consulte boletos en tiempo real, verifique códigos de seguridad y modifique estados de acceso.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Buscador */}
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar evento, sector o usuario..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full rounded-md border border-border bg-background py-1.5 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* Filtro Estado */}
              <div className="flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-md border border-border bg-background py-1.5 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="ALL">Todos los estados</option>
                  <option value="ACTIVE">ACTIVE (Activo)</option>
                  <option value="USED">USED (Ingresado)</option>
                  <option value="TRANSFERRED">TRANSFERRED (Transferido)</option>
                  <option value="CANCELLED">CANCELLED (Anulado)</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-rose-500">
              Error al cargar datos: {error.message}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground">
                <thead className="bg-muted/50 border-b border-border uppercase text-[10px] font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3">Evento & Recinto</th>
                    <th className="px-6 py-3">Asistente / Propietario</th>
                    <th className="px-6 py-3">Ubicación (Zona/Fila/Asiento)</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3 text-right">Acción Administrative</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        No se encontraron boletos que coincidan con la búsqueda.
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((ticket: any) => (
                      <tr key={ticket.id} className="hover:bg-muted/30 transition">
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground">{ticket.eventTitle}</div>
                          <div className="text-muted-foreground text-[11px] flex items-center gap-1 mt-0.5">
                            <Building2 className="h-3 w-3" />
                            {ticket.venueName} • {new Date(ticket.eventDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-foreground">
                            <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{ticket.user?.email || ticket.user?.name || "Sin Asignar"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground">{ticket.zone}</div>
                          <div className="text-muted-foreground text-[11px]">
                            {ticket.row} • {ticket.seatNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {ticket.status === "ACTIVE" && (
                            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                              ● ACTIVE (Disponible)
                            </span>
                          )}
                          {ticket.status === "USED" && (
                            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                              ✓ USED (Ingresado)
                            </span>
                          )}
                          {ticket.status === "TRANSFERRED" && (
                            <span className="inline-flex items-center rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-purple-400 border border-purple-500/20">
                              ⇄ TRANSFERRED
                            </span>
                          )}
                          {ticket.status === "CANCELLED" && (
                            <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-rose-400 border border-rose-500/20">
                              ✕ CANCELLED
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <select
                            value={ticket.status}
                            onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                            className="rounded border border-border bg-background py-1 px-2 text-[11px] text-foreground focus:outline-none"
                          >
                            <option value="ACTIVE">Marcar ACTIVE</option>
                            <option value="USED">Marcar USED</option>
                            <option value="CANCELLED">Marcar CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Creación de Boleto / Evento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <TicketIcon className="h-5 w-5 text-teal-400" />
                Crear Evento / Emitir Boleto
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

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">Título del Evento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Concert Coldplay: Music of the Spheres"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full rounded border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Recinto / Estadio *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Estadio Olímpico Atahualpa"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="w-full rounded border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Fecha del Evento *</label>
                <input
                  type="datetime-local"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium text-foreground mb-1">Zona *</label>
                  <input
                    type="text"
                    required
                    placeholder="Tribuna VIP"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full rounded border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-1">Fila *</label>
                  <input
                    type="text"
                    required
                    placeholder="Fila 12"
                    value={row}
                    onChange={(e) => setRow(e.target.value)}
                    className="w-full rounded border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-1">Asiento *</label>
                  <input
                    type="text"
                    required
                    placeholder="A-45"
                    value={seatNumber}
                    onChange={(e) => setSeatNumber(e.target.value)}
                    className="w-full rounded border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Email del Asistente (Opcional)</label>
                <input
                  type="email"
                  placeholder="asistente@ejemplo.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full rounded border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
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
                  className="rounded bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-500 disabled:opacity-50"
                >
                  {isSubmitting ? "Guardando..." : "Emitir Boleto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
