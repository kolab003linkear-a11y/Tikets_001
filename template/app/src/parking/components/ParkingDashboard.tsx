import React, { useState, useEffect } from "react";
import { 
  Car, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  Receipt, 
  QrCode, 
  ShieldCheck, 
  CreditCard,
  Camera
} from "lucide-react";
import { mockVehicles, mockSessions, registerVehiclePlate } from "../operations";
import { calculateParkingFee } from "../tariffCalculator";

export function ParkingDashboard({
  onOpenGateMonitor,
}: {
  onOpenGateMonitor?: () => void;
}) {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [sessions, setSessions] = useState(mockSessions);
  const [newPlate, setNewPlate] = useState("");
  const [newMake, setNewMake] = useState("");
  const [newModel, setNewModel] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim()) return;

    const v = await registerVehiclePlate(
      { plateNumber: newPlate, make: newMake, model: newModel },
      {}
    );
    setVehicles([...vehicles, v]);
    setNewPlate("");
    setNewMake("");
    setNewModel("");
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: LPR Invisible Billing */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950 border border-emerald-500/30 rounded-2xl p-5 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-emerald-400">
              <Car className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Parqueadero Automatizado con Reconocimiento de Placa (LPR)
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Cero Tickets de Papel
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                La barrera se abre automáticamente al detectar tu placa. Al salir, el cobro se debita de forma invisible.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenGateMonitor}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>Simulador de Cámara LPR en Puerta</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Registered Vehicles */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Mis Vehículos Registrados ({vehicles.length})
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(!isAdding)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isAdding ? "Cancelar" : "Registrar Placa"}</span>
            </button>
          </div>

          {isAdding && (
            <form onSubmit={handleRegister} className="p-4 bg-slate-900 border border-emerald-500/40 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-white">Vincular Nueva Placa</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400">Placa (ej: PCH-4921)</label>
                  <input
                    type="text"
                    required
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value)}
                    placeholder="PCH-4921"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Marca</label>
                  <input
                    type="text"
                    value={newMake}
                    onChange={(e) => setNewMake(e.target.value)}
                    placeholder="Toyota"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md"
              >
                Guardar Placa en Mi Cuenta
              </button>
            </form>
          )}

          {vehicles.map((v) => (
            <div
              key={v.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-slate-800 rounded-xl text-emerald-400">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-sm font-extrabold text-white tracking-wide bg-slate-950 px-2 py-0.5 rounded border border-slate-700">
                    {v.plateNumber}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">{v.make} {v.model} • {v.color}</p>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                LPR Activo
              </span>
            </div>
          ))}
        </div>

        {/* Right Column: Active Parking Sessions */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Sesión de Parqueo en Curso
          </h3>

          {sessions.map((sess) => {
            const fee = calculateParkingFee(new Date(sess.entryTime), new Date(), 2.5, 15);
            return (
              <div
                key={sess.id}
                className="p-6 bg-slate-900 border border-indigo-500/30 rounded-3xl space-y-5 shadow-2xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                      En Estacionamiento
                    </span>
                    <h4 className="text-base font-bold text-white mt-1.5">{sess.facilityName}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-emerald-400 font-mono">
                      ${fee.totalCharged.toFixed(2)}
                    </span>
                    <span className="block text-[10px] text-slate-400">Tarifa acumulada</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Vehículo</span>
                    <p className="font-mono font-bold text-slate-200 mt-0.5">{sess.plateNumber}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Ingreso</span>
                    <p className="font-bold text-slate-200 mt-0.5">{new Date(sess.entryTime).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Tiempo</span>
                    <p className="font-mono font-bold text-indigo-400 mt-0.5">{fee.durationMinutes} min</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center space-x-1 text-emerald-400 font-medium">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pago invisible automático activado</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold text-xs border border-slate-700 transition-all"
                  >
                    <QrCode className="w-3.5 h-3.5 text-indigo-400" />
                    <span>QR de Respaldo</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Fallback Modal */}
      {showQrModal && (
        <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white">QR de Salida Manual (Respaldo si la placa está sucia)</h4>
            <button onClick={() => setShowQrModal(false)} className="text-xs text-slate-400 hover:text-white">Cerrar</button>
          </div>
          <div className="p-4 flex flex-col items-center justify-center">
            <div className="p-3 bg-white rounded-xl shadow-lg">
              <QrCode className="w-32 h-32 text-slate-950" />
            </div>
            <p className="text-[11px] text-slate-400 mt-3 font-mono">PCH-4921 • ID: sess_parking_101</p>
          </div>
        </div>
      )}
    </div>
  );
}
