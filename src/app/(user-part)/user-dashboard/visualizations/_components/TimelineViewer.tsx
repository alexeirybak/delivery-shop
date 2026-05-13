"use client";

import { useEffect, useRef, useState } from "react";
import {
  Download,
  Maximize2,
  Save,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
} from "lucide-react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import { eventColors } from "../utils/levelColors";
import "../styles/timeline-viewer.css";

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  location?: string;
  participants?: string[];
  tags?: string[];
}

interface TimelineData {
  title?: string;
  description?: string;
  events: TimelineEvent[];
}

interface TimelineViewerProps {
  data: TimelineData;
  onClose?: () => void;
  onSave?: (data: TimelineData) => void;
  isSaving?: boolean;
}

function TimelineViewerContent({
  data,
  onSave,
  isSaving,
}: TimelineViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editEvent, setEditEvent] = useState<TimelineEvent | null>(null);
  const [editField, setEditField] = useState<keyof TimelineEvent>("title");
  const [editValue, setEditValue] = useState("");
  const [timelineData, setTimelineData] = useState<TimelineData>(data);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({
    date: new Date().toISOString().split("T")[0],
    title: "",
    description: "",
  });
  const editInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTimelineData(data);
  }, [data]);

  const handleSave = () => {
    if (onSave) onSave(timelineData);
  };

  const handleAddEvent = () => {
    setIsAdding(true);
    setNewEvent({
      date: new Date().toISOString().split("T")[0],
      title: "",
      description: "",
    });
    setTimeout(() => editInputRef.current?.focus(), 50);
  };

  const handleAddSubmit = () => {
    if (!newEvent.title?.trim() || !newEvent.date) {
      setIsAdding(false);
      return;
    }

    const newId = `event-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const event: TimelineEvent = {
      id: newId,
      date: newEvent.date,
      title: newEvent.title.trim(),
      description: newEvent.description || "",
      location: newEvent.location,
      participants: newEvent.participants,
      tags: newEvent.tags,
    };

    setTimelineData({
      ...timelineData,
      events: [...timelineData.events, event].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    });
    setIsAdding(false);
    setSelectedEventId(newId);
  };

  const handleEditEvent = (
    event: TimelineEvent,
    field: keyof TimelineEvent,
  ) => {
    setEditEvent(event);
    setEditField(field);
    setEditValue(String(event[field] || ""));
    setIsEditing(true);
    setTimeout(() => {
      if (field === "description") {
        textareaRef.current?.focus();
      } else {
        editInputRef.current?.focus();
        editInputRef.current?.select();
      }
    }, 50);
  };

  const handleEditSubmit = () => {
    if (!editEvent || !editValue.trim()) {
      setIsEditing(false);
      return;
    }

    const updatedEvents = timelineData.events.map((event) =>
      event.id === editEvent.id
        ? { ...event, [editField]: editValue.trim() }
        : event,
    );

    setTimelineData({ ...timelineData, events: updatedEvents });
    setIsEditing(false);
    setEditEvent(null);
    setEditValue("");
  };

  const handleDeleteEvent = (eventId: string) => {
    if (timelineData.events.length <= 1) {
      alert("Должно быть хотя бы одно событие");
      return;
    }
    setTimelineData({
      ...timelineData,
      events: timelineData.events.filter((e) => e.id !== eventId),
    });
    if (selectedEventId === eventId) {
      setSelectedEventId(null);
    }
  };

  const downloadPNG = async () => {
    if (!containerRef.current) return;

    try {
      const canvas = await html2canvas(containerRef.current);

      const link = document.createElement("a");
      link.download = "timeline.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Ошибка сохранения PNG:", error);
    }
  };

  const toggleFullscreen = () => {
    const element = containerRef.current;
    if (!element) return;
    if (!document.fullscreenElement) {
      element.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const sortedEvents = [...timelineData.events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <div ref={containerRef} className="timeline-viewer-container">
      <div className="timeline-viewer-toolbar">
        <button
          onClick={handleAddEvent}
          className="timeline-viewer-toolbar-btn timeline-viewer-primary"
          title="Добавить событие"
        >
          <Plus size={16} />
          <span>Событие</span>
        </button>
        <div className="timeline-viewer-toolbar-divider" />
        <button
          onClick={downloadPNG}
          className="timeline-viewer-toolbar-btn"
          title="Скачать PNG"
        >
          <Download size={16} />
          <span>PNG</span>
        </button>
        <button
          onClick={toggleFullscreen}
          className="timeline-viewer-toolbar-btn"
          title="Полный экран"
        >
          <Maximize2 size={16} />
          <span>{isFullscreen ? "Окно" : "Экран"}</span>
        </button>

        {onSave && (
          <>
            <div className="timeline-viewer-toolbar-divider" />
            <button
              onClick={handleSave}
              className="timeline-viewer-toolbar-btn timeline-viewer-success"
              disabled={isSaving}
            >
              <Save size={16} />
              <span>{isSaving ? "Сохранение..." : "Сохранить"}</span>
            </button>
          </>
        )}
      </div>

      {timelineData.title && (
        <div className="timeline-viewer-header">
          <h2>{timelineData.title}</h2>
          {timelineData.description && <p>{timelineData.description}</p>}
        </div>
      )}

      <div className="timeline-viewer-wrapper" ref={timelineRef}>
        <div className="timeline-viewer-line" />

        {sortedEvents.map((event, index) => {
          const colors = eventColors[index % eventColors.length];
          const isSelected = selectedEventId === event.id;
          const date = new Date(event.date);
          const formattedDate = date.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          return (
            <motion.div
              key={event.id}
              className={`timeline-viewer-event ${index % 2 === 0 ? "left" : "right"} ${isSelected ? "selected" : ""}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => setSelectedEventId(event.id)}
            >
              <div
                className="timeline-viewer-event-marker"
                style={{
                  background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
                }}
              >
                <Calendar size={16} />
              </div>

              <div className="timeline-viewer-event-connector-line" />

              <div
                className="timeline-viewer-event-content"
                style={{ borderColor: colors.from }}
              >
                <div className="timeline-viewer-event-date">
                  <Clock size={12} />
                  <span>{formattedDate}</span>
                </div>

                <h4 className="timeline-viewer-event-title">{event.title}</h4>

                {event.description && (
                  <p className="timeline-viewer-event-description">
                    {event.description}
                  </p>
                )}

                {event.location && (
                  <div className="timeline-viewer-event-location">
                    <MapPin size={12} />
                    <span>{event.location}</span>
                  </div>
                )}

                {event.participants && event.participants.length > 0 && (
                  <div className="timeline-viewer-event-participants">
                    <Users size={12} />
                    <span>{event.participants.join(", ")}</span>
                  </div>
                )}

                {event.tags && event.tags.length > 0 && (
                  <div className="timeline-viewer-event-tags">
                    <Tag size={12} />
                    <div className="timeline-viewer-event-tags-list">
                      {event.tags.map((tag, i) => (
                        <span key={i} className="timeline-viewer-event-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="timeline-viewer-event-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditEvent(event, "title");
                    }}
                    className="timeline-viewer-event-edit"
                    title="Редактировать название"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditEvent(event, "description");
                    }}
                    className="timeline-viewer-event-edit"
                    title="Редактировать описание"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditEvent(event, "date");
                    }}
                    className="timeline-viewer-event-edit"
                    title="Редактировать дату"
                  >
                    <Calendar size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEvent(event.id);
                    }}
                    className="timeline-viewer-event-delete"
                    title="Удалить"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="timeline-viewer-info-panel">
        <span>
          Клик на событие - выделить | Кнопки редактирования в карточке |
          Добавляйте события через кнопку &quot;Событие&quot;
        </span>
      </div>

      {isEditing && editEvent && (
        <div className="timeline-viewer-edit-modal">
          <div className="timeline-viewer-edit-modal-content">
            <h3>
              {editField === "title" && "Редактировать название"}
              {editField === "description" && "Редактировать описание"}
              {editField === "date" && "Редактировать дату"}
            </h3>
            {editField === "description" ? (
              <textarea
                ref={textareaRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="timeline-viewer-edit-modal-textarea"
                rows={4}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleEditSubmit()
                }
              />
            ) : (
              <input
                ref={editInputRef}
                type={editField === "date" ? "date" : "text"}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="timeline-viewer-edit-modal-input"
                onKeyDown={(e) => e.key === "Enter" && handleEditSubmit()}
              />
            )}
            <div className="timeline-viewer-edit-modal-actions">
              <button
                onClick={() => setIsEditing(false)}
                className="timeline-viewer-edit-modal-btn cancel"
              >
                Отмена
              </button>
              <button
                onClick={handleEditSubmit}
                className="timeline-viewer-edit-modal-btn save"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdding && (
        <div className="timeline-viewer-edit-modal">
          <div className="timeline-viewer-edit-modal-content">
            <h3>Добавить событие</h3>
            <input
              ref={editInputRef}
              type="date"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent({ ...newEvent, date: e.target.value })
              }
              className="timeline-viewer-edit-modal-input"
              placeholder="Дата"
            />
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              className="timeline-viewer-edit-modal-input"
              placeholder="Название события"
            />
            <textarea
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
              className="timeline-viewer-edit-modal-textarea"
              placeholder="Описание (необязательно)"
              rows={3}
            />
            <input
              type="text"
              value={newEvent.location || ""}
              onChange={(e) =>
                setNewEvent({ ...newEvent, location: e.target.value })
              }
              className="timeline-viewer-edit-modal-input"
              placeholder="Место (необязательно)"
            />
            <div className="timeline-viewer-edit-modal-actions">
              <button
                onClick={() => setIsAdding(false)}
                className="timeline-viewer-edit-modal-btn cancel"
              >
                Отмена
              </button>
              <button
                onClick={handleAddSubmit}
                className="timeline-viewer-edit-modal-btn save"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const TimelineViewer = (props: TimelineViewerProps) => {
  return <TimelineViewerContent {...props} />;
};
