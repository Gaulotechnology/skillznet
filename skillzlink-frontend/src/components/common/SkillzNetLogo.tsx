import { Link } from "react-router-dom"

interface SkillzNetLogoProps {
  className?: string
  iconOnly?: boolean
  size?: "sm" | "md" | "lg"
  logoUrl?: string
  onClick?: () => void
}

export function SkillzNetLogo({ className = "", iconOnly = false, size = "md", logoUrl, onClick }: SkillzNetLogoProps) {
  const iconDimensions = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  }[size]

  const textSize = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }[size]

  if (logoUrl) {
    return (
      <Link to="/" onClick={onClick} className={`inline-flex items-center gap-2 group select-none ${className}`}>
        <img src={logoUrl} alt="Logo" className={`${size === "sm" ? "max-h-7" : size === "lg" ? "max-h-12" : "max-h-9"} object-contain`} />
      </Link>
    )
  }

  return (
    <Link to="/" onClick={onClick} className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* ── Geometric S-Network Emblem with Zimbabwe Colors ── */}
      <div className={`${iconDimensions} relative rounded-xl bg-[#0F172A] flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 overflow-hidden shrink-0 border border-white/10`}>
        <svg viewBox="0 0 68 68" className="w-full h-full p-1.5" fill="none">
          <defs>
            <linearGradient id="snGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00A843" />
              <stop offset="100%" stopColor="#007A30" />
            </linearGradient>
            <linearGradient id="snGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD600" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="snRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
          </defs>

          {/* Top Green Loop */}
          <path d="M21 21 C 21 14, 47 12, 47 21 C 47 28, 21 28, 21 36" fill="none" stroke="url(#snGreen)" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Middle Gold Connection */}
          <path d="M24 27 C 30 25, 40 25, 45 33 C 48 37, 48 43, 48 50" fill="none" stroke="url(#snGold)" strokeWidth="5.5" strokeLinecap="round" />

          {/* Bottom Red Loop */}
          <path d="M47 36 C 47 44, 21 44, 21 51 C 21 58, 47 57, 47 50" fill="none" stroke="url(#snRed)" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Node dots */}
          <circle cx="20" cy="21" r="3.5" fill="#FFFFFF" />
          <circle cx="20" cy="21" r="1.5" fill="#00A843" />
          
          <circle cx="48" cy="50" r="3.5" fill="#FFFFFF" />
          <circle cx="48" cy="50" r="1.5" fill="#EF4444" />

          <circle cx="34" cy="34" r="3" fill="#FFFFFF" />
          <circle cx="34" cy="34" r="1.5" fill="#FFD600" />
        </svg>
      </div>

      {/* ── Brand Typography ── */}
      {!iconOnly && (
        <div className="flex flex-col">
          <div className={`font-black ${textSize} tracking-tight leading-none text-[#0F172A] flex items-center`}>
            <span>Skillz</span>
            <span className="text-[#00A843]">N</span>
            <span className="text-[#FFD600]">e</span>
            <span className="text-[#EF4444]">t</span>
          </div>
          {size !== "sm" && (
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[9px] font-bold tracking-widest text-[#64748B] uppercase">Zimbabwe</span>
              <div className="flex gap-0.5 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A843]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD600]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              </div>
            </div>
          )}
        </div>
      )}
    </Link>
  )
}
