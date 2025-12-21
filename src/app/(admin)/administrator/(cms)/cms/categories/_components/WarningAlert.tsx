export const WarningAlert = () => {
  return (
    <div className="my-6 p-4 bg-yellow-50 rounded">
      <p className="text-sm text-yellow-800">
        <strong>Внимание:</strong> Удаление категории допустимо только если в
        ней нет статей. При удалении категории все статьи должны быть перенесены
        в другие категории.
      </p>
    </div>
  );
};
