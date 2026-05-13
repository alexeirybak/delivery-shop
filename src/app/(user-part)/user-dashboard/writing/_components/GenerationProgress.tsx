interface GenerationProgressProps {
  current: number;
  total: number;
  currentSection: string;
}

export const GenerationProgress = ({
  current,
  total,
  currentSection,
}: GenerationProgressProps) => {
  const percentage = Math.round(((current - 1) / total) * 100);

  return (
    <div className="writing-progress-bar">
      <div className="writing-progress-info">
        <span>Генерация: {current} из {total}</span>
        <span>{percentage}%</span>
      </div>
      <div className="writing-progress-section">{currentSection}</div>
      <div className="writing-progress-track">
        <div
          className="writing-progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};