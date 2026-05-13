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
import { useTestSettingsStore } from "@/store/testSettingsStore";
import { EducationLevel, TestChapter, TestSection } from "../types";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";
import "../styles/test-settings.css";

export const TestSettingsPanel = ({ onSend }: { onSend: () => void }) => {
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

  const [draggedChapter, setDraggedChapter] = useState<TestChapter | null>(
    null,
  );
  const [draggedSection, setDraggedSection] = useState<{
    chapterId: string;
    section: TestSection;
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
  } = useTestSettingsStore();

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

  // Редактирование раздела (главы)
  const startEditChapter = (chapter: TestChapter) => {
    setEditingChapterId(chapter.id);
    setEditingChapterTitle(chapter.title);
  };

  const saveEditChapter = () => {
    if (editingChapterId && editingChapterTitle.trim()) {
      const updatedChapters = settings.chapters.map(ch =>
        ch.id === editingChapterId ? { ...ch, title: editingChapterTitle.trim() } : ch
      );
      updateSetting("chapters", updatedChapters);
    }
    setEditingChapterId(null);
    setEditingChapterTitle("");
  };

  const cancelEditChapter = () => {
    setEditingChapterId(null);
    setEditingChapterTitle("");
  };

  // Редактирование задания (секции)
  const startEditSection = (chapterId: string, section: TestSection) => {
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

  const handleChapterDragStart = (e: React.DragEvent, chapter: TestChapter) => {
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
        (ch) => ch.id === draggedChapter.id,
      );
      const toIndex = settings.chapters.findIndex(
        (ch) => ch.id === targetChapterId,
      );
      reorderChapters(fromIndex, toIndex);
    }
    setDraggedChapter(null);
    setDragOverChapterId(null);
  };

  const handleSectionDragStart = (
    e: React.DragEvent,
    chapterId: string,
    section: TestSection,
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
            .find((ch) => ch.id === sourceChapterId)
            ?.sections.findIndex((s) => s.id === draggedSec.id) ?? -1;
        const toIndex =
          settings.chapters
            .find((ch) => ch.id === targetChapterId)
            ?.sections.findIndex((s) => s.id === targetSectionId) ?? -1;

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
      title="Параметры контрольной работы"
      buttonLabel="Параметры контрольной работы"
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
              <label>Название контрольной работы</label>
              <input
                type="text"
                placeholder="Введите название контрольной работы"
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
                <option value="school">Школа (1-11 классы)</option>
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
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((g) => (
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

            <div className="settings-field">
              <label>Режим генерации</label>
              <div className="test-settings-radio-group">
                <label>
                  <input
                    type="radio"
                    value="full"
                    checked={settings.generationMode === "full"}
                    onChange={() => updateSetting("generationMode", "full")}
                  />
                  Полная (теория + задания)
                </label>
                <label>
                  <input
                    type="radio"
                    value="tasksOnly"
                    checked={settings.generationMode === "tasksOnly"}
                    onChange={() =>
                      updateSetting("generationMode", "tasksOnly")
                    }
                  />
                  Только задания
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("structure")}
        >
          <div className="settings-section-header-left">
            <FileText size={16} />
            <h4>Разделы и задания</h4>
          </div>
          {expandedSections.structure ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.structure && (
          <div className="settings-section-content">
            {settings.chapters.map((chapter) => (
              <div
                key={chapter.id}
                className={`test-chapter-item ${dragOverChapterId === chapter.id ? "drag-over" : ""}`}
                draggable
                onDragStart={(e) => handleChapterDragStart(e, chapter)}
                onDragOver={(e) => handleChapterDragOver(e, chapter.id)}
                onDragLeave={handleChapterDragLeave}
                onDrop={(e) => handleChapterDrop(e, chapter.id)}
              >
                <div className="test-chapter-header">
                  <div className="test-drag-handle" draggable>
                    <GripVertical size={16} />
                  </div>
                  <button
                    className="test-expand-chapter-btn"
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
                      className="test-chapter-edit-input"
                    />
                  ) : (
                    <span className="test-chapter-title">{chapter.title}</span>
                  )}
                  
                  {editingChapterId === chapter.id ? (
                    <>
                      <button
                        className="test-edit-confirm-btn"
                        onClick={saveEditChapter}
                      >
                        <Check size={14} />
                      </button>
                      <button
                        className="test-edit-cancel-btn"
                        onClick={cancelEditChapter}
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <button
                      className="test-edit-item-btn"
                      onClick={() => startEditChapter(chapter)}
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                  
                  <button
                    className="test-remove-item-btn"
                    onClick={() => removeChapter(chapter.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {expandedChapters[chapter.id] && (
                  <div className="test-sections-list">
                    {chapter.sections.map((section) => (
                      <div
                        key={section.id}
                        className={`test-section-item ${dragOverSectionId === section.id ? "drag-over" : ""}`}
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
                        <div className="test-drag-handle" draggable>
                          <GripVertical size={12} />
                        </div>
                        
                        {editingSectionId === section.id && editingSectionChapterId === chapter.id ? (
                          <textarea
                            value={editingSectionTitle}
                            onChange={(e) => setEditingSectionTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                saveEditSection();
                              }
                              if (e.key === "Escape") cancelEditSection();
                            }}
                            autoFocus
                            rows={3}
                            className="test-section-edit-textarea"
                          />
                        ) : (
                          <span className="test-section-title">
                            {section.title}
                          </span>
                        )}
                        
                        {editingSectionId === section.id && editingSectionChapterId === chapter.id ? (
                          <>
                            <button
                              className="test-edit-confirm-btn"
                              onClick={saveEditSection}
                            >
                              <Check size={12} />
                            </button>
                            <button
                              className="test-edit-cancel-btn"
                              onClick={cancelEditSection}
                            >
                              <X size={12} />
                            </button>
                          </>
                        ) : (
                          <button
                            className="test-edit-item-btn"
                            onClick={() => startEditSection(chapter.id, section)}
                          >
                            <Pencil size={12} />
                          </button>
                        )}
                        
                        <button
                          className="test-remove-item-btn"
                          onClick={() => removeSection(chapter.id, section.id)}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}

                    <div className="test-add-section">
                      <textarea
                        placeholder="Введите текст задания..."
                        value={newSectionTitles[chapter.id] || ""}
                        onChange={(e) =>
                          setNewSectionTitles((prev) => ({
                            ...prev,
                            [chapter.id]: e.target.value,
                          }))
                        }
                        rows={3}
                      />
                      <button
                        className="test-add-section-btn"
                        onClick={() => handleAddSection(chapter.id)}
                      >
                        <Plus size={14} /> Добавить задание
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="test-add-chapter">
              <input
                type="text"
                placeholder="Название раздела..."
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddChapter();
                }}
              />
              <button
                className="test-add-chapter-btn"
                onClick={handleAddChapter}
              >
                <Plus size={14} /> Добавить раздел
              </button>
            </div>

            {settings.chapters.length === 0 && (
              <div className="test-empty-structure-hint">
                Начните с добавления первого раздела
              </div>
            )}

            <div className="test-settings-sidebar-footer">
              <button className="test-send-btn" onClick={onSend}>
                <Send size={14} />
                <span>Сгенерировать</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};