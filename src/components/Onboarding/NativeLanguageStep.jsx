import React from "react";
import { LANGUAGES } from "../../utils/onboarding";

export const NativeLanguageStep = ({ value, onChange }) => {
  return (
    <div className="onboarding-step">
      <h2>What's your native language?</h2>
      <p className="step-description">
        Select the language you're most comfortable speaking
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
            <span className="option-label">{language.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
