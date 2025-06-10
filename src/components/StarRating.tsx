const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  const totalStars = 5;

  for (let i = 1; i <= totalStars; i++) {
    const fillAmount = Math.max(0, Math.min(1, rating - (i - 1)));
    const fillPercentage = Math.round(fillAmount * 100);

    stars.push(
      <div key={i} className="relative w-[12.92px] h-[12.39px]">
        <svg width="12.921875" height="12.386719" viewBox="0 0 12.9219 12.3867">
          <path
            id="Star 1"
            d="M5.56 0.55L4.34 3.03C4.19 3.32 3.91 3.53 3.58 3.57L0.85 3.97C0.03 4.09 -0.3 5.1 0.3 5.68L2.28 7.6C2.51 7.83 2.62 8.16 2.56 8.49L2.1 11.21C1.96 12.03 2.81 12.65 3.55 12.26L5.99 10.98C6.28 10.83 6.63 10.83 6.92 10.98L9.37 12.26C10.1 12.65 10.96 12.03 10.82 11.21L10.35 8.49C10.29 8.16 10.4 7.83 10.64 7.6L12.61 5.68C13.21 5.1 12.88 4.09 12.06 3.97L9.33 3.57C9 3.53 8.72 3.32 8.57 3.03L7.35 0.55C6.99 -0.19 5.93 -0.19 5.56 0.55Z"
            fill="#BFBFBF"
            fillOpacity="1"
            className="absolute"
          />
        </svg>

        {fillAmount > 0 && (
          <div
            className="absolute top-0 left-0 h-full overflow-hidden"
            style={{ width: `${fillPercentage}%` }}
          >
            <svg
              width="12.921875"
              height="12.386719"
              viewBox="0 0 12.9219 12.3867"
            >
              <path
                id="Star 1"
                d="M5.56 0.55L4.34 3.03C4.19 3.32 3.91 3.53 3.58 3.57L0.85 3.97C0.03 4.09 -0.3 5.1 0.3 5.68L2.28 7.6C2.51 7.83 2.62 8.16 2.56 8.49L2.1 11.21C1.96 12.03 2.81 12.65 3.55 12.26L5.99 10.98C6.28 10.83 6.63 10.83 6.92 10.98L9.37 12.26C10.1 12.65 10.96 12.03 10.82 11.21L10.35 8.49C10.29 8.16 10.4 7.83 10.64 7.6L12.61 5.68C13.21 5.1 12.88 4.09 12.06 3.97L9.33 3.57C9 3.53 8.72 3.32 8.57 3.03L7.35 0.55C6.99 -0.19 5.93 -0.19 5.56 0.55Z"
                fill="#FF6633"
                fillOpacity="1"
              />
            </svg>
          </div>
        )}
      </div>
    );
  }

  return <div className="flex flex-row gap-1">{stars}</div>;
};

export default StarRating;
