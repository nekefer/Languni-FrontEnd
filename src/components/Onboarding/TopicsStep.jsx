import React from "react";
import { TOPICS } from "../../utils/onboarding";

export const TopicsStep = ({ value = [], onChange }) => {
  const toggleTopic = (topicId) => {
    if (value.includes(topicId)) {
      onChange(value.filter((id) => id !== topicId));
    } else {
      onChange([...value, topicId]);
    }
  };

  return (
    <div className="onboarding-step">
      <h2>What topics interest you?</h2>
      <p className="step-description">
        Select all topics you'd like to explore (you can choose multiple)
      </p>
      {value.length > 0 && (
        <div className="selection-count">
          {value.length} topic{value.length !== 1 ? "s" : ""} selected
        </div>
      )}
      <div className="topics-grid">
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            type="button"
            className={`topic-card ${value.includes(topic.id) ? "selected" : ""}`}
            onClick={() => toggleTopic(topic.id)}
          >
            <span className="topic-icon">{topic.icon}</span>
            <span className="topic-label">{topic.name}</span>
            {value.includes(topic.id) && (
              <span className="checkmark">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
