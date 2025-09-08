import { formStyles, profileStyles } from "@/app/styles";
import { InputMask } from "@react-input/mask";
import { Phone } from "lucide-react";
import { maskedValue } from "../../../../../utils/maskPhone";

interface ProfilePhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const PhoneInput = ({ value, onChange, disabled }: ProfilePhoneInputProps) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = e.target.value;

    const clean = maskedValue.replace(/\D/g, "");
    let cleanedValue = clean;

    if (clean.startsWith("8")) {
      cleanedValue = "7" + clean.slice(1);
    } else if (clean.startsWith("7")) {
      cleanedValue = clean;
    } else if (clean.length > 0) {
      cleanedValue = "7" + clean;
    }

    if (cleanedValue.length <= 11) {
      onChange(cleanedValue);
    }
  };

  return (
    <div className={profileStyles.inputContainer}>
      <InputMask
        mask="+7 (___) ___-__-__"
        replacement={{ _: /\d/ }}
        placeholder="+7 (___) ___-__-__"
        value={maskedValue(value)}
        onChange={handleChange}
        className={`${formStyles.input} [&&]:w-full disabled:cursor-not-allowed [&&]:disabled:bg-[#f3f2f1]`}
        disabled={disabled}
      />
      <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
    </div>
  );
};

export default PhoneInput;
