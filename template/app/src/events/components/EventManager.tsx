import {
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  MapPin,
  Minus,
  Plus,
  Search,
  Ticket,
  UserRound,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

interface TicketType {
  id: string;
  name: string;
  price: number;
  capacity: number;
  sold: number;
  color: string;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  category: string;
  status: "Publicado" | "Borrador";
  tickets: TicketType[];
}

const INITIAL_EVENTS: EventItem[] = [
  {
    id: "event-cine-01",
    title: "Cine ecuatoriano: La historia detrás de la pantalla",
    date: "29 ago 2026",
    time: "19:00",
    category: "Cine foro",
    status: "Publicado",
    tickets: [
      { id: "general", name: "General", price: 6, capacity: 80, sold: 52, color: "bg-cyan-400" },
      { id: "estudiante", name: "Estudiante", price: 4, capacity: 40, sold: 31, color: "bg-amber-300" },
    ],
  },
  {
    id: "event-teatro-02",
    title: "La casa de Bernarda Alba",
    date: "05 sep 2026",
    time: "20:00",
    category: "Teatro",
    status: "Publicado",
    tickets: [
      { id: "platea", name: "Platea", price: 12, capacity: 70, sold: 44, color: "bg-rose-400" },
      { id: "balcon", name: "Balcón", price: 8, capacity: 50, sold: 18, color: "bg-violet-400" },
    ],
  },
];

const emptyEvent = { title: "", date: "", time: "19:00", category: "Cine" };

export function EventManager() {
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [selectedId, setSelectedId] = useState(INITIAL_EVENTS[0].id);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [draft, setDraft] = useState(emptyEvent);

  const visibleEvents = useMemo(() => events.filter((event) => event.title.toLowerCase().includes(query.toLowerCase()) && (filter === "Todos" || event.category === filter)), [events, filter, query]);
  const selectedEvent = events.find((event) => event.id === selectedId) ?? events[0];
  const totalSold = events.reduce((total, event) => total + event.tickets.reduce((sum, ticket) => sum + ticket.sold, 0), 0);
  const totalCapacity = events.reduce((total, event) => total + event.tickets.reduce((sum, ticket) => sum + ticket.capacity, 0), 0);
  const summaryCards: Array<[string, string | number, LucideIcon]> = [
    ["Funciones activas", events.filter((event) => event.status === "Publicado").length, CalendarDays],
    ["Entradas vendidas", totalSold, Ticket],
    ["Ocupación", `${Math.round((totalSold / totalCapacity) * 100)}%`, UserRound],
    ["Ingresos proyectados", `$${events.reduce((sum, event) => sum + event.tickets.reduce((inner, ticket) => inner + ticket.sold * ticket.price, 0), 0)}`, CircleDollarSign],
  ];

  const updateCapacity = (ticketId: string, amount: number) => {
    setEvents((current) => current.map((event) => event.id !== selectedEvent.id ? event : { ...event, tickets: event.tickets.map((ticket) => ticket.id === ticketId ? { ...ticket, capacity: Math.max(ticket.sold, ticket.capacity + amount) } : ticket) }));
  };

  const handleCreateEvent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newEvent: EventItem = {
      id: `event-${Date.now()}`,
      title: draft.title,
      date: draft.date,
      time: draft.time,
      category: draft.category,
      status: "Borrador",
      tickets: [{ id: "general", name: "General", price: 6, capacity: 100, sold: 0, color: "bg-cyan-400" }],
    };
    setEvents((current) => [newEvent, ...current]);
    setSelectedId(newEvent.id);
    setDraft(emptyEvent);
    setShowCreateForm(false);
  };

  if (!selectedEvent) return null;

  return (
    <div id="events" className="space-y-5 font-sans text-slate-100 sm:space-y-7">
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-[linear-gradient(120deg,#241b13,#111827_58%,#082f49)] p-5 shadow-2xl sm:p-7">
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div><div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-300"><MapPin className="h-4 w-4" /> OchoyMedio · La Floresta</div><h1 className="max-w-2xl font-['Satoshi',sans-serif] text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Eventos y venta de entradas</h1><p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">Organiza la cartelera del cine, controla cupos y mantén cada función lista para la venta móvil.</p></div>
          <button type="button" onClick={() => setShowCreateForm(true)} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-200 active:scale-95"><Plus className="h-4 w-4" /> Nueva función</button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {summaryCards.map(([label, value, Icon]) => <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4"><Icon className="h-4 w-4 text-amber-300" /><p className="mt-3 text-xl font-extrabold text-white">{value}</p><p className="mt-1 text-[11px] font-semibold text-slate-400">{label}</p></div>)}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="min-w-0 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar función" className="min-h-10 w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-300 focus:outline-none" /></label><label className="relative"><select value={filter} onChange={(event) => setFilter(event.target.value)} className="min-h-10 w-full appearance-none rounded-xl border border-slate-800 bg-slate-900 px-3 pr-9 text-sm text-slate-200 focus:border-amber-300 focus:outline-none sm:w-32"><option>Todos</option><option>Cine foro</option><option>Teatro</option><option>Cine</option></select><ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-500" /></label></div>
          <div className="space-y-3">{visibleEvents.map((event) => { const sold = event.tickets.reduce((sum, ticket) => sum + ticket.sold, 0); const capacity = event.tickets.reduce((sum, ticket) => sum + ticket.capacity, 0); return <button key={event.id} type="button" onClick={() => setSelectedId(event.id)} className={`w-full rounded-2xl border p-4 text-left transition ${selectedId === event.id ? "border-amber-300/70 bg-amber-300/10" : "border-slate-800 bg-slate-900/70 hover:border-slate-700"}`}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">{event.category}</span><h2 className="mt-1 truncate text-sm font-bold text-white">{event.title}</h2></div><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${event.status === "Publicado" ? "bg-emerald-400/15 text-emerald-300" : "bg-slate-700 text-slate-300"}`}>{event.status}</span></div><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400"><span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{event.date}</span><span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{event.time}</span><span className="font-semibold text-slate-300">{sold}/{capacity} entradas</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-amber-300" style={{ width: `${Math.min((sold / capacity) * 100, 100)}%` }} /></div></button>; })}</div>
        </section>

        <section className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
          <div className="flex flex-col gap-3 border-b border-slate-800 pb-5 sm:flex-row sm:items-start sm:justify-between"><div><span className="text-xs font-bold uppercase tracking-wider text-amber-300">Detalle de función</span><h2 className="mt-1 text-xl font-extrabold text-white">{selectedEvent.title}</h2><p className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400"><span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{selectedEvent.date}</span><span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{selectedEvent.time}</span></p></div><button type="button" onClick={() => setEvents((current) => current.map((event) => event.id === selectedEvent.id ? { ...event, status: event.status === "Publicado" ? "Borrador" : "Publicado" } : event))} className="min-h-10 rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-200 hover:border-amber-300 hover:text-amber-200">{selectedEvent.status === "Publicado" ? "Pasar a borrador" : "Publicar función"}</button></div>
          <div className="py-5"><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-bold text-white">Tipos de entrada</h3><span className="text-xs text-slate-500">Ajusta cupos disponibles</span></div><div className="space-y-3">{selectedEvent.tickets.map((ticket) => <div key={ticket.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"><div className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-2"><span className={`h-2.5 w-2.5 shrink-0 rounded-full ${ticket.color}`} /><span className="truncate text-sm font-bold text-white">{ticket.name}</span></div><span className="font-mono text-sm font-bold text-amber-300">${ticket.price}</span></div><div className="mt-4 flex items-center justify-between gap-3"><div className="min-w-0 flex-1"><div className="flex justify-between text-[11px] text-slate-400"><span>{ticket.sold} vendidos</span><span>{ticket.capacity} cupos</span></div><div className="mt-2 h-1.5 rounded-full bg-slate-800"><div className="h-full rounded-full bg-cyan-400" style={{ width: `${Math.min((ticket.sold / ticket.capacity) * 100, 100)}%` }} /></div></div><div className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 p-1"><button type="button" aria-label={`Reducir cupos ${ticket.name}`} onClick={() => updateCapacity(ticket.id, -10)} className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"><Minus className="h-4 w-4" /></button><span className="w-8 text-center text-xs font-bold text-white">{ticket.capacity}</span><button type="button" aria-label={`Aumentar cupos ${ticket.name}`} onClick={() => updateCapacity(ticket.id, 10)} className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"><Plus className="h-4 w-4" /></button></div></div></div>)}</div></div>
          <div className="flex flex-col gap-3 rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-xs sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-amber-200">Venta móvil habilitada</p><p className="mt-1 text-slate-400">El público recibirá su QR dinámico tras el pago.</p></div><span className="flex items-center gap-1 font-bold text-emerald-300"><Check className="h-4 w-4" /> Lista para vender</span></div>
        </section>
      </div>

      {showCreateForm && <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"><form onSubmit={handleCreateEvent} className="w-full max-w-lg space-y-5 rounded-t-3xl border border-slate-700 bg-slate-900 p-5 shadow-2xl sm:rounded-3xl sm:p-7"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-amber-300">Nueva función</p><h2 className="mt-1 text-xl font-extrabold text-white">Añadir a la cartelera</h2></div><button type="button" aria-label="Cerrar formulario" onClick={() => setShowCreateForm(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><X className="h-5 w-5" /></button></div><div className="space-y-4"><label className="block text-xs font-semibold text-slate-300">Título<input required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white focus:border-amber-300 focus:outline-none" placeholder="Ej. Ciclo de cine andino" /></label><div className="grid grid-cols-2 gap-3"><label className="block text-xs font-semibold text-slate-300">Fecha<input required type="text" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white focus:border-amber-300 focus:outline-none" placeholder="12 sep 2026" /></label><label className="block text-xs font-semibold text-slate-300">Hora<input required type="time" value={draft.time} onChange={(event) => setDraft({ ...draft, time: event.target.value })} className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white focus:border-amber-300 focus:outline-none" /></label></div><label className="block text-xs font-semibold text-slate-300">Categoría<select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-white focus:border-amber-300 focus:outline-none"><option>Cine</option><option>Cine foro</option><option>Teatro</option><option>Festival</option></select></label></div><button type="submit" className="min-h-11 w-full rounded-xl bg-amber-300 px-4 py-3 text-sm font-extrabold text-slate-950 hover:bg-amber-200">Guardar como borrador</button></form></div>}
    </div>
  );
}