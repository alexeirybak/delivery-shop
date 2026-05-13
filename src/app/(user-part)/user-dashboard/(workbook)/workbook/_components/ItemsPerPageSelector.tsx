import "../../styles/items-per-page-selector.css";

export const ItemsPerPageSelector = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => (
  <div className="items-per-page-selector">
    <span>Показывать:</span>
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      <option value="2">2</option>
      <option value="5">5</option>
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="50">50</option>
      <option value="100">100</option>
    </select>
  </div>
);