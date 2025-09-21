import Link from "next/link";

export default function UnsubscribeError() {
  return (
    <div className="max-w-md mx-auto p-6 text-center mt-20">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <h1 className="text-2xl font-bold mb-2">Ошибка отписки</h1>
        <p>
          Не удалось отписаться от уведомлений. Возможно, ссылка устарела или
          подписка уже отменена.
        </p>
      </div>
      <Link href="/" className="text-main-text underline hover:text-blue-800">
        Вернуться на главную
      </Link>
    </div>
  );
}