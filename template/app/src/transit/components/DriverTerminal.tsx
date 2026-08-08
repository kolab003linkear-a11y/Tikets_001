import React, { useState } from "react";
import { 
  UserCheck, 
  Search, 
  CheckCircle2, 
  WifiOff, 
  SmartphoneOff, 
  User, 
  ShieldCheck 
} from "lucide-react";
import { mockPassengers, validatePassengerBoarding } from "../operations";

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

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Terminal del Conductor & Manifiesto Offline
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Respaldo por Cédula Activo
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Permite abordar a pasajeros con celular apagado, descargado o sin señal en carretera.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Manifiesto Sincronizado en Memoria Local</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Search by National ID for Dead Phone */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <SmartphoneOff className="w-4 h-4 text-amber-400" />
            Validación de Emergencia (Sin Celular)
          </h3>
          <p className="text-xs text-slate-400">
            Ingresa el número de cédula del pasajero para verificar su reserva y autorizar el abordaje de inmediato.
          </p>

          <form onSubmit={handleValidate} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400">Número de Cédula / DNI</label>
              <div className="relative mt-1">
                <input
                  type="text"
                  required
                  placeholder="ej: 1723456789"
                  value={nationalIdSearch}
                  onChange={(e) => setNationalIdSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Buscar y Validar Pasajero</span>
            </button>
          </form>

          {searchResult && (
            <div
              className={`p-4 rounded-2xl border text-xs ${
                searchResult.success
                  ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                  : "bg-rose-950/40 border-rose-500/40 text-rose-300"
              }`}
            >
              <p className="font-bold">{searchResult.message}</p>
            </div>
          )}
        </div>

        {/* Passenger Manifest List */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">
              Lista de Pasajeros de la Unidad ({passengers.length})
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Unidad 14</span>
          </div>

          <div className="space-y-2">
            {passengers.map((p) => {
              const isBoarded = p.boardingStatus === "BOARDED";
              return (
                <div
                  key={p.id}
                  className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl ${isBoarded ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{p.passengerName}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Cédula: {p.nationalId} • <span className="text-indigo-400">{p.seatNumber}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                        isBoarded
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {isBoarded ? `ABORDÓ ${p.boardedAt || ""}` : "PENDIENTE"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
