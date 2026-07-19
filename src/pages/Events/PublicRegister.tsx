import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, API_BASE } from "./api";
import { Save, ArrowLeft, X, User } from "lucide-react";

export type FormField = {
  id: string;
  fieldKey: string;
  label: string;
  fieldType: "text" | "email" | "phone" | "number" | "select" | "textarea" | "checkbox" | "hidden" | "calculated";
  required: boolean;
  options: string[];
  sortOrder: number;
  active: boolean;
  showInList: boolean;
  visibilityRules?: any;
  validations?: any;
  calculation?: string | null;
};

export const DEFAULT_FIELDS: FormField[] = [
  { id: "f-name", fieldKey: "name", label: "Full Name", fieldType: "text", required: true, options: [], sortOrder: 1, active: true, showInList: true },
  { id: "f-email", fieldKey: "email", label: "Email Address", fieldType: "email", required: true, options: [], sortOrder: 2, active: true, showInList: true },
  { id: "f-phone", fieldKey: "phone", label: "Phone Number", fieldType: "phone", required: false, options: [], sortOrder: 3, active: true, showInList: true },
  { id: "f-college", fieldKey: "college", label: "Club Name / Institution", fieldType: "text", required: false, options: [], sortOrder: 4, active: true, showInList: true },
  { id: "f-dept", fieldKey: "department", label: "Booking ID / Area Code", fieldType: "text", required: false, options: [], sortOrder: 5, active: true, showInList: true }
];

export function isFieldVisible(field: FormField, allFields: FormField[], formValues: Record<string, any>): boolean {
  if (!field.visibilityRules || !field.visibilityRules.rules || field.visibilityRules.rules.length === 0) return true;
  
  const evaluateRule = (rule: any) => {
    const parentField = allFields.find(f => f.fieldKey === rule.field);
    if (parentField && !isFieldVisible(parentField, allFields, formValues)) return false;

    const val = formValues[rule.field] ?? "";
    const strVal = String(val).toLowerCase();
    const ruleVal = String(rule.value || "").toLowerCase();
    
    switch (rule.operator) {
      case "equals": return strVal === ruleVal;
      case "not_equals": return strVal !== ruleVal;
      case "contains": return strVal.includes(ruleVal);
      case "gt": return Number(val) > Number(rule.value);
      case "lt": return Number(val) < Number(rule.value);
      case "empty": return val === "" || val === null || val === undefined || (Array.isArray(val) && val.length === 0);
      case "not_empty": return val !== "" && val !== null && val !== undefined && !(Array.isArray(val) && val.length === 0);
      default: return true;
    }
  };

  return field.visibilityRules.condition === "OR" 
    ? field.visibilityRules.rules.some(evaluateRule)
    : field.visibilityRules.rules.every(evaluateRule);
}

export function calculateFieldValue(calculation: string, values: Record<string, any>): number {
  if (!calculation) return 0;
  try {
    const expr = calculation.replace(/{{(.*?)}}/g, (match, key) => {
      const val = values[key.trim()];
      return String(Number(val) || 0);
    });
    const sanitized = expr.replace(/[^0-9+\-*/(). ]/g, "");
    return new Function(`return ${sanitized}`)();
  } catch (e) {
    return 0;
  }
}

