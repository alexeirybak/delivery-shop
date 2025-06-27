import Actions from "./(products)/Actions";
import Articles from "./(articles)/Articles";
import Maps from "@/components/Maps";
import NewProducts from "./(products)/NewProducts";
import Purchases from "./(user)/Purchases";
import Slider from "@/components/slider/Slider";
import SpecialOffers from "@/components/SpecialOffers";

export default function Home() {
  return (
    <main className="w-full mx-auto mb-20">
      <Slider />
      <div className="px-[max(12px,calc((100%-1208px)/2))] flex flex-col gap-y-20 md:mb-25 xl:mb-30">
        <Actions />
        <NewProducts />
        <Purchases />
        <SpecialOffers />
        <Maps />
        <Articles />
      </div>
    </main>
  );
}
