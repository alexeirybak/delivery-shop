"use client";

interface SecuritySectionProps {
  onLogout: () => void;
  onDeleteAccount: () => void;
}

const SecuritySection: React.FC<SecuritySectionProps> = ({
  onLogout,
  onDeleteAccount,
}) => {
  return (
    <div className="border-t pt-8">
      <h2 className="text-2xl font-bold text-[#414141] mb-6">
        Безопасность
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={onLogout}
          className="flex flex-1 items-center justify-center h-10 bg-[#f3f2f1] text-[#606060] px-4 rounded font-medium hover:shadow-button-cancel active:shadow-button-cancel-active duration-300 cursor-pointer"
        >
          Выйти из аккаунта
        </button>

        <button
          onClick={onDeleteAccount}
          className="bg-[#ffc7c7] hover:bg-[#d80000] text-[#d80000] hover:text-[#f2f2f2] px-4 h-10 rounded font-medium duration-300 text-center cursor-pointer"
        >
          Удалить аккаунт
        </button>
      </div>
    </div>
  );
};

export default SecuritySection;