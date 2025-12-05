"use client";

import { useCallback, useRef } from "react";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { cn } from "@maas/core-utils";
import { Button } from "../ui/button";
import type { Image } from "@maas/core-api-models";

export type ImagePickerProps = {
  value?: Image | null;
  onChange?: (value: Image | null) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-invalid"?: boolean;
  accept?: string;
};

function getDisplayUrl(image: Image | null | undefined): string | null {
  if (!image) return null;
  return image.base64 || image.url || null;
}

export function ImagePicker({
  value,
  onChange,
  disabled,
  className,
  id,
  "aria-invalid": ariaInvalid,
  accept = "image/*",
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const displayUrl = getDisplayUrl(value);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        const newImage: Image = {
          id: null,
          base64,
          url: null,
          originalFilename: file.name,
          resizedImages: null,
        };
        onChange?.(newImage);
      };
      reader.readAsDataURL(file);

      // Reset input so same file can be selected again
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [onChange]
  );

  const handleRemove = useCallback(() => {
    onChange?.(null);
  }, [onChange]);

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  return (
    <div
      id={id}
      aria-invalid={ariaInvalid}
      className={cn(
        "border-input dark:bg-input/30 relative overflow-hidden rounded-md border shadow-xs transition-[color,box-shadow]",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        disabled && "pointer-events-none cursor-not-allowed opacity-50",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
      />

      {displayUrl ? (
        <div className="relative aspect-video w-full">
          <img
            src={displayUrl}
            alt={value?.originalFilename || "Selected image"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity hover:opacity-100">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleClick}
              disabled={disabled}
            >
              <Upload className="mr-2 h-4 w-4" />
              Replace
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className="text-muted-foreground hover:bg-accent flex aspect-video w-full flex-col items-center justify-center gap-2 transition-colors"
        >
          <ImageIcon className="h-10 w-10" />
          <span className="text-sm">Click to upload an image</span>
        </button>
      )}
    </div>
  );
}
