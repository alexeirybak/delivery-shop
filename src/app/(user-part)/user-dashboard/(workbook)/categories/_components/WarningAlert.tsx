import "../styles/warning-alert.css";

export const WarningAlert = () => {
  return (
    <div className="warning-alert">
      <p className="warning-alert-text">
        <strong>Внимание:</strong> Удаление тетради допустимо, только если в ней нет записей. При удалении тетради все записи должны быть перенесены в другие тетради или удалены.
      </p>
    </div>
  );
};