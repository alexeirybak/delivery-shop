export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
): (...args: T) => void {
  let timer: NodeJS.Timeout;

  return (...args: T): void => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
