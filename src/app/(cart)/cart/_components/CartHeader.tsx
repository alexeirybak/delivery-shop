interface CartHeaderProps {
  itemCount: number;
  title: string;
}

const CartHeader = ({ itemCount, title }: CartHeaderProps) => {
  return (
    <div className="relative w-full max-w-[336px] md:w-[336px] h-24">
      <h1 className="text-4xl md:text-5xl xl:text-[64px] font-bold mb-8 md:mb-10 xl:mb-15">
        {title}
      </h1>
      {/* Немного адаптировал стили под заголовки */}
      {itemCount > 0 && (
        <div
          className={`absolute ml-5 -top-2 ${
            title === "Доставка"
              ? "right-29 md:right-15 xl:-right-5"
              : "right-33 md:right-20 xl:right-0"
          } bg-[#ff6633] rounded px-2 py-1`}
        >
          <span className="text-base text-white">{itemCount}</span>
        </div>
      )}
    </div>
  );
};

export default CartHeader;
