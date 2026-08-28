import {
  Bus,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  RefreshCw,
  ShieldCheck,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { useNavigate, useParams } from "react-router";
import { CountdownRing } from "../../client/components/ui/CountdownRing";
import { DynamicQrDisplay } from "../../client/components/ui/DynamicQrDisplay";
import { KpiCard } from "../../client/components/ui/KpiCard";
import { StatusBadge } from "../../client/components/ui/StatusBadge";
import {
  isBusTicketPayloadValid,
} from "../ticketQrGenerator";
import {
  loadBusTicketsFromVault,
  saveSingleBusTicket,
  type CachedBusTicket,
} from "../offlineBusTickets";
import { mockSchedules, mockTickets, mockRoutes } from "../operations";

function getCurrentBusWindowEpoch(intervalSeconds = 30): number {
  return Math.floor(Date.now() / 1000 / intervalSeconds);
}

function generateBusTokenPayload(ticket: CachedBusTicket): string {
  const window = getCurrentBusWindowEpoch(30);
  return `${ticket.qrPayload}_${window.toString(36).toUpperCase()}`;
}

export function BusTicketWallet() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<CachedBusTicket | null>(null);
  const [dynamicToken, setDynamicToken] = useState<string>("");
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Try loading from offline vault first
    const vaultTickets = loadBusTicketsFromVault();
    let found = vaultTickets.find((t) => t.id === ticketId);

    if (!found) {
      // Try mock data
      const mockTicket = mockTickets.find((t) => t.id === ticketId);
      if (mockTicket) {
        const schedule = mockSchedules.find((s) => s.id === mockTicket.scheduleId);
        const route = schedule ? mockRoutes.find((r) => r.id === schedule.routeId) : null;

        found = {
          id: mockTicket.id,
          scheduleId: mockTicket.scheduleId,
          routeOrigin: route?.origin || "Desconocido",
          routeDestination: route?.destination || "Desconocido",
          departureTime: schedule?.departureTime.toISOString() || "",
          arrivalTime: schedule?.arrivalTime?.toISOString() || null,
          busUnitNumber: schedule?.busUnitNumber || "N/A",
          driverName: schedule?.driverName || null,
          seatNumber: mockTicket.seatNumber,
          seatClass: mockTicket.seatClass || "ECONOMY",
          passengerName: mockTicket.passengerName || "Pasajero",
          passengerId: mockTicket.passengerId || null,
          price: mockTicket.price || 0,
          qrPayload: mockTicket.qrPayload || "",
          status: mockTicket.status || "ACTIVE",
          purchaseTime: mockTicket.purchaseTime?.toISOString() || new Date().toISOString(),
        };
        // Save to vault for offline access
        saveSingleBusTicket(found);
      }
    }

    setTicket(found || null);
  }, [ticketId]);

  // Dynamic QR token rotation every 30 seconds
  useEffect(() => {
    if (!ticket) return;

    const updateToken = () => {
      const token = generateBusTokenPayload(ticket);
      setDynamicToken(token);
      const nowSeconds = Math.floor(Date.now() / 1000);
      const remaining = 30 - (nowSeconds % 30);
      setSecondsRemaining(remaining);
    };

    updateToken();
    const interval = setInterval(updateToken, 1000);
    return () => clearInterval(interval);
  }, [ticket]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (ticket) {
      const updated = { ...ticket, status: "ACTIVE" as const };
      saveSingleBusTicket(updated);
      setTicket(updated);
    }
    await new Promise((r) => setTimeout(r, 500));
    setIsRefreshing(false);
  };

  if (!ticket) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400">
        Boleto no encontrado.{" "}
        <WaspRouterLink
          to={routes.BusRoutesRoute.to}
          className="text-teal-400 hover:underline"
        >
          Volver a rutas
        </WaspRouterLink>
      </div>
    );
  }

  const isQrValid = isBusTicketPayloadValid(ticket.qrPayload);
  const departureDate = new Date(ticket.departureTime);
  const isPastDeparture = Date.now() > departureDate.getTime();

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-500/30 bg-gradient-to-r from-[#0A2540] via-slate-900 to-slate-950 p-6 shadow-2xl">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center space-x-4">
            <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-3.5 text-[#0EA5E9] shadow-inner">
              <QrCode className="h-8 w-8 text-[#0EA5E9]" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="font-['Satoshi',sans-serif] text-xl font-bold tracking-tight text-white">
                  Boleto de Bus Interprovincial
                </h2>
                <StatusBadge
                  status={ticket.status === "USED" ? "USED" : isQrValid ? "ACTIVE" : "EXPIRED"}
                  label={ticket.status === "USED" ? "Usado" : isQrValid ? "Válido para Abordar" : "Vencido"}
                />
              </div>
              <p className="mt-1 text-xs text-slate-300">
                {ticket.routeOrigin} → {ticket.routeDestination}
              </p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-xs font-bold text-slate-100 shadow-md transition-all hover:bg-slate-700 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={isRefreshing ? "h-4 w-4 animate-spin text-[#0EA5E9]" : "h-4 w-4 text-[#0EA5E9]"} />
            <span>Renovar Token</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          title="Asiento"
          value={ticket.seatNumber}
          subtitle={ticket.seatClass}
          icon={MapPin}
          variant="primary"
          badge="Reservado"
        />
        <KpiCard
          title="Precio Pagado"
          value={`$${ticket.price.toFixed(2)}`}
          subtitle="USD"
          icon={QrCode}
          variant="accent"
          badge="Confirmado"
        />
        <KpiCard
          title="Ventana de Rotación"
          value={`${secondsRemaining}s`}
          subtitle="Token dinámico"
          icon={Clock}
          variant="secondary"
          badge="HMAC-SHA256"
        />
      </div>

      {/* Dynamic QR & Ticket Details */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* QR Display (Left) */}
        <div className="lg:col-span-6">
          <DynamicQrDisplay
            token={dynamicToken}
            secondsRemaining={secondsRemaining}
            ticketId={ticket.id}
            isOffline={false}
          />

          {/* Offline Cache Status */}
          <div className="mt-4 rounded-xl border border-teal-500/20 bg-teal-500/10 p-3 text-xs text-teal-300">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
              <span>Boleto guardado para acceso offline • Listo en caché local</span>
            </div>
          </div>
        </div>

        {/* Ticket Details (Right) */}
        <div className="space-y-6 lg:col-span-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
            <h3 className="font-['Satoshi',sans-serif] text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Detalles del Viaje
            </h3>

            <div className="space-y-4">
              <div>
                <span className="block text-[10px] font-semibold uppercase text-slate-500">
                  Origen
                </span>
                <p className="mt-1 font-bold text-white">{ticket.routeOrigin}</p>
              </div>

              <div>
                <span className="block text-[10px] font-semibold uppercase text-slate-500">
                  Destino
                </span>
                <p className="mt-1 font-bold text-white">{ticket.routeDestination}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] font-semibold uppercase text-slate-500">
                    Salida
                  </span>
                  <p className="mt-1 flex items-center gap-1.5 font-mono text-sm font-bold text-teal-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {departureDate.toLocaleDateString("es-EC")}
                  </p>
                  <p className="font-mono text-xs text-slate-400">
                    {departureDate.toLocaleTimeString("es-EC")}
                  </p>
                </div>

                <div>
                  <span className="block text-[10px] font-semibold uppercase text-slate-500">
                    Unidad
                  </span>
                  <p className="mt-1 font-mono text-sm font-bold text-white">
                    {ticket.busUnitNumber}
                  </p>
                  <p className="text-xs text-slate-400">
                    Chofer: {ticket.driverName || "Por asignar"}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <span className="block text-[10px] font-semibold uppercase text-slate-500">
                  Pasajero
                </span>
                <div className="mt-1 flex items-center space-x-2">
                  <User className="h-4 w-4 text-slate-500" />
                  <span className="font-bold text-white">{ticket.passengerName}</span>
                </div>
                {ticket.passengerId && (
                  <p className="mt-1 font-mono text-xs text-slate-400">
                    Cédula: {ticket.passengerId}
                  </p>
                )}
              </div>

              <div className="border-t border-slate-800 pt-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Total Pagado:</span>
                  <span className="font-bold text-teal-400">${ticket.price.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Estado:</span>
                  <span className={`font-bold ${
                    ticket.status === "USED"
                      ? "text-rose-400"
                      : isPastDeparture
                        ? "text-amber-400"
                        : "text-teal-400"
                  }`}>
                    {ticket.status === "USED"
                      ? "ABORDADO"
                      : isPastDeparture
                        ? "VENCIDO"
                        : "ACTIVO - LISTO PARA ABORDAR"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate(routes.BusRoutesRoute.to)}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-xs font-bold text-slate-300 transition-all hover:bg-slate-700"
            >
              Otras Rutas
            </button>
            {isPastDeparture && ticket.status !== "USED" && (
              <button
                onClick={handleRefresh}
                className="flex-1 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:from-teal-500 hover:to-teal-400"
              >
                Transferir Boleto
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
