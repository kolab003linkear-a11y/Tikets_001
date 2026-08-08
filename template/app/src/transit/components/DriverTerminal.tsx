import React, { useState } from "react";
import { 
  UserCheck, 
  Search, 
  CheckCircle2, 
  WifiOff, 
  SmartphoneOff, 
  User, 
  ShieldCheck,
  IdCard,
  Users
} from "lucide-react";
import { mockPassengers, validatePassengerBoarding } from "../operations";
import { KpiCard } from "../../client/components/ui/KpiCard";
import { StatusBadge } from "../../client/components/ui/StatusBadge";

export function DriverTerminal() {
  const [passengers, setPassengers] = useState(mockPassengers);
  const [nationalIdSearch, setNationalIdSearch] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nationalIdSearch.trim()) return;

    const res = await validatePassengerBoarding({ nationalId: nationalIdSearch, tripId: "trip_4021" }, {});
    setSearchResult(res);

    if (res.success && res.passenger) {
      setPassengers((prev) =>
        prev.map((p) => (p.nationalId === res.passenger.nationalId ? res.passenger : p))
      );
    }
  };

  const boardedCount = passengers.filter((p) => p.boardingStatus === "BOARDED").length;
  const pendingCount = passengers.length - boardedCount;

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A2540] via-slate-900 to-slate-950 border border-sky-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 bg-sky-500/10 rounded-2xl border border-sky-500/30 text-[#0EA5E9] shadow-inner">
              <UserCheck className="w-8 h-8 text-[#0EA5E9]" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold tracking-tight text-white font-['Satoshi',sans-serif]">
                  Terminal del Chofer & Manifiesto Offline
                </h2>
                <StatusBadge status="BOARDED" label="Validación por Cédula" />
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Permite abordar a pasajeros con celular descargado o sin datos mediante búsqueda por documento nacional.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-teal-400 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
            <WifiOff className="w-4 h-4" />
            <span>Manifiesto 100% en Memoria Local</span>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Pasajeros Registrados"
          value={passengers.length}
          subtitle="Capacidad de la unidad"
          icon={Users}
          variant="primary"
          badge="Unidad 402"
        />
        <KpiCard
          title="Embarcados a Bordo"
          value={boardedCount}
          subtitle="Verificados en puerta"
          icon={CheckCircle2}
          variant="accent"
          badge="A Bordo"
        />
        <KpiCard
          title="Pendientes por Subir"
          value={pendingCount}
          subtitle="En andén / sala de espera"
          icon={SmartphoneOff}
          variant={pendingCount > 0 ? "warning" : "secondary"}
          badge="Pendientes"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Search by National ID for Dead Phone */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center space-x-2.5 text-amber-400">
            <SmartphoneOff className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white font-['Satoshi',sans-serif]">
              Validación de Emergencia (Sin Celular)
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Ingresa el número de cédula del pasajero para verificar su reserva y autorizar el abordaje de inmediato.
          </p>

          <form onSubmit={handleValidate} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Número de Cédula / DNI
              </label>
              <input
                type="text"
                required
                placeholder="ej: 1723456789"
                value={nationalIdSearch}
                onChange={(e) => setNationalIdSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-teal-400 placeholder-slate-600 focus:outline-none focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center space-x-2 active:scale-98"
            >
              <Search className="w-4 h-4" />
              <span>Buscar y Validar Pasajero en Manifiesto</span>
            </button>
          </form>

          {searchResult && (
            <div
              className={`p-5 rounded-2xl border text-xs space-y-2 ${
                searchResult.success
                  ? "bg-teal-950/40 border-teal-500/40 text-teal-200"
                  : "bg-rose-950/40 border-rose-500/40 text-rose-200"
              }`}
            >
              <div className="flex items-center space-x-2 font-bold">
                {searchResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-teal-400" />
                ) : (
                  <SmartphoneOff className="w-5 h-5 text-rose-400" />
                )}
                <span className="font-['Satoshi',sans-serif]">{searchResult.message}</span>
              </div>
              {searchResult.passenger && (
                <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] space-y-1 font-mono">
                  <p>Pasajero: <strong className="text-white">{searchResult.passenger.name}</strong></p>
                  <p>Asiento Asignado: <strong className="text-teal-400">{searchResult.passenger.seatNumber}</strong></p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Passenger Manifest List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Satoshi',sans-serif]">
              Manifiesto de Abordaje en Memoria Local ({passengers.length})
            </h3>
            <span className="text-[11px] text-teal-400 font-mono">Sincronizado</span>
          </div>

          <div className="space-y-3">
            {passengers.map((p) => {
              const isBoarded = p.boardingStatus === "BOARDED";
              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between shadow-sm ${
                    isBoarded
                      ? "bg-slate-900/90 border-teal-500/30"
                      : "bg-slate-900/60 border-slate-800"
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div
                      className={`p-2.5 rounded-xl border ${
                        isBoarded
                          ? "bg-teal-500/10 border-teal-500/20 text-teal-400"
                          : "bg-slate-800 border-slate-700 text-slate-400"
                      }`}
                    >
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white font-['Satoshi',sans-serif]">{p.name}</h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Cédula: {p.nationalId} • Asiento: <span className="text-[#0EA5E9] font-bold">{p.seatNumber}</span>
                      </p>
                    </div>
                  </div>

                  <StatusBadge
                    status={isBoarded ? "BOARDED" : "OFFLINE"}
                    label={isBoarded ? "Embarcado" : "Pendiente"}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
