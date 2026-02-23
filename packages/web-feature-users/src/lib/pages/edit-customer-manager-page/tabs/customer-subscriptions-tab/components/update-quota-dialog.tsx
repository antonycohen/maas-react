import { useState } from 'react';
import { useUpdateQuotaUsage } from '@maas/core-api';
import { Quota } from '@maas/core-api-models';
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@maas/web-components';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customerId: string;
    quota: Quota;
};

export const UpdateQuotaDialog = ({ open, onOpenChange, customerId, quota }: Props) => {
    const { t } = useTranslation();
    const [amount, setAmount] = useState(1);
    const [operation, setOperation] = useState<'consume' | 'add'>('add');
    const [description, setDescription] = useState('');

    const { mutate: updateQuota, isPending } = useUpdateQuotaUsage({
        onSuccess: () => {
            toast.success(t('customers.quotas.usageUpdated'));
            onOpenChange(false);
            resetForm();
        },
        onError: () => {
            toast.error(t('customers.quotas.updateError'));
        },
    });

    const resetForm = () => {
        setAmount(1);
        setOperation('add');
        setDescription('');
    };

    const handleSubmit = () => {
        updateQuota({
            customerId,
            data: {
                featureKey: quota.featureKey ?? '',
                amount,
                operation,
                ...(description && { description }),
            },
        });
    };

    const featureLabel = quota.featureKey
        ? quota.featureKey.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        : quota.id;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('customers.quotas.updateUsage')}</DialogTitle>
                    <DialogDescription>{t('customers.quotas.updateUsageDescription')}</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    {/* Feature Key (readonly) */}
                    <div className="flex flex-col gap-2">
                        <Label>{t('customers.quotas.featureKey')}</Label>
                        <Input value={featureLabel} readOnly />
                    </div>

                    {/* Operation */}
                    <div className="flex flex-col gap-2">
                        <Label>{t('customers.quotas.operation')}</Label>
                        <Select value={operation} onValueChange={(v) => setOperation(v as 'consume' | 'add')}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="add">{t('customers.quotas.operationAdd')}</SelectItem>
                                <SelectItem value="consume">{t('customers.quotas.operationConsume')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Amount */}
                    <div className="flex flex-col gap-2">
                        <Label>{t('customers.quotas.amount')}</Label>
                        <Input
                            type="number"
                            min={1}
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <Label>{t('customers.quotas.description_field')}</Label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Manual adjustment"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                        {t('common.cancel')}
                    </Button>
                    <Button onClick={handleSubmit} disabled={isPending || amount <= 0} isLoading={isPending}>
                        {t('common.confirm')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
