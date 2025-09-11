import { RotateCw } from "lucide-react";

export const LoadingContent = ({
  title,
}: {
  title: string | React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <RotateCw className="h-10 w-10 text-[#ff6633] animate-spin" />
        <div className="absolute inset-0 rounded-full border-2 border-[#ff6633] border-opacity-20 animate-ping"></div>
      </div>
      <div className="text-center text-main-text space-y-2">
        <h3 className="text-xl font-semibold text-main-text">{title}</h3>
        <p>Пожалуйста, подождите...</p>
      </div>
    </div>
  );
};
