import { FolderCard, FolderCardSkeleton, TitleAndDescriptionHero } from '@maas/web-components';
import { useGetFolders } from '@maas/core-api';
import { useTranslation } from '@maas/core-translations';
import { publicUrlBuilders } from '@maas/core-routes';
import { SEO } from '@maas/core-seo';

export const FoldersPage = () => {
    const { t } = useTranslation();
    const { data: response } = useGetFolders({
        limit: 10,
        offset: 0,
        fields: {
            id: null,
            slug: null,
            name: null,
            description: null,
            type: null,
            articleCount: null,
            cover: {
                fields: {
                    resizedImages: null,
                },
            },
            articles: {
                fields: {
                    title: null,
                    id: null,
                    slug: null,
                    cover: {
                        fields: {
                            resizedImages: null,
                        },
                    },
                    publishedAt: null,
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

    return (
        <div className="gap-tg-xl flex flex-col px-5 xl:px-0">
            <SEO title={t('home.foldersTitle')} description={t('home.foldersDescription')} />
            <div className="container mx-auto">
                <TitleAndDescriptionHero title={t('home.foldersTitle')} description={t('home.foldersDescription')} />
            </div>
            <div className="gap-tg-lg py-tg-xl container mx-auto flex flex-col pb-8">
                {!response
                    ? Array.from({ length: 3 }).map((_, i) => <FolderCardSkeleton key={i} />)
                    : response.data?.map((folder) => (
                          <FolderCard
                              key={`folder-${folder.id}`}
                              folder={folder}
                              link={publicUrlBuilders.folder(folder.slug ?? folder.id)}
                          />
                      ))}
            </div>
        </div>
    );
};
