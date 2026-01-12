import { NextRequest, NextResponse } from 'next/server';

interface YandexGPTRequest {
  prompt: string;
  action?: string;
}

interface YandexGPTResponse {
  result?: {
    alternatives?: Array<{
      message?: {
        text?: string;
      };
    }>;
  };
  error?: {
    message?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, action = 'improve' } = body as YandexGPTRequest;
    
    console.log('YandexGPT API call:', { action, promptLength: prompt.length });

    const YANDEX_API_KEY = process.env.YANDEX_API_KEY;
    const YANDEX_FOLDER_ID = process.env.YANDEX_FOLDER_ID;
    
    if (!YANDEX_API_KEY || !YANDEX_FOLDER_ID) {
      return NextResponse.json(
        { 
          error: 'YandexGPT API не настроен',
          details: 'Проверьте YANDEX_API_KEY и YANDEX_FOLDER_ID в .env.local' 
        },
        { status: 500 }
      );
    }

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { 
          error: 'Неверный запрос',
          details: 'Текст (prompt) обязателен' 
        },
        { status: 400 }
      );
    }

    // Формируем системный промпт
    let systemPrompt = 'Ты полезный AI помощник для редактирования текста на русском языке. Отвечай только на русском языке.';
    
    switch (action) {
      case 'improve':
        systemPrompt = 'Улучши стиль, грамотность и структуру русского текста. Сделай его более профессиональным и литературным. Отвечай только на русском языке.';
        break;
      case 'continue':
        systemPrompt = 'Продолжи текст логично и содержательно на русском языке. Сохраняй стиль и тему оригинала. Отвечай только на русском языке.';
        break;
      case 'summarize':
        systemPrompt = 'Сделай краткое и информативное содержание текста на русском языке. Выдели основные идеи. Отвечай только на русском языке.';
        break;
      case 'expand':
        systemPrompt = 'Расширь русский текст, добавь детали, примеры и полезную информацию. Отвечай только на русском языке.';
        break;
      case 'simplify':
        systemPrompt = 'Упрости русский текст, сделай его понятным для широкой аудитории. Отвечай только на русском языке.';
        break;
      case 'translate':
        systemPrompt = 'Переведи текст качественно на русский язык, сохраняя смысл и стиль. Отвечай только на русском языке.';
        break;
      default:
        systemPrompt = `Выполни запрос пользователя: "${action}". Отвечай только на русском языке.`;
    }

    console.log('Calling YandexGPT API with key:', YANDEX_API_KEY.substring(0, 10) + '...');
    console.log('Folder ID:', YANDEX_FOLDER_ID);
    
    const apiUrl = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Api-Key ${YANDEX_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        modelUri: `gpt://${YANDEX_FOLDER_ID}/yandexgpt`,
        completionOptions: {
          stream: false,
          temperature: 0.7,
          maxTokens: 2000
        },
        messages: [
          {
            role: 'system',
            text: systemPrompt
          },
          {
            role: 'user',
            text: prompt
          }
        ]
      })
    });

    console.log('YandexGPT response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('YandexGPT API error:', response.status, errorText);
      
      let errorMessage = `YandexGPT API error: ${response.status}`;
      try {
        const errorData: YandexGPTResponse = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch {
        console.error('Failed to parse error JSON:', errorText.substring(0, 200));
      }
      
      return NextResponse.json(
        { 
          error: 'Ошибка YandexGPT API',
          details: errorMessage,
          status: response.status
        },
        { status: response.status }
      );
    }

    const data: YandexGPTResponse = await response.json();
    console.log('YandexGPT success response');
    
    const generatedText = data.result?.alternatives?.[0]?.message?.text || '';
    
    if (!generatedText) {
      return NextResponse.json(
        { 
          error: 'Пустой ответ от YandexGPT',
          details: 'API вернул пустой текст'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      text: generatedText,
      provider: 'yandex-gpt',
      model: 'yandexgpt'
    });
    
  } catch (error: unknown) {
    console.error('YandexGPT generation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Внутренняя ошибка сервера',
        details: errorMessage,
        suggestion: 'Проверьте сетевые настройки и доступ к api.cloud.yandex.net'
      },
      { status: 500 }
    );
  }
}