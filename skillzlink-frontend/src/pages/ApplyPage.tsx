import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:18080/api';

export function ApplyPage() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'affiliate',
    company: '',
    experience: '0-1',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam && ['affiliate', 'agent', 'provider'].includes(typeParam)) {
      setFormData((prev) => ({ ...prev, type: typeParam }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Submission failed');
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900">SkillzLink</Link>
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition">← Back to Home</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-12">
        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <div className="text-green-600 text-4xl mb-4">✓</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-600">We'll review and get back to you within 48 hours.</p>
            <Link to="/" className="mt-6 inline-block text-sm font-medium text-green-700 hover:text-green-800">
              Return to Home
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Apply to Join SkillzLink</h1>
            <p className="text-sm text-gray-500 mb-6">Fill in the form below to apply as an affiliate, agent, or provider.</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" name="phone" placeholder="+27..." value={formData.phone} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Type</label>
                <select name="type" value={formData.type} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-white">
                  <option value="affiliate">Affiliate</option>
                  <option value="agent">Agent</option>
                  <option value="provider">Provider</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company/Business Name</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <select name="experience" value={formData.experience} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-white">
                  <option value="0-1">0–1 years</option>
                  <option value="1-3">1–3 years</option>
                  <option value="3-5">3–5 years</option>
                  <option value="5-10">5–10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Why do you want to join?</label>
                <textarea name="message" rows={4} value={formData.message} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none resize-none" />
              </div>

              <button type="submit" disabled={submitting}
                className="w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50">
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
