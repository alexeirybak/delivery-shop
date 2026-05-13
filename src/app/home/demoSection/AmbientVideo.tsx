import { FC } from "react";
import { AmbientVideoProps } from "../../types/home.types";
import { memo as reactMemo } from "react";

export const AmbientVideo: FC<AmbientVideoProps> = reactMemo(
  ({ className, posterClassName, sources, title }) => {
    return (
      <div className={`ambient-video ${className || ""}`} aria-hidden="true">
        <div className={`ambient-video-poster ${posterClassName || ""}`} />
        <video
          className="ambient-video-media opacity-[0.96]"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          tabIndex={-1}
        >
          {sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
        <div className="ambient-video-overlay" />
        <span className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0">
          {title}
        </span>
      </div>
    );
  },
);

AmbientVideo.displayName = "AmbientVideo";
