import React, { useState, useEffect } from "react";
import { 
  Bus, 
  MapPin, 
  Navigation, 
  Share2, 
  ShieldCheck, 
  Clock, 
  Gauge, 
  Compass,
  CheckCircle2
} from "lucide-react";
import { mockTrip } from "../operations";
import { simulateLiveGpsStream, BusTelemetryFrame } from "../telemetryStream";

export function LiveTrackingMap() {
  const [telemetry, setTelemetry] = useState<BusTelemetryFrame>({
    tripId: mockTrip.id,
    latitude: mockTrip.currentGpsLat,
    longitude: mockTrip.currentGpsLng,
    speedKmh: mockTrip.currentSpeedKmh,
    nextWaypoint: mockTrip.nextWaypoint,
    estimatedArrival: "04:15 AM",
    timestamp: "19:42:10",
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const cancel = simulateLiveGpsStream((frame) => {
      setTelemetry(frame);
    });
    return cancel;
  }, []);

  const handleShareLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Family Safety & Tracking */}
      <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950 border border-blue-500/30 rounded-2xl p-5 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30 text-blue-400">
              <Navigation className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Portal de Seguridad & Telemetría GPS en Vivo
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 animate-pulse">
                  Transmisión en Tiempo Real
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Comparte la ubicación en vivo de la unidad con tus familiares sin necesidad de iniciar sesión.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleShareLink}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? "¡Enlace Copiado al Portapapeles!" : "Compartir Viaje con Familiares"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Telemetry Screen */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bus className="w-4 h-4 text-blue-400" />
                {mockTrip.routeTitle}
              </h3>
              <p className="text-xs text-slate-400">{mockTrip.busUnitNumber} • Chofer: {mockTrip.driverName}</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 justify-end">
                <Gauge className="w-3.5 h-3.5" /> {telemetry.speedKmh} km/h
              </span>
              <span className="text-[10px] text-slate-500">Última actualización: {telemetry.timestamp}</span>
            </div>
          </div>

          {/* Interactive Route Waypoint & Map Visualization */}
          <div className="relative h-64 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between overflow-hidden">
            {/* Background Map Grid & Roads */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            <div className="relative z-10 flex justify-between items-center text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                <span className="font-bold text-slate-200">Origen: Terminal Carcelén</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-200">Destino: Guayaquil</span>
                <div className="w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20" />
              </div>
            </div>

            {/* Moving Bus Pin along the highway */}
            <div className="relative z-10 my-4 flex items-center justify-center">
              <div className="p-4 bg-blue-600/20 rounded-2xl border border-blue-500/40 backdrop-blur-md flex items-center space-x-3 shadow-xl">
                <div className="p-2 bg-blue-500 rounded-xl text-white animate-bounce">
                  <Bus className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-300">Posición Actual del Bus</span>
                  <p className="font-mono text-xs text-white font-bold">
                    Lat: {telemetry.latitude} • Lng: {telemetry.longitude}
                  </p>
                  <p className="text-[11px] text-slate-300 mt-0.5">Próxima parada: {telemetry.nextWaypoint}</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span>Salida: {mockTrip.departureTime}</span>
              <span className="font-mono text-blue-400 font-bold">ETA Estimado: {telemetry.estimatedArrival}</span>
            </div>
          </div>
        </div>

        {/* Right Info Box */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Garantías de Seguridad en Ruta
          </h3>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-start space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">Validación por Cédula</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Si tu teléfono se apaga por batería baja, el chofer verifica tu pasaje en el manifiesto offline usando tu documento de identidad.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-start space-x-2.5">
              <Compass className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">Trazabilidad Anti-Extravío</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Tus familiares conocen en todo momento en qué kilómetro de la carretera se encuentra la unidad de transporte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
