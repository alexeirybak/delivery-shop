export const ItemsPerPageSelector = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => (
  <div className="flex items-center gap-2 mb-4">
    <span className="text-sm text-gray-600">Показывать:</span>
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="text-sm border border-gray-300 rounded px-2 py-1"
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