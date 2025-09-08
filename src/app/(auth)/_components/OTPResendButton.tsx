"use client";

const OTPResendCode = ({
  canResend,
  timeLeft,
  onResendAction,
}: {
  canResend: boolean;
  timeLeft: number;
  onResendAction: () => void;
}) => {
  return !canResend ? (
    <p className="text-[#414141] text-xs text-center">
      Запросить код повторно можно через{" "}
      <span className="font-bold">{timeLeft} секунд</span>
    </p>
  ) : (
    <button
      onClick={onResendAction}
      disabled={!canResend}
      className={`text-xs underline cursor-pointer text-center ${
        canResend ? "text-[#ff6633]" : "text-gray-400 cursor-not-allowed"
      }`}
    >
      Отправить еще раз
    </button>
  );
};

export default OTPResendCode;
