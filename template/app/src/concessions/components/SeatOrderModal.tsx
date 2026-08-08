import React, { useState } from "react";
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  Plus, 
  Minus,
  ArrowRight
} from "lucide-react";
import { mockMenu, submitSeatOrder } from "../operations";

export function SeatOrderModal({
  ticketZone = "Tribuna Occidental",
  ticketRow = "Fila 14",
  ticketSeat = "Asiento 22",
  onClose,
}: {
  ticketZone?: string;
  ticketRow?: string;
  ticketSeat?: string;
  onClose?: () => void;
}) {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({
    item_01: 1,
    item_02: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);

  const calculateTotal = () => {
    return mockMenu.reduce((acc, item) => {
      const q = quantities[item.id] || 0;
      return acc + q * item.price;
    }, 0);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleSubmit = async () => {
    const total = calculateTotal();
    if (total === 0) return;

    setIsSubmitting(true);
    const items = mockMenu
      .filter((m) => (quantities[m.id] || 0) > 0)
      .map((m) => ({ name: m.name, qty: quantities[m.id], price: m.price }));

    const res = await submitSeatOrder(
      {
        seatZone: ticketZone,
        seatRow: ticketRow,
        seatNumber: ticketSeat,
        items,
        totalAmount: total,
      },
      {}
    );

    setIsSubmitting(false);
    setOrderResult(res);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-400">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Pedido al Asiento & Billetera del Estadio</h3>
            <p className="text-xs text-slate-400">Disfruta el espectáculo sin hacer filas en los pasillos.</p>
          </div>
        </div>

        {/* Pre-populated Seat Coordinates */}
        <div className="flex items-center space-x-1.5 px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-indigo-400">
          <MapPin className="w-3.5 h-3.5" />
          <span>{ticketZone} • {ticketRow} • {ticketSeat}</span>
        </div>
      </div>

      {orderResult ? (
        <div className="p-6 bg-slate-950 rounded-2xl border border-emerald-500/40 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h4 className="text-sm font-bold text-white">¡Pedido Confirmado con Éxito!</h4>
          <p className="text-xs text-slate-300">{orderResult.message}</p>
          <div className="py-2 px-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 inline-block font-mono text-emerald-400 font-bold text-sm">
            PIN de Recepción: {orderResult.order?.deliveryPin}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mockMenu.map((item) => {
              const qty = quantities[item.id] || 0;
              return (
                <div
                  key={item.id}
                  className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="text-[9px] font-bold uppercase text-slate-500">{item.category}</span>
                    <h5 className="text-xs font-bold text-white">{item.name}</h5>
                    <p className="text-xs font-mono font-bold text-amber-400 mt-0.5">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center space-x-2 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, -1)}
                      className="text-slate-400 hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-xs font-bold text-white w-4 text-center">{qty}</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, 1)}
                      className="text-slate-400 hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Total a Debitar</span>
              <p className="text-lg font-extrabold text-white font-mono">${calculateTotal().toFixed(2)}</p>
            </div>

            <button
              type="button"
              disabled={isSubmitting || calculateTotal() === 0}
              onClick={handleSubmit}
              className="py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isSubmitting ? "Enviando..." : "Confirmar Pedido al Asiento"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
