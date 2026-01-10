interface AdminOrdersHeaderProps {
  stats: {
    nextThreeDaysOrders: number;
  } | null;
}

const AdminOrdersHeader = ({ stats }: AdminOrdersHeaderProps) => {

  return (
    <div className="mb-6 md:mb-8 xl:mb-10 relative inline-block">
      <h1 className="text-4xl md:text-5xl xl:text-[64px] text-main-text font-bold ">
        Заказы
      </h1>
      {stats && (
        <div className="absolute -top-5 left-[calc(100%+8px)] md:left-[calc(100%+12px)] xl:left-[calc(100%+20px)] bg-[#ff6633] rounded px-2 py-1 w-9 h-8 flex justify-center items-center text-xs md:text-sm xl:text-base text-white">
          {stats.nextThreeDaysOrders}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersHeader;
