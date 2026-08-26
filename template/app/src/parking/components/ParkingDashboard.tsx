import {
  Camera,
  Car,
  Clock,
  PlusCircle,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import React, { useState } from "react";
import { KpiCard } from "../../client/components/ui/KpiCard";
import { StatusBadge } from "../../client/components/ui/StatusBadge";
import {
  mockSessions,
  mockVehicles,
  registerVehiclePlate,
} from "../operations";
import { calculateParkingFee } from "../tariffCalculator";

export function ParkingDashboard({
  onOpenGateMonitor,
}: {
  onOpenGateMonitor?: () => void;
}) {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [sessions] = useState(mockSessions);
  const [newPlate, setNewPlate] = useState("");
  const [newMake, setNewMake] = useState("");
  const [newModel, setNewModel] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim()) return;

    const v = await registerVehiclePlate({
      plateNumber: newPlate,
      make: newMake,
      model: newModel,
    });
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
      <div className="relative overflow-hidden rounded-3xl border border-sky-500/30 bg-gradient-to-r from-[#0A2540] via-slate-900 to-slate-950 p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center space-x-4">
            <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-3.5 text-[#0EA5E9] shadow-inner">
              <Car className="h-8 w-8 text-[#0EA5E9]" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="font-['Satoshi',sans-serif] text-xl font-bold tracking-tight text-white">
                  Parqueadero con Reconocimiento LPR
                </h2>
                <StatusBadge status="ACTIVE" label="Cero Tickets Físicos" />
              </div>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-300">
                La barrera se abre automáticamente en &lt;2.0s al leer tu placa.
                Cobro invisible automático al salir sin filas en tótems.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenGateMonitor}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:from-teal-500 hover:to-teal-400 active:scale-95"
          >
            <Camera className="h-4 w-4" />
            <span>Simulador de Cámara LPR en Puerta</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Registered Vehicles */}
        <div className="space-y-4 lg:col-span-5">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-['Satoshi',sans-serif] text-xs font-bold uppercase tracking-wider text-slate-400">
              Mis Vehículos Registrados ({vehicles.length})
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1.5 text-xs font-bold text-teal-400 transition-colors hover:text-teal-300"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{isAdding ? "Cancelar" : "Registrar Placa"}</span>
            </button>
          </div>

          {isAdding && (
            <form
              onSubmit={handleRegister}
              className="space-y-3.5 rounded-2xl border border-teal-500/40 bg-slate-900/90 p-5 shadow-xl backdrop-blur-xl"
            >
              <h4 className="font-['Satoshi',sans-serif] text-xs font-bold text-white">
                Vincular Nueva Placa
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="mb-1 block text-[11px] font-semibold text-slate-300">
                    Placa Vehicular
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="PCH-4921"
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-widest text-teal-400 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-300">
                    Marca
                  </label>
                  <input
                    type="text"
                    placeholder="Toyota"
                    value={newMake}
                    onChange={(e) => setNewMake(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-300">
                    Modelo
                  </label>
                  <input
                    type="text"
                    placeholder="RAV4"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="active:scale-98 w-full rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 py-2.5 text-xs font-bold text-slate-950 shadow-md transition-all"
              >
                Guardar y Activar Cobro Invisible
              </button>
            </form>
          )}

          {vehicles.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-md transition-all hover:bg-slate-900"
            >
              <div className="flex items-center space-x-3.5">
                <div className="rounded-xl border border-sky-500/20 bg-[#0A2540] p-3 text-[#0EA5E9]">
                  <Car className="h-5 w-5" />
                </div>
                <div>
                  <span className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-0.5 font-mono text-sm font-extrabold tracking-wider text-white">
                    {v.plateNumber}
                  </span>
                  <p className="mt-1 text-xs text-slate-400">
                    {v.make} {v.model}
                  </p>
                </div>
              </div>
              <StatusBadge status="ACTIVE" label="Cobro Activo" />
            </div>
          ))}
        </div>

        {/* Right Column: Active Parking Sessions & Receipts */}
        <div className="space-y-6 lg:col-span-7">
          {/* Active Sessions */}
          <div className="space-y-4">
            <h3 className="px-1 font-['Satoshi',sans-serif] text-xs font-bold uppercase tracking-wider text-slate-400">
              Sesiones de Parqueo Activas (Tiempo Real)
            </h3>

            {activeSessions.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-center text-xs text-slate-400">
                No hay vehículos en parqueadero en este momento.
              </div>
            ) : (
              activeSessions.map((session) => {
                const fee = calculateParkingFee(session.entryTime);
                return (
                  <div
                    key={session.id}
                    className="relative space-y-4 overflow-hidden rounded-3xl border border-teal-500/40 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="rounded-xl border border-teal-500/20 bg-teal-500/10 p-2.5 text-teal-400">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-['Satoshi',sans-serif] text-sm font-bold text-white">
                            {session.facilityName}
                          </h4>
                          <span className="font-mono text-xs font-bold text-teal-400">
                            Placa: {session.plateNumber}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status="ACTIVE" label="En Parqueadero" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs">
                      <div>
                        <span className="text-[10px] font-semibold uppercase text-slate-400">
                          Hora de Ingreso
                        </span>
                        <p className="mt-0.5 font-bold text-slate-200">
                          {new Date(session.entryTime).toLocaleTimeString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold uppercase text-slate-400">
                          Costo Acumulado
                        </span>
                        <p className="mt-0.5 font-['Satoshi',sans-serif] text-base font-extrabold text-teal-400">
                          ${fee.totalCharged.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
                      <span>Periodo de gracia: 15 min</span>
                      <span className="font-bold text-teal-400">
                        Salida automática habilitada
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Historical Receipts */}
          <div className="space-y-4">
            <h3 className="px-1 font-['Satoshi',sans-serif] text-xs font-bold uppercase tracking-wider text-slate-400">
              Recibos Digitales Recientes
            </h3>

            {completedSessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-slate-800 p-2 text-slate-400">
                    <Receipt className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-200">
                      {s.facilityName}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      Placa {s.plateNumber}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-extrabold text-slate-100">
                    ${s.totalBilled?.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-semibold text-teal-400">
                    Débito Automático OK
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
