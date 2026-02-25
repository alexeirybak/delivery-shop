"use client";

import { YMaps } from "@iminside/react-yandex-maps";
import { useState } from "react";
import Locations from "./Locations";
import MapView from "./MapView";

const Maps = () => {
  const [currentLocation, setCurrentLocation] = useState("archangelsk");

  return (
    <YMaps
      query={{
        lang: "ru_RU",
        apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY,
        load: "package.full",
      }}
    >
      <section>
        <div className="flex flex-col justify-center xl:max-w-[1208px] text-main-text">
          <h2 className="mb-4 md:mb-8 xl:mb-10 text-2xl xl:text-4xl text-left font-bold">
            Наши магазины
          </h2>

          <Locations
            currentLocation={currentLocation}
            onLocationChange={setCurrentLocation}
          />

          <MapView currentLocation={currentLocation} />
        </div>
      </section>
    </YMaps>
  );
};

export default Maps;
