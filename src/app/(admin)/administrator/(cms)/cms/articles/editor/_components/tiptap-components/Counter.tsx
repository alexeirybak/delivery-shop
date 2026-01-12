interface CounterProps {
  wordCount: number;
  charCount: number;
}

export const Counter = ({ wordCount, charCount }: CounterProps) => {
  return (
    <div className="mt-2 text-sm text-gray-500 text-right">
      Слов: {wordCount} | Символов: {charCount}
    </div>
  );
};
