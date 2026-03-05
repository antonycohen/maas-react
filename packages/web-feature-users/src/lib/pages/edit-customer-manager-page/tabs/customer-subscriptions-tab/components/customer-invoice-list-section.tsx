import { useState } from 'react';
import { Invoice } from '@maas/core-api-models';
import { useDownloadInvoice, usePayInvoice, useSendInvoice, useSyncInvoice } from '@maas/core-api';
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@maas/web-components';
import { Download } from 'lucide-react';
import {
    IconCreditCardPay,
    IconDotsVertical,
    IconExternalLink,
    IconMailForward,
    IconRefresh,
} from '@tabler/icons-react';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';
import { INVOICE_STATUS_STYLES, INVOICE_STATUS_TRANSLATION_KEYS } from '../../../../../constants/status-styles';

type PaymentMethod = 'card' | 'cheque' | 'virement' | 'prelevement' | 'bon';

const PAYMENT_METHODS: PaymentMethod[] = ['card', 'cheque', 'virement', 'prelevement', 'bon'];

const PAYMENT_METHOD_TRANSLATION_KEYS: Record<PaymentMethod, string> = {
    card: 'customers.subscriptions.paymentMethodCard',
    cheque: 'customers.subscriptions.paymentMethodCheque',
    virement: 'customers.subscriptions.paymentMethodVirement',
    prelevement: 'customers.subscriptions.paymentMethodPrelevement',
    bon: 'customers.subscriptions.paymentMethodBon',
};

const numberFormatCache = new Map<string, Intl.NumberFormat>();
const getCurrencyFormatter = (locale: string, currency: string): Intl.NumberFormat => {
    const key = `${locale}-${currency}`;
    const cached = numberFormatCache.get(key);
    if (cached) return cached;
    const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency });
    numberFormatCache.set(key, formatter);
    return formatter;
};

const formatAmount = (amountInCents: number, currency: string | null): string => {
    const amount = amountInCents / 100;
    const currencyCode = currency?.toUpperCase() ?? 'EUR';
    return getCurrencyFormatter('fr-FR', currencyCode).format(amount);
};

const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '\u2014';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

type Props = {
    invoices: Invoice[] | undefined;
    isLoading: boolean;
    manualSubscriptionIds?: Set<string>;
    canceledSubscriptionIds?: Set<string>;
};

