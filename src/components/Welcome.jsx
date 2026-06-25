import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import posthog from "posthog-js";
import s from "../styles/Welcome.module.css";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";
import {
  GUEST_LANGUAGES,
  getGuestNativeLanguage,
  setGuestNativeLanguage,
} from "../utils/guestPreferences";
import { extractYouTubeVideoId } from "../utils/youtube";

export default function Welcome() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState(getGuestNativeLanguage);
  const [trialError, setTrialError] = useState("");
  const videoId = useMemo(() => extractYouTubeVideoId(youtubeUrl), [youtubeUrl]);

  const startTrial = (event) => {
    event.preventDefault();
    setTrialError("");

    if (!videoId) {
      setTrialError(t("landing.trialInvalid"));
      return;
    }

    setGuestNativeLanguage(nativeLanguage);
    posthog.capture("landing_trial_started", {
      source: "hero_form",
      native_language: nativeLanguage,
    });
    navigate({ to: "/player/$videoId", params: { videoId } });
  };

  return (
    <div className={s.page}>
      <Helmet>
        <title>Languni — Learn Languages Through Videos</title>
        <meta name="description" content="Learn English, Spanish, or French through YouTube videos. Click any word for instant meaning and translation." />
        <link rel="canonical" href="https://languni.dev/" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://languni.dev/" />
        <meta property="og:title" content="Languni — Learn Languages Through Videos" />
        <meta property="og:description" content="Learn English, Spanish, or French through YouTube videos. Click any word for instant meaning and translation." />
        <meta property="og:image" content="https://languni.dev/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Languni — Learn Languages Through Videos" />
        <meta name="twitter:description" content="Learn English, Spanish, or French through YouTube videos. Click any word for instant meaning and translation." />
        <meta name="twitter:image" content="https://languni.dev/og-image.jpg" />
      </Helmet>
      <PublicNavbar isLanding />

      {/* ===== HERO — Split Layout ===== */}
      <section className={s.hero} id="hero">
        <div className={s.heroInner}>
          <div className={s.heroLeft}>
            <div className={s.heroLabel}>
              <span className={s.heroDot} />
              {t('landing.heroLabel')}
            </div>
            <h1 className={s.heroH1}>
              {t('landing.heroH1Line1')}
              <br />
              <span className={s.heroEm}>{t('landing.heroH1Line2')}</span>
            </h1>
            <p className={s.heroP}>
              {t('landing.heroDesc')}
            </p>
            <form className={s.trialForm} onSubmit={startTrial} noValidate>
              <div className={`${s.trialInputWrap}${trialError ? ` ${s.trialInputError}` : ""}`}>
                <input
                  id="youtube-trial-input"
                  value={youtubeUrl}
                  onChange={(event) => {
                    setYoutubeUrl(event.target.value);
                    setTrialError("");
                  }}
                  placeholder={t("landing.trialPlaceholder")}
                  aria-label={t("landing.trialInputLabel")}
                  autoComplete="off"
                  spellCheck="false"
                />
                <select
                  value={nativeLanguage}
                  onChange={(event) => setNativeLanguage(event.target.value)}
                  aria-label={t("landing.trialLanguageLabel")}
                >
                  {GUEST_LANGUAGES.map((language) => (
                    <option key={language.value} value={language.value}>
                      {language.label}
                    </option>
                  ))}
                </select>
                <button type="submit">
                  {t("landing.trialButton")}
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 9h10M10 5l4 4-4 4" />
                  </svg>
                </button>
              </div>
              {trialError ? (
                <p className={s.trialError}>{trialError}</p>
              ) : (
                <p className={s.trialNote}>{t("landing.trialNote")}</p>
              )}
            </form>
            <div className={s.heroProofs}>
              <span>{t("landing.proofCaptions")}</span>
              <span>{t("landing.proofLookup")}</span>
              <span>{t("landing.proofNoSignup")}</span>
            </div>
          </div>

        </div>
      </section>

      {/* ===== PROBLEM — Numbered Editorial ===== */}
      <section className={s.problem} id="problem">
        <div className={s.sectionInner}>
          <div className={s.problemHeader}>
            <span className={s.tag}>{t('landing.problemTag')}</span>
            <h2 className={s.sectionH2}>
              {t('landing.problemH2')}
            </h2>
          </div>

          <div className={s.problemGrid}>
            <div className={s.problemItem}>
              <span className={s.problemNum}>01</span>
              <h3>{t('landing.problem1Title')}</h3>
              <p>{t('landing.problem1Desc')}</p>
            </div>
            <div className={s.problemItem}>
              <span className={s.problemNum}>02</span>
              <h3>{t('landing.problem2Title')}</h3>
              <p>{t('landing.problem2Desc')}</p>
            </div>
            <div className={s.problemItem}>
              <span className={s.problemNum}>03</span>
              <h3>{t('landing.problem3Title')}</h3>
              <p>{t('landing.problem3Desc')}</p>
            </div>
            <div className={s.problemItem}>
              <span className={s.problemNum}>04</span>
              <h3>{t('landing.problem4Title')}</h3>
              <p>{t('landing.problem4Desc')}</p>
            </div>
          </div>

          <div className={s.problemSolution}>
            <div className={s.solLine} />
            <p className={s.solText}>
              {t('landing.solutionText')}
              <strong>{t('landing.solutionHighlight')}</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ===== BENEFITS — Tall Cards ===== */}
      <section className={s.benefits} id="benefits">
        <div className={s.sectionInner}>
          <span className={s.tag}>{t('landing.featuresTag')}</span>
          <h2 className={s.sectionH2}>
            {t('landing.featuresH2Line1')}<br />{t('landing.featuresH2Line2')}
          </h2>

          <div className={s.featGrid}>
            <div className={s.featCard}>
              <div className={s.featIcon}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="22" height="14" rx="3" />
                  <polygon points="11,9 19,12 11,15" fill="currentColor" stroke="none" />
                  <line x1="3" y1="23" x2="25" y2="23" strokeLinecap="round" />
                </svg>
              </div>
              <h3>{t('landing.feat1Title')}</h3>
              <p>{t('landing.feat1Desc')}</p>
              <div className={s.featAccent} />
            </div>

            <div className={s.featCard}>
              <div className={s.featIcon}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="14" cy="10" r="7" />
                  <path d="M7 24c0-4 3-7 7-7s7 3 7 7" strokeLinecap="round" />
                </svg>
              </div>
              <h3>{t('landing.feat2Title')}</h3>
              <p>{t('landing.feat2Desc')}</p>
              <div className={s.featAccent} />
            </div>

            <div className={s.featCard}>
              <div className={s.featIcon}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 4h14a2 2 0 0 1 2 2v17l-7-4-7 4V6a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>{t('landing.feat3Title')}</h3>
              <p>{t('landing.feat3Desc')}</p>
              <div className={s.featAccent} />
            </div>

            <div className={s.featCard}>
              <div className={s.featIcon}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="4" width="20" height="20" rx="4" />
                  <path d="M10 14h8M14 10v8" strokeLinecap="round" />
                </svg>
              </div>
              <h3>{t('landing.feat4Title')}</h3>
              <p>{t('landing.feat4Desc')}</p>
              <div className={s.featAccent} />
            </div>
          </div>
        </div>
      </section>


      <PublicFooter />
    </div>
  );
}
