import { useState, useEffect, type FormEvent } from 'react';
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { providerApi, type PublicProvider } from "../../../services/api";

export function DashboardProfilePage() {
  const [activeTab, setActiveTab] = useState<'skills' | 'education' | 'awards'>('skills');
  const [profile, setProfile] = useState<PublicProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    providerApi.getProfile()
      .then((res) => {
        setProfile(res.provider);
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
      });
      setProfile(res.provider);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="wt-dashboardbox wt-dashboardtabsholder" style={{ padding: '50px', textAlign: 'center' }}>
          <i className="fa fa-spinner fa-spin" style={{ fontSize: '40px', color: '#ff5851' }}></i>
          <p>Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="wt-dashboardbox wt-dashboardtabsholder" style={{ padding: '50px' }}>
          <div className="alert alert-danger">{message?.text || 'Could not load profile.'}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="wt-dashboardbox wt-dashboardtabsholder">
        <div className="wt-dashboardboxtitle">
          <h2>My Profile</h2>
        </div>
        <div className="wt-dashboardtabs">
          <ul className="wt-tabstitle nav navbar-nav">
            <li className="nav-item">
              <a 
                className={activeTab === 'skills' ? 'active' : ''} 
                onClick={(e) => { e.preventDefault(); setActiveTab('skills'); }} 
                href="#wt-skills"
              >
                Personal Details &amp; Skills
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={activeTab === 'education' ? 'active' : ''} 
                onClick={(e) => { e.preventDefault(); setActiveTab('education'); }} 
                href="#wt-education"
              >
                Experience &amp; Education
              </a>
            </li>
          </ul>
        </div>
        
        <div className="wt-tabscontent tab-content">
          {activeTab === 'skills' && (
            <div className="wt-personalskillshold tab-pane active" id="wt-skills">
              <form className="wt-formtheme wt-userform" onSubmit={handleUpdate}>
                <div className="wt-yourdetails wt-tabsinfo">
                  <div className="wt-tabscontenttitle">
                    <h2>Your Details</h2>
                  </div>
                  {message && (
                    <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>
                      {message.text}
                    </div>
                  )}
                  <fieldset>
                    <div className="form-group form-group-half">
                      <input type="text" className="form-control" placeholder="Name" value={profile.name} disabled />
                      <small>Name changes require admin approval.</small>
                    </div>
                    <div className="form-group form-group-half">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Service Category" 
                        value={profile.service_category}
                        onChange={(e) => setProfile({ ...profile, service_category: e.target.value })} 
                      />
                    </div>
                    <div className="form-group">
                      <textarea 
                        className="form-control" 
                        placeholder="Description" 
                        value={profile.description}
                        onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                        rows={6}
                      />
                    </div>
                  </fieldset>
                </div>

                <div className="wt-location wt-tabsinfo">
                  <div className="wt-tabscontenttitle">
                    <h2>Your Location</h2>
                  </div>
                  <fieldset>
                    <div className="form-group form-group-half">
                      <span className="wt-select">
                        <select 
                          value={profile.location.split(',')[0]} 
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        >
                          <option value="Harare">Harare</option>
                          <option value="Bulawayo">Bulawayo</option>
                          <option value="Mutare">Mutare</option>
                          <option value="Gweru">Gweru</option>
                        </select>
                      </span>
                    </div>
                    <div className="form-group form-group-half">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Full Address" 
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      />
                    </div>
                    <div className="form-group wt-btnarea" style={{ marginTop: '20px' }}>
                      <button type="submit" className="wt-btn" disabled={saving}>
                        {saving ? 'Saving...' : 'Save All Updates'}
                      </button>
                    </div>
                  </fieldset>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="wt-educationholder tab-pane active" id="wt-education">
              <div className="wt-userexperience wt-tabsinfo">
                <div className="wt-tabscontenttitle wt-addnew">
                  <h2>Add Your Experience</h2>
                  <a href="#/">Add New</a>
                </div>
                <form className="wt-formtheme wt-userform">
                  <fieldset>
                    <div className="form-group form-group-half">
                      <input type="text" name="company" className="form-control" placeholder="Company Title" />
                    </div>
                    <div className="form-group form-group-half">
                      <input type="text" name="date" className="form-control" placeholder="Start Date - End Date" />
                    </div>
                    <div className="form-group">
                      <input type="text" name="jobtitle" className="form-control" placeholder="Service Title" />
                    </div>
                    <div className="form-group">
                      <textarea name="description" className="form-control" placeholder="Service Description"></textarea>
                    </div>
                    <div className="form-group wt-btnarea">
                      <a href="#/" className="wt-btn">Save Experience (Coming Soon)</a>
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
