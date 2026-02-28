import { useState } from "react";
import Link from "next/link";
import { Shield, X } from "lucide-react";

export const RulesModal = ({
  isOpen,
  onClose,
  onAccept,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}) => {
  const [accepted, setAccepted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-semibold">Правила сообщества</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full "
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded">
              <p className="text-green-800">
                Пожалуйста, ознакомьтесь с правилами сообщества перед тем, как
                оставлять комментарии.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Основные правила:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  Уважайте других участников
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  Запрещены оскорбления и травля
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  Никакого спама и рекламы
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  Пишите конструктивно и по теме
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  Не публикуйте запрещенный контент
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">
                Нарушение правил может привести к временной или постоянной
                блокировке аккаунта.
              </p>
            </div>

            <div className="text-center">
              <Link
                href="/blog/rules"
                className="text-green-600 hover:text-green-800 text-sm"
                onClick={onClose}
              >
                Читать полную версию правил →
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Закрыть
            </button>
            <button
              onClick={() => {
                if (accepted) {
                  onAccept();
                  onClose();
                }
              }}
              disabled={!accepted}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Принимаю правила
            </button>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <input
                type="checkbox"
                id="accept-rules-modal"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="rounded text-green-600 cursor-pointer"
              />
              <label
                htmlFor="accept-rules-modal"
                className="text-sm text-gray-600"
              >
                Я ознакомился и принимаю правила сообщества
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
