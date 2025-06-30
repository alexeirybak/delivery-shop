interface LoaderProps {
  text?: string;
  className?: string;
}
 
export const Loader = ({ text = "", className = "" }: LoaderProps) => (
  <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
    <div className="relative w-12 h-12">
      <div className="w-full h-full border-4 border-orange-500 border-t-transparent rounded-full animate-spin absolute"></div>
      <div className="w-full h-full border-4 border-orange-500 border-b-transparent rounded-full animate-spin-reverse absolute"></div>
    </div>
    {text && <p className="text-(--color-primary)">Загрузка {text}...</p>}
  </div>
);