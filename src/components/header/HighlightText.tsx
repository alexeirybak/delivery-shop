export default function HighlightText({
  text,       // Основной текст, который нужно отобразить
  highlight,  // Подстрока, которую нужно подсветить в тексте
}: {
  text: string;
  highlight: string;
}) {

  if (!highlight.trim()) return <>{text}</>;

  const parts = text.split(new RegExp(`(${highlight})`, "gi"));

  return (
    <span>
      {/* Преобразуем массив parts в JSX элементы */}
      {parts.map((part, i) =>
        // Сравниваем текущую часть с highlight (без учета регистра)
        part.toLowerCase() === highlight.toLowerCase() ? (
          // Если это искомая подстрока - рендерим её с жирным начертанием
          <span key={i} className="font-bold">
            {part}
          </span>
        ) : (
          // Иначе - рендерим как обычный текст
          part
        )
      )}
    </span>
  );
}