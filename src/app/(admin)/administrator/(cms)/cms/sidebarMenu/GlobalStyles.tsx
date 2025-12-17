export default function GlobalStyles() {
  return (
    <style jsx global>{`
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .animate-slideIn {
        animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        opacity: 0;
      }

      /* Градиент для каждой кнопки */
      .group:nth-child(1) {
        --tw-gradient-from: #3b82f6;
        --tw-gradient-to: #1d4ed8;
      }
      .group:nth-child(2) {
        --tw-gradient-from: #6366f1;
        --tw-gradient-to: #4338ca;
      }
      .group:nth-child(3) {
        --tw-gradient-from: #10b981;
        --tw-gradient-to: #047857;
      }
      .group:nth-child(4) {
        --tw-gradient-from: #8b5cf6;
        --tw-gradient-to: #7c3aed;
      }
    `}</style>
  );
}