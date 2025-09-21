import Link from "next/link";

export default function UnsubscribeSuccess() {
  return (
    <div className="max-w-md mx-auto p-6 text-center mt-20">
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        <h1 className="text-2xl font-bold mb-2">Отписка выполнена</h1>
        <p>
          Вы успешно отписались от уведомления о снижении цены на данный товар.
        </p>
      </div>
      <Link href="/" className="text-main-text underline hover:text-blue-800">
        Вернуться на главную
      </Link>
    </div>
  );
}