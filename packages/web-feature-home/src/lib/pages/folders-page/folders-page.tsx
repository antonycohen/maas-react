import { FolderCard, TitleAndDescriptionHero } from '@maas/web-components';
import { useGetFolders } from '@maas/core-api';
import { useTranslation } from '@maas/core-translations';

export const FoldersPage = () => {
    const { t } = useTranslation();
    const { data: response } = useGetFolders({
        limit: 10,
        offset: 0,
        fields: {
            id: null,
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
                    cover: {
                        fields: {
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

    return (
        <div className="gap-tg-xl flex flex-col px-5 xl:px-0">
            <div className="container mx-auto">
                <TitleAndDescriptionHero title={t('home.foldersTitle')} description={t('home.foldersDescription')} />
            </div>
            <div className="gap-tg-lg py-tg-xl container mx-auto flex flex-col">
                {response?.data?.map((folder) => (
                    <FolderCard key={`folder-${folder.id}`} folder={folder} link={`/dossiers/${folder.id}`} />
                ))}
            </div>
        </div>
    );
};
