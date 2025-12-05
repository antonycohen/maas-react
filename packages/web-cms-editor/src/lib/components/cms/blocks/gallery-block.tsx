import { FC, ReactElement } from 'react';

import { CarouselBlock } from './carousel-block';
import { CMSGalleryBlock } from '@maas/core-api-models';

type Images = CMSGalleryBlock['data']['images'];

const ResponsiveWrapper: FC<{ images: Images; children: ReactElement }> = ({
  images,
  children,
}) => (
  <>
    <div className="@md:hidden block">
      <CarouselBlock
        block={{
          id: '0',
          type: 'carousel',
          data: { images: images.slice(0, 2) },
        }}
      />
    </div>

    <div className="@md:block hidden">{children}</div>
  </>
);

const OneRowGallery: FC<{ images: Images }> = ({ images }) => (
  <ResponsiveWrapper images={images}>
    <div className="flex gap-6">
      {images?.map(({ url, caption }, index) => (
        <img
          key={index}
          src={url}
          alt={caption || ''}
          className="h-40 flex-1 rounded-lg object-cover"
        />
      ))}
    </div>
  </ResponsiveWrapper>
);

const TwoRowsGallery: FC<{ images: Images }> = ({ images }) => (
  <ResponsiveWrapper images={images}>
    <div className="flex flex-col gap-6">
      <OneRowGallery images={images.slice(0, 3)} />
      <OneRowGallery images={images.slice(3)} />
    </div>
  </ResponsiveWrapper>
);

type GalleryBlockProps = {
  block: CMSGalleryBlock;
  editMode?: boolean;
};

export function GalleryBlock(props: GalleryBlockProps) {
  const { block } = props;
  const { images } = block.data;
  const { length: numberOfImages } = images;

  const numberOfRows = numberOfImages <= 3 ? 1 : numberOfImages <= 5 ? 2 : null;

  switch (numberOfRows) {
    case 1:
      return <OneRowGallery images={images} />;
    case 2:
      return <TwoRowsGallery images={images} />;
    default:
      return <OneRowGallery images={images} />;
  }
}
