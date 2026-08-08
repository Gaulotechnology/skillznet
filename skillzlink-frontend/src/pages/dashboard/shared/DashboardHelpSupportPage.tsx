import { useState } from 'react';
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { accountApi } from "../../../services/api";

export function DashboardHelpSupportPage() {
  const [openAccordionId, setOpenAccordionId] = useState<string | null>('q1');
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketCategory, setTicketCategory] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [submittingTicket, setSubmittingTicket] = useState(false);
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
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Help & Support</h2>
            <p className="text-slate-500 mt-1 font-medium">Find answers to common questions or contact our support team.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              placeholder="Search help articles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-700 shadow-sm"
            />
            <i className="lnr lnr-magnifier absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg"></i>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <i className="lnr lnr-question-circle text-indigo-500"></i> Frequently Asked Questions
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
                          className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                        >
                          <button 
                            onClick={() => toggleAccordion(faq.id)}
                            className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                          >
                            <span className={`font-bold pr-4 ${isOpen ? 'text-indigo-700' : 'text-slate-700'}`}>
                              {faq.question}
                            </span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'bg-indigo-100 text-indigo-600 rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                              <i className="lnr lnr-chevron-down font-bold"></i>
                            </div>
                          </button>
                          
                          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-5 pt-0 text-slate-600 font-medium leading-relaxed border-t border-indigo-100/50 mt-2">
                              {faq.answer}
                              
                              <div className="mt-4 pt-4 border-t border-slate-100/50 flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-500">Was this helpful?</span>
                                <div className="flex gap-2">
                                  <button className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-500 transition-colors flex items-center justify-center text-slate-400">
                                    <i className="lnr lnr-thumbs-up"></i>
                                  </button>
                                  <button className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:border-rose-500 hover:text-rose-500 transition-colors flex items-center justify-center text-slate-400">
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
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 text-2xl mx-auto mb-4">
                      <i className="lnr lnr-sad"></i>
                    </div>
                    <h4 className="text-lg font-bold text-slate-700 mb-1">No results found</h4>
                    <p className="text-slate-500 font-medium">Try adjusting your search query.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Support Form */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Quick Contact Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              
              <h3 className="text-xl font-black mb-2 relative z-10">Still need help?</h3>
              <p className="text-indigo-100 font-medium text-sm mb-6 relative z-10 leading-relaxed">
                Our support team is available Monday to Friday, 8am - 5pm CAT.
              </p>
              
              <div className="space-y-4 relative z-10">
                <a href="mailto:support@skillzlink.com" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white group-hover:text-indigo-600 transition-all">
                    <i className="lnr lnr-envelope text-lg"></i>
                  </div>
                  <span className="font-medium group-hover:underline">support@skillzlink.com</span>
                </a>
                <a href="tel:+263123456789" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white group-hover:text-indigo-600 transition-all">
                    <i className="lnr lnr-phone-handset text-lg"></i>
                  </div>
                  <span className="font-medium group-hover:underline">+263 123 456 789</span>
                </a>
              </div>
            </div>

            {/* Support Ticket Form */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <i className="lnr lnr-pencil text-emerald-500"></i> Submit a Ticket
                </h3>
              </div>
              
              <div className="p-6 md:p-8">
                {ticketToast && (
                  <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-bold ${ticketToast.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
                    {ticketToast.message}
                  </div>
                )}
                <form className="space-y-5" onSubmit={handleSubmitTicket}>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Query Type</label>
                    <div className="relative">
                      <select value={ticketCategory} onChange={e => setTicketCategory(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-700 appearance-none">
                        <option value="" disabled>Select a category</option>
                        <option value="billing">Billing & Payments</option>
                        <option value="account">Account Management</option>
                        <option value="technical">Technical Issue</option>
                        <option value="report">Report a User</option>
                        <option value="other">Other</option>
                      </select>
                      <i className="lnr lnr-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none font-bold"></i>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                    <textarea 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-700 resize-y min-h-[120px]" 
                      placeholder="Please provide details about your issue..."
                      required
                      value={ticketDescription}
                      onChange={e => setTicketDescription(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <button type="submit" disabled={submittingTicket} className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 active:scale-95 flex items-center justify-center gap-2">
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
