import { Navigate, Route, Routes } from "react-router-dom"
import type { ReactNode } from "react"
import App from "./App"
import { MainLayout } from "./layouts/MainLayout"
import { InfoPage } from "./pages/InfoPage"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import { SearchPage } from "./pages/SearchPage"
import { ProfessionalsListingPage } from "./pages/ProfessionalsListingPage"
import { ProfessionalProfilePage } from "./pages/ProfessionalProfilePage"
import { AboutPage } from "./pages/AboutPage"
import { HowItWorksPage } from "./pages/HowItWorksPage"
import { DashboardProfilePage } from "./pages/dashboard/shared/DashboardProfilePage"
import { CompanyGridPage } from './pages/CompanyGridPage';
import { CompanySinglePage } from './pages/CompanySinglePage';
import { ArticleListPage } from './pages/ArticleListPage';
import { ArticleGridPage } from './pages/ArticleGridPage';
import { ArticleSinglePage } from './pages/ArticleSinglePage';
import { ArticleClassicPage } from './pages/ArticleClassicPage';
import { DashboardAccountSettingsPage } from './pages/dashboard/shared/DashboardAccountSettingsPage';
import { DashboardHelpSupportPage } from './pages/dashboard/shared/DashboardHelpSupportPage';
import { DashboardSaveItemsPage } from './pages/dashboard/shared/DashboardSaveItemsPage';
import { DashboardMessagesPage } from './pages/dashboard/shared/DashboardMessagesPage';
import { DashboardInvoicesPage } from './pages/dashboard/shared/DashboardInvoicesPage';
import { DashboardManageRequestsPage } from './pages/dashboard/customer/DashboardManageRequestsPage';
import { DashboardPostRequestPage } from './pages/dashboard/customer/DashboardPostRequestPage';
import { DashboardSeekerOverviewPage } from './pages/dashboard/customer/DashboardSeekerOverviewPage';
import { DashboardQuotesPage } from './pages/dashboard/provider/DashboardQuotesPage';
import { DashboardOngoingServicePage } from './pages/dashboard/provider/DashboardOngoingServicePage';
import { DashboardOngoingServiceSinglePage } from './pages/dashboard/provider/DashboardOngoingServiceSinglePage';
import { DashboardCompleteServicesPage } from './pages/dashboard/provider/DashboardCompleteServicesPage';
import { DashboardCancelServicesPage } from './pages/dashboard/provider/DashboardCancelServicesPage';
import { DashboardInsightsUserPage } from './pages/dashboard/provider/DashboardInsightsUserPage';
import { DashboardSubscriptionPage } from './pages/dashboard/provider/DashboardSubscriptionPage';
import { DashboardProviderOverviewPage } from './pages/dashboard/provider/DashboardProviderOverviewPage';
import { DashboardAdminOverviewPage } from './pages/dashboard/admin/DashboardAdminOverviewPage';
import { DashboardCategoryPage } from './pages/dashboard/admin/DashboardCategoryPage';
import { DashboardThemeSettingsPage } from './pages/dashboard/admin/DashboardThemeSettingsPage';
import { DashboardFormBuilderPage } from './pages/dashboard/admin/DashboardFormBuilderPage';
import { DashboardApiLogsPage } from './pages/dashboard/admin/DashboardApiLogsPage';
import { DashboardPackagesPage } from './pages/dashboard/admin/DashboardPackagesPage';
import { DashboardUsersPage } from './pages/dashboard/admin/DashboardUsersPage';
import { DashboardProfessionalsPage } from './pages/dashboard/admin/DashboardProfessionalsPage';
import { DashboardInsightsPage } from './pages/dashboard/admin/DashboardInsightsPage';
import { ServiceListingPage } from './pages/ServiceListingPage';
import { ServiceQuotePage } from './pages/ServiceQuotePage';
import { ServiceSinglePage } from "./pages/ServiceSinglePage"
import { NotFoundPage } from "./pages/NotFoundPage"

