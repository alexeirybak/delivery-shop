import * as XLSX from 'xlsx';
import { ExcelExportData, OrderItemWithDetails, ProductDetails } from '@/types/excel';

// Простые типы для путей
type ProductFieldPath = 
  | 'productDetails.title' 
  | 'productDetails.name'
  | 'productDetails.article'
  | 'productDetails.sku'
  | 'productDetails.id'
  | 'productDetails.brand'
  | 'productDetails.manufacturer'
  | 'productDetails.categories'
  | 'productDetails.category'
  | 'productDetails.weight'
  | 'productDetails.quantity'
  | 'productDetails.stock'
  | 'productDetails.basePrice'
  | 'productDetails.price'
  | 'productDetails.description'
  | 'productDetails.rating';

// Безопасное получение значения по пути
const getNestedValue = <T>(
  obj: OrderItemWithDetails,
  path: ProductFieldPath
): T | undefined => {
  const keys = path.split('.') as (keyof OrderItemWithDetails | keyof ProductDetails)[];
  
  let current: Record<string, unknown> | unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as object)) {
      current = (current as Record<string, unknown>)[key as string];
    } else {
      return undefined;
    }
  }
  
  return current as T;
};

// Типизированные пути для каждого поля
const FIELD_PATHS = {
  name: ['productDetails.title', 'productDetails.name'] as ProductFieldPath[],
  article: ['productDetails.article', 'productDetails.sku', 'productDetails.id'] as ProductFieldPath[],
  brand: ['productDetails.brand', 'productDetails.manufacturer'] as ProductFieldPath[],
  categories: ['productDetails.categories', 'productDetails.category'] as ProductFieldPath[],
  weight: ['productDetails.weight'] as ProductFieldPath[],
  quantity: ['productDetails.quantity', 'productDetails.stock'] as ProductFieldPath[],
  basePrice: ['productDetails.basePrice', 'productDetails.price'] as ProductFieldPath[],
  description: ['productDetails.description'] as ProductFieldPath[],
  manufacturer: ['productDetails.manufacturer', 'productDetails.brand'] as ProductFieldPath[],
  rating: ['productDetails.rating'] as ProductFieldPath[],
} as const;

// Получение значения продукта с fallback'ами
const getProductValue = (item: OrderItemWithDetails, field: keyof typeof FIELD_PATHS): string => {
  const paths = FIELD_PATHS[field];
  
  // Пробуем получить значение по всем путям
  for (const path of paths) {
    const value = getNestedValue<unknown>(item, path);
    if (value !== undefined && value !== null && value !== '') {
      return formatValue(value, field);
    }
  }
  
  // Fallback значения
  return getFallbackValue(item, field);
};

// Форматирование значения в зависимости от типа поля
const formatValue = (value: unknown, field: keyof typeof FIELD_PATHS): string => {
  switch (field) {
    case 'weight':
      return typeof value === 'number' ? `${value} кг` : String(value);
    
    case 'quantity':
      if (typeof value === 'number') {
        return value > 0 ? `Да (${value} шт)` : 'Нет в наличии';
      }
      return String(value);
    
    case 'basePrice':
      return typeof value === 'number' ? `${value} ₽` : String(value);
    
    case 'categories':
      return Array.isArray(value) ? value.join(', ') : String(value);
    
    case 'rating':
      if (value && typeof value === 'object') {
        const ratings = Object.values(value).filter(v => v !== undefined);
        return ratings.length > 0 ? ratings.join('/') : 'Нет оценок';
      }
      return 'Нет оценок';
    
    default:
      return String(value || '');
  }
};

// Fallback значения для случаев когда данных нет
const getFallbackValue = (item: OrderItemWithDetails, field: keyof typeof FIELD_PATHS): string => {
  const fallbacks: Record<keyof typeof FIELD_PATHS, string> = {
    name: item.name || 'Название не указано',
    article: `ID: ${item.productId}`,
    brand: 'Бренд не указан',
    categories: 'Категория не указана',
    weight: 'Вес не указан',
    quantity: 'Неизвестно',
    basePrice: 'Цена не указана',
    description: 'Описание отсутствует',
    manufacturer: 'Производитель не указан',
    rating: 'Нет оценок',
  };
  
  return fallbacks[field];
};

