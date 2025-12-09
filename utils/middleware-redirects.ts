import { createSlug } from "./createSlug";
import { NextRequest, NextResponse } from "next/server";

interface ProductInfo {
  title: string;
  category: string;
}

// Получение информации о товаре
async function getProductInfo(id: number): Promise<ProductInfo | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://delivery-shop.ru";
    const response = await fetch(`${baseUrl}/api/products/${id}`);

    if (response.ok) {
      const product = await response.json();
      return {
        title: product.title,
        category: product.categories?.[0],
      };
    }
  } catch (error) {
    console.error("Error fetching product:", error);
  }
  return null;
}

// Создание URL для редиректа
function createRedirectUrl(
  productInfo: ProductInfo,
  id: number,
  category?: string
): string {
  const targetCategory = category || productInfo.category;
  const slug = createSlug(productInfo.title, id);
  return `/catalog/${targetCategory}/${slug}`;
}

// Редирект с /catalog/product/59
export async function handleCatalogProductRedirect(
  request: NextRequest
): Promise<NextResponse | null> {
  const url = request.nextUrl;

  if (url.pathname.startsWith("/catalog/product/")) {
    const match = url.pathname.match(/\/catalog\/product\/(\d+)/);
    if (match) {
      const id = parseInt(match[1], 10);
      const productInfo = await getProductInfo(id);

      if (productInfo) {
        const redirectUrl = createRedirectUrl(productInfo, id);
        return NextResponse.redirect(new URL(redirectUrl, request.url), 308);
      }
    }
  }

  return null;
}

// Редирект с /catalog/category/59
export async function handleOldProductRedirect(
  request: NextRequest
): Promise<NextResponse | null> {
  const url = request.nextUrl;
  const match = url.pathname.match(/^\/catalog\/([^\/]+)\/(\d+)$/);

  if (match) {
    const [, category, idStr] = match;
    const id = parseInt(idStr, 10);

    const productInfo = await getProductInfo(id);

    if (productInfo) {
      const redirectUrl = createRedirectUrl(productInfo, id, category);
      return NextResponse.redirect(new URL(redirectUrl, request.url), 308);
    }
  }

  return null;
}

// Удаление query-параметров
export function handleQueryParamsRedirect(
  request: NextRequest
): NextResponse | null {
  const url = request.nextUrl;

  // Убираем параметры из URL товаров
  if (url.search && /\/catalog\/[^\/]+\/\d+-/.test(url.pathname)) {
    url.search = "";
    return NextResponse.redirect(url, 308);
  }

  return null;
}
