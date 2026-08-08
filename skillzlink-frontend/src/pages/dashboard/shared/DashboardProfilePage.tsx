import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { providerApi, publicApi, accountApi, getCurrentUser, type PublicProvider, type RegistrationField } from "../../../services/api";

export function DashboardProfilePage() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'skills' | 'education'>('skills');
  const [profile, setProfile] = useState<PublicProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [dynamicFields, setDynamicFields] = useState<RegistrationField[]>([]);
  const [dynamicData, setDynamicData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (user && user.role !== 'provider') {
      const paths: Record<string, string> = {
        admin: '/dashboard/admin',
        super_admin: '/dashboard/admin',
        employee: '/dashboard/admin',
        seeker: '/dashboard/seeker',
        affiliate: '/dashboard/affiliate',
        agent: '/dashboard/agent',
      };
      navigate(paths[user.role] || '/');
      return;
    }

    providerApi.getProfile()
      .then((res) => {
        setProfile(res.provider);
        setDynamicData(res.provider.dynamic_data || {});
        // Fetch dynamic fields based on their category
        return publicApi.getProviderRegistrationFields(res.provider.service_category);
      })
      .then(res => {
        if (res && res.fields) {
          setDynamicFields(res.fields.sort((a, b) => a.sort_order - b.sort_order));
        }
      })
      .catch((_err) => {
        setMessage({ type: 'error', text: 'Failed to load profile. Are you logged in as a provider?' });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setSaving(true);
    setMessage(null);
    try {
      const res = await providerApi.updateProfile({
        description: profile.description,
        address: profile.location, // Note: Location maps to 'address' in backend
        service_category: profile.service_category,
        dynamic_data: dynamicData,
      });
      setProfile(res.provider);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Auto-hide success message
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="p-6 md:p-8 max-w-4xl mx-auto">
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center">
            <i className="lnr lnr-warning text-4xl text-rose-500 mb-4 block"></i>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Profile Not Found</h3>
            <p className="text-rose-600 font-medium">{message?.text || 'Could not load profile.'}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">My Profile</h2>
          <p className="text-slate-500 mt-1 font-medium">Manage your personal details and professional portfolio.</p>
        </div>

        {/* Notifications */}
        {message && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-fade-in ${
            message.type === 'success' 
              ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' 
              : 'bg-rose-50 border border-rose-100 text-rose-700'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm text-white ${
              message.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
            }`}>
              <i className={`lnr ${message.type === 'success' ? 'lnr-checkmark-circle' : 'lnr-warning'} text-xl`}></i>
            </div>
            <p className="font-bold">{message.text}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 overflow-x-auto">
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-8 py-5 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors relative ${
                activeTab === 'skills' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              Personal Details & Skills
              {activeTab === 'skills' && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`px-8 py-5 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors relative ${
                activeTab === 'education' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              Experience & Education
              {activeTab === 'education' && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></span>
              )}
            </button>
          </div>
          
          <div className="p-6 md:p-8">
            {activeTab === 'skills' && (
              <form onSubmit={handleUpdate} className="space-y-8 animate-fade-in">
                
                {/* Personal Details */}
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <i className="lnr lnr-user text-indigo-500"></i> Your Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed outline-none" 
                        value={profile.name} 
                        disabled 
                      />
                      <p className="text-xs text-slate-400 mt-2 font-medium">Name changes require admin approval.</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Service Category</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-800" 
                        placeholder="e.g. Web Development" 
                        value={profile.service_category}
                        onChange={(e) => setProfile({ ...profile, service_category: e.target.value })} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Professional Summary</label>
                    <textarea 
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-800 resize-y min-h-[150px]" 
                      placeholder="Describe your skills, experience, and what makes you great..." 
                      value={profile.description}
                      onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                    />
                  </div>
                </div>

                {dynamicFields.length > 0 && (
                  <>
                    <hr className="border-slate-100" />
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <i className="lnr lnr-magic-wand text-rose-500"></i> Professional Details
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {dynamicFields.map(field => (
                          <div key={field.name}>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                              {field.label} {field.required && <span className="text-rose-500">*</span>}
                            </label>
                            
                            {field.type === 'boolean' ? (
                              <label className="flex items-center gap-3 cursor-pointer mt-3">
                                <input 
                                  type="checkbox" 
                                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                  checked={!!dynamicData[field.name]}
                                  onChange={(e) => setDynamicData(prev => ({ ...prev, [field.name]: e.target.checked }))}
                                />
                                <span className="text-slate-700 font-medium">{field.label}</span>
                              </label>
                            ) : field.type === 'number' ? (
                              <input 
                                type="number" 
                                required={field.required}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-800"
                                value={dynamicData[field.name] || ''}
                                onChange={(e) => setDynamicData(prev => ({ ...prev, [field.name]: e.target.value ? Number(e.target.value) : '' }))}
                              />
                            ) : field.type === 'select' && field.options ? (
                              <select 
                                required={field.required}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-800 appearance-none"
                                value={dynamicData[field.name] || ''}
                                onChange={(e) => setDynamicData(prev => ({ ...prev, [field.name]: e.target.value }))}
                              >
                                <option value="">Select an option</option>
                                {(Array.isArray(field.options) ? field.options : []).map((opt: string) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : (
                              <input 
                                type="text" 
                                required={field.required}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-800"
                                value={dynamicData[field.name] || ''}
                                onChange={(e) => setDynamicData(prev => ({ ...prev, [field.name]: e.target.value }))}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <hr className="border-slate-100" />

                {/* Location */}
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <i className="lnr lnr-map-marker text-rose-500"></i> Your Location
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">City / Region</label>
                      <select 
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-800 appearance-none"
                        value={profile.location.split(',')[0]} 
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      >
                        <option value="Harare">Harare</option>
                        <option value="Bulawayo">Bulawayo</option>
                        <option value="Mutare">Mutare</option>
                        <option value="Gweru">Gweru</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Full Address / Neighborhood</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-800" 
                        placeholder="e.g. 123 Main St, Borrowdale" 
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <><i className="lnr lnr-sync animate-spin"></i> Saving Updates...</>
                    ) : (
                      <><i className="lnr lnr-checkmark-circle"></i> Save All Updates</>
                    )}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'education' && (
              <div className="animate-fade-in space-y-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <i className="lnr lnr-briefcase text-emerald-500"></i> Work Experience
                  </h3>
                  <button className="px-4 py-2 bg-emerald-50 text-emerald-600 font-bold text-sm rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-2">
                    <i className="lnr lnr-plus-circle"></i> Add New
                  </button>
                </div>
                
                <ExperienceForm onSave={(msg) => setMessage({ type: 'success', text: msg })} onError={(msg) => setMessage({ type: 'error', text: msg })} />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ExperienceForm({ onSave, onError }: { onSave: (msg: string) => void; onError: (msg: string) => void }) {
  const [company, setCompany] = useState('');
  const [period, setPeriod] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      onError('Please fill in at least the job title and description.');
      return;
    }
    setSaving(true);
    try {
      await accountApi.saveExperience({ title: `${title} at ${company} (${period})`, description });
      onSave('Experience saved successfully!');
      setCompany(''); setPeriod(''); setTitle(''); setDescription('');
    } catch (err: any) {
      onError(err.message || 'Failed to save experience');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Company / Project Name</label>
          <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-800" placeholder="e.g. Tech Solutions Inc." />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Time Period</label>
          <input type="text" value={period} onChange={e => setPeriod(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-800" placeholder="e.g. Jan 2020 - Present" />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-bold text-slate-700 mb-2">Job Title / Role</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-800" placeholder="e.g. Senior Frontend Developer" />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-bold text-slate-700 mb-2">Role Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-800 resize-y min-h-[120px]" placeholder="Describe your responsibilities and achievements..."></textarea>
      </div>
      
      <button onClick={handleSubmit} disabled={saving} className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50">
        {saving ? <><i className="lnr lnr-sync animate-spin"></i> Saving...</> : <><i className="lnr lnr-checkmark-circle"></i> Save Experience</>}
      </button>
    </div>
  );
}
