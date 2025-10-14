const DeliveryTimeSkeletons = () => {
  return (
    <div>
      <div className="h-8 xl:h-9 bg-gray-200 rounded mb-6 w-32 animate-pulse"></div>

      <div className="flex flex-col gap-y-4 md:flex-row md:flex-nowrap md:gap-x-8 xl:gap-x-10">
        <div className="flex flex-col">
          <div className="h-5 bg-gray-200 rounded mb-2 w-12 animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded w-full md:w-[155px] animate-pulse"></div>
        </div>

        <div className="flex flex-col w-full">
          <div className="h-5 bg-gray-200 rounded mb-2 w-12 animate-pulse"></div>
          <div className="grid grid-cols-3 xl:grid-cols-4 gap-2 w-full">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 rounded animate-pulse"
                style={{
                  animationDelay: `${i * 100}ms`,
                  animationDuration: "1.5s",
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTimeSkeletons;
