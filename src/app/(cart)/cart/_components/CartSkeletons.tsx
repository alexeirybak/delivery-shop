const CartSkeletons = () => {
  return (
    <div className="bg-white rounded-lg flex shadow-cart-item p-4 relative animate-pulse w-full h-20">
      <div className="w-6 h-6 bg-gray-200 rounded absolute -top-3 left-4"></div>

      <div className="w-24 h-15 bg-gray-200 rounded mr-4"></div>

      <div className="flex-1 flex flex-col justify-between py-2">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>

      <div className="flex flex-col items-end justify-between py-2">
        <div className="flex items-center gap-2 w-32 h-10 bg-gray-200 p-2 rounded-lg">
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          <div className="w-16 h-6 bg-gray-300 rounded"></div>
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
        </div>
        <div className="w-24 h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default CartSkeletons;
