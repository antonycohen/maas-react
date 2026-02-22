import { Issue } from '@maas/core-api-models';
import { useResizedImage } from '@maas/web-components';
import { Link } from 'react-router';
import { publicUrlBuilders } from '@maas/core-routes';

interface MagazineCardProps {
    magazine: Issue;
}

export function MagazineCard({ magazine }: MagazineCardProps) {
    const { resizedImage } = useResizedImage({
        images: magazine.cover?.resizedImages,
        width: 960,
    });

    const imageUrl = resizedImage?.url || magazine.cover?.downloadUrl || 'https://placehold.net/book-600x800.png';

    const date = magazine.publishedAt
        ? new Date(magazine.publishedAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : '';

    return (
        <Link to={publicUrlBuilders.magazine(magazine.id)} className="flex w-full flex-col items-start">
            {/* Cover Image */}
            <div className="relative mb-5 aspect-[270/380] w-full rounded-t-[4px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.06),3px_8px_20px_0px_rgba(0,0,0,0.1)]">
                <img
                    src={imageUrl}
                    alt={magazine.title}
                    className="absolute inset-0 h-full w-full rounded-t-[4px] object-cover"
                />
            </div>

            {/* Description */}
            <div className="flex w-full flex-col items-start gap-1">
                <h3 className="w-full truncate font-[family-name:var(--font-family-heading,'Barlow_Semi_Condensed',sans-serif)] text-[20px] leading-[24px] font-semibold tracking-[-0.3px] text-black">
                    {magazine.title}
                </h3>
                <p className="font-[family-name:var(--font-family-body,'Inter',sans-serif)] text-[13px] leading-[18px] font-normal text-black/70">
                    {date}
                </p>
            </div>
        </Link>
    );
}
