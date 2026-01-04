"use client";

import { useCallback, useState, useMemo } from "react";
import { Video, Trash2, ImageIcon, Link2 } from "lucide-react";
import { cn } from "@maas/core-utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import type { Video as VideoType } from "@maas/core-api-models";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export type VideoPickerProps = {
  value?: VideoType | null;
  onChange?: (value: VideoType | null) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-invalid"?: boolean;
};

type VideoPlatform = "youtube" | "vimeo" | "dailymotion" | "unknown";

type ParsedVideo = {
  platform: VideoPlatform;
  videoId: string | null;
  embedUrl: string | null;
  thumbnails: string[];
};

function parseVideoUrl(url: string | null | undefined): ParsedVideo {
  if (!url) {
    return { platform: "unknown", videoId: null, embedUrl: null, thumbnails: [] };
  }

  // YouTube
  const youtubeRegex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    return {
      platform: "youtube",
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnails: [
        `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      ],
    };
  }

  // Vimeo
  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    return {
      platform: "vimeo",
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}`,
      thumbnails: [], // Vimeo requires API call for thumbnails
    };
  }

  // Dailymotion
  const dailymotionRegex =
    /(?:dailymotion\.com\/video\/|dai\.ly\/)([a-zA-Z0-9]+)/;
  const dailymotionMatch = url.match(dailymotionRegex);
  if (dailymotionMatch) {
    const videoId = dailymotionMatch[1];
    return {
      platform: "dailymotion",
      videoId,
      embedUrl: `https://www.dailymotion.com/embed/video/${videoId}`,
      thumbnails: [
        `https://www.dailymotion.com/thumbnail/video/${videoId}`,
      ],
    };
  }

  return { platform: "unknown", videoId: null, embedUrl: null, thumbnails: [] };
}

function ThumbnailSelector({
  thumbnails,
  onSelect,
  disabled,
}: {
  thumbnails: string[];
  onSelect: (url: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  if (thumbnails.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          className="gap-1.5"
        >
          <ImageIcon className="size-4" />
          Select thumbnail
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select preview image</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          {thumbnails.map((thumb, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                onSelect(thumb);
                setOpen(false);
              }}
              className="group relative aspect-video overflow-hidden rounded-md border transition-all hover:ring-2 hover:ring-primary"
            >
              <img
                src={thumb}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function VideoPicker({
  value,
  onChange,
  disabled,
  className,
  id,
  "aria-invalid": ariaInvalid,
}: VideoPickerProps) {
  const [inputValue, setInputValue] = useState(value?.url || "");

  const parsedVideo = useMemo(
    () => parseVideoUrl(value?.url),
    [value?.url]
  );

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value;
      setInputValue(url);
    },
    []
  );

  const handleUrlBlur = useCallback(() => {
    if (!inputValue.trim()) {
      onChange?.(null);
      return;
    }

    const parsed = parseVideoUrl(inputValue);
    const newVideo: VideoType = {
      url: inputValue,
      title: value?.title || null,
      width: value?.width || null,
      height: value?.height || null,
    };
    onChange?.(newVideo);
  }, [inputValue, onChange, value?.title, value?.width, value?.height]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleUrlBlur();
      }
    },
    [handleUrlBlur]
  );

  const handleRemove = useCallback(() => {
    setInputValue("");
    onChange?.(null);
  }, [onChange]);

  const handleThumbnailSelect = useCallback(
    (thumbnailUrl: string) => {
      // Store the selected thumbnail in the title field or a custom field
      // For now, we'll just log it - you may want to extend VideoType to store this
      console.log("Selected thumbnail:", thumbnailUrl);
    },
    []
  );

  return (
    <div
      id={id}
      aria-invalid={ariaInvalid}
      className={cn(
        "flex flex-col gap-3",
        disabled && "pointer-events-none cursor-not-allowed opacity-50",
        className
      )}
    >
      {/* URL input */}
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex flex-1 items-center gap-2 rounded-md border bg-background px-3 shadow-xs",
            "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
            ariaInvalid && "border-destructive ring-destructive/20"
          )}
        >
          <Link2 className="size-4 shrink-0 text-muted-foreground" />
          <Input
            type="url"
            value={inputValue}
            onChange={handleUrlChange}
            onBlur={handleUrlBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Paste video URL (YouTube, Vimeo, Dailymotion...)"
            className="border-0 px-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleRemove}
          disabled={disabled || !value}
          className="size-9 shrink-0"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {/* Video preview */}
      {parsedVideo.embedUrl ? (
        <div className="flex flex-col gap-2">
          <div
            className={cn(
              "relative aspect-video w-full overflow-hidden rounded-md border bg-muted"
            )}
          >
            <iframe
              src={parsedVideo.embedUrl}
              title={value?.title || "Video preview"}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground capitalize">
              {parsedVideo.platform}
            </span>
            <ThumbnailSelector
              thumbnails={parsedVideo.thumbnails}
              onSelect={handleThumbnailSelect}
              disabled={disabled}
            />
          </div>
        </div>
      ) : value?.url ? (
        <div
          className={cn(
            "flex aspect-video w-full items-center justify-center rounded-md border bg-muted"
          )}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Video className="size-8" />
            <span className="text-sm">Unsupported video platform</span>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "flex aspect-video w-full items-center justify-center rounded-md border bg-muted",
            ariaInvalid && "border-destructive"
          )}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Video className="size-8" />
            <span className="text-sm">No video selected</span>
          </div>
        </div>
      )}
    </div>
  );
}
