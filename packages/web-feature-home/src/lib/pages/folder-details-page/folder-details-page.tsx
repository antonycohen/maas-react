import { useParams } from 'react-router-dom';

import { ContentFeed, mapIssueToFeedArticle, TitleAndDescriptionHero, useResizedImage } from '@maas/web-components';
import { cn } from '@maas/core-utils';
import { useGetFolderById } from '@maas/core-api';
import { useMemo } from 'react';

export const FolderDetailsPages = () => {
    const { id } = useParams();
    const { data: currentFolders } = useGetFolderById({
        id: id as string,
        fields: {
            id: null,
            name: null,
            description: null,
            cover: {
                fields: {
                    url: null,
                    resizedImages: null,
                },
            },
            articles: {
                fields: {
                    title: null,
                    id: null,
                    publishedAt: null,
                    cover: {
                        fields: {
                            url: null,
                            resizedImages: null,
                        },
                    },
                    author: {
                        fields: {
                            firstName: null,
                            lastName: null,
                        },
                    },
                },
            },
        },
    });
    const articles = useMemo(() => {
        return currentFolders?.articles?.map((a) => mapIssueToFeedArticle(a));
    }, [currentFolders]);
    const { resizedImage: bgImageUrl } = useResizedImage({ images: currentFolders?.cover?.resizedImages, width: 1280 });

    if (!currentFolders) return null; //TODO: Add loader or something else

    return (
        <div className="gap-tg-xl flex flex-col">
            <div
                className={cn(
                    'relative flex min-h-[530px] w-full items-center justify-center bg-cover bg-center bg-repeat',
                    {
                        'bg-gray-400': !bgImageUrl?.url,
                    }
                )}
                style={bgImageUrl ? { backgroundImage: `url(${bgImageUrl.url})` } : undefined}
            >
                <div className="absolute inset-0 bg-black/40"></div>
                <TitleAndDescriptionHero
                    titleClassName={'text-white z-10'}
                    descriptionClassName={'text-white z-10'}
                    title={currentFolders.name}
                    description={currentFolders.description || ''}
                />
            </div>
            {articles && articles?.length > 0 && (
                <div className="container mx-auto flex flex-col gap-5 px-5 pt-5 pb-10">
                    <h2 className="font-heading text-2xl leading-[40px] font-semibold tracking-[-0.85px] md:text-[34px]">
                        <span className="text-brand-primary">Tous les articles </span>&nbsp;
                        <span className="text-black">de ce dossier</span>
                    </h2>
                    <ContentFeed items={articles} />
                </div>
            )}
        </div>
    );
};
