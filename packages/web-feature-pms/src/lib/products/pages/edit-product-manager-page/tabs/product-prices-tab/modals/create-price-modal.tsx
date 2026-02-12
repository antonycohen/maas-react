import { useForm } from 'react-hook-form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    Button,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@maas/web-components';
import { useCreatePrice } from '@maas/core-api';
import { CreatePrice, PriceInterval, PriceUsageType, Price } from '@maas/core-api-models';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';

interface CreatePriceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productId: string;
    onSuccess: (price: Price) => void;
}

export const CreatePriceModal = ({ open, onOpenChange, productId, onSuccess }: CreatePriceModalProps) => {
    const { t } = useTranslation();

    const form = useForm<CreatePrice>({
        defaultValues: {
            currency: 'usd',
            unitAmountInCents: 0,
            active: true,
            lookupKey: '',
            recurringInterval: 'month',
            recurringIntervalCount: 1,
            recurringUsageType: 'licensed',
            product: { id: productId },
        },
    });

    const createMutation = useCreatePrice({
        onSuccess: (data) => {
            toast.success(t('prices.createdSuccess'));
            onSuccess(data);
            onOpenChange(false);
            form.reset();
        },
        onError: () => {
            toast.error(t('prices.createFailed'));
        },
    });

    const onSubmit = (data: CreatePrice) => {
        createMutation.mutate({
            ...data,
            product: { id: productId },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('prices.createNewPrice')}</DialogTitle>
                    <DialogDescription>{t('prices.createDescription')}</DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="unitAmountInCents">{t('prices.amountInCents')}</Label>
                            <Input
                                id="unitAmountInCents"
                                type="number"
                                placeholder="1000"
                                {...form.register('unitAmountInCents', { valueAsNumber: true })}
                            />
                            {form.formState.errors.unitAmountInCents && (
                                <p className="text-destructive text-sm">
                                    {form.formState.errors.unitAmountInCents.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currency">{t('prices.currency')}</Label>
                            <Select
                                value={form.watch('currency') ?? 'usd'}
                                onValueChange={(value) => form.setValue('currency', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('prices.selectCurrency')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="usd">USD</SelectItem>
                                    <SelectItem value="eur">EUR</SelectItem>
                                    <SelectItem value="gbp">GBP</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lookupKey">{t('prices.lookupKeyOptional')}</Label>
                        <Input
                            id="lookupKey"
                            placeholder={t('prices.lookupKeyPlaceholder')}
                            {...form.register('lookupKey')}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="recurringInterval">{t('prices.billingInterval')}</Label>
                            <Select
                                value={form.watch('recurringInterval') ?? 'month'}
                                onValueChange={(value) => form.setValue('recurringInterval', value as PriceInterval)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('prices.selectInterval')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="day">{t('prices.daily')}</SelectItem>
                                    <SelectItem value="week">{t('prices.weekly')}</SelectItem>
                                    <SelectItem value="month">{t('prices.monthly')}</SelectItem>
                                    <SelectItem value="year">{t('prices.yearly')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="recurringIntervalCount">{t('prices.intervalCount')}</Label>
                            <Input
                                id="recurringIntervalCount"
                                type="number"
                                min={1}
                                {...form.register('recurringIntervalCount', { valueAsNumber: true })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="recurringUsageType">{t('prices.usageType')}</Label>
                        <Select
                            value={form.watch('recurringUsageType') ?? 'licensed'}
                            onValueChange={(value) => form.setValue('recurringUsageType', value as PriceUsageType)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('prices.selectUsageType')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="licensed">{t('prices.licensed')}</SelectItem>
                                <SelectItem value="metered">{t('prices.metered')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" disabled={createMutation.isPending}>
                            {createMutation.isPending ? t('prices.creating') : t('prices.createPrice')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
