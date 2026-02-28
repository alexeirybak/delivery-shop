import Image from "next/image";

const SpecialOffers = () => {
  return (
    <section>
      <div className="flex flex-col justify-between mb-4 md:mb-8 xl:mb-10 text-main-text">
        <div className="flex flex-col gap-4 md:w-[737px] xl:w-full mx-auto">
          <h2 className="mb-4 text-2xl font-bold text-left xl:text-4xl md:mb-8">
            Специальные предложения
          </h2>
          <div className="flex flex-col items-center gap-4 md:flex-row xl:w-auto ">
            <button className="text-left flex flex-row pt-5 pl-5 rounded bg-[#FCD5BA] w-full max-w-[336px] md:max-w-[352px] xl:max-w-[584px] h-[170px] xl:h-50 hover:shadow-card-shop transition-custom relative overflow-hidden cursor-pointer">
              <div className="flex flex-col gap-1.5 w-[174px] xl:w-[258px] ">
                <p className="text-xl font-bold xl:text-2xl">
                  Оформите карту «Северяночка»
                </p>
                <p className="text-xs xl:text-base">
                  И получайте бонусы при покупке в магазинах и на сайте
                </p>
              </div>
              <Image
                src="/images/banners/banner-card-image.png"
                alt="Оформите карту"
                width={220}
                height={110}
                className="absolute w-auto h-auto -top-3 -right-18.5 xl:-right-4 xl:-top-8 xl:w-[330px] xl:h-auto"
              />
            </button>
            <button className="relative w-full md:w-[353px] xl:w-[584px] h-[170px] xl:h-[200px] rounded overflow-hidden cursor-pointer hover:shadow-button-default transition-custom">
              <div className="relative w-full h-full xl:hidden">
                <Image
                  src="/images/banners/banner-action-mob-tab.jpeg"
                  alt="Акционные товары"
                  fill
                  className="object-cover w-full h-full rounded"
                  priority
                  sizes="(max-width: 767px) 100vw, 353px"
                />
              </div>

              <div className="relative hidden w-full h-full xl:block">
                <Image
                  src="/images/banners/banner-action-desk.jpeg"
                  alt="Акционные товары"
                  fill
                  className="object-cover w-full h-full rounded"
                  priority
                  sizes="(max-width: 767px) 100vw, 353px"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
