import { useGetDiffusionListEntries, useRemoveDiffusionListEntry } from '@maas/core-api';
import { DiffusionListEntry } from '@maas/core-api-models';
import { Button } from '@maas/web-components';
import { Collection } from '@maas/web-collection';
import { IconPlus } from '@tabler/icons-react';
import { useTranslation } from '@maas/core-translations';
import { toast } from 'sonner';
import { useEntriesColumns } from '../hooks/use-entries-columns';

interface Props {
    diffusionListId: string;
    isDraft: boolean;
    onAddEntry: () => void;
}

export const EntriesTable = ({ diffusionListId, isDraft, onAddEntry }: Props) => {
    const { t } = useTranslation();

    const removeMutation = useRemoveDiffusionListEntry({
        onSuccess: () => {
            toast.success(t('diffusionLists.entryRemoved'));
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleRemove = (entry: DiffusionListEntry) => {
        if (window.confirm(t('diffusionLists.removeEntryPrompt'))) {
            removeMutation.mutate({ diffusionListId, entryId: entry.id });
        }
    };

    const columns = useEntriesColumns({
        isDraft,
        onRemove: handleRemove,
        isRemoving: removeMutation.isPending,
    });

    return (
        <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t('diffusionLists.entries')}</h2>
                {isDraft && (
                    <Button variant="outline" size="sm" onClick={onAddEntry}>
                        <IconPlus className="mr-1.5 h-4 w-4" />
                        {t('diffusionLists.addEntry')}
                    </Button>
                )}
            </div>

            <Collection
                columns={columns}
                useQueryFn={useGetDiffusionListEntries}
                staticParams={{ diffusionListId }}
                filtersConfiguration={{
                    textFilter: {
                        placeholder: t('diffusionLists.searchEntries'),
                        queryParamName: 'query',
                    },
                    facetedFilters: [
                        {
                            columnId: 'isManual',
                            queryParamName: 'isManual',
                            title: t('field.manual'),
                            options: [
                                { label: t('common.yes'), value: 'true' },
                                { label: t('common.no'), value: 'false' },
                            ],
                        },
                    ],
                }}
                queryFields={{
                    id: null,
                    firstName: null,
                    lastName: null,
                    email: null,
                    phone: null,
                    addressLine1: null,
                    addressCity: null,
                    addressPostalCode: null,
                    addressCountry: null,
                    isManual: null,
                }}
            />
        </div>
    );
};
