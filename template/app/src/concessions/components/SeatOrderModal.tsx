import React, { useState } from "react";
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  Plus, 
  Minus,
  ArrowRight,
  X,
  CreditCard
} from "lucide-react";
import { mockMenu, submitSeatOrder } from "../operations";
import { StatusBadge } from "../../client/components/ui/StatusBadge";

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

  const total = calculateTotal();

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-2xl font-sans relative">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-[#0A2540] rounded-2xl border border-sky-500/20 text-[#0EA5E9]">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-['Satoshi',sans-serif]">
              Pedido al Asiento & Billetera del Estadio
            </h3>
            <p className="text-xs text-slate-400">
              Disfruta el evento sin hacer filas en los pasillos ni perderte las mejores jugadas.
            </p>
          </div>
        </div>

        {/* Pre-populated Seat Coordinates */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-[#0EA5E9] font-bold">
          <MapPin className="w-3.5 h-3.5 text-teal-400" />
          <span>{ticketZone} • {ticketRow} • {ticketSeat}</span>
        </div>
      </div>

      {orderResult ? (
        <div className="p-6 bg-slate-950/90 rounded-2xl border border-teal-500/40 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-teal-400 mx-auto" />
          <h4 className="text-base font-bold text-white font-['Satoshi',sans-serif]">
            ¡Pedido Confirmado con Éxito!
          </h4>
          <p className="text-xs text-slate-300 max-w-md mx-auto">{orderResult.message}</p>
          <div className="py-2.5 px-5 bg-teal-500/10 rounded-xl border border-teal-500/20 inline-block font-mono text-teal-400 font-bold text-sm">
            PIN de Recepción: {orderResult.order?.deliveryPin || "PIN-8842"}
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-full mt-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all"
            >
              Volver al Boleto
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-3">
            {mockMenu.map((item) => {
              const qty = quantities[item.id] || 0;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-800 bg-slate-950/70 flex items-center justify-between shadow-sm"
                >
                  <div>
                    <h5 className="text-xs font-bold text-white font-['Satoshi',sans-serif]">{item.name}</h5>
                    <span className="text-[11px] font-mono text-teal-400 font-bold">
                      ${item.price.toFixed(2)} USD
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, -1)}
                      className="p-1 text-slate-400 hover:text-white rounded transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs font-bold text-white min-w-[16px] text-center">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, 1)}
                      className="p-1 text-slate-400 hover:text-white rounded transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold">Total a Debitar en Asiento</span>
            <span className="text-base font-extrabold text-teal-400 font-mono">
              ${total.toFixed(2)} USD
            </span>
          </div>

          <button
            type="button"
            disabled={isSubmitting || total === 0}
            onClick={handleSubmit}
            className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-40 active:scale-98"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isSubmitting ? "Enviando a Cocina..." : `Confirmar Pedido a ${ticketSeat}`}</span>
          </button>
        </div>
      )}
    </div>
  );
}
