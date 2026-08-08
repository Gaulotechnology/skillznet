import { Link } from "react-router-dom"

export function TrustAndSafetyPage() {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Hero */}
      <section className="py-20 bg-white border-b border-[var(--border-color)]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">Trust & Safety</h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Your safety is our top priority. Learn how we keep the SkillzLink community secure for both professionals and clients.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 grid gap-8">

          {/* Pillar 1 */}
          <div className="bg-white rounded-2xl border border-[var(--border-color)] p-8 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 shrink-0 rounded-xl bg-[var(--accent-light)] text-[var(--accent-color)] flex items-center justify-center">
              <i className="lnr lnr-lock text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">Identity Verification</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Every professional on SkillzLink undergoes a rigorous identity verification process before they can offer services. We check national IDs, verify phone numbers, and ensure that the person you hire is exactly who they claim to be.
              </p>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li className="flex items-center gap-2"><i className="lnr lnr-checkmark-circle text-[var(--accent-color)]" /> National ID Verification</li>
                <li className="flex items-center gap-2"><i className="lnr lnr-checkmark-circle text-[var(--accent-color)]" /> Phone Number Authentication</li>
                <li className="flex items-center gap-2"><i className="lnr lnr-checkmark-circle text-[var(--accent-color)]" /> Profile Photo Matching</li>
              </ul>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-2xl border border-[var(--border-color)] p-8 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 shrink-0 rounded-xl bg-[var(--accent-light)] text-[var(--accent-color)] flex items-center justify-center">
              <i className="lnr lnr-star text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">Reviews & Ratings</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Accountability is built into our platform. After every job, clients are encouraged to leave honest feedback. This transparent review system helps maintain high standards and empowers you to make informed decisions based on the experiences of others in your community.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-2xl border border-[var(--border-color)] p-8 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 shrink-0 rounded-xl bg-[var(--accent-light)] text-[var(--accent-color)] flex items-center justify-center">
              <i className="lnr lnr-flag text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">Reporting & Moderation</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                If something doesn't feel right, we want to know. Our 24/7 moderation team actively monitors reports of suspicious behavior, poor service, or policy violations. We take swift action, including suspending or permanently banning accounts that violate our community standards.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 text-[var(--accent-color)] font-semibold hover:underline">
                Contact our support team <i className="lnr lnr-arrow-right" />
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
