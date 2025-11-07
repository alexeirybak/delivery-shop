export const RepeatOrderSuccessAlert: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center">
        <p className="text-[#008c48] font-medium">
          Повторный заказ успешно создан! Вы можете отслеживать его в разделе &quot;Мои заказы&quot;.
        </p>
      </div>
    </div>
  );
};