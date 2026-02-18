import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    Button,
    Input,
} from '@maas/web-components';
import { useGetAvailableCustomers, useAddDiffusionListEntry } from '@maas/core-api';
import { ReadCustomer } from '@maas/core-api-models';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';
import { IconLoader2, IconPlus, IconSearch } from '@tabler/icons-react';
import { useState, useEffect, useRef } from 'react';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    diffusionListId: string;
}

export const AddEntryModal = ({ open, onOpenChange, diffusionListId }: Props) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        debounceTimerRef.current = setTimeout(() => setDebouncedTerm(searchTerm), 300);
        return () => {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        };
    }, [searchTerm]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const { data: customersData, isLoading: isSearching } = useGetAvailableCustomers(
        {
            diffusionListId,
            query: debouncedTerm,
            offset: 0,
            limit: 20,
        },
        { enabled: open && debouncedTerm.length >= 2 }
    );

    const addMutation = useAddDiffusionListEntry({
        onSuccess: () => {
            toast.success(t('diffusionLists.entryAdded'));
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleAddCustomer = (customer: ReadCustomer) => {
        const nameParts = (customer.name ?? '').split(' ');
        const firstName = nameParts[0] ?? '';
        const lastName = nameParts.slice(1).join(' ') || '';

        addMutation.mutate({
            diffusionListId,
            data: {
                firstName: firstName || undefined,
                lastName: lastName || undefined,
                email: customer.email ?? undefined,
                phone: customer.phone ?? undefined,
                addressLine1: customer.addressLine1 ?? undefined,
                addressCity: customer.addressCity ?? undefined,
                addressPostalCode: customer.addressPostalCode ?? undefined,
                addressCountry: customer.addressCountry ?? undefined,
            },
        });
    };

    const customers = customersData?.data ?? [];

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) {
                    setSearchTerm('');
                    setDebouncedTerm('');
                }
                onOpenChange(value);
            }}
        >
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{t('diffusionLists.addEntryTitle')}</DialogTitle>
                    <DialogDescription>{t('diffusionLists.addEntryDescription')}</DialogDescription>
                </DialogHeader>

                <div className="relative">
                    <IconSearch className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder={t('diffusionLists.searchCustomers')}
                        className="pl-9"
                        autoFocus
                    />
                </div>

                <div className="max-h-[350px] overflow-y-auto">
                    {isSearching ? (
                        <div className="flex items-center justify-center py-8">
                            <IconLoader2 className="h-5 w-5 animate-spin" />
                        </div>
                    ) : debouncedTerm.length < 2 ? (
                        <p className="text-muted-foreground py-8 text-center text-sm">
                            {t('diffusionLists.searchCustomers')}
                        </p>
                    ) : customers.length === 0 ? (
                        <p className="text-muted-foreground py-8 text-center text-sm">
                            {t('diffusionLists.noCustomersFound')}
                        </p>
                    ) : (
                        <div className="space-y-1">
                            {customers.map((customer) => (
                                <div
                                    key={customer.id}
                                    className="hover:bg-muted flex items-center justify-between rounded-md px-3 py-2"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">{customer.name ?? '-'}</p>
                                        <p className="text-muted-foreground truncate text-xs">
                                            {[customer.email, customer.phone].filter(Boolean).join(' · ')}
                                        </p>
                                        {customer.addressCity && (
                                            <p className="text-muted-foreground truncate text-xs">
                                                {[
                                                    customer.addressCity,
                                                    customer.addressPostalCode,
                                                    customer.addressCountry,
                                                ]
                                                    .filter(Boolean)
                                                    .join(', ')}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleAddCustomer(customer)}
                                        disabled={addMutation.isPending}
                                    >
                                        <IconPlus className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
