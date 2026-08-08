import React, { useState } from "react";
import { 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Camera, 
  RotateCw, 
  History, 
  Flame,
  AlertTriangle,
  Scan,
  ShieldCheck,
  Check
} from "lucide-react";
import { computeTokenSignature, getCurrentWindowEpoch } from "../dynamicToken";
import { KpiCard } from "../../client/components/ui/KpiCard";
import { StatusBadge } from "../../client/components/ui/StatusBadge";

interface ScanRecord {
  id: string;
  ticketId: string;
  scannedAt: string;
  status: "AUTHORIZED" | "REJECTED_EXPIRED" | "REJECTED_DUPLICATE";
  message: string;
}

export function GateScanner() {
  const [ticketIdInput, setTicketIdInput] = useState("tkt_stadium_01");
  const [secretInput, setSecretInput] = useState("SEC_MONUMENTAL_TKT_88921_SECRET");
  const [tokenInput, setTokenInput] = useState("");
  const [isSimulatingScreenshot, setIsSimulatingScreenshot] = useState(false);
  const [lastResult, setLastResult] = useState<{
    status: "SUCCESS" | "ERROR";
    title: string;
    details: string;
  } | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([
    {
      id: "scan_01",
      ticketId: "tkt_stadium_01",
      scannedAt: "18:02:14",
      status: "AUTHORIZED",
      message: "Entrada autorizada • Puerta 4 Molinete 2",
    }
  ]);
  const [consumedTokens, setConsumedTokens] = useState<Set<string>>(new Set());

  const handleSimulateScan = () => {
    const epoch = getCurrentWindowEpoch(30);
    // If simulating old screenshot, use an expired epoch (e.g. 5 minutes ago)
    const effectiveEpoch = isSimulatingScreenshot ? epoch - 10 : epoch;
    const computedToken = computeTokenSignature(secretInput, effectiveEpoch);

    const fullPayload = tokenInput || computedToken;

    // Check if token was already consumed at this turnstile
    if (consumedTokens.has(fullPayload)) {
      setLastResult({
        status: "ERROR",
        title: "ACCESO DENEGADO: TOKEN DUPLICADO",
        details: "Este código QR dinámico ya fue escaneado e invalidado en el molinete.",
      });
      setScanHistory((prev) => [
        {
          id: String(Date.now()),
          ticketId: ticketIdInput,
          scannedAt: new Date().toLocaleTimeString(),
          status: "REJECTED_DUPLICATE",
          message: "Token duplicado / Clonación detectada",
        },
        ...prev,
      ]);
      return;
    }

    // Check validity window (current epoch or +/- 1)
    const expectedCurrent = computeTokenSignature(secretInput, epoch);
    const expectedPrev = computeTokenSignature(secretInput, epoch - 1);
    const isValid = fullPayload === expectedCurrent || fullPayload === expectedPrev;

    if (isValid) {
      setConsumedTokens((prev) => new Set([...prev, fullPayload]));
      setLastResult({
        status: "SUCCESS",
        title: "ACCESO AUTORIZADO - MOLINETE LIBERADO",
        details: `Boleto válido: ${ticketIdInput} | Tribuna Occidental • Fila 14, Asiento 22`,
      });
      setScanHistory((prev) => [
        {
          id: String(Date.now()),
          ticketId: ticketIdInput,
          scannedAt: new Date().toLocaleTimeString(),
          status: "AUTHORIZED",
          message: "Boleto válido y verificado localmente (<1.0s)",
        },
        ...prev,
      ]);
    } else {
      setLastResult({
        status: "ERROR",
        title: "TOKEN EXPIRADO / CAPTURA INVÁLIDA",
        details: "La firma criptográfica no coincide con la ventana de tiempo actual (Screenshot detectado).",
      });
      setScanHistory((prev) => [
        {
          id: String(Date.now()),
          ticketId: ticketIdInput,
          scannedAt: new Date().toLocaleTimeString(),
          status: "REJECTED_EXPIRED",
          message: "Token vencido / Captura de pantalla estática",
        },
        ...prev,
      ]);
    }
  };

  const totalScans = scanHistory.length;
  const authorizedScans = scanHistory.filter((s) => s.status === "AUTHORIZED").length;
  const rejectedScans = totalScans - authorizedScans;

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0A2540] via-slate-900 to-slate-950 border border-sky-500/30 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 bg-sky-500/10 rounded-2xl border border-sky-500/30 text-sky-400">
              <Camera className="w-8 h-8 text-[#0EA5E9]" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-white font-['Satoshi',sans-serif]">
                  Escáner de Molinete para Operador
                </h2>
                <StatusBadge status="ACTIVE" label="Molinete en Línea (<1.0s)" />
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Validación local contra manifiesto descargado. Detecta screenshots, grabaciones y pases duplicados.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-3 py-1.5 rounded-full border border-teal-500/20">
            Puerta 4 • Molinete 02
          </span>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Escaneos Totales"
          value={totalScans}
          subtitle="Turno actual"
          icon={Scan}
          variant="primary"
          badge="En Vivo"
        />
        <KpiCard
          title="Accesos Autorizados"
          value={authorizedScans}
          subtitle="Torniquete liberado"
          icon={CheckCircle2}
          variant="accent"
          badge="100% OK"
        />
        <KpiCard
          title="Intentos Rechazados"
          value={rejectedScans}
          subtitle="Screenshots / Expirados"
          icon={ShieldAlert}
          variant={rejectedScans > 0 ? "alert" : "primary"}
          badge="Seguridad"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Scanner Simulation Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-['Satoshi',sans-serif]">
              Simulador de Entrada de Cámara
            </h3>

            {/* Visual Viewfinder Mockup */}
            <div className="relative aspect-video bg-slate-950 rounded-2xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center p-6 overflow-hidden">
              <div className="relative p-6 border-2 border-[#14B8A6] rounded-2xl animate-pulse bg-teal-500/5">
                <QrCode className="w-24 h-24 text-slate-400" />
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-teal-400" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-teal-400" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-teal-400" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-teal-400" />
              </div>
              <span className="text-[11px] font-mono text-slate-400 mt-3">
                Apunte el código QR dinámico al visor
              </span>
            </div>

            {/* Test Inputs */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400">ID de Boleto a Escanear</label>
                <input
                  type="text"
                  value={ticketIdInput}
                  onChange={(e) => setTicketIdInput(e.target.value)}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              {/* Anti-Fraud Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">Simular Screenshot Estático</span>
                    <span className="text-[10px] text-slate-400">Envía un token antiguo de hace 5 minutos</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isSimulatingScreenshot}
                  onChange={(e) => setIsSimulatingScreenshot(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-teal-500 focus:ring-teal-500 cursor-pointer"
                />
              </div>

              {/* Scan Trigger Button */}
              <button
                type="button"
                onClick={handleSimulateScan}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-teal-500/20 active:scale-98 flex items-center justify-center space-x-2"
              >
                <Scan className="w-4 h-4" />
                <span>Ejecutar Escaneo y Validación Local</span>
              </button>
            </div>

            {/* Last Result Banner */}
            {lastResult && (
              <div
                className={`p-5 rounded-2xl border ${
                  lastResult.status === "SUCCESS"
                    ? "bg-teal-950/40 border-teal-500/40 text-teal-200"
                    : "bg-rose-950/40 border-rose-500/40 text-rose-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {lastResult.status === "SUCCESS" ? (
                    <CheckCircle2 className="w-6 h-6 text-teal-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-400 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="font-extrabold text-sm tracking-tight">{lastResult.title}</h4>
                    <p className="text-xs opacity-90 mt-0.5">{lastResult.details}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scan Audit Log */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-['Satoshi',sans-serif]">
              <History className="w-4 h-4 text-slate-500" /> Registro de Auditoría en Puerta
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Tiempo Real</span>
          </div>

          <div className="space-y-3">
            {scanHistory.map((scan) => (
              <div
                key={scan.id}
                className={`p-4 rounded-2xl border bg-slate-900/80 transition-all ${
                  scan.status === "AUTHORIZED"
                    ? "border-slate-800"
                    : "border-rose-500/30 bg-rose-950/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white">{scan.ticketId}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{scan.scannedAt}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-slate-300">{scan.message}</p>
                  <StatusBadge
                    status={scan.status === "AUTHORIZED" ? "ACTIVE" : "ALERT"}
                    label={scan.status === "AUTHORIZED" ? "Válido" : "Rechazado"}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
