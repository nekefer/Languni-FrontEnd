import React, { useState } from "react";
import posthog from "posthog-js";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useOnboarding } from "../../contexts/onboarding-context";
import preferencesService from "../../api/preferences";
import { NativeLanguageStep } from "./NativeLanguageStep";
import { LearningLanguageStep } from "./LearningLanguageStep";
import { TopicsStep } from "./TopicsStep";
import { LevelStep } from "./LevelStep";
import { Spinner } from "../../ui/Spinner";
import { createLogger } from "../../utils/logger";
import "../../styles/Onboarding.css";
import languni from "../../assets/Languni.webp";

const logger = createLogger("onboarding");

const TOTAL_STEPS = 4;

export const OnboardingFlow = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { markOnboardingComplete } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    native_language: null,
    learning_language: null,
    topics: [],
    level: null,
  });

  const getProgress = () => {
    return ((currentStep / TOTAL_STEPS) * 100).toFixed(0);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return preferences.native_language !== null;
      case 2:
        return (
          preferences.learning_language !== null &&
          preferences.learning_language !== preferences.native_language
        );
      case 3:
        return preferences.topics.length > 0;
      case 4:
        return preferences.level !== null;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceed()) {
      toast.error(t('onboarding.completeStep'));
      return;
    }
    posthog.capture("onboarding_step_completed", { step: currentStep });
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!canProceed()) {
      toast.error(t('onboarding.completeAll'));
      return;
    }

    // Validate all fields
    if (
      !preferences.native_language ||
      !preferences.learning_language ||
      preferences.topics.length === 0 ||
      !preferences.level
    ) {
      toast.error(t('onboarding.completeAll'));
      return;
    }

    setLoading(true);
    try {
      await preferencesService.savePreferences({
        native_language: preferences.native_language,
        learning_language: preferences.learning_language,
        topics: preferences.topics,
        level: preferences.level,
      });

      logger.info("Onboarding completed", {
        learning_language: preferences.learning_language,
        level: preferences.level,
      });
      posthog.capture("onboarding_completed", {
        learning_language: preferences.learning_language,
        native_language: preferences.native_language,
        level: preferences.level,
        topics_count: preferences.topics.length,
      });

      // Update auth context to reflect completed onboarding
      markOnboardingComplete();

      toast.success(t('onboarding.success'));
      navigate({ to: "/dashboard" });
    } catch (error) {
      logger.error("Failed to save preferences", error);
      toast.error(
        error.message || t('onboarding.saveFailed'),
      );
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = (field, value) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <NativeLanguageStep
            value={preferences.native_language}
            onChange={(value) => updatePreference("native_language", value)}
          />
        );
      case 2:
        return (
          <LearningLanguageStep
            value={preferences.learning_language}
            onChange={(value) => updatePreference("learning_language", value)}
            nativeLanguage={preferences.native_language}
          />
        );
      case 3:
        return (
          <TopicsStep
            value={preferences.topics}
            onChange={(value) => updatePreference("topics", value)}
          />
        );
      case 4:
        return (
          <LevelStep
            value={preferences.level}
            onChange={(value) => updatePreference("level", value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        {/* Logo */}
        <div className="onboarding-logo">
          <img src={languni} alt="Languni" width="139" height="36" />
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${getProgress()}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {t('onboarding.stepOf', { current: currentStep, total: TOTAL_STEPS })}
          </div>
        </div>

        {/* Step Content */}
        <div className="step-content">{renderStep()}</div>

        {/* Navigation Buttons */}
        <div className="onboarding-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleBack}
            disabled={currentStep === 1 || loading}
          >
            {t('onboarding.back')}
          </button>
          {currentStep < TOTAL_STEPS ? (
            <button
              type="button"
              className="btn-primary"
              onClick={handleNext}
              disabled={!canProceed() || loading}
            >
              {t('onboarding.continue')}
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={handleComplete}
              disabled={!canProceed() || loading}
            >
              {loading ? (
                <>
                  <Spinner size={16} /> {t('onboarding.saving')}
                </>
              ) : (
                t('onboarding.getStarted')
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
