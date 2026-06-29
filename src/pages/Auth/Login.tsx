import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, KeyRound, ArrowLeft, CheckCircle2, Shield, Eye, EyeOff } from "lucide-react";
import { globalApi } from "../../modules/events/api";

export function Login() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<"password" | "passwordless">("password");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (pass: string) => {
    if (pass.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(pass)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(pass)) return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(pass)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return "Password must contain at least one special character.";
    return null;
  };

  const validateEmail = (mail: string) => {
    if (!/^[a-zA-Z0-9.]+@vitstudent\.ac\.in$/.test(mail)) {
      return "Only @vitstudent.ac.in emails are allowed.";
    }
    return null;
  };

  async function submitPasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    const passError = validatePassword(password);
    if (passError) {
      setError(passError);
      return;
    }

    setLoading(true);
    try {
      // Typically we'd use globalApi here
      // const res = await globalApi<{ token: string, user: any }>("/auth/participant/login", { ... });
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (email !== "hacker@vitstudent.ac.in") throw new Error("Invalid credentials (Mock: use hacker@vitstudent.ac.in)");

      localStorage.setItem("participant_token", "mock_jwt_token");
      localStorage.setItem("participant_user", JSON.stringify({ email, name: "CYSCOM User" }));
      navigate("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (otp !== "123456") throw new Error("Invalid OTP code. (Hint: use 123456)");
      
      localStorage.setItem("participant_token", "mock_jwt_token");
      localStorage.setItem("participant_user", JSON.stringify({ email, name: "CYSCOM User" }));
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

      <div className="relative z-10 w-full max-w-md bg-zinc-950/90 border border-zinc-800 p-8 rounded-2xl glow-effect text-white">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black font-zentry uppercase tracking-wide mt-1 flex justify-center items-center gap-2">
            ACCESS TERMINAL
          </h2>
        </div>

        {/* Login Method Toggle */}
        <div className="flex justify-center mb-8 border-b border-zinc-800/60 pb-6 gap-4">
          <button 
            type="button"
            onClick={() => { setLoginMethod("passwordless"); setError(""); setStep("email"); }}
            className={`px-6 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 ${loginMethod === "passwordless" ? "bg-blue-600 text-white shadow-[0_2px_10px_rgba(37,99,235,0.3)]" : "text-zinc-400 hover:text-white"}`}
          >
            OTP Verification
          </button>
          <button 
            type="button"
            onClick={() => { setLoginMethod("password"); setError(""); }}
            className={`px-6 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 ${loginMethod === "password" ? "bg-blue-600 text-white shadow-[0_2px_10px_rgba(37,99,235,0.3)]" : "text-zinc-400 hover:text-white"}`}
          >
            Password Login
          </button>
        </div>

        {error && (
          <div className="p-3.5 mb-6 text-xs bg-red-950/30 border border-red-500/20 text-red-400 rounded-lg text-center font-semibold">
            {error}
          </div>
        )}

        {loginMethod === "password" ? (
          <form onSubmit={submitPasswordLogin} className="flex flex-col gap-6">
            <label className="text-zinc-300 text-sm flex flex-col gap-2">
              Email address
              <input 
                type="email" 
                required 
                className="px-4 py-3.5 bg-zinc-900/80 border border-zinc-800 w-full text-white outline-none focus:border-blue-500/50 rounded-xl transition-colors"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@vitstudent.ac.in"
              />
            </label>

            <label className="text-zinc-300 text-sm flex flex-col gap-2">
              Password
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  required 
                  className="pl-4 pr-12 py-3.5 bg-zinc-900/80 border border-zinc-800 w-full text-white outline-none focus:border-blue-500/50 rounded-xl transition-colors"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-target flex items-center justify-center"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <span className="text-[10px] text-zinc-500/70 mt-1 font-medium">
                Must be 8+ chars with uppercase, lowercase, number, and special char.
              </span>
            </label>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full text-center bg-blue-600 hover:bg-blue-700 py-4 rounded-full font-bold text-sm mt-2 shadow-[0_4px_14px_rgba(59,130,246,0.3)] cursor-target disabled:opacity-50 flex justify-center items-center"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        ) : (
          /* PASSWORDLESS FLOW */
          step === "email" ? (
            <form onSubmit={requestOtp} className="flex flex-col gap-6">
              <label className="text-zinc-300 text-sm flex flex-col gap-2">
                Email address
                <input 
                  type="email" 
                  required 
                  className="px-4 py-3.5 bg-zinc-900/80 border border-zinc-800 w-full text-white outline-none focus:border-blue-500/50 rounded-xl transition-colors"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@vitstudent.ac.in"
                />
              </label>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full text-center bg-blue-600 hover:bg-blue-700 py-4 rounded-full font-bold text-sm mt-2 shadow-[0_4px_14px_rgba(59,130,246,0.3)] cursor-target disabled:opacity-50 flex justify-center items-center"
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="flex flex-col gap-6">
              <div className="text-center text-sm text-blue-400 mb-2 flex items-center justify-center gap-2">
                <CheckCircle2 size={16} /> Verification Code Sent
              </div>
              
              <label className="text-zinc-300 text-sm flex flex-col gap-2">
                6-Digit Code
                <input 
                  type="text" 
                  required 
                  maxLength={6}
                  className="px-4 py-3.5 bg-zinc-900/80 border border-zinc-800 w-full text-white outline-none focus:border-blue-500/50 rounded-xl transition-colors tracking-[0.5em] font-mono text-center"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                />
              </label>

              <button 
                type="submit" 
                disabled={loading || otp.length !== 6}
                className="w-full text-center bg-green-600 hover:bg-green-700 py-4 rounded-full font-bold text-sm mt-2 shadow-[0_4px_14px_rgba(22,163,74,0.3)] cursor-target disabled:opacity-50 flex justify-center items-center"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
              
              <button 
                type="button"
                onClick={() => setStep("email")}
                className="text-sm text-zinc-500 hover:text-white mt-2 transition-colors cursor-target"
              >
                Back to Email
              </button>
            </form>
          )
        )}

        <div className="mt-8 text-center text-sm text-zinc-500">
          Don't have an account? <Link to="/signup" className="text-blue-400 hover:underline">Sign up</Link>
        </div>
      </div>
    </main>
  );
}
export default Login;
