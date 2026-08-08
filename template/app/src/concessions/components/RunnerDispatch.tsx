import React, { useState } from "react";
import { 
  Footprints, 
  MapPin, 
  CheckCircle2, 
  KeyRound, 
  AlertCircle,
  PackageCheck,
  Clock,
  ShieldCheck
} from "lucide-react";
import { mockOrders, confirmSeatDelivery } from "../operations";
import { KpiCard } from "../../client/components/ui/KpiCard";
import { StatusBadge } from "../../client/components/ui/StatusBadge";

export function RunnerDispatch() {
  const [orders, setOrders] = useState(mockOrders);
  const [pinInputs, setPinInputs] = useState<{ [orderId: string]: string }>({});
  const [results, setResults] = useState<{ [orderId: string]: any }>({});

  const handleConfirm = async (orderId: string) => {
    const pin = pinInputs[orderId] || "";
    const res = await confirmSeatDelivery({ orderId, deliveryPin: pin }, {});
    setResults((prev) => ({ ...prev, [orderId]: res }));

    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "DELIVERED" } : o))
      );
    }
  };

  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;
  const pendingCount = orders.length - deliveredCount;

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A2540] via-slate-900 to-slate-950 border border-sky-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 bg-sky-500/10 rounded-2xl border border-sky-500/30 text-[#0EA5E9] shadow-inner">
              <Footprints className="w-8 h-8 text-[#0EA5E9]" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold tracking-tight text-white font-['Satoshi',sans-serif]">
                  Panel del Runner de Gradas (Despacho en Estadio)
                </h2>
                <StatusBadge status="ACTIVE" label="Despacho In-Stadium" />
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Entrega pedidos directamente a las butacas y valida con el PIN confidencial del asistente.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-teal-400 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 font-bold">
            Sector Asignado: Tribuna Occidental
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((order) => {
          const isDelivered = order.status === "DELIVERED";
          return (
            <div
              key={order.id}
              className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-teal-400 text-xs font-mono font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>{order.seatZone} • {order.seatRow} • {order.seatNumber}</span>
                </div>
                <StatusBadge
                  status={isDelivered ? "DELIVERED" : "QUEUED"}
                  label={isDelivered ? "Entregado" : "Pendiente"}
                />
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
                {order.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{i.qty}x {i.name}</span>
                    <span className="font-mono text-slate-400">${(i.qty * i.price).toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white">
                  <span>Total Pedido:</span>
                  <span className="text-teal-400 font-mono">${order.totalAmount.toFixed(2)} USD</span>
                </div>
              </div>

              {!isDelivered ? (
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-teal-400" />
                    <span>PIN de Entrega del Asistente (ej: {order.deliveryPin})</span>
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="PIN-8842"
                      value={pinInputs[order.id] || ""}
                      onChange={(e) =>
                        setPinInputs({ ...pinInputs, [order.id]: e.target.value })
                      }
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-teal-400 uppercase tracking-widest focus:border-teal-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleConfirm(order.id)}
                      className="py-2 px-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-98"
                    >
                      Confirmar Entrega
                    </button>
                  </div>

                  {results[order.id] && (
                    <div
                      className={`p-3 rounded-xl border text-xs ${
                        results[order.id].success
                          ? "bg-teal-950/40 border-teal-500/40 text-teal-300"
                          : "bg-rose-950/40 border-rose-500/40 text-rose-300"
                      }`}
                    >
                      {results[order.id].message}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-teal-950/30 border border-teal-500/30 rounded-xl text-teal-300 text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
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
