import IconStar from "@/components/svg/IconStar";

interface RatingDistributionProps {
  distribution: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
  averageRating?: number;
}

const RatingDistribution = ({
  distribution,
  averageRating,
}: RatingDistributionProps) => {
  // Вычисляем общий рейтинг если не передан
  const totalRating =
    averageRating ??
    Object.entries(distribution).reduce(
      (acc, [rating, count]) => acc + parseInt(rating) * count,
      0
    ) / Object.values(distribution).reduce((acc, count) => acc + count, 0);

  const roundedRating = Math.round(totalRating * 10) / 10; // Округляем до десятых

  // Функция для рендеринга звезд
  const renderStars = (count: number) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const fillAmount = Math.max(0, Math.min(1, count - (i - 1)));
      const fillPercentage = Math.round(fillAmount * 100);

      stars.push(
        <IconStar key={i} fillPercentage={fillPercentage} size={12.92} />
      );
    }

    return <div className="flex flex-row gap-1">{stars}</div>;
  };

  // Функция для рендеринга звезд общей оценки
  const renderAverageStars = (rating: number) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const fillAmount = Math.max(0, Math.min(1, rating - (i - 1)));
      const fillPercentage = Math.round(fillAmount * 100);

      stars.push(
        <IconStar key={i} fillPercentage={fillPercentage} size={12.92} />
      );
    }

    return <div className="flex flex-row gap-1">{stars}</div>;
  };

  return (
    <div>
      {/* Блок с общей оценкой */}
      <div className="flex flex-row gap-x-2 xl:gap-x-4 items-center mb-4">
        <div>{renderAverageStars(roundedRating)}</div>
        <div className="text-lg font-bold">{roundedRating} из 5</div>
      </div>

      {/* Распределение оценок */}
      <div className="space-y-2 text-main-text">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center gap-x-2">
            {/* Рейтинг цифрой */}
            <span className="w-5 text-base flex items-center justify-center">
              {rating}
            </span>

            {/* Звезды */}
            <div className="flex items-center">{renderStars(rating)}</div>

            {/* Количество оценок */}
            <span className="text-base flex items-center">
              {distribution[rating as unknown as keyof typeof distribution]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingDistribution;
