import { useMemo, useState } from 'react';
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
    Input,
    AsyncCombobox,
    type AsyncComboboxOption,
} from '@maas/web-components';
import {
    useGetPermissionAliases,
    useCreatePermissionAlias,
    useUpdatePermissionAlias,
    useGetAvailablePermissions,
} from '@maas/core-api';
import { useTranslation } from '@maas/core-translations';
import { toast } from 'sonner';
import { IconChevronDown, IconPlus, IconX, IconPencil, IconCheck } from '@tabler/icons-react';
import { Loader2 } from 'lucide-react';
import { PermissionAlias } from '@maas/core-api';

const AliasPermissionPicker = ({
    permissions,
    onChange,
    availablePermissions,
    isLoadingAvailable,
}: {
    permissions: string[];
    onChange: (permissions: string[]) => void;
    availablePermissions: string[];
    isLoadingAvailable: boolean;
}) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');

    const options = useMemo(() => {
        const all = availablePermissions.filter((p) => !permissions.includes(p)).map((p) => ({ id: p, label: p }));
        if (!search) return all;
        const lower = search.toLowerCase();
        return all.filter((o) => o.label.toLowerCase().includes(lower));
    }, [availablePermissions, permissions, search]);

    const handleAdd = (option: AsyncComboboxOption | null) => {
        if (option && !permissions.includes(option.id)) {
            onChange([...permissions, option.id]);
        }
    };

    const handleRemove = (permission: string) => {
        onChange(permissions.filter((p) => p !== permission));
    };

    return (
        <div className="space-y-2">
            <AsyncCombobox
                value={null}
                onChange={handleAdd}
                onSearchChange={setSearch}
                options={options}
                isLoading={isLoadingAvailable}
                placeholder={t('permissions.addPermission')}
                searchPlaceholder={t('common.search')}
                emptyMessage={t('permissions.noPermissionsAvailable')}
            />
            {permissions.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {permissions.map((p) => (
                        <Badge key={p} variant="secondary" className="gap-1 pr-1">
                            <span className="text-xs">{p}</span>
                            <button
                                type="button"
                                onClick={() => handleRemove(p)}
                                className="hover:bg-muted rounded-full p-0.5"
                            >
                                <IconX className="size-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
};

const AliasItem = ({
    alias,
    availablePermissions,
    isLoadingAvailable,
}: {
    alias: PermissionAlias;
    availablePermissions: string[];
    isLoadingAvailable: boolean;
}) => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [editedPermissions, setEditedPermissions] = useState<string[]>(alias.permissions);

    const updateAlias = useUpdatePermissionAlias({
        onSuccess: () => {
            toast.success(t('permissions.aliasUpdated'));
            setIsEditing(false);
        },
        onError: (error) => {
            toast.error(error.message || t('permissions.aliasUpdateError'));
        },
    });

    const handleStartEdit = () => {
        setEditedPermissions(alias.permissions);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditedPermissions(alias.permissions);
        setIsEditing(false);
    };

    const handleSave = () => {
        updateAlias.mutate({ id: alias.id, permissions: editedPermissions });
    };

    return (
        <div className="border-b py-4 last:border-b-0">
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{alias.id}</span>
                <div className="flex items-center gap-1">
                    {isEditing ? (
                        <>
                            <Button variant="ghost" size="sm" onClick={handleCancel}>
                                {t('common.cancel')}
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSave}
                                disabled={editedPermissions.length === 0}
                                isLoading={updateAlias.isPending}
                            >
                                <IconCheck className="mr-1 size-3.5" />
                                {t('common.save')}
                            </Button>
                        </>
                    ) : (
                        <Button variant="ghost" size="sm" onClick={handleStartEdit}>
                            <IconPencil className="mr-1 size-3.5" />
                            {t('common.edit')}
                        </Button>
                    )}
                </div>
            </div>
            {isEditing ? (
                <div className="mt-3">
                    <AliasPermissionPicker
                        permissions={editedPermissions}
                        onChange={setEditedPermissions}
                        availablePermissions={availablePermissions}
                        isLoadingAvailable={isLoadingAvailable}
                    />
                </div>
            ) : (
                <div className="mt-2 flex flex-wrap gap-1">
                    {alias.permissions.map((p) => (
                        <Badge key={p} variant="outline" className="text-xs">
                            {p}
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
};

export const PermissionAliasesSection = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [aliasName, setAliasName] = useState('');
    const [newPermissions, setNewPermissions] = useState<string[]>([]);

    const { data: aliases, isLoading: isLoadingAliases } = useGetPermissionAliases({ enabled: isOpen });
    const { data: availableData, isLoading: isLoadingAvailable } = useGetAvailablePermissions({ enabled: isOpen });
    const availablePermissions = availableData?.permissions ?? [];

    const createAlias = useCreatePermissionAlias({
        onSuccess: () => {
            toast.success(t('permissions.aliasCreated'));
            setAliasName('');
            setNewPermissions([]);
        },
        onError: (error) => {
            toast.error(error.message || t('permissions.aliasCreateError'));
        },
    });

    const handleCreate = () => {
        if (!aliasName.trim() || newPermissions.length === 0) return;
        createAlias.mutate({ id: aliasName.trim(), permissions: newPermissions });
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
                <button
                    type="button"
                    className="bg-muted/50 hover:bg-muted flex w-full items-center justify-between rounded-lg px-4 py-3 transition-colors"
                >
                    <h2 className="text-base font-semibold">{t('permissions.aliasesTitle')}</h2>
                    <IconChevronDown
                        className={`text-muted-foreground size-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="mt-4 space-y-4">
                    {/* Create Alias */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">{t('permissions.createAlias')}</CardTitle>
                            <CardDescription>{t('permissions.createAliasDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Input
                                placeholder={t('permissions.aliasNamePlaceholder')}
                                value={aliasName}
                                onChange={(e) => setAliasName(e.target.value)}
                            />
                            <AliasPermissionPicker
                                permissions={newPermissions}
                                onChange={setNewPermissions}
                                availablePermissions={availablePermissions}
                                isLoadingAvailable={isLoadingAvailable}
                            />
                            <Button
                                onClick={handleCreate}
                                disabled={!aliasName.trim() || newPermissions.length === 0}
                                isLoading={createAlias.isPending}
                                size="sm"
                            >
                                <IconPlus className="mr-1 size-4" />
                                {t('permissions.createAlias')}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Existing Aliases */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">{t('permissions.existingAliases')}</CardTitle>
                            <CardDescription>{t('permissions.existingAliasesDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoadingAliases ? (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 className="text-muted-foreground size-5 animate-spin" />
                                </div>
                            ) : !aliases || aliases.length === 0 ? (
                                <p className="text-muted-foreground py-4 text-center text-sm">
                                    {t('permissions.noAliases')}
                                </p>
                            ) : (
                                <div>
                                    {aliases.map((alias) => (
                                        <AliasItem
                                            key={alias.id}
                                            alias={alias}
                                            availablePermissions={availablePermissions}
                                            isLoadingAvailable={isLoadingAvailable}
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};
