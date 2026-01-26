import React from "react";
import { LEVELS } from "../../utils/onboarding";

export const LevelStep = ({ value, onChange }) => {
  return (
    <div className="onboarding-step">
      <h2>What's your current level?</h2>
      <p className="step-description">
        Help us personalize your learning experience
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
              <span className="level-icon">{level.icon}</span>
              <span className="level-name">{level.name}</span>
              {value === level.id && <span className="checkmark">✓</span>}
            </div>
            <p className="level-description">{level.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
