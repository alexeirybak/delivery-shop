import { useAuthStore } from "@/store/authStore";
import { formStyles, profileStyles } from "@/app/(auth)/styles";
import { CreditCard, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { InputMask } from "@react-input/mask";

const ProfileCard = () => {
  const { user, fetchUserData } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [cardNumber, setCardNumber] = useState(user?.card || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setCardNumber(user.card || "");
    }
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
    setCardNumber(user?.card || "");
    setError("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCardNumber(user?.card || "");
    setError("");
  };

  const handleSave = async () => {
    const cleanedCardNumber = cardNumber.replace(/\s/g, "");
    
    if (!cleanedCardNumber.trim()) {
      setError("Номер карты не может быть пустым");
      return;
    }

    if (!/^\d{16}$/.test(cleanedCardNumber)) {
      setError("Номер карты должен содержать 16 цифр");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/users/update-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          cardNumber: cleanedCardNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        fetchUserData();
        setIsEditing(false);
      } else {
        setError(data.error || "Ошибка при обновлении карты");
      }
    } catch (error) {
      console.error(error);
      setError("Ошибка сети. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;
    
    const value = e.target.value;
    // Очищаем от пробелов и ограничиваем 16 цифрами
    const cleanValue = value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(cleanValue);
  };

  // Форматируем значение для отображения
  const getDisplayValue = () => {
    if (!cardNumber) return "";
    
    const cleanValue = cardNumber.replace(/\D/g, "");
    
    if (!isEditing) {
      // В режиме просмотра показываем только последние 4 цифры
      if (cleanValue.length <= 4) return cleanValue;
      return `**** **** **** ${cleanValue.slice(-4)}`;
    }
    
    // В режиме редактирования форматируем с пробелами
    if (cleanValue.length <= 4) return cleanValue;
    if (cleanValue.length <= 8) return `${cleanValue.slice(0, 4)} ${cleanValue.slice(4)}`;
    if (cleanValue.length <= 12) return `${cleanValue.slice(0, 4)} ${cleanValue.slice(4, 8)} ${cleanValue.slice(8)}`;
    return `${cleanValue.slice(0, 4)} ${cleanValue.slice(4, 8)} ${cleanValue.slice(8, 12)} ${cleanValue.slice(12)}`;
  };

  const displayValue = getDisplayValue();

  return (
    <div className="mb-8">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <h3 className={profileStyles.sectionTitle}>Карта</h3>

        {!isEditing ? (
          <button
            onClick={handleEditClick}
            className={profileStyles.editButton}
          >
            {user?.card ? "Изменить карту" : "Добавить карту"}
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className={profileStyles.cancelButton}
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className={profileStyles.saveButton}
              disabled={isLoading}
            >
              {isLoading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        )}
      </div>

      <div className={profileStyles.inputContainer}>
        {isEditing ? (
          // В режиме редактирования используем InputMask
          <InputMask
            mask="____ ____ ____ ____"
            replacement={{ _: /\d/ }}
            value={displayValue}
            onChange={handleCardNumberChange}
            placeholder="0000 0000 0000 0000"
            className={`${formStyles.input} [&&]:w-full`}
            disabled={isLoading}
          />
        ) : (
          // В режиме просмотра используем обычный input
          <input
            type="text"
            value={displayValue || "Не указана"}
            className={`${formStyles.input} [&&]:w-full disabled:cursor-not-allowed [&&]:disabled:bg-[#f3f2f1]`}
            disabled
            readOnly
          />
        )}
        <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {!user?.card && !isEditing && (
        <p className="text-gray-500 text-sm mt-2">
          Добавьте номер карты лояльности для получения бонусов
        </p>
      )}
    </div>
  );
};

export default ProfileCard;