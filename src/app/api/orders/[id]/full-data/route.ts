import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../utils/api-routes";
import { Order, OrderItem } from "@/types/order";

export interface OrderItemWithDetails extends OrderItem {
  productDetails?: {
    _id: string;
    id: number;
    img: string;
    title: string;
    description: string;
    basePrice: number;
    discountPercent: number;
  }; 
}

export interface User {
  _id: string;
  name: string;
  surname?: string;
  email: string;
  phoneNumber: string;
  gender?: string;
  birthdayDate?: string;
  card?: string;
  bonusesCount?: number;
  location?: string;
  region?: string;
  createdAt?: string;
  updatedAt?: string;
  favorites?: string[];
  purchases?: string[];
}

// Типы для данных из MongoDB
interface MongoDBOrder extends Omit<Order, '_id'> {
  _id: ObjectId;
}

interface MongoDBUser extends Omit<User, '_id'> {
  _id: ObjectId;
}

interface MongoDBProduct {
  _id: ObjectId;
  id: number;
  title?: string;
  description?: string;
  article?: string;
  brand?: string;
  manufacturer?: string;
  categories?: string[];
  weight?: number;
  quantity?: number;
  basePrice?: number;
  discountPercent?: number;
  rating?: Record<string, unknown>;
  img?: string;
}

interface FullOrderResponse {
  order: Order;
  user: User | null;
  productsDetails: OrderItemWithDetails[];
}

// Функция для преобразования MongoDB продукта в нужный формат
function transformProduct(product: MongoDBProduct): OrderItemWithDetails['productDetails'] {
  return {
    _id: product._id.toString(),
    id: product.id,
    img: product.img || '/default-image.jpg',
    title: product.title || 'Без названия',
    description: product.description || '',
    basePrice: product.basePrice || 0,
    discountPercent: product.discountPercent || 0,
  };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDB();
    const orderId = params.id;

    // Получаем полные данные заказа
    const order = await db.collection("orders").findOne({
      _id: new ObjectId(orderId)
    }) as MongoDBOrder | null;

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Заказ не найден" },
        { status: 404 }
      );
    }

    let user: User | null = null;
    let productsDetails: OrderItemWithDetails[] = [];

    // Получаем данные пользователя
    if (order.userId) {
      try {
        const userDoc = await db.collection("user").findOne({
          _id: new ObjectId(order.userId)
        }) as MongoDBUser | null;
        
        if (userDoc) {
          user = {
            _id: userDoc._id.toString(),
            name: userDoc.name,
            surname: userDoc.surname,
            email: userDoc.email,
            phoneNumber: userDoc.phoneNumber,
            gender: userDoc.gender,
            birthdayDate: userDoc.birthdayDate,
            card: userDoc.card,
            bonusesCount: userDoc.bonusesCount,
            location: userDoc.location,
            region: userDoc.region,
            createdAt: userDoc.createdAt,
            updatedAt: userDoc.updatedAt,
            favorites: userDoc.favorites,
            purchases: userDoc.purchases,
          };
        }
      } catch (userError) {
        console.error('Ошибка загрузки пользователя:', userError);
      }
    }

    // Загружаем данные о товарах с конвертацией типов
    if (order.items && order.items.length > 0) {
      try {
        const productIds = order.items.map((item: OrderItem) => item.productId);

        // Конвертируем ID в числа для поиска в products
        const numericProductIds: number[] = productIds.map((id: string) => {
          const num = Number(id);
          return isNaN(num) ? null : num;
        }).filter((id: number | null): id is number => id !== null);

        // Ищем товары по числовым ID
        const products = await db.collection("products")
          .find({ id: { $in: numericProductIds } })
          .toArray() as MongoDBProduct[];

        // Создаем мапу для быстрого доступа
        const productsMap = new Map<string, MongoDBProduct>();
        
        products.forEach((product: MongoDBProduct) => {
          if (product.id !== undefined) {
            productsMap.set(String(product.id), product);
            productsMap.set(product.id.toString(), product);
          }
        });

        // Обогащаем items данными из products
        productsDetails = order.items.map((item: OrderItem) => {
          const numericId = Number(item.productId);
          const productKey = isNaN(numericId) ? item.productId : numericId.toString();
          
          const productData = productsMap.get(productKey);

          return {
            ...item,
            productDetails: productData ? transformProduct(productData) : undefined
          };
        });

      } catch (productsError) {
        console.error('Ошибка загрузки товаров:', productsError);
        // Создаем базовые данные
        productsDetails = order.items.map((item: OrderItem) => ({
          ...item,
          productDetails: undefined
        }));
      }
    }

    // Преобразуем ObjectId в строку для ответа
    const responseOrder: Order = {
      ...order,
      _id: order._id.toString(),
      items: order.items as OrderItem[]
    };

    const responseData: FullOrderResponse = {
      order: responseOrder,
      user,
      productsDetails
    };

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error("Критическая ошибка получения полных данных заказа:", error);
    
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Внутренняя ошибка сервера",
        error: errorMessage 
      },
      { status: 500 }
    );
  }
}