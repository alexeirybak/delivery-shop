import {
  DeliveryAddress as DeliveryAddressType,
  DeliveryTime as DeliveryTimeType,
} from "@/types/order";
import { useEffect, useState } from "react";
import DeliveryAddress from "./DeliveryAddress";
import DeliveryTime from "./DeliveryTime";

interface CheckoutFormProps {
  onFormDataChange: (data: {
    address: DeliveryAddressType;
    time: DeliveryTimeType;
    isValid: boolean;
  }) => void;
}

const CheckoutForm = ({ onFormDataChange }: CheckoutFormProps) => {
  const [deliveryFormData, setDeliveryFormData] = useState<DeliveryAddressType>(
    {
      city: "",
      street: "",
      house: "",
      apartment: "",
      additional: "",
    }
  );

  const [deliveryTime, setDeliveryTime] = useState<DeliveryTimeType>({
    date: "",
    timeSlot: "",
  });

  useEffect(() => {
    const isAddressValid = Boolean(
      deliveryFormData.city && deliveryFormData.street && deliveryFormData.house
    );

    const isTimeValid = Boolean(deliveryTime.date && deliveryTime.timeSlot);

    const isValid = isAddressValid && isTimeValid;

    onFormDataChange({
      address: deliveryFormData,
      time: deliveryTime,
      isValid,
    });
  }, [deliveryFormData, deliveryTime, onFormDataChange]);

  const handleFormDataChange = (
    field: keyof DeliveryAddressType,
    value: string
  ) => {
    setDeliveryFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (date: string) => {
    setDeliveryTime((prev) => ({
      ...prev,
      date,
    }));
  };

  const handleTimeSlotChange = (timeSlot: string) => {
    setDeliveryTime((prev) => ({
      ...prev,
      timeSlot,
    }));
  };

  return (
    <div className="flex-1 space-y-10">
      <DeliveryAddress
        formData={deliveryFormData}
        onFormDataChange={handleFormDataChange}
      />

      <DeliveryTime
        selectedDate={deliveryTime.date}
        selectedTimeSlot={deliveryTime.timeSlot}
        onDateChange={handleDateChange}
        onTimeSlotChange={handleTimeSlotChange}
      />
    </div>
  );
};

export default CheckoutForm;
