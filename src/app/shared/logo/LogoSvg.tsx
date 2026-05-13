const LogoSvg = () => {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="ml-1"
    >
      <defs>
        <radialGradient id="coreGlow">
          <stop offset="0%" stopColor="#7DF4D6" stopOpacity="1" />
          <stop offset="70%" stopColor="#1B4B6C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#1B4B6C" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="aurora" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7DF4D6" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#7DF4D6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#E2F0F9" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      <g opacity="0.3">
        <path
          d="M0,100 Q50,50 100,100 T200,100"
          stroke="url(#aurora)"
          fill="none"
          strokeWidth="40"
        />
        <path
          d="M0,120 Q50,70 100,120 T200,120"
          stroke="url(#aurora)"
          fill="none"
          strokeWidth="30"
        />
        <path
          d="M0,80 Q50,130 100,80 T200,80"
          stroke="url(#aurora)"
          fill="none"
          strokeWidth="30"
        />
      </g>

      <circle cx="100" cy="100" r="45" fill="url(#coreGlow)" />
      <circle cx="100" cy="100" r="20" fill="#1B4B6C" />

      <g stroke="#7DF4D6" strokeWidth="2">
        <circle cx="50" cy="50" r="6" fill="#1B4B6C" stroke="#7DF4D6" />
        <circle cx="150" cy="50" r="6" fill="#1B4B6C" stroke="#7DF4D6" />
        <circle cx="50" cy="150" r="6" fill="#1B4B6C" stroke="#7DF4D6" />
        <circle cx="150" cy="150" r="6" fill="#1B4B6C" stroke="#7DF4D6" />
        <circle cx="100" cy="30" r="4" fill="#7DF4D6" />
        <circle cx="170" cy="100" r="4" fill="#7DF4D6" />
        <circle cx="100" cy="170" r="4" fill="#7DF4D6" />
        <circle cx="30" cy="100" r="4" fill="#7DF4D6" />

        <line x1="50" y1="50" x2="100" y2="100" strokeDasharray="4 4" />
        <line x1="150" y1="50" x2="100" y2="100" strokeDasharray="4 4" />
        <line x1="50" y1="150" x2="100" y2="100" strokeDasharray="4 4" />
        <line x1="150" y1="150" x2="100" y2="100" strokeDasharray="4 4" />
        <line x1="100" y1="30" x2="100" y2="100" strokeDasharray="4 4" />
        <line x1="170" y1="100" x2="100" y2="100" strokeDasharray="4 4" />
        <line x1="30" y1="100" x2="100" y2="100" strokeDasharray="4 4" />
        <line x1="100" y1="170" x2="100" y2="100" strokeDasharray="4 4" />
      </g>
    </svg>
  );
};

export default LogoSvg;
