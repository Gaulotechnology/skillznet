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
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Latest News</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Stay updated with the latest announcements, platform updates, and community stories from SkillzLink.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800">
                  {item.category}
                </div>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="text-sm text-slate-500 font-medium mb-3">{item.date}</div>
                <h2 className="text-xl font-bold text-slate-800 mb-4 line-clamp-2 group-hover:text-rose-600 transition-colors">
                  {item.title}
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6 line-clamp-3">
                  {item.excerpt}
                </p>
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <Link to="#" className="text-rose-600 font-semibold hover:text-rose-700 flex items-center gap-2">
                    Read Full Story <i className="lnr lnr-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-500">More news coming soon.</p>
        </div>
      </div>
    </div>
  )
}
