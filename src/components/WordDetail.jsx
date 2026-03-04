import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useRouter  } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import dictionaryService from "../api/dictionary.js";
import vocabularyService from "../api/vocabulary.js";
import { vocabularyLogger } from "../utils/logger";
import { Spinner } from "../ui/Spinner";
import styles from "../styles/WordDetail.module.css";
import NotFound from "./NotFound.jsx";

export const WordDetail = ({ word }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const router = useRouter();
  const [definition, setDefinition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        setNotFound(false);

        const savedResult = await vocabularyService.isWordSaved(word);
        setIsSaved(savedResult.saved);

        let defData = null;
        if (savedResult.saved && savedResult.definition) {
          try {
            defData = JSON.parse(savedResult.definition);
          } catch {
            defData = await dictionaryService.getDefinition(word);
          }
        } else {
          defData = await dictionaryService.getDefinition(word);
        }

        if (defData === null) {
          setNotFound(true);
        } else {
          setDefinition(defData);
        }
      } catch (err) {
        // Only real errors (network, API failures) reach here
        setError(err?.message || "Failed to load word");
        vocabularyLogger.error("Failed to load word data", err, { word });
      } finally {
        setLoading(false);
      }
    };
    if (word) loadData();
  }, [word]);

  const playAudio = async () => {
    const audioUrl =
      definition?.audio || definition?.phonetics?.find((p) => p.audio)?.audio;
    if (!audioUrl || audioPlaying) return;

    try {
      setAudioPlaying(true);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setAudioPlaying(false);
      audioRef.current.onerror = () => setAudioPlaying(false);
      await audioRef.current.play();
    } catch {
      setAudioPlaying(false);
    }
  };

  const getPhonetic = () => {
    const p =
      definition?.phonetic || definition?.phonetics?.find((p) => p.text)?.text;
    return p ? (p.startsWith("/") ? p : `/${p}/`) : "";
  };

  const hasAudio = () =>
    definition?.audio || definition?.phonetics?.some((p) => p.audio);

  const handleRemove = async () => {
    if (!confirm(`Remove "${word}" from vocabulary?`)) return;
    await vocabularyService.deleteSavedWord(word);
    navigate({ to: "/" });
  };

  const lookupWord = (w) =>
    navigate({
      to: "/word/$wordId",
      params: { wordId: encodeURIComponent(w) },
    });

  if (loading) {
    return (
      <div className={styles.wordPage}>
        <div className={styles.wordContainer}>
          <div className={styles.loadingState}>
            <Spinner size={32} />
            <p>{t('word.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wordPage}>
        <div className={styles.wordContainer}>
          <div className={styles.errorState}>
            <span className={styles.errorIcon}>⚠️</span>
            <h2>{t('word.errorTitle')}</h2>
            <p>{error}</p>
            <button onClick={() => router.history.back()}>
              {t('word.backToVocabulary')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return <NotFound />;
  }

  return (
    <div className={styles.wordPage}>
      <div className={styles.wordContainer}>
        {/* Navigation */}
        <nav className={styles.wordNav}>
          <button
            className={styles.navBack}
            onClick={() => router.history.back()}
          >

            <span>←</span> {t('word.back')}
          </button>
          {isSaved && (
            <button className={styles.navRemove} onClick={handleRemove}>
              {t('word.remove')}
            </button>
          )}
        </nav>

        {/* Word Header Card */}
        <div className={`${styles.wordCard} ${styles.wordHeaderCard}`}>
          <div className={styles.wordMain}>
            <h1>{definition?.word || word}</h1>
            <div className={styles.wordMeta}>
              {getPhonetic() && (
                <span className={styles.phonetic}>{getPhonetic()}</span>
              )}
            </div>
          </div>
        </div>

        {/* Definitions */}
        {definition?.meanings?.map((meaning, i) => (
          <div key={i} className={`${styles.wordCard} ${styles.meaningCard}`}>
            <div className={styles.posBadge}>{meaning.partOfSpeech}</div>

            <ol className={styles.definitions}>
              {meaning.definitions.map((def, j) => (
                <li key={j}>
                  <p className={styles.defText}>{def.definition}</p>
                  {def.example && (
                    <p className={styles.defExample}>"{def.example}"</p>
                  )}
                </li>
              ))}
            </ol>

            {meaning.synonyms?.length > 0 && (
              <div className={styles.wordLinksSection}>
                <span className={styles.linksLabel}>{t('word.synonyms')}</span>
                <div className={styles.wordLinks}>
                  {meaning.synonyms.slice(0, 6).map((s, k) => (
                    <button key={k} onClick={() => lookupWord(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {meaning.antonyms?.length > 0 && (
              <div className={styles.wordLinksSection}>
                <span className={styles.linksLabel}>{t('word.antonyms')}</span>
                <div className={`${styles.wordLinks} ${styles.antonyms}`}>
                  {meaning.antonyms.slice(0, 6).map((a, k) => (
                    <button key={k} onClick={() => lookupWord(a)}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Related Words */}
        {(definition?.globalSynonyms?.length > 0 ||
          definition?.globalAntonyms?.length > 0) && (
          <div className={`${styles.wordCard} ${styles.relatedCard}`}>
            <h3>{t('word.relatedWords')}</h3>

            {definition.globalSynonyms?.length > 0 && (
              <div className={styles.relatedGroup}>
                <span className={styles.relatedLabel}>{t('word.similar')}</span>
                <div className={styles.relatedChips}>
                  {definition.globalSynonyms.map((s, i) => (
                    <button key={i} onClick={() => lookupWord(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {definition.globalAntonyms?.length > 0 && (
              <div className={styles.relatedGroup}>
                <span className={styles.relatedLabel}>{t('word.opposite')}</span>
                <div className={`${styles.relatedChips} ${styles.opposite}`}>
                  {definition.globalAntonyms.map((a, i) => (
                    <button key={i} onClick={() => lookupWord(a)}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WordDetail;
