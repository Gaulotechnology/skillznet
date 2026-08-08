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
  const [editingId, setEditingId] = useState<number | null>(null);
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
      await seekerApi.createReview({ ...formData, provider_id: Number(formData.provider_id) });
      setShowForm(false);
      setFormData({ provider_id: "", rating: 5, comment: "" });
      loadReviews();
    } catch {}
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await seekerApi.deleteReview(id);
      loadReviews();
    } catch {}
  };

  const handleEditSave = async (id: number) => {
    try {
      await seekerApi.updateReview(id, { rating: editRating, comment: editComment });
      setEditingId(null);
      loadReviews();
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
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 font-['Inter',sans-serif]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">My Reviews</h2>
            <p className="text-[var(--text-secondary)] font-medium mt-1">Manage feedback you've left for professionals.</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-semibold rounded-xl transition-colors active:scale-95">
            Leave Review
          </button>
        </div>

        {/* Create Review Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-[var(--border-color)] p-6 md:p-8">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Write a New Review</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Provider ID</label>
                <input type="text" required value={formData.provider_id} onChange={e => setFormData(p => ({ ...p, provider_id: e.target.value }))} className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all font-medium text-[var(--text-primary)]" placeholder="Enter provider ID" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Rating (1-5)</label>
                <select value={formData.rating} onChange={e => setFormData(p => ({ ...p, rating: Number(e.target.value) }))} className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all font-medium text-[var(--text-primary)] appearance-none">
                  {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n>1?'s':''}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Comment</label>
                <textarea required value={formData.comment} onChange={e => setFormData(p => ({ ...p, comment: e.target.value }))} className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none transition-all font-medium text-[var(--text-primary)] resize-y min-h-[100px]" placeholder="Share your experience..." />
              </div>
              <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-[var(--accent-color)] text-white font-semibold rounded-xl transition-colors hover:bg-[var(--accent-hover)] active:scale-95">
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}

        {/* Past Reviews List */}
        <div className="bg-white rounded-2xl border border-[var(--border-color)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border-color)]">
            <h3 className="font-bold text-lg text-[var(--text-primary)]">Past Reviews</h3>
          </div>
          
          {reviews.length === 0 ? (
            <div className="p-12 text-center text-[var(--text-secondary)]">
              <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-4 text-[var(--text-secondary)]">
                <i className="lnr lnr-star text-2xl"></i>
              </div>
              <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">No reviews yet</h4>
              <p className="text-sm">You haven't left any reviews yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-color)]">
              {reviews.map((review: any) => (
                <div key={review.id} className="p-6 md:p-8 hover:bg-[var(--bg-secondary)] transition-colors">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-64 shrink-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent-light)] flex items-center justify-center font-bold text-[var(--accent-color)]">
                          {(review.provider_name || "P")[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-[var(--text-primary)] text-sm">{review.provider_name || "Provider"}</div>
                          <Link to={`/professional-profile/${review.provider_id}`} className="text-xs text-[var(--accent-color)] hover:underline font-medium">View Profile</Link>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{review.created_at || ""}</div>
                    </div>
                    
                    <div className="flex-1">
                      {editingId === review.id ? (
                        <div className="space-y-3">
                          <select value={editRating} onChange={e => setEditRating(Number(e.target.value))} className="px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm font-medium">
                            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n>1?'s':''}</option>)}
                          </select>
                          <textarea value={editComment} onChange={e => setEditComment(e.target.value)} className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm font-medium resize-y min-h-[80px]" />
                          <div className="flex gap-2">
                            <button onClick={() => handleEditSave(review.id)} className="px-5 py-2.5 bg-[var(--accent-color)] text-white font-semibold text-xs rounded-xl">Save</button>
                            <button onClick={() => setEditingId(null)} className="px-5 py-2.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] font-semibold text-xs rounded-xl">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex text-amber-400 text-sm mb-3">
                            {Array.from({ length: review.rating || 0 }).map((_, i) => (
                              <i key={i} className="lnr lnr-star font-bold"></i>
                            ))}
                          </div>
                          <p className="text-[var(--text-secondary)] font-medium text-sm leading-relaxed mb-4">
                            "{review.comment}"
                          </p>
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingId(review.id); setEditComment(review.comment); setEditRating(review.rating); }} className="text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors flex items-center gap-1">
                              <i className="lnr lnr-pencil"></i> Edit
                            </button>
                            <span className="text-[var(--border-color)]">•</span>
                            <button onClick={() => handleDelete(review.id)} className="text-xs font-bold text-[var(--text-secondary)] hover:text-red-600 transition-colors flex items-center gap-1">
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
