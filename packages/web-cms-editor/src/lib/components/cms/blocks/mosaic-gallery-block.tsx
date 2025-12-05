import { CMSMosaicGalleryBlock } from '@maas/core-api-models';
import { cn, getImgSrc } from '@maas/core-utils';

export const MosaicGalleryBlock = ({
  block,
}: {
  block: CMSMosaicGalleryBlock;
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {block.data.elements.map((element, index) => {
        return (
          <div
            key={index}
            className={cn(`relative col-span-3`, {
              "lg:col-span-1": index % 4 === 0 || index % 4 === 3,
              "lg:col-span-2": index % 4 === 1 || index % 4 === 2,
            })}
          >
            <img
              src={getImgSrc(element.image)}
              alt="gallery"
              className="h-full max-h-[211px] w-full object-cover"
              style={{
                aspectRatio:
                  index % 4 === 0 || index % 4 === 3 ? "3 / 1" : "1 / 1",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
