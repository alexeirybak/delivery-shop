  export const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("ru-RU");
  };