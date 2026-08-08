import { Link } from 'react-router-dom';

const cards = [
  {
    icon: 'lnr lnr-users',
    title: 'Become an Affiliate',
    description: 'Earn commissions by referring service seekers and providers to SkillzLink',
    link: '/apply?type=affiliate',
  },
  {
    icon: 'lnr lnr-laptop',
    title: 'Become an Agent',
    description: 'Help connect seekers with the right providers in your area',
    link: '/apply?type=agent',
  },
  {
    icon: 'lnr lnr-briefcase',
    title: 'Become a Provider',
    description: 'Offer your professional services to thousands of seekers',
    link: '/apply?type=provider',
  },
];

export function ApplyBannerSection() {
  return (
    <section className="py-16 bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">Join the SkillzLink Network</h2>
        <p className="text-center text-gray-500 mb-10">Choose how you'd like to partner with us</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.title} className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl text-gray-700 mb-4">
                <i className={card.icon} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-500 mb-6">{card.description}</p>
              <Link to={card.link} className="inline-block px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">
                Apply Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
