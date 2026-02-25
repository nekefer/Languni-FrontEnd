import React from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../../utils/onboarding";

export const LearningLanguageStep = ({ value, onChange, nativeLanguage }) => {
  const { t } = useTranslation();

  // Filter out the native language from options
  const availableLanguages = LANGUAGES.filter(
    (lang) => lang.code !== nativeLanguage
  );

  return (
    <div className="onboarding-step">
      <h2>{t('onboarding.learningLanguage.title')}</h2>
      <p className="step-description">
        {t('onboarding.learningLanguage.subtitle')}
      </p>
      <div className={`options-grid${availableLanguages.length === 2 ? " options-grid--two" : ""}`}>
        {availableLanguages.map((language) => (
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
