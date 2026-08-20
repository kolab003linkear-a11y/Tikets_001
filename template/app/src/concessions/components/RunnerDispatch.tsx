import {
  CheckCircle2,
  Clock,
  Footprints,
  KeyRound,
  MapPin,
  PackageCheck,
} from "lucide-react";
import { useState } from "react";
import { KpiCard } from "../../client/components/ui/KpiCard";
import { StatusBadge } from "../../client/components/ui/StatusBadge";
import { confirmSeatDelivery, mockOrders } from "../operations";

export function RunnerDispatch() {
  const [orders, setOrders] = useState(mockOrders);
  const [pinInputs, setPinInputs] = useState<{ [orderId: string]: string }>({});
  const [results, setResults] = useState<{
    [orderId: string]: { success: boolean; message: string };
  }>({});

  const handleConfirm = async (orderId: string) => {
    const pin = pinInputs[orderId] || "";
    const res = await confirmSeatDelivery({ orderId, deliveryPin: pin }, {});
    setResults((prev) => ({ ...prev, [orderId]: res }));

    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "DELIVERED" } : o)),
      );
    }
  };

  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;
  const pendingCount = orders.length - deliveredCount;

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-500/30 bg-gradient-to-r from-[#0A2540] via-slate-900 to-slate-950 p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center space-x-4">
            <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-3.5 text-[#0EA5E9] shadow-inner">
              <Footprints className="h-8 w-8 text-[#0EA5E9]" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="font-['Satoshi',sans-serif] text-xl font-bold tracking-tight text-white">
                  Panel del Runner de Gradas (Despacho en Estadio)
                </h2>
                <StatusBadge status="ACTIVE" label="Despacho In-Stadium" />
              </div>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-300">
                Entrega pedidos directamente a las butacas y valida con el PIN
                confidencial del asistente.
              </p>
            </div>
          </div>

          <span className="rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 font-mono text-xs font-bold text-teal-400">
            Sector Asignado: Tribuna Occidental
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          title="Pedidos Asignados"
          value={orders.length}
          subtitle="Sector Occidental"
          icon={PackageCheck}
          variant="primary"
          badge="Gradería"
        />
        <KpiCard
          title="Entregas Exitosas"
          value={deliveredCount}
          subtitle="Verificadas con PIN"
          icon={CheckCircle2}
          variant="accent"
          badge="En Asiento"
        />
        <KpiCard
          title="Pendientes por Despacho"
          value={pendingCount}
          subtitle="En preparación"
          icon={Clock}
          variant={pendingCount > 0 ? "warning" : "secondary"}
          badge="En Camino"
        />
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {orders.map((order) => {
          const isDelivered = order.status === "DELIVERED";
          return (
            <div
              key={order.id}
              className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-mono text-xs font-bold text-teal-400">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {order.seatZone} • {order.seatRow} • {order.seatNumber}
                  </span>
                </div>
                <StatusBadge
                  status={isDelivered ? "DELIVERED" : "QUEUED"}
                  label={isDelivered ? "Entregado" : "Pendiente"}
                />
              </div>

              <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-300">
                {order.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {i.qty}x {i.name}
                    </span>
                    <span className="font-mono text-slate-400">
                      ${(i.qty * i.price).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-slate-800 pt-2 font-bold text-white">
                  <span>Total Pedido:</span>
                  <span className="font-mono text-teal-400">
                    ${order.totalAmount.toFixed(2)} USD
                  </span>
                </div>
              </div>

              {!isDelivered ? (
                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <KeyRound className="h-3.5 w-3.5 text-teal-400" />
                    <span>
                      PIN de Entrega del Asistente (ej: {order.deliveryPin})
                    </span>
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="PIN-8842"
                      value={pinInputs[order.id] || ""}
                      onChange={(e) =>
                        setPinInputs({
                          ...pinInputs,
                          [order.id]: e.target.value,
                        })
                      }
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-widest text-teal-400 focus:border-teal-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleConfirm(order.id)}
                      className="active:scale-98 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md transition-all hover:from-teal-500 hover:to-teal-400"
                    >
                      Confirmar Entrega
                    </button>
                  </div>

                  {results[order.id] && (
                    <div
                      className={`rounded-xl border p-3 text-xs ${
                        results[order.id].success
                          ? "border-teal-500/40 bg-teal-950/40 text-teal-300"
                          : "border-rose-500/40 bg-rose-950/40 text-rose-300"
                      }`}
                    >
                      {results[order.id].message}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2 rounded-xl border border-teal-500/30 bg-teal-950/30 p-3 text-xs font-semibold text-teal-300">
                  <CheckCircle2 className="h-4 w-4 text-teal-400" />
                  <span>Entregado en Asiento • PIN Validado</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
