"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";

export type ImageCropDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  ratio: number;
  onCropComplete: (croppedBase64: string) => void;
  onCancel?: () => void;
};

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

async function getCroppedImg(
  image: HTMLImageElement,
  crop: Crop
): Promise<string> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const pixelCrop = {
    x: (crop.x / 100) * image.width * scaleX,
    y: (crop.y / 100) * image.height * scaleY,
    width: (crop.width / 100) * image.width * scaleX,
    height: (crop.height / 100) * image.height * scaleY,
  };

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/jpeg", 0.95);
}

export function ImageCropDialog({
  open,
  onOpenChange,
  imageSrc,
  ratio,
  onCropComplete,
  onCancel,
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, ratio));
    },
    [ratio]
  );

  const handleCropComplete = useCallback(async () => {
    if (!imgRef.current || !crop) return;

    try {
      const croppedBase64 = await getCroppedImg(imgRef.current, crop);
      onCropComplete(croppedBase64);
      onOpenChange(false);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  }, [crop, onCropComplete, onOpenChange]);

  const handleCancel = useCallback(() => {
    onCancel?.();
    onOpenChange(false);
  }, [onCancel, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogDescription>
            Adjust the crop area to match the required aspect ratio ({ratio}:1)
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center overflow-hidden rounded-md bg-muted p-4">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            aspect={ratio}
            className="max-h-[60vh]"
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop preview"
              onLoad={onImageLoad}
              className="max-h-[60vh] object-contain"
            />
          </ReactCrop>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleCropComplete}>
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}