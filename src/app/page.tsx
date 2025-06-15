import Actions from "@/components/Actions";
import Maps from "@/components/Maps";
import NewProducts from "@/components/NewProducts";
import Slider from "@/components/Slider/Slider";
import SpecialOffers from "@/components/SpecialOffers";

export default function Home() {
  return (
    <main className="w-full mx-auto mb-20">
      <Slider />
      <div className="px-[max(12px,calc((100%-1208px)/2))] flex flex-col gap-y-20 md:mb-25 xl:mb-30">
        <Actions />
        <NewProducts />
        <SpecialOffers />
        <Purchases />
        <Maps />
      </div>
    </main>
  );
}
