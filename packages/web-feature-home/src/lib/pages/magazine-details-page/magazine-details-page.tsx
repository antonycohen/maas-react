import { FolderCard, FolderCardSkeleton, MagazineHighlightsHero, NotFoundPage } from '@maas/web-components';
import { ApiError, useGetIssueById } from '@maas/core-api';
import { useParams } from 'react-router-dom';

export const MagazineDetailsPage = () => {
    const issueId = useParams<{ id: string }>().id;
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
                        articles: {
                            fields: {
                                title: null,
                                id: null,
                                cover: null,
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
                {!magazines
                    ? Array.from({ length: 3 }).map((_, i) => <FolderCardSkeleton key={i} />)
                    : magazines.folders?.map((folder) => (
                          <FolderCard key={folder.id} folder={folder} link={`/dossiers/${folder.id}`} />
                      ))}
            </div>
        </div>
    );
};
