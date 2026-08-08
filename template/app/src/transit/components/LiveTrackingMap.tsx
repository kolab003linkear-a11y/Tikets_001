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
import { KpiCard } from "../../client/components/ui/KpiCard";
import { StatusBadge } from "../../client/components/ui/StatusBadge";

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
    <div className="space-y-8 font-sans">
      {/* Top Banner: Family Safety & Tracking */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A2540] via-slate-900 to-slate-950 border border-sky-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 bg-sky-500/10 rounded-2xl border border-sky-500/30 text-[#0EA5E9] shadow-inner">
              <Navigation className="w-8 h-8 text-[#0EA5E9]" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold tracking-tight text-white font-['Satoshi',sans-serif]">
                  Portal de Seguridad & Telemetría GPS en Vivo
                </h2>
                <StatusBadge status="IN_TRANSIT" label="Transmisión en Tiempo Real" />
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Comparte la ubicación en vivo de la unidad con tus familiares sin necesidad de descargar la app ni iniciar sesión.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleShareLink}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? "¡Enlace Copiado al Portapapeles!" : "Compartir Viaje con Familiares"}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Velocidad Actual"
          value={`${telemetry.speedKmh} km/h`}
          subtitle="Monitoreo por radar GPS"
          icon={Gauge}
          variant="secondary"
          badge="En Ruta"
        />
        <KpiCard
          title="Siguiente Parada"
          value={telemetry.nextWaypoint}
          subtitle="Estimado a las 04:15 AM"
          icon={MapPin}
          variant="primary"
          badge="Waypoint"
        />
        <KpiCard
          title="Seguridad de Ruta"
          value="100% Trazable"
          subtitle="Validación de desvíos activa"
          icon={ShieldCheck}
          variant="accent"
          badge="Seguro"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Map Telemetry Screen */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-['Satoshi',sans-serif]">
                <Bus className="w-5 h-5 text-[#0EA5E9]" />
                {mockTrip.routeTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{mockTrip.busUnitNumber} • Chofer: {mockTrip.driverName}</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-teal-400 flex items-center gap-1.5 justify-end">
                <Gauge className="w-4 h-4" /> {telemetry.speedKmh} km/h
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Última señal: {telemetry.timestamp}</span>
            </div>
          </div>

          {/* Interactive Route Waypoint & Map Visualization */}
          <div className="relative h-72 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between overflow-hidden shadow-inner">
            {/* Background Map Grid & Roads */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            <div className="relative z-10 flex justify-between items-center text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
                <span className="font-bold text-white font-['Satoshi',sans-serif]">Terminal Terrestre Quitumbe (Origen)</span>
              </div>
              <span className="font-mono text-[11px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                Salida: 22:00
              </span>
            </div>

            {/* Moving Bus Vector Simulation */}
            <div className="relative z-10 my-auto flex items-center justify-center">
              <div className="w-full h-1.5 bg-slate-800 rounded-full relative overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#0A2540] via-[#0EA5E9] to-[#14B8A6] w-3/5 rounded-full" />
              </div>
              <div className="absolute left-[58%] -top-3 p-2 bg-[#0A2540] border-2 border-sky-400 rounded-full shadow-lg shadow-sky-500/50">
                <Bus className="w-4 h-4 text-sky-300 animate-bounce" />
              </div>
            </div>

            <div className="relative z-10 flex justify-between items-center text-xs">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span className="font-bold text-white font-['Satoshi',sans-serif]">Terminal Guayaquil (Destino)</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                ETA: {telemetry.estimatedArrival}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Coordenadas GPS</span>
              <span className="text-slate-300 font-bold">{telemetry.latitude.toFixed(4)}, {telemetry.longitude.toFixed(4)}</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Próxima Parada</span>
              <span className="text-teal-400 font-bold">{telemetry.nextWaypoint}</span>
            </div>
          </div>
        </div>

        {/* Live Passenger Safety Card */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Satoshi',sans-serif] px-1">
            Respaldo de Emergencia
          </h3>

          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center space-x-3 text-amber-400">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              <h4 className="font-bold text-sm text-white font-['Satoshi',sans-serif]">
                ¿Sin Batería en el Teléfono?
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Puedes abordar mostrando tu <strong>Cédula de Identidad</strong> física directamente al chofer. Su terminal tiene el manifiesto 100% offline.
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono">
              Validación por Cédula habilitada para toda la lista de pasajeros.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
