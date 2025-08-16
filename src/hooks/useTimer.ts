import { useEffect, useState } from "react";

const useTimer = (initialTime: number) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    if (!isTimerActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerActive(false);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive]);

  const startTimer = () => {
    setTimeLeft(initialTime);
    setIsTimerActive(true);
  };

  return { timeLeft, canResend: !isTimerActive, startTimer };
};

export default useTimer;
