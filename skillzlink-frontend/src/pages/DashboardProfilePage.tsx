import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export function DashboardProfilePage() {
  const [activeTab, setActiveTab] = useState<'skills' | 'education' | 'awards'>('skills');

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
              <div className="wt-yourdetails wt-tabsinfo">
                <div className="wt-tabscontenttitle">
                  <h2>Your Details</h2>
                </div>
                <form className="wt-formtheme wt-userform">
                  <fieldset>
                    <div className="form-group form-group-half">
                      <input type="text" name="firstName" className="form-control" placeholder="First Name" defaultValue="Tinashe" />
                    </div>
                    <div className="form-group form-group-half">
                      <input type="text" name="lastName" className="form-control" placeholder="Last Name" defaultValue="Moyo" />
                    </div>
                    <div className="form-group form-group-half">
                      <input type="number" name="rate" className="form-control" placeholder="Your Service Hourly Rate ($)" defaultValue={15} />
                    </div>
                    <div className="form-group">
                      <input type="text" name="tagline" className="form-control" placeholder="Add Your Tagline Here" defaultValue="Experienced plumber serving Harare." />
                    </div>
                    <div className="form-group">
                      <textarea name="description" className="form-control" placeholder="Description" defaultValue="I handle emergency leaks, installations, and general maintenance with quick response times."></textarea>
                    </div>
                    <div className="form-group wt-btnarea">
                      <a href="#/" className="wt-btn">Save Updates</a>
                    </div>
                  </fieldset>
                </form>
              </div>

              <div className="wt-location wt-tabsinfo">
                <div className="wt-tabscontenttitle">
                  <h2>Your Location</h2>
                </div>
                <form className="wt-formtheme wt-userform">
                  <fieldset>
                    <div className="form-group form-group-half">
                      <span className="wt-select">
                        <select defaultValue="Harare">
                          <option value="Harare">Harare</option>
                          <option value="Bulawayo">Bulawayo</option>
                          <option value="Mutare">Mutare</option>
                          <option value="Gweru">Gweru</option>
                        </select>
                      </span>
                    </div>
                    <div className="form-group form-group-half">
                      <input type="text" name="address" className="form-control" placeholder="Your Address" defaultValue="Borrowdale, Harare" />
                    </div>
                    <div className="form-group wt-btnarea">
                      <a href="#/" className="wt-btn">Save Location</a>
                    </div>
                  </fieldset>
                </form>
              </div>

              <div className="wt-skills">
                <div className="wt-tabscontenttitle">
                  <h2>My Skills</h2>
                </div>
                <div className="wt-skillscontent-holder">
                  <form className="wt-formtheme wt-skillsform">
                    <fieldset>
                      <div className="form-group">
                        <div className="form-group-holder">
                          <input type="text" className="form-control" placeholder="Add a new skill (e.g. Pipe Fitting)" />
                          <input type="number" name="rate" className="form-control" placeholder="Rate Your Skill (0% to 100%)" />
                        </div>
                      </div>
                      <div className="form-group wt-btnarea">
                        <a href="#/" className="wt-btn">Add Skill</a>
                      </div>
                    </fieldset>
                  </form>
                  <div className="wt-myskills">
                    <ul className="sortable list">
                      <li>
                        <div className="wt-dragdroptool">
                          <a href="#/" className="lnr lnr-menu"></a>
                        </div>
                        <span className="skill-dynamic-html">Pipe Fitting (<em className="skill-val">90</em>%)</span>
                        <div className="wt-rightarea">
                          <a href="#/" className="wt-deleteinfo"><i className="lnr lnr-trash"></i></a>
                        </div>
                      </li>
                      <li>
                        <div className="wt-dragdroptool">
                          <a href="#/" className="lnr lnr-menu"></a>
                        </div>
                        <span className="skill-dynamic-html">Geyser Repair (<em className="skill-val">95</em>%)</span>
                        <div className="wt-rightarea">
                          <a href="#/" className="wt-deleteinfo"><i className="lnr lnr-trash"></i></a>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
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
                      <input type="text" name="jobtitle" className="form-control" placeholder="Job Title" />
                    </div>
                    <div className="form-group">
                      <textarea name="description" className="form-control" placeholder="Job Description"></textarea>
                    </div>
                    <div className="form-group wt-btnarea">
                      <a href="#/" className="wt-btn">Save Experience</a>
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
