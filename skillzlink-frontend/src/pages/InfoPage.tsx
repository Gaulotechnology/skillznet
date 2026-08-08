import { Link } from "react-router-dom"

interface InfoPageProps {
  title: string
  breadcrumb: string
  subtitle: string
  sections: Array<{
    heading: string
    content: string[]
  }>
  quickLinks?: Array<{
    label: string
    to: string
  }>
}

export function InfoPage({ title, breadcrumb, subtitle, sections, quickLinks = [] }: InfoPageProps) {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Hero */}
      <section className="py-20 bg-white border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">{title}</h1>
          <nav className="text-sm text-[var(--text-secondary)]">
            <Link to="/" className="hover:text-[var(--accent-color)]">Home</Link>
            <span className="mx-2">/</span>
            <span>{breadcrumb}</span>
          </nav>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-[var(--border-color)] p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">{subtitle}</h2>
                <div className="space-y-8">
                  {sections.map((section) => (
                    <div key={section.heading}>
                      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">{section.heading}</h3>
                      <div className="space-y-3">
                        {section.content.map((paragraph) => (
                          <p key={paragraph} className="text-[var(--text-secondary)] leading-relaxed">{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {quickLinks.length > 0 && (
              <div>
                <div className="bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm sticky top-8">
                  <h3 className="text-base font-bold text-[var(--text-primary)] mb-4">Quick Navigation</h3>
                  <ul className="space-y-2">
                    {quickLinks.map((link) => (
                      <li key={link.to}>
                        <Link to={link.to} className="text-[var(--accent-color)] hover:underline text-sm font-medium">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
