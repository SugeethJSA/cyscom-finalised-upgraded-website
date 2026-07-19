import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, setSession, Session } from "./api";
import { KeyRound, Mail, ArrowLeft } from "lucide-react";

export function Login() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [globalSettings, setGlobalSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load event branding settings
    api<{ settings: Record<string, string> }>(slug, "/settings/public")
      .then((res) => {
        setGlobalSettings(res.settings);
        if (res.settings.primary_color) {
          document.documentElement.style.setProperty("--color-brand-accent", res.settings.primary_color);
        }
      })
      .catch(() => undefined);
  }, [slug]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await api<Session>(slug, "/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      setSession(slug, session);
      // Redirect to suite dashboard
      navigate(`/events/${slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  const loginBg = globalSettings.login_background || "";
  const isVideoBg = loginBg.includes('.mp4') || loginBg.includes('.webm');

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-black px-6">
      {/* Background Video/Image */}
      {loginBg && (
        isVideoBg ? (
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-35 z-0">
            <source src={loginBg} />
          </video>
        ) : (
          <div className="absolute inset-0 bg-cover bg-center opacity-30 z-0" style={{ backgroundImage: `url(${loginBg})` }} />
        )
      )}

      {/* Back to Catalog */}
      <button 
        onClick={() => navigate("/events")} 
        className="absolute top-6 left-6 cursor-target secondary text-xs uppercase tracking-wider font-semibold py-2 px-4 rounded-full flex items-center gap-2 z-10"
      >
        <ArrowLeft size={14} /> Catalog
      </button>

      {/* Login Card */}
      <form onSubmit={submit} className="relative z-10 w-full max-w-md bg-zinc-950/90 border border-zinc-800 p-8 rounded-2xl glow-effect">
        <div className="text-center mb-8">
          {globalSettings.logo_url && (
            <img src={globalSettings.logo_url} alt="Logo" className="w-16 h-16 rounded-xl object-contain mx-auto mb-4" />
          )}
          <p className="eyebrow">{globalSettings.event_name || slug.toUpperCase()}</p>
          <h2 className="text-2xl font-black font-zentry uppercase tracking-wide mt-1 text-white">
            Operations Login
          </h2>
        </div>

        {error && (
          <div className="p-3.5 mb-6 text-xs bg-red-950/30 border border-red-500/20 text-red-400 rounded-lg text-center font-semibold">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-5">
          <label className="text-zinc-500 font-semibold text-xs uppercase tracking-wider flex flex-col gap-2">
            Email Address
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"><Mail size={16} /></span>
              <input 
                type="email" 
                required 
                className="pl-11 pr-4 py-3 bg-zinc-900 border-zinc-800 w-full"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </label>

          <label className="text-zinc-500 font-semibold text-xs uppercase tracking-wider flex flex-col gap-2">
            Credentials Key
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"><KeyRound size={16} /></span>
              <input 
                type="password" 
                required 
                className="pl-11 pr-4 py-3 bg-zinc-900 border-zinc-800 w-full"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </label>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold uppercase text-xs tracking-wider mt-4 shadow-[0_4px_14px_rgba(59,130,246,0.3)] cursor-target disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </div>
      </form>
    </main>
  );
}
export default Login;
