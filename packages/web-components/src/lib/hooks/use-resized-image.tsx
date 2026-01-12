import { ReadResizedImage } from '@maas/core-api-models';
import { useMemo } from 'react';

export const useResizedImage = ({
  images,
  width = 640,
}: {
  images?: ReadResizedImage[] | null | undefined;
  width: number;
}) => {
  const resizedImage = useMemo(
    () => images?.find((image) => image.width === width),
    [images, width],
  );
  return { resizedImage: resizedImage || images?.[0] || null };
};
