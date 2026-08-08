import { useState, useEffect } from "react"
import { publicApi, type JobPosting } from "../services/api"

export function CareersPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    publicApi.getCareers()
      .then(res => setJobs(res.jobs || []))
      .catch(err => {
        console.error("Failed to load jobs", err)
        setError("Unable to load open positions at this time. Please try again later.")
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Hero */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-light)] text-[var(--accent-color)] font-semibold text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-pulse" /> We are hiring
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">Join SkillzLink</h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Help us build the most trusted services marketplace in Zimbabwe. We are looking for passionate individuals to join our growing team.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-[var(--border-color)] p-8 md:p-12 shadow-sm min-h-[400px]">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Open Positions</h2>
              <p className="text-[var(--text-secondary)]">Discover your next career opportunity with us.</p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-[var(--border-color)] border-t-[var(--accent-color)] rounded-full animate-spin mb-4" />
                <p className="text-[var(--text-secondary)] font-medium">Loading open positions...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100">
                <i className="lnr lnr-warning text-3xl mb-2 block" />
                <p>{error}</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16 bg-[var(--bg-secondary)] rounded-2xl border border-dashed border-[var(--border-color)]">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <i className="lnr lnr-briefcase text-3xl text-[var(--text-secondary)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No Open Positions</h3>
                <p className="text-[var(--text-secondary)]">We don't have any open positions right now, but we are always looking for great talent. Check back later!</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-2xl border border-[var(--border-color)] p-6 md:p-8 hover:shadow-md transition-all duration-300 group flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-color)] transition-colors">{job.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-[var(--text-secondary)] mb-4">
                        <span className="flex items-center gap-1.5"><i className="lnr lnr-apartment" /> {job.department}</span>
                        <span className="text-[var(--border-color)]">•</span>
                        <span className="flex items-center gap-1.5"><i className="lnr lnr-map-marker" /> {job.location}</span>
                        <span className="text-[var(--border-color)]">•</span>
                        <span className="flex items-center gap-1.5"><i className="lnr lnr-clock" /> {job.type}</span>
                      </div>
                      <p className="text-[var(--text-secondary)] line-clamp-2 md:line-clamp-1 max-w-2xl">{job.description}</p>
                    </div>
                    <div className="shrink-0">
                      <button className="w-full md:w-auto bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white rounded-xl px-6 py-3 font-semibold transition shadow-sm">
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
