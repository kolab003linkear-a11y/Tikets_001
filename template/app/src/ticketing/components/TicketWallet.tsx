import {
  Calendar,
  Lock,
  MapPin,
  QrCode,
  RefreshCw,
  Send,
  ShieldCheck,
  Smartphone,
  Ticket as TicketIcon,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CountdownRing } from "../../client/components/ui/CountdownRing";
import { DynamicQrDisplay } from "../../client/components/ui/DynamicQrDisplay";
import { KpiCard } from "../../client/components/ui/KpiCard";
import { StatusBadge } from "../../client/components/ui/StatusBadge";
import { generateDynamicToken } from "../dynamicToken";
import {
  loadTicketsFromOfflineVault,
  saveTicketsToOfflineVault,
} from "../offlineVault";

export interface TicketData {
  id: string;
  eventTitle: string;
  venueName: string;
  eventDate: string;
  zone: string;
  row: string;
  seatNumber: string;
  ticketSecret: string;
  status: string;
}

const DEFAULT_TICKETS: TicketData[] = [
  {
    id: "tkt_stadium_01",
    eventTitle: "Gran Final: Liga de Campeones - Estadio Monumental",
    venueName: "Estadio Monumental Isidro Romero",
    eventDate: "Sábado 15 de Agosto, 18:00",
    zone: "Tribuna Occidental",
    row: "Fila 14",
    seatNumber: "Asiento 22",
    ticketSecret: "SEC_MONUMENTAL_TKT_88921_SECRET",
    status: "ACTIVE",
  },
  {
    id: "tkt_concert_02",
    eventTitle: "Coldplay: Music of the Spheres World Tour",
    venueName: "Estadio Olímpico Atahualpa",
    eventDate: "Viernes 28 de Agosto, 20:00",
    zone: "Cancha VIP",
    row: "Acceso Puerta 3",
    seatNumber: "Pase 104",
    ticketSecret: "SEC_COLDPLAY_VIP_44012_SECRET",
    status: "ACTIVE",
  },
];

