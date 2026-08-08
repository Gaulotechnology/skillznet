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
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-emerald-400 font-semibold text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> We are hiring
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Join SkillzLink</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Help us build the most trusted services marketplace in Zimbabwe. We are looking for passionate individuals to join our growing team.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-5xl mx-auto p-8 md:p-12 min-h-[400px]">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Open Positions</h2>
            <p className="text-slate-500">Discover your next career opportunity with us.</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-rose-500 rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Loading open positions...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100">
              <i className="lnr lnr-warning text-3xl mb-2 block" />
              <p>{error}</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <i className="lnr lnr-briefcase text-3xl text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">No Open Positions</h3>
              <p className="text-slate-500">We don't have any open positions right now, but we are always looking for great talent. Check back later!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {jobs.map((job) => (
                <div key={job.id} className="border border-slate-100 rounded-2xl p-6 md:p-8 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-rose-600 transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-500 mb-4">
                      <span className="flex items-center gap-1.5"><i className="lnr lnr-apartment" /> {job.department}</span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1.5"><i className="lnr lnr-map-marker" /> {job.location}</span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1.5"><i className="lnr lnr-clock" /> {job.type}</span>
                    </div>
                    <p className="text-slate-600 line-clamp-2 md:line-clamp-1 max-w-2xl">{job.description}</p>
                  </div>
                  <div className="shrink-0">
                    <button className="w-full md:w-auto px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-rose-500 transition-colors shadow-md">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
