import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronDown,
  CirclePlay,
  Link2,
  Plus,
  Share2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import savedVideosService from "../api/savedVideos";
import { extractYouTubeVideoId, getYouTubeThumbnail } from "../utils/youtube";
import styles from "../styles/AddVideo.module.css";

export function AddVideo() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [tutorialOpen, setTutorialOpen] = useState(false);

  const videoId = useMemo(() => extractYouTubeVideoId(url), [url]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!videoId) {
      setError(t("addVideo.invalidUrl"));
      return;
    }

    setSubmitting(true);
    try {
      await savedVideosService.saveVideo(videoId);
      toast.success(t("addVideo.saved"));
      navigate({ to: "/player/$videoId", params: { videoId } });
    } catch (requestError) {
      setError(requestError.message || t("addVideo.failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <Helmet>
        <title>{t("addVideo.pageTitle")} | Languni</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <header className={styles.header}>
        <span className={styles.eyebrow}>
          <Plus size={14} />
          {t("addVideo.eyebrow")}
        </span>
        <h1>{t("addVideo.title")}</h1>
        <p>{t("addVideo.subtitle")}</p>
      </header>

      <div className={styles.contentGrid}>
        <section className={styles.formCard}>
          <div className={styles.cardHeading}>
            <span className={styles.iconBox}><Link2 size={20} /></span>
            <div>
              <h2>{t("addVideo.formTitle")}</h2>
              <p>{t("addVideo.formDescription")}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="youtube-url">{t("addVideo.inputLabel")}</label>
            <div className={`${styles.inputRow}${error ? ` ${styles.inputRowError}` : ""}`}>
              <input
                id="youtube-url"
                type="text"
                value={url}
                onChange={(event) => {
                  setUrl(event.target.value);
                  setError("");
                }}
                placeholder={t("addVideo.placeholder")}
                autoComplete="off"
                spellCheck="false"
                aria-describedby={error ? "youtube-url-error" : "youtube-url-help"}
              />
              <button type="submit" disabled={submitting || !url.trim()}>
                <CirclePlay size={18} />
                {submitting ? t("addVideo.adding") : t("addVideo.addButton")}
              </button>
            </div>

            {error ? (
              <p id="youtube-url-error" className={styles.error} role="alert">
                {error}
              </p>
            ) : (
              <p id="youtube-url-help" className={styles.help}>
                {t("addVideo.supportedFormats")}
              </p>
            )}
          </form>

          {videoId && (
            <div className={styles.preview}>
              <img
                src={getYouTubeThumbnail(videoId)}
                alt={t("addVideo.previewAlt")}
              />
              <div className={styles.previewInfo}>
                <span><CheckCircle2 size={15} /> {t("addVideo.validLink")}</span>
                <strong>{t("addVideo.readyTitle")}</strong>
                <p>{t("addVideo.readyDescription")}</p>
              </div>
            </div>
          )}
        </section>

        <aside className={styles.infoCard}>
          <h2>{t("addVideo.whatHappensTitle")}</h2>
          <ol>
            <li>{t("addVideo.whatHappensOne")}</li>
            <li>{t("addVideo.whatHappensTwo")}</li>
            <li>{t("addVideo.whatHappensThree")}</li>
          </ol>
          <p className={styles.captionNote}>{t("addVideo.captionNote")}</p>
        </aside>
      </div>

      <section className={styles.tutorial}>
        <button
          type="button"
          className={styles.tutorialToggle}
          onClick={() => setTutorialOpen((open) => !open)}
          aria-expanded={tutorialOpen}
        >
          <span><Share2 size={18} /> {t("addVideo.tutorialTitle")}</span>
          <ChevronDown
            size={19}
            className={tutorialOpen ? styles.chevronOpen : ""}
          />
        </button>

        {tutorialOpen && (
          <div className={styles.tutorialContent}>
            <div>
              <span>1</span>
              <p>{t("addVideo.tutorialOne")}</p>
            </div>
            <div>
              <span>2</span>
              <p>{t("addVideo.tutorialTwo")}</p>
            </div>
            <div>
              <span>3</span>
              <p>{t("addVideo.tutorialThree")}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
