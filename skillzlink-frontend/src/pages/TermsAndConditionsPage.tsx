import { Link } from "react-router-dom"

export function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-slate-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Terms & Conditions</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Please read these terms carefully before using SkillzLink.
          </p>
          <p className="text-slate-400 mt-4 text-sm">Last updated: August 8, 2026</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-4xl mx-auto p-8 md:p-12">
          
          <div className="prose prose-slate prose-rose max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Welcome to SkillzLink. By accessing our platform, you agree to these Terms and Conditions. These terms govern your use of SkillzLink and the services provided by professionals on our platform.
            </p>

            <h2>2. User Responsibilities</h2>
            <p>
              Whether you are a Service Provider or a Service Seeker, you agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information during registration.</li>
              <li>Maintain the security of your account credentials.</li>
              <li>Communicate respectfully and professionally with other users.</li>
              <li>Use the platform only for lawful purposes.</li>
            </ul>

            <h2>3. Service Providers</h2>
            <p>
              Professionals offering services on SkillzLink must ensure that they hold the necessary qualifications, licenses, and permits required by Zimbabwean law. You are solely responsible for the quality and outcome of the services you provide.
            </p>

            <h2>4. Payments and Subscriptions</h2>
            <p>
              SkillzLink may charge subscription fees for providers to access premium features. These fees are non-refundable unless stated otherwise. Client-to-provider payments for services are handled outside of the platform, and SkillzLink is not responsible for payment disputes.
            </p>

            <h2>5. Prohibited Activities</h2>
            <p>
              Users must not engage in fraudulent activities, post misleading information, harass other users, or attempt to circumvent the platform's security measures. Violation of these terms will result in immediate account suspension.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              SkillzLink acts as a venue to connect service seekers with providers. We do not guarantee the quality, safety, or legality of the services advertised. Users engage with one another at their own risk.
            </p>

            <hr className="my-8 border-slate-200" />
            
            <p className="text-sm text-slate-500">
              If you have any questions about these Terms, please <Link to="/about" className="text-rose-600 font-semibold hover:underline">contact us</Link>.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
