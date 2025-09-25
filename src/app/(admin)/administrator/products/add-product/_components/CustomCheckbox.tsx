interface CustomCheckboxProps {
  name: string;
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomCheckbox = ({
  name,
  label,
  checked,
  onChange,
}: CustomCheckboxProps) => {
  return (
    <label className="flex items-center space-x-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="absolute opacity-0 w-0 h-0"
        />
        <div
          className={`relative w-5 h-5 border rounded flex items-center justify-center duration-300 ${
            checked ? "bg-primary border-primary" : "bg-white border-[#bfbfbf]"
          }`}
        >
          {checked && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
      <span className="text-sm">{label}</span>
    </label>
  );
};

export default CustomCheckbox;
