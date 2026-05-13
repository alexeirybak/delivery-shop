import { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import "../styles/text-to-audio-instructions.css";

export const TextToAudioInstructions = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="instructions-trigger-btn"
        title="Правила разметки текста"
      >
        <HelpCircle size={16} />
        <span>Правила разметки</span>
      </button>

      {isOpen && (
        <>
          <div
            className="instructions-overlay"
            onClick={() => setIsOpen(false)}
          />
          <div className="instructions-modal">
            <div className="instructions-header">
              <h3>Правила разметки текста для синтеза речи</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="instructions-close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="instructions-body">
              <div className="instructions-section">
                <h4>1. Паузы</h4>
                <p>
                  Вставьте специальные метки для создания пауз разной длины:
                </p>
                <ul>
                  <li>
                    <code>&lt;[tiny]&gt;</code> — микро-пауза (как запятая)
                  </li>
                  <li>
                    <code>&lt;[small]&gt;</code> — короткая пауза
                  </li>
                  <li>
                    <code>&lt;[medium]&gt;</code> — средняя пауза (как точка)
                  </li>
                  <li>
                    <code>&lt;[large]&gt;</code> — длинная пауза (смена абзаца)
                  </li>
                  <li>
                    <code>&lt;[huge]&gt;</code> — очень длинная пауза
                  </li>
                  <li>
                    <code>sil&lt;500&gt;</code> — пауза заданной длины в
                    миллисекундах
                  </li>
                </ul>
                <div className="instructions-example">
                  <strong>Пример:</strong> &quot;Привет&lt;[small]&gt; как
                  дела?&lt;[medium]&gt; Я хочу
                  рассказать...&lt;sil&lt;1000&gt;&gt; Новая мысль.&quot;
                </div>
              </div>

              <div className="instructions-section">
                <h4>2. Акцент на слове</h4>
                <p>
                  Выделите слово двойными звёздочками для логического ударения:
                </p>
                <ul>
                  <li>
                    <code>**слово**</code> — выделяет слово голосом
                  </li>
                </ul>
                <div className="instructions-example">
                  <strong>Пример:</strong> &quot;Я **сегодня** хочу поговорить о
                  важном.&quot;
                </div>
              </div>

              <div className="instructions-section">
                <h4>3. Ударение</h4>
                <p>
                  Поставьте знак <code>+</code> перед ударной гласной:
                </p>
                <ul>
                  <li>
                    <code>зам+ок</code> — замок (запор)
                  </li>
                  <li>
                    <code>з+амок</code> — замок (здание)
                  </li>
                  <li>
                    <code>ход+атайство</code>
                  </li>
                  <li>
                    <code>включ+им</code>
                  </li>
                </ul>
                <div className="instructions-example">
                  <strong>Пример:</strong> &quot;Я купил з+амок и поставил
                  зам+ок.&quot;
                </div>
              </div>

              <div className="instructions-section">
                <h4>4. Фонемы</h4>
                <p>
                  Используйте точную фонемную транскрипцию для сложных слов:
                </p>
                <ul>
                  <li>
                    <code>[[фонема]]</code> — точное произношение через фонемы
                  </li>
                </ul>
                <div className="instructions-example">
                  <strong>Пример:</strong> &quot;Произнеси [[r]] [[o]] [[z]]
                  [[a]] вместо &#39;роза&#39;.&quot;
                </div>
                Полный список поддерживаемых фонем                <a
                  href="https://aistudio.yandex.ru/docs/ru/speechkit/tts/markup/tts-supported-phonemes.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="instructions-link"
                >здесь</a>
              </div>

              <div className="instructions-section">
                <h4>Полный пример</h4>
                <div className="instructions-example">
                  &quot;Внимание&lt;[tiny]&gt; **важный** анонс!&lt;[medium]&gt;
                  <br />
                  Завтра в 10:00 состоится собрание.&lt;sil&lt;500&gt;&gt;
                  <br />
                  Явка **обязательна**.&lt;[large]&gt;
                  <br />
                  Справки по телефону: +7 (495) 123-45-67.&quot;
                </div>
              </div>

              <div className="instructions-note">
                <strong>Примечание:</strong> Выбранный голос определяет язык
                произношения. Для русского текста используйте русские голоса,
                для английского — английские.
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
