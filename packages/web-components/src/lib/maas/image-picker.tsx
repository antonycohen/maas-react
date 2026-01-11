"use client";

import { useCallback, useRef, useState } from "react";
import { Image as ImageIcon, Trash2, Crop } from "lucide-react";
import { cn } from "@maas/core-utils";
import { Button } from "../ui/button";
import { ImageCropDialog } from "./image-crop-dialog";
import type { Image } from "@maas/core-api-models";

export type ImagePickerProps = {
  value?: Image | null;
  onChange?: (value: Image | null) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-invalid"?: boolean;
  accept?: string;
  /** Required aspect ratio (width / height). When set, images not matching will prompt a crop dialog. */
  ratio?: number;
};

function getDisplayUrl(image: Image | null | undefined): string | null {
  if (!image) return null;
  return image.base64 || image.url || null;
}

function checkImageRatio(
  imageSrc: string,
  targetRatio: number,
  tolerance = 0.01
): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const imageRatio = img.width / img.height;
      const matches = Math.abs(imageRatio - targetRatio) <= tolerance;
      resolve(matches);
    };
    img.onerror = () => resolve(false);
    img.src = imageSrc;
  });
}

export function ImagePicker({
  value,
  onChange,
  disabled,
  className,
  id,
  "aria-invalid": ariaInvalid,
  accept = "image/*",
  ratio,
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const displayUrl = getDisplayUrl(value);

  // State for crop dialog
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [originalBase64, setOriginalBase64] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<{
    base64: string;
    filename: string;
  } | null>(null);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;

        if (ratio) {
          // Check if image matches the required ratio
          const matchesRatio = await checkImageRatio(base64, ratio);

          if (!matchesRatio) {
            // Store original and open crop dialog
            setOriginalBase64(base64);
            setPendingImage({ base64, filename: file.name });
            setCropDialogOpen(true);
            return;
          }
        }

        // No ratio requirement or image matches - use directly
        const newImage: Image = {
          id: null,
          base64,
          url: null,
          originalFilename: file.name,
          resizedImages: null,
        };
        setOriginalBase64(base64);
        onChange?.(newImage);
      };
      reader.readAsDataURL(file);

      // Reset input so same file can be selected again
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [onChange, ratio]
  );

  const handleCropComplete = useCallback(
    (croppedBase64: string) => {
      if (!pendingImage) return;

      const newImage: Image = {
        id: null,
        base64: croppedBase64,
        url: null,
        originalFilename: pendingImage.filename,
        resizedImages: null,
      };
      onChange?.(newImage);
      setPendingImage(null);
    },
    [onChange, pendingImage]
  );

  const handleCropCancel = useCallback(() => {
    setPendingImage(null);
    setOriginalBase64(null);
  }, []);

  const handleEditCrop = useCallback(() => {
    if (originalBase64 && value?.originalFilename) {
      setPendingImage({
        base64: originalBase64,
        filename: value.originalFilename,
      });
      setCropDialogOpen(true);
    }
  }, [originalBase64, value]);

  const handleRemove = useCallback(() => {
    onChange?.(null);
    setOriginalBase64(null);
  }, [onChange]);

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  const canEditCrop = ratio && originalBase64 && value;

  return (
    <>
      <div
        id={id}
        aria-invalid={ariaInvalid}
        className={cn(
          "flex flex-col gap-2",
          disabled && "pointer-events-none cursor-not-allowed opacity-50",
          className
        )}
      >
        {/* Image preview area */}
        <div
          className={cn(
            "bg-muted relative flex w-24 items-center justify-center overflow-hidden rounded-md border",
            !ratio && "h-24",
            ariaInvalid && "border-destructive"
          )}
          style={ratio ? { aspectRatio: ratio } : undefined}
        >
          {displayUrl ? (
            <img
              src={displayUrl}
              alt={value?.originalFilename || "Selected image"}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon className="text-muted-foreground size-6" />
          )}
        </div>

        {/* File input row */}
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled}
            className="sr-only"
            tabIndex={-1}
          />
          <div
            className={cn(
              "border-input bg-background flex h-9 flex-1 items-center overflow-hidden rounded-md border text-sm shadow-xs",
              "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
              ariaInvalid && "border-destructive ring-destructive/20"
            )}
          >
            <button
              type="button"
              onClick={handleClick}
              disabled={disabled}
              className="bg-muted text-foreground h-full shrink-0 border-r px-3 text-sm font-medium hover:bg-muted/80"
            >
              Choose file
            </button>
            <span className="text-muted-foreground truncate px-3 text-sm">
              {value?.originalFilename || "No file chosen"}
            </span>
          </div>
          {canEditCrop && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleEditCrop}
              disabled={disabled}
              className="size-9 shrink-0"
              title="Edit crop"
            >
              <Crop className="size-4" />
            </Button>
          )}
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
      </div>

      {/* Crop Dialog */}
      {ratio && pendingImage && (
        <ImageCropDialog
          open={cropDialogOpen}
          onOpenChange={setCropDialogOpen}
          imageSrc={pendingImage.base64}
          ratio={ratio}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </>
  );
}