import { getAdminContact } from "@/actions/getAdminContact";
import {
  Shield,
  AlertTriangle,
  Heart,
  MessageSquare,
  Users,
  Flag,
  Ban,
  Link2,
  Globe,
  Clock,
  Star,
  Phone,
  Mail,
  ThumbsDown,
  HelpCircle,
  Info,
} from "lucide-react";

export default async function CommunityRulesPage() {
  const adminContact = await getAdminContact();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-linear-to-r from-green-600 to-green-800 text-white rounded">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Правила комментариев</h1>
          </div>
          <p className="text-xl max-w-3xl text-green-50">
            Мы ценим каждого читателя и стремимся создать пространство для
            уважительного и содержательного общения. Пожалуйста, соблюдайте
            простые правила.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-start gap-4">
            <Heart className="w-8 h-8 text-green-600 shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold mb-3">О сообществе</h2>
              <p className="text-gray-600 leading-relaxed">
                Наш блог — это место для обмена мнениями, опытом и идеями. Мы
                рады конструктивным дискуссиям, разным точкам зрения и
                дружелюбному общению. Каждый комментарий делает наш блог лучше,
                если он написан с уважением к автору и другим читателям.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Уважайте собеседников
                </h3>
                <p className="text-gray-600">
                  Относитесь к другим комментаторам так, как хотели бы, чтобы
                  относились к вам. Конструктивная критика приветствуется,
                  личные оскорбления — нет.
                </p>
                <div className="mt-3 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                  <span className="font-medium">✓ Хорошо:</span> &quot;Я не
                  согласен с вашей точкой зрения, потому что...&quot;
                  <br />
                  <span className="font-medium">✗ Плохо:</span> &quot;Вы ничего
                  не понимаете в этой теме!&quot;
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Ban className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Никаких оскорблений
                </h3>
                <p className="text-gray-600">
                  Запрещены любые формы оскорблений, унижений, травли и
                  дискриминации (по национальному, половому, религиозному или
                  любому другому признаку).
                </p>
                <div className="mt-3 text-sm text-gray-500">
                  Такие комментарии удаляются, а автор получает бан.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Без спама</h3>
                <p className="text-gray-600">
                  Запрещена массовая рассылка одинаковых сообщений, реклама
                  сторонних ресурсов, фишинговые ссылки и любой другой спам.
                </p>
                <div className="mt-3 text-sm text-gray-500">
                  Исключения возможны только по согласованию с администрацией.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Будьте конструктивны
                </h3>
                <p className="text-gray-600">
                  Старайтесь писать по теме статьи, аргументировать свою позицию
                  и избегать пустых сообщений (флуда).
                </p>
                <div className="mt-3 text-sm text-gray-500">
                  Короткие комментарии вроде &quot;+&quot; или
                  &quot;согласен&quot; лучше поддерживать лайком.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Link2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Публикация ссылок
                </h3>
                <p className="text-gray-600">
                  Если вы делитесь ссылкой, обязательно объясните, о чем она и
                  почему это полезно другим читателям.
                </p>
                <div className="mt-3 text-sm text-gray-500">
                  Запрещены ссылки на вредоносные и мошеннические сайты.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <ThumbsDown className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Не разжигайте конфликты
                </h3>
                <p className="text-gray-600">
                  Провокации, троллинг и целенаправленное разжигание конфликтов
                  запрещены. Спорьте по существу, а не переходите на личности.
                </p>
                <div className="mt-3 text-sm text-gray-500">
                  Если чувствуете, что диалог переходит в конфликт — лучше
                  остановиться.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Важные замечания</h2>

          <div className="space-y-4">
            <div className="flex gap-3">
              <Globe className="w-5 h-5 text-green-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-medium">Язык общения</h3>
                <p className="text-gray-600">
                  Основной язык блога — русский. Пожалуйста, пишите на русском
                  или английском, чтобы другие читатели могли вас понять.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-green-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-medium">Актуальность</h3>
                <p className="text-gray-600">
                  Проверяйте дату публикации статьи. Если обсуждение было
                  завершено более года назад, лучше не поднимать старую тему без
                  веской причины.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Flag className="w-5 h-5 text-green-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-medium">Жалобы</h3>
                <p className="text-gray-600">
                  Если вы видите комментарий, нарушающий правила, используйте
                  кнопку &quot;Пожаловаться&quot;. Модераторы рассмотрят жалобу
                  в течение 24 часов.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Info className="w-5 h-5 text-green-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-medium">Авторские права</h3>
                <p className="text-gray-600">
                  Публикуя комментарий, вы подтверждаете, что текст написан вами
                  или у вас есть права на его публикацию. Плагиат запрещен.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Star className="w-5 h-5 text-green-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-medium">Активные участники</h3>
                <p className="text-gray-600">
                  Пользователи, которые регулярно оставляют содержательные
                  комментарии, могут получить статус &quot;Активный
                  участник&quot; с дополнительными возможностями.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            Меры за нарушения
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="bg-orange-200 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <span className="font-medium">Предупреждение</span>
                <p className="text-gray-600">
                  При первом незначительном нарушении (например, небольшой флуд)
                  модератор может вынести предупреждение. Комментарий может быть
                  удален.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="bg-orange-200 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <span className="font-medium">Временная блокировка</span>
                <p className="text-gray-600">
                  При повторных нарушениях доступ к комментариям ограничивается
                  на срок от 1 дня до 1 месяца в зависимости от тяжести
                  нарушений.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="bg-orange-200 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <span className="font-medium">Перманентная блокировка</span>
                <p className="text-gray-600">
                  За серьезные нарушения (угрозы, призывы к насилию,
                  распространение запрещенной информации, массовый спам) аккаунт
                  блокируется навсегда.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded">
            <p className="text-sm text-gray-600 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <span>
                <strong>Важно:</strong> Модераторы всегда объясняют причину
                блокировки. Если вы считаете, что блокировка ошибочна, напишите
                нам — мы разберем ситуацию.
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Вопросы или жалобы?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Если у вас есть вопросы по правилам, вы хотите сообщить о нарушении
            или обжаловать действие модератора — свяжитесь с нами любым удобным
            способом.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center w-full">
            <div className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 duration-300 inline-flex flex-col items-center gap-2 justify-center">
              <Flag className="w-7 h-7" />
              <span className="text-lg font-medium">Пожаловаться</span>
              <span className="opacity-90 flex items-center gap-1.5 bg-red-400 px-4 py-1.5 rounded-full">
                <Phone className="w-4 h-4" />
                {adminContact.phone}
              </span>
            </div>

            <div className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 duration-300 inline-flex flex-col items-center gap-2 justify-center">
              <MessageSquare className="w-7 h-7" />
              <span className="text-lg font-medium">Написать нам</span>
              <span className="opacity-90 flex items-center gap-1.5 bg-green-400 px-4 py-1.5 rounded-full">
                <Mail className="w-4 h-4" />
                {adminContact.email}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded text-sm text-gray-600 text-center">
          <p>
            Оставляя комментарий, вы автоматически соглашаетесь с правилами
            сообщества.
          </p>
        </div>
      </div>
    </div>
  );
}
