import { useGetFolderById } from '@maas/core-api';

type UseFolderPreviewParams = {
    selectedFolderId: string | null;
};

export const useFolderPreview = ({ selectedFolderId }: UseFolderPreviewParams) => {
    const { data: selectedFolder, isLoading: isLoadingFolder } = useGetFolderById(
        {
            id: selectedFolderId ?? '',
            fields: {
                id: null,
                slug: null,
                name: null,
                description: null,
                cover: null,
                isPublished: null,
                articleCount: null,
            },
        },
        {
            enabled: !!selectedFolderId,
        }
    );

    return {
        selectedFolder: selectedFolder ?? null,
        isLoadingFolder: isLoadingFolder && !!selectedFolderId,
    };
};
