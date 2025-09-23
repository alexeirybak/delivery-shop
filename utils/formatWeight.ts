export const formatWeight = (weight: number): string => {
    if (weight < 1) {
      const grams = weight * 1000;
      const formattedGrams = grams % 1 === 0 ? grams.toString() : grams.toFixed(1).replace(/\.0$/, '');
      return `${formattedGrams} г`;
    } else {
      const formattedKg = weight % 1 === 0 ? weight.toString() : weight.toFixed(2).replace(/\.00$/, '');
      return `${formattedKg} кг`;
    }
  };