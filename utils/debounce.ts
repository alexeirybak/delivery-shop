export function debounce<F extends (...args: unknown[]) => unknown>(
  fn: F,
  delay: number
): (...args: Parameters<F>) => void {
  let timeoutId: number;
  return function (...args: Parameters<F>) {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), delay);
  };
}
