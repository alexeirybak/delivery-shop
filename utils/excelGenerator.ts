import * as XLSX from 'xlsx';

// Простой интерфейс для данных заказа
export interface SimplifiedOrderData {
  order: {
    orderNumber: string;
    status: string;
    createdAt: string;
    paymentMethod: string;
    paymentStatus: string;
    totalAmount: number;
    discountAmount: number;
    usedBonuses: number;
    earnedBonuses: number;
    name: string;
    surname: string;
    phone: string;
    gender: string;
    birthday: string;
    deliveryAddress: {
      city: string;
      street: string;
      house: string;
      apartment: string;
      additional?: string;
    };
    deliveryDate: string;
    deliveryTimeSlot: string;
  };
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    totalPrice: number;
    weight: number;
    brand: string;
    manufacturer: string;
  }>;
}

export const generateOrderExcel = (data: SimplifiedOrderData) => {
  const workbook = XLSX.utils.book_new();
  const { order, items } = data;

  // === ЛИСТ 1: ОСНОВНАЯ ИНФОРМАЦИЯ О ЗАКАЗЕ ===
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Не указано';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU');
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string): string => {
    if (!dateString) return 'Не указано';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('ru-RU');
    } catch {
      return dateString;
    }
  };

  const orderSummary = [
    ['📋 ОСНОВНАЯ ИНФОРМАЦИЯ О ЗАКАЗЕ', ''],
    ['Номер заказа', order.orderNumber],
    ['Статус заказа', order.status],
    ['Дата создания', formatDateTime(order.createdAt)],
    ['', ''],
    ['💳 ИНФОРМАЦИЯ ОБ ОПЛАТЕ', ''],
    ['Способ оплаты', order.paymentMethod === 'cash_on_delivery' ? 'Наложенный платёж' : order.paymentMethod],
    ['Статус оплаты', order.paymentStatus],
    ['Общая сумма', `${order.totalAmount} ₽`],
    ['Скидка', order.discountAmount > 0 ? `${order.discountAmount} ₽` : 'Нет'],
    ['Использовано бонусов', order.usedBonuses || 'Нет'],
    ['Начислено бонусов', order.earnedBonuses || 'Нет'],
    ['', ''],
    ['👤 ИНФОРМАЦИЯ О КЛИЕНТЕ', ''],
    ['ФИО', `${order.surname || ''} ${order.name}`.trim()],
    ['Телефон', order.phone],
    ['Пол', order.gender === 'male' ? 'Мужской' : order.gender === 'female' ? 'Женский' : 'Не указан'],
    ['Дата рождения', order.birthday ? formatDate(order.birthday) : 'Не указана'],
    ['', ''],
    ['🚚 ИНФОРМАЦИЯ О ДОСТАВКЕ', ''],
    ['Адрес доставки', [
      order.deliveryAddress?.city,
      order.deliveryAddress?.street,
      order.deliveryAddress?.house,
      order.deliveryAddress?.apartment && `кв. ${order.deliveryAddress.apartment}`
    ].filter(Boolean).join(', ') || 'Не указан'],
    ['Дата доставки', order.deliveryDate ? formatDate(order.deliveryDate) : 'Не указана'],
    ['Время доставки', order.deliveryTimeSlot || 'Не указано'],
  ];

  const orderSheet = XLSX.utils.aoa_to_sheet(orderSummary);
  XLSX.utils.book_append_sheet(workbook, orderSheet, '📋 Заказ');

  // === ЛИСТ 2: ТОВАРЫ В ЗАКАЗЕ ===
  const productsHeader = [
    '№', 'ID товара', 'Наименование', 'Количество', 'Цена за шт.', 'Общая стоимость',
    'Вес', 'Бренд', 'Производитель'
  ];

  const productsData = items.map((item, index) => [
    index + 1,
    item.productId,
    item.name || 'Название не указано',
    item.quantity,
    `${item.price} ₽`,
    `${(item.price * item.quantity).toFixed(2)} ₽`,
    item.weight ? `${item.weight} кг` : 'Не указан',
    item.brand || 'Не указан',
    item.manufacturer || 'Не указан'
  ]);

  // Подсчет общего веса
  const totalWeight = items.reduce((sum, item) => {
    return sum + ((item.weight || 0) * item.quantity);
  }, 0);

  const totalRow = [
    '', '', '', '', '💰 ИТОГО:', `${order.totalAmount} ₽`,
    `Общий вес: ${totalWeight.toFixed(2)} кг`, '', ''
  ];

  const productsSheetData = [productsHeader, ...productsData, totalRow];
  const productsSheet = XLSX.utils.aoa_to_sheet(productsSheetData);
  XLSX.utils.book_append_sheet(workbook, productsSheet, '📦 Товары');

  // === ЛИСТ 3: СВОДКА ПО ЗАКАЗУ ===
  const summaryData = [
    ['📊 СВОДКА ПО ЗАКАЗУ', ''],
    ['Номер заказа', order.orderNumber],
    ['Дата создания', formatDateTime(order.createdAt)],
    ['Количество товаров', items.length],
    ['Общая сумма заказа', `${order.totalAmount} ₽`],
    ['Общий вес заказа', `${totalWeight.toFixed(2)} кг`],
    ['Средняя цена товара', `${(order.totalAmount / items.reduce((sum, item) => sum + item.quantity, 0)).toFixed(2)} ₽`],
    ['', ''],
    ['РАСПРЕДЕЛЕНИЕ ПО ТОВАРАМ', ''],
    ...items.map((item, index) => [
      `${index + 1}. ${item.name || item.productId}`,
      `${item.quantity} шт × ${item.price} ₽ = ${(item.quantity * item.price).toFixed(2)} ₽`
    ])
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, '📊 Сводка');

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
  link.download = `${fileName.replace(/[^\w\s]/gi, '')}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};