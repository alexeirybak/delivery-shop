import { useAuthStore } from "@/store/authStore";
import { CreditCard } from "lucide-react";

const Finance = () => {
  const { user } = useAuthStore();
  const balance = user?.balance;
  return (
    <div className="user-profile-section">
      <h2 className="user-profile-section-title">Финансовая информация</h2>
      <div className="user-profile-balance">
        <CreditCard className="w-5 h-5" />
        <div className="user-profile-balance-info">
          <span className="user-profile-balance-label">Баланс счета</span>
          <span className="user-profile-balance-value">{balance || 0} ₽</span>
        </div>
        <button className="user-profile-balance-btn" disabled>
          Пополнить
          <span className="user-profile-badge-coming">Скоро</span>
        </button>
      </div>
      <p className="user-profile-note">
        Система оплаты находится в разработке. Баланс отображается для
        тестирования.
      </p>
    </div>
  );
};

export default Finance;
