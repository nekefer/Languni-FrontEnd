import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import vocabularyService from "../api/vocabulary.js";
import translationService from "../api/translation.js";
import { useAuth } from "../contexts/AuthContext";
import { vocabularyLogger } from "../utils/logger";
import styles from "../styles/VocabularyPanel.module.css";

const VocabularyPanel = ({ vocabularyData, videoId, isOpen, onClose }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("definition");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [playingAudioIndex, setPlayingAudioIndex] = useState(null);
  const audioRef = useRef(null);
  const modalRef = useRef(null);

  // Save word functionality
  const [saveState, setSaveState] = useState("idle"); // 'idle', 'checking', 'already-saved', 'saving', 'saved', 'error'
  const [saveError, setSaveError] = useState(null);

  // Translation state
  const [translationData, setTranslationData] = useState(null);
  const [translationLoading, setTranslationLoading] = useState(false);
  const [translationError, setTranslationError] = useState(null);

  // Save state config — built from t() at render time
  const getSaveStateConfig = () => ({
    checking: { label: `🔍 ${t('vocPanel.stateChecking')}`, className: "primary", disabled: true },
    saving: { label: `⏳ ${t('vocPanel.stateSaving')}`, className: "primary", disabled: true },
    saved: { label: `✅ ${t('vocPanel.stateSaved')}`, className: "success", disabled: true },
    "already-saved": { label: `✅ ${t('vocPanel.stateAlreadySaved')}`, className: "success", disabled: true },
    error: { label: `❌ ${t('vocPanel.stateTryAgain')}`, className: "error", disabled: false },
    idle: { label: `💾 ${t('vocPanel.stateSaveWord')}`, className: "primary", disabled: false },
  });

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeydown);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent body scroll
    }

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset state when panel opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab("definition");
      setAudioPlaying(false);
      setPlayingAudioIndex(null);
      setSaveState("checking");
      setSaveError(null);
      setTranslationData(null);
      setTranslationLoading(false);
      setTranslationError(null);
    }
  }, [isOpen, vocabularyData?.word]);

  // Start translation fetch immediately when panel opens — ready before user clicks the tab
  useEffect(() => {
    if (!isOpen || !vocabularyData?.word) return;

    let cancelled = false;
    const word = vocabularyData.definition?.word || vocabularyData.word;

    setTranslationLoading(true);
    setTranslationError(null);

    translationService.translate(word)
      .then((result) => { if (!cancelled) setTranslationData(result); })
      .catch((error) => { if (!cancelled) setTranslationError(error.message || "Translation failed"); })
      .finally(() => { if (!cancelled) setTranslationLoading(false); });

    return () => { cancelled = true; };
  }, [isOpen, vocabularyData?.word]);

  // Check if word is already saved when panel opens
  useEffect(() => {
    if (isOpen && vocabularyData?.word && saveState === "checking") {
      vocabularyService
        .isWordSaved(vocabularyData.word)
        .then((result) => {
          setSaveState(result.saved ? "already-saved" : "idle");
        })
        .catch((error) => {
          vocabularyLogger.error("Failed to check if word is saved", error);
          setSaveState("idle"); // Default to allowing save on error
        });
    }
  }, [isOpen, vocabularyData?.word, saveState]);

  // Enhanced audio playback for multiple pronunciations
  const playAudio = async (audioUrl, phoneticIndex) => {
    if (!audioUrl || playingAudioIndex === phoneticIndex) return;

    try {
      setPlayingAudioIndex(phoneticIndex);
      setAudioPlaying(true);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => {
        setAudioPlaying(false);
        setPlayingAudioIndex(null);
      };
      audioRef.current.onerror = () => {
        setAudioPlaying(false);
        setPlayingAudioIndex(null);
        vocabularyLogger.warn("Audio playback failed");
      };

      await audioRef.current.play();
    } catch (error) {
      vocabularyLogger.error("Audio playback error", error);
      setAudioPlaying(false);
      setPlayingAudioIndex(null);
    }
  };

  // Handle audio playback (backward compatibility)
  const playPronunciation = async () => {
    const audioUrl = vocabularyData?.definition?.audio;
    if (!audioUrl || audioPlaying) return;

    try {
      setAudioPlaying(true);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setAudioPlaying(false);
      audioRef.current.onerror = () => {
        setAudioPlaying(false);
        vocabularyLogger.warn("Audio playback failed");
      };

      await audioRef.current.play();
    } catch (error) {
      vocabularyLogger.error("Audio playback error", error);
      setAudioPlaying(false);
    }
  };

  // Format pronunciation display
  const formatPhonetic = (phonetic) => {
    if (!phonetic) return "";
    return phonetic.startsWith("/") && phonetic.endsWith("/")
      ? phonetic
      : `/${phonetic}/`;
  };

  // Handle save word
  const handleSaveWord = async () => {
    try {
      setSaveState("saving");
      setSaveError(null);

      await vocabularyService.saveWord(vocabularyData.word, videoId, {
        translation: translationData?.translatedWord || null,
        nativeLanguage: user?.native_language || null,
        definition: vocabularyData.definition
          ? JSON.stringify(vocabularyData.definition)
          : null,
      });

      setSaveState("saved");
      const wordText = vocabularyData.definition?.word || vocabularyData.word;
      toast.success(t('vocPanel.saveSuccess', { word: wordText }));
    } catch (error) {
      vocabularyLogger.error("Failed to save word", error);
      const wordText = vocabularyData.definition?.word || vocabularyData.word;

      // Handle different error types
      if (
        error.response?.status === 409 ||
        error.message?.includes("already saved")
      ) {
        setSaveState("already-saved");
        toast.info(t('vocPanel.alreadySaved', { word: wordText }));
      } else if (error.response?.status === 401) {
        setSaveState("error");
        setSaveError(t('vocPanel.loginToSave'));
        toast.error(t('vocPanel.loginToSave'));
      } else if (!error.response) {
        setSaveState("error");
        setSaveError(t('common.networkError'));
        toast.error(t('common.networkError'));
      } else {
        setSaveState("error");
        setSaveError(error.message || t('vocPanel.saveFailed'));
        toast.error(t('vocPanel.saveFailed'));
      }
    }
  };

  // Retry translation (called only from the error state retry button)
  const fetchTranslation = async () => {
    if (translationLoading) return;

    const word = vocabularyData?.definition?.word || vocabularyData?.word;
    if (!word) return;

    setTranslationLoading(true);
    setTranslationError(null);
    try {
      const result = await translationService.translate(word);
      setTranslationData(result);
    } catch (error) {
      vocabularyLogger.error("Translation fetch failed", error);
      setTranslationError(error.message || "Translation failed");
    } finally {
      setTranslationLoading(false);
    }
  };

  if (!isOpen || !vocabularyData) {
    return null;
  }

  const saveStateConfig = getSaveStateConfig();

  return (
    <div className={styles.vocabularyPanelOverlay}>
      <div className={styles.vocabularyPanel} ref={modalRef}>
        {/* Header */}
        <div className={styles.vocabularyHeader}>
          <div className={styles.vocabularyTitle}>
            <h2 className={styles.vocabularyWord}>
              {vocabularyData.definition?.word || vocabularyData.word}
            </h2>
            {vocabularyData.expandedForm && (
              <div className={styles.contractionExpansion}>
                <span className={styles.originalWord}>
                  {vocabularyData.originalWord}
                </span>
                {" → "}
                <span className={styles.expandedWord}>
                  {vocabularyData.expandedForm}
                </span>
              </div>
            )}
            {vocabularyData.definition?.phonetic && (
              <div className={styles.vocabularyPronunciation}>
                <span className={styles.phoneticText}>
                  {formatPhonetic(vocabularyData.definition.phonetic)}
                </span>
                {vocabularyData.definition?.audio && (
                  <button
                    className={`${styles.audioBtn} ${audioPlaying ? styles.playing : ""}`}
                    onClick={playPronunciation}
                    disabled={audioPlaying}
                    title="Play pronunciation"
                  >
                    {audioPlaying ? "🔊" : "🔈"}
                  </button>
                )}
              </div>
            )}
          </div>
          <button className={styles.closeBtn} onClick={onClose} title={t('vocPanel.close')}>
            ✕
          </button>
        </div>

        {/* Enhanced Tabs */}
        <div className={styles.vocabularyTabs}>
          <button
            className={`${styles.tab} ${activeTab === "definition" ? styles.active : ""}`}
            onClick={() => setActiveTab("definition")}
          >
            <span className={styles.tabIcon}>📖</span>
            <span className={styles.tabLabel}>{t('vocPanel.tabDefinition')}</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === "pronunciation" ? styles.active : ""}`}
            onClick={() => setActiveTab("pronunciation")}
          >
            <span className={styles.tabIcon}>🔊</span>
            <span className={styles.tabLabel}>{t('vocPanel.tabPronunciation')}</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === "translation" ? styles.active : ""}`}
            onClick={() => setActiveTab("translation")}
          >
            <span className={styles.tabIcon}>🌐</span>
            <span className={styles.tabLabel}>{t('vocPanel.tabTranslation')}</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === "related" ? styles.active : ""}`}
            onClick={() => setActiveTab("related")}
          >
            <span className={styles.tabIcon}>🔗</span>
            <span className={styles.tabLabel}>{t('vocPanel.tabRelated')}</span>
          </button>
        </div>

        {/* Content */}
        <div className={styles.vocabularyContent}>
          {/* Enhanced Definition Tab */}
          {activeTab === "definition" && (
            <div className={styles.definitionContent}>
              {vocabularyData.definition?.meanings?.length > 0
                ? vocabularyData.definition.meanings.map(
                    (meaning, meaningIndex) => (
                      <div key={meaningIndex} className={styles.meaningSection}>
                        <div className={styles.partOfSpeechHeader}>
                          <span className={styles.partOfSpeechBadge}>
                            {meaning.partOfSpeech}
                          </span>

                          {/* Part-specific synonyms */}
                          {meaning.synonyms?.length > 0 && (
                            <div className={styles.miniSynonyms}>
                              {t('vocPanel.synonyms')}{" "}
                              {meaning.synonyms.slice(0, 3).join(", ")}
                              {meaning.synonyms.length > 3 && "..."}
                            </div>
                          )}
                        </div>

                        {/* All definitions for this part of speech */}
                        <div className={styles.definitionsList}>
                          {meaning.definitions.map((def, defIndex) => (
                            <div
                              key={defIndex}
                              className={styles.definitionItem}
                            >
                              <div className={styles.definitionNumber}>
                                {defIndex + 1}.
                              </div>
                              <div className={styles.definitionContentInner}>
                                <p className={styles.definitionText}>
                                  {def.definition}
                                </p>

                                {def.example && (
                                  <div className={styles.exampleText}>
                                    <strong>{t('vocPanel.example')}</strong>{" "}
                                    <em>"{def.example}"</em>
                                  </div>
                                )}

                                {/* Definition-specific synonyms/antonyms */}
                                {(def.synonyms?.length > 0 ||
                                  def.antonyms?.length > 0) && (
                                  <div className={styles.defWordRelations}>
                                    {def.synonyms?.length > 0 && (
                                      <span className={styles.defSynonyms}>
                                        {t('vocPanel.similar')} {def.synonyms.join(", ")}
                                      </span>
                                    )}
                                    {def.antonyms?.length > 0 && (
                                      <span className={styles.defAntonyms}>
                                        {t('vocPanel.opposite')} {def.antonyms.join(", ")}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Part-specific antonyms */}
                        {meaning.antonyms?.length > 0 && (
                          <div className={styles.partAntonyms}>
                            <strong>
                              {t('vocPanel.antonymsFor', { pos: meaning.partOfSpeech })}
                            </strong>{" "}
                            {meaning.antonyms.join(", ")}
                          </div>
                        )}
                      </div>
                    )
                  )
                : // Fallback to old structure for backward compatibility
                  vocabularyData.definition?.definitions?.map((def, index) => (
                    <div key={index} className={styles.definitionItem}>
                      <div className={styles.definitionMeta}>
                        <span className={styles.partOfSpeech}>
                          {def.partOfSpeech}
                        </span>
                      </div>
                      <p className={styles.definitionText}>{def.definition}</p>
                      {def.example && (
                        <div className={styles.definitionExample}>
                          <span className={styles.exampleLabel}>{t('vocPanel.example')}</span>
                          <em>"{def.example}"</em>
                        </div>
                      )}
                      {def.synonyms?.length > 0 && (
                        <div className={styles.definitionSynonyms}>
                          <span className={styles.synonymsLabel}>
                            {t('vocPanel.synonyms')}
                          </span>
                          <span className={styles.synonymsList}>
                            {def.synonyms.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
            </div>
          )}

          {/*  Pronunciation Tab */}
          {activeTab === "pronunciation" && (
            <div className={styles.pronunciationContent}>
              <h4>
                {t('vocPanel.howToPronounce', { word: vocabularyData.definition?.word || vocabularyData.word })}
              </h4>

              {vocabularyData.definition?.phonetics?.length > 0 ? (
                <div className={styles.phoneticsList}>
                  {vocabularyData.definition.phonetics.map(
                    (phonetic, index) => (
                      <div key={index} className={styles.phoneticItem}>
                        <div className={styles.phoneticTextWrapper}>
                          {phonetic.text && (
                            <span className={styles.phoneticSymbols}>
                              {formatPhonetic(phonetic.text)}
                            </span>
                          )}
                          {phonetic.region && (
                            <span className={styles.phoneticRegion}>
                              ({phonetic.region})
                            </span>
                          )}
                        </div>

                        {phonetic.audio && (
                          <button
                            className={`${styles.audioPlayBtn} ${playingAudioIndex === index ? styles.playing : ""}`}
                            onClick={() => playAudio(phonetic.audio, index)}
                            disabled={playingAudioIndex === index}
                          >
                            {playingAudioIndex === index ? "⏹️" : "▶️"}
                            {t('vocPanel.playRegion', { region: phonetic.region || t('vocPanel.playAudio') })}
                          </button>
                        )}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className={styles.noPronunciation}>
                  <p>{t('vocPanel.limitedPronunciation')}</p>
                  {vocabularyData.definition?.phonetic && (
                    <div className={styles.fallbackPronunciation}>
                      <span className={styles.phoneticSymbols}>
                        {formatPhonetic(vocabularyData.definition.phonetic)}
                      </span>
                      {vocabularyData.definition?.audio && (
                        <button
                          className={`${styles.audioPlayBtn} ${audioPlaying ? styles.playing : ""}`}
                          onClick={playPronunciation}
                          disabled={audioPlaying}
                        >
                          {audioPlaying ? "⏹️" : "▶️"} {t('vocPanel.playAudio')}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className={styles.pronunciationTips}>
                <h5>{t('vocPanel.pronunciationTipsTitle')}</h5>
                <ul>
                  <li>{t('vocPanel.tip1')}</li>
                  <li>{t('vocPanel.tip2')}</li>
                  <li>{t('vocPanel.tip3')}</li>
                  <li>{t('vocPanel.tip4')}</li>
                </ul>
              </div>
            </div>
          )}

          {/* Translation Tab */}
          {activeTab === "translation" && (
            <div className={styles.translationContent}>
              {translationLoading && (
                <div className={styles.translationLoading}>
                  <div className={styles.translationSpinner} />
                  <p>{t('vocPanel.translating')}</p>
                </div>
              )}

              {translationError && (
                <div className={styles.translationError}>
                  <p>{translationError}</p>
                  <button
                    className={styles.retryBtn}
                    onClick={() => {
                      setTranslationData(null);
                      setTranslationError(null);
                      fetchTranslation();
                    }}
                  >
                    {t('vocPanel.translationRetry')}
                  </button>
                </div>
              )}

              {translationData && (
                <div className={styles.translationResult}>
                  <div className={styles.translationPair}>
                    <span className={styles.languageBadge}>
                      {translationData.sourceLanguage?.toUpperCase()}
                    </span>
                    <span className={styles.translationArrow}>→</span>
                    <span className={styles.languageBadge}>
                      {translationData.targetLanguage?.toUpperCase()}
                    </span>
                  </div>
                  <div className={styles.translationWords}>
                    <div className={styles.translationWord}>
                      {vocabularyData.definition?.word || vocabularyData.word}
                    </div>
                    <div className={styles.translationDivider}>⟶</div>
                    <div className={styles.translationWord}>
                      {translationData.translatedWord}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/*  Related Words Tab */}
          {activeTab === "related" && (
            <div className={styles.relatedContent}>
              {vocabularyData.definition?.globalSynonyms?.length > 0 && (
                <div className={styles.synonymsSection}>
                  <h4>📗 {t('vocPanel.synonymsTitle')}</h4>
                  <div className={styles.wordChips}>
                    {vocabularyData.definition.globalSynonyms.map(
                      (synonym, index) => (
                        <button
                          key={index}
                          className={`${styles.wordChip} ${styles.synonym}`}
                          onClick={() => {
                            // TODO: Implement synonym lookup
                          }}
                          title={`Look up "${synonym}"`}
                        >
                          {synonym}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {vocabularyData.definition?.globalAntonyms?.length > 0 && (
                <div className={styles.antonymsSection}>
                  <h4>📕 {t('vocPanel.antonymsTitle')}</h4>
                  <div className={styles.wordChips}>
                    {vocabularyData.definition.globalAntonyms.map(
                      (antonym, index) => (
                        <button
                          key={index}
                          className={`${styles.wordChip} ${styles.antonym}`}
                          onClick={() => {
                            // TODO: Implement antonym lookup
                          }}
                          title={`Look up "${antonym}"`}
                        >
                          {antonym}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {!vocabularyData.definition?.globalSynonyms?.length &&
                !vocabularyData.definition?.globalAntonyms?.length && (
                  <div className={styles.noRelatedWords}>
                    <p>
                      {t('vocPanel.noRelated', { word: vocabularyData.definition?.word || vocabularyData.word })}
                    </p>
                    <div className={styles.suggestion}>
                      <p>
                        💡 {t('vocPanel.noRelatedTip')}
                      </p>
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.vocabularyFooter}>
          <button
            className={`${styles.actionBtn} ${styles.secondary}`}
            onClick={onClose}
          >
            {t('vocPanel.close')}
          </button>

          {saveError && <div className={styles.errorMessage}>{saveError}</div>}

          {(() => {
            const { label, className, disabled } =
              saveStateConfig[saveState ?? "idle"];
            return (
              <button
                className={`${styles.actionBtn} ${styles[className]}`}
                onClick={handleSaveWord}
                disabled={disabled}
              >
                {label}
              </button>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default VocabularyPanel;
