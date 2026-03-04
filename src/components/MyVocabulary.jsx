import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Video, Trash2, Tv, XCircle, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import vocabularyService from "../api/vocabulary.js";
import dictionaryService from "../api/dictionary.js";
import { createLogger } from "../utils/logger";
import { Spinner } from "../ui/Spinner.jsx";
import styles from "../styles/MyVocabulary.module.css";

const logger = createLogger("vocabulary");

const WORDS_PER_PAGE = 12;

// Individual word card component
const WordCard = ({ wordData, onDelete, onViewDetails }) => {
  const { t, i18n } = useTranslation();
  const [definition, setDefinition] = useState(null);
  const [loadingDefinition, setLoadingDefinition] = useState(false);

  const loadDefinition = async () => {
    if (definition || loadingDefinition) return;

    try {
      setLoadingDefinition(true);
      const defData = await dictionaryService.getDefinition(wordData.word);
      setDefinition(defData);
    } catch (error) {
      logger.error("Failed to load definition", error);
      setDefinition({ error: "Failed to load definition" });
    } finally {
      setLoadingDefinition(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${wordData.word}" from your vocabulary?`)) {
      onDelete(wordData.word);
    }
  };

  // const handleViewVideo = () => {
  //   if (wordData.video_id) {
  //     onViewVideo(wordData.video_id);
  //   }
  // };

  const getDefinitionPreview = () => {
    if (definition?.error) return definition.error;
    if (definition?.meanings?.[0]?.definitions?.[0]?.definition) {
      return definition.meanings[0].definitions[0].definition;
    }
    return null;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(i18n.language, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className={styles.wordCard}>
      <div className={styles.wordHeader}>
        <h3 className={styles.wordTitle}>{wordData.word}</h3>
        <div className={styles.wordActions}>
          {/* {wordData.video_id && (
            <button
              className={`${styles.btnIcon} ${styles.videoBtn}`}
              onClick={handleViewVideo}
              title={t('vocabulary.viewInVideo')}
            >
              <Video size={16} />
            </button>
          )} */}
          <button
            className={`${styles.btnIcon} ${styles.deleteBtn}`}
            onClick={handleDelete}
            title={t('vocabulary.deleteWord')}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className={styles.wordMeta}>
        <span className={styles.saveDate}>
          {t('vocabulary.savedOn', { date: formatDate(wordData.saved_at) })}
        </span>
        {wordData.video_id && (
          <span className={styles.videoBadge}><Tv size={13} /> {t('vocabulary.fromVideo')}</span>
        )}
      </div>

      <div className={styles.wordContent}>
        {loadingDefinition ? (
          <div className={styles.definitionLoading}>
            <Spinner size={16} />
            <span>{t('vocabulary.loadingDefinition')}</span>
          </div>
        ) : definition ? (
          <div className={styles.definitionPreview}>
            <p>{getDefinitionPreview()}</p>
            {definition.phonetic && (
              <span className={styles.phonetic}>
                {definition.phonetic.startsWith("/")
                  ? definition.phonetic
                  : `/${definition.phonetic}/`}
              </span>
            )}
            <button
              className={styles.detailsToggle}
              onClick={() => onViewDetails(wordData.word)}
            >
              {t('vocabulary.viewDetails')}
            </button>
          </div>
        ) : (
          <button className={styles.loadDefinitionBtn} onClick={loadDefinition}>
            {t('vocabulary.showDefinition')}
          </button>
        )}
      </div>
    </div>
  );
};

// Vocabulary grid component
const VocabularyGrid = ({
  words,
  onDelete,
  onViewVideo,
  onViewDetails,
  loading,
  error,
}) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className={styles.vocabularyLoading}>
        <Spinner size={32} />
        <p>{t('vocabulary.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.vocabularyError}>
        <h3><XCircle size={20} /> {t('vocabulary.errorTitle')}</h3>
        <p>{error}</p>
        <button
          className={styles.btnPrimary}
          onClick={() => window.location.reload()}
        >
          {t('common.tryAgain')}
        </button>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className={styles.vocabularyEmpty}>
        <div className={styles.emptyIcon}><BookOpen size={48} /></div>
        <h3>{t('vocabulary.emptyTitle')}</h3>
        <p>{t('vocabulary.emptyDesc')}</p>
        <Link to="/dashboard" className={styles.btnPrimary}>
          {t('common.browseVideos')}
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.vocabularyGrid}>
      {words.map((word) => (
        <WordCard
          key={word.id}
          wordData={word}
          onDelete={onDelete}
          onViewVideo={onViewVideo}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

// Main MyVocabulary component
export const MyVocabulary = () => {
  const { t } = useTranslation();
  const [savedWords, setSavedWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalWords, setTotalWords] = useState(0);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const totalPages = Math.ceil(totalWords / WORDS_PER_PAGE);

  // Load saved words with pagination
  const loadSavedWords = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      const skip = (pageNum - 1) * WORDS_PER_PAGE;
      const response = await vocabularyService.getSavedWords(
        skip,
        WORDS_PER_PAGE,
      );

      // Transform backend response to match frontend expectations
      const transformedWords =
        response.words?.map((savedWord) => ({
          id: savedWord.id,
          word: savedWord.word.word, // Extract word text from nested structure
          video_id: savedWord.video_id,
          saved_at: savedWord.saved_at,
          word_id: savedWord.word.id,
          created_at: savedWord.word.created_at,
        })) || [];

      setSavedWords(transformedWords);
      setTotalWords(response.total || 0);
    } catch (error) {
      logger.error("Failed to load vocabulary", error);
      setError(error.message || "Failed to load your vocabulary");
      toast.error(t('vocabulary.loadFailed'));
      setSavedWords([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete a word from vocabulary
  const handleDeleteWord = async (word) => {
    try {
      await vocabularyService.deleteSavedWord(word);

      // Optimistically remove from UI
      const newWords = savedWords.filter((w) => w.word !== word);
      setSavedWords(newWords);
      setTotalWords((prev) => prev - 1);

      toast.success(t('vocabulary.removed', { word }));

      // If deleting last word on page and not on first page, go to previous page
      if (newWords.length === 0 && page > 1) {
        setPage(page - 1);
      } else {
        // Reload to get accurate count
        loadSavedWords(page);
      }
    } catch (error) {
      logger.error("Failed to delete word", error);

      // Handle different error types
      if (!error.response) {
        toast.error(t('common.networkError'));
      } else if (error.response?.status === 401) {
        toast.error(t('vocabulary.loginToDelete'));
      } else if (error.response?.status === 404) {
        toast.error(t('vocabulary.notFound'));
        // Reload to sync state
        loadSavedWords(page);
      } else {
        toast.error(t('vocabulary.deleteFailed'));
      }
    }
  };

  // Navigate to video player
  const handleViewVideo = (videoId) => {
    navigate({ to: "/player/$videoId", params: { videoId } });
  };

  // Handle viewing word details
  const handleViewDetails = (word) => {
    navigate({
      to: "/word/$wordId",
      params: { wordId: encodeURIComponent(word) },
    });
  };

  // Load words on component mount and page change
  useEffect(() => {
    loadSavedWords(page);
  }, [page]);

  // Handle page navigation
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className={styles.vocabularyPage}>
      <div className={styles.vocabularyControls}>
        <div className={styles.vocabularyStats}>
          <h3><BookOpen size={20} /> {t('vocabulary.title')}</h3>
          <p className={styles.statsText}>
            {t('vocabulary.wordsSaved', { count: totalWords })}
          </p>
        </div>
      </div>

      <VocabularyGrid
        words={savedWords}
        onDelete={handleDeleteWord}
        onViewVideo={handleViewVideo}
        onViewDetails={handleViewDetails}
        loading={loading}
        error={error}
      />

      {/* Pagination Controls */}
      {totalWords > 0 && (
        <div className={styles.paginationContainer}>
          <button
            onClick={handlePrevPage}
            disabled={page === 1 || loading}
            className={styles.paginationButton}
          >
            {t('vocabulary.prevPage')}
          </button>
          <span className={styles.pageInfo}>
            {t('vocabulary.pageInfo', { page, total: totalPages || 1, count: totalWords })}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page >= totalPages || loading}
            className={styles.paginationButton}
          >
            {t('vocabulary.nextPage')}
          </button>
        </div>
      )}
    </div>
  );
};