export const CustomerInvoiceListSection = ({
    invoices,
    isLoading,
    manualSubscriptionIds,
    canceledSubscriptionIds,
}: Props) => {
    const { t } = useTranslation();
    const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cheque');
    const [payReference, setPayReference] = useState('');
    const [payReferenceError, setPayReferenceError] = useState(false);

    const { mutate: download, isPending: isDownloading } = useDownloadInvoice({
        onSuccess: (data) => {
            if (data.invoicePdf) {
                window.location.assign(data.invoicePdf);
            }
        },
        onError: () => {
            toast.error(t('customers.invoices.downloadError'));
        },
    });

    const { mutate: syncInvoice, isPending: isSyncing } = useSyncInvoice({
        onSuccess: () => {
            toast.success(t('customers.invoices.syncSuccess'));
        },
        onError: () => {
            toast.error(t('customers.invoices.syncError'));
        },
    });

    const { mutate: payInvoice, isPending: isPaying } = usePayInvoice({
        onSuccess: () => {
            toast.success(t('customers.invoices.paySuccess'));
            setPayingInvoice(null);
            setPaymentMethod('cheque');
            setPayReference('');
            setPayReferenceError(false);
        },
        onError: () => {
            toast.error(t('customers.invoices.payError'));
            setPayingInvoice(null);
            setPaymentMethod('cheque');
            setPayReference('');
            setPayReferenceError(false);
        },
    });

    const { mutate: sendInvoice, isPending: isSending } = useSendInvoice({
        onSuccess: () => {
            toast.success(t('customers.invoices.sendSuccess'));
        },
        onError: () => {
            toast.error(t('customers.invoices.sendError'));
        },
    });

    const handlePay = () => {
        if (!payingInvoice) return;

        if (!payReference.trim()) {
            setPayReferenceError(true);
            return;
        }

        payInvoice({
            invoiceId: payingInvoice.id,
            paymentMethod,
            paymentReference: payReference.trim(),
        });
    };

    if (isLoading) {
        return (
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">{t('customers.invoices.title')}</CardTitle>
                    <CardDescription>{t('common.loading')}</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (!invoices || invoices.length === 0) {
        return (
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">{t('customers.invoices.title')}</CardTitle>
                    <CardDescription>{t('customers.invoices.noInvoices')}</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="rounded-2xl">
            <CardHeader>
                <CardTitle className="text-xl">{t('customers.invoices.title')}</CardTitle>
                <CardDescription>{t('customers.invoices.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('customers.invoices.date')}</TableHead>
                            <TableHead>{t('customers.invoices.number')}</TableHead>
                            <TableHead>{t('customers.invoices.amount')}</TableHead>
                            <TableHead>{t('customers.invoices.periodStart')}</TableHead>
                            <TableHead>{t('customers.invoices.periodEnd')}</TableHead>
                            <TableHead>{t('field.status')}</TableHead>
                            <TableHead>{t('field.comments')}</TableHead>
                            <TableHead className="text-right">{t('field.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => {
                            const status = invoice.status ?? 'draft';
                            const statusStyle = INVOICE_STATUS_STYLES[status] ?? INVOICE_STATUS_STYLES.draft;
                            const statusKey = INVOICE_STATUS_TRANSLATION_KEYS[status];
                            const statusLabel = statusKey ? t(statusKey) : status;
                            const isManual = manualSubscriptionIds?.has(invoice.subscriptionId ?? '');
                            const isCanceled = canceledSubscriptionIds?.has(invoice.subscriptionId ?? '');
                            const canPay =
                                isManual && !isCanceled && invoice.status !== 'paid' && invoice.status !== 'void';
                            const invoiceMetadata = invoice.metadata as Record<string, unknown> | null;
                            const isEarlyRenewal = invoiceMetadata?.type === 'early_renewal';

                            return (
                                <TableRow key={invoice.id}>
                                    <TableCell className="text-sm text-gray-600">
                                        {formatDate(invoice.createdAt)}
                                    </TableCell>
                                    <TableCell className="text-sm font-medium">{invoice.number ?? '\u2014'}</TableCell>
                                    <TableCell className="text-sm font-medium">
                                        {formatAmount(invoice.amountDue, invoice.currency)}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {formatDate(invoice.periodStart ?? null)}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {formatDate(invoice.periodEnd ?? null)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <Badge
                                                variant="outline"
                                                className={`rounded-md px-2 py-0.5 text-xs ${statusStyle}`}
                                            >
                                                {statusLabel}
                                            </Badge>
                                            {isEarlyRenewal && (
                                                <Badge
                                                    variant="outline"
                                                    className="rounded-md border-violet-200 bg-violet-50 px-2 py-0.5 text-xs text-violet-700"
                                                >
                                                    {t('customers.invoices.earlyRenewal')}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {status === 'void' && String(invoiceMetadata?.voidReason) && (
                                            <span className="text-xs text-gray-500">
                                                {invoiceMetadata?.voidReason as string}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <IconDotsVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {canPay && (
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setPayReference('');
                                                            setPayingInvoice(invoice);
                                                        }}
                                                        disabled={isPaying}
                                                    >
                                                        <IconCreditCardPay className="mr-2 h-4 w-4" />
                                                        {t('customers.invoices.pay')}
                                                    </DropdownMenuItem>
                                                )}
                                                {invoice.status === 'open' && (
                                                    <DropdownMenuItem
                                                        onClick={() => sendInvoice(invoice.id)}
                                                        disabled={isSending}
                                                    >
                                                        <IconMailForward className="mr-2 h-4 w-4" />
                                                        {t('customers.invoices.send')}
                                                    </DropdownMenuItem>
                                                )}
                                                {!isManual && invoice.hostedInvoiceUrl && (
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            window.open(invoice.hostedInvoiceUrl ?? '', '_blank')
                                                        }
                                                    >
                                                        <IconExternalLink className="mr-2 h-4 w-4" />
                                                        {t('customers.invoices.viewOnStripe')}
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem
                                                    onClick={() => download(invoice.id)}
                                                    disabled={isDownloading}
                                                >
                                                    <Download className="mr-2 h-4 w-4" />
                                                    {t('customers.invoices.download')}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => syncInvoice(invoice.id)}
                                                    disabled={isSyncing}
                                                >
                                                    <IconRefresh className="mr-2 h-4 w-4" />
                                                    {t('customers.invoices.sync')}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>

            {/* Pay Invoice Dialog */}
            <Dialog
                open={payingInvoice !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setPayingInvoice(null);
                        setPaymentMethod('cheque');
                        setPayReference('');
                        setPayReferenceError(false);
                    }
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('customers.invoices.payConfirmTitle')}</DialogTitle>
                        <DialogDescription>{t('customers.invoices.payConfirmDescription')}</DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium">{t('customers.subscriptions.paymentMethod')}</Label>
                            <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {PAYMENT_METHODS.map((method) => (
                                        <SelectItem key={method} value={method}>
                                            {t(PAYMENT_METHOD_TRANSLATION_KEYS[method])}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium">
                                {t(`customers.invoices.payReferenceLabel.${paymentMethod}`)}
                            </Label>
                            <Input
                                value={payReference}
                                onChange={(e) => {
                                    setPayReference(e.target.value);
                                    if (payReferenceError) setPayReferenceError(false);
                                }}
                                placeholder={t(`customers.invoices.payReferencePlaceholder.${paymentMethod}`)}
                                className={payReferenceError ? 'border-destructive' : ''}
                            />
                            {payReferenceError && (
                                <p className="text-destructive text-sm">
                                    {t('customers.invoices.payReferenceRequired')}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setPayingInvoice(null);
                                setPaymentMethod('cheque');
                                setPayReference('');
                                setPayReferenceError(false);
                            }}
                            disabled={isPaying}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button onClick={handlePay} disabled={isPaying} isLoading={isPaying}>
                            {t('customers.invoices.pay')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
};
