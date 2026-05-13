"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  GraduationCap,
  Laptop,
  Target,
} from "lucide-react";
import { useSyllabusSettingsStore } from "@/store/syllabusSettingsStore";
import { SettingsPanelLayout } from "../../_components/SettingsPanelLayout";

export const SyllabusSettingsPanel = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    showSettings,
    setShowSettings,
  } = useSyllabusSettingsStore();
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    workload: true,
    methods: true,
    resources: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <SettingsPanelLayout
      title="Параметры курса"
      buttonLabel="Параметры курса"
      showSettings={showSettings}
      setShowSettings={setShowSettings}
      onReset={resetSettings}
    >
      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("basic")}
        >
          <div className="settings-section-header-left">
            <GraduationCap size={16} />
            <h4>Основная информация</h4>
          </div>
          {expandedSections.basic ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.basic && (
          <div className="settings-section-content">
            <div className="settings-field">
              <label>Название дисциплины *</label>
              <input
                type="text"
                placeholder="Например: Педагогика"
                value={settings.courseName}
                onChange={(e) => updateSetting("courseName", e.target.value)}
              />
            </div>

            <div className="settings-field">
              <label>Направление подготовки *</label>
              <input
                type="text"
                placeholder="Например: Педагогическое образование"
                value={settings.direction}
                onChange={(e) => updateSetting("direction", e.target.value)}
              />
            </div>

            <div className="settings-row">
              <div className="settings-field">
                <label>Код направления</label>
                <input
                  type="text"
                  placeholder="44.03.01"
                  value={settings.directionCode}
                  onChange={(e) =>
                    updateSetting("directionCode", e.target.value)
                  }
                />
              </div>
              <div className="settings-field">
                <label>Профиль</label>
                <input
                  type="text"
                  placeholder="Начальное образование"
                  value={settings.profile}
                  onChange={(e) => updateSetting("profile", e.target.value)}
                />
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-field">
                <label>Уровень подготовки</label>
                <select
                  value={settings.educationLevel}
                  onChange={(e) =>
                    updateSetting("educationLevel", e.target.value)
                  }
                >
                  <option value="бакалавриат">Бакалавриат</option>
                  <option value="магистратура">Магистратура</option>
                  <option value="специалитет">Специалитет</option>
                  <option value="СПО">СПО</option>
                  <option value="аспирантура">Аспирантура</option>
                </select>
              </div>
              <div className="settings-field">
                <label>Форма обучения</label>
                <select
                  value={settings.studyForm}
                  onChange={(e) => updateSetting("studyForm", e.target.value)}
                >
                  <option value="очная">Очная</option>
                  <option value="заочная">Заочная</option>
                  <option value="очно-заочная">Очно-заочная</option>
                </select>
              </div>
            </div>

            <div className="settings-field">
              <label>Курс</label>
              <input
                type="number"
                min="1"
                max="8"
                placeholder="3"
                value={settings.courseYear}
                onChange={(e) => updateSetting("courseYear", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("workload")}
        >
          <div className="settings-section-header-left">
            <Clock size={16} />
            <h4>Трудоемкость</h4>
          </div>
          {expandedSections.workload ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.workload && (
          <div className="settings-section-content">
            <div className="settings-row">
              <div className="settings-field">
                <label>Лекционные часы</label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  placeholder="18"
                  value={settings.lectureHours}
                  onChange={(e) =>
                    updateSetting("lectureHours", e.target.value)
                  }
                />
              </div>
              <div className="settings-field">
                <label>Практические часы</label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  placeholder="22"
                  value={settings.practiceHours}
                  onChange={(e) =>
                    updateSetting("practiceHours", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-field">
                <label>Лабораторные часы</label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  placeholder="0"
                  value={settings.labHours}
                  onChange={(e) => updateSetting("labHours", e.target.value)}
                />
              </div>
              <div className="settings-field">
                <label>Часы на СРС</label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  placeholder="16"
                  value={settings.selfStudyHours}
                  onChange={(e) =>
                    updateSetting("selfStudyHours", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-field">
                <label>Всего часов</label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  placeholder="108"
                  value={settings.totalHours}
                  onChange={(e) => updateSetting("totalHours", e.target.value)}
                />
              </div>
              <div className="settings-field">
                <label>ЗЕТ</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="60"
                  placeholder="3"
                  value={settings.credits}
                  onChange={(e) => updateSetting("credits", e.target.value)}
                />
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-field">
                <label>Тип курса</label>
                <select
                  value={settings.courseType}
                  onChange={(e) => updateSetting("courseType", e.target.value)}
                >
                  <option value="лекционный">Лекционный</option>
                  <option value="практический">Практический</option>
                  <option value="смешанный">Смешанный</option>
                  <option value="лабораторный">Лабораторный</option>
                </select>
              </div>
              <div className="settings-field">
                <label>Уровень сложности</label>
                <select
                  value={settings.difficulty}
                  onChange={(e) => updateSetting("difficulty", e.target.value)}
                >
                  <option value="начальный">Начальный</option>
                  <option value="средний">Средний</option>
                  <option value="продвинутый">Продвинутый</option>
                  <option value="экспертный">Экспертный</option>
                </select>
              </div>
            </div>

            <div className="settings-field">
              <label>Форма аттестации</label>
              <select
                value={settings.assessmentForm}
                onChange={(e) =>
                  updateSetting("assessmentForm", e.target.value)
                }
              >
                <option value="зачет">Зачет</option>
                <option value="экзамен">Экзамен</option>
                <option value="курсовая работа">Курсовая работа</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("methods")}
        >
          <div className="settings-section-header-left">
            <Target size={16} />
            <h4>Методические предпочтения</h4>
          </div>
          {expandedSections.methods ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.methods && (
          <div className="settings-section-content">
            <div className="settings-field">
              <label>Предпочитаемые методы обучения</label>
              <textarea
                rows={2}
                placeholder="кейс-стади, проектная работа, дискуссии, дебаты"
                value={settings.preferredMethods}
                onChange={(e) =>
                  updateSetting("preferredMethods", e.target.value)
                }
              />
            </div>

            <div className="settings-field">
              <label>Предпочитаемые формы контроля</label>
              <textarea
                rows={2}
                placeholder="тестирование, устный опрос, эссе"
                value={settings.preferredAssessment}
                onChange={(e) =>
                  updateSetting("preferredAssessment", e.target.value)
                }
              />
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <div
          className="settings-section-header"
          onClick={() => toggleSection("resources")}
        >
          <div className="settings-section-header-left">
            <Laptop size={16} />
            <h4>Ресурсы и ограничения</h4>
          </div>
          {expandedSections.resources ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>

        {expandedSections.resources && (
          <div className="settings-section-content">
            <div className="settings-field">
              <label>Доступное ПО</label>
              <input
                type="text"
                placeholder="Moodle, Sakai, Stepik и т.п."
                value={settings.availableSoftware}
                onChange={(e) =>
                  updateSetting("availableSoftware", e.target.value)
                }
              />
            </div>

            <div className="settings-field">
              <label>Доступное оборудование</label>
              <input
                type="text"
                placeholder="Проектор, интерактивная доска"
                value={settings.availableEquipment}
                onChange={(e) =>
                  updateSetting("availableEquipment", e.target.value)
                }
              />
            </div>

            <div className="settings-field">
              <label>Особенности контингента</label>
              <input
                type="text"
                placeholder="Студенты с ОВЗ, иностранные студенты"
                value={settings.studentFeatures}
                onChange={(e) =>
                  updateSetting("studentFeatures", e.target.value)
                }
              />
            </div>

            <div className="settings-field">
              <label>Ограничения</label>
              <input
                type="text"
                placeholder="Ограниченный доступ к зарубежным источникам"
                value={settings.limitations}
                onChange={(e) => updateSetting("limitations", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </SettingsPanelLayout>
  );
};
