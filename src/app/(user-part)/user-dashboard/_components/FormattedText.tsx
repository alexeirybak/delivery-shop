export const FormattedText = ({ text, isStreaming }: { text: string; isStreaming: boolean }) => {
  if (isStreaming) {
    return <>{text}</>;
  }
  
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={index}>{part.slice(1, -1)}</em>;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};