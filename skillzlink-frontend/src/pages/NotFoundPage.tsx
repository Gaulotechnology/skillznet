import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif] flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center py-20">
        <h1 className="text-7xl font-bold text-[var(--accent-color)] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Page Not Found</h2>
        <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="inline-block bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white rounded-xl px-6 py-3 font-semibold transition">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
