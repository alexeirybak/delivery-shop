import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Layers,
  Check,
  X,
} from "lucide-react";
import {
  FlashcardsViewerProps,
} from "../types/visualizations.types";
import "../styles/flashcards-viewer.css"

export const FlashcardsViewer = ({
  data,
}: FlashcardsViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [unknownCards, setUnknownCards] = useState<Set<string>>(new Set());

  const currentCard = data.cards[currentIndex];
  const isKnown = knownCards.has(currentCard?.id || currentCard?.question);
  const isUnknown = unknownCards.has(currentCard?.id || currentCard?.question);
  const totalCards = data.cards.length;
  const studiedCount = knownCards.size + unknownCards.size;
  const progress = (studiedCount / totalCards) * 100;

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleMarkKnown = () => {
    const cardId = currentCard?.id || currentCard?.question;
    if (cardId) {
      setKnownCards((prev) => new Set(prev).add(cardId));
      setUnknownCards((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cardId);
        return newSet;
      });
      handleNext();
    }
  };

  const handleMarkUnknown = () => {
    const cardId = currentCard?.id || currentCard?.question;
    if (cardId) {
      setUnknownCards((prev) => new Set(prev).add(cardId));
      setKnownCards((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cardId);
        return newSet;
      });
      handleNext();
    }
  };

  const handleReset = () => {
    setKnownCards(new Set());
    setUnknownCards(new Set());
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="flashcards-viewer">
      <div className="flashcards-viewer-header">
        <div className="flashcards-viewer-title">
          <Layers size={20} />
          <div>
            <h3>{data.name}</h3>
            {data.description && <p>{data.description}</p>}
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flashcards-reset-btn"
          title="Сбросить прогресс"
        >
          <RotateCcw size={16} />
          <span>Сбросить</span>
        </button>
      </div>

      <div className="flashcards-viewer-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-text">
          {studiedCount} из {totalCards} карточек изучено
        </span>
      </div>

      <div
        className={`flashcard ${isFlipped ? "flipped" : ""}`}
        onClick={handleFlip}
      >
        <div className="flashcard-front">
          <div className="flashcard-side-label">ВОПРОС</div>
          <div className="flashcard-content">{currentCard?.question}</div>
          <div className="flashcard-hint">👆 Нажмите, чтобы увидеть ответ</div>
        </div>
        <div className="flashcard-back">
          <div className="flashcard-side-label">ОТВЕТ</div>
          <div className="flashcard-content">{currentCard?.answer}</div>
          {currentCard?.tags && currentCard.tags.length > 0 && (
            <div className="flashcard-tags">
              {currentCard.tags.map((tag) => (
                <span key={tag} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {isFlipped && (
        <div className="flashcard-ratings">
          <button
            onClick={handleMarkUnknown}
            className="rating-unknown"
            disabled={isUnknown}
          >
            <X size={16} />
            <span>Не знаю</span>
          </button>
          <button
            onClick={handleMarkKnown}
            className="rating-known"
            disabled={isKnown}
          >
            <Check size={16} />
           <span>Знаю</span>
          </button>
        </div>
      )}

      <div className="flashcard-nav">
        <button onClick={handlePrev} disabled={currentIndex === 0}>
          <ChevronLeft size={20} />
         <span>Назад</span>
        </button>
        <span className="nav-counter">
          {currentIndex + 1} / {totalCards}
        </span>
        <button onClick={handleNext} disabled={currentIndex === totalCards - 1}>
          <span>Вперед</span>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};