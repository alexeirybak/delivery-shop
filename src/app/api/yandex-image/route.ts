import { NextRequest, NextResponse } from 'next/server';

interface YandexImageRequest {
  prompt: string;
  aspect_ratio?: '1:1' | '4:3' | '3:4' | '16:9' | '9:16';
  style?: 'default' | 'realistic' | 'artistic' | 'sketch' | 'cartoon';
}

// POST - начать генерацию
export async function POST(request: NextRequest) {
  console.log('=== YandexART Image Generation ===');
  
  try {
    const body = await request.json();
    const { prompt, aspect_ratio = '1:1', style = 'default' } = body;

    // Валидация
    if (!prompt || prompt.trim().length < 3) {
      return NextResponse.json(
        { error: 'Описание должно содержать минимум 3 символа' },
        { status: 400 }
      );
    }

    const YANDEX_API_KEY = process.env.YANDEX_API_KEY;
    const YANDEX_FOLDER_ID = process.env.YANDEX_FOLDER_ID;

    if (!YANDEX_API_KEY || !YANDEX_FOLDER_ID) {
      console.error('Missing env vars:', {
        hasApiKey: !!YANDEX_API_KEY,
        hasFolderId: !!YANDEX_FOLDER_ID
      });
      return NextResponse.json(
        { error: 'API ключи не настроены' },
        { status: 500 }
      );
    }

    // Размеры изображения
    let width = 1024, height = 1024;
    switch (aspect_ratio) {
      case '4:3': width = 1024; height = 768; break;
      case '3:4': width = 768; height = 1024; break;
      case '16:9': width = 1024; height = 576; break;
      case '9:16': width = 576; height = 1024; break;
    }

    // Улучшаем промпт в зависимости от стиля
    let enhancedPrompt = prompt;
    const styleMap = {
      'realistic': 'фотореалистично, высокое качество, детализированно, профессиональная фотография',
      'artistic': 'художественная живопись, шедевр, цифровое искусство, арт',
      'sketch': 'эскиз, рисунок, карандашный набросок, черно-белое',
      'cartoon': 'мультяшный стиль, анимация, диснеевский стиль',
      'default': ''
    };

    if (style !== 'default' && styleMap[style]) {
      enhancedPrompt = `${styleMap[style]}: ${prompt}`;
    }

    // ПРАВИЛЬНЫЙ формат запроса для YandexART
    const requestBody = {
      modelUri: `art://${YANDEX_FOLDER_ID}/yandex-art/latest`, 
      messages: [
        {
          text: enhancedPrompt,
          weight: 1
        }
      ],
      generationOptions: {
        mime_type: 'image/png',
        seed: Math.floor(Math.random() * 1000000),
        width: width,
        height: height
      }
    };

    console.log('Sending to YandexART:', {
      modelUri: requestBody.modelUri,
      prompt: enhancedPrompt,
      width,
      height
    });

    const response = await fetch(
      'https://llm.api.cloud.yandex.net/foundationModels/v1/imageGenerationAsync',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Api-Key ${YANDEX_API_KEY}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    );

    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response:', responseText.substring(0, 500));

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'Ошибка API YandexART',
          details: responseText.substring(0, 500),
          status: response.status
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
          rawResponse: responseText
        },
        { status: 500 }
      );
    }
    
    const operationId = data.id || data.operationId;

    if (!operationId) {
      console.error('No operationId in response:', data);
      return NextResponse.json(
        { 
          error: 'Не получен ID операции',
          response: data
        },
        { status: 500 }
      );
    }

    console.log('Operation started:', operationId);
    
    return NextResponse.json({
      success: true,
      operationId: operationId,
      status: 'processing',
      message: 'Генерация изображения начата',
      style: style,
      aspect_ratio: aspect_ratio,
      dimensions: `${width}x${height}`
    });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка', details: String(error) },
      { status: 500 }
    );
  }
}

// GET - проверить статус
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

    const YANDEX_API_KEY = process.env.YANDEX_API_KEY;
    if (!YANDEX_API_KEY) {
      return NextResponse.json(
        { error: 'API ключ не настроен' },
        { status: 500 }
      );
    }

    const statusUrl = `https://operation.api.cloud.yandex.net/operations/${operationId}`;

    console.log('Checking operation:', operationId);

    const response = await fetch(statusUrl, {
      headers: {
        'Authorization': `Api-Key ${YANDEX_API_KEY}`,
        'Accept': 'application/json'
      }
    });

    const responseText = await response.text();
    console.log('Status response:', response.status);

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'Ошибка проверки статуса',
          details: responseText.substring(0, 500),
          status: response.status
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
          rawResponse: responseText
        },
        { status: 500 }
      );
    }

    console.log('Operation data:', {
      done: data.done,
      hasResponse: !!data.response,
      hasImage: !!(data.response?.image),
      imageLength: data.response?.image?.length
    });

    // Проверяем статус операции
    if (data.done) {
      if (data.response?.image) {
        // ВАЖНО: YandexART возвращает base64 изображение, а не URL!
        const base64Image = data.response.image;
        
        // Создаем data URL из base64
        const imageUrl = `data:image/jpeg;base64,${base64Image}`;
        
        console.log('Image generated successfully, base64 length:', base64Image.length);
        
        return NextResponse.json({
          success: true,
          done: true,
          status: 'completed',
          imageUrl: imageUrl, // Это data URL, а не обычный URL
          base64Image: base64Image, // Можно вернуть и raw base64
          operationId: operationId,
          format: 'jpeg',
          size: Math.floor(base64Image.length * 3 / 4) // Примерный размер в байтах
        });
      } else if (data.error) {
        // Ошибка генерации
        console.error('Generation error:', data.error);
        return NextResponse.json({
          success: false,
          done: true,
          status: 'failed',
          error: data.error,
          operationId: operationId
        });
      } else {
        // Непонятный ответ
        console.error('Unexpected response:', data);
        return NextResponse.json({
          success: false,
          done: true,
          status: 'failed',
          error: 'Неожиданный формат ответа от YandexART',
          response: data
        });
      }
    }
    
    // Операция еще выполняется
    console.log('Operation still processing...');
    return NextResponse.json({
      success: true,
      done: false,
      status: 'processing',
      operationId: operationId,
      message: 'Генерация все еще выполняется',
      data: {
        done: data.done,
        createdAt: data.createdAt,
        modifiedAt: data.modifiedAt
      }
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { 
        error: 'Ошибка проверки', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}