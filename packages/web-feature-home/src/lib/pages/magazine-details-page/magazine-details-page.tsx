import {
    ContentFeed,
    FolderCard,
    FolderCardSkeleton,
    MagazineHighlightsHero,
    mapIssueToFeedArticle,
    NotFoundPage,
} from '@maas/web-components';
import { ApiError, useGetIssueById } from '@maas/core-api';
import { useParams } from 'react-router-dom';
import { useTranslation } from '@maas/core-translations';
import { useMemo } from 'react';

export const MagazineDetailsPage = () => {
    const issueId = useParams<{ id: string }>().id;
    const { t } = useTranslation();
    const { data: magazines, error } = useGetIssueById(
        {
            id: issueId as string,
            fields: {
                id: null,
                description: null,
                title: null,
                cover: null,
                publishedAt: null,
                folders: {
                    fields: {
                        id: null,
                        name: null,
                        description: null,
                        type: null,
                        articleCount: null,
                        cover: null,
                        isDefault: null,
                        articles: {
                            fields: {
                                title: null,
                                id: null,
                                cover: null,
                                publishedAt: null,
                                categories: null,
                                author: {
                                    fields: {
                                        firstName: null,
                                        lastName: null,
                                    },
                                },
                            },
                        },
                    },
                },
                brand: {
                    fields: {
                        issueConfiguration: {
                            fields: {
                                color: null,
                            },
                        },
                    },
                },
            },
        },
        {
            retry: (_, error) => !(error instanceof ApiError && error.code === 1001),
        }
    );

    const issuesFolders = useMemo(() => {
        return magazines?.folders?.filter((folder) => folder.isDefault === false);
    }, [magazines]);

    const orphanArticles = useMemo(() => {
        return (
            magazines?.folders
                ?.find((folder) => folder.isDefault === true)
                ?.articles?.map((a) => mapIssueToFeedArticle(a)) || []
        );
    }, [magazines]);
    if (error instanceof ApiError && error.code === 1001) return <NotFoundPage />;

    return (
        <div className="gap-tg-xl flex flex-col">
            {/* Magazine Hero Section */}
            <div
                className="bg-brand-primary"
                style={{
                    backgroundColor: magazines?.brand?.issueConfiguration?.color as string,
                }}
            >
                <div className="container mx-auto">
                    <MagazineHighlightsHero issue={magazines} link={`/magazines/${magazines?.id}`} />
                </div>
            </div>
            <div className="gap-tg-lg container mx-auto flex flex-col p-5">
                <h2 className="font-heading text-2xl leading-[40px] font-semibold tracking-[-0.85px] md:text-[34px]">
                    <span className="text-brand-primary">{'Tous les dossiers '}</span>
                    <span className="text-black">{'de ce numéro'}</span>
                </h2>
                {!magazines
                    ? Array.from({ length: 3 }).map((_, i) => <FolderCardSkeleton key={i} />)
                    : issuesFolders?.map((folder) => (
                          <FolderCard key={folder.id} folder={folder} link={`/dossiers/${folder.id}`} />
                      ))}
            </div>
            <div className="gap-tg-lg container mx-auto flex flex-col p-5 pb-10">
                <h2 className="font-heading text-2xl leading-[40px] font-semibold tracking-[-0.85px] md:text-[34px]">
                    <span className="text-brand-primary">{'Tous les articles '}</span>
                    <span className="text-black">{'de ce numéro'}</span>
                </h2>
                {magazines && <ContentFeed items={orphanArticles} />}
            </div>
        </div>
    );
};
