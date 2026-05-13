"use client";

import Link from "next/link";
import { GoogleAuthButton } from "../../_components/GoogleAuthButton";
import { VkAuthButton } from "../../_components/VkAuthButton";
import { SocialAuthProps } from "../../types";

export const SocialAuth = ({
  termsAccepted,
  onTermsChange,
  termsError,
  isLoading,
  isGoogleLoading,
  setIsGoogleLoading,
  isVkLoading,
  setIsVkLoading,
  onSetErrors,
}: SocialAuthProps) => {
  return (
    <div className="social-register">
      <p className="social-divider">или</p>

      <div className="form-checkbox required">
        <input
          type="checkbox"
          id="termsAccepted"
          checked={termsAccepted}
          onChange={onTermsChange}
        />
        <label htmlFor="termsAccepted">
          Я принимаю <Link href="/conditions/terms">условия использования</Link>{" "}
          и <Link href="/conditions/privacy">политику конфиденциальности</Link>
          <span className="required-star">*</span>
        </label>
      </div>
      {termsError && (
        <div className="field-error terms-error">{termsError}</div>
      )}

      <div className="social-buttons">
        <GoogleAuthButton
          isLoading={isLoading}
          isGoogleLoading={isGoogleLoading}
          setIsGoogleLoading={setIsGoogleLoading}
          disabled={isLoading || isGoogleLoading || isVkLoading}
          typeAuth="signIn"
          onCheckTerms={() => {
            if (!termsAccepted) {
              onSetErrors({
                termsAccepted: "Необходимо принять условия использования",
              });
              return false;
            }
            return true;
          }}
        />
        <VkAuthButton
          isLoading={isLoading}
          isVkLoading={isVkLoading}
          setIsVkLoading={setIsVkLoading}
          disabled={isLoading || isGoogleLoading || isVkLoading}
          typeAuth="signIn"
          onCheckTerms={() => {
            if (!termsAccepted) {
              onSetErrors({
                termsAccepted: "Необходимо принять условия использования",
              });
              return false;
            }
            return true;
          }}
        />
      </div>
    </div>
  );
};
