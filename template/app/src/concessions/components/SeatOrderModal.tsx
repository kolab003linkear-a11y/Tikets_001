import {
  CheckCircle2,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useState } from "react";
import { mockMenu, submitSeatOrder } from "../operations";

interface SubmitSeatOrderResponse {
  success: boolean;
  order?: {
    id: string;
    deliveryPin: string;
  };
  message: string;
}

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
  const [orderResult, setOrderResult] = useState<SubmitSeatOrderResponse | null>(
    null,
  );

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
      {},
    );

    setIsSubmitting(false);
    setOrderResult(res);
  };

  const total = calculateTotal();

  return (
    <div className="relative space-y-6 rounded-3xl border border-slate-800 bg-slate-900/95 p-6 font-sans shadow-2xl backdrop-blur-2xl sm:p-8">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full bg-slate-800/80 p-2 text-slate-400 transition-all hover:bg-slate-700 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center space-x-3.5">
          <div className="rounded-2xl border border-sky-500/20 bg-[#0A2540] p-3 text-[#0EA5E9]">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-['Satoshi',sans-serif] text-base font-bold text-white">
              Pedido al Asiento & Billetera del Estadio
            </h3>
            <p className="text-xs text-slate-400">
              Disfruta el evento sin hacer filas en los pasillos ni perderte las
              mejores jugadas.
            </p>
          </div>
        </div>

        {/* Pre-populated Seat Coordinates */}
        <div className="flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 font-mono text-xs font-bold text-[#0EA5E9]">
          <MapPin className="h-3.5 w-3.5 text-teal-400" />
          <span>
            {ticketZone} • {ticketRow} • {ticketSeat}
          </span>
        </div>
      </div>

      {orderResult ? (
        <div className="space-y-4 rounded-2xl border border-teal-500/40 bg-slate-950/90 p-6 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-teal-400" />
          <h4 className="font-['Satoshi',sans-serif] text-base font-bold text-white">
            ¡Pedido Confirmado con Éxito!
          </h4>
          <p className="mx-auto max-w-md text-xs text-slate-300">
            {orderResult.message}
          </p>
          <div className="inline-block rounded-xl border border-teal-500/20 bg-teal-500/10 px-5 py-2.5 font-mono text-sm font-bold text-teal-400">
            PIN de Recepción: {orderResult.order?.deliveryPin || "PIN-8842"}
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-white transition-all hover:bg-slate-700"
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
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4 shadow-sm"
                >
                  <div>
                    <h5 className="font-['Satoshi',sans-serif] text-xs font-bold text-white">
                      {item.name}
                    </h5>
                    <span className="font-mono text-[11px] font-bold text-teal-400">
                      ${item.price.toFixed(2)} USD
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, -1)}
                      className="rounded p-1 text-slate-400 transition-colors hover:text-white"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-[16px] text-center font-mono text-xs font-bold text-white">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, 1)}
                      className="rounded p-1 text-slate-400 transition-colors hover:text-white"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs">
            <span className="font-semibold text-slate-400">
              Total a Debitar en Asiento
            </span>
            <span className="font-mono text-base font-extrabold text-teal-400">
              ${total.toFixed(2)} USD
            </span>
          </div>

          <button
            type="button"
            disabled={isSubmitting || total === 0}
            onClick={handleSubmit}
            className="active:scale-98 flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 py-3.5 text-xs font-bold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:from-teal-500 hover:to-teal-400 disabled:opacity-40"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>
              {isSubmitting
                ? "Enviando a Cocina..."
                : `Confirmar Pedido a ${ticketSeat}`}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
