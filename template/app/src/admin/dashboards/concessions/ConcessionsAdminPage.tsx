import { useState } from "react";
import { type AuthUser } from "wasp/auth";
import {
  createOrUpdateStadiumVenue,
  getAdminConcessionsStatsAndOrders,
  updateConcessionOrderStatus,
  useQuery,
} from "wasp/client/operations";
import {
  UtensilsCrossed,
  Store,
  ShoppingBag,
  Clock,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  MapPin,
  Tag,
  Key,
} from "lucide-react";
import { Breadcrumb } from "../../layout/Breadcrumb";
import { DefaultLayout } from "../../layout/DefaultLayout";
import { LoadingSpinner } from "../../layout/LoadingSpinner";

export function ConcessionsAdminPage({ user }: { user: AuthUser }) {
  const { data, isLoading, error, refetch } = useQuery(
    getAdminConcessionsStatsAndOrders,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Venue Form State
  const [name, setName] = useState("");
  const [concessionZonesStr, setConcessionZonesStr] = useState(
    "Tribuna Principal, Palcos, General Norte",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      const zones = concessionZonesStr
        .split(",")
        .map((z) => z.trim())
        .filter(Boolean);

      await createOrUpdateStadiumVenue({
        name,
        concessionZones: zones,
      });

      setIsModalOpen(false);
      setName("");
      setConcessionZonesStr("Tribuna Principal, Palcos, General Norte");
      refetch();
    } catch (err: any) {
      setFormError(err?.message || "Error al crear el recinto deportivo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOrderStatusChange = async (
    orderId: string,
    newStatus: string,
    runnerName?: string,
  ) => {
    try {
      await updateConcessionOrderStatus({
        orderId,
        status: newStatus as any,
        runnerName,
      });
      refetch();
    } catch (err: any) {
      alert(`Error al actualizar estado del pedido: ${err?.message}`);
    }
  };

  const venues = data?.venues || [];
  const orders = data?.orders || [];
  const menu = data?.menu || [];
  const stats = data?.stats || {
    totalVenues: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
  };

  const filteredOrders = orders.filter((o: any) => {
    const userEmail = o.user?.email || o.user?.name || "";
    const seatInfo = `${o.seatZone} ${o.seatRow} ${o.seatNumber}`;
    const vName = o.venue?.name || "";

    const matchesSearch =
      userEmail.toLowerCase().includes(searchFilter.toLowerCase()) ||
      seatInfo.toLowerCase().includes(searchFilter.toLowerCase()) ||
      vName.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DefaultLayout user={user}>
      <Breadcrumb pageName="Gestión de Concesiones en Estadios" />

      <div className="flex flex-col gap-6">
        {/* Banner de Estado */}
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-amber-300">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <UtensilsCrossed className="h-6 w-6 text-amber-400" />
              <div>
                <h2 className="font-semibold text-amber-200">
                  Módulo de Concesiones & Delivery al Asiento
                </h2>
                <p className="text-xs text-amber-300/80">
                  Gestión de estadios, menús por recinto, monitoreo de pedidos en tiempo real y despacho de repartidores (*runners*).
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setFormError(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-md bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-500 transition shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Nuevo Recinto / Estadio
            </button>
          </div>
        </div>

        {/* Tarjetas KPI Resumen */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-sm border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Estadios Habilitados</span>
              <Store className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{stats.totalVenues}</p>
            <span className="text-xs text-muted-foreground">Recintos con entrega al asiento</span>
          </div>

          <div className="rounded-sm border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Pedidos en Preparación</span>
              <ShoppingBag className="h-4 w-4 text-blue-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{stats.pendingOrders}</p>
            <span className="text-xs text-blue-400 font-medium">En cola de repartidores</span>
          </div>

          <div className="rounded-sm border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Entregas Confirmadas</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{stats.deliveredOrders}</p>
            <span className="text-xs text-muted-foreground">Verificados con PIN en asiento</span>
          </div>

          <div className="rounded-sm border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Ventas de Concesión</span>
              <Tag className="h-4 w-4 text-purple-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              ${stats.totalRevenue.toFixed(2)}
            </p>
            <span className="text-xs text-muted-foreground">Recaudación acumulada</span>
          </div>
        </div>

        {/* Estadios & Menú Resumen */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Estadios */}
          <div className="lg:col-span-2 rounded-sm border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
              <Store className="h-4 w-4 text-amber-400" />
              Estadios & Zonas de Cobertura
            </h3>
            {isLoading ? (
              <div className="py-6 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {venues.map((v: any) => (
                  <div key={v.id} className="rounded-md border border-border/80 bg-muted/30 p-4 space-y-2">
                    <h4 className="font-semibold text-xs text-foreground">{v.name}</h4>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-amber-400" />
                      Zonas de Entrega:
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {(v.concessionZones || []).map((z: string, idx: number) => (
                        <span
                          key={idx}
                          className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/20"
                        >
                          {z}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Menú de Productos */}
          <div className="rounded-sm border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
              <Tag className="h-4 w-4 text-amber-400" />
              Catálogo de Menú
            </h3>
            <div className="space-y-3 divide-y divide-border/40">
              {menu.map((item: any) => (
                <div key={item.id} className="pt-2 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <span className="text-[10px] text-muted-foreground">{item.category}</span>
                  </div>
                  <span className="font-bold text-amber-400">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabla de Pedidos de Concesión en Vivo */}
        <div className="rounded-sm border border-border bg-card shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 border-b border-border">
            <div>
              <h3 className="text-base font-semibold text-foreground">Cola de Pedidos al Asiento & Despacho</h3>
              <p className="text-xs text-muted-foreground">
                Consulte ubicación exacta (Zona, Fila, Asiento), PIN de confirmación y asignación de repartidores (*runners*).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar asiento, cliente o estadio..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full rounded-md border border-border bg-background py-1.5 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-md border border-border bg-background py-1.5 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="ALL">Todos los pedidos</option>
                  <option value="RECEIVED">RECEIVED (Recibido)</option>
                  <option value="PREPARING">PREPARING (En Cocina)</option>
                  <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY (En Camino)</option>
                  <option value="DELIVERED">DELIVERED (Entregado)</option>
                  <option value="CANCELLED">CANCELLED (Cancelado)</option>
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
                    <th className="px-6 py-3">Ubicación (Zona/Fila/Asiento)</th>
                    <th className="px-6 py-3">Cliente / Estadio</th>
                    <th className="px-6 py-3">Productos Ordenados</th>
                    <th className="px-6 py-3">Total & PIN</th>
                    <th className="px-6 py-3">Repartidor (Runner)</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3 text-right">Acción Administrative</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        No se encontraron pedidos en la cola.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord: any) => {
                      const vName = ord.venue?.name || "Estadio Monumental";
                      const customer = ord.user?.email || ord.user?.name || "Aficionado";
                      const amount = typeof ord.totalAmount === "number" ? ord.totalAmount : parseFloat(ord.totalAmount || "0");
                      const itemsList = Array.isArray(ord.itemsJson)
                        ? ord.itemsJson
                        : typeof ord.itemsJson === "string"
                        ? JSON.parse(ord.itemsJson)
                        : ord.items || [];

                      return (
                        <tr key={ord.id} className="hover:bg-muted/30 transition">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-amber-400">{ord.seatZone}</div>
                            <div className="text-[11px] text-muted-foreground">
                              {ord.seatRow} • {ord.seatNumber}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-foreground">{customer}</div>
                            <div className="text-[11px] text-muted-foreground">{vName}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-0.5 text-[11px]">
                              {itemsList.map((it: any, idx: number) => (
                                <div key={idx} className="text-foreground">
                                  {it.qty}x {it.name}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-foreground">${amount.toFixed(2)}</div>
                            <div className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 mt-0.5">
                              <Key className="h-3 w-3" /> PIN: {ord.deliveryPin}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-foreground">
                            {ord.runnerName || "Por Asignar"}
                          </td>
                          <td className="px-6 py-4">
                            {ord.status === "RECEIVED" && (
                              <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                                RECEIVED
                              </span>
                            )}
                            {ord.status === "PREPARING" && (
                              <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20 animate-pulse">
                                <Clock className="h-3 w-3 mr-1" /> PREPARING
                              </span>
                            )}
                            {ord.status === "OUT_FOR_DELIVERY" && (
                              <span className="inline-flex items-center rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-purple-400 border border-purple-500/20">
                                OUT_FOR_DELIVERY
                              </span>
                            )}
                            {ord.status === "DELIVERED" && (
                              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="h-3 w-3 mr-1" /> DELIVERED
                              </span>
                            )}
                            {ord.status === "CANCELLED" && (
                              <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-rose-400 border border-rose-500/20">
                                CANCELLED
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <select
                              value={ord.status}
                              onChange={(e) => handleOrderStatusChange(ord.id, e.target.value)}
                              className="rounded border border-border bg-background py-1 px-2 text-[11px] text-foreground focus:outline-none"
                            >
                              <option value="RECEIVED">RECEIVED</option>
                              <option value="PREPARING">PREPARING</option>
                              <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                              <option value="DELIVERED">DELIVERED</option>
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

      {/* Modal Nuevo Recinto / Estadio */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Store className="h-5 w-5 text-amber-400" />
                Nuevo Recinto Deportivo
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

            <form onSubmit={handleCreateVenue} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">Nombre del Estadio / Arena *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Estadio Monumental Isidro Romero"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Zonas de Entrega (Separadas por coma) *</label>
                <input
                  type="text"
                  required
                  placeholder="Tribuna Occidental, Palcos VIP, General Norte"
                  value={concessionZonesStr}
                  onChange={(e) => setConcessionZonesStr(e.target.value)}
                  className="w-full rounded border border-border bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
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
                  className="rounded bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-500 disabled:opacity-50"
                >
                  {isSubmitting ? "Guardando..." : "Guardar Recinto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
