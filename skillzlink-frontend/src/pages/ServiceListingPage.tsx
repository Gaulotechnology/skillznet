import { MainLayout } from "../layouts/MainLayout";
import { Link } from 'react-router-dom';

export function ServiceListingPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-white font-['Inter',sans-serif]">
        {/* Header Section */}
        <div className="bg-[var(--bg-secondary)] py-12">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3">Search Results</h1>
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-[var(--text-secondary)] hover:text-[var(--accent-color)]">Home</Link>
              <span className="text-[var(--text-secondary)]">/</span>
              <span className="text-[var(--text-primary)] font-semibold">Services</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Categories */}
              <div className="bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Categories</h2>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search Category"
                    className="w-full px-4 py-2 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none"
                  />
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {['Plumbing', 'Electrical', 'Cleaning', 'Tutoring', 'Carpentry'].map((cat, idx) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        defaultChecked={idx === 0}
                        className="w-5 h-5 rounded border-[var(--border-color)] text-[var(--accent-color)] focus:ring-[var(--accent-light)]"
                      />
                      <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Service Type */}
              <div className="bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Service Type</h2>
                <div className="space-y-3">
                  {[
                    { id: 'any', label: 'Any Service Type' },
                    { id: 'hourly', label: 'Hourly Based Service' },
                    { id: 'fixed', label: 'Fixed Price Service' }
                  ].map((type, idx) => (
                    <label key={type.id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="serviceType"
                        defaultChecked={idx === 0}
                        className="w-5 h-5 border-[var(--border-color)] text-[var(--accent-color)] focus:ring-[var(--accent-light)]"
                      />
                      <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Location</h2>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search Location"
                    className="w-full px-4 py-2 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] outline-none"
                  />
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {[
                    { id: 'harare', label: 'Harare' },
                    { id: 'bulawayo', label: 'Bulawayo' }
                  ].map((loc, idx) => (
                    <label key={loc.id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        defaultChecked={idx === 0}
                        className="w-5 h-5 rounded border-[var(--border-color)] text-[var(--accent-color)] focus:ring-[var(--accent-light)]"
                      />
                      <img src="/images/flag/img-04.png" alt="" className="w-5 h-4 object-cover rounded" />
                      <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{loc.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Apply Filters */}
              <div className="bg-[var(--accent-light)] rounded-2xl p-6 border border-[var(--border-color)]">
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Click "Apply Filter" to apply latest changes made by you.
                </p>
                <button className="w-full bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white rounded-xl px-6 py-3 font-semibold transition-all">
                  Apply Filters
                </button>
              </div>
            </aside>

            {/* Service List */}
            <div className="lg:col-span-3 space-y-6">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <p className="text-[var(--text-secondary)]">
                  01 - 48 of <span className="font-semibold text-[var(--text-primary)]">124</span> results for{' '}
                  <span className="text-[var(--accent-color)] font-semibold">"Plumbing Services"</span>
                </p>
              </div>

              {/* Active Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <button className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-color)] font-semibold flex items-center gap-1">
                  <i className="fa fa-times"></i> Clear All
                </button>
                <span className="px-4 py-2 bg-[var(--accent-light)] text-[var(--accent-color)] rounded-xl text-sm font-semibold flex items-center gap-2">
                  Electrical
                  <button className="hover:opacity-70"><i className="fa fa-times"></i></button>
                </span>
              </div>

              {/* Service Card 1 */}
              <div className="bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="absolute top-4 right-4">
                  <span className="bg-[var(--accent-color)] text-white text-xs px-3 py-1 rounded-full font-semibold">Featured</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <Link to="/user-single" className="text-sm text-[var(--accent-color)] font-semibold flex items-center gap-2 hover:underline">
                      <i className="fa fa-check-circle"></i> Tinashe Plumbing Solutions
                    </Link>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mt-2">I need a plumber for pipe installation</h2>
                  </div>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    Nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit inati voluptate velit esse cillum dolore eutates fugiat nulla pariatur sunt in culpa asequi officia deserunt mollit anim id est laborum ut perspiciatis...
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Plumbing', 'Maintenance', 'Installation'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[var(--border-color)] text-sm text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1">
                      <i className="fa fa-dollar-sign"></i> Professional
                    </span>
                    <span className="flex items-center gap-1">
                      <img src="/images/flag/img-04.png" alt="" className="w-4 h-3 rounded" /> Mutare
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="far fa-folder"></i> Per Hour
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="far fa-clock"></i> 03 Months
                    </span>
                    <button className="ml-auto text-[var(--accent-color)] hover:text-[var(--accent-hover)] font-semibold">
                      <i className="fa fa-heart"></i> Save
                    </button>
                    <Link to="/service/gy3yV2Vm5u" className="bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white rounded-xl px-6 py-2 font-semibold transition-all">
                      View Service
                    </Link>
                  </div>
                </div>
              </div>

              {/* Service Card 2 */}
              <div className="bg-white rounded-2xl border border-[var(--border-color)] p-6 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="absolute top-4 right-4">
                  <span className="bg-[var(--accent-color)] text-white text-xs px-3 py-1 rounded-full font-semibold">Featured</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <Link to="/user-single" className="text-sm text-[var(--accent-color)] font-semibold flex items-center gap-2 hover:underline">
                      <i className="fa fa-check-circle"></i> Chipo Electricals
                    </Link>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mt-2">Home electrical wiring and fault finding</h2>
                  </div>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    Nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit inati voluptate velit esse cillum dolore eutates fugiat nulla pariatur sunt in culpa asequi officia deserunt mollit anim id est laborum ut perspiciatis...
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Plumbing', 'Maintenance', 'Wiring', 'Installation'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[var(--border-color)] text-sm text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1">
                      <i className="fa fa-dollar-sign"></i> Professional
                    </span>
                    <span className="flex items-center gap-1">
                      <img src="/images/flag/img-04.png" alt="" className="w-4 h-3 rounded" /> Bulawayo
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="far fa-folder"></i> Fixed
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="far fa-clock"></i> 15 Days
                    </span>
                    <button className="ml-auto text-[var(--accent-color)] hover:text-[var(--accent-hover)] font-semibold">
                      <i className="fa fa-heart"></i> Save
                    </button>
                    <Link to="/service/5aUQgM2ZbW" className="bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white rounded-xl px-6 py-2 font-semibold transition-all">
                      View Service
                    </Link>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              <nav className="flex items-center justify-center gap-2 pt-6">
                <button className="w-10 h-10 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors flex items-center justify-center">
                  <i className="lnr lnr-chevron-left"></i>
                </button>
                {[1, 2, 3, 4, '...', 50].map((page, idx) => (
                  <button
                    key={idx}
                    className={`w-10 h-10 rounded-xl font-semibold transition-colors ${
                      page === 1
                        ? 'bg-[var(--accent-color)] text-white'
                        : 'border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="w-10 h-10 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors flex items-center justify-center">
                  <i className="lnr lnr-chevron-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
