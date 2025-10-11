"use client";

import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#f9f4e2] mt-10 md:mt-15 xl:mt-20 bg-[url('/images/graphics/pattern-footer.png')] px-[max(12px,calc((100%-1208px)/2))] w-full">
      <div className="px-7 py-10 grid-container gap-6 text-main-text md:gap-x-10 items-center">
        {/* Логотип со ссылкой на главную */}
        <div className="logo">
          <Link href="/" className="relative w-23 h-16 md:w-16 md:h-11 block">
            <Image
              src="/icons-footer/logo-footer.png"
              alt="Логотип"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </Link>
        </div>

        <div className="social flex flex-row gap-x-5 md:flex-col xl:flex-row gap-y-3 justify-between">
          <div className="flex gap-x-5 items-start">
            <a href="https://vk.com" target="_blank" rel="noopener noreferrer">
              <Image
                src="/icons-footer/VK.svg"
                alt="VKontakte"
                width={24}
                height={24}
                className="hover:opacity-80 transition-opacity duration-300"
              />
            </a>
            <a href="https://ok.ru" target="_blank" rel="noopener noreferrer">
              <Image
                src="/icons-footer/OK.svg"
                alt="Odnoklassniki"
                width={24}
                height={24}
                className="hover:opacity-80 transition-opacity duration-300"
              />
            </a>
          </div>
          <div className="flex gap-x-5 items-start">
            <a
              href="https://wa.me/78007773333"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons-footer/wa.svg"
                alt="WhatsApp"
                width={24}
                height={24}
                className="hover:opacity-80 transition-opacity duration-300"
              />
            </a>
            <a
              href="https://t.me/alexeirybak"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons-footer/telegram.svg"
                alt="Telegram"
                width={24}
                height={24}
                className="hover:opacity-80 transition-opacity duration-300"
              />
            </a>
          </div>
        </div>

        <div className="phone">
          <a
            href="tel:+78007773333"
            className="flex items-center gap-x-2 hover:opacity-80 transition-opacity duration-300"
          >
            <Image
              src="/icons-footer/phone.svg"
              alt="Позвонить по телефону"
              width={20}
              height={20}
              className="hover:opacity-80 transition-opacity duration-300"
            />
            <p className="text-base hover:text-black duration-300">
              8 800 777 33 33
            </p>
          </a>
        </div>

        <nav className="nav">
          <ul className="flex flex-wrap gap-x-8 text-xs gap-4 xl:gap-y-2 md:gap-x-10">
            <li className="hover:text-black cursor-pointer">
              <Link href="#">О компании</Link>
            </li>
            <li className="hover:text-black cursor-pointer">
              <Link href="#">Контакты</Link>
            </li>
            <li className="hover:text-black cursor-pointer">
              <Link href="#">Вакансии</Link>
            </li>
            <li className="hover:text-black cursor-pointer">
              <Link href="#">Статьи</Link>
            </li>
            <li className="hover:text-black cursor-pointer">
              Политика обработки персональных данных
            </li>
          </ul>
        </nav>

        {/* Дизайнер (без изменений) */}
        <div className="design">
          <a href="https://zasovskiy.ru/" target="_blank">
            <Image
              src="/icons-footer/design.png"
              alt="Дизайнер"
              width={152}
              height={18}
            />
          </a>
        </div>
      </div>

      <style jsx>{`
        /* Базовые стили для мобильных (mobile-first) */
        .grid-container {
          display: grid;
          grid-template-areas:
            "logo social"
            "logo phone"
            "nav nav"
            "design design";
          grid-template-columns: 1fr 1fr;
        }

        .logo {
          grid-area: logo;
        }
        .social {
          grid-area: social;
          justify-self: end;
        }
        .phone {
          grid-area: phone;
          justify-self: end;
        }
        .nav {
          grid-area: nav;
        }
        .design {
          grid-area: design;
        }

        /* Средние экраны (768px и больше) */
        @media (min-width: 768px) {
          .grid-container {
            grid-template-areas:
              "logo nav social phone"
              "logo nav social design";
            grid-template-columns: auto 1fr auto auto;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
