import { useState, useEffect } from "react";
import { SeekerLayout } from "../../../components/layout/SeekerLayout";
import { Link } from "react-router-dom";
import { seekerApi } from "../../../services/api";

export function DashboardReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ provider_id: "", rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = () => {
    setLoading(true);
    seekerApi.getReviews().then((data: any) => {
      setReviews(data.reviews || []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await seekerApi.createReview(formData);
      setShowForm(false);
      setFormData({ provider_id: "", rating: 5, comment: "" });
      loadReviews();
    } catch {}
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await seekerApi.deleteReview(id);
      loadReviews();
    } catch {}
  };

  const handleEditSave = async (id: string) => {
    try {
      await seekerApi.updateReview(id, { rating: editRating, comment: editComment });
      setEditingId(null);
      loadReviews();
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
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">My Reviews</h2>
            <p className="text-slate-500 font-medium mt-1">Manage feedback you've left for professionals.</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-colors active:scale-95">
            Leave Review
          </button>
        </div>

        {/* Create Review Form */}
        {showForm && (
          <div className="bg-white rounded-3xl border border-indigo-200 p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Write a New Review</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Provider ID</label>
                <input type="text" required value={formData.provider_id} onChange={e => setFormData(p => ({ ...p, provider_id: e.target.value }))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-700" placeholder="Enter provider ID" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Rating (1-5)</label>
                <select value={formData.rating} onChange={e => setFormData(p => ({ ...p, rating: Number(e.target.value) }))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-700 appearance-none">
                  {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n>1?'s':''}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Comment</label>
                <textarea required value={formData.comment} onChange={e => setFormData(p => ({ ...p, comment: e.target.value }))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-700 resize-y min-h-[100px]" placeholder="Share your experience..." />
              </div>
              <button type="submit" disabled={submitting} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl transition-colors hover:bg-slate-800 active:scale-95">
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}

        {/* Past Reviews List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-800">Past Reviews</h3>
          </div>
          
          {reviews.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <i className="lnr lnr-star text-2xl"></i>
              </div>
              <h4 className="text-lg font-bold text-slate-700 mb-2">No reviews yet</h4>
              <p className="text-sm">You haven't left any reviews yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {reviews.map((review: any) => (
                <div key={review.id} className="p-6 md:p-8 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-64 shrink-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                          {(review.provider_name || "P")[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{review.provider_name || "Provider"}</div>
                          <Link to={`/professional-profile/${review.provider_id}`} className="text-xs text-indigo-600 hover:underline font-medium">View Profile</Link>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{review.created_at || ""}</div>
                    </div>
                    
                    <div className="flex-1">
                      {editingId === review.id ? (
                        <div className="space-y-3">
                          <select value={editRating} onChange={e => setEditRating(Number(e.target.value))} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium">
                            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n>1?'s':''}</option>)}
                          </select>
                          <textarea value={editComment} onChange={e => setEditComment(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium resize-y min-h-[80px]" />
                          <div className="flex gap-2">
                            <button onClick={() => handleEditSave(review.id)} className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg">Save</button>
                            <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-slate-100 text-slate-600 font-bold text-xs rounded-lg">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex text-amber-400 text-sm mb-3">
                            {Array.from({ length: review.rating || 0 }).map((_, i) => (
                              <i key={i} className="lnr lnr-star font-bold"></i>
                            ))}
                          </div>
                          <p className="text-slate-600 font-medium text-sm leading-relaxed mb-4">
                            "{review.comment}"
                          </p>
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingId(review.id); setEditComment(review.comment); setEditRating(review.rating); }} className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1">
                              <i className="lnr lnr-pencil"></i> Edit
                            </button>
                            <span className="text-slate-300">•</span>
                            <button onClick={() => handleDelete(review.id)} className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1">
                              <i className="lnr lnr-trash"></i> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SeekerLayout>
  );
}
