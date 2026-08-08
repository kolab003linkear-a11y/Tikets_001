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
  Camera,
  ArrowUpRight,
  TrendingUp,
  MapPin
} from "lucide-react";
import { mockVehicles, mockSessions, registerVehiclePlate } from "../operations";
import { calculateParkingFee } from "../tariffCalculator";
import { KpiCard } from "../../client/components/ui/KpiCard";
import { StatusBadge } from "../../client/components/ui/StatusBadge";

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

  const activeSessions = sessions.filter((s) => s.status === "ACTIVE");
  const completedSessions = sessions.filter((s) => s.status === "COMPLETED");

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner: LPR Invisible Billing */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A2540] via-slate-900 to-slate-950 border border-sky-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 bg-sky-500/10 rounded-2xl border border-sky-500/30 text-[#0EA5E9] shadow-inner">
              <Car className="w-8 h-8 text-[#0EA5E9]" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold tracking-tight text-white font-['Satoshi',sans-serif]">
                  Parqueadero con Reconocimiento LPR
                </h2>
                <StatusBadge status="ACTIVE" label="Cero Tickets Físicos" />
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                La barrera se abre automáticamente en &lt;2.0s al leer tu placa. Cobro invisible automático al salir sin filas en tótems.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenGateMonitor}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>Simulador de Cámara LPR en Puerta</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Placas Vinculadas"
          value={vehicles.length}
          subtitle="Débito automático activo"
          icon={Car}
          variant="primary"
          badge="Seguro"
        />
        <KpiCard
          title="Estadías Activas"
          value={activeSessions.length}
          subtitle="En parqueadero ahora"
          icon={Clock}
          variant="accent"
          badge="En Vivo"
        />
        <KpiCard
          title="Salida Invisible"
          value="< 2.0 Segundos"
          subtitle="Apertura automática de barrera"
          icon={ShieldCheck}
          variant="secondary"
          badge="Sin Tickets"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Registered Vehicles */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Satoshi',sans-serif]">
              Mis Vehículos Registrados ({vehicles.length})
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(!isAdding)}
              className="text-xs text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isAdding ? "Cancelar" : "Registrar Placa"}</span>
            </button>
          </div>

          {isAdding && (
            <form onSubmit={handleRegister} className="p-5 bg-slate-900/90 border border-teal-500/40 rounded-2xl space-y-3.5 shadow-xl backdrop-blur-xl">
              <h4 className="text-xs font-bold text-white font-['Satoshi',sans-serif]">Vincular Nueva Placa</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Placa Vehicular</label>
                  <input
                    type="text"
                    required
                    placeholder="PCH-4921"
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-teal-400 uppercase tracking-widest focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Marca</label>
                  <input
                    type="text"
                    placeholder="Toyota"
                    value={newMake}
                    onChange={(e) => setNewMake(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Modelo</label>
                  <input
                    type="text"
                    placeholder="RAV4"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-98"
              >
                Guardar y Activar Cobro Invisible
              </button>
            </form>
          )}

          {vehicles.map((v) => (
            <div
              key={v.id}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 hover:bg-slate-900 transition-all flex items-center justify-between shadow-md"
            >
              <div className="flex items-center space-x-3.5">
                <div className="p-3 bg-[#0A2540] rounded-xl border border-sky-500/20 text-[#0EA5E9]">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-sm font-extrabold text-white tracking-wider px-2 py-0.5 bg-slate-950 rounded-lg border border-slate-800">
                    {v.plateNumber}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">{v.make} {v.model}</p>
                </div>
              </div>
              <StatusBadge status="ACTIVE" label="Cobro Activo" />
            </div>
          ))}
        </div>

        {/* Right Column: Active Parking Sessions & Receipts */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Sessions */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Satoshi',sans-serif] px-1">
              Sesiones de Parqueo Activas (Tiempo Real)
            </h3>

            {activeSessions.length === 0 ? (
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 text-center text-xs text-slate-400">
                No hay vehículos en parqueadero en este momento.
              </div>
            ) : (
              activeSessions.map((session) => {
                const fee = calculateParkingFee(session.enteredAt);
                return (
                  <div
                    key={session.id}
                    className="p-6 rounded-3xl border border-teal-500/40 bg-slate-900/90 shadow-2xl space-y-4 backdrop-blur-xl relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-teal-500/10 rounded-xl text-teal-400 border border-teal-500/20">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white font-['Satoshi',sans-serif]">
                            {session.facilityName}
                          </h4>
                          <span className="font-mono text-xs text-teal-400 font-bold">
                            Placa: {session.plateNumber}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status="ACTIVE" label="En Parqueadero" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Hora de Ingreso</span>
                        <p className="font-bold text-slate-200 mt-0.5">{new Date(session.enteredAt).toLocaleTimeString()}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Costo Acumulado</span>
                        <p className="font-extrabold text-teal-400 text-base mt-0.5 font-['Satoshi',sans-serif]">
                          ${fee.totalFee.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span>Periodo de gracia: 15 min</span>
                      <span className="text-teal-400 font-bold">Salida automática habilitada</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Historical Receipts */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Satoshi',sans-serif] px-1">
              Recibos Digitales Recientes
            </h3>

            {completedSessions.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-200 block">{s.facilityName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Placa {s.plateNumber}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-slate-100 block">${s.chargedAmount?.toFixed(2)}</span>
                  <span className="text-[10px] text-teal-400 font-semibold">Débito Automático OK</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
