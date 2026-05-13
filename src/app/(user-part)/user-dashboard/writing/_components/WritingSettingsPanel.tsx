import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  BookOpen,
  FileText,
  GripVertical,
  Send,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { useWritingSettingsStore } from "@/store/writingSettingsStore";
import {
  EducationLevel,
  WritingChapter,
  WritingSection,
  WritingWorkMode,
} from "../types";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";
import { GenerationMode } from "../../types";
import "../styles/writing-settings.css";

interface WritingSettingsPanelProps {
  mode: GenerationMode;
  onSend: () => void;
}

const modeTexts: Record<
  WritingWorkMode,
  {
    title: string;
    buttonLabel: string;
    nameLabel: string;
    structureTitle: string;
    chapterPlaceholder: string;
    sectionPlaceholder: string;
    addChapterBtn: string;
    addSectionBtn: string;
    emptyHint: string;
    generateBtn: string;
  }
> = {
  textbooks: {
    title: "Параметры учебника",
    buttonLabel: "Параметры учебника",
    nameLabel: "Название учебника",
    structureTitle: "Структура учебника",
    chapterPlaceholder: "Название следующей главы...",
    sectionPlaceholder: "Название параграфа...",
    addChapterBtn: "Добавить главу",
    addSectionBtn: "Добавить параграф",
    emptyHint: "Начните с добавления первой главы",
    generateBtn: "Сгенерировать учебник",
  },
  coursework: {
    title: "Параметры курсовой работы",
    buttonLabel: "Параметры курсовой работы",
    nameLabel: "Название курсовой работы",
    structureTitle: "Структура курсовой работы",
    chapterPlaceholder: "Название следующей главы...",
    sectionPlaceholder: "Название параграфа...",
    addChapterBtn: "Добавить главу",
    addSectionBtn: "Добавить параграф",
    emptyHint: "Начните с добавления первой главы",
    generateBtn: "Сгенерировать курсовую работу",
  },
  report: {
    title: "Параметры реферата",
    buttonLabel: "Параметры реферата",
    nameLabel: "Название реферата",
    structureTitle: "Структура реферата",
    chapterPlaceholder: "Название следующего раздела...",
    sectionPlaceholder: "Название подраздела...",
    addChapterBtn: "Добавить раздел",
    addSectionBtn: "Добавить подраздел",
    emptyHint: "Начните с добавления первого раздела",
    generateBtn: "Сгенерировать реферат",
  },
  thesis: {
    title: "Параметры ВКР",
    buttonLabel: "Параметры ВКР",
    nameLabel: "Название ВКР",
    structureTitle: "Структура ВКР",
    chapterPlaceholder: "Название следующей главы...",
    sectionPlaceholder: "Название параграфа...",
    addChapterBtn: "Добавить главу",
    addSectionBtn: "Добавить параграф",
    emptyHint: "Начните с добавления первой главы",
    generateBtn: "Сгенерировать ВКР",
  },
};

const isWritingWorkMode = (mode: GenerationMode): mode is WritingWorkMode => {
  return ["textbooks", "coursework", "report", "thesis"].includes(mode);
};

