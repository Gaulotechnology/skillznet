import { Link } from "react-router-dom"

export function SkillsFooter() {
  const sections = [
    {
      title: "By Services",
      links: [
        { name: "Plumber", to: "/nearby-professionals?service=plumbing" },
        { name: "Electrician", to: "/nearby-professionals?service=electrical" },
        { name: "Cleaner", to: "/nearby-professionals?service=cleaning" },
        { name: "Tutor", to: "/nearby-professionals?service=tutoring" },
        { name: "Carpenter", to: "/nearby-professionals?service=carpentry" },
        { name: "Painter", to: "/nearby-professionals?service=painting" },
        { name: "Gardener", to: "/nearby-professionals?service=gardening" },
        { name: "Appliance Repair", to: "/nearby-professionals?service=appliance-repair" },
      ]
    },
    {
      title: "Services In Zimbabwe",
      links: [
        { name: "Plumbers in Harare", to: "/nearby-professionals?service=plumbing&city=harare" },
        { name: "Electricians in Bulawayo", to: "/nearby-professionals?service=electrical&city=bulawayo" },
        { name: "Cleaners in Mutare", to: "/nearby-professionals?service=cleaning&city=mutare" },
        { name: "Tutors in Gweru", to: "/nearby-professionals?service=tutoring&city=gweru" },
        { name: "Carpenters in Masvingo", to: "/nearby-professionals?service=carpentry&city=masvingo" },
        { name: "Painters in Chinhoyi", to: "/nearby-professionals?service=painting&city=chinhoyi" },
        { name: "Gardeners in Kadoma", to: "/nearby-professionals?service=gardening&city=kadoma" },
        { name: "Repairs in Marondera", to: "/nearby-professionals?service=appliance-repair&city=marondera" },
      ]
    },
    {
      title: "By Categories",
      links: [
        { name: "Plumbing & Pipes", to: "/nearby-professionals?service=plumbing" },
        { name: "Electrical & Wiring", to: "/nearby-professionals?service=electrical" },
        { name: "Cleaning & Housekeeping", to: "/nearby-professionals?service=cleaning" },
        { name: "Tutoring & Education", to: "/nearby-professionals?service=tutoring" },
        { name: "Carpentry & Woodwork", to: "/nearby-professionals?service=carpentry" },
        { name: "Painting & Decorating", to: "/nearby-professionals?service=painting" },
        { name: "Gardening & Landscaping", to: "/nearby-professionals?service=gardening" },
        { name: "Appliance Repair", to: "/nearby-professionals?service=appliance-repair" },
      ]
    },
    {
      title: "By Location",
      links: [
        { name: "Harare", to: "/nearby-professionals?city=harare" },
        { name: "Bulawayo", to: "/nearby-professionals?city=bulawayo" },
        { name: "Mutare", to: "/nearby-professionals?city=mutare" },
        { name: "Gweru", to: "/nearby-professionals?city=gweru" },
        { name: "Masvingo", to: "/nearby-professionals?city=masvingo" },
        { name: "Kwekwe", to: "/nearby-professionals?city=kwekwe" },
        { name: "Chinhoyi", to: "/nearby-professionals?city=chinhoyi" },
        { name: "Victoria Falls", to: "/nearby-professionals?city=victoria-falls" },
      ]
    }
  ]

  return (
    <section className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link to={link.to} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
