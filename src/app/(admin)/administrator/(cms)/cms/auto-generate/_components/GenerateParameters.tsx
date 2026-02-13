const GenerateParameters = () => {
  return (
    <div className="p-4 bg-green-50 rounded border border-green-200">
      <h3 className="font-medium text-green-900 mb-1">Параметры генерации</h3>
      <ul className="text-sm text-green-700 space-y-1">
        <li>• Стиль: Профессиональный</li>
        <li>• Длина: около 1000 слов</li>
        <li>• В БД сохраняется: заголовок, контент, автор, категория</li>
        <li>• SEO поля (описание, ключевые слова) - пустые</li>
        <li>• После генерации Вы перейдете в редактор статьи</li>
      </ul>
    </div>
  );
};

export default GenerateParameters;