export function DynamicField({ field, value, onChange, allValues }: { field: FormField; value: unknown; onChange: (value: unknown) => void; allValues?: Record<string, any> }) {
  if (field.fieldType === "hidden") {
    return null;
  }

  if (field.fieldType === "calculated") {
    const calc = calculateFieldValue(field.calculation || "", allValues || {});
    if (value !== calc) {
      setTimeout(() => onChange(calc), 0);
    }
    return (
      <label className="text-zinc-500 font-semibold text-xs uppercase tracking-wider flex flex-col gap-2">{field.label}
        <input type="text" readOnly value={calc} className="bg-zinc-900 border-zinc-800 font-bold" />
      </label>
    );
  }

  const minProps = field.validations?.min !== undefined ? { [field.fieldType === "number" ? "min" : "minLength"]: field.validations.min } : {};
  const maxProps = field.validations?.max !== undefined ? { [field.fieldType === "number" ? "max" : "maxLength"]: field.validations.max } : {};
  const patternProps = field.validations?.regex ? { pattern: field.validations.regex } : {};
  const commonProps = { required: field.required, ...minProps, ...maxProps, ...patternProps };

  if (field.fieldType === "select" || (Array.isArray(field.options) && field.options.length > 0)) {
    return (
      <label className="text-zinc-500 font-semibold text-xs uppercase tracking-wider flex flex-col gap-2">{field.label}
        <select value={String(value ?? "")} {...commonProps} onChange={(event) => onChange(event.target.value)} className="bg-zinc-900 border-zinc-800">
          <option value="">Select</option>
          {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
    );
  }

  if (field.fieldType === "textarea") {
    return (
      <label className="text-zinc-500 font-semibold text-xs uppercase tracking-wider flex flex-col gap-2">{field.label}
        <textarea value={String(value ?? "")} {...commonProps} onChange={(event) => onChange(event.target.value)} className="bg-zinc-900 border-zinc-800" />
      </label>
    );
  }

  if (field.fieldType === "checkbox") {
    return (
      <label className="flex flex-row items-center gap-3 cursor-pointer text-xs font-semibold text-zinc-400">
        <input type="checkbox" checked={Boolean(value)} {...commonProps} onChange={(event) => onChange(event.target.checked)} className="w-5 h-5 bg-zinc-900 border-zinc-800 accent-blue-500 rounded" />
        {field.label}
      </label>
    );
  }

  const inputType = field.fieldType === "phone" ? "tel" : field.fieldType;
  return (
    <label className="text-zinc-500 font-semibold text-xs uppercase tracking-wider flex flex-col gap-2">{field.label}
      <input type={inputType} value={String(value ?? "")} {...commonProps} onChange={(event) => onChange(event.target.value)} className="bg-zinc-900 border-zinc-800" />
    </label>
  );
}

export function PublicRegister() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const [fields, setFields] = useState<FormField[]>([]);
  const [globalSettings, setGlobalSettings] = useState<Record<string, string>>({});
  const [values, setValues] = useState<Record<string, any>>({});
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load participant profile data if logged in
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("participant_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setValues(prev => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          ...user.profile_data
        }));
      }
    } catch (err) {}
  }, []);

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

    // Load public form fields
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
    const newValues = { ...values };
    activeFields.forEach(field => {
      if (!isFieldVisible(field, activeFields, values)) {
        if (newValues[field.fieldKey] !== undefined && newValues[field.fieldKey] !== "") {
          newValues[field.fieldKey] = "";
          changed = true;
        }
      }
    });
    if (changed) setValues(newValues);
  }, [values, activeFields]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setValues(prev => {
      const next = { ...prev };
      let changed = false;
      activeFields.forEach(f => {
        if (f.fieldType === "hidden") {
          const val = params.get(f.fieldKey);
          if (val && next[f.fieldKey] !== val) {
            next[f.fieldKey] = val;
            changed = true;
          }
        }
      });
      return changed ? next : prev;
    });
  }, [activeFields]);

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

    const payload: Record<string, any> = {
      name: values.name || "",
      email: values.email || "",
      phone: values.phone || "",
      college: values.college || "",
      department: values.department || "",
      externalRef: values.externalRef || "",
      customFields: {},
      paymentProof
    };

    activeFields.forEach((field) => {
      const key = field.fieldKey;
      if (["name", "email", "phone", "college", "department", "externalRef"].includes(key)) {
        payload[key] = values[key];
      } else {
        payload.customFields[key] = values[key];
      }
    });

    try {
      const token = localStorage.getItem("participant_token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      await api(slug, "/attendees/public-register", {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });
      setMessage("Registration submitted successfully. Check your email for QR ticket confirmation once verified.");
      setValues({});
      setPaymentProof(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
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
        onClick={() => navigate("/events")} 
        className="absolute top-6 left-6 cursor-target secondary text-xs uppercase tracking-wider font-semibold py-2 px-4 rounded-full flex items-center gap-2 z-10"
      >
        <ArrowLeft size={14} /> Catalog
      </button>

      {/* Auth Banner */}
      {!localStorage.getItem("participant_token") && (
        <div className="absolute top-6 right-6 z-10 bg-zinc-900/80 border border-zinc-800 p-3 rounded-xl flex items-center gap-3 backdrop-blur-md">
          <User size={16} className="text-zinc-400" />
          <div className="text-xs">
            <span className="text-zinc-400">Want certificates & history? </span>
            <button onClick={() => navigate("/login")} className="text-blue-400 hover:text-blue-300 font-bold ml-1 cursor-target">Login</button>
            <span className="text-zinc-600 mx-1">or</span>
            <button onClick={() => navigate("/signup")} className="text-blue-400 hover:text-blue-300 font-bold cursor-target">Sign up</button>
          </div>
        </div>
      )}

      {/* Registration Panel */}
      <div className="relative z-10 w-full max-w-3xl bg-zinc-950/90 border border-zinc-800 p-8 rounded-2xl glow-effect text-left">
        <div className="text-center mb-8 border-b border-zinc-900 pb-6">
          {globalSettings.logo_url && (
            <img src={globalSettings.logo_url} alt="Logo" className="w-16 h-16 rounded-xl object-contain mx-auto mb-4" />
          )}
          <p className="eyebrow">{globalSettings.event_name || slug.toUpperCase()}</p>
          <h2 className="text-2xl font-black font-zentry uppercase tracking-wide mt-1 text-white">
            Ticket Registration
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

        {globalSettings.public_registrations_enabled === "false" ? (
          <div className="text-center py-10 flex flex-col gap-3">
            <p className="text-yellow-500 text-sm font-bold uppercase tracking-wider">Registration Disabled</p>
            <p className="text-xs text-zinc-500">Public registrations have been closed by the event administrators.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeFields.filter(f => isFieldVisible(f, activeFields, values)).map((field) => (
                <DynamicField
                  key={field.id}
                  field={field}
                  value={values[field.fieldKey]}
                  onChange={(value) => setValues({ ...values, [field.fieldKey]: value })}
                  allValues={values}
                />
              ))}
            </div>

            {globalSettings.require_payment_proof !== "false" && (
              <div className="panel bg-zinc-900/50 border-zinc-800/80 p-5 mt-2 rounded-xl flex flex-col gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide">Verification Payment Upload</h4>
                  <p className="text-xs text-zinc-500 mt-1">Please upload screenshot proof of entry ticket booking.</p>
                </div>
                
                <input type="file" accept="image/*" required onChange={handleFileChange} className="bg-zinc-950 border-zinc-800 cursor-pointer" />
                {paymentProof && (
                  <div className="mt-2 text-left">
                    <p className="text-[10px] uppercase font-bold text-zinc-500 mb-2">Screenshot Preview:</p>
                    <img src={paymentProof} alt="Payment Proof" className="max-w-xs h-32 object-contain rounded-lg border border-zinc-800" />
                  </div>
                )}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider mt-4 shadow-[0_4px_14px_rgba(59,130,246,0.3)] cursor-target disabled:opacity-50"
            >
              {loading ? "Submitting Registration..." : "Submit Ticket Registration"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
export default PublicRegister;
