import { useEffect, useState } from 'react';

export const useStoreHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Состояние гидратируется после монтирования компонента
    setIsHydrated(true);
  }, []);

  return isHydrated;
};