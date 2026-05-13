import {
  Key,
  Save,
  Edit2,
  Eye,
  EyeOff,
  Trash2,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import "../styles/yandex-api-keys.css";

export default function YandexApiKeys() {
  const [isEditing, setIsEditing] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [folderId, setFolderId] = useState("");
  const [hasKeys, setHasKeys] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showFolderId, setShowFolderId] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    checkKeysStatus();
  }, []);

  const checkKeysStatus = async () => {
    try {
      const res = await fetch("/api/gpt/yandex-cloud/user/yandex-keys");
      const data = await res.json();
      setHasKeys(data.hasKeys);
    } catch (error) {
      console.error("Ошибка проверки ключей:", error);
    }
  };

  const validateFields = () => {
    if (!apiKey.trim()) {
      setMessage({ text: "Введите API ключ", type: "error" });
      return false;
    }
    if (!folderId.trim()) {
      setMessage({ text: "Введите Folder ID", type: "error" });
      return false;
    }
    if (apiKey.trim().length < 10) {
      setMessage({ text: "API ключ слишком короткий", type: "error" });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    setIsSaving(true);
    setIsValidating(true);
    setMessage(null);

    try {
      const validateRes = await fetch(
        "/api/gpt/yandex-cloud/user/yandex-keys/validate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            apiKey: apiKey.trim(),
            folderId: folderId.trim(),
          }),
        },
      );

      const validateData = await validateRes.json();

      if (!validateData.valid) {
        setMessage({
          text: validateData.error || "Неверные ключи API",
          type: "error",
        });
        setIsSaving(false);
        setIsValidating(false);
        return;
      }

      const res = await fetch("/api/gpt/yandex-cloud/user/yandex-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: apiKey.trim(),
          folderId: folderId.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: "API ключи успешно сохранены", type: "success" });
        setHasKeys(true);
        setIsEditing(false);
        setApiKey("");
        setFolderId("");
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({
          text: data.error || "Ошибка сохранения ключей",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setMessage({ text: "Ошибка сети при сохранении", type: "error" });
    } finally {
      setIsSaving(false);
      setIsValidating(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Удалить ваши API ключи? После этого будут использоваться системные ключи.",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/gpt/yandex-cloud/user/yandex-keys", {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage({ text: "API ключи удалены", type: "success" });
        setHasKeys(false);
        setIsEditing(false);
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await res.json();
        setMessage({
          text: data.error || "Ошибка удаления ключей",
          type: "error",
        });
      }
    } catch {
      setMessage({ text: "Ошибка сети при удалении", type: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setApiKey("");
    setFolderId("");
    setMessage(null);
  };

  const handleCloseMessage = () => {
    setMessage(null);
  };

  return (
    <div className="yandex-api-section">
      <h2 className="yandex-api-section-title">
        <Key />
        Yandex Cloud API
      </h2>

      <div className="yandex-api-info-block">
        <AlertCircle className="yandex-api-info-icon" />
        <div className="yandex-api-info-text">
          <p>
            API ключи используются для генерации контента через Yandex Cloud.
            Если вы не добавите свои ключи, будут использоваться системные
            (несколько дороже).
          </p>
          <div>
            <strong>Как получить API ключ:</strong>
            <ol>
              <li>
                Перейдите в{" "}
                <a
                  href="https://console.cloud.yandex.ru"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  консоль Yandex Cloud
                </a>
              </li>
              <li>
                Нажмите кнопку &quot;Создать ресурс&quot; → &quot;Управление
                ресурсами&quot; → &quot;Сервисный аккаунт&quot;
              </li>
              <li>
                Создайте сервисный аккаунт: укажите имя, описание, выберите роль
                &quot;admin&quot; в каталоге
              </li>
              <li>Кликните по созданному сервисному аккаунту</li>
              <li>Нажмите &quot;Создать API ключ&quot;</li>
              <li>
                Выберите область действия{" "}
                <code>yc.ai.languageModels.execute</code>
              </li>
              <li>
                Скопируйте сгенерированный ключ и Folder ID из настроек каталога
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="yandex-api-field">
        <div className="yandex-api-field-label">
          <Key />
          <span>API ключи Yandex Cloud</span>
          {hasKeys && !isEditing && (
            <span className="yandex-api-badge-active">
              <CheckCircle />
              Активны
            </span>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="yandex-api-edit-form">
            <div className="hidden-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                defaultValue="user"
              />
            </div>

            <div>
              <label className="yandex-api-input-label">Folder ID</label>
              <div className="yandex-api-password-wrapper">
                <input
                  type={showFolderId ? "text" : "password"}
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                  className="yandex-api-input"
                  placeholder="Введите ID каталога"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowFolderId(!showFolderId)}
                  className="yandex-api-eye-btn"
                >
                  {showFolderId ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div>
              <label className="yandex-api-input-label">API Key</label>
              <div className="yandex-api-password-wrapper">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="yandex-api-input"
                  placeholder="Введите API ключ из Yandex Cloud"
                  autoComplete="new-password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="yandex-api-eye-btn"
                >
                  {showApiKey ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="yandex-api-actions">
              <button
                type="submit"
                disabled={isSaving}
                className="yandex-api-save-btn"
              >
                <Save />
                {isValidating
                  ? "Проверка..."
                  : isSaving
                    ? "Сохранение..."
                    : "Сохранить"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="yandex-api-cancel-btn"
              >
                Отмена
              </button>
            </div>
          </form>
        ) : (
          <div className="yandex-api-value">
            <span
              className={
                hasKeys
                  ? "yandex-api-value-active"
                  : "yandex-api-value-inactive"
              }
            >
              {hasKeys ? "Ключи установлены (скрыты)" : "Не указаны"}
            </span>
            <div className="yandex-api-value-actions">
              {hasKeys && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="yandex-api-delete-btn"
                  title="Удалить ключи"
                >
                  <Trash2 />
                </button>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="yandex-api-edit-btn"
                title={hasKeys ? "Изменить ключи" : "Добавить ключи"}
              >
                <Edit2 />
              </button>
            </div>
          </div>
        )}

        {message && (
          <div
            className={`yandex-api-message yandex-api-message-${message.type}`}
          >
            <div className="yandex-api-message-content">
              {message.type === "success" ? <CheckCircle /> : <AlertCircle />}
              <span>{message.text}</span>
            </div>
            <button
              onClick={handleCloseMessage}
              className="yandex-api-message-close"
            >
              <X />
            </button>
          </div>
        )}
      </div>

      {!hasKeys && !isEditing && (
        <div className="yandex-api-note">
          <AlertCircle />
          <span>
            Будут использоваться системные ключи (есть ограничения по частоте
            запросов)
          </span>
        </div>
      )}
    </div>
  );
}
