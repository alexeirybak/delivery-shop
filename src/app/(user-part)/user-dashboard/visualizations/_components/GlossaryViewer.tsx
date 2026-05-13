import { useState, useMemo } from "react";
import { Search, BookOpen, ChevronRight, RotateCcw } from "lucide-react";
import { GlossaryViewerProps } from "../types/visualizations.types";
import "../styles/glossary-viewer.css";

export const GlossaryViewer = ({ data }: GlossaryViewerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [expandedTermId, setExpandedTermId] = useState<string | null>(null);

  const letters = useMemo(() => {
    const uniqueLetters = new Set<string>();
    data.terms.forEach((term) => {
      const firstLetter = term.term.charAt(0).toUpperCase();
      if (/[А-ЯA-Z]/.test(firstLetter)) {
        uniqueLetters.add(firstLetter);
      }
    });
    return Array.from(uniqueLetters).sort();
  }, [data.terms]);

  const filteredTerms = useMemo(() => {
    let filtered = data.terms;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (term) =>
          term.term.toLowerCase().includes(query) ||
          term.definition.toLowerCase().includes(query),
      );
    }

    if (selectedLetter) {
      filtered = filtered.filter(
        (term) => term.term.charAt(0).toUpperCase() === selectedLetter,
      );
    }

    return filtered;
  }, [data.terms, searchQuery, selectedLetter]);

  const groupedTerms = useMemo(() => {
    const groups: Record<string, typeof filteredTerms> = {};
    filteredTerms.forEach((term) => {
      const letter = term.term.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedLetter(null);
    setExpandedTermId(null);
  };

  const toggleTerm = (termId: string) => {
    setExpandedTermId(expandedTermId === termId ? null : termId);
  };

  return (
    <div className="glossary-viewer">
      <div className="glossary-viewer-header">
        <div className="glossary-viewer-title">
          <BookOpen size={20} />
          <div>
            <h3>{data.title}</h3>
            {data.description && <p>{data.description}</p>}
          </div>
        </div>
        <button
          onClick={handleReset}
          className="glossary-reset-btn"
          title="Сбросить фильтры"
        >
          <RotateCcw size={16} />
          <span>Сбросить</span>
        </button>
      </div>

      <div className="glossary-search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Поиск терминов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="glossary-letters">
        <button
          className={`letter-btn ${selectedLetter === null ? "active" : ""}`}
          onClick={() => setSelectedLetter(null)}
        >
          Все
        </button>
        {letters.map((letter) => (
          <button
            key={letter}
            className={`letter-btn ${selectedLetter === letter ? "active" : ""}`}
            onClick={() => setSelectedLetter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="glossary-terms">
        {Object.entries(groupedTerms).map(([letter, terms]) => (
          <div key={letter} className="glossary-group">
            <div className="glossary-letter-header">{letter}</div>
            {terms.map((term) => (
              <div
                key={term.id || term.term}
                className={`glossary-term ${expandedTermId === (term.id || term.term) ? "expanded" : ""}`}
              >
                <div
                  className="glossary-term-header"
                  onClick={() => toggleTerm(term.id || term.term)}
                >
                  <span className="glossary-term-name">{term.term}</span>
                  <ChevronRight size={16} className="glossary-term-icon" />
                </div>
                <div className="glossary-term-definition">
                  {term.definition}
                  {term.example && (
                    <div className="glossary-term-example">
                      Пример: {term.example}
                    </div>
                  )}
                  {term.relatedTerms && term.relatedTerms.length > 0 && (
                    <div className="glossary-term-related">
                      Связанные: {term.relatedTerms.join(", ")}
                    </div>
                  )}
                  {term.tags && term.tags.length > 0 && (
                    <div className="glossary-term-tags">
                      {term.tags.map((tag) => (
                        <span key={tag}>#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="glossary-footer">
        <span>Всего терминов: {data.terms.length}</span>
        <span>Показано: {filteredTerms.length}</span>
      </div>
    </div>
  );
};