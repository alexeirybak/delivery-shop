"use client";

import { Power, PowerOff, Trash2 } from "lucide-react";
import { formatCardNumber } from "../../../../../../utils/validation/validProfileCard";
import { CardTableProps } from "../types/cards.types";

export const CardTable = ({
  cards,
  onToggleActive,
  onDelete,
}: CardTableProps) => {
  return (
    <div className="space-y-3">
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 rounded-lg text-xs font-medium text-gray-500 uppercase tracking-wider">
        <div className="col-span-1">№</div>
        <div className="col-span-3">Номер карты</div>
        <div className="col-span-2">Статус</div>
        <div className="col-span-3">Владелец</div>
        <div className="col-span-2">Дата</div>
        <div className="col-span-1 text-center">Действия</div>
      </div>

      {cards.map((card) => (
        <div
          key={card._id}
          className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-2 sm:px-4 py-3 rounded-lg items-start sm:items-center border ${
            !card.isActive
              ? "border-gray-200 bg-gray-50"
              : "border-transparent hover:border-gray-200 hover:bg-gray-50"
          }`}
        >
          <div className="col-span-1 sm:hidden flex justify-between items-center w-full mb-1">
            <span className="text-xs font-medium text-gray-500">
              п/п № {card.order}
            </span>
            <span
              className={`px-2 py-1 text-xs rounded ${
                card.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {card.isActive ? "Активна" : "Не активна"}
            </span>
          </div>

          <div className="col-span-1 sm:block hidden text-sm text-gray-900">
            {card.order}
          </div>

          <div className="col-span-3 text-sm font-mono text-gray-900 break-all sm:break-normal">
            {formatCardNumber(card.cardNumber, true)}
          </div>

          <div className="col-span-2 hidden sm:block">
            <span
              className={`px-2 py-1 text-xs rounded ${
                card.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {card.isActive ? "Активна" : "Не активна"}
            </span>
          </div>

          <div className="col-span-3 text-sm text-gray-900">
            {card.owner ? (
              <div className="flex flex-col sm:block">
                <div className="truncate max-w-[150px] sm:max-w-none">
                  {card.owner.surname} {card.owner.name}
                </div>
                <div className="text-xs text-gray-500 truncate max-w-[150px] sm:max-w-none">
                  {card.owner.phoneNumber}
                </div>
              </div>
            ) : (
              <span className="text-gray-400">Свободна</span>
            )}
          </div>

          <div className="col-span-2 text-xs sm:text-sm text-gray-500">
            {new Date(card.createdAt).toLocaleDateString("ru-RU")}
          </div>

          <div className="col-span-1 text-sm text-gray-500">
            <div className="flex gap-3 sm:gap-2 justify-end sm:justify-center">
              <button
                onClick={() => onToggleActive(card)}
                className={`${card.isActive ? "text-orange-600 hover:text-orange-900" : "text-green-600 hover:text-green-900"} cursor-pointer p-1 sm:p-0`}
                title={
                  card.isActive ? "Деактивировать карту" : "Активировать карту"
                }
              >
                {card.isActive ? (
                  <Power className="h-5 w-5 sm:h-4 sm:w-4" />
                ) : (
                  <PowerOff className="h-5 w-5 sm:h-4 sm:w-4" />
                )}
              </button>

              <button
                onClick={() => onDelete(card)}
                className="text-red-600 hover:text-red-900 cursor-pointer p-1 sm:p-0"
                title="Удалить карту"
              >
                <Trash2 className="h-5 w-5 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
