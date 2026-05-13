import { useAuthStore } from "@/store/authStore";
import { Info } from "lucide-react";

const EmailInfo = () => {
  const { user } = useAuthStore();
  const email = user?.email;
  return (
    <div className="user-profile-info-block">
      <Info className="user-profile-info-icon" />
      <div className="user-profile-info-text">
        <p>
          Вы зарегистрировались через ВКонтакте. Email <strong>{email}</strong>{" "}
          является техническим. Для надежного получения уведомлений
          рекомендуется добавить реальный email.
        </p>
      </div>
    </div>
  );
};

export default EmailInfo;
