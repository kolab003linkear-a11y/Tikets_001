import { ArrowDownCircle, ArrowUpCircle, Camera } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "../../client/components/ui/StatusBadge";
import { processLprCameraEvent } from "../lprWebhook";

export function FacilityGateMonitor() {
  const [testPlate, setTestPlate] = useState("PCH-4921");
  const [selectedGate, setSelectedGate] = useState("ENTRY");
  const [lastLprResult, setLastLprResult] = useState<any>(null);

  const handleSimulateLpr = () => {
    const result = processLprCameraEvent({
      cameraHardwareId: "ANPR-OPTICAL-CAM-01",
      facilityId: "fac_quicentro_01",
      gateId: selectedGate === "ENTRY" ? "GATE-NORTH-IN" : "GATE-NORTH-OUT",
      eventType: selectedGate as "ENTRY" | "EXIT",
      plateNumber: testPlate,
      confidenceScore: 0.985,
      timestamp: new Date().toISOString(),
    });
    setLastLprResult(result);
  };

  return (
    <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 font-sans shadow-2xl backdrop-blur-xl sm:p-8">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center">
        <div className="flex items-center space-x-3.5">
          <div className="rounded-2xl border border-sky-500/20 bg-[#0A2540] p-3 text-[#0EA5E9]">
            <Camera className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-['Satoshi',sans-serif] text-base font-bold text-white">
              Monitor de Cámara LPR & Actuador de Barrera
            </h3>
            <p className="text-xs text-slate-400">
              Apertura en &lt;2.0s mediante visión computacional y cobro
              invisible.
            </p>
          </div>
        </div>

        <StatusBadge status="ACTIVE" label="Cámara en Vivo: ACTIVA" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Controls */}
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">
              Placa Detectada por Visión Artificial
            </label>
            <input
              type="text"
              value={testPlate}
              onChange={(e) => setTestPlate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-teal-400 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">
              Punto de Control / Barrera
            </label>
            <select
              value={selectedGate}
              onChange={(e) => setSelectedGate(e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-teal-500 focus:outline-none"
            >
              <option value="ENTRY">
                🟢 BARRERA NORTE (Ingreso Vehicular)
              </option>
              <option value="EXIT">
                🔴 BARRERA SUR (Salida y Cobro Invisible)
              </option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleSimulateLpr}
            className="active:scale-98 w-full rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:from-teal-500 hover:to-teal-400"
          >
            Disparar Evento LPR y Actuar Barrera (&lt;2.0s)
          </button>
        </div>

        {/* Live Result & Barrier Status */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
          <div>
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Estado de la Barrera
            </span>
            {lastLprResult ? (
              <div className="space-y-3">
                <div
                  className={`flex items-center space-x-3 rounded-xl border p-4 ${
                    lastLprResult.openBarrier
                      ? "border-teal-500/40 bg-teal-950/40 text-teal-200"
                      : "border-rose-500/40 bg-rose-950/40 text-rose-200"
                  }`}
                >
                  {lastLprResult.openBarrier ? (
                    <ArrowUpCircle className="h-8 w-8 flex-shrink-0 animate-bounce text-teal-400" />
                  ) : (
                    <ArrowDownCircle className="h-8 w-8 flex-shrink-0 text-rose-400" />
                  )}
                  <div>
                    <h4 className="font-['Satoshi',sans-serif] text-sm font-extrabold">
                      {lastLprResult.openBarrier
                        ? "BARRERA LEVANTADA"
                        : "BARRERA CERRADA"}
                    </h4>
                    <p className="text-xs">{lastLprResult.displayMessage}</p>
                  </div>
                </div>

                <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-900 p-3 font-mono text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Confianza Óptica:</span>
                    <span className="font-bold text-teal-400">
                      98.5% ANPR Score
                    </span>
                  </div>
                  {lastLprResult.totalCharged !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cobro Invisible:</span>
                      <span className="font-bold text-white">
                        ${lastLprResult.totalCharged.toFixed(2)} USD
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">
                Esperando captura de placa por la cámara LPR...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
