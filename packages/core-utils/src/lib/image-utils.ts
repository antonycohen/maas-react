import { Image, ReadResizedImage } from '@maas/core-api-models';

export function getImageUrl(
  image: Image | undefined | null,
  w: number,
  h: number,
  mode: 'cropped' | 'resized',
  fallback: string,
): string {
  if (!image) {
    return fallback;
  }

  const resizedImage = getResizedImage(image, {
    requestedWidth: w,
    requestedHeight: h,
    requestedMode: mode,
  });

  return resizedImage?.url || fallback;
}

export function getResizedImage(
  image: Image,
  params: {
    requestedWidth: number;
    requestedHeight: number;
    requestedMode: 'cropped' | 'resized';
  },
): ReadResizedImage | Image {
  if (!image.resizedImages?.length) {
    return image;
  }

  const { resizedImages } = image;
  const { requestedMode, requestedWidth, requestedHeight } = params;
  const imageIsCorrectSize = (image: ReadResizedImage): boolean => {
    const { mode, width, height } = image;

    return (
      mode === requestedMode &&
      width >= requestedWidth &&
      height >= requestedHeight
    );
  };

  return resizedImages.find(imageIsCorrectSize) || image;
}

export function getImgSrc(image: Image | undefined | null): string | undefined {
  const src = image?.base64 || image?.url;
  if (src === '.' || !src) {
    return undefined;
  }

  return src;
}
