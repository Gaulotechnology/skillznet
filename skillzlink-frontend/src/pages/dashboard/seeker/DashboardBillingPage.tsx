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
      await seekerApi.addPaymentMethod(newMethod);
      setShowAddForm(false);
      setNewMethod({ type: "ecocash", number: "", label: "" });
      loadBilling();
    } catch {}
    setAddingMethod(false);
  };

  const handleDeleteMethod = async (id: string) => {
    if (!window.confirm("Remove this payment method?")) return;
    try {
      await seekerApi.deletePaymentMethod(id);
      loadBilling();
    } catch {}
  };

  if (loading) {
    return (
      <SeekerLayout>
        <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>
      </SeekerLayout>
    );
  }

  return (
    <SeekerLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Billing & Payments</h2>
          <p className="text-slate-500 font-medium mt-1">Manage your payment methods and view past transactions.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Payment Methods */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">Payment Methods</h3>
              <button onClick={() => setShowAddForm(!showAddForm)} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                + Add New
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {showAddForm && (
                <form onSubmit={handleAddMethod} className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/30 space-y-3 mb-4">
                  <select value={newMethod.type} onChange={e => setNewMethod(p => ({ ...p, type: e.target.value }))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium">
                    <option value="ecocash">EcoCash</option>
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                  </select>
                  <input type="text" required placeholder="Number / identifier" value={newMethod.number} onChange={e => setNewMethod(p => ({ ...p, number: e.target.value }))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium" />
                  <input type="text" placeholder="Label (optional)" value={newMethod.label} onChange={e => setNewMethod(p => ({ ...p, label: e.target.value }))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium" />
                  <button type="submit" disabled={addingMethod} className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg">{addingMethod ? "Adding..." : "Add Method"}</button>
                </form>
              )}

              {paymentMethods.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-sm">No payment methods added yet.</div>
              ) : paymentMethods.map((pm: any) => (
                <div key={pm.id} className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-indigo-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl shadow-sm border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl shrink-0">
                      <i className="lnr lnr-credit-card"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{pm.label || pm.type}</h4>
                      <p className="text-sm font-medium text-slate-500">{pm.number || ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {pm.is_default && <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-200 text-emerald-800 rounded-md">Default</span>}
                    <button onClick={() => handleDeleteMethod(pm.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors ml-auto">
                      <i className="lnr lnr-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Recent Transactions</h3>
            </div>
            
            {transactions.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">No transactions yet.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {transactions.map((tx: any, i: number) => (
                  <div key={tx.id || i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                        <i className="lnr lnr-briefcase"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{tx.description || tx.title || "Transaction"}</h4>
                        <p className="text-xs font-medium text-slate-500">{tx.date || tx.created_at || ""}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-800">{tx.amount}</div>
                      <div className="text-[10px] font-bold text-emerald-600 uppercase">{tx.status || "Paid"}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="p-4 border-t border-slate-100 text-center">
              <button className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                View All Transactions
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </SeekerLayout>
  );
}
