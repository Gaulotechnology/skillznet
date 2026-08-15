import { useState } from 'react';
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { accountApi, publicApi } from "../../../services/api";
import { useEffect } from "react";

export function DashboardHelpSupportPage() {
  const [openAccordionId, setOpenAccordionId] = useState<string | null>('q1');
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketCategory, setTicketCategory] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [submittingTicket, setSubmittingTicket] = useState(false);

  const [supportInfo, setSupportInfo] = useState({
    email: "support@skillzlink.com",
    phone: "+263 123 456 789",
    hours: "Monday to Friday, 8am - 5pm CAT."
  });

  useEffect(() => {
    publicApi.getThemeSettings().then(res => {
      if (res.settings) {
        setSupportInfo(prev => ({
          email: res.settings.email || prev.email,
          phone: res.settings.phone || res.settings.whatsapp || prev.phone,
          hours: prev.hours // Default hours since we don't have this in admin settings yet
        }));
      }
    }).catch(console.error);
  }, []);

  const [ticketToast, setTicketToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordionId(openAccordionId === id ? null : id);
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingTicket(true);
    setTicketToast(null);
    try {
      await accountApi.submitSupportTicket({ category: ticketCategory, description: ticketDescription });
      setTicketToast({ type: "success", message: "Support ticket submitted successfully!" });
      setTicketCategory("");
      setTicketDescription("");
    } catch {
      setTicketToast({ type: "error", message: "Failed to submit ticket. Please try again." });
    }
    setSubmittingTicket(false);
    setTimeout(() => setTicketToast(null), 5000);
  };

  const faqs = [
    {
      id: 'q1',
      question: 'How do I get paid for my services?',
      answer: 'Payments are processed securely through our platform. Once a service is marked as complete by both parties, the funds (minus our service fee) are transferred to your registered EcoCash, OneMoney, or bank account within 2-3 business days.'
    },
    {
      id: 'q2',
      question: 'How can I improve my profile visibility?',
      answer: 'To improve your visibility, ensure your profile is 100% complete with a professional photo, detailed description, and updated portfolio. Upgrading to a Premium subscription also gives you priority placement in search results and a verified badge.'
    },
    {
      id: 'q3',
      question: 'What happens if a customer cancels a request?',
      answer: 'If a customer cancels a request before you accept it, there is no penalty. If they cancel after acceptance but before work begins, they may be subject to a cancellation fee depending on the service terms. If you have already started work, please contact support for mediation.'
    },
    {
      id: 'q4',
      question: 'How do I report a suspicious user?',
      answer: 'You can report a user directly from their profile page or from your message history by clicking the three dots icon and selecting "Report User". Our trust and safety team reviews all reports within 24 hours.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto font-['Inter',sans-serif]">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Help & Support</h2>
            <p className="text-[var(--text-secondary)] mt-1 font-medium">Find answers to common questions or contact our support team.</p>
          </div>
          
          <div
            className="flex items-center gap-3 w-full md:w-72 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 transition-all focus-within:border-[var(--accent-color)] focus-within:ring-2 focus-within:ring-[var(--accent-light)] shadow-sm"
            style={{ height: '48px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[var(--text-secondary)]">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', padding: 0, height: '100%', width: '100%', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}
              className="placeholder-[var(--text-secondary)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-sm">
              <div className="p-6 md:p-8 border-b border-[var(--border-color)]">
                <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <i className="lnr lnr-question-circle text-[var(--accent-color)]"></i> Frequently Asked Questions
                </h3>
              </div>
              
              <div className="p-4 md:p-6">
                {filteredFaqs.length > 0 ? (
                  <div className="space-y-4">
                    {filteredFaqs.map((faq) => {
                      const isOpen = openAccordionId === faq.id;
                      return (
                        <div 
                          key={faq.id} 
                          className={`border rounded-3xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-[var(--accent-color)]/30 bg-[var(--accent-light)]' : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--accent-color)]/20'}`}
                        >
                          <button 
                            onClick={() => toggleAccordion(faq.id)}
                            className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                          >
                            <span className={`font-bold pr-4 ${isOpen ? 'text-[var(--accent-color)]' : 'text-[var(--text-primary)]'}`}>
                              {faq.question}
                            </span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'bg-[var(--accent-color)]/10 text-[var(--accent-color)] rotate-180' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`}>
                              <i className="lnr lnr-chevron-down font-bold"></i>
                            </div>
                          </button>
                          
                          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-5 pt-0 text-[var(--text-secondary)] font-medium leading-relaxed border-t border-[var(--border-color)]/50 mt-2">
                              {faq.answer}
                              
                              <div className="mt-4 pt-4 border-t border-[var(--border-color)]/50 flex items-center justify-between">
                                <span className="text-sm font-bold text-[var(--text-secondary)]">Was this helpful?</span>
                                <div className="flex gap-2">
                                  <button className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-emerald-500 hover:text-emerald-500 transition-colors flex items-center justify-center text-[var(--text-secondary)]">
                                    <i className="lnr lnr-thumbs-up"></i>
                                  </button>
                                  <button className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-red-500 hover:text-red-500 transition-colors flex items-center justify-center text-[var(--text-secondary)]">
                                    <i className="lnr lnr-thumbs-down"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] text-2xl mx-auto mb-4">
                      <i className="lnr lnr-sad"></i>
                    </div>
                    <h4 className="text-lg font-bold text-[var(--text-primary)] mb-1">No results found</h4>
                    <p className="text-[var(--text-secondary)] font-medium">Try adjusting your search query.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Support Form */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Quick Contact Card */}
            <div className="bg-[var(--accent-light)] rounded-3xl p-8 border border-[var(--border-color)] relative overflow-hidden shadow-sm">
              <h3 className="text-xl font-black text-[var(--text-primary)] mb-2 relative z-10">Still need help?</h3>
              <p className="text-[var(--text-secondary)] font-medium text-sm mb-6 relative z-10 leading-relaxed">
                Our support team is available {supportInfo.hours}
              </p>
              
              <div className="space-y-4 relative z-10">
                <a href={`mailto:${supportInfo.email}`} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-color)]/10 flex items-center justify-center text-[var(--accent-color)] group-hover:bg-[var(--accent-color)] group-hover:text-white transition-all">
                    <i className="lnr lnr-envelope text-lg"></i>
                  </div>
                  <span className="font-medium text-[var(--text-primary)] group-hover:underline">{supportInfo.email}</span>
                </a>
                <a href={`tel:${supportInfo.phone}`} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-color)]/10 flex items-center justify-center text-[var(--accent-color)] group-hover:bg-[var(--accent-color)] group-hover:text-white transition-all">
                    <i className="lnr lnr-phone-handset text-lg"></i>
                  </div>
                  <span className="font-medium text-[var(--text-primary)] group-hover:underline">{supportInfo.phone}</span>
                </a>
              </div>
            </div>

            {/* Support Ticket Form */}
            <div className="bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-sm">
              <div className="p-6 md:p-8 border-b border-[var(--border-color)]">
                <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <i className="lnr lnr-pencil text-emerald-500"></i> Submit a Ticket
                </h3>
              </div>
              
              <div className="p-6 md:p-8">
                {ticketToast && (
                  <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-bold ${ticketToast.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    {ticketToast.message}
                  </div>
                )}
                <form className="space-y-5" onSubmit={handleSubmitTicket}>
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Query Type</label>
                    <div className="relative">
                      <select value={ticketCategory} onChange={e => setTicketCategory(e.target.value)} required className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent-color)] focus:bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all font-medium text-[var(--text-primary)] appearance-none">
                        <option value="" disabled>Select a category</option>
                        <option value="billing">Billing & Payments</option>
                        <option value="account">Account Management</option>
                        <option value="technical">Technical Issue</option>
                        <option value="report">Report a User</option>
                        <option value="other">Other</option>
                      </select>
                      <i className="lnr lnr-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none font-bold"></i>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Description</label>
                    <textarea 
                      className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent-color)] focus:bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all font-medium text-[var(--text-primary)] resize-y min-h-[120px]" 
                      placeholder="Please provide details about your issue..."
                      required
                      value={ticketDescription}
                      onChange={e => setTicketDescription(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <button type="submit" disabled={submittingTicket} className="w-full py-3.5 rounded-xl bg-[var(--accent-color)] text-white font-bold hover:bg-[var(--accent-hover)] transition-colors active:scale-95 flex items-center justify-center gap-2">
                    {submittingTicket ? (
                      <><i className="lnr lnr-sync animate-spin"></i> Sending...</>
                    ) : (
                      <><i className="lnr lnr-paper-plane"></i> Send Message</>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
