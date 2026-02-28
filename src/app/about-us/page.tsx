import Image from "next/image";
import { Metadata } from "next";
import { baseUrl } from "../../../utils/baseUrl";

export const metadata: Metadata = {
  title: "О компании Северяночка | Наша история и миссия",
  description:
    "Узнайте больше о компании Северяночка. Более 20 лет на рынке розничной торговли. Мы предлагаем качественные продукты местного производства по доступным ценам.",
  keywords:
    "о компании, Северяночка, история, миссия, розничная торговля, местные продукты, качественные товары",
  alternates: {
    canonical: `${baseUrl}/about-us`,
  },
  openGraph: {
    title: "О компании Северяночка",
    description:
      "Более 20 лет мы заботимся о наших клиентах и предлагаем лучшие местные продукты",
    url: `${baseUrl}/about-us`,
    siteName: "Северяночка",
    images: {
      url: "/og-images/about-us-og.jpg",
      width: 512,
      height: 512,
      alt: "О компании Северяночка",
    },
  },
};

const AboutUsPage = () => {
  return (
    <section className="md:mx-4 xl:mx-12 text-main-text">
      <div className="relative mb-20 md:mb-25 lg:mb-30">
        <div className="hidden md:block absolute z-4 w-full h-full max-w-[1345px] max-h-[400px] inset-0">
          <Image
            src="/images/about-us/bg-top.png"
            alt="О нас"
            fill
            className="object-contain"
          />
        </div>
        <div className="md:hidden absolute z-4 w-full h-full inset-0">
          <Image
            src="/images/about-us/bg-top-mob.png"
            alt="О нас"
            fill
            className="object-contain"
          />
        </div>

        <div className="px-[max(12px,calc((100%-1208px)/2))] flex flex-col mx-auto relative xl:block">
          <div className="max-w-[669px] w-full relative z-5 xl:ml-10 mt-10">
            <h1 className="text-4xl md:text-5xl lg:text-[64px] font-bold leading-[150%] mb-1 xl:mb-4">
              О компании
            </h1>
            <p className="hidden xl:block font-bold text-[#ff6633] text-2xl max-w-[669px]">
              Мы непрерывно развиваемся и <br />
              работаем над совершенствованием сервиса, заботимся о наших
              клиентах, <br />
              стремимся к лучшему будущему.
            </p>
            <p className="xl:hidden font-bold text-[#ff6633] text-sm md:text-lg max-w-[669px]">
              Мы непрерывно развиваемся и <br />
              работаем над совершенствованием сервиса, заботимся о наших
              клиентах, стремимся к лучшему будущему.
            </p>
          </div>

          <div className="-mt-12 mx-auto xl:mt-0 xl:absolute xl:right-0 xl:top-5 xl:w-[669px] xl:h-[371px] transform xl:-translate-x-15 overflow-hidden">
            <div className="xl:absolute inset-0 bg-[url('/images/about-us/bg-right.png')] w-[330px] h-[187px] sm:w-[400px] sm:h-[220px] md:w-[669px] md:h-[371px] bg-cover bg-center bg-no-repeat mx-auto"></div>

            <div className="mx-auto xl:inset-0 z-1 w-[316px] h-[138px] sm:w-[372px] sm:h-[162px] md:w-[622px] md:h-[274px] top-42 md:top-63 xl:top-25 xl:left-auto xl:right-0 xl:translate-x-0 absolute overflow-hidden left-1/2 -translate-x-1/2">
              <Image
                src="/images/about-us/people.png"
                alt="Наша компания"
                fill
                className="object-cover"
                sizes="(max-width: 360px) 316px, (max-width: 768px) 372px, 622px"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-3 text-sm flex flex-col gap-y-4 md:gap-y-8 mb-20 md:mb-25 lg:mb-30">
        <div className="flex flex-col md:flex-row gap-y-4 md:gap-x-8">
          <div className="flex gap-x-2.5 items-start">
            <Image
              src="/images/about-us/check.svg"
              alt="Наша компания"
              width={30}
              height={30}
              className="shrink-0"
            />
            <div className="flex flex-col gap-y-2 flex-1 wrap-break-word">
              <p className="lg:text-xl">Мы занимаемся розничной торговлей.</p>
              <p className="md:text-lg lg:text-2xl">
                <b>Более 20 лет.</b>
              </p>
            </div>
          </div>
          <div className="flex gap-x-2.5 items-start">
            <Image
              src="/images/about-us/check.svg"
              alt="Наша компания"
              width={30}
              height={30}
              className="shrink-0"
            />
            <div className="flex flex-col gap-y-2 flex-1 wrap-break-word">
              <p className="lg:text-xl">Основная миссия компании</p>
              <p className="md:text-lg lg:text-2xl">
                <b>Максимальное качество товаров и услуг по доступной цене.</b>
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-x-2.5 items-start">
          <Image
            src="/images/about-us/check.svg"
            alt="Наша компания"
            width={30}
            height={30}
            className="shrink-0"
          />
          <div className="flex flex-col gap-y-2 flex-1 wrap-break-word">
            <p className="lg:text-xl">Отличительная черта нашей сети</p>
            <p className="md:text-lg lg:text-2xl">
              <b>
                Здоровая и полезная продукция местного производства в наших
                магазинах.
              </b>
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center gap-x-18">
        <div className="relative w-17 md:w-[113px] md:h-[92px] lg:w-[127px] lg:h-[103px] h-14 mx-auto md:mx-0 mb-14.5 md:mb-0">
          <Image
            alt="Логотип"
            loading="lazy"
            fill
            src="/icons-header/icon-logo.svg"
            className="object-contain"
          />
        </div>
        <div className="relative">
          <div className="px-10 py-5 lg:py-7.5 w-[290px] md:w-auto h-[82px] md:h-auto md:max-w-[351px] lg:max-w-[805px] text-sm md:text-lg lg:text-2xl text-primary font-bold bg-[#e5ffde] rounded-lg flex items-center text-center mx-auto">
            Спасибо за то, что вы с нами. Северяночка, везет всегда!
          </div>
          <Image
            alt="Фигура"
            loading="lazy"
            width={41}
            height={40}
            src="/images/about-us/rectangle.svg"
            className="absolute left-1/2 -translate-x-[calc(50%+20px)] -top-10 md:right-1/2 md:top-6 md:left-0 md:-rotate-90"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUsPage;
