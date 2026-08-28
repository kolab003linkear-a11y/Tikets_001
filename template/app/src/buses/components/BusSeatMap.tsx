import {
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  MapPin,
  Route,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  Link as WaspRouterLink,
  routes,
} from "wasp/client/router";
import { useNavigate, useParams } from "react-router";
import { KpiCard } from "../../client/components/ui/KpiCard";
import { StatusBadge } from "../../client/components/ui/StatusBadge";
import {
  mockSchedules,
  mockTickets,
  purchaseBusTicket,
} from "../operations";
import {
  BusSeatClass,
  getSeatClassPriceMultiplier,
  generateSeatMap,
  STANDARD_BUS_LAYOUT,
  SeatInfo,
} from "../seatMapper";
import { calculateBusTicketPrice } from "../busPriceCalculator";

interface PassengerForm {
  name: string;
  id: string;
  seatClass: BusSeatClass;
}

const SEAT_CLASS_LABELS: Record<BusSeatClass, string> = {
  ECONOMY: "Económica",
  SEMI_CAMA: "Semi-Cama",
  CAMA: "Cama",
  VIP: "VIP",
};

const SEAT_CLASS_COLORS: Record<BusSeatClass, string> = {
  ECONOMY: "border-slate-700 bg-slate-800 text-slate-300",
  SEMI_CAMA: "border-sky-500/50 bg-sky-500/10 text-sky-300",
  CAMA: "border-teal-500/50 bg-teal-500/10 text-teal-300",
  VIP: "border-amber-500/50 bg-amber-500/10 text-amber-300",
};

const TAKEN_SEAT_COLOR = "border-rose-500/50 bg-rose-500/20 text-rose-300";
const BLOCKED_SEAT_COLOR = "border-slate-600 bg-slate-800 text-slate-600";

