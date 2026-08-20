import {
  CheckCircle2,
  Search,
  SmartphoneOff,
  User,
  UserCheck,
  Users,
  WifiOff,
} from "lucide-react";
import React, { useState } from "react";
import { KpiCard } from "../../client/components/ui/KpiCard";
import { StatusBadge } from "../../client/components/ui/StatusBadge";
import { mockPassengers, validatePassengerBoarding } from "../operations";

interface BoardingResult {
  success: boolean;
  message: string;
  passenger?: {
    nationalId: string;
    name: string;
    seatNumber: string;
    boardingStatus: string;
  };
}

export function DriverTerminal() {
  const [passengers, setPassengers] = useState(mockPassengers);
  const [nationalIdSearch, setNationalIdSearch] = useState("");
  const [searchResult, setSearchResult] = useState<BoardingResult | null>(null);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nationalIdSearch.trim()) return;

    const res = await validatePassengerBoarding(
      { nationalId: nationalIdSearch, tripId: "trip_4021" },
      {},
    );
    setSearchResult(res);

    if (res.success && res.passenger) {
      setPassengers((prev) =>
        prev.map((p) =>
          p.nationalId === res.passenger.nationalId ? res.passenger : p,
        ),
      );
    }
  };

  const boardedCount = passengers.filter(
    (p) => p.boardingStatus === "BOARDED",
  ).length;
  const pendingCount = passengers.length - boardedCount;

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-500/30 bg-gradient-to-r from-[#0A2540] via-slate-900 to-slate-950 p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center space-x-4">
            <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-3.5 text-[#0EA5E9] shadow-inner">
              <UserCheck className="h-8 w-8 text-[#0EA5E9]" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="font-['Satoshi',sans-serif] text-xl font-bold tracking-tight text-white">
                  Terminal del Chofer & Manifiesto Offline
                </h2>
                <StatusBadge status="BOARDED" label="Validación por Cédula" />
              </div>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-300">
                Permite abordar a pasajeros con celular descargado o sin datos
                mediante búsqueda por documento nacional.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 font-mono text-xs text-teal-400">
            <WifiOff className="h-4 w-4" />
            <span>Manifiesto 100% en Memoria Local</span>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Search by National ID for Dead Phone */}
        <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:col-span-5">
          <div className="flex items-center space-x-2.5 text-amber-400">
            <SmartphoneOff className="h-5 w-5 text-amber-400" />
            <h3 className="font-['Satoshi',sans-serif] text-sm font-bold text-white">
              Validación de Emergencia (Sin Celular)
            </h3>
          </div>
          <p className="text-xs leading-relaxed text-slate-300">
            Ingresa el número de cédula del pasajero para verificar su reserva y
            autorizar el abordaje de inmediato.
          </p>

          <form onSubmit={handleValidate} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                Número de Cédula / DNI
              </label>
              <input
                type="text"
                required
                placeholder="ej: 1723456789"
                value={nationalIdSearch}
                onChange={(e) => setNationalIdSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 font-mono text-xs font-bold text-teal-400 placeholder-slate-600 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="active:scale-98 flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:from-teal-500 hover:to-teal-400"
            >
              <Search className="h-4 w-4" />
              <span>Buscar y Validar Pasajero en Manifiesto</span>
            </button>
          </form>

          {searchResult && (
            <div
              className={`space-y-2 rounded-2xl border p-5 text-xs ${
                searchResult.success
                  ? "border-teal-500/40 bg-teal-950/40 text-teal-200"
                  : "border-rose-500/40 bg-rose-950/40 text-rose-200"
              }`}
            >
              <div className="flex items-center space-x-2 font-bold">
                {searchResult.success ? (
                  <CheckCircle2 className="h-5 w-5 text-teal-400" />
                ) : (
                  <SmartphoneOff className="h-5 w-5 text-rose-400" />
                )}
                <span className="font-['Satoshi',sans-serif]">
                  {searchResult.message}
                </span>
              </div>
              {searchResult.passenger && (
                <div className="mt-2 space-y-1 border-t border-slate-800 pt-2 font-mono text-[11px]">
                  <p>
                    Pasajero:{" "}
                    <strong className="text-white">
                      {searchResult.passenger.name}
                    </strong>
                  </p>
                  <p>
                    Asiento Asignado:{" "}
                    <strong className="text-teal-400">
                      {searchResult.passenger.seatNumber}
                    </strong>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Passenger Manifest List */}
        <div className="space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-['Satoshi',sans-serif] text-xs font-bold uppercase tracking-wider text-slate-400">
              Manifiesto de Abordaje en Memoria Local ({passengers.length})
            </h3>
            <span className="font-mono text-[11px] text-teal-400">
              Sincronizado
            </span>
          </div>

          <div className="space-y-3">
            {passengers.map((p) => {
              const isBoarded = p.boardingStatus === "BOARDED";
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between rounded-2xl border p-4 shadow-sm transition-all ${
                    isBoarded
                      ? "border-teal-500/30 bg-slate-900/90"
                      : "border-slate-800 bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div
                      className={`rounded-xl border p-2.5 ${
                        isBoarded
                          ? "border-teal-500/20 bg-teal-500/10 text-teal-400"
                          : "border-slate-700 bg-slate-800 text-slate-400"
                      }`}
                    >
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-['Satoshi',sans-serif] text-sm font-bold text-white">
                        {p.name}
                      </h4>
                      <p className="mt-0.5 font-mono text-xs text-slate-400">
                        Cédula: {p.nationalId} • Asiento:{" "}
                        <span className="font-bold text-[#0EA5E9]">
                          {p.seatNumber}
                        </span>
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
