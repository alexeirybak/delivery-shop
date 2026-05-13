const DemoVisualization = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1200 760"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="demoBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0b1732" />
          <stop offset="100%" stopColor="#081223" />
        </linearGradient>
      </defs>

      <rect width="1200" height="760" fill="url(#demoBg)" />

      <g opacity="0.24" stroke="#8fe8ff" fill="none">
        <rect x="96" y="90" width="312" height="184" rx="24" />
        <rect x="450" y="124" width="286" height="172" rx="24" />
        <rect x="778" y="94" width="324" height="210" rx="24" />
        <rect x="150" y="382" width="404" height="208" rx="24" />
        <rect x="604" y="396" width="448" height="184" rx="24" />
      </g>

      <g stroke="#5ddfff" strokeOpacity="0.28" fill="none">
        <path d="M252 274L590 382" />
        <path d="M590 382L950 304" />
        <path d="M590 382L844 490" />
        <path d="M950 304L844 490" />
      </g>

      <g fill="#dff8ff" fillOpacity="0.75">
        <circle cx="252" cy="274" r="8" />
        <circle cx="590" cy="382" r="10" />
        <circle cx="950" cy="304" r="8" />
        <circle cx="844" cy="490" r="9" />
      </g>
    </svg>
  );
};

export default DemoVisualization;
