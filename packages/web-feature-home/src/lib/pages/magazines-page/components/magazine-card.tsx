import { Issue } from '@maas/core-api-models';
import { useResizedImage } from '@maas/web-components';
import { Link } from 'react-router-dom';

interface MagazineCardProps {
  magazine: Issue;
}

export function MagazineCard({ magazine }: MagazineCardProps) {
  const { resizedImage } = useResizedImage({
    images: magazine.cover?.resizedImages,
    width: 640,
  });

  const imageUrl = resizedImage?.url || magazine.cover?.downloadUrl || '';

  const date = magazine.publishedAt
    ? new Date(magazine.publishedAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <Link
      to={`/magazines/${magazine.id}`}
      className="flex flex-col items-start w-full"
    >
      {/* Cover Image */}
      <div className="relative w-full aspect-[270/380] rounded-t-[4px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.06),3px_8px_20px_0px_rgba(0,0,0,0.1)] mb-5">
        <img
          src={imageUrl}
          alt={magazine.title}
          className="absolute inset-0 w-full h-full object-contain rounded-t-[4px]"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1 items-start w-full">
        <h3 className="font-[family-name:var(--font-family-heading,'Barlow_Semi_Condensed',sans-serif)] font-semibold text-[20px] leading-[24px] tracking-[-0.3px] text-black truncate w-full">
          {magazine.title}
        </h3>
        <p className="font-[family-name:var(--font-family-body,'Inter',sans-serif)] font-normal text-[13px] leading-[18px] text-black/70">
          {date}
        </p>
      </div>
    </Link>
  );
}
