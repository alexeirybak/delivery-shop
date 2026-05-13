import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  X,
  Trash2,
  Loader2,
} from "lucide-react";
import "../styles/audio-player.css";

interface AudioPlayerProps {
  audioUrl: string;
  fileName?: string;
  onClose?: () => void;
  onDelete?: () => Promise<void>;
  isDeleting?: boolean;
  autoPlay?: boolean;
}

export const AudioPlayer = ({
  audioUrl,
  fileName,
  onClose,
  onDelete,
  isDeleting = false,
  autoPlay = false,
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const loadAudio = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(audioUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.load();
        }
      } catch (error) {
        console.error("Ошибка загрузки аудио:", error);
        setIsLoading(false);
      }
    };
    
    loadAudio();
    
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl]);

  useEffect(() => {
    if (autoPlay && audioRef.current && !isLoading) {
      audioRef.current.play().catch(console.error);
    }
  }, [autoPlay, isLoading]);

  const togglePlay = () => {
    if (audioRef.current && !isLoading) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const dur = audioRef.current.duration;
      if (isFinite(dur) && !isNaN(dur)) {
        setDuration(dur);
      }
      setIsLoading(false);
    }
  };

  const handleCanPlay = () => {
    if (audioRef.current) {
      const dur = audioRef.current.duration;
      if (isFinite(dur) && !isNaN(dur)) {
        setDuration(dur);
      }
      setIsLoading(false);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current && isFinite(time)) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "audio.mp3";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    }
  };

  const handleDelete = async () => {
    if (onDelete && confirm("Удалить этот аудиофайл?")) {
      await onDelete();
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time) || time === Infinity) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onEnded={handleEnded}
      />

      {isLoading && (
        <div className="audio-player-loading">
          <Loader2 size={20} className="animate-spin" />
          <span>Загрузка...</span>
        </div>
      )}

      <div className="audio-player-controls">
        <button className="audio-player-btn" onClick={togglePlay} disabled={isLoading}>
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <div className="audio-player-progress">
          <span className="audio-player-time">{formatTime(currentTime)}</span>
          <div className="audio-player-slider-wrapper">
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.01"
              value={currentTime}
              onChange={handleSeek}
              disabled={isLoading || !duration}
              className="audio-player-slider"
              style={{
                background: `linear-gradient(to right, var(--settings-accent-color) ${progressPercent}%, var(--color-line) ${progressPercent}%)`,
              }}
            />
          </div>
          <span className="audio-player-time">{formatTime(duration)}</span>
        </div>

        <div className="audio-player-volume">
          <button className="audio-player-btn" onClick={toggleMute}>
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="audio-player-volume-slider"
          />
        </div>

        <button className="audio-player-btn" onClick={handleDownload}>
          <Download size={16} />
        </button>

        {onDelete && (
          <button
            className="audio-player-btn audio-player-delete-btn"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        )}

        {onClose && (
          <button className="audio-player-btn" onClick={onClose}>
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};