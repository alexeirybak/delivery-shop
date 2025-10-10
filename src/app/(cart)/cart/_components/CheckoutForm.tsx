"use client";

import { useState } from "react";
import DeliveryAddress from "./DeliveryAddress";
import DeliveryTime from "./DeliveryTime";

const CheckoutForm = () => {
  const [deliveryFormData, setDeliveryFormData] = useState({
    city: "",
    street: "",
    house: "",
    apartment: "",
    additional: "",
  });

  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState("");

  const handleFormDataChange = (field: string, value: string) => {
    setDeliveryFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="flex-1 space-y-10">
      <DeliveryAddress
        formData={deliveryFormData}
        onFormDataChange={handleFormDataChange}
      />

      <DeliveryTime
        selectedDate={deliveryDate}
        selectedTimeSlot={deliveryTimeSlot}
        onDateChange={setDeliveryDate}
        onTimeSlotChange={setDeliveryTimeSlot}
      />
    </div>
  );
};

export default CheckoutForm;
