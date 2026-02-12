export const getReplyWord = (count: number): string =>
  count % 10 === 1 && count % 100 !== 11
    ? "ответ"
    : [2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)
      ? "ответа"
      : "ответов";
