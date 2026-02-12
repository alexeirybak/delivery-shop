import { ImageIcon } from "lucide-react";

const CommentsTableHeader = () => {
  return (
    <div className="hidden text-[10px] lg:text-xs text-center md:grid md:grid-cols-[48px_75px_140px_100px_80px_60px] lg:grid-cols-[48px_120px_300px_120px_80px_80px] justify-between xl:grid-cols-[48px_160px_300px_150px_200px_100px] gap-2 lg:gap-4 px-6 py-2 bg-gray-50 rounded-t-lg border border-gray-200 font-medium text-gray-500 uppercase tracking-wider">
      <div className="flex justify-center">
        <ImageIcon className="w-4 h-4" />
      </div>
      <div className="text-left">Автор</div>
      <div>Комментарий</div>
      <div>Статья</div>
      <div>Дата</div>
      <div>Действия</div>
    </div>
  );
};

export default CommentsTableHeader;
