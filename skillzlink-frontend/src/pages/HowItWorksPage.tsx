import { useState } from 'react';
import { Link } from 'react-router-dom';

export function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<'hiring' | 'freelancing' | 'faq'>('hiring');
  
  // Track which accordion item is open
  const [openAccordion, setOpenAccordion] = useState<string>('hire-1');

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? '' : id);
  };

  return (
    <>
      {/* Inner Home Banner Start */}
      <div className="wt-haslayout wt-innerbannerholder">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-xs-12 col-sm-12 col-md-8 push-md-2 col-lg-6 push-lg-3">
              <div className="wt-innerbannercontent">
                <div className="wt-title"><h2>See How It Works?</h2></div>
                <ol className="wt-breadcrumb">
                  <li><Link to="/">Home</Link></li>
                  <li className="wt-active">How It Works</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Inner Home End */}

      {/* Main Start */}
      <main id="wt-main" className="wt-main wt-haslayout wt-innerbgcolor">
        <div className="wt-haslayout wt-main-section">
          <div className="wt-contentwrappers">
            <div className="container">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 float-left">
                  <div className="wt-howitwork-hold wt-bgwhite wt-haslayout">
                    
                    <ul className="wt-navarticletab wt-navarticletabvtwo nav navbar-nav">
                      <li className="nav-item">
                        <a 
                          className={activeTab === 'hiring' ? 'active' : ''} 
                          onClick={(e) => { e.preventDefault(); setActiveTab('hiring'); }} 
                          href="#forhiring"
                        >
                          For Hiring
                        </a>
                      </li>
                      <li className="nav-item">
                        <a 
                          className={activeTab === 'freelancing' ? 'active' : ''} 
                          onClick={(e) => { e.preventDefault(); setActiveTab('freelancing'); }} 
                          href="#forfreelancing"
                        >
                          For Professionals
                        </a>
                      </li>
                      <li className="nav-item">
                        <a 
                          className={activeTab === 'faq' ? 'active' : ''} 
                          onClick={(e) => { e.preventDefault(); setActiveTab('faq'); }} 
                          href="#faq"
                        >
                          FAQ
                        </a>
                      </li>
                    </ul>

                    <div className="tab-content wt-haslayout">
                      {/* For Hiring Tab */}
                      {activeTab === 'hiring' && (
                        <div className="wt-contentarticle tab-pane active" id="forhiring">
                          <div className="row">
                            <div className="wt-starthiringhold wt-innerspace wt-haslayout">
                              <div className="col-12 col-sm-12 col-md-12 col-lg-7 float-left">
                                <div className="wt-starthiringcontent">
                                  <div className="wt-sectionhead">
                                    <div className="wt-sectiontitle">
                                      <h2>How To Hire Professionals</h2>
                                      <span>Find the right skills for your project</span>
                                    </div>
                                    <div className="wt-description">
                                      <p>SkillzLink makes it simple to connect with reliable professionals in your area. Follow these easy steps to get your project done.</p>
                                    </div>
                                  </div>
                                  <ul className="wt-accordionhold accordion">
                                    <li>
                                      <div 
                                        className={`wt-accordiontitle ${openAccordion !== 'hire-1' ? 'collapsed' : ''}`} 
                                        onClick={() => toggleAccordion('hire-1')}
                                      >
                                        <span>1. Search for skills</span>
                                      </div>
                                      {openAccordion === 'hire-1' && (
                                        <div className="wt-accordiondetails">
                                          <div className="wt-description">
                                            <p>Use our search bar to find the exact skills you need, from plumbing and electrical work to web design and tutoring. Filter by location and category to narrow down your options.</p>
                                          </div>
                                        </div>
                                      )}
                                    </li>
                                    <li>
                                      <div 
                                        className={`wt-accordiontitle ${openAccordion !== 'hire-2' ? 'collapsed' : ''}`} 
                                        onClick={() => toggleAccordion('hire-2')}
                                      >
                                        <span>2. Review profiles</span>
                                      </div>
                                      {openAccordion === 'hire-2' && (
                                        <div className="wt-accordiondetails">
                                          <div className="wt-description">
                                            <p>Check out professional profiles to see their experience, skills, ratings, and reviews from previous clients. Compare rates and choose the best fit for your budget.</p>
                                          </div>
                                        </div>
                                      )}
                                    </li>
                                    <li>
                                      <div 
                                        className={`wt-accordiontitle ${openAccordion !== 'hire-3' ? 'collapsed' : ''}`} 
                                        onClick={() => toggleAccordion('hire-3')}
                                      >
                                        <span>3. Connect and hire</span>
                                      </div>
                                      {openAccordion === 'hire-3' && (
                                        <div className="wt-accordiondetails">
                                          <div className="wt-description">
                                            <p>Contact the professional directly via WhatsApp or our internal messaging system. Discuss project details, agree on terms, and hire them for your service.</p>
                                          </div>
                                        </div>
                                      )}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-12 col-lg-5 float-right">
                                <div className="wt-howtoworkimg">
                                  <figure>
                                    <img src="/images/work/img-01.jpg" alt="img description" />
                                  </figure>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* For Professionals Tab */}
                      {activeTab === 'freelancing' && (
                        <div className="wt-contentarticle tab-pane active" id="forfreelancing">
                          <div className="row">
                            <div className="wt-starthiringhold wt-innerspace wt-haslayout">
                              <div className="col-12 col-sm-12 col-md-12 col-lg-7 float-right">
                                <div className="wt-starthiringcontent">
                                  <div className="wt-sectionhead">
                                    <div className="wt-sectiontitle">
                                      <h2>How to Get Hired</h2>
                                      <span>Grow your business with SkillzLink</span>
                                    </div>
                                    <div className="wt-description">
                                      <p>Join our platform as a professional to reach more clients and build your reputation. Here is how to get started.</p>
                                    </div>
                                  </div>
                                  <ul className="wt-accordionhold accordion">
                                    <li>
                                      <div 
                                        className={`wt-accordiontitle ${openAccordion !== 'pro-1' ? 'collapsed' : ''}`} 
                                        onClick={() => toggleAccordion('pro-1')}
                                      >
                                        <span>1. Create your profile</span>
                                      </div>
                                      {openAccordion === 'pro-1' && (
                                        <div className="wt-accordiondetails">
                                          <div className="wt-description">
                                            <p>Sign up and fill out your profile with your skills, experience, and services offered. Add a professional photo and set your hourly or project rates.</p>
                                          </div>
                                        </div>
                                      )}
                                    </li>
                                    <li>
                                      <div 
                                        className={`wt-accordiontitle ${openAccordion !== 'pro-2' ? 'collapsed' : ''}`} 
                                        onClick={() => toggleAccordion('pro-2')}
                                      >
                                        <span>2. Get discovered</span>
                                      </div>
                                      {openAccordion === 'pro-2' && (
                                        <div className="wt-accordiondetails">
                                          <div className="wt-description">
                                            <p>Clients search our platform for your specific skills. Ensure your profile is complete and accurate to appear higher in search results and attract more leads.</p>
                                          </div>
                                        </div>
                                      )}
                                    </li>
                                    <li>
                                      <div 
                                        className={`wt-accordiontitle ${openAccordion !== 'pro-3' ? 'collapsed' : ''}`} 
                                        onClick={() => toggleAccordion('pro-3')}
                                      >
                                        <span>3. Deliver and get reviewed</span>
                                      </div>
                                      {openAccordion === 'pro-3' && (
                                        <div className="wt-accordiondetails">
                                          <div className="wt-description">
                                            <p>Communicate clearly, complete the service to the client's satisfaction, and earn positive reviews. Good ratings will help you secure more work in the future.</p>
                                          </div>
                                        </div>
                                      )}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-12 col-lg-5 float-left">
                                <div className="wt-howtoworkimg">
                                  <figure>
                                    <img src="/images/work/img-02.jpg" alt="img description" />
                                  </figure>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* FAQ Tab */}
                      {activeTab === 'faq' && (
                        <div className="wt-contentarticle tab-pane active" id="faq">
                          <div className="row">
                            <div className="wt-starthiringhold wt-innerspace wt-haslayout">
                              <div className="col-12 col-sm-12 col-md-12 col-lg-7 float-left">
                                <div className="wt-starthiringcontent">
                                  <div className="wt-sectionhead">
                                    <div className="wt-sectiontitle">
                                      <h2>Frequently Asked Questions</h2>
                                      <span>Find answers to common questions</span>
                                    </div>
                                  </div>
                                  <ul className="wt-accordionhold accordion">
                                    <li>
                                      <div 
                                        className={`wt-accordiontitle ${openAccordion !== 'faq-1' ? 'collapsed' : ''}`} 
                                        onClick={() => toggleAccordion('faq-1')}
                                      >
                                        <span>Is it free to join SkillzLink?</span>
                                      </div>
                                      {openAccordion === 'faq-1' && (
                                        <div className="wt-accordiondetails">
                                          <div className="wt-description">
                                            <p>Yes, creating a profile and searching for professionals is completely free. We may introduce premium features in the future, but basic access will always remain free.</p>
                                          </div>
                                        </div>
                                      )}
                                    </li>
                                    <li>
                                      <div 
                                        className={`wt-accordiontitle ${openAccordion !== 'faq-2' ? 'collapsed' : ''}`} 
                                        onClick={() => toggleAccordion('faq-2')}
                                      >
                                        <span>How do I pay a professional?</span>
                                      </div>
                                      {openAccordion === 'faq-2' && (
                                        <div className="wt-accordiondetails">
                                          <div className="wt-description">
                                            <p>Payment terms are agreed upon directly between the client and the professional. SkillzLink currently acts as a discovery platform and does not process payments.</p>
                                          </div>
                                        </div>
                                      )}
                                    </li>
                                    <li>
                                      <div 
                                        className={`wt-accordiontitle ${openAccordion !== 'faq-3' ? 'collapsed' : ''}`} 
                                        onClick={() => toggleAccordion('faq-3')}
                                      >
                                        <span>How do I report an issue?</span>
                                      </div>
                                      {openAccordion === 'faq-3' && (
                                        <div className="wt-accordiondetails">
                                          <div className="wt-description">
                                            <p>If you experience any problems with a professional or the platform, you can use the "Report User" feature on their profile or contact our support team through the Contact Us page.</p>
                                          </div>
                                        </div>
                                      )}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Main End */}
    </>
  );
}
