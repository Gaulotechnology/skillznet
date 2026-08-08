import { Link } from "react-router-dom"

export function NewsPage() {
  const newsItems = [
    {
      id: 1,
      title: "SkillzLink Expands to Mutare and Gweru",
      category: "Company News",
      date: "August 5, 2026",
      excerpt: "We are thrilled to announce that SkillzLink is now officially available in Mutare and Gweru, bringing trusted professionals to more communities across Zimbabwe.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      title: "New Identity Verification Process Launched",
      category: "Trust & Safety",
      date: "July 28, 2026",
      excerpt: "To further enhance the safety of our marketplace, we have rolled out a new, streamlined identity verification process for all service providers.",
      image: "https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 3,
      title: "Meet Our Top Performing Plumbers of 2026",
      category: "Community Spotlight",
      date: "July 15, 2026",
      excerpt: "We are highlighting the incredible work of our top-rated plumbers who have consistently delivered 5-star service to their clients this year.",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800",
    }
  ]

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Hero */}
      <section className="py-20 bg-white border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">Latest News</h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Stay updated with the latest announcements, platform updates, and community stories from SkillzLink.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm flex flex-col group hover:-translate-y-1 transition-all duration-300">
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[var(--text-primary)]">
                    {item.category}
                  </div>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-sm text-[var(--text-secondary)] font-medium mb-3">{item.date}</div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3 line-clamp-2 group-hover:text-[var(--accent-color)] transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-[var(--text-secondary)] leading-relaxed mb-6 line-clamp-3 text-sm">
                    {item.excerpt}
                  </p>
                  <div className="mt-auto pt-4 border-t border-[var(--border-color)]">
                    <Link to="#" className="text-[var(--accent-color)] font-semibold hover:underline flex items-center gap-2 text-sm">
                      Read Full Story <i className="lnr lnr-arrow-right" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-[var(--text-secondary)]">More news coming soon.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
