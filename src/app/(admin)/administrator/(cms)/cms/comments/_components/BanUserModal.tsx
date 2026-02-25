import { AlertCircle, X, Calendar, Info } from "lucide-react";
import { formatBanDate } from "../utils/formatBanDate";
import { banOptions } from "../utils/banOptions";
import { BanUserModalProps } from "../types/comments.types";

export const BanUserModal = ({
  isOpen,
  onClose,
  onBan,
  onUnban,
  userName,
  userId,
  isBanned,
  bannedUntil,
}: BanUserModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded shadow-2xl max-w-md w-full transform transition-all">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isBanned ? "Управление блокировкой" : "Блокировка пользователя"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 cursor-pointer group"
            title="Закрыть"
          >
            <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 rounded p-4 mb-4">
            <p className="text-gray-700 mb-1">
              <span className="text-sm text-gray-500">Пользователь:</span>{" "}
              <span className="font-semibold text-gray-900">{userName}</span>
            </p>
            <p className="text-xs text-gray-500 font-mono">
              ID: <span className="text-gray-600">{userId}</span>
            </p>
          </div>

          {isBanned ? (
            <>
              <div className="bg-red-50 border border-red-200 rounded p-5 mb-5">
                <p className="text-red-600 flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-semibold">
                    Пользователь заблокирован
                  </span>
                </p>
                {bannedUntil ? (
                  <div className="text-gray-700 bg-white rounded p-3">
                    <div className="flex flex-wrap gap-x-2">
                      <Calendar className="w-4 h-4 text-red-400" />
                      <p className="text-sm">Блокировка будет снята: </p>
                    </div>

                    <p className="font-semibold text-red-600">
                      {formatBanDate(bannedUntil)}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-700 bg-white rounded p-3">
                    <Calendar className="w-4 h-4 text-red-400" />
                    <span className="font-semibold text-red-600">
                      Блокировка навсегда
                    </span>
                  </div>
                )}
              </div>

              <p className="text-sm text-blue-500 mb-6 bg-blue-50 border border-blue-100 rounded p-3 flex flex-row gap-3">
                <Info className="w-5 h-5 shrink-0" />
                <span>
                  Вы можете разблокировать пользователя досрочно, чтобы он снова
                  мог оставлять комментарии.
                </span>
              </p>

              <button
                onClick={onUnban}
                className="w-full px-4 py-3.5 bg-green-600 text-white rounded hover:bg-green-700 font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Разблокировать пользователя
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-amber-700 mb-6 bg-amber-50 border border-amber-200 rounded p-3">
                <AlertCircle className="shrink-0 w-4 h-4 mb-2" />
                <span className="font-medium ">
                  Заблокированный пользователь не сможет оставлять комментарии.
                </span>
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-2">
                {banOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => onBan(option.days)}
                    className="px-3 py-3.5 rounded text-sm font-medium transition-all transition-custom 
                              bg-gray-200 text-gray-700 hover:bg-red-300 hover:shadow-md 
                              active:scale-[0.97] cursor-pointer border border-gray-300
                              hover:border-red-400 focus:ring-2 focus:ring-green-500/50"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-100 rounded-b">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-700 text-white font-semibold 
                        rounded shadow-md hover:bg-gray-800 hover:shadow-lg 
                        active:bg-gray-900 active:scale-95 transition-all duration-200 
                        focus:ring-4 focus:ring-gray-400 cursor-pointer border border-gray-600"
          >
            {isBanned ? "Закрыть" : "Отмена"}
          </button>
        </div>
      </div>
    </div>
  );
};
