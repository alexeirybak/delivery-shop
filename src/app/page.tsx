import Actions from "./(products)/Actions";
import Articles from "./(articles)/Articles";
import Maps from "@/components/Maps";
import NewProducts from "./(products)/NewProducts";
import Purchases from "./(user)/Purchases";
import Slider from "@/components/slider/Slider";
import SpecialOffers from "@/components/SpecialOffers";
import { Suspense } from "react";
import { Loader } from "@/components/Loader";

export default function Home() {
  return (
    <main className="w-full mx-auto">
      <Suspense fallback={<Loader text="слайдера" />}>
        <Slider />
      </Suspense>

      <div className="px-[max(12px,calc((100%-1208px)/2))] flex flex-col gap-y-20">
        {[
          { component: <Actions />, text: "акций" },
          { component: <NewProducts />, text: "новинок" },
          { component: <Purchases />, text: "Ваших покупок" },
          { component: <SpecialOffers />, text: "специальных предложений" },
          { component: <Maps />, text: "карт" },
          { component: <Articles />, text: "статей" },
        ].map((item, index) => (
          <Suspense key={index} fallback={<Loader text={item.text} />}>
            {item.component}
          </Suspense>
        ))}
      </div>
    </main>
  );
}
