import { Navigate, Route, Routes } from "react-router-dom"
import type { ReactNode } from "react"
import App from "./App"
import { MainLayout } from "./layouts/MainLayout"
import { ProtectedRoute } from "./components/common/ProtectedRoute"
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
import { DashboardManageRequestsPage } from './pages/dashboard/seeker/DashboardManageRequestsPage';
import { DashboardPostRequestPage } from './pages/dashboard/seeker/DashboardPostRequestPage';
import { DashboardSeekerOverviewPage } from './pages/dashboard/seeker/DashboardSeekerOverviewPage';
import { DashboardMyBookingsPage } from './pages/dashboard/seeker/DashboardMyBookingsPage';
import { DashboardBillingPage } from './pages/dashboard/seeker/DashboardBillingPage';
import { DashboardReviewsPage } from './pages/dashboard/seeker/DashboardReviewsPage';
import { SeekerMessagesPage } from './pages/dashboard/seeker/SeekerMessagesPage';
import { SeekerSettingsPage } from './pages/dashboard/seeker/SeekerSettingsPage';
import { SeekerSavedItemsPage } from './pages/dashboard/seeker/SeekerSavedItemsPage';
import { DashboardQuotesPage } from './pages/dashboard/provider/DashboardQuotesPage';
import { DashboardOngoingServicePage } from './pages/dashboard/provider/DashboardOngoingServicePage';
import { DashboardOngoingServiceSinglePage } from './pages/dashboard/provider/DashboardOngoingServiceSinglePage';
import { DashboardCompleteServicesPage } from './pages/dashboard/provider/DashboardCompleteServicesPage';
import { DashboardCancelServicesPage } from './pages/dashboard/provider/DashboardCancelServicesPage';
import { DashboardInsightsUserPage } from './pages/dashboard/provider/DashboardInsightsUserPage';
import { DashboardSubscriptionPage } from './pages/dashboard/provider/DashboardSubscriptionPage';
import { DashboardProviderOverviewPage } from './pages/dashboard/provider/DashboardProviderOverviewPage';
import { DashboardAvailabilityPage } from './pages/dashboard/provider/DashboardAvailabilityPage';
import { DashboardBookingsPage } from './pages/dashboard/provider/DashboardBookingsPage';
import { DashboardProviderMessagesPage } from './pages/dashboard/provider/DashboardProviderMessagesPage';
import { DashboardAdminOverviewPage } from './pages/dashboard/admin/DashboardAdminOverviewPage';
import { DashboardCategoryPage } from './pages/dashboard/admin/DashboardCategoryPage';
import { DashboardKnowledgeBasePage } from './pages/dashboard/admin/DashboardKnowledgeBasePage';
import { DashboardThemeSettingsPage } from './pages/dashboard/admin/DashboardThemeSettingsPage';
import { DashboardFormBuilderPage } from './pages/dashboard/admin/DashboardFormBuilderPage';
import { DashboardApiLogsPage } from './pages/dashboard/admin/DashboardApiLogsPage';
import { DashboardPackagesPage } from './pages/dashboard/admin/DashboardPackagesPage';
import { DashboardUsersPage } from './pages/dashboard/admin/DashboardUsersPage';
import { DashboardProfessionalsPage } from './pages/dashboard/admin/DashboardProfessionalsPage';
import { DashboardSeekersPage } from './pages/dashboard/admin/DashboardSeekersPage';
import { AdminUserDetailsPage } from './pages/dashboard/admin/AdminUserDetailsPage';
import { AdminProviderDetailsPage } from './pages/dashboard/admin/AdminProviderDetailsPage';
import { DashboardInsightsPage } from './pages/dashboard/admin/DashboardInsightsPage';
import { DashboardRolesPage } from './pages/dashboard/admin/DashboardRolesPage';
import { DashboardEmployeesPage } from './pages/dashboard/admin/DashboardEmployeesPage';
import { DashboardAdminConversationsPage } from './pages/dashboard/admin/DashboardAdminConversationsPage';
import { DashboardAgentsPage } from './pages/dashboard/admin/DashboardAgentsPage';
import { DashboardAffiliatesPage } from './pages/dashboard/admin/DashboardAffiliatesPage';
import { DashboardInvitationsPage } from './pages/dashboard/admin/DashboardInvitationsPage';
import { ApplyPage } from './pages/ApplyPage';
import { DashboardMatchingPage } from './pages/dashboard/admin/DashboardMatchingPage';
import { DashboardAppointmentsPage } from './pages/dashboard/admin/DashboardAppointmentsPage';
import { DashboardPaymentsPage } from './pages/dashboard/admin/DashboardPaymentsPage';
import { DashboardSmsLogsPage } from './pages/dashboard/admin/DashboardSmsLogsPage';
import { DashboardCommLogsPage } from './pages/dashboard/admin/DashboardCommLogsPage';
import { DashboardLiveChatPage } from './pages/dashboard/admin/DashboardLiveChatPage';

