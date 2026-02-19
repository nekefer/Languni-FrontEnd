import React from "react";
import { LANGUAGES } from "../../utils/onboarding";

export const LearningLanguageStep = ({ value, onChange, nativeLanguage }) => {
  // Filter out the native language from options
  const availableLanguages = LANGUAGES.filter(
    (lang) => lang.code !== nativeLanguage
  );

  return (
    <div className="onboarding-step">
      <h2>What language do you want to learn?</h2>
      <p className="step-description">
        Choose the language you'd like to improve
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
            <span className="option-label">{language.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
