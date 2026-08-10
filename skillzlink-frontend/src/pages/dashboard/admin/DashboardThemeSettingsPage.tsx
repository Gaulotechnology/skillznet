import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:18080/api";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex items-center gap-4 cursor-pointer">
      <div className={`relative w-12 h-7 rounded-full transition-colors border ${checked ? 'bg-[var(--accent-color)] border-[var(--accent-color)]' : 'bg-[var(--bg-secondary)] border-[var(--border-color)]'}`} onClick={() => onChange(!checked)}>
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </div>
      {label && <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>}
    </label>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{label}</label>
      {children}
      {hint && <p className="text-xs text-[var(--text-secondary)] mt-1.5">{hint}</p>}
    </div>
  );
}

function Input({ value, onChange, type = "text", placeholder }: { value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] transition-colors"
    />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] transition-colors">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function Textarea({ value, onChange, rows = 3, placeholder }: { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] transition-colors resize-none"
    />
  );
}

const tabs = [
  { id: "general", label: "General", icon: "lnr-cog" },
  { id: "email", label: "Email", icon: "lnr-envelope" },
  { id: "payment", label: "Payment", icon: "lnr-diamond" },
  { id: "paynow", label: "PayNow", icon: "lnr-credit-card" },
  { id: "security", label: "Security", icon: "lnr-lock" },
  { id: "affiliate", label: "Affiliate", icon: "lnr-users" },
  { id: "agent", label: "Agent", icon: "lnr-laptop" },
  { id: "social", label: "Social & Contact", icon: "lnr-earth" },
  { id: "packages", label: "Packages", icon: "lnr-layers" },
];

interface Package {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  active: boolean;
}

const defaultPackages: Package[] = [
  { id: "1", name: "Basic", price: 99, duration: 30, features: ["5 Skills", "Basic Profile", "Email Support"], active: true },
  { id: "2", name: "Professional", price: 299, duration: 30, features: ["20 Skills", "Featured Profile", "Priority Support", "Analytics"], active: true },
  { id: "3", name: "Enterprise", price: 599, duration: 30, features: ["Unlimited Skills", "Premium Profile", "24/7 Support", "Analytics", "API Access", "Custom Branding"], active: true },
];

