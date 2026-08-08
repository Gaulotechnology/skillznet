import { Link } from "react-router-dom"

const TEAM = [
  {
    name: "Tinashe Moyo",
    role: "Co-Founder & CEO",
    bio: "Harare native passionate about closing the skills gap in Zimbabwe. Former software engineer turned entrepreneur.",
    img: "/images/team/team-tinashe.jpg",
  },
  {
    name: "Chipo Ndlovu",
    role: "Head of Marketing",
    bio: "Brand strategist with 6 years experience in Zimbabwean digital markets. Leads growth and community.",
    img: "/images/team/team-chipo.jpg",
  },
  {
    name: "Tafadzwa Chigumba",
    role: "Lead Engineer",
    bio: "Full-stack developer from Bulawayo building the technology that powers SkillzLink's WhatsApp integrations.",
    img: "/images/team/team-tafadzwa.jpg",
  },
  {
    name: "Rudo Makoni",
    role: "Head of Operations",
    bio: "Operations expert ensuring every professional on SkillzLink is vetted, verified, and ready to serve Zimbabwe.",
    img: "/images/team/team-rudo.jpg",
  },
]

const VALUES = [
  { icon: "lnr lnr-shield", title: "Trust & Verification", desc: "Every professional is background-checked and ID-verified before joining the platform." },
  { icon: "lnr lnr-map-marker", title: "Proudly Zimbabwean", desc: "Built in Harare for Zimbabwe — we understand local needs, culture, and challenges." },
  { icon: "fab fa-whatsapp", title: "WhatsApp-First", desc: "No extra apps. Hire professionals directly through WhatsApp — where Zimbabwe already connects." },
  { icon: "lnr lnr-star", title: "Quality Always", desc: "Transparent reviews and star ratings keep standards high and professionals accountable." },
]

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Hero */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">About SkillzLink</h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Connecting Zimbabwe's talent with the people who need it most.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Connecting Zimbabwe's Talent</h2>
              <p className="text-[var(--accent-color)] font-medium mb-6">Empowering Local Professionals Since 2024</p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                SkillzLink was born in Harare with a simple mission: make it easy for Zimbabweans to find
                trusted, local professionals — and for those professionals to grow their income. Whether you
                need a plumber in Borrowdale or a tutor in Chitungwiza, we connect you in minutes via WhatsApp.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We are building Zimbabwe's first WhatsApp-integrated services marketplace — no app downloads,
                no complicated sign-ups. Just message, hire, and get the job done.
              </p>

              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm text-center">
                  <h3 className="text-2xl font-bold text-[var(--text-primary)]">2,400+</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Verified Pros</p>
                </div>
                <div className="bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm text-center">
                  <h3 className="text-2xl font-bold text-[var(--text-primary)]">8</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Cities Covered</p>
                </div>
                <div className="bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm text-center">
                  <h3 className="text-2xl font-bold text-[var(--text-primary)]">98%</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Satisfaction Rate</p>
                </div>
              </div>
            </div>
            <div>
              <img
                src="/images/about-hero.jpg"
                alt="Zimbabwean professional plumber on a job in Harare"
                className="w-full rounded-2xl object-cover shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Our Values</h2>
            <p className="text-[var(--text-secondary)]">What Drives Every Decision We Make</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(v => (
              <div key={v.title} className="bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm text-center">
                <i className={v.icon + " text-3xl text-[var(--accent-color)] mb-4 block"} />
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">{v.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Meet the Team</h2>
            <p className="text-[var(--text-secondary)]">The Zimbabweans Building SkillzLink</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map(member => (
              <div key={member.name} className="bg-white rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-56 object-cover object-top"
                />
                <div className="p-5 text-center">
                  <h3 className="text-base font-bold text-[var(--text-primary)]">{member.name}</h3>
                  <span className="text-sm font-semibold text-[var(--accent-color)] block mt-1 mb-2">{member.role}</span>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--accent-color)]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            Ready to Join Zimbabwe's #1 Skills Platform?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Whether you're a homeowner needing help or a skilled professional seeking clients — SkillzLink is for you.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/register" className="bg-white text-[var(--accent-color)] hover:bg-gray-100 rounded-xl px-6 py-3 font-semibold transition">
              Join as a Professional
            </Link>
            <Link to="/nearby-professionals" className="bg-white/20 text-white border-2 border-white/50 hover:bg-white/30 rounded-xl px-6 py-3 font-semibold transition">
              Find a Professional
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
