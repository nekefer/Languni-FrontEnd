import React from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../../utils/onboarding";

export const NativeLanguageStep = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="onboarding-step">
      <h2>{t('onboarding.nativeLanguage.title')}</h2>
      <p className="step-description">
        {t('onboarding.nativeLanguage.subtitle')}
      </p>
      <div className="options-grid">
        {LANGUAGES.map((language) => (
          <button
            key={language.code}
            type="button"
            className={`option-card ${value === language.code ? "selected" : ""}`}
            onClick={() => onChange(language.code)}
          >
            <span className="option-icon">{language.flag}</span>
            <span className="option-label">{t(`onboarding.language.${language.code}`)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