export function DashboardThemeSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [toast, setToast] = useState("");
  const [packages, setPackages] = useState<Package[]>(defaultPackages);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [pkgForm, setPkgForm] = useState({ name: "", price: "", duration: "30", features: "", active: true });

  // Settings state
  const [general, setGeneral] = useState({
    siteName: "SkillzLink", siteDescription: "", currency: "ZAR", faviconUrl: "",
    enableChat: true, maintenanceMode: false, comingSoon: false, defaultLanguage: "English",
    accentColor: "#FF385C", accentHover: "#E31C5F", accentLight: "#FFF1F3",
    textPrimary: "#111827", textSecondary: "#6B7280", bgPrimary: "#FFFFFF", bgSecondary: "#F9FAFB", bgAuthPanel: "#F0F4F8", borderColor: "#E5E7EB",
  });
  const [email, setEmail] = useState({
    smtpHost: "", smtpPort: "587", smtpUsername: "", smtpPassword: "",
    smtpEncryption: "TLS", fromEmail: "", fromName: "",
  });
  const [payment, setPayment] = useState({
    activeGateway: "Stripe", stripePublicKey: "", stripeSecretKey: "",
    payfastMerchantId: "", payfastMerchantKey: "", payfastPassphrase: "",
    paystackPublicKey: "", paystackSecretKey: "", sandboxMode: true, commissionRate: "10",
  });
  const [paynow, setPaynow] = useState({
    active: false, mode: "sandbox",
    integration_id: "", integration_key: "", auth_email: "",
    result_url: "", return_url: "",
  });
  const [security, setSecurity] = useState({
    twoFactor: false, sessionTimeout: "30", maxLoginAttempts: "5",
    passwordMinLength: "8", requireSpecialChars: true, forcePasswordReset: "90",
    ipWhitelist: "", enableRateLimiting: true, rateLimit: "60",
    // PIN Policy (enforced on backend)
    pin_min_length: "4",
    pin_max_attempts: "5",
    pin_lockout_minutes: "30",
    pin_expiry_days: "0",
  });
  const [affiliate, setAffiliate] = useState({
    enabled: false, commissionType: "Percentage", commissionRate: "10",
    minPayout: "500", payoutFrequency: "Monthly", cookieDuration: "30",
    autoApprove: false, maxReferralLevels: "3",
  });
  const [agent, setAgent] = useState({
    enabled: true, commissionRate: "5", maxSeekers: "50",
    autoAssign: false, approvalRequired: true, areas: "",
  });
  const [social, setSocial] = useState({
    phone: "", whatsapp: "", email: "", address: "",
    facebook: "", twitter: "", instagram: "", linkedin: "", youtube: "", tiktok: "",
  });

  const token = localStorage.getItem("skillzlink_token");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch(`${API}/admin/settings`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.general) setGeneral(prev => ({ ...prev, ...data.general }));
          if (data.email) setEmail(prev => ({ ...prev, ...data.email }));
          if (data.payment) setPayment(prev => ({ ...prev, ...data.payment }));
          if (data.paynow) setPaynow(prev => ({ ...prev, ...data.paynow }));
          if (data.security) setSecurity(prev => ({ ...prev, ...data.security }));
          if (data.affiliate) setAffiliate(prev => ({ ...prev, ...data.affiliate }));
          if (data.agent) setAgent(prev => ({ ...prev, ...data.agent }));
          if (data.social) setSocial(prev => ({ ...prev, ...data.social }));
          if (data.packages) setPackages(data.packages);
        }
      } catch { /* use defaults */ }
    };
    loadSettings();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSave = async (section: string, data: Record<string, any>) => {
    try {
      await fetch(`${API}/admin/settings`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ section, ...data }),
      });
    } catch { /* silent */ }
    // Apply theme colors live
    if (section === "general") {
      const colorMap: Record<string, string> = {
        accentColor: "--accent-color", accentHover: "--accent-hover", accentLight: "--accent-light",
        textPrimary: "--text-primary", textSecondary: "--text-secondary",
        bgPrimary: "--bg-primary", bgSecondary: "--bg-secondary", bgAuthPanel: "--bg-auth-panel", borderColor: "--border-color",
      };
      Object.entries(colorMap).forEach(([key, varName]) => {
        if (data[key]) document.documentElement.style.setProperty(varName, data[key] as string);
      });
    }
    showToast("Settings saved successfully");
  };

  const openAddPackage = () => {
    setEditingPackage(null);
    setPkgForm({ name: "", price: "", duration: "30", features: "", active: true });
    setShowPackageModal(true);
  };

  const openEditPackage = (pkg: Package) => {
    setEditingPackage(pkg);
    setPkgForm({ name: pkg.name, price: String(pkg.price), duration: String(pkg.duration), features: pkg.features.join("\n"), active: pkg.active });
    setShowPackageModal(true);
  };

  const savePackage = () => {
    const pkg: Package = {
      id: editingPackage?.id || String(Date.now()),
      name: pkgForm.name,
      price: Number(pkgForm.price),
      duration: Number(pkgForm.duration),
      features: pkgForm.features.split("\n").filter(Boolean),
      active: pkgForm.active,
    };
    if (editingPackage) {
      setPackages(prev => prev.map(p => p.id === editingPackage.id ? pkg : p));
    } else {
      setPackages(prev => [...prev, pkg]);
    }
    setShowPackageModal(false);
    showToast("Package saved");
  };

  const deletePackage = (id: string) => {
    setPackages(prev => prev.filter(p => p.id !== id));
    showToast("Package deleted");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] pb-4 border-b border-[var(--border-color)]">General Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Site Name"><Input value={general.siteName} onChange={v => setGeneral(s => ({ ...s, siteName: v }))} /></Field>
              <Field label="Currency">
                <Select value={general.currency} onChange={v => setGeneral(s => ({ ...s, currency: v }))} options={[
                  { value: "ZAR", label: "ZAR" }, { value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }, { value: "GBP", label: "GBP" }, { value: "NGN", label: "NGN" },
                ]} />
              </Field>
              <div className="md:col-span-2"><Field label="Site Description"><Textarea value={general.siteDescription} onChange={v => setGeneral(s => ({ ...s, siteDescription: v }))} /></Field></div>
              <Field label="Favicon URL" hint="URL to a .ico or .png file">
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <Input value={general.faviconUrl} onChange={v => setGeneral(s => ({ ...s, faviconUrl: v }))} placeholder="https://..." />
                  </div>
                  {general.faviconUrl && <div className="w-12 h-12 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-center shrink-0"><img src={general.faviconUrl} className="max-w-[24px] max-h-[24px]" alt="favicon" /></div>}
                </div>
              </Field>
              <Field label="Default Language">
                <Select value={general.defaultLanguage} onChange={v => setGeneral(s => ({ ...s, defaultLanguage: v }))} options={[
                  { value: "English", label: "English" }, { value: "Afrikaans", label: "Afrikaans" }, { value: "Zulu", label: "Zulu" }, { value: "Xhosa", label: "Xhosa" },
                ]} />
              </Field>
            </div>
            <div className="space-y-6 pt-6">
              <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider text-xs">Theme Colors</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={general.accentColor} onChange={e => setGeneral(s => ({ ...s, accentColor: e.target.value }))} className="w-10 h-10 rounded border border-[var(--border-color)] cursor-pointer" />
                    <input type="text" value={general.accentColor} onChange={e => setGeneral(s => ({ ...s, accentColor: e.target.value }))} className="flex-1 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 text-xs font-mono outline-none focus:border-[var(--accent-color)]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Accent Hover</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={general.accentHover} onChange={e => setGeneral(s => ({ ...s, accentHover: e.target.value }))} className="w-10 h-10 rounded border border-[var(--border-color)] cursor-pointer" />
                    <input type="text" value={general.accentHover} onChange={e => setGeneral(s => ({ ...s, accentHover: e.target.value }))} className="flex-1 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 text-xs font-mono outline-none focus:border-[var(--accent-color)]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Background</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={general.bgPrimary} onChange={e => setGeneral(s => ({ ...s, bgPrimary: e.target.value }))} className="w-10 h-10 rounded border border-[var(--border-color)] cursor-pointer" />
                    <input type="text" value={general.bgPrimary} onChange={e => setGeneral(s => ({ ...s, bgPrimary: e.target.value }))} className="flex-1 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 text-xs font-mono outline-none focus:border-[var(--accent-color)]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={general.textPrimary} onChange={e => setGeneral(s => ({ ...s, textPrimary: e.target.value }))} className="w-10 h-10 rounded border border-[var(--border-color)] cursor-pointer" />
                    <input type="text" value={general.textPrimary} onChange={e => setGeneral(s => ({ ...s, textPrimary: e.target.value }))} className="flex-1 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 text-xs font-mono outline-none focus:border-[var(--accent-color)]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-5 pt-6 border-t border-[var(--border-color)]">
              <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider text-xs mb-2">Features</h4>
              <Toggle checked={general.enableChat} onChange={v => setGeneral(s => ({ ...s, enableChat: v }))} label="Enable Chat Feature" />
              <Toggle checked={general.maintenanceMode} onChange={v => setGeneral(s => ({ ...s, maintenanceMode: v }))} label="Enable Maintenance Mode" />
              {general.maintenanceMode && <p className="text-xs text-rose-500 ml-16 font-medium">⚠️ Site will be inaccessible to non-admin users</p>}
              <Toggle checked={general.comingSoon} onChange={v => setGeneral(s => ({ ...s, comingSoon: v }))} label="Enable Coming Soon Page" />
            </div>
            <div className="pt-8 border-t border-[var(--border-color)] mt-8">
              <button onClick={() => handleSave("general", general)} className="px-8 py-3.5 rounded-xl bg-[var(--accent-color)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors">Save Changes</button>
            </div>
          </div>
        );

      case "email":
        return (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] pb-4 border-b border-[var(--border-color)]">Email Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="SMTP Host"><Input value={email.smtpHost} onChange={v => setEmail(s => ({ ...s, smtpHost: v }))} placeholder="smtp.example.com" /></Field>
              <Field label="SMTP Port"><Input value={email.smtpPort} onChange={v => setEmail(s => ({ ...s, smtpPort: v }))} type="number" /></Field>
              <Field label="SMTP Username"><Input value={email.smtpUsername} onChange={v => setEmail(s => ({ ...s, smtpUsername: v }))} /></Field>
              <Field label="SMTP Password"><Input value={email.smtpPassword} onChange={v => setEmail(s => ({ ...s, smtpPassword: v }))} type="password" /></Field>
              <Field label="Encryption">
                <Select value={email.smtpEncryption} onChange={v => setEmail(s => ({ ...s, smtpEncryption: v }))} options={[
                  { value: "TLS", label: "TLS" }, { value: "SSL", label: "SSL" }, { value: "None", label: "None" },
                ]} />
              </Field>
              <Field label="From Email"><Input value={email.fromEmail} onChange={v => setEmail(s => ({ ...s, fromEmail: v }))} type="email" /></Field>
              <Field label="From Name"><Input value={email.fromName} onChange={v => setEmail(s => ({ ...s, fromName: v }))} /></Field>
            </div>
            <div className="pt-8 border-t border-[var(--border-color)] mt-8 flex items-center gap-4">
              <button onClick={() => handleSave("email", email)} className="px-8 py-3.5 rounded-xl bg-[var(--accent-color)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors">Save Changes</button>
              <button onClick={() => showToast("Test email sent")} className="px-8 py-3.5 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm hover:bg-[var(--bg-secondary)] transition-colors">Send Test Email</button>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] pb-4 border-b border-[var(--border-color)]">Payment Gateway Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Active Gateway">
                <Select value={payment.activeGateway} onChange={v => setPayment(s => ({ ...s, activeGateway: v }))} options={[
                  { value: "Stripe", label: "Stripe" }, { value: "PayFast", label: "PayFast" }, { value: "Paystack", label: "Paystack" }, { value: "Manual", label: "Manual" },
                ]} />
              </Field>
              <Field label="Commission Rate %"><Input value={payment.commissionRate} onChange={v => setPayment(s => ({ ...s, commissionRate: v }))} type="number" /></Field>
              <Field label="Stripe Public Key"><Input value={payment.stripePublicKey} onChange={v => setPayment(s => ({ ...s, stripePublicKey: v }))} /></Field>
              <Field label="Stripe Secret Key"><Input value={payment.stripeSecretKey} onChange={v => setPayment(s => ({ ...s, stripeSecretKey: v }))} type="password" /></Field>
              <Field label="PayFast Merchant ID"><Input value={payment.payfastMerchantId} onChange={v => setPayment(s => ({ ...s, payfastMerchantId: v }))} /></Field>
              <Field label="PayFast Merchant Key"><Input value={payment.payfastMerchantKey} onChange={v => setPayment(s => ({ ...s, payfastMerchantKey: v }))} type="password" /></Field>
              <Field label="PayFast Passphrase"><Input value={payment.payfastPassphrase} onChange={v => setPayment(s => ({ ...s, payfastPassphrase: v }))} type="password" /></Field>
              <Field label="Paystack Public Key"><Input value={payment.paystackPublicKey} onChange={v => setPayment(s => ({ ...s, paystackPublicKey: v }))} /></Field>
              <Field label="Paystack Secret Key"><Input value={payment.paystackSecretKey} onChange={v => setPayment(s => ({ ...s, paystackSecretKey: v }))} type="password" /></Field>
            </div>
            <div className="pt-4">
              <Toggle checked={payment.sandboxMode} onChange={v => setPayment(s => ({ ...s, sandboxMode: v }))} label="Enable Sandbox Mode" />
            </div>
            <div className="pt-8 border-t border-[var(--border-color)] mt-8">
              <button onClick={() => handleSave("payment", payment)} className="px-8 py-3.5 rounded-xl bg-[var(--accent-color)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors">Save Changes</button>
            </div>
          </div>
        );

      case "paynow":
        return (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] pb-4 border-b border-[var(--border-color)]">PayNow Zimbabwe Configuration</h3>
            <p className="text-sm text-[var(--text-secondary)] -mt-4">Get your credentials from <a href="https://www.paynow.co.zw" target="_blank" rel="noreferrer" className="text-[var(--accent-color)] underline">paynow.co.zw</a> merchant portal.</p>
            <div className="flex items-center gap-4 mb-2">
              <Toggle checked={paynow.active} onChange={v => setPaynow(s => ({ ...s, active: v }))} label="Enable PayNow" />
            </div>
            {paynow.active && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Mode">
                    <Select value={paynow.mode} onChange={v => setPaynow(s => ({ ...s, mode: v }))} options={[
                      { value: "sandbox", label: "Sandbox (Testing)" },
                      { value: "live", label: "Live (Production)" },
                    ]} />
                  </Field>
                  <Field label="Integration ID"><Input value={paynow.integration_id} onChange={v => setPaynow(s => ({ ...s, integration_id: v }))} placeholder="12345" /></Field>
                  <Field label="Integration Key"><Input value={paynow.integration_key} onChange={v => setPaynow(s => ({ ...s, integration_key: v }))} type="password" placeholder="a1b2c3d4-..." /></Field>
                  <Field label="Auth Email"><Input value={paynow.auth_email} onChange={v => setPaynow(s => ({ ...s, auth_email: v }))} type="email" placeholder="merchant@example.com" /></Field>
                  <Field label="Result URL">
                    <Input value={paynow.result_url} onChange={v => setPaynow(s => ({ ...s, result_url: v }))} placeholder={window.location.origin + "/api/paynow/status"} />
                    <p className="text-[10px] text-[var(--text-secondary)] mt-1">PayNow sends payment confirmation to this URL.</p>
                  </Field>
                  <Field label="Return URL">
                    <Input value={paynow.return_url} onChange={v => setPaynow(s => ({ ...s, return_url: v }))} placeholder={window.location.origin + "/api/paynow/return"} />
                    <p className="text-[10px] text-[var(--text-secondary)] mt-1">User is redirected here after payment.</p>
                  </Field>
                </div>
              </>
            )}
            <div className="pt-8 border-t border-[var(--border-color)] mt-8">
              <button onClick={() => handleSave("paynow", paynow)} className="px-8 py-3.5 rounded-xl bg-[var(--accent-color)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors">Save PayNow Settings</button>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] pb-4 border-b border-[var(--border-color)]">Security Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Session Timeout (minutes)"><Input value={security.sessionTimeout} onChange={v => setSecurity(s => ({ ...s, sessionTimeout: v }))} type="number" /></Field>
              <Field label="Max Login Attempts"><Input value={security.maxLoginAttempts} onChange={v => setSecurity(s => ({ ...s, maxLoginAttempts: v }))} type="number" /></Field>
              <Field label="Password Minimum Length"><Input value={security.passwordMinLength} onChange={v => setSecurity(s => ({ ...s, passwordMinLength: v }))} type="number" /></Field>
              <Field label="Force Password Reset (days)"><Input value={security.forcePasswordReset} onChange={v => setSecurity(s => ({ ...s, forcePasswordReset: v }))} type="number" /></Field>
              <Field label="Rate Limit (requests/minute)"><Input value={security.rateLimit} onChange={v => setSecurity(s => ({ ...s, rateLimit: v }))} type="number" /></Field>
            </div>
            <div className="md:col-span-2"><Field label="IP Whitelist" hint="One IP per line"><Textarea value={security.ipWhitelist} onChange={v => setSecurity(s => ({ ...s, ipWhitelist: v }))} placeholder="192.168.1.1" /></Field></div>
            <div className="space-y-5 pt-4">
              <Toggle checked={security.twoFactor} onChange={v => setSecurity(s => ({ ...s, twoFactor: v }))} label="Require 2FA for Admins" />
              <Toggle checked={security.requireSpecialChars} onChange={v => setSecurity(s => ({ ...s, requireSpecialChars: v }))} label="Require Special Characters in Password" />
              <Toggle checked={security.enableRateLimiting} onChange={v => setSecurity(s => ({ ...s, enableRateLimiting: v }))} label="Enable Rate Limiting" />
            </div>

            {/* PIN Policy */}
            <div className="pt-8 border-t border-[var(--border-color)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center">
                  <i className="lnr lnr-lock text-[var(--accent-color)] text-base"></i>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-[var(--text-primary)]">PIN Policy</h4>
                  <p className="text-sm text-[var(--text-secondary)]">Rules enforced on every login and PIN reset. Changes apply immediately to all users.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field
                  label="Minimum PIN Length"
                  hint="Accepted range: 4–8 digits. Default is 4."
                >
                  <Input
                    value={security.pin_min_length}
                    onChange={v => setSecurity(s => ({ ...s, pin_min_length: String(Math.min(8, Math.max(4, parseInt(v) || 4))) }))}
                    type="number"
                    placeholder="4"
                  />
                </Field>
                <Field
                  label="Max Failed PIN Attempts"
                  hint="Account will be locked after this many consecutive wrong PINs."
                >
                  <Input
                    value={security.pin_max_attempts}
                    onChange={v => setSecurity(s => ({ ...s, pin_max_attempts: String(Math.min(10, Math.max(1, parseInt(v) || 5))) }))}
                    type="number"
                    placeholder="5"
                  />
                </Field>
                <Field
                  label="Lockout Duration (minutes)"
                  hint="How long a locked account remains locked. Admins can lift this manually."
                >
                  <Input
                    value={security.pin_lockout_minutes}
                    onChange={v => setSecurity(s => ({ ...s, pin_lockout_minutes: String(Math.max(1, parseInt(v) || 30) ) }))}
                    type="number"
                    placeholder="30"
                  />
                </Field>
                <Field
                  label="PIN Expiry (days)"
                  hint="Users must reset their PIN after this many days. Set to 0 to disable expiry."
                >
                  <Input
                    value={security.pin_expiry_days}
                    onChange={v => setSecurity(s => ({ ...s, pin_expiry_days: String(Math.max(0, parseInt(v) || 0)) }))}
                    type="number"
                    placeholder="0 (never)"
                  />
                </Field>
              </div>
              <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <i className="lnr lnr-warning text-amber-600 mt-0.5 flex-shrink-0"></i>
                <p className="text-sm text-amber-800">
                  <strong>Admin override:</strong> Locked users appear with a 🔒 status in the Users table. You can unlock them individually using the unlock button in their row.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-[var(--border-color)] mt-8">
              <button onClick={() => handleSave("security", security)} className="px-8 py-3.5 rounded-xl bg-[var(--accent-color)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors">Save Changes</button>
            </div>
          </div>
        );

      case "affiliate":
        return (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] pb-4 border-b border-[var(--border-color)]">Affiliate Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Commission Type">
                <Select value={affiliate.commissionType} onChange={v => setAffiliate(s => ({ ...s, commissionType: v }))} options={[
                  { value: "Percentage", label: "Percentage" }, { value: "Fixed Amount", label: "Fixed Amount" },
                ]} />
              </Field>
              <Field label="Commission Rate"><Input value={affiliate.commissionRate} onChange={v => setAffiliate(s => ({ ...s, commissionRate: v }))} type="number" /></Field>
              <Field label="Minimum Payout Threshold" hint="e.g. R 500"><Input value={affiliate.minPayout} onChange={v => setAffiliate(s => ({ ...s, minPayout: v }))} type="number" /></Field>
              <Field label="Payout Frequency">
                <Select value={affiliate.payoutFrequency} onChange={v => setAffiliate(s => ({ ...s, payoutFrequency: v }))} options={[
                  { value: "Weekly", label: "Weekly" }, { value: "Bi-weekly", label: "Bi-weekly" }, { value: "Monthly", label: "Monthly" },
                ]} />
              </Field>
              <Field label="Cookie Duration (days)"><Input value={affiliate.cookieDuration} onChange={v => setAffiliate(s => ({ ...s, cookieDuration: v }))} type="number" /></Field>
              <Field label="Max Referral Levels (1-5)"><Input value={affiliate.maxReferralLevels} onChange={v => setAffiliate(s => ({ ...s, maxReferralLevels: v }))} type="number" /></Field>
            </div>
            <div className="space-y-5 pt-4">
              <Toggle checked={affiliate.enabled} onChange={v => setAffiliate(s => ({ ...s, enabled: v }))} label="Enable Affiliate Program" />
              <Toggle checked={affiliate.autoApprove} onChange={v => setAffiliate(s => ({ ...s, autoApprove: v }))} label="Auto-Approve Affiliates" />
            </div>
            <div className="pt-8 border-t border-[var(--border-color)] mt-8">
              <button onClick={() => handleSave("affiliate", affiliate)} className="px-8 py-3.5 rounded-xl bg-[var(--accent-color)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors">Save Changes</button>
            </div>
          </div>
        );

      case "agent":
        return (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] pb-4 border-b border-[var(--border-color)]">Agent Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Agent Commission Rate %"><Input value={agent.commissionRate} onChange={v => setAgent(s => ({ ...s, commissionRate: v }))} type="number" /></Field>
              <Field label="Max Seekers Per Agent"><Input value={agent.maxSeekers} onChange={v => setAgent(s => ({ ...s, maxSeekers: v }))} type="number" /></Field>
            </div>
            <Field label="Agent Areas" hint="Comma-separated regions"><Textarea value={agent.areas} onChange={v => setAgent(s => ({ ...s, areas: v }))} placeholder="Johannesburg, Cape Town, Durban" /></Field>
            <div className="space-y-5 pt-4">
              <Toggle checked={agent.enabled} onChange={v => setAgent(s => ({ ...s, enabled: v }))} label="Enable Agent System" />
              <Toggle checked={agent.autoAssign} onChange={v => setAgent(s => ({ ...s, autoAssign: v }))} label="Auto-Assign Seekers" />
              <Toggle checked={agent.approvalRequired} onChange={v => setAgent(s => ({ ...s, approvalRequired: v }))} label="Agent Approval Required" />
            </div>
            <div className="pt-8 border-t border-[var(--border-color)] mt-8">
              <button onClick={() => handleSave("agent", agent)} className="px-8 py-3.5 rounded-xl bg-[var(--accent-color)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors">Save Changes</button>
            </div>
          </div>
        );

      case "social":
        return (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] pb-4 border-b border-[var(--border-color)]">Social Media & Contact Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Phone Number"><Input value={social.phone} onChange={v => setSocial(s => ({ ...s, phone: v }))} /></Field>
              <Field label="WhatsApp Number"><Input value={social.whatsapp} onChange={v => setSocial(s => ({ ...s, whatsapp: v }))} /></Field>
              <Field label="Email"><Input value={social.email} onChange={v => setSocial(s => ({ ...s, email: v }))} type="email" /></Field>
              <div className="md:col-span-2"><Field label="Physical Address"><Textarea value={social.address} onChange={v => setSocial(s => ({ ...s, address: v }))} rows={2} /></Field></div>
              <Field label="Facebook URL"><Input value={social.facebook} onChange={v => setSocial(s => ({ ...s, facebook: v }))} placeholder="https://facebook.com/..." /></Field>
              <Field label="Twitter/X URL"><Input value={social.twitter} onChange={v => setSocial(s => ({ ...s, twitter: v }))} placeholder="https://x.com/..." /></Field>
              <Field label="Instagram URL"><Input value={social.instagram} onChange={v => setSocial(s => ({ ...s, instagram: v }))} placeholder="https://instagram.com/..." /></Field>
              <Field label="LinkedIn URL"><Input value={social.linkedin} onChange={v => setSocial(s => ({ ...s, linkedin: v }))} placeholder="https://linkedin.com/..." /></Field>
              <Field label="YouTube URL"><Input value={social.youtube} onChange={v => setSocial(s => ({ ...s, youtube: v }))} placeholder="https://youtube.com/..." /></Field>
              <Field label="TikTok URL"><Input value={social.tiktok} onChange={v => setSocial(s => ({ ...s, tiktok: v }))} placeholder="https://tiktok.com/..." /></Field>
            </div>
            <div className="pt-8 border-t border-[var(--border-color)] mt-8">
              <button onClick={() => handleSave("social", social)} className="px-8 py-3.5 rounded-xl bg-[var(--accent-color)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors">Save Changes</button>
            </div>
          </div>
        );

      case "packages":
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">Subscription Packages</h3>
              <button onClick={openAddPackage} className="px-6 py-2.5 rounded-xl bg-[var(--accent-color)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors">Add Package</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="text-left py-4 font-semibold text-[var(--text-secondary)]">Name</th>
                    <th className="text-left py-4 font-semibold text-[var(--text-secondary)]">Price</th>
                    <th className="text-left py-4 font-semibold text-[var(--text-secondary)]">Duration</th>
                    <th className="text-left py-4 font-semibold text-[var(--text-secondary)]">Features</th>
                    <th className="text-left py-4 font-semibold text-[var(--text-secondary)]">Status</th>
                    <th className="text-right py-4 font-semibold text-[var(--text-secondary)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map(pkg => (
                    <tr key={pkg.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors">
                      <td className="py-4 font-semibold text-[var(--text-primary)] pl-2">{pkg.name}</td>
                      <td className="py-4 text-[var(--text-primary)]">R {pkg.price}</td>
                      <td className="py-4 text-[var(--text-primary)]">{pkg.duration} days</td>
                      <td className="py-4 text-[var(--text-primary)]">{pkg.features.length}</td>
                      <td className="py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${pkg.active ? 'bg-emerald-100 text-emerald-800' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`}>
                          {pkg.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 text-right space-x-3 pr-2">
                        <button onClick={() => openEditPackage(pkg)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm font-semibold underline">Edit</button>
                        <button onClick={() => deletePackage(pkg.id)} className="text-rose-500 hover:text-rose-700 text-sm font-semibold underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Toast */}
        <div className={`fixed top-6 right-6 z-50 bg-[var(--accent-color)] text-white px-4 py-3 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 ${toast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
          <i className="lnr lnr-checkmark-circle mr-2"></i>{toast}
        </div>

        {/* Package Modal */}
        {showPackageModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[var(--bg-primary)] rounded-2xl w-full max-w-md p-8 space-y-6 shadow-xl">
              <h3 className="text-2xl font-semibold text-[var(--text-primary)]">{editingPackage ? "Edit Package" : "Add Package"}</h3>
              <div className="space-y-4">
                <Field label="Name"><Input value={pkgForm.name} onChange={v => setPkgForm(s => ({ ...s, name: v }))} /></Field>
                <Field label="Price (R)"><Input value={pkgForm.price} onChange={v => setPkgForm(s => ({ ...s, price: v }))} type="number" /></Field>
                <Field label="Duration (days)"><Input value={pkgForm.duration} onChange={v => setPkgForm(s => ({ ...s, duration: v }))} type="number" /></Field>
                <Field label="Features" hint="One per line"><Textarea value={pkgForm.features} onChange={v => setPkgForm(s => ({ ...s, features: v }))} rows={4} /></Field>
              </div>
              <div className="pt-2">
                <Toggle checked={pkgForm.active} onChange={v => setPkgForm(s => ({ ...s, active: v }))} label="Is Active" />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowPackageModal(false)} className="flex-1 py-3 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm hover:bg-[var(--bg-secondary)] transition-colors">Cancel</button>
                <button onClick={savePackage} className="flex-1 py-3 rounded-xl bg-[var(--accent-color)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors">Save</button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-10 pl-2">
          <h2 className="text-3xl font-semibold text-[var(--text-primary)] tracking-tight">Theme & Settings</h2>
          <p className="text-sm font-medium text-[var(--text-secondary)] mt-2">Manage your platform configuration and appearance</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Left tabs */}
          <div className="w-full md:w-64 shrink-0">
            <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-5 py-3.5 rounded-xl text-[14px] font-semibold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm border border-[var(--border-color)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] border border-transparent'}`}>
                  <i className={`lnr ${tab.icon} mr-3 text-[15px] opacity-80`}></i>{tab.label}
                </button>
              ))}
            </nav>
          </div>
          {/* Right content */}
          <div className="flex-1 min-w-0 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-color)] p-8 md:p-12 shadow-sm">
            {renderContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
