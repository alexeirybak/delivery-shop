import { FormFieldProps } from "../../types/siteSettings";

export const FormField = ({
  label,
  value,
  onChange,
  type,
  placeholder,
  hint,
  rows = 3,
  showCommaHint = false,
  disabled = false,
}: FormFieldProps) => {
  const inputClasses = `w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 ${
    disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : ""
  }`;

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}
        {showCommaHint && (
          <span className="text-gray-500 text-sm font-normal ml-2">
            (через запятую)
          </span>
        )}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={inputClasses}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
      <p className="text-xs text-gray-500 mt-1">{hint}</p>
    </div>
  );
}

