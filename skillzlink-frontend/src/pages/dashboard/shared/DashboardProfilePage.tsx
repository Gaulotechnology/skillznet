import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { providerApi, publicApi, accountApi, getCurrentUser, type PublicProvider, type RegistrationField } from "../../../services/api";

export function DashboardProfilePage() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'skills' | 'education' | 'services'>('skills');
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
        if (!res.provider.service_category) {
          return { fields: [] };
        }
        return publicApi.getProviderRegistrationFields(res.provider.service_category).catch(() => ({ fields: [] }));
      })
      .then(res => {
        if (res && res.fields) {
          setDynamicFields(res.fields.sort((a: any, b: any) => a.sort_order - b.sort_order));
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
        address: profile.location,
        service_category: profile.service_category,
        dynamic_data: dynamicData,
        skills: profile.skills || [],
        portfolios: profile.portfolios || [],
        services: profile.services || [],
      });
      setProfile(res.provider);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
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
          <div className="w-12 h-12 border-4 border-[var(--border-color)] border-t-[var(--accent-color)] rounded-full animate-spin mb-4" />
          <p className="text-[var(--text-secondary)] font-medium">Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="p-6 md:p-8 max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-100 rounded-3xl p-6 text-center">
            <i className="lnr lnr-warning text-4xl text-red-500 mb-4 block"></i>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Profile Not Found</h3>
            <p className="text-red-600 font-medium">{message?.text || 'Could not load profile.'}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto font-['Inter',sans-serif]">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">My Profile</h2>
          <p className="text-[var(--text-secondary)] mt-1 font-medium">Manage your personal details and professional portfolio.</p>
        </div>

        {/* Notifications */}
        {message && (
          <div className={`mb-6 p-4 rounded-3xl flex items-center gap-3 animate-fade-in ${
            message.type === 'success' 
              ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' 
              : 'bg-red-50 border border-red-100 text-red-700'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm text-white ${
              message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
            }`}>
              <i className={`lnr ${message.type === 'success' ? 'lnr-checkmark-circle' : 'lnr-warning'} text-xl`}></i>
            </div>
            <p className="font-bold">{message.text}</p>
          </div>
        )}

        <div className="bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-sm">
          {/* Tabs */}
          <div className="flex border-b border-[var(--border-color)] overflow-x-auto">
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-8 py-5 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors relative ${
                activeTab === 'skills' ? 'text-[var(--accent-color)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              Personal Details & Skills
              {activeTab === 'skills' && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[var(--accent-color)] rounded-t-full"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`px-8 py-5 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors relative ${
                activeTab === 'education' ? 'text-[var(--accent-color)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              Experience & Education
              {activeTab === 'education' && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[var(--accent-color)] rounded-t-full"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-8 py-5 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors relative ${
                activeTab === 'services' ? 'text-[var(--accent-color)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              Services & Portfolio
              {activeTab === 'services' && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[var(--accent-color)] rounded-t-full"></span>
              )}
            </button>
          </div>
          
          <div className="p-6 md:p-8">
            {activeTab === 'skills' && (
              <form onSubmit={handleUpdate} className="space-y-8 animate-fade-in">
                
                {/* Personal Details */}
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                    <i className="lnr lnr-user text-[var(--accent-color)]"></i> Your Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Full Name</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] font-medium cursor-not-allowed outline-none" 
                        value={profile.name} 
                        disabled 
                      />
                      <p className="text-xs text-[var(--text-secondary)] mt-2 font-medium">Name changes require admin approval.</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Service Category</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all font-medium text-[var(--text-primary)]" 
                        placeholder="e.g. Web Development" 
                        value={profile.service_category || ''}
                        onChange={(e) => setProfile({ ...profile, service_category: e.target.value })} 
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Skills (comma separated)</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all font-medium text-[var(--text-primary)]" 
                      placeholder="e.g. Plumbing, Wiring, Heating" 
                      value={(profile.skills || []).join(', ')}
                      onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Professional Summary</label>
                    <textarea 
                      className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all font-medium text-[var(--text-primary)] resize-y min-h-[150px]" 
                      placeholder="Describe your skills, experience, and what makes you great..." 
                      value={profile.description || ''}
                      onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                    />
                  </div>
                </div>

                {dynamicFields.length > 0 && (
                  <>
                    <hr className="border-[var(--border-color)]" />
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                        <i className="lnr lnr-magic-wand text-[var(--accent-color)]"></i> Professional Details
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {dynamicFields.map(field => (
                          <div key={field.name}>
                            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                              {field.label} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            
                            {field.type === 'boolean' ? (
                              <label className="flex items-center gap-3 cursor-pointer mt-3">
                                <input 
                                  type="checkbox" 
                                  className="w-5 h-5 rounded border-[var(--border-color)] text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
                                  checked={!!dynamicData[field.name]}
                                  onChange={(e) => setDynamicData(prev => ({ ...prev, [field.name]: e.target.checked }))}
                                />
                                <span className="text-[var(--text-primary)] font-medium">{field.label}</span>
                              </label>
                            ) : field.type === 'number' ? (
                              <input 
                                type="number" 
                                required={field.required}
                                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all font-medium text-[var(--text-primary)]"
                                value={dynamicData[field.name] || ''}
                                onChange={(e) => setDynamicData(prev => ({ ...prev, [field.name]: e.target.value ? Number(e.target.value) : '' }))}
                              />
                            ) : field.type === 'select' && field.options ? (
                              <select 
                                required={field.required}
                                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all font-medium text-[var(--text-primary)] appearance-none"
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
                                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all font-medium text-[var(--text-primary)]"
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

                <hr className="border-[var(--border-color)]" />

                {/* Location */}
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                    <i className="lnr lnr-map-marker text-[var(--accent-color)]"></i> Your Location
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">City / Region</label>
                      <select 
                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all font-medium text-[var(--text-primary)] appearance-none"
                        value={(profile.location || '').split(',')[0]} 
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      >
                        <option value="Harare">Harare</option>
                        <option value="Bulawayo">Bulawayo</option>
                        <option value="Mutare">Mutare</option>
                        <option value="Gweru">Gweru</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Full Address / Neighborhood</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all font-medium text-[var(--text-primary)]" 
                        placeholder="e.g. 123 Main St, Borrowdale" 
                        value={profile.location || ''}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[var(--accent-color)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-all active:scale-95 flex items-center justify-center gap-2"
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
                  <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <i className="lnr lnr-briefcase text-emerald-500"></i> Work Experience
                  </h3>
                  <button className="px-4 py-2 bg-emerald-50 text-emerald-600 font-bold text-sm rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-2">
                    <i className="lnr lnr-plus-circle"></i> Add New
                  </button>
                </div>
                
                <ExperienceForm onSave={(msg) => setMessage({ type: 'success', text: msg })} onError={(msg) => setMessage({ type: 'error', text: msg })} />
              </div>
            )}

            {activeTab === 'services' && (
              <div className="animate-fade-in space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                    <i className="lnr lnr-layers text-[var(--accent-color)]"></i> Manage Services & Pricing
                  </h3>
                  
                  <div className="bg-[var(--bg-secondary)] p-6 rounded-3xl border border-[var(--border-color)] mb-6 space-y-4">
                    {(profile.services || []).map((s, i) => (
                      <div key={i} className="flex flex-col sm:flex-row gap-4 items-center bg-[var(--bg-primary)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm">
                        <input className="flex-1 w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all font-medium text-[var(--text-primary)]" value={s.name} onChange={(e) => {
                          const newServices = [...(profile.services || [])];
                          newServices[i].name = e.target.value;
                          setProfile({ ...profile, services: newServices });
                        }} placeholder="Service Name" />
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <span className="text-[var(--text-secondary)] font-bold">$</span>
                          <input type="number" className="w-full sm:w-28 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all font-medium text-[var(--text-primary)]" value={s.price || ''} onChange={(e) => {
                            const newServices = [...(profile.services || [])];
                            newServices[i].price = Number(e.target.value);
                            setProfile({ ...profile, services: newServices });
                          }} placeholder="Price" />
                        </div>
                        <button onClick={() => {
                          const newServices = [...(profile.services || [])];
                          newServices.splice(i, 1);
                          setProfile({ ...profile, services: newServices });
                        }} className="text-rose-500 hover:bg-rose-50 px-4 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto">
                          <i className="lnr lnr-trash"></i>
                        </button>
                      </div>
                    ))}
                    <button onClick={() => {
                      setProfile({ ...profile, services: [...(profile.services || []), { name: '', price: 0, description: '' }] });
                    }} className="w-full py-3 border-2 border-dashed border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] font-bold hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)] transition-all">
                      + Add Service
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                    <i className="lnr lnr-picture text-[var(--accent-color)]"></i> Manage Past Work (Portfolio)
                  </h3>
                  
                  <div className="bg-[var(--bg-secondary)] p-6 rounded-3xl border border-[var(--border-color)] mb-6 space-y-4">
                    {(profile.portfolios || []).map((p, i) => (
                      <div key={i} className="flex flex-col gap-5 bg-[var(--bg-primary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
                        <div>
                          <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Project Title</label>
                          <input className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all font-medium text-[var(--text-primary)]" value={p.title} onChange={(e) => {
                            const newPorts = [...(profile.portfolios || [])];
                            newPorts[i].title = e.target.value;
                            setProfile({ ...profile, portfolios: newPorts });
                          }} placeholder="e.g. Modern Kitchen Remodel" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Project Image</label>
                          <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                            <input className="flex-1 w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all font-medium text-[var(--text-primary)]" value={p.image_url} onChange={(e) => {
                              const newPorts = [...(profile.portfolios || [])];
                              newPorts[i].image_url = e.target.value;
                              setProfile({ ...profile, portfolios: newPorts });
                            }} placeholder="Image URL (e.g. https://...)" />
                            
                            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                              <span className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-wider">OR</span>
                              <label className="cursor-pointer bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition-colors px-5 py-3 rounded-xl text-sm font-bold text-[var(--text-primary)] border border-[var(--border-color)] flex items-center gap-2 shrink-0">
                                <i className="lnr lnr-upload"></i> Upload Image
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        const newPorts = [...(profile.portfolios || [])];
                                        newPorts[i].image_url = reader.result as string;
                                        setProfile({ ...profile, portfolios: newPorts });
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }} 
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                        {p.image_url && (
                          <div className="w-full h-40 rounded-xl border border-[var(--border-color)] overflow-hidden bg-[var(--bg-secondary)] flex items-center justify-center">
                            {p.image_url.startsWith('data:') || p.image_url.startsWith('http') ? (
                               <img src={p.image_url} alt="Portfolio Preview" className="w-full h-full object-cover" />
                            ) : (
                               <span className="text-[var(--text-secondary)] text-sm font-medium">Valid image URL or upload required</span>
                            )}
                          </div>
                        )}
                        <div className="flex justify-end pt-2 border-t border-[var(--border-color)] mt-2">
                          <button onClick={() => {
                            const newPorts = [...(profile.portfolios || [])];
                            newPorts.splice(i, 1);
                            setProfile({ ...profile, portfolios: newPorts });
                          }} className="text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2">
                            <i className="lnr lnr-trash"></i> Remove Project
                          </button>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => {
                      setProfile({ ...profile, portfolios: [...(profile.portfolios || []), { title: '', description: '', image_url: '' }] });
                    }} className="w-full py-3 border-2 border-dashed border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] font-bold hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)] transition-all">
                      + Add Portfolio Item
                    </button>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={handleUpdate}
                    disabled={saving}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[var(--accent-color)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <><i className="lnr lnr-sync animate-spin"></i> Saving Updates...</>
                    ) : (
                      <><i className="lnr lnr-checkmark-circle"></i> Save All Updates</>
                    )}
                  </button>
                </div>
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
    <div className="bg-[var(--bg-secondary)] p-6 rounded-3xl border border-[var(--border-color)] mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Company / Project Name</label>
          <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all font-medium text-[var(--text-primary)]" placeholder="e.g. Tech Solutions Inc." />
        </div>
        <div>
          <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Time Period</label>
          <input type="text" value={period} onChange={e => setPeriod(e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all font-medium text-[var(--text-primary)]" placeholder="e.g. Jan 2020 - Present" />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Job Title / Role</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all font-medium text-[var(--text-primary)]" placeholder="e.g. Senior Frontend Developer" />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Role Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all font-medium text-[var(--text-primary)] resize-y min-h-[120px]" placeholder="Describe your responsibilities and achievements..."></textarea>
      </div>
      
      <button onClick={handleSubmit} disabled={saving} className="px-5 py-2.5 rounded-xl bg-[var(--accent-color)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50">
        {saving ? <><i className="lnr lnr-sync animate-spin"></i> Saving...</> : <><i className="lnr lnr-checkmark-circle"></i> Save Experience</>}
      </button>
    </div>
  );
}
