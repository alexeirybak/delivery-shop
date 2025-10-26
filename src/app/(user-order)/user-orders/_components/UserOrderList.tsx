import { Order } from "@/types/order";
import OrderCard from "./OrderCard";

const UserOrdersList = ({ orders }: { orders: Order[] }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center text-main-text py-12">
        <h3 className="text-xl font-semibold mb-2">Заказов пока нет</h3>
        <p>Когда вы сделаете заказ, он появится здесь</p>
      </div>
    );
  }

  return (
    <div className="space-y-30">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
};

export default UserOrdersList;
