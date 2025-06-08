import Image from "next/image";

const SlideTwo = () => {
  return (
    <div className="mb-10 md:mb-15 xl:mb-20 h-20 md:h-40 xl:h-50 w-full relative">
      <Image
        src="/images/graphics/slide-2.jpeg"
        alt="Слайд"
        fill
        priority
        className="object-cover"
      />
    </div>
  );
};

export default SlideTwo;
