import IconStar from "@/components/svg/IconStar";

interface RatingDistributionProps {
  averageRating: number;
  distribution: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
}

const RatingDistribution = ({
  averageRating,
  distribution,
}: RatingDistributionProps) => {
  const totalReviews =
    distribution["1"] +
    distribution["2"] +
    distribution["3"] +
    distribution["4"] +
    distribution["5"];

  const renderStars = (rating: number) => {
    return (
      <div className="flex flex-row gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const fillAmount = Math.max(0, Math.min(1, rating - (star - 1)));
          const fillPercentage = Math.round(fillAmount * 100);

          return <IconStar key={star} fillPercentage={fillPercentage} />;
        })}
      </div>
    );
  };

  if (totalReviews === 0) {
    return (
      <div className="text-center py-4">
        <div className="text-lg font-bold mb-2">0 из 5</div>
        <div className="text-main-text">Пока нет оценок</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-row gap-x-2 xl:gap-x-4 items-center mb-4">
        <div>{renderStars(averageRating)}</div>
        <div className="text-lg font-bold">{averageRating} из 5</div>
      </div>

      <div className="space-y-2 text-main-text">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center gap-x-2">
            <span className="w-5 text-base">{rating}</span>
            <div className="flex items-center">{renderStars(rating)}</div>
            <span className="text-base">
              {distribution[rating as unknown as keyof typeof distribution]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingDistribution;
