import { CounterProps } from "../../types";
import "../../styles/counter.css";

export const Counter = ({ wordCount, charCount }: CounterProps) => {
  return (
    <div className="counter">
      Слов: {wordCount} | Символов: {charCount}
    </div>
  );
};