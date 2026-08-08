import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  RefreshCw, 
  Smartphone, 
  Lock, 
  Send, 
  UtensilsCrossed, 
  WifiOff, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  QrCode,
  MapPin,
  Calendar,
  Ticket as TicketIcon
} from "lucide-react";
import { generateDynamicToken } from "../dynamicToken";
import { saveTicketsToOfflineVault, loadTicketsFromOfflineVault } from "../offlineVault";
import { CountdownRing } from "../../client/components/ui/CountdownRing";
import { StatusBadge } from "../../client/components/ui/StatusBadge";
import { DynamicQrDisplay } from "../../client/components/ui/DynamicQrDisplay";
import { KpiCard } from "../../client/components/ui/KpiCard";

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
  const [showLockScreenSimulator, setShowLockScreenSimulator] = useState<boolean>(false);

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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A2540] via-slate-900 to-slate-950 border border-sky-500/30 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 bg-sky-500/10 rounded-2xl border border-sky-500/30 text-sky-400 shadow-inner">
              <ShieldCheck className="w-8 h-8 text-[#0EA5E9]" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold tracking-tight text-white font-['Satoshi',sans-serif]">
                  Billetera Digital Anti-Fraude
                </h2>
                <StatusBadge status={isOffline ? "OFFLINE" : "ACTIVE"} label={isOffline ? "Caché 100% Offline" : "QR Dinámico Activo"} />
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Rotación criptográfica HMAC-SHA256 cada 30 segundos. Acceso garantizado en Modo Avión o sin cobertura en estadios.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowLockScreenSimulator(!showLockScreenSimulator)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 text-xs font-semibold rounded-xl border border-slate-700 transition-all shadow-md active:scale-95"
          >
            <Smartphone className="w-4 h-4 text-[#0EA5E9]" />
            <span>{showLockScreenSimulator ? "Ocultar Widget" : "Simular Widget en Bloqueo"}</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Tickets List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Mis Entradas Disponibles ({tickets.length})
            </h3>
            <span className="text-[11px] text-teal-400 font-mono">Bóveda Cifrada</span>
          </div>

          {tickets.map((tkt) => {
            const isSelected = selectedTicket?.id === tkt.id;
            return (
              <div
                key={tkt.id}
                onClick={() => setSelectedTicket(tkt)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-slate-900 border-[#0EA5E9] shadow-xl shadow-sky-950/40 ring-1 ring-[#0EA5E9]"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-900/90"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-2">
                      {tkt.zone}
                    </span>
                    <h4 className="font-bold text-sm text-white font-['Satoshi',sans-serif]">{tkt.eventTitle}</h4>
                    <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{tkt.venueName}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{tkt.eventDate}</span>
                  </div>
                  <span className="font-mono text-[#0EA5E9] font-bold bg-[#0A2540] px-2.5 py-0.5 rounded-lg border border-sky-500/20">
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
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-extrabold text-white font-['Satoshi',sans-serif]">
                    {selectedTicket.eventTitle}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedTicket.venueName}</p>
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
                <div className="w-full max-w-sm mt-5 p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CountdownRing secondsRemaining={secondsRemaining} totalSeconds={30} size={40} strokeWidth={3.5} />
                    <div>
                      <span className="text-xs font-bold text-white block">Frecuencia de Rotación</span>
                      <span className="text-[10px] text-slate-400">Siguiente token criptográfico</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20">
                    {secondsRemaining}s
                  </span>
                </div>
              </div>

              {/* Seat Coordinates & Actions */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Zona / Tribuna</span>
                  <p className="font-bold text-slate-100 mt-1 font-['Satoshi',sans-serif]">{selectedTicket.zone}</p>
                </div>
                <div className="border-x border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Fila</span>
                  <p className="font-bold text-slate-100 mt-1 font-mono">{selectedTicket.row}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Asiento</span>
                  <p className="font-bold text-teal-400 mt-1 font-mono">{selectedTicket.seatNumber}</p>
                </div>
              </div>

              {/* Action Buttons: In-Seat Food & In-App Transfer */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => onOpenConcessions && onOpenConcessions(selectedTicket)}
                  className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-teal-500/20 active:scale-95"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Pedir Comida al Asiento</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenTransfer && onOpenTransfer(selectedTicket)}
                  className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-bold text-xs transition-all shadow-md active:scale-95"
                >
                  <Send className="w-4 h-4 text-[#0EA5E9]" />
                  <span>Transferir Entrada P2P</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Lock-Screen Widget Simulator Modal / Drawer */}
      {showLockScreenSimulator && selectedTicket && (
        <div className="p-6 bg-gradient-to-br from-[#0A2540] via-slate-900 to-slate-950 border border-sky-500/40 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2.5 text-[#0EA5E9]">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider font-['Satoshi',sans-serif]">
                Widget de Pantalla Bloqueada (Live Activity)
              </span>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
              Acceso instantáneo en 0 toques
            </span>
          </div>

          <div className="mt-5 flex flex-col md:flex-row items-center justify-between gap-6 p-5 bg-slate-950/90 rounded-2xl border border-slate-800 shadow-inner">
            <div className="flex items-center space-x-5">
              <div className="p-3 bg-white rounded-2xl shadow-xl">
                <QrCode className="w-16 h-16 text-slate-950" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 bg-sky-500/20 text-sky-300 rounded-full border border-sky-500/30">
                  {selectedTicket.zone}
                </span>
                <h4 className="text-base font-bold text-white mt-1.5 font-['Satoshi',sans-serif]">
                  {selectedTicket.eventTitle}
                </h4>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  {selectedTicket.row} • {selectedTicket.seatNumber}
                </p>
              </div>
            </div>

            <div className="text-right flex flex-col items-center md:items-end">
              <div className="flex items-center space-x-2 text-xs text-teal-400 font-mono font-bold">
                <CountdownRing secondsRemaining={secondsRemaining} totalSeconds={30} size={32} strokeWidth={3} />
                <span>{secondsRemaining}s para refresco</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Listo para escaneo directo en molinetes</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