export const generateOrderExcel = (data: ExcelExportData) => {
  const workbook = XLSX.utils.book_new();
  const { order, user, productsDetails } = data;

  // === ЛИСТ 1: ОСНОВНАЯ ИНФОРМАЦИЯ О ЗАКАЗЕ ===
  const orderSummary = [
    ['📋 ОСНОВНАЯ ИНФОРМАЦИЯ О ЗАКАЗЕ', ''],
    ['Номер заказа', order.orderNumber],
    ['Статус заказа', order.status],
    ['Дата создания', new Date(order.createdAt).toLocaleString('ru-RU')],
    ['Дата оплаты', order.paidAt ? new Date(order.paidAt).toLocaleString('ru-RU') : '⏳ Не оплачен'],
    ['', ''],
    ['💳 ИНФОРМАЦИЯ ОБ ОПЛАТЕ', ''],
    ['Способ оплаты', order.paymentMethod === 'online' ? '💳 Онлайн' : '💵 Наличные'],
    ['Статус оплаты', order.paymentStatus === 'paid' ? '✅ Оплачен' : '❌ Не оплачен'],
    ['Общая сумма', `💰 ${order.totalAmount} ₽`],
    ['Сумма скидки', order.discountAmount ? `🎁 ${order.discountAmount} ₽` : 'Без скидки'],
    ['Использовано бонусов', order.usedBonuses ? `⭐ ${order.usedBonuses} ₽` : 'Не использовались'],
    ['Начислено бонусов', order.earnedBonuses ? `⭐ ${order.earnedBonuses} ₽` : 'Не начислены'],
    ['', ''],
    ['👤 ИНФОРМАЦИЯ О КЛИЕНТЕ', ''],
    ['ФИО', `👤 ${order.surname || ''} ${order.name}`.trim()],
    ['Телефон', `📞 ${order.phone}`],
    ['Пол', order.gender === 'male' ? '👨 Мужской' : order.gender === 'female' ? '👩 Женский' : '❓ Не указан'],
    ['Дата рождения', order.birthday ? new Date(order.birthday).toLocaleDateString('ru-RU') : '❓ Не указана'],
    ['', ''],
    ['🚚 ИНФОРМАЦИЯ О ДОСТАВКЕ', ''],
    ['Адрес доставки', [
      order.deliveryAddress?.city,
      order.deliveryAddress?.street,
      order.deliveryAddress?.house,
      order.deliveryAddress?.apartment && `кв. ${order.deliveryAddress.apartment}`
    ].filter(Boolean).join(', ') || '❓ Не указан'],
    ['Дата доставки', order.deliveryDate || '❓ Не указана'],
    ['Время доставки', order.deliveryTimeSlot || '❓ Не указано'],
  ];

  const orderSheet = XLSX.utils.aoa_to_sheet(orderSummary);
  XLSX.utils.book_append_sheet(workbook, orderSheet, '📋 Заказ');

  // === ЛИСТ 2: ТОВАРЫ В ЗАКАЗЕ ===
  const productsHeader = [
    '№', 'ID товара', 'Наименование', 'Количество', 'Цена за шт.', 'Общая стоимость', 'Статус'
  ];

  const productsData = productsDetails.map((item: OrderItemWithDetails, index: number) => {
    const hasDetails = !!item.productDetails;
    const status = hasDetails ? '✅ Данные загружены' : '⚠️ Только базовые данные';
    
    return [
      index + 1,
      item.productId,
      getProductValue(item, 'name'),
      item.quantity,
      `${item.price} ₽`,
      `${(item.price * item.quantity).toFixed(2)} ₽`,
      status
    ];
  });

  const totalRow = ['', '', '', '', '💰 ИТОГО:', `${order.totalAmount} ₽`, ''];
  const productsSheetData = [productsHeader, ...productsData, totalRow];
  const productsSheet = XLSX.utils.aoa_to_sheet(productsSheetData);
  XLSX.utils.book_append_sheet(workbook, productsSheet, '📦 Товары');

  // === ЛИСТ 3: ДЕТАЛЬНАЯ ИНФОРМАЦИЯ О ТОВАРАХ ===
  const detailsHeader = [
    'ID товара', 'Наименование', 'Артикул', 'Бренд', 'Производитель', 
    'Категория', 'Вес', 'Наличие', 'Базовая цена', 'Рейтинг'
  ];

  const detailsData = productsDetails.map((item: OrderItemWithDetails) => [
    item.productId,
    getProductValue(item, 'name'),
    getProductValue(item, 'article'),
    getProductValue(item, 'brand'),
    getProductValue(item, 'manufacturer'),
    getProductValue(item, 'categories'),
    getProductValue(item, 'weight'),
    getProductValue(item, 'quantity'),
    getProductValue(item, 'basePrice'),
    getProductValue(item, 'rating'),
  ]);

  const detailsSheetData = [detailsHeader, ...detailsData];
  const detailsSheet = XLSX.utils.aoa_to_sheet(detailsSheetData);
  XLSX.utils.book_append_sheet(workbook, detailsSheet, '🔍 Детали товаров');

  // === ЛИСТ 4: ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ О ПОЛЬЗОВАТЕЛЕ ===
  if (user) {
    const userInfo = [
      ['👤 ПРОФИЛЬ КЛИЕНТА В СИСТЕМЕ', ''],
      ['ID пользователя', user._id],
      ['Имя', user.name],
      ['Фамилия', user.surname || '❓ Не указана'],
      ['Телефон', `📞 ${user.phoneNumber}`],
      ['Email', user.email || '❓ Не указан'],
      ['Пол', user.gender === 'male' ? '👨 Мужской' : '👩 Женский'],
      ['Дата рождения', user.birthdayDate ? new Date(user.birthdayDate).toLocaleDateString('ru-RU') : '❓ Не указана'],
      ['Карта лояльности', user.card ? `💳 ${user.card}` : '❌ Нет карты'],
      ['Баланс бонусов', `⭐ ${user.bonusesCount || 0}`],
      ['Город', user.location || '❓ Не указан'],
      ['Регион', user.region || '❓ Не указан'],
      ['Дата регистрации', user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : '❓ Не указана'],
    ];

    // Избранные товары
    if (user.favorites && user.favorites.length > 0) {
      userInfo.push(['', '']);
      userInfo.push(['❤️ ИЗБРАННЫЕ ТОВАРЫ', `Всего: ${user.favorites.length}`]);
      user.favorites.slice(0, 10).forEach((favId: string, index: number) => {
        userInfo.push([`Товар ${index + 1}`, favId]);
      });
      if (user.favorites.length > 10) {
        userInfo.push([`... и еще ${user.favorites.length - 10} товаров`, '']);
      }
    }

    // История покупок
    if (user.purchases && user.purchases.length > 0) {
      userInfo.push(['', '']);
      userInfo.push(['🛒 ИСТОРИЯ ПОКУПОК', `Всего: ${user.purchases.length}`]);
      user.purchases.slice(0, 10).forEach((purchaseId: string, index: number) => {
        userInfo.push([`Покупка ${index + 1}`, purchaseId]);
      });
      if (user.purchases.length > 10) {
        userInfo.push([`... и еще ${user.purchases.length - 10} покупок`, '']);
      }
    }

    const userSheet = XLSX.utils.aoa_to_sheet(userInfo);
    XLSX.utils.book_append_sheet(workbook, userSheet, '👤 Профиль клиента');
  }

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return excelBuffer;
};

export const downloadExcel = (excelBuffer: ArrayBuffer, fileName: string) => {
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};