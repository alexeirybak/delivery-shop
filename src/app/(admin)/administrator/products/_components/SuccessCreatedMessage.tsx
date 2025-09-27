import { useRouter } from "next/navigation";

interface SuccessCreatedMessageProps {
  createdProductId: number;
  categories: string[];
  onClearForm: () => void;
}

const SuccessCreatedMessage = ({
  createdProductId,
  categories,
  onClearForm,
}: SuccessCreatedMessageProps) => {
  const router = useRouter();
  return (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg w-full max-w-2xl">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-green-800 font-medium">Товар успешно создан!</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              router.push(`/catalog/${categories[0]}/${createdProductId}`)
            }
            className="px-4 py-2 bg-primary text-white rounded hover:bg-green-700 text-sm cursor-pointer"
          >
            Перейти к товару
          </button>
          <button
            onClick={onClearForm}
            className="px-4 py-2 bg-gray-300 text-white rounded hover:bg-gray-500 text-sm cursor-pointer"
          >
            Добавить еще
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessCreatedMessage;
