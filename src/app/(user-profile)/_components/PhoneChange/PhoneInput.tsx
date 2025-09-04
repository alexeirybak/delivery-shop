import { Phone } from "lucide-react";
import { profileStyles, formStyles } from "@/app/(auth)/styles";
import { InputMask } from "@react-input/mask";
import { useMemo } from "react";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const PhoneInput = ({ 
  value, 
  onChange, 
  disabled = false,
}: PhoneInputProps) => {
  
  const maskedValue = useMemo(() => {
    if (!value) return "";
    
    let cleanPhone = value.replace(/\D/g, '');
    if (cleanPhone.startsWith('8')) {
      cleanPhone = '7' + cleanPhone.slice(1);
    }
    
    let formatted = "+7";
    if (cleanPhone.length > 1) {
      formatted += ` (${cleanPhone.slice(1, 4)}`;
    }
    if (cleanPhone.length > 4) {
      formatted += `) ${cleanPhone.slice(4, 7)}`;
    }
    if (cleanPhone.length > 7) {
      formatted += `-${cleanPhone.slice(7, 9)}`;
    }
    if (cleanPhone.length > 9) {
      formatted += `-${cleanPhone.slice(9, 11)}`;
    }
    
    return formatted;
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = e.target.value;
    
    // Очищаем маску и получаем чистый номер
    const clean = maskedValue.replace(/\D/g, '');
    let cleanedValue = clean;
    
    // Приводим к формату 79998887766
    if (clean.startsWith('8')) {
      cleanedValue = '7' + clean.slice(1);
    } else if (clean.startsWith('7')) {
      cleanedValue = clean;
    } else if (clean.length > 0) {
      cleanedValue = '7' + clean;
    }
    
    // Ограничиваем длину
    if (cleanedValue.length <= 11) {
      onChange(cleanedValue);
    }
  };

  return (
    <div className={profileStyles.inputContainer}>
      <InputMask
        mask="+7 (___) ___-__-__"
        replacement={{ _: /\d/ }}
        value={maskedValue}
        onChange={handleChange}
        placeholder="+7 (___) ___-__-__"
        className={`${formStyles.input} [&&]:w-full disabled:cursor-not-allowed [&&]:disabled:bg-[#f3f2f1]`}
        disabled={disabled}
      />
      <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
    </div>
  );
};

export default PhoneInput;