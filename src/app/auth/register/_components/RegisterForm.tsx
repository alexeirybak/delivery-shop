import Link from "next/link";
import {
  ArrowRight,
  Mail,
  User,
  Brain,
  Sparkles,
  Briefcase,
  Globe,
} from "lucide-react";
import CustomStatusSelect from "./CustomStatusSelect";
import { PasswordInput } from "../../_components/PasswordInput";
import { RegisterFormProps } from "../../types";

export default function RegisterForm({
  formData,
  errors,
  isSubmitted,
  isLoading,
  handleChange,
  handleSubmit,
}: RegisterFormProps) {
  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <div className="form-group required">
        <label htmlFor="name">
          <User className="w-4 h-4" />
          <span>Имя</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Александр"
          className={`form-input ${errors.name && isSubmitted ? "error" : ""}`}
          autoComplete="name"
        />
        {errors.name && isSubmitted && (
          <div className="field-error">{errors.name}</div>
        )}
      </div>

      <div className="form-group required">
        <label htmlFor="email">
          <Mail className="w-4 h-4" />
          <span>Email</span>
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="alex@neurodidactica.ru"
          className={`form-input ${errors.email && isSubmitted ? "error" : ""}`}
          autoComplete="username"
        />
        {errors.email && isSubmitted && (
          <div className="field-error">{errors.email}</div>
        )}
      </div>

      <PasswordInput
        id="password"
        label="Пароль"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        isSubmitted={isSubmitted}
        autoComplete="new-password"
        showStrength={true}
      />

      <PasswordInput
        id="confirmPassword"
        label="Подтвердите пароль"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        isSubmitted={isSubmitted}
        autoComplete="new-password"
        compareWith={formData.password}
        tooltipMessage="Пароли пока не совпадают"
      />

      <div className="optional-fields-section">
        <div className="optional-fields-header">
          <span className="optional-badge">Дополнительно</span>
          <p className="optional-description">
            Эти поля помогут нам лучше настроить платформу под вас
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="status">
            <User className="w-4 h-4" />
            <span>Статус</span>
          </label>
          <CustomStatusSelect />
        </div>

        <div className="form-group">
          <label htmlFor="country">
            <Globe className="w-4 h-4" />
            <span>Страна</span>
          </label>
          <input
            type="text"
            id="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Россия"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="organization">
            <Briefcase className="w-4 h-4" />
            <span>Организация/Учебное заведение</span>
          </label>
          <input
            type="text"
            id="organization"
            value={formData.organization}
            onChange={handleChange}
            placeholder="Название школы, вуза или компании"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="specialization">
            <Brain className="w-4 h-4" />
            <span>Специализация/Предметная область</span>
          </label>
          <input
            type="text"
            id="specialization"
            value={formData.specialization}
            onChange={handleChange}
            placeholder="Например: Математика, Экономика"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="interests">
            <Sparkles className="w-4 h-4" />
            <span>Интересы (через запятую)</span>
          </label>
          <input
            type="text"
            id="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="Педагогика, Data Science"
            className="form-input"
          />
        </div>
      </div>

      <p className="social-divider">Для регистрации примите условия</p>

      <div className="form-checkbox required">
        <input
          type="checkbox"
          id="termsAccepted"
          checked={formData.termsAccepted}
          onChange={handleChange}
        />
        <label htmlFor="termsAccepted">
          Я принимаю <Link href="/conditions/terms">условия использования</Link>{" "}
          и <Link href="/conditions/privacy">политику конфиденциальности</Link>
          <span className="required-star">*</span>
        </label>
      </div>
      {errors.termsAccepted && isSubmitted && (
        <div className="field-error terms-error">{errors.termsAccepted}</div>
      )}

      <button type="submit" className="register-button" disabled={isLoading}>
        {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
