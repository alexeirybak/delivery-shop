import SelectRegion from "@/app/(auth)/(reg)/_components/SelectRegion";
import SelectCity from "@/app/(auth)/(reg)/_components/SelectCity";
import { useState, useEffect, ChangeEvent } from "react";
import { useAuthStore } from "@/store/authStore";
import { buttonStyles } from "@/app/(auth)/styles";

interface ProfileFormData {
  region: string;
  location: string;
}

const LocationSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user, fetchUserData } = useAuthStore();
  const [formData, setFormData] = useState<ProfileFormData>({
    region: "",
    location: "",
  });

  // Загружаем данные пользователя при монтировании
  useEffect(() => {
    if (user) {
      setFormData({
        region: user.region || "",
        location: user.location || "",
      });
    }
  }, [user]);

  const handleRegionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, region: e.target.value }));
    setIsEditing(true);
  };

  const handleCityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, location: e.target.value }));
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/auth/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          region: formData.region,
          location: formData.location,
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка сохранения");
      }

      // Обновляем данные пользователя в store
      await fetchUserData();
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      alert("Не удалось сохранить изменения");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Возвращаем исходные данные пользователя
    setFormData({
      region: user?.region || "",
      location: user?.location || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#414141]">Местоположение</h3>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className={`${buttonStyles.active} px-4 py-2 rounded items-center justify-center font-medium duration-300 cursor-pointer`}
          >
            Редактировать
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 flex-1 bg-[#f3f2f1] rounded hover:shadow-button-secondary active:shadow-(--shadow-button-active) text-[#606060] duration-300 cursor-pointer"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || (!formData.region && !formData.location)}
              className="px-4 py-2 flex-1 bg-primary hover:shadow-(--shadow-button-default) active:shadow-(--shadow-button-active) hidden md:flex w-10 p-2 gap-4 lg:w-35 rounded text-white duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSaving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectRegion
          value={formData.region}
          onChangeAction={handleRegionChange}
          disabled={!isEditing}
          className="w-full"
        />

        <SelectCity
          value={formData.location}
          onChangeAction={handleCityChange}
          disabled={!isEditing}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default LocationSection;
