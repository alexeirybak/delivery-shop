import Image from "next/image";

const CartButton = () => {
  return (
    <button className="mb-2 h-10 md:h-15 w-full bg-[#ff6633] text-white text-base md:text-2xl p-4 flex justify-center items-center rounded hover:shadow-article active:shadow-button-active duration-300 cursor-pointer relative">
      <Image
        src="/icons-products/icon-shopping-cart.svg"
        alt="Корзина"
        width={32}
        height={32}
        className="absolute left-4" 
      />

      <p className="text-center">В корзину</p>
    </button>
  );
};

export default CartButton;