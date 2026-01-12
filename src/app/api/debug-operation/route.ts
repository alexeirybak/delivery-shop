import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const operationId = searchParams.get('operationId');
    
    if (!operationId) {
      return NextResponse.json(
        { error: 'Не указан operationId' },
        { status: 400 }
      );
    }

    // Используем ключ из YandexGPT
    const YANDEX_API_KEY = process.env.YANDEX_API_KEY;
    
    if (!YANDEX_API_KEY) {
      return NextResponse.json(
        { 
          error: 'API ключ не найден',
          details: 'Проверьте YANDEX_API_KEY в .env.local'
        },
        { status: 500 }
      );
    }

    console.log('Debug: Checking operation', operationId);
    
    // Проверяем статус операции через Яндекс API
    const statusUrl = `https://operation.api.cloud.yandex.net/operations/${operationId}`;
    
    const response = await fetch(statusUrl, {
      headers: {
        'Authorization': `Api-Key ${YANDEX_API_KEY}`,
        'Accept': 'application/json'
      }
    });

    const responseText = await response.text();
    console.log('Debug: Response status', response.status);
    console.log('Debug: Response (first 500 chars)', responseText.substring(0, 500));

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'Ошибка при проверке статуса',
          statusCode: response.status,
          response: responseText,
          operationId: operationId
        },
        { status: response.status }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        { 
          error: 'Невалидный JSON ответ',
          rawResponse: responseText,
          operationId: operationId
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      operationId: operationId,
      statusCode: response.status,
      done: data.done || false,
      hasError: !!data.error,
      hasResponse: !!data.response,
      data: data,
      // Детальная информация
      details: {
        createdAt: data.createdAt,
        modifiedAt: data.modifiedAt,
        metadata: data.metadata,
        done: data.done,
        error: data.error,
        response: data.response ? {
          hasImages: !!(data.response.images && data.response.images.length > 0),
          imageCount: data.response.images ? data.response.images.length : 0,
          firstImageUrl: data.response.images?.[0]?.url?.substring(0, 100) + '...'
        } : null
      }
    });
    
  } catch (error: unknown) {
    console.error('Debug operation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Ошибка отладки',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}