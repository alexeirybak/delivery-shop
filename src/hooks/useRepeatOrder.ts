// hooks/useRepeatOrder.ts
import { useState } from "react";
import { DeliveryData } from "@/types/cart";
import { DeliveryAddress } from "@/types/order"; // Импортируем тип

export const useRepeatOrder = () => {
  const [showDeliveryButton, setShowDeliveryButton] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryData | null>(null);
  const [isRepeatOrderCreated, setIsRepeatOrderCreated] = useState(false);

  const handleOrderClick = () => setShowDeliveryButton(true);
  const handleDeliveryClick = () => setShowDatePicker(true);

  const handleDateSelect = (date: Date, timeSlot: string, address: DeliveryAddress) => {
    const deliveryData: DeliveryData = {
      address, 
      time: { date: date.toISOString().split("T")[0], timeSlot },
    };
    setSelectedDelivery(deliveryData);
    setShowDatePicker(false);
  };

  const handleCancelDelivery = () => {
    setShowDatePicker(false);
    setSelectedDelivery(null);
  };

  const handleRepeatOrderSuccess = () => {
    setIsRepeatOrderCreated(true);
    setSelectedDelivery(null);
    setShowDeliveryButton(false);
  };

  return {
    showDeliveryButton,
    showDatePicker,
    selectedDelivery,
    setSelectedDelivery,
    isRepeatOrderCreated,
    handleOrderClick,
    handleDeliveryClick,
    handleDateSelect,
    handleCancelDelivery,
    handleRepeatOrderSuccess,
  };
};