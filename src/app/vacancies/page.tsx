import { Metadata } from "next";
import Image from "next/image";
import { baseUrl } from "../../../utils/baseUrl";

export const metadata: Metadata = {
  title: "Вакансии | Северяночка - работа в сети магазинов",
  description:
    "Актуальные вакансии в компании Северяночка. Продавец-кассир, администратор, товаровед, грузчик, мерчандайзер и другие. Официальное трудоустройство, стабильная зарплата, дружный коллектив.",
  keywords:
    "вакансии, работа, Северяночка, продавец-кассир, администратор, товаровед, грузчик, мерчандайзер, уборщица, трудоустройство, Архангельск",
  alternates: {
    canonical: `${baseUrl}/vacancies`,
  },
  openGraph: {
    title: "Вакансии | Северяночка",
    description:
      "Работа в сети магазинов Северяночка. Актуальные вакансии с официальным трудоустройством и стабильной зарплатой.",
    url: `${baseUrl}/vacancies`,
    siteName: "Северяночка",
    images: [
      {
        url: "/og-images/vacancies-og.jpg",
        width: 512,
        height: 512,
        alt: "Вакансии Северяночка",
      },
    ],
  },
};

export default function VacanciesPage() {
  return (
    <section className="w-full mx-auto px-[max(12px,calc((100%-1208px)/2))]">
      <div className="w-full text-main-text">
        <h1 className="text-4xl md:text-5xl lg:text-[64px] font-bold leading-[150%] mb-8 чдЖьи-15">
          Вакансии
        </h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-10">
          <div className="flex flex-col p-4 bg-white md:p-6 lg:p-8 shadow-vacation gap-y-4">
            <h2 className="text-xl font-bold md:text-lg lg:text-2xl">
              Продавец-кассир
            </h2>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Требования</p>
              <p className="text-xs lg:text-base">
                Опыт работы от 6 месяцев (приветствуется). Уверенный
                пользователь ПК и кассовой программы. Навыки работы с наличными
                и безналичными расчетами. Ответственность, внимательность,
                стрессоустойчивость. Наличие медицинской книжки (оформление за
                счет компании).
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Обязанности</p>
              <p className="text-xs lg:text-base">
                Обслуживание покупателей на кассе. Консультирование по
                ассортименту и акциям. Выкладка товара и контроль сроков
                годности. Участие в инвентаризациях. Поддержание чистоты на
                рабочем месте.
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Условия</p>
              <p className="text-xs lg:text-base">
                График 2/2 с 9:00 до 21:00. Официальное трудоустройство. Белая
                заработная плата 45 000–55 000 руб. Скидка на товары магазина
                10%. Дружный коллектив.
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Звоните</p>
              <div className="flex gap-2.5 items-center">
                <Image
                  src="/images/contacts/icon-phone.svg"
                  alt="Телефон"
                  width={30}
                  height={30}
                  className="w-6 h-6 lg:w-7.5 lg:h-7.5 object-contain"
                />
                <p className="text-xs underline lg:text-xl">+7 904 271 35 90</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col p-4 bg-white md:p-6 lg:p-8 shadow-vacation gap-y-4">
            <h2 className="text-xl font-bold md:text-lg lg:text-2xl">
              Администратор магазина
            </h2>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Требования</p>
              <p className="text-xs lg:text-base">
                Высшее или среднее специальное образование. Опыт работы в
                розничной торговле от 1 года. Опыт управления небольшим
                коллективом. Знание кассовой дисциплины и работы с товаром.
                Лидерские качества и умение решать конфликты.
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Обязанности</p>
              <p className="text-xs lg:text-base">
                Координация работы смены. Контроль выкладки товара и наличия
                ценников. Открытие и закрытие смены, работа с кассой. Обучение и
                адаптация новых сотрудников. Взаимодействие с проверяющими
                органами.
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Условия</p>
              <p className="text-xs lg:text-base">
                График 5/2 (плавающие выходные). Работа в стабильной компании.
                Зарплата 55 000–70 000 руб. (оклад + бонусы). Карьерный рост до
                директора магазина. Премии по результатам работы.
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Звоните</p>
              <div className="flex gap-2.5 items-center">
                <Image
                  src="/images/contacts/icon-phone.svg"
                  alt="Телефон"
                  width={30}
                  height={30}
                  className="w-6 h-6 lg:w-7.5 lg:h-7.5 object-contain"
                />
                <p className="text-xs underline lg:text-xl">+7 904 271 35 90</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col p-4 bg-white md:p-6 lg:p-8 shadow-vacation gap-y-4">
            <h2 className="text-xl font-bold md:text-lg lg:text-2xl">
              Товаровед
            </h2>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Требования</p>
              <p className="text-xs lg:text-base">
                Профильное образование (товароведение). Опыт работы от 1 года.
                Знание 1С и документооборота. Внимательность к деталям. Навыки
                работы с претензиями и возвратами.
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Обязанности</p>
              <p className="text-xs lg:text-base">
                Приемка и учет товара. Контроль качества и сроков годности.
                Работа с документацией и сертификатами. Взаимодействие с
                поставщиками. Участие в проведении инвентаризаций.
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Условия</p>
              <p className="text-xs lg:text-base">
                Полный день, график 5/2 с 9:00 до 18:00. Оформление по ТК РФ.
                Зарплата 50 000–65 000 руб. Комфортный офис при магазине.
                Корпоративная связь.
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Звоните</p>
              <div className="flex gap-2.5 items-center">
                <Image
                  src="/images/contacts/icon-phone.svg"
                  alt="Телефон"
                  width={30}
                  height={30}
                  className="w-6 h-6 lg:w-7.5 lg:h-7.5 object-contain"
                />
                <p className="text-xs underline lg:text-xl">+7 904 271 35 90</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col p-4 bg-white md:p-6 lg:p-8 shadow-vacation gap-y-4">
            <h2 className="text-xl font-bold md:text-lg lg:text-2xl">
              Грузчик-комплектовщик
            </h2>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Требования</p>
              <p className="text-xs lg:text-base">
                Физическая выносливость. Ответственность и аккуратность.
                Готовность к работе с товарами разного веса. Наличие медицинской
                книжки (можно оформить).
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Обязанности</p>
              <p className="text-xs lg:text-base">
                Разгрузка/погрузка товара. Перемещение товара в торговый зал и
                склад. Комплектация заказов. Соблюдение техники безопасности.
                Поддержание порядка на складе.
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Условия</p>
              <p className="text-xs lg:text-base">
                График работы: сменный (2/2 или 3/3). Официальное
                трудоустройство. Зарплата от 40 000 до 50 000 руб. Полное
                обеспечение спецодеждой. Горячие обеды.
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Звоните</p>
              <div className="flex gap-2.5 items-center">
                <Image
                  src="/images/contacts/icon-phone.svg"
                  alt="Телефон"
                  width={30}
                  height={30}
                  className="w-6 h-6 lg:w-7.5 lg:h-7.5 object-contain"
                />
                <p className="text-xs underline lg:text-xl">+7 904 271 35 90</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col p-4 bg-white md:p-6 lg:p-8 shadow-vacation gap-y-4">
            <h2 className="text-xl font-bold md:text-lg lg:text-2xl">
              Мерчандайзер
            </h2>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Требования</p>
              <p className="text-xs lg:text-base">
                Опыт работы мерчандайзером (желателен). Внимательность к
                деталям. Аккуратность и ответственность. Готовность к физической
                активности в течение дня. Навыки визуального мерчандайзинга.
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Обязанности</p>
              <p className="text-xs lg:text-base">
                Выкладка товара согласно планограммам. Контроль наличия ценников
                и акционного оформления. Ротация товара (свежий товар вперед).
                Отслеживание остатков и формирование заказов. Своевременное
                обновление цен.
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Условия</p>
              <p className="text-xs lg:text-base">
                Гибкий график (возможна частичная занятость). Работа в
                нескольких магазинах сети. Зарплата 35 000–45 000 руб. на полный
                день. Оплата проезда. Обучение за счет компании.
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Звоните</p>
              <div className="flex gap-2.5 items-center">
                <Image
                  src="/images/contacts/icon-phone.svg"
                  alt="Телефон"
                  width={30}
                  height={30}
                  className="w-6 h-6 lg:w-7.5 lg:h-7.5 object-contain"
                />
                <p className="text-xs underline lg:text-xl">+7 904 271 35 90</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col p-4 bg-white md:p-6 lg:p-8 shadow-vacation gap-y-4">
            <h2 className="text-xl font-bold md:text-lg lg:text-2xl">
              Уборщица/уборщик торговых помещений
            </h2>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Требования</p>
              <p className="text-xs lg:text-base">
                Аккуратность и добросовестность. Опыт уборки общественных
                помещений (приветствуется). Знание средств и инвентаря для
                уборки. Физическая возможность выполнять работу.
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Обязанности</p>
              <p className="text-xs lg:text-base">
                Уборка торгового зала и подсобных помещений. Мытье полов,
                протирка пыли, очистка поверхностей. Санитарная обработка
                санузлов. Вынос мусора. Контроль наличия расходных материалов.
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Условия</p>
              <p className="text-xs lg:text-base">
                Утренние или вечерние смены (можно совмещать). Частичная или
                полная занятость. Зарплата 30 000–40 000 руб. Инвентарь и
                средства предоставляются. Удобный график, работа рядом с домом.
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-sm md:text-base lg:text-lg">Звоните</p>
              <div className="flex gap-2.5 items-center">
                <Image
                  src="/images/contacts/icon-phone.svg"
                  alt="Телефон"
                  width={30}
                  height={30}
                  className="w-6 h-6 lg:w-7.5 lg:h-7.5 object-contain"
                />
                <p className="text-xs underline lg:text-xl">+7 904 271 35 90</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
