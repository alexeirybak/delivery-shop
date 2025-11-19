import Image from "next/image";
import { formatPhoneNumber } from "../utils/formatPhoneNumber";

interface OrderHeaderProps {
  orderNumber: string;
  phone: string;
  statusDropdown: React.ReactNode;
  viewButton: React.ReactNode;
  children: React.ReactNode;
}

const OrderHeader = ({ 
  orderNumber, 
  phone, 
  statusDropdown, 
  viewButton, 
  children 
}: OrderHeaderProps) => {
  return (
    <div className="flex flex-1 flex-wrap justify-between items-start text-main-text gap-20">
      {/* ЛЕВЫЙ БЛОК: номер заказа + аватар + имя */}
      <div className="flex gap-x-4 items-center">
        <h2 className="text-base md:text-lg xl:text-2xl font-bold">
          {orderNumber.slice(-3)}
        </h2>
        {children}
      </div>

      {/* ПРАВЫЙ БЛОК: телефон + селект статуса + кнопка просмотра */}
      <div className="flex flex-wrap gap-5 items-center">
        <div className="flex items-center gap-2">
          <Image
            alt="Телефон"
            src="/icons-orders/icon-phone.svg"
            width={24}
            height={24}
          />
          <span className="underline">{formatPhoneNumber(phone)}</span>
        </div>
        
        {/* Селект статуса */}
        {statusDropdown}
        
        {/* Кнопка просмотра заказа */}
        {viewButton}
      </div>
    </div>
  );
};

export default OrderHeader;