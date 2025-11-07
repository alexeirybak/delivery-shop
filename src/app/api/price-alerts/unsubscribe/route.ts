import { NextRequest, NextResponse } from 'next/server';
import { unsubscribePriceAlert } from '@/actions/priceAlerts';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/catalog/product/unsubscribe/error?message=Неверные параметры запроса`
      );
    }

    const result = await unsubscribePriceAlert(token);

    if (result.error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/catalog/product/unsubscribe/error?message=${encodeURIComponent(result.error)}`
      );
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/catalog/product/unsubscribe/success`
    );
    
  } catch (error) {
    console.error('Ошибка отписки:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/catalog/product/unsubscribe/error?message=Ошибка при отписке`
    );
  }
}