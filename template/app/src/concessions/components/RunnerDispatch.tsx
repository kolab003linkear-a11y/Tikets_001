import React, { useState } from "react";
import { 
  Footprints, 
  MapPin, 
  CheckCircle2, 
  KeyRound, 
  AlertCircle,
  PackageCheck
} from "lucide-react";
import { mockOrders, confirmSeatDelivery } from "../operations";

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

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-500/20 rounded-2xl text-orange-400">
              <Footprints className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Panel del Repartidor de Gradas (Runner Dispatch)
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  Despacho In-Stadium
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Entrega pedidos directamente a las butacas y valida con el PIN del asistente.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            Sector Asignado: <span className="text-orange-400 font-bold">Tribuna Occidental</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((order) => {
          const isDelivered = order.status === "DELIVERED";
          return (
            <div
              key={order.id}
              className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>{order.seatZone} • {order.seatRow} • {order.seatNumber}</span>
                </div>
                <span
                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                    isDelivered
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1 text-xs text-slate-300">
                {order.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{i.qty}x {i.name}</span>
                    <span className="font-mono text-slate-400">${(i.qty * i.price).toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white">
                  <span>Total Pedido:</span>
                  <span className="text-amber-400 font-mono">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {!isDelivered ? (
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-orange-400" />
                    Ingresar PIN de Entrega del Asistente (ej: {order.deliveryPin})
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="PIN de 4 dígitos"
                      value={pinInputs[order.id] || ""}
                      onChange={(e) => setPinInputs({ ...pinInputs, [order.id]: e.target.value })}
                      className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white w-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleConfirm(order.id)}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold whitespace-nowrap shadow-lg shadow-orange-600/20"
                    >
                      Confirmar Entrega
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold flex items-center space-x-2">
                  <PackageCheck className="w-4 h-4" />
                  <span>Pedido entregado satisfactoriamente al asiento.</span>
                </div>
              )}

              {results[order.id] && !results[order.id].success && (
                <p className="text-xs text-rose-400 font-bold">{results[order.id].message}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
