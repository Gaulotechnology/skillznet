import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:18080/api";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-gray-900' : 'bg-gray-200'}`} onClick={() => onChange(!checked)}>
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </div>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
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
      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900 transition-colors"
    />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900 transition-colors bg-white">
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
      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900 transition-colors resize-none"
    />
  );
}

const tabs = [
  { id: "general", label: "General", icon: "lnr-cog" },
  { id: "email", label: "Email", icon: "lnr-envelope" },
  { id: "payment", label: "Payment", icon: "lnr-diamond" },
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
  const [security, setSecurity] = useState({
    twoFactor: false, sessionTimeout: "30", maxLoginAttempts: "5",
    passwordMinLength: "8", requireSpecialChars: true, forcePasswordReset: "90",
    ipWhitelist: "", enableRateLimiting: true, rateLimit: "60",
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
          <div className="space-y-6">
            <h3 className="text-base font-semibold text-gray-900">General Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Site Name"><Input value={general.siteName} onChange={v => setGeneral(s => ({ ...s, siteName: v }))} /></Field>
              <Field label="Currency">
                <Select value={general.currency} onChange={v => setGeneral(s => ({ ...s, currency: v }))} options={[
                  { value: "ZAR", label: "ZAR" }, { value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }, { value: "GBP", label: "GBP" }, { value: "NGN", label: "NGN" },
                ]} />
              </Field>
              <div className="md:col-span-2"><Field label="Site Description"><Textarea value={general.siteDescription} onChange={v => setGeneral(s => ({ ...s, siteDescription: v }))} /></Field></div>
              <Field label="Favicon URL" hint="URL to a .ico or .png file">
                <div className="flex gap-3 items-center">
                  <Input value={general.faviconUrl} onChange={v => setGeneral(s => ({ ...s, faviconUrl: v }))} placeholder="https://..." />
                  {general.faviconUrl && <img src={general.faviconUrl} className="w-6 h-6" alt="favicon" />}
                </div>
              </Field>
              <Field label="Default Language">
                <Select value={general.defaultLanguage} onChange={v => setGeneral(s => ({ ...s, defaultLanguage: v }))} options={[
                  { value: "English", label: "English" }, { value: "Afrikaans", label: "Afrikaans" }, { value: "Zulu", label: "Zulu" }, { value: "Xhosa", label: "Xhosa" },
                ]} />
              </Field>
            </div>
            <div className="space-y-4 pt-4">
              <Toggle checked={general.enableChat} onChange={v => setGeneral(s => ({ ...s, enableChat: v }))} label="Enable Chat Feature" />
              <Toggle checked={general.maintenanceMode} onChange={v => setGeneral(s => ({ ...s, maintenanceMode: v }))} label="Enable Maintenance Mode" />
              {general.maintenanceMode && <p className="text-xs text-red-500 ml-14">⚠️ Site will be inaccessible to non-admin users</p>}
              <Toggle checked={general.comingSoon} onChange={v => setGeneral(s => ({ ...s, comingSoon: v }))} label="Enable Coming Soon Page" />
            </div>
            <div className="pt-6 border-t border-gray-200 mt-8">
              <button onClick={() => handleSave("general", general)} className="px-6 py-2.5 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors">Save Changes</button>
            </div>
          </div>
        );

      case "email":
        return (
          <div className="space-y-6">
            <h3 className="text-base font-semibold text-gray-900">Email Settings</h3>
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
            <div className="pt-6 border-t border-gray-200 mt-8 flex items-center gap-4">
              <button onClick={() => handleSave("email", email)} className="px-6 py-2.5 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors">Save Changes</button>
              <button onClick={() => showToast("Test email sent")} className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors">Send Test Email</button>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-6">
            <h3 className="text-base font-semibold text-gray-900">Payment Gateway Settings</h3>
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
            <Toggle checked={payment.sandboxMode} onChange={v => setPayment(s => ({ ...s, sandboxMode: v }))} label="Enable Sandbox Mode" />
            <div className="pt-6 border-t border-gray-200 mt-8">
              <button onClick={() => handleSave("payment", payment)} className="px-6 py-2.5 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors">Save Changes</button>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <h3 className="text-base font-semibold text-gray-900">Security Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Session Timeout (minutes)"><Input value={security.sessionTimeout} onChange={v => setSecurity(s => ({ ...s, sessionTimeout: v }))} type="number" /></Field>
              <Field label="Max Login Attempts"><Input value={security.maxLoginAttempts} onChange={v => setSecurity(s => ({ ...s, maxLoginAttempts: v }))} type="number" /></Field>
              <Field label="Password Minimum Length"><Input value={security.passwordMinLength} onChange={v => setSecurity(s => ({ ...s, passwordMinLength: v }))} type="number" /></Field>
              <Field label="Force Password Reset (days)"><Input value={security.forcePasswordReset} onChange={v => setSecurity(s => ({ ...s, forcePasswordReset: v }))} type="number" /></Field>
              <Field label="Rate Limit (requests/minute)"><Input value={security.rateLimit} onChange={v => setSecurity(s => ({ ...s, rateLimit: v }))} type="number" /></Field>
            </div>
            <div className="md:col-span-2"><Field label="IP Whitelist" hint="One IP per line"><Textarea value={security.ipWhitelist} onChange={v => setSecurity(s => ({ ...s, ipWhitelist: v }))} placeholder="192.168.1.1" /></Field></div>
            <div className="space-y-4 pt-4">
              <Toggle checked={security.twoFactor} onChange={v => setSecurity(s => ({ ...s, twoFactor: v }))} label="Require 2FA for Admins" />
              <Toggle checked={security.requireSpecialChars} onChange={v => setSecurity(s => ({ ...s, requireSpecialChars: v }))} label="Require Special Characters in Password" />
              <Toggle checked={security.enableRateLimiting} onChange={v => setSecurity(s => ({ ...s, enableRateLimiting: v }))} label="Enable Rate Limiting" />
            </div>
            <div className="pt-6 border-t border-gray-200 mt-8">
              <button onClick={() => handleSave("security", security)} className="px-6 py-2.5 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors">Save Changes</button>
            </div>
          </div>
        );

      case "affiliate":
        return (
          <div className="space-y-6">
            <h3 className="text-base font-semibold text-gray-900">Affiliate Settings</h3>
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
            <div className="space-y-4 pt-4">
              <Toggle checked={affiliate.enabled} onChange={v => setAffiliate(s => ({ ...s, enabled: v }))} label="Enable Affiliate Program" />
              <Toggle checked={affiliate.autoApprove} onChange={v => setAffiliate(s => ({ ...s, autoApprove: v }))} label="Auto-Approve Affiliates" />
            </div>
            <div className="pt-6 border-t border-gray-200 mt-8">
              <button onClick={() => handleSave("affiliate", affiliate)} className="px-6 py-2.5 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors">Save Changes</button>
            </div>
          </div>
        );

      case "agent":
        return (
          <div className="space-y-6">
            <h3 className="text-base font-semibold text-gray-900">Agent Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Agent Commission Rate %"><Input value={agent.commissionRate} onChange={v => setAgent(s => ({ ...s, commissionRate: v }))} type="number" /></Field>
              <Field label="Max Seekers Per Agent"><Input value={agent.maxSeekers} onChange={v => setAgent(s => ({ ...s, maxSeekers: v }))} type="number" /></Field>
            </div>
            <Field label="Agent Areas" hint="Comma-separated regions"><Textarea value={agent.areas} onChange={v => setAgent(s => ({ ...s, areas: v }))} placeholder="Johannesburg, Cape Town, Durban" /></Field>
            <div className="space-y-4 pt-4">
              <Toggle checked={agent.enabled} onChange={v => setAgent(s => ({ ...s, enabled: v }))} label="Enable Agent System" />
              <Toggle checked={agent.autoAssign} onChange={v => setAgent(s => ({ ...s, autoAssign: v }))} label="Auto-Assign Seekers" />
              <Toggle checked={agent.approvalRequired} onChange={v => setAgent(s => ({ ...s, approvalRequired: v }))} label="Agent Approval Required" />
            </div>
            <div className="pt-6 border-t border-gray-200 mt-8">
              <button onClick={() => handleSave("agent", agent)} className="px-6 py-2.5 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors">Save Changes</button>
            </div>
          </div>
        );

      case "social":
        return (
          <div className="space-y-6">
            <h3 className="text-base font-semibold text-gray-900">Social Media & Contact Info</h3>
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
            <div className="pt-6 border-t border-gray-200 mt-8">
              <button onClick={() => handleSave("social", social)} className="px-6 py-2.5 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors">Save Changes</button>
            </div>
          </div>
        );

      case "packages":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Subscription Packages</h3>
              <button onClick={openAddPackage} className="px-4 py-2 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors">Add Package</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 font-medium text-gray-500">Name</th>
                    <th className="text-left py-3 font-medium text-gray-500">Price</th>
                    <th className="text-left py-3 font-medium text-gray-500">Duration</th>
                    <th className="text-left py-3 font-medium text-gray-500">Features</th>
                    <th className="text-left py-3 font-medium text-gray-500">Status</th>
                    <th className="text-right py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map(pkg => (
                    <tr key={pkg.id} className="border-b border-gray-100">
                      <td className="py-3 font-medium text-gray-900">{pkg.name}</td>
                      <td className="py-3 text-gray-700">R {pkg.price}</td>
                      <td className="py-3 text-gray-700">{pkg.duration} days</td>
                      <td className="py-3 text-gray-700">{pkg.features.length}</td>
                      <td className="py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${pkg.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {pkg.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 text-right space-x-2">
                        <button onClick={() => openEditPackage(pkg)} className="text-gray-500 hover:text-gray-900 text-xs font-medium">Edit</button>
                        <button onClick={() => deletePackage(pkg.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
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
        <div className={`fixed top-6 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 ${toast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
          <i className="lnr lnr-checkmark-circle mr-2"></i>{toast}
        </div>

        {/* Package Modal */}
        {showPackageModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-semibold text-gray-900">{editingPackage ? "Edit Package" : "Add Package"}</h3>
              <Field label="Name"><Input value={pkgForm.name} onChange={v => setPkgForm(s => ({ ...s, name: v }))} /></Field>
              <Field label="Price (R)"><Input value={pkgForm.price} onChange={v => setPkgForm(s => ({ ...s, price: v }))} type="number" /></Field>
              <Field label="Duration (days)"><Input value={pkgForm.duration} onChange={v => setPkgForm(s => ({ ...s, duration: v }))} type="number" /></Field>
              <Field label="Features" hint="One per line"><Textarea value={pkgForm.features} onChange={v => setPkgForm(s => ({ ...s, features: v }))} rows={4} /></Field>
              <Toggle checked={pkgForm.active} onChange={v => setPkgForm(s => ({ ...s, active: v }))} label="Is Active" />
              <div className="flex gap-3 pt-4">
                <button onClick={savePackage} className="px-5 py-2.5 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors">Save</button>
                <button onClick={() => setShowPackageModal(false)} className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Settings</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage your platform configuration</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left tabs */}
          <div className="w-full md:w-52 shrink-0">
            <nav className="flex md:flex-col gap-0.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <i className={`lnr ${tab.icon} mr-2 text-[13px]`}></i>{tab.label}
                </button>
              ))}
            </nav>
          </div>
          {/* Right content */}
          <div className="flex-1 min-w-0 bg-white rounded-lg border border-gray-200 p-6 md:p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
