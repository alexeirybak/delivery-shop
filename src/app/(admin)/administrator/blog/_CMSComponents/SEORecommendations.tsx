export default function SEORecommendations() {
  const recommendations = [
    "Используйте релевантные ключевые слова для вашей тематики",
    "Не злоупотребляйте ключевыми словами",
    "Заголовок должен четко отражать суть сайта",
    "Мета-описание должно заинтересовать пользователя",
    "Обновляйте семантическое ядро при расширении тематики сайта",
  ];

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 className="font-semibold text-blue-800 mb-2">Рекомендации по SEO:</h3>
      <ul className="text-sm text-blue-700 space-y-1">
        {recommendations.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
    </div>
  );
}
