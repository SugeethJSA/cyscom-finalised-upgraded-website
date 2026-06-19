import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { globalApi } from "../../modules/events/api";
import { Copy, LogOut, ArrowLeft, Ticket, Users, CheckCircle2 } from "lucide-react";

export function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [recruitments, setRecruitments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem("participant_token");
      if (!token) return navigate("/login");

      try {
        const res = await globalApi<any>("/auth/participant/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.user);
        setRegistrations(res.registrations);
        setRecruitments(res.recruitments || []);
      } catch (err) {
        localStorage.removeItem("participant_token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [navigate]);

  function copyId() {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      alert("Participant ID copied to clipboard!");
    }
  }

  function logout() {
    localStorage.removeItem("participant_token");
    localStorage.removeItem("participant_user");
    navigate("/");
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 pt-28 md:pt-32">
      <header className="max-w-4xl mx-auto flex items-center justify-between mb-12">
        <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-white cursor-target">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
        <button onClick={logout} className="flex items-center gap-2 text-red-400 hover:text-red-300 cursor-target font-bold text-xs uppercase tracking-wider">
          <LogOut size={16} /> Logout
        </button>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sidebar: Profile Info */}
        <div className="col-span-1 bg-zinc-950 border border-zinc-800 p-6 rounded-2xl h-fit">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-black mb-4">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold mb-1">{user.name}</h2>
          <p className="text-zinc-400 text-sm mb-6">{user.email}</p>

          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl mb-6">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2">Participant ID</p>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs truncate mr-2 text-zinc-300">{user.id}</span>
              <button onClick={copyId} className="p-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-md transition-colors cursor-target">
                <Copy size={14} />
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2 leading-tight">Provide this ID to your team leader or event admins to link certificates.</p>
          </div>
        </div>

        {/* Main Content: Registrations */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-8">
          
          <section>
            <h3 className="text-lg font-bold font-zentry uppercase tracking-wide flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
              <Ticket size={18} className="text-blue-400" /> Event Registrations
            </h3>
            
            {registrations.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-zinc-800 rounded-xl text-zinc-500">
                You haven't registered for any events yet.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {registrations.map(reg => (
                  <div key={reg.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg">{reg.event_name || reg.event_slug}</h4>
                      <p className="text-sm text-zinc-400 mt-1">Status: <span className="text-white capitalize">{reg.metadata?.verificationStatus || "Verified"}</span></p>
                    </div>
                    {reg.metadata?.verificationStatus === "verified" ? (
                      <CheckCircle2 className="text-green-500" size={24} />
                    ) : (
                      <div className="text-xs uppercase tracking-wider font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full">
                        Pending
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 className="text-lg font-bold font-zentry uppercase tracking-wide flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
              <Users size={18} className="text-violet-400" /> Recruitment Applications
            </h3>
            
            {recruitments.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-zinc-800 rounded-xl text-zinc-500">
                You haven't applied for any recruitments yet.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {recruitments.map(rec => {
                  const getProgress = (status: string) => {
                    const s = status?.toLowerCase() || 'pending';
                    if (s === 'pending') return 1;
                    if (s === 'review' || s === 'under review') return 2;
                    if (s === 'accepted' || s === 'rejected') return 3;
                    return 1;
                  };
                  
                  const step = getProgress(rec.status);
                  
                  return (
                    <div key={rec.id} className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl flex flex-col gap-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-lg">CYSCOM Core Recruitments</h4>
                          <p className="text-sm text-zinc-400 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                            <span>Primary: <span className="text-white font-medium">{rec.department_primary || 'N/A'}</span></span>
                            {rec.department_secondary && <span>Secondary: <span className="text-white font-medium">{rec.department_secondary}</span></span>}
                          </p>
                        </div>
                        <div className={`text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full border w-fit ${
                          rec.status?.toLowerCase() === 'accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          rec.status?.toLowerCase() === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          rec.status?.toLowerCase() === 'review' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                        }`}>
                          {rec.status || 'Pending'}
                        </div>
                      </div>
                      
                      {/* Progress Tracker UI */}
                      <div className="relative pt-4">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-500 relative z-10">
                          <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-white' : ''}`}>
                            <div className={`w-4 h-4 rounded-full ${step >= 1 ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-zinc-800'}`}></div>
                            <span>Applied</span>
                          </div>
                          <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-white' : ''}`}>
                            <div className={`w-4 h-4 rounded-full ${step >= 2 ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-zinc-800'}`}></div>
                            <span>In Review</span>
                          </div>
                          <div className={`flex flex-col items-center gap-2 ${step >= 3 ? 'text-white' : ''}`}>
                            <div className={`w-4 h-4 rounded-full ${
                              step >= 3 
                                ? (rec.status?.toLowerCase() === 'accepted' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]')
                                : 'bg-zinc-800'
                            }`}></div>
                            <span>Decision</span>
                          </div>
                        </div>
                        {/* Connecting Lines */}
                        <div className="absolute top-[22px] left-8 right-8 h-[2px] bg-zinc-800 z-0">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-1000"
                            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}
export default Profile;
