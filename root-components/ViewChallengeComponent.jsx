function SourceLink({
  href,
  label = 'View Source',
  className = ''
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${className}`}
      
    >
        <span>{label} </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="inline-block pl-3"
      >
        <path d="m18 16 4-4-4-4" />
        <path d="m6 8-4 4 4 4" />
        <path d="m14.5 4-5 16" />
      </svg>

      
    </a>
  )
}

export default SourceLink