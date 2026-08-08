import { useState, useEffect } from "react";
import { SeekerLayout } from "../../../components/layout/SeekerLayout";
import { seekerApi } from "../../../services/api";

export function DashboardBillingPage() {
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingMethod, setAddingMethod] = useState(false);
  const [newMethod, setNewMethod] = useState({ type: "ecocash", number: "", label: "" });

  useEffect(() => { loadBilling(); }, []);

  const loadBilling = () => {
    setLoading(true);
    seekerApi.getBilling().then((data: any) => {
      setPaymentMethods(data.payment_methods || []);
      setTransactions(data.transactions || []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  const handleAddMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingMethod(true);
    try {
      await seekerApi.addPaymentMethod({
        type: newMethod.type,
        details: { number: newMethod.number, label: newMethod.label }
      });
      setShowAddForm(false);
      setNewMethod({ type: "ecocash", number: "", label: "" });
      loadBilling();
    } catch {}
    setAddingMethod(false);
  };

  const handleDeleteMethod = async (id: number) => {
    if (!window.confirm("Remove this payment method?")) return;
    try {
      await seekerApi.deletePaymentMethod(id);
      loadBilling();
    } catch {}
  };

  if (loading) {
    return (
      <SeekerLayout>
        <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div></div>
      </SeekerLayout>
    );
  }

  return (
    <SeekerLayout>
      <div className="space-y-8 font-['Inter',sans-serif]">
        <div>
          <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">Billing & Payments</h2>
          <p className="text-[var(--text-secondary)] font-medium mt-1">Manage your payment methods and view past transactions.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Payment Methods */}
          <div className="bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
              <h3 className="font-bold text-lg text-[var(--text-primary)]">Payment Methods</h3>
              <button onClick={() => setShowAddForm(!showAddForm)} className="text-sm font-bold text-[var(--accent-color)] hover:text-[var(--accent-hover)] bg-[var(--accent-light)] px-3 py-1.5 rounded-lg transition-colors">
                + Add New
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {showAddForm && (
                <form onSubmit={handleAddMethod} className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--accent-light)] space-y-3 mb-4">
                  <select value={newMethod.type} onChange={e => setNewMethod(p => ({ ...p, type: e.target.value }))} className="w-full px-3 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-medium">
                    <option value="ecocash">EcoCash</option>
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                  </select>
                  <input type="text" required placeholder="Number / identifier" value={newMethod.number} onChange={e => setNewMethod(p => ({ ...p, number: e.target.value }))} className="w-full px-3 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-medium" />
                  <input type="text" placeholder="Label (optional)" value={newMethod.label} onChange={e => setNewMethod(p => ({ ...p, label: e.target.value }))} className="w-full px-3 py-2 bg-white border border-[var(--border-color)] rounded-lg text-sm font-medium" />
                  <button type="submit" disabled={addingMethod} className="px-5 py-2.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-semibold text-xs rounded-xl">{addingMethod ? "Adding..." : "Add Method"}</button>
                </form>
              )}

              {paymentMethods.length === 0 ? (
                <div className="py-8 text-center text-[var(--text-secondary)] text-sm">No payment methods added yet.</div>
              ) : paymentMethods.map((pm: any) => (
                <div key={pm.id} className="p-4 rounded-2xl border border-[var(--border-color)] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[var(--accent-color)]/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--accent-light)] rounded-xl flex items-center justify-center text-[var(--accent-color)] font-black text-xl shrink-0">
                      <i className="lnr lnr-credit-card"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--text-primary)]">{pm.label || pm.type}</h4>
                      <p className="text-sm font-medium text-[var(--text-secondary)]">{pm.number || ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {pm.is_default && <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-200 text-emerald-800 rounded-md">Default</span>}
                    <button onClick={() => handleDeleteMethod(pm.id)} className="p-2 text-[var(--text-secondary)] hover:text-red-500 transition-colors ml-auto">
                      <i className="lnr lnr-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[var(--border-color)]">
              <h3 className="font-bold text-lg text-[var(--text-primary)]">Recent Transactions</h3>
            </div>
            
            {transactions.length === 0 ? (
              <div className="p-12 text-center text-[var(--text-secondary)] text-sm">No transactions yet.</div>
            ) : (
              <div className="divide-y divide-[var(--border-color)]">
                {transactions.map((tx: any, i: number) => (
                  <div key={tx.id || i} className="p-6 flex items-center justify-between hover:bg-[var(--bg-secondary)] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] flex items-center justify-center">
                        <i className="lnr lnr-briefcase"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-[var(--text-primary)] text-sm">{tx.description || tx.title || "Transaction"}</h4>
                        <p className="text-xs font-medium text-[var(--text-secondary)]">{tx.date || tx.created_at || ""}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[var(--text-primary)]">{tx.amount}</div>
                      <div className="text-[10px] font-bold text-emerald-600 uppercase">{tx.status || "Paid"}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="p-4 border-t border-[var(--border-color)] text-center">
              <button className="text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors">
                View All Transactions
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </SeekerLayout>
  );
}
