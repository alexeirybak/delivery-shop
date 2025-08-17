"use client";

export const OtpResendButton = ({
  canResend,
  timeLeft,
  onResendAction,
  isLoading,
}: {
  canResend: boolean;
  timeLeft: number;
  onResendAction: () => void;
  isLoading?: boolean;
}) => {
  return !canResend ? (
    <p className="text-[#414141] text-xs text-center">
      Запросить код повторно можно через{" "}
      <span className="font-bold">{timeLeft} секунд</span>
    </p>
  ) : (
    <button
      onClick={onResendAction}
      disabled={!canResend || isLoading}
      className={`text-xs underline cursor-pointer text-center ${
        canResend ? "text-[#ff6633]" : "text-gray-400 cursor-not-allowed"
      }`}
    >
      {isLoading ? "Отправка..." : "Отправить еще раз"}
    </button>
  );
};