export function TicketWallet({
  isOffline,
  onOpenConcessions,
  onOpenTransfer,
}: {
  isOffline: boolean;
  onOpenConcessions?: (ticket: TicketData) => void;
  onOpenTransfer?: (ticket: TicketData) => void;
}) {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [dynamicToken, setDynamicToken] = useState<string>("");
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);
  const [showLockScreenSimulator, setShowLockScreenSimulator] =
    useState<boolean>(false);

  useEffect(() => {
    // Load from local storage vault or initialize defaults
    const cached = loadTicketsFromOfflineVault();
    if (cached && cached.length > 0) {
      setTickets(cached);
      setSelectedTicket(cached[0]);
    } else {
      setTickets(DEFAULT_TICKETS);
      setSelectedTicket(DEFAULT_TICKETS[0]);
      saveTicketsToOfflineVault(DEFAULT_TICKETS);
    }
  }, []);

  // 30-Second cryptographic token rotation loop
  useEffect(() => {
    if (!selectedTicket) return;

    const updateToken = () => {
      const result = generateDynamicToken(selectedTicket.ticketSecret, 30);
      setDynamicToken(result.token);
      setSecondsRemaining(result.secondsRemaining);
    };

    updateToken();
    const interval = setInterval(updateToken, 1000);
    return () => clearInterval(interval);
  }, [selectedTicket]);

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner: Anti-Fraud & Offline Guarantee */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-500/30 bg-gradient-to-r from-[#0A2540] via-slate-900 to-slate-950 p-6 shadow-2xl">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center space-x-4">
            <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-3.5 text-sky-400 shadow-inner">
              <ShieldCheck className="h-8 w-8 text-[#0EA5E9]" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="font-['Satoshi',sans-serif] text-xl font-bold tracking-tight text-white">
                  Billetera Digital Anti-Fraude
                </h2>
                <StatusBadge
                  status={isOffline ? "OFFLINE" : "ACTIVE"}
                  label={
                    isOffline ? "Caché 100% Offline" : "QR Dinámico Activo"
                  }
                />
              </div>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-300">
                Rotación criptográfica HMAC-SHA256 cada 30 segundos. Acceso
                garantizado en Modo Avión o sin cobertura en estadios.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowLockScreenSimulator(!showLockScreenSimulator)}
            className="flex items-center space-x-2 rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-xs font-semibold text-slate-100 shadow-md transition-all hover:bg-slate-700/90 active:scale-95"
          >
            <Smartphone className="h-4 w-4 text-[#0EA5E9]" />
            <span>
              {showLockScreenSimulator
                ? "Ocultar Widget"
                : "Simular Widget en Bloqueo"}
            </span>
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          title="Entradas en Bóveda"
          value={tickets.length}
          subtitle="100% disponibles offline"
          icon={TicketIcon}
          variant="primary"
          badge="Seguras"
        />
        <KpiCard
          title="Ventana Criptográfica"
          value={`${secondsRemaining}s`}
          subtitle="Rotación automática activa"
          icon={RefreshCw}
          variant="accent"
          badge="HMAC-SHA256"
        />
        <KpiCard
          title="Integridad del Pase"
          value="100% Blindado"
          subtitle="Inmune a capturas y reventa"
          icon={ShieldCheck}
          variant="secondary"
          badge="WCAG AA"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Tickets List */}
        <div className="space-y-4 lg:col-span-5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Mis Entradas Disponibles ({tickets.length})
            </h3>
            <span className="font-mono text-[11px] text-teal-400">
              Bóveda Cifrada
            </span>
          </div>

          {tickets.map((tkt) => {
            const isSelected = selectedTicket?.id === tkt.id;
            return (
              <div
                key={tkt.id}
                onClick={() => setSelectedTicket(tkt)}
                className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200 ${
                  isSelected
                    ? "border-[#0EA5E9] bg-slate-900 shadow-xl shadow-sky-950/40 ring-1 ring-[#0EA5E9]"
                    : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900/90"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="mb-2 inline-block rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-400">
                      {tkt.zone}
                    </span>
                    <h4 className="font-['Satoshi',sans-serif] text-sm font-bold text-white">
                      {tkt.eventTitle}
                    </h4>
                    <div className="mt-1.5 flex items-center space-x-1.5 text-xs text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      <span>{tkt.venueName}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3.5 text-xs">
                  <div className="flex items-center space-x-1 text-slate-400">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    <span>{tkt.eventDate}</span>
                  </div>
                  <span className="rounded-lg border border-sky-500/20 bg-[#0A2540] px-2.5 py-0.5 font-mono font-bold text-[#0EA5E9]">
                    {tkt.row} • {tkt.seatNumber}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Rotating Dynamic Ticket Presentation */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                <div>
                  <h3 className="font-['Satoshi',sans-serif] text-lg font-extrabold text-white">
                    {selectedTicket.eventTitle}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {selectedTicket.venueName}
                  </p>
                </div>
                <StatusBadge status="ACTIVE" label="Pase Autenticado" />
              </div>

              {/* Dynamic QR High Contrast Presentation */}
              <div className="my-6 flex flex-col items-center justify-center">
                <DynamicQrDisplay
                  token={dynamicToken}
                  secondsRemaining={secondsRemaining}
                  ticketId={selectedTicket.id}
                  isOffline={isOffline}
                />

                {/* Animated Countdown Ring Bar */}
                <div className="mt-5 flex w-full max-w-sm items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5">
                  <div className="flex items-center space-x-3">
                    <CountdownRing
                      secondsRemaining={secondsRemaining}
                      totalSeconds={30}
                      size={40}
                      strokeWidth={3.5}
                    />
                    <div>
                      <span className="block text-xs font-bold text-white">
                        Frecuencia de Rotación
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Siguiente token criptográfico
                      </span>
                    </div>
                  </div>
                  <span className="rounded-lg border border-teal-500/20 bg-teal-500/10 px-2.5 py-1 font-mono text-xs font-bold text-teal-400">
                    {secondsRemaining}s
                  </span>
                </div>
              </div>

              {/* Seat Coordinates & Actions */}
              <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-center text-xs">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400">
                    Zona / Tribuna
                  </span>
                  <p className="mt-1 font-['Satoshi',sans-serif] font-bold text-slate-100">
                    {selectedTicket.zone}
                  </p>
                </div>
                <div className="border-x border-slate-800">
                  <span className="text-[10px] font-semibold uppercase text-slate-400">
                    Fila
                  </span>
                  <p className="mt-1 font-mono font-bold text-slate-100">
                    {selectedTicket.row}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400">
                    Asiento
                  </span>
                  <p className="mt-1 font-mono font-bold text-teal-400">
                    {selectedTicket.seatNumber}
                  </p>
                </div>
              </div>

              {/* Action Buttons: In-Seat Food & In-App Transfer */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    onOpenConcessions && onOpenConcessions(selectedTicket)
                  }
                  className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:from-teal-500 hover:to-teal-400 active:scale-95"
                >
                  <UtensilsCrossed className="h-4 w-4" />
                  <span>Pedir Comida al Asiento</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onOpenTransfer && onOpenTransfer(selectedTicket)
                  }
                  className="flex items-center justify-center space-x-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs font-bold text-slate-100 shadow-md transition-all hover:bg-slate-700 active:scale-95"
                >
                  <Send className="h-4 w-4 text-[#0EA5E9]" />
                  <span>Transferir Entrada P2P</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Lock-Screen Widget Simulator Modal / Drawer */}
      {showLockScreenSimulator && selectedTicket && (
        <div className="rounded-3xl border border-sky-500/40 bg-gradient-to-br from-[#0A2540] via-slate-900 to-slate-950 p-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2.5 text-[#0EA5E9]">
              <Lock className="h-4 w-4" />
              <span className="font-['Satoshi',sans-serif] text-xs font-bold uppercase tracking-wider">
                Widget de Pantalla Bloqueada (Live Activity)
              </span>
            </div>
            <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] text-slate-400">
              Acceso instantáneo en 0 toques
            </span>
          </div>

          <div className="mt-5 flex flex-col items-center justify-between gap-6 rounded-2xl border border-slate-800 bg-slate-950/90 p-5 shadow-inner md:flex-row">
            <div className="flex items-center space-x-5">
              <div className="rounded-2xl bg-white p-3 shadow-xl">
                <QrCode className="h-16 w-16 text-slate-950" />
              </div>
              <div>
                <span className="rounded-full border border-sky-500/30 bg-sky-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase text-sky-300">
                  {selectedTicket.zone}
                </span>
                <h4 className="mt-1.5 font-['Satoshi',sans-serif] text-base font-bold text-white">
                  {selectedTicket.eventTitle}
                </h4>
                <p className="mt-0.5 font-mono text-xs text-slate-300">
                  {selectedTicket.row} • {selectedTicket.seatNumber}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center text-right md:items-end">
              <div className="flex items-center space-x-2 font-mono text-xs font-bold text-teal-400">
                <CountdownRing
                  secondsRemaining={secondsRemaining}
                  totalSeconds={30}
                  size={32}
                  strokeWidth={3}
                />
                <span>{secondsRemaining}s para refresco</span>
              </div>
              <p className="mt-1 text-[10px] text-slate-400">
                Listo para escaneo directo en molinetes
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
