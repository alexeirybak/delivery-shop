"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useStoreHydration } from "@/hooks/useStoreHydration";
import { getAvatarPath } from "../../../utils/defaultAvatar";
import { LoadingContent } from "../(auth)/(reg)/_components/LoadingContent";
import { MailWarning, Phone } from "lucide-react";
import { ErrorContent } from "../(auth)/(reg)/_components/ErrorContent";
import { ProfileFormData } from "@/types/profileFormDataProps";
import DeleteAccountModal from "./_components/DeleteAccountModal";
import ProfileHeader from "./_components/ProfileHeader";
import ProfileAvatar from "./_components/ProfileAvatar";
import SelectRegion from "../(auth)/(reg)/_components/SelectRegion";
import SelectCity from "../(auth)/(reg)/_components/SelectCity";
import ProfileEmail from "./_components/ProfileEmail";
import CardInput from "../(auth)/(reg)/_components/CardInput";
import { validateCardNumber } from "../../../utils/validation/cardNumberValidation";
import EditActions from "./_components/EditAction";
import SecuritySection from "./_components/SecuritySection"; // Импортируем новый компонент
import { validateEmail } from "../../../utils/validation/emailValidation";
import ErrorComponent from "@/components/ErrorComponent";
import "./styles.css";
import { authClient } from "@/lib/auth-client";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    email: "",
    region: "",
    location: "",
    avatar: "",
    card: "",
    hasCard: false,
  });

  const { user, isAuth, updateUser, logout } = useAuthStore();
  const router = useRouter();
  const isHydrated = useStoreHydration();
  const gender = user?.gender || "male";

  const isPhoneRegistration = user?.isPhoneRegistration;

  useEffect(() => {
    if (user && isHydrated) {
      setFormData({
        email: user.email || "",
        region: user.region || "",
        location: user.location || "",
        avatar: user.avatar || getAvatarPath(gender),
        card: user.card || "",
        hasCard: user.hasCard || false,
      });
    }
  }, [user, isHydrated, gender]);

  useEffect(() => {
    if (isHydrated && !isAuth) {
      router.push("/login");
    }
  }, [isAuth, isHydrated, router]);

  const handleToLogin = () => {
    router.replace("/login");
  };

  const handleToRegister = () => {
    router.replace("/register");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAvatar = e.target?.result as string;
        setFormData((prev) => ({ ...prev, avatar: newAvatar }));
      };
      reader.readAsDataURL(file);
    }
  };

  // В компоненте ProfilePage
  const handleEmailChange = async () => {
    if (!user || !formData.email) return;

    setIsLoading(true);
    setError(null);
    setEmailError(null);

    try {
      const result = await authClient.changeEmail({
        newEmail: formData.email,
        callbackURL: `${window.location.origin}/confirm-email-change`,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Показываем сообщение о необходимости подтверждения
      setError({
        error: new Error("Email change requires verification"),
        userMessage:
          "Проверьте ваш текущий email для подтверждения смены. Ссылка действительна 1 час.",
      });
    } catch (error) {
      setError({
        error: error instanceof Error ? error : new Error("Неизвестная ошибка"),
        userMessage: "Ошибка при смене email. Попробуйте снова",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, type, value, checked } = target;
    setError(null);

    // Отслеживаем изменение email
    if (name === "email" && value !== user?.email) {
      setIsEmailChanged(true);
    }

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Обновите handleCancel для сброса состояния
  const handleCancel = () => {
    if (!user) return;

    setIsEditing(false);
    setIsEmailChanged(false); // Сбрасываем флаг изменения email
    setFormData({
      email: user.email || "",
      region: user.region || "",
      location: user.location || "",
      avatar: user.avatar || getAvatarPath(user.gender),
      card: user.card || "",
      hasCard: user.hasCard || false,
    });
  };

  const handleSave = async () => {
    if (!user) return;

    setError(null);
    setEmailError(null);
    setCardError(null);

    // Валидация email
    if (formData.email) {
      const emailValidationError = validateEmail(formData.email);
      if (emailValidationError) {
        setEmailError(emailValidationError);
        return;
      }
    }

    // Валидация карты
    const cardValidationError = validateCardNumber(formData.card);
    if (cardValidationError) {
      setCardError(cardValidationError);
      return;
    }

    // Если email изменился И пользователь зарегистрирован по email
    if (formData.email !== user.email && !isPhoneRegistration) {
      await handleEmailChange(); // Используем сложную процедуру смены email
      return;
    }

    // Стандартное сохранение для других случаев:
    // - Пользователь зарегистрирован по телефону
    // - Email не менялся
    // - Меняются другие поля (регион, город и т.д.)
    setIsLoading(true);

    try {
      const updatesToSend: Omit<ProfileFormData, "avatar"> & {
        avatar?: string;
      } = {
        email: formData.email,
        region: formData.region,
        location: formData.location,
        card: formData.card?.replace(/\s/g, ""),
        hasCard: formData.hasCard,
      };

      if (formData.avatar && !formData.avatar.startsWith("data:image")) {
        updatesToSend.avatar = formData.avatar;
      }

      const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          updates: updatesToSend,
        }),
      });

      await response.json();

      if (!response.ok) {
        throw new Error("Ошибка при сохранении профиля");
      }

      updateUser({
        name: user.name,
        surname: user.surname,
        email: formData.email,
        region: formData.region,
        location: formData.location,
        avatar: formData.avatar,
        gender: user.gender,
        card: formData.card,
      });
      setIsEditing(false);
    } catch (error) {
      setError({
        error: error instanceof Error ? error : new Error("Неизвестная ошибка"),
        userMessage: "Ошибка обновления профиля. Попробуйте снова",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      });

      if (response.ok) {
        logout();
        router.replace("/");
      }
    } catch (error) {
      console.error("Ошибка при удалении аккаунта:", error);
    }
    setShowDeleteConfirm(false);
  };

  if (!isHydrated) {
    return <LoadingContent title="Загрузка профиля" />;
  }

  if (!isAuth) {
    return <LoadingContent title="Перенаправление на главную страницу" />;
  }

  if (!user) {
    return (
      <ErrorContent
        error="Данные пользователя не найдены"
        icon={<MailWarning className="h-8 w-8 text-red-600" />}
        primaryAction={{ label: "Войти", onClick: handleToLogin }}
        secondaryAction={{
          label: "Зарегистрироваться",
          onClick: handleToRegister,
        }}
      />
    );
  }

  if (error) {
    return (
      <ErrorComponent error={error.error} userMessage={error.userMessage} />
    );
  }

  return (
    <>
      <div className="bg-[#fbf8ec] px-4 md:px-6 xl:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-slide-in opacity-0 translate-y-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden duration-700 ease-out">
              <ProfileHeader name={user.name} surname={user.surname} />
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center">
                    {isPhoneRegistration ? (
                      <>
                        <Phone className="h-4 w-4 mr-1" />
                        <span>Зарегистрирован по телефону</span>
                      </>
                    ) : (
                      <>
                        <MailWarning className="h-4 w-4 mr-1" />
                        <span>Зарегистрирован по email</span>
                      </>
                    )}
                  </div>
                </div>

                <ProfileAvatar
                  avatar={formData.avatar}
                  gender={user.gender || "male"}
                  isEditing={isEditing}
                  onAvatarChangeAction={handleAvatarChange}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <SelectRegion
                    value={formData.region}
                    onChangeAction={handleInputChange}
                    disabled={!isEditing}
                    className="w-full"
                  />

                  <SelectCity
                    value={formData.location}
                    onChangeAction={handleInputChange}
                    disabled={!isEditing}
                    className="w-full"
                  />
                  <div>
                    <ProfileEmail
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      error={emailError}
                    />
                    {isEditing && !isPhoneRegistration && isEmailChanged && (
                      <div className="bg-primary border border-blue-200 rounded-lg p-4 my-6">
                        <h3 className="text-white font-semibold mb-2">
                          Информация о смене email
                        </h3>
                        <p className="text-white text-sm">
                          Так как Ваш email верифицирован, для его изменения
                          потребуется подтверждение через текущий почтовый ящик.
                          После запроса смены проверьте Вашу почту.
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <CardInput
                      value={formData.card}
                      onChangeAction={handleInputChange}
                      disabled={!isEditing}
                      error={cardError}
                      className="w-full"
                    />
                    {formData.card && (
                      <p className="text-sm text-primary">Карта привязана</p>
                    )}
                    {!formData.card && !isEditing && (
                      <p className="text-sm text-gray-500">
                        Нет привязанной карты
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <EditActions
                    isEditing={isEditing}
                    isLoading={isLoading}
                    onEditStart={() => setIsEditing(true)}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                </div>

                <SecuritySection
                  onLogout={handleLogout}
                  onDeleteAccount={() => setShowDeleteConfirm(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
      />
    </>
  );
};

export default ProfilePage;
