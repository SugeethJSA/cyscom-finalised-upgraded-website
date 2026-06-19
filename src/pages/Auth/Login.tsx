import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { globalApi } from "../../modules/events/api";
import { Mail, KeyRound, ArrowLeft } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await globalApi<{ token: string, user: any }>("/auth/participant/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem("participant_token", res.token);
      localStorage.setItem("participant_user", JSON.stringify(res.user));
      navigate("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-black px-6">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <Link 
        to="/" 
        className="absolute top-28 md:top-32 left-6 cursor-target secondary text-xs uppercase tracking-wider font-semibold py-2 px-4 rounded-full flex items-center gap-2 z-10 text-white hover:bg-white/10"
      >
        <ArrowLeft size={14} /> Catalog
      </Link>

      <form onSubmit={submit} className="relative z-10 w-full max-w-md bg-zinc-950/90 border border-zinc-800 p-8 rounded-2xl glow-effect text-white">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black font-zentry uppercase tracking-wide mt-1">
            Participant Login
          </h2>
          <p className="text-sm text-zinc-400 mt-2">Access your tickets and profile.</p>
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
                className="pl-11 pr-4 py-3 bg-zinc-900 border-zinc-800 w-full text-white outline-none focus:border-blue-500/50 rounded-xl transition-colors"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </label>

          <label className="text-zinc-500 font-semibold text-xs uppercase tracking-wider flex flex-col gap-2">
            Password
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"><KeyRound size={16} /></span>
              <input 
                type="password" 
                required 
                className="pl-11 pr-4 py-3 bg-zinc-900 border-zinc-800 w-full text-white outline-none focus:border-blue-500/50 rounded-xl transition-colors"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </label>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full text-center bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold uppercase text-xs tracking-wider mt-4 shadow-[0_4px_14px_rgba(59,130,246,0.3)] cursor-target disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-zinc-500 font-semibold">
          Don't have an account? <Link to="/signup" className="text-blue-400 hover:underline">Sign up</Link>
        </div>
      </form>
    </main>
  );
}
export default Login;