export const WritingSettingsPanel = ({
  mode,
  onSend,
}: WritingSettingsPanelProps) => {
  const [expandedSections, setExpandedSections] = useState({
    main: true,
    structure: true,
  });
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newSectionTitles, setNewSectionTitles] = useState<
    Record<string, string>
  >({});
  const [expandedChapters, setExpandedChapters] = useState<
    Record<string, boolean>
  >({});

  // Состояния для редактирования
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editingChapterTitle, setEditingChapterTitle] = useState("");
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState("");
  const [editingSectionChapterId, setEditingSectionChapterId] = useState<string | null>(null);

  const [draggedChapter, setDraggedChapter] = useState<WritingChapter | null>(
    null,
  );
  const [draggedSection, setDraggedSection] = useState<{
    chapterId: string;
    section: WritingSection;
  } | null>(null);
  const [dragOverChapterId, setDragOverChapterId] = useState<string | null>(
    null,
  );
  const [dragOverSectionId, setDragOverSectionId] = useState<string | null>(
    null,
  );

  const {
    settings,
    updateSetting,
    addChapter,
    removeChapter,
    addSection,
    removeSection,
    resetSettings,
    reorderChapters,
    reorderSections,
    showSettings,
    setShowSettings,
  } = useWritingSettingsStore();

  const texts = isWritingWorkMode(mode) ? modeTexts[mode] : modeTexts.textbooks;

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const handleAddChapter = () => {
    if (newChapterTitle.trim()) {
      addChapter(newChapterTitle.trim());
      setNewChapterTitle("");
    }
  };

  const handleAddSection = (chapterId: string) => {
    const title = newSectionTitles[chapterId];
    if (title?.trim()) {
      addSection(chapterId, title.trim());
      setNewSectionTitles((prev) => ({ ...prev, [chapterId]: "" }));
    }
  };

  // Редактирование главы
  const startEditChapter = (chapter: WritingChapter) => {
    setEditingChapterId(chapter.id);
    setEditingChapterTitle(chapter.title);
  };

  const saveEditChapter = () => {
    if (editingChapterId && editingChapterTitle.trim()) {
      const chapter = settings.chapters.find(ch => ch.id === editingChapterId);
      if (chapter) {
        // Обновляем название главы через updateSetting
        const updatedChapters = settings.chapters.map(ch =>
          ch.id === editingChapterId ? { ...ch, title: editingChapterTitle.trim() } : ch
        );
        updateSetting("chapters", updatedChapters);
      }
    }
    setEditingChapterId(null);
    setEditingChapterTitle("");
  };

  const cancelEditChapter = () => {
    setEditingChapterId(null);
    setEditingChapterTitle("");
  };

  // Редактирование параграфа
  const startEditSection = (chapterId: string, section: WritingSection) => {
    setEditingSectionId(section.id);
    setEditingSectionTitle(section.title);
    setEditingSectionChapterId(chapterId);
  };

  const saveEditSection = () => {
    if (editingSectionId && editingSectionTitle.trim() && editingSectionChapterId) {
      const updatedChapters = settings.chapters.map(ch =>
        ch.id === editingSectionChapterId
          ? {
              ...ch,
              sections: ch.sections.map(s =>
                s.id === editingSectionId ? { ...s, title: editingSectionTitle.trim() } : s
              ),
            }
          : ch
      );
      updateSetting("chapters", updatedChapters);
    }
    setEditingSectionId(null);
    setEditingSectionTitle("");
    setEditingSectionChapterId(null);
  };

  const cancelEditSection = () => {
    setEditingSectionId(null);
    setEditingSectionTitle("");
    setEditingSectionChapterId(null);
  };

  const handleChapterDragStart = (
    e: React.DragEvent,
    chapter: WritingChapter,
  ) => {
    setDraggedChapter(chapter);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleChapterDragOver = (e: React.DragEvent, chapterId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverChapterId(chapterId);
  };

  const handleChapterDragLeave = () => {
    setDragOverChapterId(null);
  };

  const handleChapterDrop = (e: React.DragEvent, targetChapterId: string) => {
    e.preventDefault();
    if (draggedChapter && draggedChapter.id !== targetChapterId) {
      const fromIndex = settings.chapters.findIndex(
        (ch: WritingChapter) => ch.id === draggedChapter.id,
      );
      const toIndex = settings.chapters.findIndex(
        (ch: WritingChapter) => ch.id === targetChapterId,
      );
      reorderChapters(fromIndex, toIndex);
    }
    setDraggedChapter(null);
    setDragOverChapterId(null);
  };

  const handleSectionDragStart = (
    e: React.DragEvent,
    chapterId: string,
    section: WritingSection,
  ) => {
    setDraggedSection({ chapterId, section });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleSectionDragOver = (
    e: React.DragEvent,
    chapterId: string,
    sectionId: string,
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverChapterId(chapterId);
    setDragOverSectionId(sectionId);
  };

  const handleSectionDragLeave = () => {
    setDragOverSectionId(null);
  };

  const handleSectionDrop = (
    e: React.DragEvent,
    targetChapterId: string,
    targetSectionId: string,
  ) => {
    e.preventDefault();
    if (draggedSection) {
      const { chapterId: sourceChapterId, section: draggedSec } =
        draggedSection;

      if (sourceChapterId === targetChapterId) {
        const fromIndex =
          settings.chapters
            .find((ch: WritingChapter) => ch.id === sourceChapterId)
            ?.sections.findIndex(
              (s: WritingSection) => s.id === draggedSec.id,
            ) ?? -1;
        const toIndex =
          settings.chapters
            .find((ch: WritingChapter) => ch.id === targetChapterId)
            ?.sections.findIndex(
              (s: WritingSection) => s.id === targetSectionId,
            ) ?? -1;

        if (fromIndex !== -1 && toIndex !== -1) {
          reorderSections(sourceChapterId, fromIndex, toIndex);
        }
      } else {
        const sectionToMove = { ...draggedSec };
        removeSection(sourceChapterId, draggedSec.id);
        addSection(targetChapterId, sectionToMove.title);
      }
    }
    setDraggedSection(null);
    setDragOverSectionId(null);
    setDragOverChapterId(null);
  };

  return (
    <SettingsPanelLayout
      title={texts.title}
      buttonLabel={texts.buttonLabel}
      showSettings={showSettings}
      setShowSettings={setShowSettings}
      onReset={resetSettings}
    >
      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("main")}
        >
          <div className="settings-section-header-left">
            <BookOpen size={16} />
            <h4>Основные параметры</h4>
          </div>
          {expandedSections.main ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.main && (
          <div className="settings-section-content">
            <div className="settings-field">
              <label>{texts.nameLabel}</label>
              <input
                type="text"
                placeholder={`Введите ${texts.nameLabel.toLowerCase()}`}
                value={settings.title}
                onChange={(e) => updateSetting("title", e.target.value)}
              />
            </div>

            <div className="settings-field">
              <label>Уровень образования</label>
              <select
                value={settings.educationLevel}
                onChange={(e) =>
                  updateSetting(
                    "educationLevel",
                    e.target.value as EducationLevel,
                  )
                }
              >
                <option value="school">Школа (6-11 классы)</option>
                <option value="spo">СПО / Колледж</option>
                <option value="university">ВУЗ / Университет</option>
              </select>
            </div>

            {settings.educationLevel === "school" && (
              <div className="settings-field">
                <label>Класс</label>
                <select
                  value={settings.grade}
                  onChange={(e) => updateSetting("grade", e.target.value)}
                >
                  {[6, 7, 8, 9, 10, 11].map((g) => (
                    <option key={g} value={g}>
                      {g} класс
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(settings.educationLevel === "spo" ||
              settings.educationLevel === "university") && (
              <div className="settings-field">
                <label>Курс</label>
                <select
                  value={settings.courseYear}
                  onChange={(e) => updateSetting("courseYear", e.target.value)}
                >
                  {[1, 2, 3, 4, 5, 6].map((c) => (
                    <option key={c} value={c}>
                      {c} курс
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="settings-field">
              <label>Предмет / Дисциплина</label>
              <input
                type="text"
                placeholder="Например: математика, русский язык..."
                value={settings.subject}
                onChange={(e) => updateSetting("subject", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("structure")}
        >
          <div className="settings-section-header-left notice">
            <div>
              <FileText size={16} />
              <h4>{texts.structureTitle}</h4>
            </div>
            <p>Не забудьте про введение и заключение</p>
            <p>Включите в главы названия параграфов с помощью стрелки &quot;Вниз&quot;</p>
          </div>
          {expandedSections.structure ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.structure && (
          <div className="settings-section-content">
            {settings.chapters.map((chapter: WritingChapter) => (
              <div
                key={chapter.id}
                className={`writing-chapter-item ${dragOverChapterId === chapter.id ? "drag-over" : ""}`}
                draggable
                onDragStart={(e) => handleChapterDragStart(e, chapter)}
                onDragOver={(e) => handleChapterDragOver(e, chapter.id)}
                onDragLeave={handleChapterDragLeave}
                onDrop={(e) => handleChapterDrop(e, chapter.id)}
              >
                <div className="writing-chapter-header">
                  <div className="writing-drag-handle" draggable>
                    <GripVertical size={16} />
                  </div>
                  <button
                    className="writing-expand-chapter-btn"
                    onClick={() => toggleChapter(chapter.id)}
                  >
                    {expandedChapters[chapter.id] ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>
                  
                  {editingChapterId === chapter.id ? (
                    <input
                      type="text"
                      value={editingChapterTitle}
                      onChange={(e) => setEditingChapterTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEditChapter();
                        if (e.key === "Escape") cancelEditChapter();
                      }}
                      autoFocus
                      className="writing-chapter-edit-input"
                    />
                  ) : (
                    <span className="writing-chapter-title">{chapter.title}</span>
                  )}
                  
                  {editingChapterId === chapter.id ? (
                    <>
                      <button
                        className="writing-edit-confirm-btn"
                        onClick={saveEditChapter}
                      >
                        <Check size={14} />
                      </button>
                      <button
                        className="writing-edit-cancel-btn"
                        onClick={cancelEditChapter}
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <button
                      className="writing-edit-item-btn"
                      onClick={() => startEditChapter(chapter)}
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                  
                  <button
                    className="writing-remove-item-btn"
                    onClick={() => removeChapter(chapter.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {expandedChapters[chapter.id] && (
                  <div className="writing-sections-list">
                    {chapter.sections.map((section: WritingSection) => (
                      <div
                        key={section.id}
                        className={`writing-section-item ${dragOverSectionId === section.id ? "drag-over" : ""}`}
                        draggable
                        onDragStart={(e) =>
                          handleSectionDragStart(e, chapter.id, section)
                        }
                        onDragOver={(e) =>
                          handleSectionDragOver(e, chapter.id, section.id)
                        }
                        onDragLeave={handleSectionDragLeave}
                        onDrop={(e) =>
                          handleSectionDrop(e, chapter.id, section.id)
                        }
                      >
                        <div className="writing-drag-handle" draggable>
                          <GripVertical size={12} />
                        </div>
                        
                        {editingSectionId === section.id && editingSectionChapterId === chapter.id ? (
                          <input
                            type="text"
                            value={editingSectionTitle}
                            onChange={(e) => setEditingSectionTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEditSection();
                              if (e.key === "Escape") cancelEditSection();
                            }}
                            autoFocus
                            className="writing-section-edit-input"
                          />
                        ) : (
                          <span className="writing-section-title">
                            {section.title}
                          </span>
                        )}
                        
                        {editingSectionId === section.id && editingSectionChapterId === chapter.id ? (
                          <>
                            <button
                              className="writing-edit-confirm-btn"
                              onClick={saveEditSection}
                            >
                              <Check size={12} />
                            </button>
                            <button
                              className="writing-edit-cancel-btn"
                              onClick={cancelEditSection}
                            >
                              <X size={12} />
                            </button>
                          </>
                        ) : (
                          <button
                            className="writing-edit-item-btn"
                            onClick={() => startEditSection(chapter.id, section)}
                          >
                            <Pencil size={12} />
                          </button>
                        )}
                        
                        <button
                          className="writing-remove-item-btn"
                          onClick={() => removeSection(chapter.id, section.id)}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}

                    <div className="writing-add-section">
                      <input
                        type="text"
                        placeholder={texts.sectionPlaceholder}
                        value={newSectionTitles[chapter.id] || ""}
                        onChange={(e) =>
                          setNewSectionTitles((prev) => ({
                            ...prev,
                            [chapter.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddSection(chapter.id);
                        }}
                      />
                      <button
                        className="writing-add-section-btn"
                        onClick={() => handleAddSection(chapter.id)}
                      >
                        <Plus size={14} /> {texts.addSectionBtn}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="writing-add-chapter">
              <input
                type="text"
                placeholder={texts.chapterPlaceholder}
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddChapter();
                }}
              />
              <button
                className="writing-add-chapter-btn"
                onClick={handleAddChapter}
              >
                <Plus size={14} /> {texts.addChapterBtn}
              </button>
            </div>

            {settings.chapters.length === 0 && (
              <div className="writing-empty-structure-hint">
                {texts.emptyHint}
              </div>
            )}

            <div className="writing-settings-sidebar-footer">
              <button className="writing-send-btn" onClick={onSend}>
                <Send size={14} />
                <span>{texts.generateBtn}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};