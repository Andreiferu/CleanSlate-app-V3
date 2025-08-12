export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center gap-3 text-gray-600">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 animate-spin">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.25" />
        <path d="M22 12a10 10 0 0 1-10 10" fill="none" stroke="currentColor" strokeWidth="4" />
      </svg>
      <span className="text-sm">{label}</span>
    </div>
  );
}
