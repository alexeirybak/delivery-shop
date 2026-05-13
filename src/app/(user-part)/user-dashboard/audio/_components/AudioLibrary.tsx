import { useState, useEffect } from "react";
import { AudioPlayer } from "./AudioPlayer";
import { Loader2 } from "lucide-react";
import "../styles/audio-library.css";

interface AudioFile {
  fileName: string;
  url: string;
  createdAt: number;
}

interface AudioLibraryProps {
  refreshKey?: number;
}

export const AudioLibrary = ({ refreshKey }: AudioLibraryProps) => {
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingFileName, setDeletingFileName] = useState<string | null>(null);

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tts/list");
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);
      }
    } catch (error) {
      console.error("Load files error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [refreshKey]);

  const handleDelete = async (fileName: string) => {
    setDeletingFileName(fileName);
    try {
      const response = await fetch("/api/tts/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName }),
      });

      if (response.ok) {
        await loadFiles();
      } else {
        alert("Ошибка удаления");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Ошибка удаления");
    } finally {
      setDeletingFileName(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="audio-library-loading">
        <Loader2 size={24} className="animate-spin" />
        <span>Загрузка аудиофайлов...</span>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="audio-library-empty">
        <p>Нет сгенерированных аудиофайлов</p>
        <p className="audio-library-hint">
          Создайте первый аудиофайл, чтобы он появился здесь
        </p>
      </div>
    );
  }

  return (
    <div className="audio-library">
      <h3>Мои аудиофайлы ({files.length})</h3>
      <div className="audio-library-list">
        {files.map((file) => (
          <div key={file.fileName} className="audio-library-item">
            <div className="audio-library-item-date">
              {formatDate(file.createdAt)}
            </div>
            <AudioPlayer
              audioUrl={file.url}
              fileName={file.fileName}
              onDelete={() => handleDelete(file.fileName)}
              isDeleting={deletingFileName === file.fileName}
            />
          </div>
        ))}
      </div>
    </div>
  );
};