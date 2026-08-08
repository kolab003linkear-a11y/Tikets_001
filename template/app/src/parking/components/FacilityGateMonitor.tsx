import React, { useState } from "react";
import { 
  Camera, 
  CheckCircle2, 
  XCircle, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Receipt,
  Car,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import { processLprCameraEvent } from "../lprWebhook";
import { KpiCard } from "../../client/components/ui/KpiCard";
import { StatusBadge } from "../../client/components/ui/StatusBadge";

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
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-[#0A2540] rounded-2xl border border-sky-500/20 text-[#0EA5E9]">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-['Satoshi',sans-serif]">
              Monitor de Cámara LPR & Actuador de Barrera
            </h3>
            <p className="text-xs text-slate-400">
              Apertura en &lt;2.0s mediante visión computacional y cobro invisible.
            </p>
          </div>
        </div>

        <StatusBadge status="ACTIVE" label="Cámara en Vivo: ACTIVA" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Placa Detectada por Visión Artificial
            </label>
            <input
              type="text"
              value={testPlate}
              onChange={(e) => setTestPlate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-teal-400 uppercase tracking-widest focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Punto de Control / Barrera</label>
            <select
              value={selectedGate}
              onChange={(e) => setSelectedGate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:border-teal-500 focus:outline-none cursor-pointer"
            >
              <option value="ENTRY">🟢 BARRERA NORTE (Ingreso Vehicular)</option>
              <option value="EXIT">🔴 BARRERA SUR (Salida y Cobro Invisible)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleSimulateLpr}
            className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all active:scale-98"
          >
            Disparar Evento LPR y Actuar Barrera (&lt;2.0s)
          </button>
        </div>

        {/* Live Result & Barrier Status */}
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
              Estado de la Barrera
            </span>
            {lastLprResult ? (
              <div className="space-y-3">
                <div
                  className={`p-4 rounded-xl border flex items-center space-x-3 ${
                    lastLprResult.barrierOpen
                      ? "bg-teal-950/40 border-teal-500/40 text-teal-200"
                      : "bg-rose-950/40 border-rose-500/40 text-rose-200"
                  }`}
                >
                  {lastLprResult.barrierOpen ? (
                    <ArrowUpCircle className="w-8 h-8 text-teal-400 flex-shrink-0 animate-bounce" />
                  ) : (
                    <ArrowDownCircle className="w-8 h-8 text-rose-400 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="font-extrabold text-sm font-['Satoshi',sans-serif]">
                      {lastLprResult.barrierOpen ? "BARRERA LEVANTADA" : "BARRERA CERRADA"}
                    </h4>
                    <p className="text-xs">{lastLprResult.message}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] space-y-1 font-mono text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Confianza Óptica:</span>
                    <span className="text-teal-400 font-bold">98.5% ANPR Score</span>
                  </div>
                  {lastLprResult.feeCharged !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cobro Invisible:</span>
                      <span className="text-white font-bold">${lastLprResult.feeCharged.toFixed(2)} USD</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500">
                Esperando captura de placa por la cámara LPR...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
