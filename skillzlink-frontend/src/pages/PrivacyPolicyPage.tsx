import { Link } from "react-router-dom"

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-slate-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-slate-900 to-slate-900" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Privacy Policy</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            How we collect, use, and protect your personal information.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-4xl mx-auto p-8 md:p-12">
          
          <div className="prose prose-slate prose-indigo max-w-none">
            <h2>Our Commitment to Privacy</h2>
            <p>
              At SkillzLink, we take your privacy seriously. We are committed to protecting your personal data with strong storage controls, role-based access, and industry-standard security measures.
            </p>

            <h2>Information We Collect</h2>
            <ul>
              <li><strong>Personal Information:</strong> Name, phone number, email address, and national ID (for providers).</li>
              <li><strong>Usage Data:</strong> Search queries, interactions, and contact reveals to improve platform safety and quality.</li>
              <li><strong>Location Data:</strong> Your city and approximate location to connect you with nearby professionals.</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>
              We use the collected information to:
            </p>
            <ul>
              <li>Verify the identity of service providers.</li>
              <li>Facilitate connections between seekers and providers.</li>
              <li>Prevent fraud, monitor quality, and enforce our Trust & Safety policies.</li>
              <li>Provide customer support and resolve disputes.</li>
            </ul>

            <h2>Data Sharing and Disclosure</h2>
            <p>
              We do not sell your personal information to third parties. We only share necessary details (such as your phone number) when you explicitly choose to reveal contact information or connect with a professional. We may also disclose information if required by Zimbabwean law.
            </p>

            <h2>Your Rights</h2>
            <p>
              You have the right to access, update, or request the deletion of your personal data at any time. You can manage your information through your account settings or by contacting our support team.
            </p>

            <hr className="my-8 border-slate-200" />
            
            <p className="text-sm text-slate-500">
              For privacy-related inquiries, please contact our Data Protection Officer via our <Link to="/about" className="text-indigo-600 font-semibold hover:underline">Support Page</Link>.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
