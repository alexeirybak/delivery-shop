"use client";

import { YMaps } from "@iminside/react-yandex-maps";
import { useState } from "react";
import Locations from "@/components/Locations";
import MapView from "@/components/MapView";
import Image from "next/image";

export const ContactsContent = () => {
  const [currentLocation, setCurrentLocation] = useState("archangelsk");

  return (
    <section className="w-full mx-auto px-[max(12px,calc((100%-1208px)/2))]">
      <div className="text-main-text w-full">
        <h1 className="text-4xl md:text-5xl lg:text-[64px] font-bold leading-[150%] mb-10">
          Контакты
        </h1>
        <div className="text-xl md:text-lg lg:text-2xl mb-20 md:mb-25 xl:mb-30 flex flex-wrap gap-y-4 gap-x-10 lg:gap-20">
          <div>
            <div className="flex gap-1.5 items-start">
              <Image
                src="/images/contacts/icon-home.svg"
                alt="Бухгалтерия, склад"
                width={30}
                height={30}
              />
              <div>
                <p className="mb-4">Бухгалтерия, склад</p>
                <p className="underline font-bold">+7 8182 692619</p>
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 items-start">
            <Image
              src="/images/contacts/icon-percent.svg"
              alt="Вопросы по системе лояльности"
              width={30}
              height={30}
            />
            <div>
              <p className="mb-4">Вопросы по системе лояльности</p>
              <p className="underline font-bold">+7 911 716 33 97</p>
            </div>
          </div>
        </div>

        <YMaps
          query={{
            lang: "ru_RU",
            apikey: "1ac61b8a-843f-454f-abd8-a651a3c60f00",
            load: "package.full",
          }}
        >
          <div className="flex flex-col justify-center xl:max-w-[1208px] text-main-text">
            <h2 className="mb-4 md:mb-8 xl:mb-10 text-2xl xl:text-4xl text-left font-bold">
              Наши магазины
            </h2>

            <Locations
              currentLocation={currentLocation}
              onLocationChange={setCurrentLocation}
            />
            <div className="flex flex-col md:flex-row xl:gap-x-20 mt-3 mb-4 md:mb-8 text-lg md:gap-x-6 gap-y-4">
              <div className="flex md:flex-row gap-8 md:gap-x-6 xl:gap-x-20  md:justify-between">
                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-1.5 items-start">
                    <Image
                      src="/images/contacts/market1.svg"
                      alt="Восход"
                      width={146}
                      height={20}
                      className="shrink-0"
                    />
                  </div>
                  <div className="flex gap-x-2">
                    <Image
                      src="/images/contacts/icon-home.svg"
                      alt="Восход"
                      width={30}
                      height={30}
                      className="w-6 h-6 lg:w-7.5 lg:h-7.5 object-contain"
                    />

                    <p className="text-sm md:text-base lg:text-lg">
                      ул. Дорожная, 13
                    </p>
                  </div>
                  <div className="flex gap-x-2">
                    <Image
                      src="/images/contacts/icon-phone.svg"
                      alt="Восход"
                      width={30}
                      height={30}
                      className="w-6 h-6 lg:w-7.5 lg:h-7.5 object-contain"
                    />

                    <p className="text-sm md:text-base lg:text-lg underline">
                      +7 904 271 35 90
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-1.5 items-start">
                    <Image
                      src="/images/contacts/market2.svg"
                      alt="Восход"
                      width={146}
                      height={20}
                      className="shrink-0"
                    />
                  </div>
                  <div className="flex gap-x-2">
                    <Image
                      src="/images/contacts/icon-home.svg"
                      alt="Восход"
                      width={30}
                      height={30}
                      className="w-6 h-6 lg:w-7.5 lg:h-7.5 object-contain"
                    />

                    <p className="text-sm md:text-base lg:text-lg">
                      ул. Тимме, 9
                    </p>
                  </div>
                  <div className="flex gap-x-2">
                    <Image
                      src="/images/contacts/icon-phone.svg"
                      alt="Восход"
                      width={30}
                      height={30}
                      className="w-6 h-6 lg:w-7.5 lg:h-7.5 object-contain"
                    />

                    <p className="text-sm md:text-base lg:text-lg underline">
                      +7 8182 691330
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex md:flex-row gap-8 md:gap-x-6 xl:gap-x-20 md:justify-between">
                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-1.5 items-start">
                    <Image
                      src="/images/contacts/market3.svg"
                      alt="Парус"
                      width={146}
                      height={20}
                      className="shrink-0"
                    />
                  </div>
                  <div className="flex gap-x-2">
                    <Image
                      src="/images/contacts/icon-home.svg"
                      alt="Парус"
                      width={30}
                      height={30}
                      className="w-6 h-6 lg:w-7.5 lg:h-7.5 object-contain"
                    />

                    <p className="text-sm md:text-base lg:text-lg">
                      ул. Заводская, 16
                    </p>
                  </div>
                  <div className="flex gap-x-2">
                    <Image
                      src="/images/contacts/icon-phone.svg"
                      alt="Рябинушка"
                      width={30}
                      height={30}
                      className="w-6 h-6 lg:w-7.5 lg:h-7.5 object-contain"
                    />

                    <p className="text-sm md:text-base lg:text-lg underline">
                      +7 904 271 35 90
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-1.5 items-start">
                    <Image
                      src="/images/contacts/market4.svg"
                      alt="Пелысь"
                      width={146}
                      height={20}
                      className="shrink-0"
                    />
                  </div>
                  <div className="flex gap-x-2">
                    <Image
                      src="/images/contacts/icon-home.svg"
                      alt="Пелысь"
                      width={30}
                      height={30}
                      className="w-6 h-6 lg:w-7.5 lg:h-7.5 object-contain"
                    />

                    <p className="text-sm md:text-base lg:text-lg">
                      ул. Рабочая, д. 1
                    </p>
                  </div>
                  <div className="flex gap-x-2">
                    <Image
                      src="/images/contacts/icon-phone.svg"
                      alt="Пелысь"
                      width={30}
                      height={30}
                      className="w-6 h-6 lg:w-7.5 lg:h-7.5 object-contain"
                    />

                    <p className="text-sm md:text-base lg:text-lg underline">
                      +7 82140 91300
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <MapView currentLocation={currentLocation} />
          </div>
        </YMaps>
      </div>
    </section>
  );
};

