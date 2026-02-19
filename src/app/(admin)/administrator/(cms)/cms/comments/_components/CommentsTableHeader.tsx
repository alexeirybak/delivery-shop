import { ImageIcon } from "lucide-react";

const CommentsTableHeader = () => {
  return (
    <div className="hidden md:grid md:grid-cols-[48px_90px_140px_100px_80px_100px] lg:grid-cols-[48px_120px_300px_120px_80px_120px] xl:grid-cols-[48px_160px_300px_150px_200px_140px] gap-2 lg:gap-4 px-7 py-3 items-center justify-center md:justify-between">
      <div className="flex justify-center">
        <ImageIcon className="w-4 h-4" />
      </div>
      <div className="text-left">Автор</div>
      <div>Комментарий</div>
      <div>Статья</div>
      <div className="text-center">Дата</div>
      <div className="text-center">Действия</div>
    </div>
  );
};

export default CommentsTableHeader;