import { DashboardAgentOverviewPage } from './pages/dashboard/agent/DashboardAgentOverviewPage';
import { DashboardAgentReferralsPage } from './pages/dashboard/agent/DashboardAgentReferralsPage';
import { DashboardAgentCommissionsPage } from './pages/dashboard/agent/DashboardAgentCommissionsPage';
import { DashboardAffiliateOverviewPage } from './pages/dashboard/affiliate/DashboardAffiliateOverviewPage';
import { DashboardAffiliateLinksPage } from './pages/dashboard/affiliate/DashboardAffiliateLinksPage';
import { DashboardAffiliatePayoutsPage } from './pages/dashboard/affiliate/DashboardAffiliatePayoutsPage';
import { ServiceListingPage } from './pages/ServiceListingPage';
import { ServiceQuotePage } from './pages/ServiceQuotePage';
import { ServiceSinglePage } from "./pages/ServiceSinglePage"
import { JoinRedirect } from "./pages/JoinRedirect"
import { NotFoundPage } from "./pages/NotFoundPage"

import { TrustAndSafetyPage } from "./pages/TrustAndSafetyPage"
import { TermsAndConditionsPage } from "./pages/TermsAndConditionsPage"
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage"
import { NewsPage } from "./pages/NewsPage"
import { CareersPage } from "./pages/CareersPage"

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

      <Route path="/privacy-policy" element={withLayout(<PrivacyPolicyPage />)} />

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

      <Route path="/careers" element={withLayout(<CareersPage />)} />
      <Route path="/terms-and-conditions" element={withLayout(<TermsAndConditionsPage />)} />
      <Route path="/trust-and-safety" element={withLayout(<TrustAndSafetyPage />)} />
      <Route path="/plumbers" element={withLayout(<InfoPage title="Plumbers Near You" breadcrumb="Plumbers" subtitle="Find Local Plumbers in Zimbabwe" sections={[{ heading: "Plumbing Services", content: ["Emergency repairs, installations, drainage, and maintenance professionals near your city."] }]} quickLinks={quickLinks} />)} />
      <Route path="/electricians" element={withLayout(<InfoPage title="Electricians Near You" breadcrumb="Electricians" subtitle="Find Trusted Electricians" sections={[{ heading: "Electrical Services", content: ["Residential and commercial electrical professionals for safe, reliable work."] }]} quickLinks={quickLinks} />)} />
      <Route path="/cleaners" element={withLayout(<InfoPage title="Cleaners Near You" breadcrumb="Cleaners" subtitle="Find Reliable Cleaning Professionals" sections={[{ heading: "Cleaning Services", content: ["Home and office cleaning support from experienced local providers."] }]} quickLinks={quickLinks} />)} />
      <Route path="/tutors" element={withLayout(<InfoPage title="Tutors Near You" breadcrumb="Tutors" subtitle="Find Qualified Tutors" sections={[{ heading: "Tutoring Services", content: ["Academic and skills tutoring professionals for children, youth, and adults."] }]} quickLinks={quickLinks} />)} />
      <Route path="/find-professionals" element={<Navigate to="/nearby-professionals" replace />} />
      <Route path="/news" element={withLayout(<NewsPage />)} />

      <Route path="/apply" element={<ApplyPage />} />
      <Route path="/login" element={withLayout(<LoginPage />)} />
      <Route path="/register" element={withLayout(<RegisterPage />)} />
      <Route path="/register-provider" element={<Navigate to="/register" replace />} />
      <Route path="/join/:code" element={<JoinRedirect />} />
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

      {/* ─── Protected Dashboard Routes ─────────────────────────────────────── */}
      <Route path="/dashboard/admin" element={<Navigate to="/dashboard/admin/overview" replace />} />
      <Route path="/dashboard/provider" element={<Navigate to="/dashboard/provider/overview" replace />} />
      <Route path="/dashboard/seeker" element={<Navigate to="/dashboard/seeker/overview" replace />} />
      <Route path="/dashboard/agent" element={<Navigate to="/dashboard/agent/overview" replace />} />
      <Route path="/dashboard/affiliate" element={<Navigate to="/dashboard/affiliate/overview" replace />} />

      <Route path="/dashboard-profile" element={<ProtectedRoute><DashboardProfilePage /></ProtectedRoute>} />
      <Route path="/dashboard/profile" element={<ProtectedRoute><DashboardProfilePage /></ProtectedRoute>} />
      <Route path="/dashboard/settings" element={<ProtectedRoute><DashboardAccountSettingsPage /></ProtectedRoute>} />
      <Route path="/dashboard/help" element={<ProtectedRoute><DashboardHelpSupportPage /></ProtectedRoute>} />
      <Route path="/dashboard/help-support" element={<ProtectedRoute><DashboardHelpSupportPage /></ProtectedRoute>} />
      <Route path="/dashboard/messages" element={<ProtectedRoute><SeekerMessagesPage /></ProtectedRoute>} />
      <Route path="/dashboard/saved" element={<ProtectedRoute><SeekerSavedItemsPage /></ProtectedRoute>} />

      {/* Dashboard: Seekers (using MainLayout and inner SeekerLayout) */}
      <Route path="/dashboard/seeker/overview" element={<ProtectedRoute>{withLayout(<DashboardSeekerOverviewPage />)}</ProtectedRoute>} />
      <Route path="/dashboard/seeker/bookings" element={<ProtectedRoute>{withLayout(<DashboardMyBookingsPage />)}</ProtectedRoute>} />
      <Route path="/dashboard/seeker/manage-requests" element={<ProtectedRoute>{withLayout(<DashboardManageRequestsPage />)}</ProtectedRoute>} />
      <Route path="/dashboard/seeker/post-request" element={<ProtectedRoute>{withLayout(<DashboardPostRequestPage />)}</ProtectedRoute>} />
      <Route path="/dashboard/seeker/billing" element={<ProtectedRoute>{withLayout(<DashboardBillingPage />)}</ProtectedRoute>} />
      <Route path="/dashboard/seeker/reviews" element={<ProtectedRoute>{withLayout(<DashboardReviewsPage />)}</ProtectedRoute>} />
      <Route path="/dashboard/seeker/messages" element={<ProtectedRoute>{withLayout(<SeekerMessagesPage />)}</ProtectedRoute>} />
      <Route path="/dashboard/seeker/settings" element={<ProtectedRoute>{withLayout(<SeekerSettingsPage />)}</ProtectedRoute>} />
      <Route path="/dashboard/seeker/saved" element={<ProtectedRoute>{withLayout(<SeekerSavedItemsPage />)}</ProtectedRoute>} />

      {/* ─── Provider Dashboard Routes ────────────────────────────────────── */}
      <Route path="/dashboard/provider/overview" element={<ProtectedRoute><DashboardProviderOverviewPage /></ProtectedRoute>} />
      <Route path="/dashboard/insights" element={<ProtectedRoute><DashboardInsightsUserPage /></ProtectedRoute>} />
      <Route path="/dashboard/insights-user" element={<ProtectedRoute><DashboardInsightsUserPage /></ProtectedRoute>} />
      <Route path="/dashboard/subscription" element={<ProtectedRoute><DashboardSubscriptionPage /></ProtectedRoute>} />
      <Route path="/dashboard/ongoing-service" element={<ProtectedRoute><DashboardOngoingServicePage /></ProtectedRoute>} />
      <Route path="/dashboard/ongoing-single/:id" element={<ProtectedRoute><DashboardOngoingServiceSinglePage /></ProtectedRoute>} />
      <Route path="/dashboard/completed-services" element={<ProtectedRoute><DashboardCompleteServicesPage /></ProtectedRoute>} />
      <Route path="/dashboard/cancelled-services" element={<ProtectedRoute><DashboardCancelServicesPage /></ProtectedRoute>} />
      <Route path="/dashboard/quotes" element={<ProtectedRoute><DashboardQuotesPage /></ProtectedRoute>} />
      <Route path="/dashboard/provider/availability" element={<ProtectedRoute><DashboardAvailabilityPage /></ProtectedRoute>} />
      <Route path="/dashboard/provider/bookings" element={<ProtectedRoute><DashboardBookingsPage /></ProtectedRoute>} />
      <Route path="/dashboard/provider/messages" element={<ProtectedRoute><DashboardProviderMessagesPage /></ProtectedRoute>} />

      {/* ─── Admin Dashboard Routes ───────────────────────────────────────── */}
      <Route path="/dashboard/agent/overview" element={<ProtectedRoute><DashboardAgentOverviewPage /></ProtectedRoute>} />
      <Route path="/dashboard/agent/referrals" element={<ProtectedRoute><DashboardAgentReferralsPage /></ProtectedRoute>} />
      <Route path="/dashboard/agent/commissions" element={<ProtectedRoute><DashboardAgentCommissionsPage /></ProtectedRoute>} />
      
      <Route path="/dashboard/affiliate/overview" element={<ProtectedRoute><DashboardAffiliateOverviewPage /></ProtectedRoute>} />
      <Route path="/dashboard/affiliate/links" element={<ProtectedRoute><DashboardAffiliateLinksPage /></ProtectedRoute>} />
      <Route path="/dashboard/affiliate/payouts" element={<ProtectedRoute><DashboardAffiliatePayoutsPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/overview" element={<ProtectedRoute><DashboardAdminOverviewPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/users" element={<ProtectedRoute><DashboardUsersPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/users/:id" element={<ProtectedRoute><AdminUserDetailsPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/professionals" element={<ProtectedRoute><DashboardProfessionalsPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/professionals/:id" element={<ProtectedRoute><AdminProviderDetailsPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/seekers" element={<ProtectedRoute><DashboardSeekersPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/seekers/:id" element={<ProtectedRoute><AdminUserDetailsPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/theme-settings" element={<ProtectedRoute><DashboardThemeSettingsPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/form-builder" element={<ProtectedRoute><DashboardFormBuilderPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/api-logs" element={<ProtectedRoute><DashboardApiLogsPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/categories" element={<ProtectedRoute><DashboardCategoryPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/knowledge-base" element={<ProtectedRoute><DashboardKnowledgeBasePage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/insights" element={<ProtectedRoute><DashboardInsightsPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/packages" element={<ProtectedRoute><DashboardPackagesPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/roles" element={<ProtectedRoute><DashboardRolesPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/employees" element={<ProtectedRoute><DashboardEmployeesPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/conversations" element={<ProtectedRoute><DashboardAdminConversationsPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/agents" element={<ProtectedRoute><DashboardAgentsPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/agents/:id" element={<ProtectedRoute><AdminUserDetailsPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/affiliates" element={<ProtectedRoute><DashboardAffiliatesPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/affiliates/:id" element={<ProtectedRoute><AdminUserDetailsPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/matching" element={<ProtectedRoute><DashboardMatchingPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/invitations" element={<ProtectedRoute><DashboardInvitationsPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/appointments" element={<ProtectedRoute><DashboardAppointmentsPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/payments" element={<ProtectedRoute><DashboardPaymentsPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/sms-logs" element={<ProtectedRoute><DashboardSmsLogsPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/comm-logs" element={<ProtectedRoute><DashboardCommLogsPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin/live-chat" element={<ProtectedRoute><DashboardLiveChatPage /></ProtectedRoute>} />
      <Route path="/dashboard/packages" element={<ProtectedRoute><DashboardPackagesPage /></ProtectedRoute>} />

      <Route path="*" element={withLayout(<NotFoundPage />)} />
    </Routes>
  )
}
