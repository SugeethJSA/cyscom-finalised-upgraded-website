
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { globalApi } from "./api";
import { Calendar, ShieldAlert, Plus, ShieldCheck, Cpu, User, BarChart } from "lucide-react";
import LiveHeatmap from "./components/LiveHeatmap";

export interface EventData {
  id: string;
  slug: string;
  name: string;
  description: string;
  banner_url?: string;
  logo_url?: string;
  start_date?: string;
  end_date?: string;
  status: "active" | "completed" | "draft";
  created_at: string;
}

export function EventsHub() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  async function loadEvents() {
    try {
      setLoading(true);
      const res = await globalApi<{ events: EventData[] }>("/events?public=true");
      setEvents(res.events);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events catalog.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);



  return (
    <div className="relative min-h-screen bg-black text-white px-6 py-12 md:px-16 lg:px-24">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Spacer for global navbar */}
      <div className="pt-24"></div>


      {/* Hero */}
      <section className="relative z-10 text-center max-w-4xl mx-auto mb-20 mt-10">
        <h2 className="text-4xl md:text-7xl font-black font-zentry tracking-tight uppercase leading-none mb-6">
          INTEGRATED <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400">EVENT SUITE</span>
        </h2>
        <p className="text-zinc-400 text-sm md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
          Manage ticketing, live dashboards, category configurations, scan checkpoints, and email dispatches across multiple CySCOM events inside a single unified system.
        </p>
      </section>

      {/* Analytics Dashboard */}
      <section className="relative z-10 max-w-6xl mx-auto mb-16">
        <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-4 flex items-center gap-2">
          <BarChart size={14} /> Global Analytics Overview
        </h3>
        <LiveHeatmap />
      </section>

      {/* Events List */}
      <section className="relative z-10 max-w-6xl mx-auto">
        <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-8 flex items-center gap-2">
          <Cpu size={14} /> Available Event Desks
        </h3>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-950/20 border border-red-500/30 rounded-xl flex items-center gap-4 text-red-300">
            <ShieldAlert size={20} />
            <p>{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
            <p className="text-zinc-500 mb-4">No events registered yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <article key={event.id} className="group relative overflow-hidden bg-zinc-950 border border-zinc-800/80 rounded-2xl hover:border-blue-500/30 transition-all duration-300 flex flex-col h-full glow-effect">
                {/* Banner Image */}
                <div className="h-44 w-full relative overflow-hidden bg-zinc-900">
                  {event.banner_url ? (
                    <img 
                      src={event.banner_url} 
                      alt={event.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-zinc-900 to-zinc-800 flex items-center justify-center text-zinc-700">
                      No Banner Uploaded
                    </div>
                  )}
                  {/* Status Badge */}
                  <span className={`absolute top-4 right-4 text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                    event.status === "active" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                    event.status === "completed" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                    "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                  }`}>
                    {event.status}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {event.logo_url && (
                      <img src={event.logo_url} alt="logo" className="w-6 h-6 rounded-md object-contain" />
                    )}
                    <h4 className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                      {event.name}
                    </h4>
                  </div>

                  <p className="text-zinc-400 text-xs line-clamp-3 mb-6 flex-1">
                    {event.description || "No description provided for this event."}
                  </p>

                  {/* Date Range */}
                  <div className="flex items-center gap-2 text-zinc-500 text-xs mb-6">
                    <Calendar size={13} />
                    <span>
                      {event.start_date ? new Date(event.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "TBD"}
                      {event.end_date && ` - ${new Date(event.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-900">
                    <Link 
                      to={`/events/${event.slug}/register`} 
                      className="cursor-target text-center col-span-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-[0_4px_12px_rgba(59,130,246,0.15)]"
                    >
                      Register Now
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>


    </div>
  );
}
export default EventsHub;