const quickLinks = [
  { label: "About Us", to: "/about" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Service Categories", to: "/service-categories" },
  { label: "Book a Professional", to: "/book-professional" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
]

function withLayout(element: ReactNode) {
  return <MainLayout>{element}</MainLayout>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={withLayout(<App />)} />
      <Route path="/about" element={withLayout(<AboutPage />)} />

      <Route path="/privacy-policy" element={withLayout(
        <InfoPage title="Privacy Policy" breadcrumb="Privacy Policy" subtitle="How We Protect Your Data"
          sections={[
            { heading: "Data Protection", content: ["We protect personal data with strong storage controls and role-based access.", "Sensitive provider details are masked where required and only shared through approved flows."] },
            { heading: "Usage Transparency", content: ["Search and contact interactions are logged for quality, safety, and fraud prevention.", "We align platform behavior with privacy and compliance principles applicable to Zimbabwean operations."] },
          ]} quickLinks={quickLinks} />
      )} />

      <Route path="/how-it-works" element={withLayout(<HowItWorksPage />)} />

      <Route path="/service-request" element={withLayout(
        <InfoPage title="Service Request" breadcrumb="Service Request" subtitle="Request the Right Professional"
          sections={[
            { heading: "Describe Your Need Clearly", content: ["Share your service category, city, and expected timeline to get relevant matches.", "Clear requests improve speed and quality of provider responses."] },
            { heading: "Track Responses", content: ["Review responses, compare providers, and continue through your preferred communication channel."] },
          ]} quickLinks={quickLinks} />
      )} />

      <Route path="/book-professional" element={withLayout(
        <InfoPage title="Book a Professional" breadcrumb="Book a Professional" subtitle="From Discovery to Booking"
          sections={[
            { heading: "Compare Before Booking", content: ["Use provider profiles, trust indicators, and service details to make informed decisions."] },
            { heading: "Book with Confidence", content: ["Choose the best-fit professional and proceed with direct contact and scheduling."] },
          ]} quickLinks={quickLinks} />
      )} />

      <Route path="/nearby-professionals" element={withLayout(<ProfessionalsListingPage />)} />
      <Route path="/professional-profile/:id" element={withLayout(<ProfessionalProfilePage />)} />

      <Route path="/careers" element={withLayout(<InfoPage title="Careers" breadcrumb="Careers" subtitle="Join the SkillzLink Team" sections={[{ heading: "Build Local Impact", content: ["We are building a trusted marketplace for real services across Zimbabwe.", "We welcome people who care about product quality, reliability, and community-first growth."] }]} quickLinks={quickLinks} />)} />
      <Route path="/terms-and-conditions" element={withLayout(<InfoPage title="Terms & Conditions" breadcrumb="Terms & Conditions" subtitle="Platform Rules and Responsibilities" sections={[{ heading: "Service Marketplace Terms", content: ["Users and providers must follow fair-use, lawful conduct, and respectful communication rules.", "Platform actions, subscriptions, and access may be restricted for abuse or policy violations."] }]} quickLinks={quickLinks} />)} />
      <Route path="/trust-and-safety" element={withLayout(<InfoPage title="Trust & Safety" breadcrumb="Trust & Safety" subtitle="Keeping SkillzLink Safe for Everyone" sections={[{ heading: "Provider and User Safety", content: ["Identity checks, reporting tools, and moderation workflows support a safer marketplace.", "Suspicious activity can be reported for administrative review and action."] }]} quickLinks={quickLinks} />)} />
      <Route path="/plumbers" element={withLayout(<InfoPage title="Plumbers Near You" breadcrumb="Plumbers" subtitle="Find Local Plumbers in Zimbabwe" sections={[{ heading: "Plumbing Services", content: ["Emergency repairs, installations, drainage, and maintenance professionals near your city."] }]} quickLinks={quickLinks} />)} />
      <Route path="/electricians" element={withLayout(<InfoPage title="Electricians Near You" breadcrumb="Electricians" subtitle="Find Trusted Electricians" sections={[{ heading: "Electrical Services", content: ["Residential and commercial electrical professionals for safe, reliable work."] }]} quickLinks={quickLinks} />)} />
      <Route path="/cleaners" element={withLayout(<InfoPage title="Cleaners Near You" breadcrumb="Cleaners" subtitle="Find Reliable Cleaning Professionals" sections={[{ heading: "Cleaning Services", content: ["Home and office cleaning support from experienced local providers."] }]} quickLinks={quickLinks} />)} />
      <Route path="/tutors" element={withLayout(<InfoPage title="Tutors Near You" breadcrumb="Tutors" subtitle="Find Qualified Tutors" sections={[{ heading: "Tutoring Services", content: ["Academic and skills tutoring professionals for children, youth, and adults."] }]} quickLinks={quickLinks} />)} />
      <Route path="/find-professionals" element={<Navigate to="/nearby-professionals" replace />} />
      <Route path="/news" element={withLayout(<InfoPage title="News" breadcrumb="News" subtitle="SkillzLink Product and Market Updates" sections={[{ heading: "Latest Updates", content: ["Follow platform releases, service expansion updates, and trust & safety improvements."] }]} quickLinks={quickLinks} />)} />

      <Route path="/login" element={withLayout(<LoginPage />)} />
      <Route path="/register" element={withLayout(<RegisterPage />)} />
      <Route path="/register-provider" element={<Navigate to="/register" replace />} />
      <Route path="/search" element={withLayout(<SearchPage />)} />
      <Route path="/services" element={<ServiceListingPage />} />
      <Route path="/service-quote" element={withLayout(<ServiceQuotePage />)} />
      <Route path="/companies" element={withLayout(<CompanyGridPage />)} />
      <Route path="/company-single" element={withLayout(<CompanySinglePage />)} />
      <Route path="/articles" element={withLayout(<ArticleListPage />)} />
      <Route path="/articles-grid" element={withLayout(<ArticleGridPage />)} />
      <Route path="/article-single" element={withLayout(<ArticleSinglePage />)} />
      <Route path="/articles-classic" element={withLayout(<ArticleClassicPage />)} />
      <Route path="/service/:id" element={withLayout(<ServiceSinglePage />)} />

      {/* ─── Shared Dashboard Routes ─────────────────────────────────────── */}
      <Route path="/dashboard-profile" element={<DashboardProfilePage />} />
      <Route path="/dashboard/profile" element={<DashboardProfilePage />} />
      <Route path="/dashboard/settings" element={<DashboardAccountSettingsPage />} />
      <Route path="/dashboard/help" element={<DashboardHelpSupportPage />} />
      <Route path="/dashboard/help-support" element={<DashboardHelpSupportPage />} />
      <Route path="/dashboard/saved" element={<DashboardSaveItemsPage />} />
      <Route path="/dashboard/saved-items" element={<DashboardSaveItemsPage />} />
      <Route path="/dashboard/messages" element={<DashboardMessagesPage />} />
      <Route path="/dashboard/invoices" element={<DashboardInvoicesPage />} />

      {/* ─── Seeker / Customer Dashboard Routes ──────────────────────────── */}
      <Route path="/dashboard/seeker/overview" element={<DashboardSeekerOverviewPage />} />
      <Route path="/dashboard/manage-requests" element={<DashboardManageRequestsPage />} />
      <Route path="/dashboard/post-request" element={<DashboardPostRequestPage />} />

      {/* ─── Provider Dashboard Routes ────────────────────────────────────── */}
      <Route path="/dashboard/provider/overview" element={<DashboardProviderOverviewPage />} />
      <Route path="/dashboard/insights" element={<DashboardInsightsUserPage />} />
      <Route path="/dashboard/insights-user" element={<DashboardInsightsUserPage />} />
      <Route path="/dashboard/subscription" element={<DashboardSubscriptionPage />} />
      <Route path="/dashboard/ongoing-service" element={<DashboardOngoingServicePage />} />
      <Route path="/dashboard/ongoing-single" element={<DashboardOngoingServiceSinglePage />} />
      <Route path="/dashboard/completed-services" element={<DashboardCompleteServicesPage />} />
      <Route path="/dashboard/cancelled-services" element={<DashboardCancelServicesPage />} />
      <Route path="/dashboard/quotes" element={<DashboardQuotesPage />} />

      {/* ─── Admin Dashboard Routes ───────────────────────────────────────── */}
      <Route path="/dashboard/admin/overview" element={<DashboardAdminOverviewPage />} />
      <Route path="/dashboard/admin/users" element={<DashboardUsersPage />} />
      <Route path="/dashboard/admin/professionals" element={<DashboardProfessionalsPage />} />
      <Route path="/dashboard/admin/theme-settings" element={<DashboardThemeSettingsPage />} />
      <Route path="/dashboard/admin/form-builder" element={<DashboardFormBuilderPage />} />
      <Route path="/dashboard/admin/api-logs" element={<DashboardApiLogsPage />} />
      <Route path="/dashboard/admin/categories" element={<DashboardCategoryPage />} />
      <Route path="/dashboard/admin/insights" element={<DashboardInsightsPage />} />
      <Route path="/dashboard/packages" element={<DashboardPackagesPage />} />

      <Route path="*" element={withLayout(<NotFoundPage />)} />
    </Routes>
  )
}
