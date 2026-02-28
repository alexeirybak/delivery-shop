import { ErrorWithStatusCode } from "../types";

export const createApiError = (
  message: string,
  statusCode?: number,
): ErrorWithStatusCode => {
  const error = new Error(message) as ErrorWithStatusCode;
  if (statusCode !== undefined) {
    error.statusCode = statusCode;
  }
  return error;
};

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
      if (statusCode >= 400 && statusCode < 500) {
        return `Ошибка клиента YandexGPT (${statusCode})`;
      }
      if (statusCode >= 500 && statusCode < 600) {
        return `Ошибка сервера YandexGPT (${statusCode})`;
      }
      return `Ошибка YandexGPT (${statusCode})`;
  }
};

export const getFullErrorMessage = (error: ErrorWithStatusCode): string => {
  const userMessage = getErrorMessage(error.statusCode);
  const errorMessage = error.message;

  if (error.statusCode !== undefined) {
    return `${userMessage}\n\nHTTP код: ${error.statusCode}\nСообщение: ${errorMessage}`;
  }

  return `${userMessage}\n\nСообщение: ${errorMessage}`;
};

export const isErrorWithStatusCode = (
  error: unknown,
): error is ErrorWithStatusCode => {
  return error instanceof Error && "statusCode" in error;
};
