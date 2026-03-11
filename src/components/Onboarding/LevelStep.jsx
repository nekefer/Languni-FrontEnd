import React from "react";
import { useTranslation } from "react-i18next";
import { LEVELS } from "../../utils/onboarding";

export const LevelStep = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="onboarding-step">
      <h2>{t('onboarding.level.title')}</h2>
      <p className="step-description">
        {t('onboarding.level.subtitle')}
      </p>
      <div className="levels-grid">
        {LEVELS.map((level) => (
          <button
            key={level.id}
            type="button"
            className={`level-card ${value === level.id ? "selected" : ""}`}
            onClick={() => onChange(level.id)}
          >
            <div className="level-header">
              <level.icon className="level-icon" size={32} strokeWidth={1.5} />
              <span className="level-name">{t(`onboarding.levels.${level.id}.name`)}</span>
            </div>
            <p className="level-description">{t(`onboarding.levels.${level.id}.description`)}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