export function BusSeatMap() {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const navigate = useNavigate();

  const schedule = mockSchedules.find((s) => s.id === scheduleId);

  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [showPassengerForm, setShowPassengerForm] = useState(false);
  const [passengerForm, setPassengerForm] = useState<PassengerForm>({
    name: "",
    id: "",
    seatClass: "ECONOMY",
  });
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<any>(null);

  if (!schedule) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400">
        Horario no encontrado.
      </div>
    );
  }

  // Get taken seats from mock data
  const takenSeatNumbers = mockTickets
    .filter(
      (t) => t.scheduleId === scheduleId && t.status === "ACTIVE",
    )
    .map((t) => t.seatNumber);

  // Generate seat map
  const layout = STANDARD_BUS_LAYOUT.ECONOMY_40_SEAT;
  const allSeats = generateSeatMap({
    ...layout,
    blockedSeats: takenSeatNumbers,
  });

  // Group seats by row for grid rendering
  const rows = new Map<string, SeatInfo[]>();
  allSeats.forEach((seat) => {
    if (!rows.has(seat.row)) {
      rows.set(seat.row, []);
    }
    rows.get(seat.row)!.push(seat);
  });

  const rowLetters = Array.from(rows.keys());
  const rowEntries = Array.from(rows.entries());

  // Calculate price for selection
  const multiplier = selectedSeat
    ? getSeatClassPriceMultiplier(passengerForm.seatClass)
    : 1.0;
  const priceBreakdown = calculateBusTicketPrice(
    Number(schedule.basePrice),
    passengerForm.seatClass,
  );

  const handleSeatClick = (seat: SeatInfo) => {
    if (seat.isAisle || seat.isBlocked || seat.seatNumber === "") return;
    if (takenSeatNumbers.includes(seat.seatNumber)) return;
    setSelectedSeat(seat.seatNumber);
    setShowPassengerForm(true);
    setPurchaseResult(null);
  };

  const handlePurchase = async () => {
    if (!selectedSeat) return;
    setIsPurchasing(true);

    const res = await purchaseBusTicket(
      {
        scheduleId: schedule.id,
        seatNumber: selectedSeat,
        seatClass: passengerForm.seatClass,
        passengerName: passengerForm.name,
        passengerId: passengerForm.id,
      },
      {},
    );

    setIsPurchasing(false);
    setPurchaseResult(res);
  };

  const handlePassengerFormChange = (field: keyof PassengerForm, value: any) => {
    setPassengerForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="rounded-3xl border border-sky-500/30 bg-gradient-to-r from-[#0A2540] via-slate-900 to-slate-950 p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center space-x-4">
            <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-3.5 text-[#0EA5E9] shadow-inner">
              <Route className="h-8 w-8 text-[#0EA5E9]" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="font-['Satoshi',sans-serif] text-xl font-bold tracking-tight text-white">
                  Selección de Asientos
                </h2>
                <StatusBadge status="ACTIVE" label="Reserva en Vivo" />
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Unidad {schedule.busUnitNumber} • Chofer: {schedule.driverName || "Por asignar"}
              </p>
            </div>
          </div>

          <WaspRouterLink
            to={routes.BusRoutesRoute.to}
            className="flex items-center space-x-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-300 transition-all hover:border-teal-500 hover:text-teal-400"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Volver a Rutas</span>
          </WaspRouterLink>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Seat Map */}
        <div className="space-y-6 lg:col-span-8">
          <h3 className="font-['Satoshi',sans-serif] text-xs font-bold uppercase tracking-wider text-slate-400">
            Plano de Asientos • Clase: {SEAT_CLASS_LABELS[passengerForm.seatClass]}
          </h3>

          {/* Seat Legend */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="h-4 w-4 rounded border border-slate-700 bg-slate-800" />
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`h-4 w-4 rounded border ${TAKEN_SEAT_COLOR.split(" ")[0]} ${TAKEN_SEAT_COLOR.split(" ")[1]}`} />
              <span>Ocupado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-4 w-4 rounded border border-amber-500/50 bg-amber-500/10" />
              <span>VIP</span>
            </div>
          </div>

          {/* Seat Grid */}
          <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            {rowEntries.map(([rowLetter, seats]) => (
              <div key={rowLetter} className="flex items-center justify-center gap-1.5 py-1">
                <span className="font-mono text-xs font-bold text-slate-500 w-5 text-right">
                  {rowLetter}
                </span>
                {seats.map((seat) => {
                  if (seat.isAisle) {
                    return (
                      <div key={`aisle-${rowLetter}`} className="w-6" />
                    );
                  }

                  const isTaken = takenSeatNumbers.includes(seat.seatNumber);
                  const isDisabled = seat.isBlocked || isTaken;
                  const isSelected = selectedSeat === seat.seatNumber;

                  const colorClass = isTaken
                    ? BLOCKED_SEAT_COLOR
                    : isSelected
                      ? "border-teal-500 bg-teal-500/20 text-teal-300"
                      : SEAT_CLASS_COLORS[seat.seatClass];

                  return (
                    <button
                      key={seat.seatNumber}
                      onClick={() => handleSeatClick(seat)}
                      disabled={isDisabled}
                      className={`relative h-11 w-11 rounded-lg border text-xs font-bold transition-all duration-200 disabled:cursor-not-allowed ${colorClass} ${
                        isSelected ? "ring-2 ring-teal-400" : ""
                      }`}
                    >
                      <div className="flex h-full w-full items-center justify-center">
                        {seat.seatNumber.replace(rowLetter, "")}
                      </div>
                      {seat.seatClass !== "ECONOMY" && (
                        <span className="absolute -top-1 -right-1 rounded-full border border-slate-700 bg-[#0A2540] px-1 text-[8px] text-[#0EA5E8]">
                          {seat.seatClass === "VIP" && "★"}
                          {seat.seatClass === "CAMA" && "⎂"}
                          {seat.seatClass === "SEMI_CAMA" && "Ɽ"}
                        </span>
                      )}
                    </button>
                  );
                })}
                <span className="font-mono text-xs font-bold text-slate-500 w-5">
                  {rowLetter}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Panel */}
        <div className="space-y-6 lg:col-span-4">
          <h3 className="font-['Satoshi',sans-serif] text-xs font-bold uppercase tracking-wider text-slate-400">
            Detalles del Viaje
          </h3>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
            <div className="space-y-4 text-xs">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span className="font-bold text-white">
                  {schedule.busUnitNumber}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-semibold uppercase text-slate-500">
                  Salida
                </span>
                <span className="font-bold text-teal-400">
                  {new Date(schedule.departureTime).toLocaleString("es-EC")}
                </span>
              </div>
              {schedule.arrivalTime && (
                <div>
                  <span className="block text-[10px] font-semibold uppercase text-slate-500">
                    Llegada Estimada
                  </span>
                  <span className="font-bold text-sky-400">
                    {new Date(schedule.arrivalTime).toLocaleString("es-EC")}
                  </span>
                </div>
              )}
              <div className="border-t border-slate-800 pt-3">
                <span className="block text-[10px] font-semibold uppercase text-slate-500">
                  Precio Total
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-['Satoshi',sans-serif] text-2xl font-extrabold text-white">
                    ${priceBreakdown.total.toFixed(2)}
                  </span>
                  <span className="font-mono text-xs text-slate-500">
                    {SEAT_CLASS_LABELS[passengerForm.seatClass]} (+{Math.round((multiplier - 1) * 100)}%)
                  </span>
                </div>
                <div className="mt-2 space-y-1 font-mono text-[10px] text-slate-500">
                  <div className="flex justify-between">
                    <span>Base</span>
                    <span>${priceBreakdown.basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tarifa</span>
                    <span>${priceBreakdown.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impuestos 12%</span>
                    <span>${priceBreakdown.taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1 font-bold text-white">
                    <span>Total</span>
                    <span>${priceBreakdown.total.toFixed(2)} USD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Passenger Form */}
          {showPassengerForm && selectedSeat && !purchaseResult?.success && (
            <div className="rounded-2xl border border-teal-500/40 bg-slate-900/90 p-6 shadow-xl">
              <h4 className="font-['Satoshi',sans-serif] text-sm font-bold text-white mb-4">
                Pasajero • Asiento {selectedSeat}
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <User className="h-3.5 w-3.5" />
                    <span>Nombre Completo</span>
                  </label>
                  <input
                    type="text"
                    value={passengerForm.name}
                    onChange={(e) => handlePassengerFormChange("name", e.target.value)}
                    placeholder="María Fernanda Loor"
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <span>Clase</span>
                  </label>
                  <select
                    value={passengerForm.seatClass}
                    onChange={(e) =>
                      handlePassengerFormChange("seatClass", e.target.value as BusSeatClass)
                    }
                    className="mt-1.5 w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-bold text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="ECONOMY">Económica (+0%)</option>
                    <option value="SEMI_CAMA">Semi-Cama (+30%)</option>
                    <option value="CAMA">Cama (+60%)</option>
                    <option value="VIP">VIP (+100%)</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <span>Cédula / Pasaporte</span>
                  </label>
                  <input
                    type="text"
                    value={passengerForm.id}
                    onChange={(e) => handlePassengerFormChange("id", e.target.value)}
                    placeholder="1723456789"
                    className="mt-1.5 font-mono w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-bold text-teal-400 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handlePurchase}
                disabled={
                  isPurchasing ||
                  !passengerForm.name.trim() ||
                  !passengerForm.id.trim()
                }
                className="mt-4 active:scale-98 flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:from-teal-500 hover:to-teal-400 disabled:opacity-50"
              >
                <CreditCard className="h-4 w-4" />
                <span>
                  {isPurchasing ? "Procesando..." : "Confirmar y Pagar"}
                </span>
              </button>
            </div>
          )}

          {/* Purchase Result */}
          {purchaseResult && (
            <div
              className={`rounded-2xl border p-5 text-xs ${
                purchaseResult.success
                  ? "border-teal-500/40 bg-teal-950/40 text-teal-200"
                  : "border-rose-500/40 bg-rose-950/40 text-rose-200"
              }`}
            >
              <div className="flex items-center space-x-2 font-bold">
                {purchaseResult.success ? (
                  <CheckCircle2 className="h-5 w-5 text-teal-400" />
                ) : (
                  <X className="h-5 w-5 text-rose-400" />
                )}
                <span>{purchaseResult.message}</span>
              </div>
              {purchaseResult.success && (
                <WaspRouterLink
                  to={routes.BusTicketRoute.build({
                    params: { ticketId: purchaseResult.ticket?.id || "unknown" },
                  }) as never}
                  className="mt-3 block w-full rounded-xl border border-teal-500/30 bg-teal-950/30 py-2 text-center text-xs font-bold text-teal-300 transition-colors hover:bg-teal-950/50"
                >
                  Ver Mi Boleto →
                </WaspRouterLink>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
