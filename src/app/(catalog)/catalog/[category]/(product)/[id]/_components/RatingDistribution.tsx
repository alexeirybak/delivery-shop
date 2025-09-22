// Импорт компонента иконки звезды
import IconStar from "@/components/svg/IconStar";

// Интерфейс для пропсов компонента - распределение оценок и средний рейтинг
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

// Основной компонент распределения рейтинга
const RatingDistribution = ({
  distribution,
  averageRating,
}: RatingDistributionProps) => {
  // Вычисляем общее количество оценок
  const totalCount = Object.values(distribution).reduce(
    (acc, count) => acc + count,
    0
  );
  // Вычисляем общий рейтинг если не передан явно
  const totalRating =
    averageRating ?? // Если передан averageRating, используем его
    // Иначе вычисляем среднее арифметическое: сумма (оценка * количество) / общее количество
    (totalCount > 0
      ? Object.entries(distribution).reduce(
          (acc, [rating, count]) => acc + parseInt(rating) * count,
          0
        ) / totalCount
      : 0); // Если оценок нет, возвращаем 0

  // Округляем рейтинг до десятых
  const roundedRating = Math.round(totalRating * 10) / 10;

  // Функция для рендеринга звезд для отдельных оценок (5, 4, 3, 2, 1)
  const renderStars = (count: number) => {
    const stars = [];

    // Создаем 5 звезд
    for (let i = 1; i <= 5; i++) {
      // Вычисляем степень заполнения звезды (от 0 до 1)
      // Например: для оценки 3: i=1 -> 1, i=2 -> 1, i=3 -> 1, i=4 -> 0, i=5 -> 0
      const fillAmount = Math.max(0, Math.min(1, count - (i - 1)));
      // Преобразуем в проценты (0-100)
      const fillPercentage = Math.round(fillAmount * 100);

      // Создаем компонент звезды с вычисленным заполнением
      stars.push(
        <IconStar key={i} fillPercentage={fillPercentage} size={12.92} />
      );
    }

    // Возвращаем контейнер со звездами
    return <div className="flex flex-row gap-1">{stars}</div>;
  };

  // Функция для рендеринга звезд общей оценки (аналогична renderStars, но для среднего рейтинга)
  const renderAverageStars = (rating: number) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      // Вычисляем заполнение для дробного рейтинга (например: 4.3)
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
        {/* Отображаем звезды средней оценки */}
        <div>{renderAverageStars(roundedRating)}</div>
        {/* Числовое значение рейтинга */}
        <div className="text-lg font-bold">{roundedRating} из 5</div>
      </div>

      {/* Распределение оценок по категориям */}
      <div className="space-y-2 text-main-text">
        {/* Проходим по оценкам от 5 до 1 */}
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center gap-x-2">
            {/* Отображаем цифру рейтинга */}
            <span className="w-5 text-base flex items-center justify-center">
              {rating}
            </span>

            {/* Отображаем звезды для данного рейтинга */}
            <div className="flex items-center">{renderStars(rating)}</div>

            {/* Отображаем количество оценок данного типа */}
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
