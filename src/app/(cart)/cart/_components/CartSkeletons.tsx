const CartSkeletons = () => {
  return (
    <div className="bg-white rounded flex shadow-cart-item animate-pulse">
      <div className="w-6 h-6 bg-gray-200 rounded absolute -top-3 left-4"></div>

      <div className="flex flex-row flex-wrap md:flex-row justify-between w-full md:flex-nowrap">
        <div className="flex flex-row flex-wrap md:flex-nowrap">
          <div className="w-24 h-24 bg-gray-200 rounded m-2.5"></div>

          <div className="flex-1 flex min-w-[224px] md:flex-initial flex-col gap-y-2.5 p-2.5">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            
            <div className="flex flex-row gap-x-2 items-center">
              <div className="h-7 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded w-12"></div>
            </div>
            
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-2 w-full p-2 md:flex-nowrap md:flex-col md:justify-normal md:items-end xl:flex-row xl:items-start xl:justify-end">
          <div className="flex items-center gap-2 w-32 h-10 bg-gray-200 p-2 rounded-lg">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
            <div className="w-16 h-6 bg-gray-300 rounded"></div>
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          </div>
          
          <div className="w-26 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default CartSkeletons;