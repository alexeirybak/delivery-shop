import { create } from 'zustand';

interface OrderState {
  // Храним количество завершенных заказов по временным слотам и городам
  completedOrdersBySlotAndCity: Record<string, Record<string, number>>;
  
  // Инициализация счетчиков для временного слота и города
  initializeSlot: (timeSlot: string, city: string, totalOrders: number, initialCompleted: number) => void;
  
  // Обновление счетчика завершенных заказов
  updateCompletedCount: (timeSlot: string, city: string, change: number) => void;
  
  // Получение количества завершенных заказов для слота и города
  getCompletedCount: (timeSlot: string, city: string) => number;
  
  // Сброс состояния
  reset: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  completedOrdersBySlotAndCity: {},
  
  initializeSlot: (timeSlot: string, city: string, totalOrders: number, initialCompleted: number) => {
    const { completedOrdersBySlotAndCity } = get();
    
    // Инициализируем только если комбинации еще нет
    if (!(timeSlot in completedOrdersBySlotAndCity) || 
        !(city in completedOrdersBySlotAndCity[timeSlot])) {
      
      set({
        completedOrdersBySlotAndCity: {
          ...completedOrdersBySlotAndCity,
          [timeSlot]: {
            ...completedOrdersBySlotAndCity[timeSlot],
            [city]: initialCompleted
          }
        }
      });
    }
  },
  
  updateCompletedCount: (timeSlot: string, city: string, change: number) => {
    const { completedOrdersBySlotAndCity } = get();
    
    const currentCount = completedOrdersBySlotAndCity[timeSlot]?.[city] || 0;
    const newCount = Math.max(0, currentCount + change);
    
    set({
      completedOrdersBySlotAndCity: {
        ...completedOrdersBySlotAndCity,
        [timeSlot]: {
          ...completedOrdersBySlotAndCity[timeSlot],
          [city]: newCount
        }
      }
    });
  },
  
  getCompletedCount: (timeSlot: string, city: string) => {
    const { completedOrdersBySlotAndCity } = get();
    return completedOrdersBySlotAndCity[timeSlot]?.[city] || 0;
  },
  
  reset: () => {
    set({ completedOrdersBySlotAndCity: {} });
  }
}));