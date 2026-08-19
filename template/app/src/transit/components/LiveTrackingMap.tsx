import {
  Bus,
  Gauge,
  MapPin,
  Navigation,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { KpiCard } from "../../client/components/ui/KpiCard";
import { StatusBadge } from "../../client/components/ui/StatusBadge";
import { mockTrip } from "../operations";
import { BusTelemetryFrame, simulateLiveGpsStream } from "../telemetryStream";

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
      <div className="relative overflow-hidden rounded-3xl border border-sky-500/30 bg-gradient-to-r from-[#0A2540] via-slate-900 to-slate-950 p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center space-x-4">
            <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-3.5 text-[#0EA5E9] shadow-inner">
              <Navigation className="h-8 w-8 text-[#0EA5E9]" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="font-['Satoshi',sans-serif] text-xl font-bold tracking-tight text-white">
                  Portal de Seguridad & Telemetría GPS en Vivo
                </h2>
                <StatusBadge
                  status="IN_TRANSIT"
                  label="Transmisión en Tiempo Real"
                />
              </div>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-300">
                Comparte la ubicación en vivo de la unidad con tus familiares
                sin necesidad de descargar la app ni iniciar sesión.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleShareLink}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:from-teal-500 hover:to-teal-400 active:scale-95"
          >
            <Share2 className="h-4 w-4" />
            <span>
              {copied
                ? "¡Enlace Copiado al Portapapeles!"
                : "Compartir Viaje con Familiares"}
            </span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Map Telemetry Screen */}
        <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:col-span-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="flex items-center gap-2 font-['Satoshi',sans-serif] text-base font-bold text-white">
                <Bus className="h-5 w-5 text-[#0EA5E9]" />
                {mockTrip.routeTitle}
              </h3>
              <p className="mt-0.5 text-xs text-slate-400">
                {mockTrip.busUnitNumber} • Chofer: {mockTrip.driverName}
              </p>
            </div>

            <div className="text-right">
              <span className="flex items-center justify-end gap-1.5 font-mono text-xs font-bold text-teal-400">
                <Gauge className="h-4 w-4" /> {telemetry.speedKmh} km/h
              </span>
              <span className="font-mono text-[10px] text-slate-500">
                Última señal: {telemetry.timestamp}
              </span>
            </div>
          </div>

          {/* Interactive Route Waypoint & Map Visualization */}
          <div className="relative flex h-72 flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-inner">
            {/* Background Map Grid & Roads */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] opacity-40 [background-size:16px_16px]" />

            <div className="relative z-10 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="h-2.5 w-2.5 animate-ping rounded-full bg-teal-400" />
                <span className="font-['Satoshi',sans-serif] font-bold text-white">
                  Terminal Terrestre Quitumbe (Origen)
                </span>
              </div>
              <span className="rounded border border-teal-500/20 bg-teal-500/10 px-2 py-0.5 font-mono text-[11px] text-teal-400">
                Salida: 22:00
              </span>
            </div>

            {/* Moving Bus Vector Simulation */}
            <div className="relative z-10 my-auto flex items-center justify-center">
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-[#0A2540] via-[#0EA5E9] to-[#14B8A6]" />
              </div>
              <div className="absolute -top-3 left-[58%] rounded-full border-2 border-sky-400 bg-[#0A2540] p-2 shadow-lg shadow-sky-500/50">
                <Bus className="h-4 w-4 animate-bounce text-sky-300" />
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-rose-400" />
                <span className="font-['Satoshi',sans-serif] font-bold text-white">
                  Terminal Guayaquil (Destino)
                </span>
              </div>
              <span className="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 font-mono text-[11px] text-slate-400">
                ETA: {telemetry.estimatedArrival}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 font-mono text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <span className="block text-[10px] font-bold uppercase text-slate-500">
                Coordenadas GPS
              </span>
              <span className="font-bold text-slate-300">
                {telemetry.latitude.toFixed(4)},{" "}
                {telemetry.longitude.toFixed(4)}
              </span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <span className="block text-[10px] font-bold uppercase text-slate-500">
                Próxima Parada
              </span>
              <span className="font-bold text-teal-400">
                {telemetry.nextWaypoint}
              </span>
            </div>
          </div>
        </div>

        {/* Live Passenger Safety Card */}
        <div className="space-y-4 lg:col-span-4">
          <h3 className="px-1 font-['Satoshi',sans-serif] text-xs font-bold uppercase tracking-wider text-slate-400">
            Respaldo de Emergencia
          </h3>

          <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
            <div className="flex items-center space-x-3 text-amber-400">
              <ShieldCheck className="h-5 w-5 text-teal-400" />
              <h4 className="font-['Satoshi',sans-serif] text-sm font-bold text-white">
                ¿Sin Batería en el Teléfono?
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              Puedes abordar mostrando tu <strong>Cédula de Identidad</strong>{" "}
              física directamente al chofer. Su terminal tiene el manifiesto
              100% offline.
            </p>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-[11px] text-slate-400">
              Validación por Cédula habilitada para toda la lista de pasajeros.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
