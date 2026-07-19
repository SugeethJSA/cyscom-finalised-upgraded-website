import "./index.css";
import { useState, useEffect } from 'react';
import { ArrowRight, Send, CheckCircle, ShieldCheck } from 'lucide-react';

function Recruitments() {
  const [formData, setFormData] = useState(() => {
    let defaultUser = { name: '', email: '' };
    try {
      const userStr = localStorage.getItem('participant_user');
      if (userStr) defaultUser = JSON.parse(userStr);
    } catch(e) {}
    
    return {
      name: defaultUser.name || '',
      email: defaultUser.email || '',
      phone: '',
      reg_number: '',
      department_primary: 'dev',
      department_secondary: 'des',
      skills: '',
      motivation: ''
    };
  });

  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [formSchema, setFormSchema] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('participant_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    fetch(`${API_URL}/intake/settings`)
      .then(res => res.json())
      .then(data => {
        if (data && data.form_schema) {
          setFormSchema(data.form_schema);
        }
      })
      .catch(err => console.error('Failed to load form schema:', err));
  }, []);

  const isFieldVisible = (field, currentFormData) => {
    if (!field.dependsOn) return true;
    const parts = field.dependsOn.split(':');
    if (parts.length === 2) {
      const key = parts[0];
      const value = parts[1];
      return currentFormData[key] === value;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/recruitments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Submission failed');
      setStatus('success');
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred during submission.');
      setStatus('error');
    }
  };

  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('participant_user');
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u.role && u.role !== 'participant') {
          setIsMember(true);
        }
      }
    } catch(e) {}
  }, []);

  if (isMember) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 cyber-grid">
        <div className="max-w-md w-full bg-zinc-950/80 border border-blue-500/30 p-8 rounded-2xl text-center glow-effect backdrop-blur-md">
          <ShieldCheck size={64} className="text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-zentry uppercase tracking-wider text-blue-400 mb-4">Access Granted</h2>
          <p className="text-zinc-400 font-mono text-sm leading-relaxed mb-8">
            You are already a member of CySCOM! There is no need to apply again.
          </p>
          <a 
            href="/"
            className="inline-block bg-blue-500/10 text-blue-400 border border-blue-500/30 px-6 py-2 rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-blue-500 hover:text-black transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 cyber-grid">
        <div className="max-w-md w-full bg-zinc-950/80 border border-green-500/30 p-8 rounded-2xl text-center glow-effect backdrop-blur-md">
          <CheckCircle size={64} className="text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-zentry uppercase tracking-wider text-green-400 mb-4">Application Received</h2>
          <p className="text-zinc-400 font-mono text-sm leading-relaxed mb-8">
            Your intake transmission has been recorded in the central database. Our team will review your profile and contact you shortly.
          </p>
          <button 
            onClick={() => setStatus('idle')}
            className="bg-green-500/10 text-green-400 border border-green-500/30 px-6 py-2 rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-green-500 hover:text-black transition-colors"
          >
            Return to Terminal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-blue-50 relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none cyber-grid opacity-20" />
      
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-24">
        
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 text-green-400 font-mono text-xs uppercase tracking-widest mb-4">
            <ShieldCheck size={16} /> Secure Intake Gateway
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-zentry tracking-tight uppercase leading-none mb-6">
            JOIN <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-green-400">CYSCOM</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            We are looking for passionate developers, designers, and cybersecurity enthusiasts to build the next generation of open-source tools and experiences.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-6 md:p-10 backdrop-blur-xl shadow-2xl">
          {status === 'error' && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Full Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Registration Number</label>
              <input required type="text" name="reg_number" value={formData.reg_number} onChange={handleChange} className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="21BCE0000" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">VIT Email ID</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="john.doe2021@vitstudent.ac.in" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Phone Number</label>
              <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="+91 9876543210" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Primary Department</label>
              <select required name="department_primary" value={formData.department_primary} onChange={handleChange} className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors appearance-none">
                <option value="dev">Developers & Operations</option>
                <option value="des">Creative Design & UI/UX</option>
                <option value="tec">Technical CTF & Security</option>
                <option value="soc">Social Media & PR</option>
                <option value="eve">Event Management</option>
                <option value="con">Content & Editorial</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Secondary Department</label>
              <select name="department_secondary" value={formData.department_secondary} onChange={handleChange} className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors appearance-none">
                <option value="none">None (Optional)</option>
                <option value="dev">Developers & Operations</option>
                <option value="des">Creative Design & UI/UX</option>
                <option value="tec">Technical CTF & Security</option>
                <option value="soc">Social Media & PR</option>
                <option value="eve">Event Management</option>
                <option value="con">Content & Editorial</option>
              </select>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Skills & Experience</label>
              <textarea required name="skills" value={formData.skills} onChange={handleChange} rows="3" className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors resize-none" placeholder="Languages, frameworks, tools, past projects..."></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Why CySCOM?</label>
              <textarea required name="motivation" value={formData.motivation} onChange={handleChange} rows="3" className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors resize-none" placeholder="What drives you to join our community?"></textarea>
            </div>
          </div>

          {formSchema.length > 0 && (
            <div className="mb-8 p-6 bg-violet-900/10 border border-violet-500/20 rounded-xl space-y-6">
              <h3 className="text-xs font-bold tracking-widest text-violet-400 uppercase mb-4">Department Specific Requirements</h3>
              {formSchema.filter(f => isFieldVisible(f, formData)).map(field => (
                <div key={field.id} className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'longtext' ? (
                    <textarea 
                      required={field.required} 
                      name={field.id} 
                      value={formData[field.id] || ''} 
                      onChange={handleChange} 
                      rows="3" 
                      className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors resize-none" 
                      placeholder={`Enter ${field.label}...`} 
                    />
                  ) : (
                    <input 
                      required={field.required} 
                      type={field.type === 'url' ? 'url' : 'text'} 
                      name={field.id} 
                      value={formData[field.id] || ''} 
                      onChange={handleChange} 
                      className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors" 
                      placeholder={`Enter ${field.label}...`} 
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <button 
            type="submit" 
            disabled={status === 'submitting'}
            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold uppercase tracking-widest text-sm py-4 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'submitting' ? 'Transmitting Data...' : 'Submit Application'} <Send size={16} />
          </button>
        </form>

      </div>
    </div>
  );
}

export default Recruitments;
