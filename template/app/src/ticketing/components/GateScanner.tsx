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
  AlertTriangle
} from "lucide-react";
import { computeTokenSignature, getCurrentWindowEpoch } from "../dynamicToken";

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
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
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
        title: "⛔ ACCESO DENEGADO: TOKEN DUPLICADO",
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
        title: "✅ ACCESO AUTORIZADO - MOLINETE LIBERADO",
        details: `Boleto válido: ${ticketIdInput} | Tribuna Occidental • Fila 14, Asiento 22`,
      });
      setScanHistory((prev) => [
        {
          id: String(Date.now()),
          ticketId: ticketIdInput,
          scannedAt: new Date().toLocaleTimeString(),
          status: "AUTHORIZED",
          message: "Boleto válido y verificado localmente",
        },
        ...prev,
      ]);
    } else {
      setLastResult({
        status: "ERROR",
        title: "⚠️ TOKEN EXPIRADO / CAPTURA INVÁLIDA",
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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 text-emerald-400">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Validador de Puerta & Molinetes 100% Offline
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Caché Local Activa
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Verifica firmas HMAC-SHA256 en &lt;1.0s sin consultar servidores en la nube.
              </p>
            </div>
          </div>

          <span className="font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            Puerta: <span className="text-indigo-400 font-bold">TURNSTILE-GATE-04</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scanner Simulation Controls */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <QrCode className="w-4 h-4 text-indigo-400" />
            Simulador de Cámara & Óptica de Puerta
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400">ID del Boleto</label>
              <input
                type="text"
                value={ticketIdInput}
                onChange={(e) => setTicketIdInput(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-300 block">Simular Screenshot Estático</span>
                <span className="text-[10px] text-slate-500">Prueba cómo el escáner rechaza capturas viejas</span>
              </div>
              <input
                type="checkbox"
                checked={isSimulatingScreenshot}
                onChange={(e) => setIsSimulatingScreenshot(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded bg-slate-900 border-slate-700"
              />
            </div>

            <button
              type="button"
              onClick={handleSimulateScan}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>Escanear Código QR en Puerta</span>
            </button>
          </div>

          {/* Result Alert Box */}
          {lastResult && (
            <div
              className={`p-4 rounded-2xl border transition-all ${
                lastResult.status === "SUCCESS"
                  ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                  : "bg-rose-950/40 border-rose-500/40 text-rose-300"
              }`}
            >
              <div className="flex items-start space-x-3">
                {lastResult.status === "SUCCESS" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-xs">{lastResult.title}</h4>
                  <p className="text-[11px] opacity-90 mt-0.5">{lastResult.details}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* History of Scans */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-purple-400" />
              Historial de Accesos en Molinete ({scanHistory.length})
            </h3>
            <span className="text-[10px] text-slate-500">Molinete 04</span>
          </div>

          {scanHistory.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No se han registrado escaneos en esta sesión aún.
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {scanHistory.map((scan) => (
                <div
                  key={scan.id}
                  className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-slate-200">{scan.ticketId}</span>
                    <p className="text-[10px] text-slate-400">{scan.message}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                        scan.status === "AUTHORIZED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {scan.status}
                    </span>
                    <span className="block text-[9px] text-slate-500 mt-0.5">{scan.scannedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
