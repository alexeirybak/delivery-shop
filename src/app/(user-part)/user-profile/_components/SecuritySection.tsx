import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteAccountModal from "./DeleteAccountModal";
import "../styles/security-section.css";

const SecuritySection: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleAppLogout = async () => {
    try {
      await logout();
      router.replace("/");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      setError("Не удалось выйти из приложения");
    }
  };

  const handleDeleteAccount = () => {
    router.push("/auth/verify-delete-account");
  };

  const handleOpenDeleteModal = () => {
    setError(null);
    setShowDeleteConfirm(true);
  };

  const handleCloseDeleteModal = () => {
    setError(null);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="security-section">
        <h2 className="security-section-title">Безопасность</h2>

        {error && <div className="security-error">{error}</div>}

        <div className="security-buttons-grid">
          <button
            onClick={handleAppLogout}
            className="security-btn security-btn-outline"
          >
            Выйти из приложения
          </button>

          <button
            onClick={handleOpenDeleteModal}
            className="security-btn security-btn-danger"
          >
            Удалить аккаунт
          </button>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={showDeleteConfirm}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteAccount}
        error={error}
      />
    </>
  );
};

export default SecuritySection;
