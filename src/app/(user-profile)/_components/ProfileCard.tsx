import { useAuthStore } from "@/store/authStore";
import { CreditCard, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { InputMask } from "@react-input/mask";
import {
  cleanCardNumber,
  isValidCardNumber,
  formatCardNumber,
} from "../../../../utils/validation/validProfileCard";
import { formStyles, profileStyles } from "@/app/styles";

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
    const cleanedCardNumber = cleanCardNumber(cardNumber);

    if (!cleanedCardNumber.trim()) {
      setError("Номер карты не может быть пустым");
      return;
    }

    if (!isValidCardNumber(cleanedCardNumber)) {
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
    const cleanValue = cleanCardNumber(value).slice(0, 16);
    setCardNumber(cleanValue);
  };

  const displayValue = formatCardNumber(cardNumber, isEditing);

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
