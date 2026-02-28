const CartSkeletons = () => {
  return (
    <div className="flex bg-white rounded shadow-cart-item animate-pulse">
      <div className="absolute w-6 h-6 bg-gray-200 rounded -top-3 left-4"></div>

      <div className="flex flex-row flex-wrap justify-between w-full md:flex-row md:flex-nowrap">
        <div className="flex flex-row flex-wrap md:flex-nowrap">
          <div className="w-24 h-24 bg-gray-200 rounded m-2.5"></div>

          <div className="flex-1 flex min-w-56 md:flex-initial flex-col gap-y-2.5 p-2.5">
            <div className="w-3/4 h-6 mb-2 bg-gray-200 rounded"></div>
            
            <div className="flex flex-row items-center gap-x-2">
              <div className="w-20 bg-gray-200 rounded h-7"></div>
              <div className="w-12 h-6 bg-gray-200 rounded"></div>
            </div>
            
            <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between w-full gap-2 p-2 md:flex-nowrap md:flex-col md:justify-normal md:items-end xl:flex-row xl:items-start xl:justify-end">
          <div className="flex items-center w-32 h-10 gap-2 p-2 bg-gray-200 rounded-lg">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
            <div className="w-16 h-6 bg-gray-300 rounded"></div>
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          </div>
          
          <div className="h-8 bg-gray-200 rounded w-26"></div>
        </div>
      </div>
    </div>
  );
};

export default CartSkeletons;