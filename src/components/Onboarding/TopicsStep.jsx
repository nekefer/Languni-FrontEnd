import React from "react";
import { useTranslation } from "react-i18next";
import { TOPICS } from "../../utils/onboarding";

export const TopicsStep = ({ value = [], onChange }) => {
  const { t } = useTranslation();

  const toggleTopic = (topicId) => {
    if (value.includes(topicId)) {
      onChange(value.filter((id) => id !== topicId));
    } else {
      onChange([...value, topicId]);
    }
  };

  return (
    <div className="onboarding-step">
      <h2>{t('onboarding.topics.title')}</h2>
      <p className="step-description">
        {t('onboarding.topics.subtitle')}
      </p>
      <div className="selection-count">
        {t('onboarding.topics.selected', { count: value.length })}
      </div>
      <div className="topics-grid">
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            type="button"
            className={`topic-card ${value.includes(topic.id) ? "selected" : ""}`}
            onClick={() => toggleTopic(topic.id)}
          >
            <span className="topic-icon">{topic.icon}</span>
            <span className="topic-label">{t(`onboarding.topicNames.${topic.id}`)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
