// LHC (Live Helper Chat) public URL
// Set via VITE_LHC_URL env var at build time.
// - Local Docker:  http://localhost:18081
// - Production:    http://62.238.107.93/lhc
export const LHC_BASE_URL = import.meta.env.VITE_LHC_URL || "http://localhost:18081"
