import React, { useState } from "react";
import { 
  Camera, 
  CheckCircle2, 
  XCircle, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Receipt,
  Car
} from "lucide-react";
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
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Monitor de Cámara LPR & Actuador de Barrera</h3>
            <p className="text-xs text-slate-400">Prueba cómo la cámara abre la barrera en &lt;2.0s y procesa el cobro invisible.</p>
          </div>
        </div>

        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Cámara en Vivo: ACTIVA
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <div>
            <label className="text-[11px] font-semibold text-slate-400">Placa Detectada por Visión Artificial</label>
            <input
              type="text"
              value={testPlate}
              onChange={(e) => setTestPlate(e.target.value)}
              className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white uppercase"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400">Evento de Barrera</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setSelectedGate("ENTRY")}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  selectedGate === "ENTRY"
                    ? "bg-emerald-600 text-white border-emerald-500"
                    : "bg-slate-900 text-slate-300 border-slate-700"
                }`}
              >
                <ArrowDownCircle className="w-3.5 h-3.5" />
                <span>Ingreso (Abrir)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedGate("EXIT")}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  selectedGate === "EXIT"
                    ? "bg-purple-600 text-white border-purple-500"
                    : "bg-slate-900 text-slate-300 border-slate-700"
                }`}
              >
                <ArrowUpCircle className="w-3.5 h-3.5" />
                <span>Salida & Cobro</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSimulateLpr}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <Car className="w-4 h-4" />
            <span>Simular Detección de Vehículo</span>
          </button>
        </div>

        {/* Live Barrier Relay & Response Screen */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-center">
          {lastLprResult ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>{lastLprResult.displayMessage}</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Pulso Relé Barrera:</span>
                  <span className="font-mono text-emerald-400 font-bold">{lastLprResult.barrierRelayPulseMs}ms (Lifting)</span>
                </div>
                {lastLprResult.totalCharged !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cobro Automático Débito:</span>
                    <span className="font-mono text-indigo-400 font-bold">${lastLprResult.totalCharged.toFixed(2)}</span>
                  </div>
                )}
                {lastLprResult.receiptUrl && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Recibo Digital:</span>
                    <span className="text-purple-400 font-mono text-[10px]">Generado & Enviado</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 text-xs py-8">
              Esperando lectura de patente del vehículo...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
