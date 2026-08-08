import { Link } from "react-router-dom"

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Hero */}
      <section className="py-20 bg-white border-b border-[var(--border-color)]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">Privacy Policy</h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            How we collect, use, and protect your personal information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-[var(--border-color)] p-8 md:p-12 shadow-sm">
            <div className="prose max-w-none text-[var(--text-secondary)] leading-relaxed">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Our Commitment to Privacy</h2>
              <p>
                At SkillzLink, we take your privacy seriously. We are committed to protecting your personal data with strong storage controls, role-based access, and industry-standard security measures.
              </p>

              <h2 className="text-xl font-bold text-[var(--text-primary)] mt-8">Information We Collect</h2>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Personal Information:</strong> Name, phone number, email address, and national ID (for providers).</li>
                <li><strong>Usage Data:</strong> Search queries, interactions, and contact reveals to improve platform safety and quality.</li>
                <li><strong>Location Data:</strong> Your city and approximate location to connect you with nearby professionals.</li>
              </ul>

              <h2 className="text-xl font-bold text-[var(--text-primary)] mt-8">How We Use Your Information</h2>
              <p>We use the collected information to:</p>
              <ul className="space-y-2 list-disc pl-5">
                <li>Verify the identity of service providers.</li>
                <li>Facilitate connections between seekers and providers.</li>
                <li>Prevent fraud, monitor quality, and enforce our Trust & Safety policies.</li>
                <li>Provide customer support and resolve disputes.</li>
              </ul>

              <h2 className="text-xl font-bold text-[var(--text-primary)] mt-8">Data Sharing and Disclosure</h2>
              <p>
                We do not sell your personal information to third parties. We only share necessary details (such as your phone number) when you explicitly choose to reveal contact information or connect with a professional. We may also disclose information if required by Zimbabwean law.
              </p>

              <h2 className="text-xl font-bold text-[var(--text-primary)] mt-8">Your Rights</h2>
              <p>
                You have the right to access, update, or request the deletion of your personal data at any time. You can manage your information through your account settings or by contacting our support team.
              </p>

              <hr className="my-8 border-[var(--border-color)]" />

              <p className="text-sm text-[var(--text-secondary)]">
                For privacy-related inquiries, please contact our Data Protection Officer via our <Link to="/about" className="text-[var(--accent-color)] font-semibold hover:underline">Support Page</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
