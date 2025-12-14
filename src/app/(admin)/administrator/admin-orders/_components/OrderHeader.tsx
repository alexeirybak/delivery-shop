
interface OrderHeaderProps {
  orderNumber: string;
  phone: string;
  children: React.ReactNode;
}

const OrderHeader = ({ 
  orderNumber,  
  children,
}: OrderHeaderProps) => {
  return (
    <div className="flex gap-x-4 items-center">
      <h2 className="text-base md:text-lg xl:text-2xl font-bold">
        {orderNumber.slice(-3)}
      </h2>
      {children}
    </div>
  );
};

export default OrderHeader;