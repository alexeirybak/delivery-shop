import { NextRequest, NextResponse } from 'next/server';
import { checkPriceAlerts } from '@/scripts/checkPriceAlerts';

export async function GET(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get('secret');
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await checkPriceAlerts();

    return NextResponse.json({ 
      success: true,
      message: 'Проверка цен завершена' 
    });

  } catch (error) {
    console.error('Ошибка при проверке цен:', error);
    return NextResponse.json(
      { error: 'Ошибка при проверке цен' },
      { status: 500 }
    );
  }
}