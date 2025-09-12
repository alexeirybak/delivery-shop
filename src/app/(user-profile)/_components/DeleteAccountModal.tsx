"use client";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  error?: string | null;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  error,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#fbf8ec] flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-96">
        <h3 className="text-xl font-bold mb-4">Подтверждение удаления</h3>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <p className="text-main-text mb-6">
          Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя
          отменить.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-[#f3f2f1] border-none rounded flex hover:shadow-button-secondary p-2 justify-center items-center active:shadow-(--shadow-button-active) duration-300 cursor-pointer"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-[#d80000] text-white rounded hover:bg-red-700 duration-300 cursor-pointer"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
