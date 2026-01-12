// utils/errorUtils.ts
export interface APIError {
  message: string;
  statusCode?: number;
}

export interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}

// Функция для создания ошибки с кодом статуса
export const createApiError = (message: string, statusCode?: number): ErrorWithStatusCode => {
  const error = new Error(message) as ErrorWithStatusCode;
  if (statusCode !== undefined) {
    error.statusCode = statusCode;
  }
  return error;
};

// Получение понятного сообщения об ошибке на основе кода статуса
export const getErrorMessage = (statusCode?: number): string => {
  if (statusCode === undefined) {
    return "Ошибка подключения к YandexGPT";
  }
  
  switch (statusCode) {
    case 400:
      return "Неверный запрос к YandexGPT API";
    case 401:
      return "Неверный API ключ YandexGPT";
    case 403:
      return "Доступ к YandexGPT запрещен";
    case 404:
      return "Ресурс YandexGPT не найден";
    case 429:
      return "Превышен лимит запросов к YandexGPT";
    case 500:
      return "Внутренняя ошибка сервера YandexGPT";
    case 502:
      return "Плохой шлюз YandexGPT";
    case 503:
      return "Сервис YandexGPT временно недоступен";
    case 504:
      return "Таймаут шлюза YandexGPT";
    default:
      // Коды 4xx
      if (statusCode >= 400 && statusCode < 500) {
        return `Ошибка клиента YandexGPT (${statusCode})`;
      }
      // Коды 5xx
      if (statusCode >= 500 && statusCode < 600) {
        return `Ошибка сервера YandexGPT (${statusCode})`;
      }
      // Другие коды
      return `Ошибка YandexGPT (${statusCode})`;
  }
};

// Получение полного сообщения об ошибке
export const getFullErrorMessage = (error: ErrorWithStatusCode): string => {
  const userMessage = getErrorMessage(error.statusCode);
  const errorMessage = error.message;
  
  if (error.statusCode !== undefined) {
    return `${userMessage}\n\nHTTP код: ${error.statusCode}\nСообщение: ${errorMessage}`;
  }
  
  return `${userMessage}\n\nСообщение: ${errorMessage}`;
};

// Type guard для проверки типа ErrorWithStatusCode
export const isErrorWithStatusCode = (error: unknown): error is ErrorWithStatusCode => {
  return error instanceof Error && 'statusCode' in error;
};