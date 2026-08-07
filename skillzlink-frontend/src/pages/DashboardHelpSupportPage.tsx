import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export function DashboardHelpSupportPage() {
  const [openAccordionId, setOpenAccordionId] = useState<string | null>('collapsetwo4');

  const toggleAccordion = (id: string) => {
    setOpenAccordionId(openAccordionId === id ? null : id);
  };

  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-6 float-left">
            <div className="wt-dashboardbox">
              <div className="wt-dashboardboxtitle wt-titlewithsearch">
                <h2>Help &amp; Support</h2>
                <form className="wt-formtheme wt-formsearch">
                  <fieldset>
                    <div className="form-group">
                      <input type="text" name="Search" className="form-control" placeholder="Search Query" />
                      <a href="#!" className="wt-searchgbtn"><i className="lnr lnr-magnifier"></i></a>
                    </div>
                  </fieldset>
                </form>
              </div>
              <div className="wt-dashboardboxcontent wt-helpsupporthead">
                <div className="wt-tabscontenttitle">
                  <h2>Account Security &amp; Settings</h2>
                </div>
                <div className="wt-helpsupportcontent">
                  <div className="wt-description">
                    <p>Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua aut enim ad minim veniamac quis nostrud exercitation ullamco laboris.</p>
                  </div>
                  <ul className="wt-accordionhold accordion">
                    {/* Accordion Item 1 */}
                    <li>
                      <div 
                        className={`wt-accordiontitle ${openAccordionId !== 'collapsetwo2' ? 'collapsed' : ''}`}
                        onClick={() => toggleAccordion('collapsetwo2')}
                        style={{ cursor: 'pointer' }}
                      >
                        <span>Ways to work online and earn money?</span>
                      </div>
                      <div className={`wt-accordiondetails collapse ${openAccordionId === 'collapsetwo2' ? 'show' : ''}`}>
                        <div className="wt-title">
                          <h3>Ways to work online and earn money?</h3>
                        </div>
                        <div className="wt-description">
                          <p>Consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore eta dolore magnam aliqua. Ut enim ad minim veniam, quis nostrud <a href="#!">exercitation ullamco </a> laboris nisi ut aliquiprex ea commodo consequat eta dolore magna aliqua.</p>
                        </div>
                        <div className="wt-likeunlike">
                          <span>Did you find this useful?</span>
                          <a href="#!" className="wt-like"><i className="fa fa-thumbs-up"></i></a>
                          <a href="#!" className="wt-unlike"><i className="fa fa-thumbs-down"></i></a>
                        </div>
                      </div>
                    </li>
                    {/* Accordion Item 2 */}
                    <li>
                      <div 
                        className={`wt-accordiontitle ${openAccordionId !== 'collapsetwo4' ? 'collapsed' : ''}`}
                        onClick={() => toggleAccordion('collapsetwo4')}
                        style={{ cursor: 'pointer' }}
                      >
                        <span>Dolore magna aliqua enim ad minim veniam?</span>
                      </div>
                      <div className={`wt-accordiondetails collapse ${openAccordionId === 'collapsetwo4' ? 'show' : ''}`}>
                        <div className="wt-title">
                          <h3>Dolore magna aliqua enim ad minim veniam?</h3>
                        </div>
                        <div className="wt-description">
                          <p>
                            Consectetur adipisicing elit sed aeiusmisuod tempor incididunt labore dolore ma alaeiqua enim ade minim veniam quis nostr xecitation ullamcoaris nisi ut aliquipa extaea coedmmmodo equate irure dolawor in reprehenderit.
                          </p>
                        </div>
                        <div className="wt-likeunlike">
                          <span>Did you find this useful?</span>
                          <a href="#!" className="wt-like"><i className="fa fa-thumbs-up"></i></a>
                          <a href="#!" className="wt-unlike"><i className="fa fa-thumbs-down"></i></a>
                        </div>
                      </div>
                    </li>
                    {/* Accordion Item 3 */}
                    <li>
                      <div 
                        className={`wt-accordiontitle ${openAccordionId !== 'collapsethree2' ? 'collapsed' : ''}`}
                        onClick={() => toggleAccordion('collapsethree2')}
                        style={{ cursor: 'pointer' }}
                      >
                        <span>Eiusmod tempor incididunt ut labore et dolore magna aliqua?</span>
                      </div>
                      <div className={`wt-accordiondetails collapse ${openAccordionId === 'collapsethree2' ? 'show' : ''}`}>
                        <div className="wt-title">
                          <h3>Eiusmod tempor incididunt ut labore et dolore magna aliqua?</h3>
                        </div>
                        <div className="wt-description">
                          <p>
                            Consectetur adipisicing elit sed aeiusmisuod tempor incididunt labore dolore ma alaeiqua enim ade minim veniam quis nostr xecitation ullamcoaris nisi ut aliquipa extaea coedmmmodo equate irure dolawor in reprehenderit.
                          </p>
                        </div>
                        <div className="wt-likeunlike">
                          <span>Did you find this useful?</span>
                          <a href="#!" className="wt-like"><i className="fa fa-thumbs-up"></i></a>
                          <a href="#!" className="wt-unlike"><i className="fa fa-thumbs-down"></i></a>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-6 float-left">
            <div className="wt-dashboardbox wt-holdersolution">
              <div className="wt-dashboardboxtitle">
                <h2>Didn't Find Your Solution?</h2>
              </div>
              <div className="wt-dashboardboxcontent wt-querycontent">
                <div className="wt-tabscontenttitle">
                  <h2>Ask Your Query</h2>
                </div>
                <form className="wt-formtheme wt-userform">
                  <fieldset>
                    <div className="form-group">
                      <span className="wt-select">
                        <select defaultValue="">
                          <option value="" disabled>Select Query Type</option>
                          <option value="q1">Query</option>
                          <option value="q2">Query Type</option>
                        </select>
                      </span>
                    </div>
                    <div className="form-group">
                      <textarea name="message" className="form-control" placeholder="Query Description"></textarea>
                    </div>
                    <div className="form-group form-group-half wt-btnarea">
                      <a href="#!" className="wt-btn">Submit</a>
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
