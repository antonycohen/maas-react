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

interface CreatePriceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productId: string;
    onSuccess: (price: Price) => void;
}

export const CreatePriceModal = ({ open, onOpenChange, productId, onSuccess }: CreatePriceModalProps) => {
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
            toast.success('Price created successfully');
            onSuccess(data);
            onOpenChange(false);
            form.reset();
        },
        onError: (error) => {
            toast.error('Failed to create price');
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
                    <DialogTitle>Create New Price</DialogTitle>
                    <DialogDescription>Add a new pricing option for this product.</DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="unitAmountInCents">Amount (in cents)</Label>
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
                            <Label htmlFor="currency">Currency</Label>
                            <Select
                                value={form.watch('currency') ?? 'usd'}
                                onValueChange={(value) => form.setValue('currency', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
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
                        <Label htmlFor="lookupKey">Lookup Key (optional)</Label>
                        <Input id="lookupKey" placeholder="e.g., monthly_basic" {...form.register('lookupKey')} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="recurringInterval">Billing Interval</Label>
                            <Select
                                value={form.watch('recurringInterval') ?? 'month'}
                                onValueChange={(value) => form.setValue('recurringInterval', value as PriceInterval)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select interval" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="day">Daily</SelectItem>
                                    <SelectItem value="week">Weekly</SelectItem>
                                    <SelectItem value="month">Monthly</SelectItem>
                                    <SelectItem value="year">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="recurringIntervalCount">Interval Count</Label>
                            <Input
                                id="recurringIntervalCount"
                                type="number"
                                min={1}
                                {...form.register('recurringIntervalCount', { valueAsNumber: true })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="recurringUsageType">Usage Type</Label>
                        <Select
                            value={form.watch('recurringUsageType') ?? 'licensed'}
                            onValueChange={(value) => form.setValue('recurringUsageType', value as PriceUsageType)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select usage type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="licensed">Licensed</SelectItem>
                                <SelectItem value="metered">Metered</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createMutation.isPending}>
                            {createMutation.isPending ? 'Creating...' : 'Create Price'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
