export const formatToISO = (dateStr: string): string => {
  const [day, month, year] = dateStr.split('.');
  return new Date(`${year}-${month}-${day}`).toISOString();
};

export const formatToDisplay = (isoDate: string): string => {
  const date = new Date(isoDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};