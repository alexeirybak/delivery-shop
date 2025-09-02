import { Phone } from "lucide-react";
import { profileStyles, formStyles } from "@/app/(auth)/styles";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

const PhoneInput = ({
  value,
  onChange,
  placeholder = "Введите номер телефона",
  disabled = false,
  id = "phone",
}: PhoneInputProps) => {
  return (
    <div className={profileStyles.inputContainer}>
      <input
        id={id}
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${formStyles.input} [&&]:w-full disabled:cursor-not-allowed [&&]:disabled:bg-[#f3f2f1]`}
        placeholder={placeholder}
        disabled={disabled}
      />
      <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
    </div>
  );
};

export default PhoneInput;