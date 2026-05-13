import { Mail, ArrowRight } from "lucide-react";
import { EmailStepProps } from "../../types";

export const EmailStep = ({
  email,
  onEmailChange,
  isChecking,
  errors,
  onCheckEmail,
}: EmailStepProps) => {
  return (
    <form
      className="register-form"
      onSubmit={(e) => {
        e.preventDefault();
        onCheckEmail();
      }}
    >
      <div className="form-group required">
        <label htmlFor="email">
          <Mail className="w-4 h-4" />
          <span>Email</span>
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={onEmailChange}
          placeholder="alex@neurodidactica.ru"
          className={`form-input ${errors.email ? "error" : ""}`}
          autoComplete="username"
          disabled={isChecking}
        />
        {errors.email && <div className="field-error">{errors.email}</div>}
      </div>

      <button type="submit" className="register-button" disabled={isChecking}>
        {isChecking ? "Проверка..." : "Продолжить"}
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
};
