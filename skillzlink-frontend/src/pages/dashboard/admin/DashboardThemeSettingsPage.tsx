import { useState, useEffect } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { adminApi } from "../../../services/api";

export function DashboardThemeSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    primary_color: "#ff5851",
    secondary_color: "#3f4451",
    button_color: "#ff5851",
    hero_title_color: "#ffffff"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getThemeSettings().then(res => {
      if (res.settings && Object.keys(res.settings).length > 0) {
        setSettings(prev => ({ ...prev, ...res.settings }));
      }
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.updateThemeSettings({ settings });
      alert("Theme settings saved successfully. Refresh to see changes globally.");
      // Apply instantly to current session
      Object.entries(settings).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key.replace(/_/g, '-')}`, value);
      });
    } catch (err) {
      alert("Failed to save theme settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        <div className="row">
          <div className="col-12">
            <div className="wt-dashboardbox">
              <div className="wt-dashboardboxtitle">
                <h2>Website Theme Settings</h2>
              </div>
              <div className="wt-dashboardboxcontent">
                {loading ? (
                  <p>Loading theme settings...</p>
                ) : (
                  <form className="wt-formtheme wt-formprojectinfo" onSubmit={handleSave}>
                    <fieldset>
                      <div className="form-group form-group-half">
                        <label>Primary Color</label>
                        <input 
                          type="color" 
                          className="form-control" 
                          value={settings.primary_color || "#ff5851"} 
                          onChange={e => handleChange('primary_color', e.target.value)} 
                          style={{ height: '50px', padding: '5px' }}
                        />
                      </div>
                      
                      <div className="form-group form-group-half">
                        <label>Secondary Color</label>
                        <input 
                          type="color" 
                          className="form-control" 
                          value={settings.secondary_color || "#3f4451"} 
                          onChange={e => handleChange('secondary_color', e.target.value)} 
                          style={{ height: '50px', padding: '5px' }}
                        />
                      </div>

                      <div className="form-group form-group-half">
                        <label>Button Background Color</label>
                        <input 
                          type="color" 
                          className="form-control" 
                          value={settings.button_color || "#ff5851"} 
                          onChange={e => handleChange('button_color', e.target.value)} 
                          style={{ height: '50px', padding: '5px' }}
                        />
                      </div>

                      <div className="form-group form-group-half">
                        <label>Hero Title Color</label>
                        <input 
                          type="color" 
                          className="form-control" 
                          value={settings.hero_title_color || "#ffffff"} 
                          onChange={e => handleChange('hero_title_color', e.target.value)} 
                          style={{ height: '50px', padding: '5px' }}
                        />
                      </div>
                    </fieldset>

                    <div className="wt-updatall">
                      <i className="ti-announcement"></i>
                      <span>Save your changes to update the website's look and feel.</span>
                      <button type="submit" className="wt-btn" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
