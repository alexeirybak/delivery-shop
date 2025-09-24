// Импорт компонента иконки звезды для отображения рейтинга
import IconStar from "@/components/svg/IconStar";

// Интерфейс пропсов компонента - определяет структуру принимаемых данных
interface RatingDistributionProps {
  averageRating: number;  // Средняя оценка продукта (например: 4.3)
  distribution: {         // Распределение количества оценок по звездам
    "1": number;  // Количество оценок "1 звезда"
    "2": number;  // Количество оценок "2 звезды" 
    "3": number;  // Количество оценок "3 звезды"
    "4": number;  // Количество оценок "4 звезды"
    "5": number;  // Количество оценок "5 звезд"
  };
}

// Основной компонент распределения рейтинга
const RatingDistribution = ({
  averageRating,  // Получаем среднюю оценку из пропсов
  distribution,   // Получаем распределение оценок из пропсов
}: RatingDistributionProps) => {
  // Вычисляем общее количество отзывов (суммируем все значения распределения)
  const totalReviews = distribution["1"] + distribution["2"] + distribution["3"] + distribution["4"] + distribution["5"];

  // Функция для отрисовки звезд с определенным уровнем заполнения
  const renderStars = (rating: number) => {
    return (
      // Контейнер для звезд с горизонтальным расположением
      <div className="flex flex-row gap-1">
        {/* Создаем массив из 5 элементов (звезд) и преобразуем каждый в компонент */}
        {[1, 2, 3, 4, 5].map((star) => {
          // ВЫЧИСЛЕНИЕ УРОВНЯ ЗАПОЛНЕНИЯ ЗВЕЗДЫ:
          // rating - (star - 1) = определяет заполнение текущей звезды
          // Пример для rating = 3.7:
          // - star = 1: 3.7 - 0 = 3.7 → fillAmount = 1 (полная)
          // - star = 2: 3.7 - 1 = 2.7 → fillAmount = 1 (полная)
          // - star = 3: 3.7 - 2 = 1.7 → fillAmount = 1 (полная)  
          // - star = 4: 3.7 - 3 = 0.7 → fillAmount = 0.7 (70%)
          // - star = 5: 3.7 - 4 = -0.3 → fillAmount = 0 (пустая)
          const fillAmount = Math.max(0, Math.min(1, rating - (star - 1)));
          
          // Преобразуем коэффициент заполнения в проценты (0-100)
          const fillPercentage = Math.round(fillAmount * 100);
          
          // Возвращаем компонент звезды с вычисленным заполнением
          return (
            <IconStar 
              key={star} // Уникальный ключ для React
              fillPercentage={fillPercentage} // Процент заполнения (0-100)
            />
          );
        })}
      </div>
    );
  };

  // Если отзывов нет, показываем заглушку
  if (totalReviews === 0) {
    return (
      <div className="text-center py-4">
        {/* Заголовок с нулевым рейтингом */}
        <div className="text-lg font-bold mb-2">0 из 5</div>
        {/* Сообщение об отсутствии оценок */}
        <div className="text-gray-500">Пока нет оценок</div>
      </div>
    );
  }

  // Основной рендер компонента когда есть отзывы
  return (
    <div>
      {/* Блок с общей оценкой продукта */}
      <div className="flex flex-row gap-x-2 xl:gap-x-4 items-center mb-4">
        {/* Отрисовываем звезды для средней оценки */}
        <div>{renderStars(averageRating)}</div>
        {/* Числовое значение средней оценки */}
        <div className="text-lg font-bold">{averageRating} из 5</div>
      </div>

      {/* Блок с детальным распределением оценок по категориям */}
      <div className="space-y-2 text-main-text">
        {/* Проходим по оценкам от 5 до 1 (от высшей к низшей) */}
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center gap-x-2">
            {/* Отображаем цифру оценки */}
            <span className="w-5 text-base">{rating}</span>
            
            {/* Отрисовываем звезды для данной оценки (всегда полные) */}
            <div className="flex items-center">{renderStars(rating)}</div>
            
            {/* Отображаем количество оценок данной категории */}
            {/* Приведение типа нужно для TypeScript */}
            <span className="text-base">{distribution[rating as unknown as keyof typeof distribution]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Экспорт компонента для использования в других частях приложения
export default RatingDistribution;