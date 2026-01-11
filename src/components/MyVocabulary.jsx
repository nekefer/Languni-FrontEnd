import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import vocabularyService from "../api/vocabulary.js";
import dictionaryService from "../api/dictionary.js";
import styles from "../styles/MyVocabulary.module.css";

const WORDS_PER_PAGE = 12;

// Search and sort controls component
const VocabularyControls = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  totalWords,
}) => (
  <div className={styles.vocabularyControls}>
    <div className={styles.vocabularyStats}>
      <h3>📚 My Vocabulary</h3>
      <p className={styles.statsText}>{totalWords} words saved</p>
    </div>

    <div className={styles.controlsSection}>
      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Search your vocabulary..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
        <span className={styles.searchIcon}>🔍</span>
      </div>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className={styles.sortSelect}
      >
        <option value="date_desc">Newest First</option>
        <option value="date_asc">Oldest First</option>
        <option value="word_asc">A to Z</option>
        <option value="word_desc">Z to A</option>
      </select>
    </div>
  </div>
);

// Individual word card component
const WordCard = ({ wordData, onDelete, onViewVideo, onViewDetails }) => {
  const [definition, setDefinition] = useState(null);
  const [loadingDefinition, setLoadingDefinition] = useState(false);

  const loadDefinition = async () => {
    if (definition || loadingDefinition) return;

    try {
      setLoadingDefinition(true);
      const defData = await dictionaryService.getDefinition(wordData.word);
      setDefinition(defData);
    } catch (error) {
      console.error("Failed to load definition:", error);
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

  const handleViewVideo = () => {
    if (wordData.video_id) {
      onViewVideo(wordData.video_id);
    }
  };

  const getDefinitionPreview = () => {
    if (definition?.error) return definition.error;
    if (definition?.meanings?.[0]?.definitions?.[0]?.definition) {
      return definition.meanings[0].definitions[0].definition;
    }
    return null;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
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
          {wordData.video_id && (
            <button
              className={`${styles.btnIcon} ${styles.videoBtn}`}
              onClick={handleViewVideo}
              title="View in video"
            >
              📹
            </button>
          )}
          <button
            className={`${styles.btnIcon} ${styles.deleteBtn}`}
            onClick={handleDelete}
            title="Delete word"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className={styles.wordMeta}>
        <span className={styles.saveDate}>
          Saved {formatDate(wordData.saved_at)}
        </span>
        {wordData.video_id && (
          <span className={styles.videoBadge}>📺 From video</span>
        )}
      </div>

      <div className={styles.wordContent}>
        {loadingDefinition ? (
          <div className={styles.definitionLoading}>Loading definition...</div>
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
              View Details →
            </button>
          </div>
        ) : (
          <button className={styles.loadDefinitionBtn} onClick={loadDefinition}>
            Show Definition
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
  if (loading) {
    return (
      <div className={styles.vocabularyLoading}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your vocabulary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.vocabularyError}>
        <h3>❌ Error Loading Vocabulary</h3>
        <p>{error}</p>
        <button
          className={styles.btnPrimary}
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className={styles.vocabularyEmpty}>
        <div className={styles.emptyIcon}>📚</div>
        <h3>No saved words yet</h3>
        <p>Start watching videos and saving words to build your vocabulary!</p>
        <Link to="/dashboard" className={styles.btnPrimary}>
          Browse Videos
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
        WORDS_PER_PAGE
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
      console.error("Failed to load vocabulary:", error);
      setError(error.message || "Failed to load your vocabulary");
      toast.error("Failed to load vocabulary. Please try again.");
      setSavedWords([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete a word from vocabulary
  const handleDeleteWord = async (word) => {
    try {
      await vocabularyService.deleteSavedWord(word);
      // Remove the word from current list
      setSavedWords((prev) => prev.filter((w) => w.word !== word));
      setTotalWords((prev) => prev - 1);
      toast.success(`"${word}" removed from vocabulary.`);
      // Reload page if necessary
      loadSavedWords(page);
    } catch (error) {
      console.error("Failed to delete word:", error);
      toast.error("Failed to delete word. Please try again.");
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
          <h3>📚 My Vocabulary</h3>
          <p className={styles.statsText}>{totalWords} words saved</p>
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
            ← Previous
          </button>
          <span className={styles.pageInfo}>
            Page {page} of {totalPages || 1} ({totalWords} words total)
          </span>
          <button
            onClick={handleNextPage}
            disabled={page >= totalPages || loading}
            className={styles.paginationButton}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};
