import { Link } from "react-router-dom"

const services = [
  { name: "Plumbing", img: "/images/categories/img-01.png", slug: "plumbing", description: "Leak repairs, pipe installations, and emergency plumbing services." },
  { name: "Electrical", img: "/images/categories/img-02.png", slug: "electrical", description: "Wiring, fault finding, and certified electrical repairs." },
  { name: "Cleaning", img: "/images/categories/img-03.png", slug: "cleaning", description: "Home and office cleaning professionals near you." },
  { name: "Tutoring", img: "/images/categories/img-04.png", slug: "tutoring", description: "Qualified tutors for school subjects and exam support." },
  { name: "Carpentry", img: "/images/categories/img-05.png", slug: "carpentry", description: "Custom furniture, fittings, and wood repairs." },
  { name: "Painting", img: "/images/categories/img-06.png", slug: "painting", description: "Interior and exterior painting for homes and offices." },
  { name: "Gardening", img: "/images/categories/img-07.png", slug: "gardening", description: "Lawn care, landscaping, and garden maintenance." },
  { name: "Appliance Repair", img: "/images/categories/img-08.png", slug: "appliance-repair", description: "Fixes for fridges, washers, stoves, and other appliances." },
]

export function PopularServices() {
  return (
    <section className="wt-haslayout wt-main-section">
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col-xs-12 col-sm-12 col-md-8 push-md-2 col-lg-6 push-lg-3">
            <div className="wt-sectionhead wt-textcenter">
              <div className="wt-sectiontitle">
                <h2>Explore Categories</h2>
                <span>Professional services by category</span>
              </div>
            </div>
          </div>
          <div className="wt-categoryexpl">
            {services.map((service) => (
              <div key={service.slug} className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 float-left">
                <div className="wt-categorycontent">
                  <figure><img src={service.img} alt={service.name} /></figure>
                  <div className="wt-cattitle">
                    <h3><Link to={`/?service=${service.slug}#find-providers`}>{service.name}</Link></h3>
                  </div>
                  <div className="wt-categoryslidup">
                    <p>{service.description}</p>
                    <Link to={`/?service=${service.slug}#find-providers`}>Explore <i className="fa fa-arrow-right" /></Link>
                  </div>
                </div>
              </div>
            ))}
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 float-left">
              <div className="wt-btnarea">
                <Link to="/service-categories" className="wt-btn">View All</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
