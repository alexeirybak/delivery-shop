import Image from "next/image";
import bannerCard from "/public/images/banners/banner-card-image.png";
import bannerActionMobTab from "/public/images/banners/banner-action-mob-tab.jpeg";
import bannerActionDesk from "/public/images/banners/banner-action-desk.jpeg";

const SpecialOffers = () => {
  return (
    <section>
      <div className="flex flex-col mb-4 md:mb-8 xl:mb-10 justify-between text-[#414141]">
        <div className="flex flex-col gap-4 md:w-[737px] xl:w-full mx-auto">
          <h2 className="text-2xl xl:text-4xl text-left font-bold mb-4 md:mb-8">
            Специальные предложения
          </h2>
          <div className="flex flex-col md:flex-row gap-4 items-center xl:w-auto ">
             {/* Баннер с картой - всегда видим */}
            <button className="text-left flex flex-row pt-5 pl-5 rounded bg-[#FCD5BA] w-full max-w-[336px] md:max-w-[352px] xl:max-w-[584px] h-[170px] xl:h-50 hover:shadow-(--shadow-card-shop) duration-300 relative overflow-hidden cursor-pointer">
              <div className="flex flex-col gap-1.5 w-[174px] xl:w-[258px] ">
                <p className="text-xl xl:text-2xl font-bold">
                  Оформите карту «Северяночка»
                </p>
                <p className="text-xs xl:text-base">
                  И получайте бонусы при покупке в магазинах и на сайте
                </p>
              </div>
              <Image
                src={bannerCard}
                alt="Оформите карту"
                width={220}
                height={110}
                className="absolute w-auto h-auto -top-3 -right-18.5 xl:-right-4 xl:-top-8 xl:w-[330px] xl:h-auto"
              />
            </button>
            <button className="relative w-full md:w-[353px] xl:w-[584px] h-[170px] xl:h-[200px] rounded overflow-hidden cursor-pointer hover:shadow-(--shadow-button-default) duration-300">
              {/* Баннер акций - мобильная/планшетная версия */}
              <div className="xl:hidden w-full h-full">
                <Image
                  src={bannerActionMobTab}
                  alt="Акционные товары"
                  width={353}
                  height={170}
                  className="w-full h-full object-cover rounded"
                  priority
                />
              </div>

              {/* Баннер акций - десктопная версия */}
              <div className="hidden xl:block w-full h-full">
                <Image
                  src={bannerActionDesk}
                  alt="Акционные товары"
                  width={584}
                  height={200}
                  className="w-full h-full object-cover rounded"
                  priority
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
