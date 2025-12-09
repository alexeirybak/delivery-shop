// utils/middleware-redirects.ts
import { NextRequest, NextResponse } from "next/server";
import { createSlug } from "./slug-generator";

// Типы
interface ProductInfo {
  title: string;
  category: string;
}

interface CacheEntry {
  data: ProductInfo;
  timestamp: number;
}

// Константы
const CACHE_TTL = 5 * 60 * 1000; // 5 минут
const productCache = new Map<number, CacheEntry>();

// Паттерны URL
const URL_PATTERNS = {
  catalogProduct: /\/catalog\/product\/(\d+)/,
  oldProduct: /^\/catalog\/([^\/]+)\/(\d+)$/,
  productSlug: /^\/catalog\/([^\/]+)\/(\d+-[^\/]+)$/,
} as const;

// Вспомогательные функции
function cleanupCache(): void {
  const now = Date.now();
  for (const [key, entry] of productCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      productCache.delete(key);
    }
  }
}

async function getProductInfo(id: number): Promise<ProductInfo | null> {
  // Периодическая очистка кэша
  if (Math.random() < 0.1) cleanupCache();

  // Проверяем кэш
  const cached = productCache.get(id);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'force-cache',
    });

    if (response.ok) {
      const product = await response.json();
      const info: ProductInfo = {
        title: product.title || '',
        category: product.categories?.[0] || 'other',
      };
      
      productCache.set(id, { data: info, timestamp: Date.now() });
      return info;
    }
  } catch (error) {
    console.error('Error fetching product info:', error);
  }

  return null;
}

function createRedirectUrl(
  productInfo: ProductInfo,
  id: number,
  category?: string
): string {
  const targetCategory = category || productInfo.category;
  const slug = createSlug(productInfo.title, id);
  return `/catalog/${targetCategory}/${slug}`;
}

// Основные функции обработки редиректов
export async function handleCatalogProductRedirect(
  request: NextRequest
): Promise<NextResponse | null> {
  const url = request.nextUrl;
  
  if (url.pathname.startsWith('/catalog/product/')) {
    const match = url.pathname.match(URL_PATTERNS.catalogProduct);
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

export async function handleOldProductRedirect(
  request: NextRequest
): Promise<NextResponse | null> {
  const url = request.nextUrl;
  const match = url.pathname.match(URL_PATTERNS.oldProduct);
  
  if (match) {
    const [, category, idStr] = match;
    const id = parseInt(idStr, 10);
    
    // Пропускаем служебные пути
    if (['sitemap', 'api', 'robots'].includes(category)) {
      return null;
    }
    
    const productInfo = await getProductInfo(id);
    
    if (productInfo) {
      const redirectUrl = createRedirectUrl(productInfo, id, category);
      return NextResponse.redirect(new URL(redirectUrl, request.url), 308);
    }
  }
  
  return null;
}

export function handleQueryParamsRedirect(
  request: NextRequest
): NextResponse | null {
  const url = request.nextUrl;
  
  // Удаляем query-параметры из ЧПУ URL товаров
  if (URL_PATTERNS.productSlug.test(url.pathname) && url.search) {
    url.search = '';
    return NextResponse.redirect(url, 308);
  }
  
  // Редирект со старых URL с query-параметрами
  if (/^\/catalog\/[^\/]+\/\d+\?/.test(url.pathname + url.search)) {
    const idMatch = url.pathname.match(/\/(\d+)$/);
    if (idMatch) {
      // Убираем query-параметры и добавляем дефис
      const id = idMatch[1];
      const category = url.pathname.split('/')[2];
      const newUrl = `/catalog/${category}/${id}-`;
      return NextResponse.redirect(new URL(newUrl, request.url), 308);
    }
  }
  
  return null;
}

// Проверка статических путей
export function isStaticPath(pathname: string): boolean {
  return (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt'
  );
}