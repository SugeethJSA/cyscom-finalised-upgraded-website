import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { FormField, DEFAULT_FIELDS, DynamicField, isFieldVisible } from "./PublicRegister";
import { Send, ArrowLeft } from "lucide-react";

export function PublicTransfer() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const [originalId, setOriginalId] = useState("");
  const [recipientValues, setRecipientValues] = useState<Record<string, any>>({});
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [globalSettings, setGlobalSettings] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
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

    // Load form fields
    api<{ fields: FormField[] }>(slug, "/form-fields/public")
      .then((res) => setFields(res.fields))
      .catch(() => undefined);
  }, [slug]);

  const activeFields = useMemo(() => {
    if (fields.length === 0) return DEFAULT_FIELDS;
    return fields.filter((f) => f.active);
  }, [fields]);

  useEffect(() => {
    let changed = false;
    const newValues = { ...recipientValues };
    activeFields.forEach(field => {
      if (!isFieldVisible(field, activeFields, recipientValues)) {
        if (newValues[field.fieldKey] !== undefined && newValues[field.fieldKey] !== "") {
          newValues[field.fieldKey] = "";
          changed = true;
        }
      }
    });
    if (changed) setRecipientValues(newValues);
  }, [recipientValues, activeFields]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProof(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const recipientData: Record<string, any> = {
      name: recipientValues.name || "",
      email: recipientValues.email || "",
      phone: recipientValues.phone || "",
      college: recipientValues.college || "",
      department: recipientValues.department || "",
      externalRef: recipientValues.externalRef || "",
      customFields: {}
    };

    activeFields.forEach((field) => {
      const key = field.fieldKey;
      if (["name", "email", "phone", "college", "department", "externalRef"].includes(key)) {
        recipientData[key] = recipientValues[key];
      } else {
        recipientData.customFields[key] = recipientValues[key];
      }
    });

    try {
      await api(slug, "/attendees/public-transfer", {
        method: "POST",
        body: JSON.stringify({
          originalAttendeeId: originalId,
          recipient: recipientData,
          paymentProof
        })
      });
      setMessage("Transfer request submitted successfully. Operations team will verify and transfer your ticket shortly.");
      setOriginalId("");
      setRecipientValues({});
      setPaymentProof(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transfer request failed.");
    } finally {
      setLoading(false);
    }
  }

  const loginBg = globalSettings.login_background || "";
  const isVideoBg = loginBg.includes('.mp4') || loginBg.includes('.webm');

  return (
    <main className="relative min-h-screen bg-black flex items-center justify-center py-12 px-6">
      {/* Background Video/Image */}
      {loginBg && (
        isVideoBg ? (
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-20 z-0">
            <source src={loginBg} />
          </video>
        ) : (
          <div className="absolute inset-0 bg-cover bg-center opacity-20 z-0" style={{ backgroundImage: `url(${loginBg})` }} />
        )
      )}

      {/* Catalog Button */}
      <button 
        onClick={() => navigate("/")} 
        className="absolute top-6 left-6 cursor-target secondary text-xs uppercase tracking-wider font-semibold py-2 px-4 rounded-full flex items-center gap-2 z-10"
      >
        <ArrowLeft size={14} /> Catalog
      </button>

      {/* Transfer Panel */}
      <div className="relative z-10 w-full max-w-3xl bg-zinc-950/90 border border-zinc-800 p-8 rounded-2xl glow-effect text-left">
        <div className="text-center mb-8 border-b border-zinc-900 pb-6">
          {globalSettings.logo_url && (
            <img src={globalSettings.logo_url} alt="Logo" className="w-16 h-16 rounded-xl object-contain mx-auto mb-4" />
          )}
          <p className="eyebrow">{globalSettings.event_name || slug.toUpperCase()}</p>
          <h2 className="text-2xl font-black font-zentry uppercase tracking-wide mt-1 text-white">
            Ticket Transfer portal
          </h2>
        </div>

        {message && (
          <div className="p-4 mb-6 text-xs bg-green-950/30 border border-green-500/20 text-green-400 rounded-lg text-center font-semibold">
            {message}
          </div>
        )}

        {error && (
          <div className="p-4 mb-6 text-xs bg-red-950/30 border border-red-500/20 text-red-400 rounded-lg text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-6">
          <label className="text-zinc-500 font-semibold text-xs uppercase tracking-wider flex flex-col gap-2">
            Original Ticket ID (UUID)
            <input 
              type="text" 
              required
              placeholder="e.g. 1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"
              value={originalId} 
              onChange={e => setOriginalId(e.target.value)} 
              className="bg-zinc-900 border-zinc-800"
            />
          </label>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wide mb-4 border-b border-zinc-900 pb-2">
              Recipient Ticket Owner Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeFields.filter(f => isFieldVisible(f, activeFields, recipientValues)).map((field) => (
                <DynamicField
                  key={field.id}
                  field={field}
                  value={recipientValues[field.fieldKey]}
                  onChange={(value) => setRecipientValues({ ...recipientValues, [field.fieldKey]: value })}
                  allValues={recipientValues}
                />
              ))}
            </div>
          </div>

          {globalSettings.require_payment_proof !== "false" && (
            <div className="panel bg-zinc-900/50 border-zinc-800/80 p-5 mt-2 rounded-xl flex flex-col gap-4">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">Transfer processing fee Receipt</h4>
                <p className="text-xs text-zinc-500 mt-1">Please upload screenshot proof of payment receipt.</p>
              </div>
              
              <input type="file" accept="image/*" required onChange={handleFileChange} className="bg-zinc-950 border-zinc-800 cursor-pointer" />
              {paymentProof && (
                <div className="mt-2 text-left">
                  <p className="text-[10px] uppercase font-bold text-zinc-500 mb-2">Screenshot Preview:</p>
                  <img src={paymentProof} alt="Receipt Preview" className="max-w-xs h-32 object-contain rounded-lg border border-zinc-800" />
                </div>
              )}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider mt-4 shadow-[0_4px_14px_rgba(59,130,246,0.3)] cursor-target disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Send size={14} /> {loading ? "Submitting Request..." : "Submit Transfer Request"}
          </button>
        </form>
      </div>
    </main>
  );
}
export default PublicTransfer;
