import { Invoice } from '@maas/core-api-models';
import { useDownloadInvoice } from '@maas/core-api';
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@maas/web-components';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { triggerBlobDownload } from '../../../../account-settings-page/tabs/account-invoices-tab/utils/trigger-blob-download';
import { useTranslation } from '@maas/core-translations';

const STATUS_STYLES: Record<string, string> = {
    paid: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    open: 'border-blue-200 bg-blue-50 text-blue-700',
    draft: 'border-gray-200 bg-gray-50 text-gray-700',
    void: 'border-red-200 bg-red-50 text-red-700',
    uncollectible: 'border-orange-200 bg-orange-50 text-orange-700',
};

const STATUS_KEYS: Record<string, string> = {
    paid: 'customers.invoices.statusPaid',
    open: 'customers.invoices.statusOpen',
    draft: 'customers.invoices.statusDraft',
    void: 'customers.invoices.statusVoid',
    uncollectible: 'customers.invoices.statusUncollectible',
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
};

export const CustomerInvoiceListSection = ({ invoices, isLoading }: Props) => {
    const { t } = useTranslation();

    const { mutate: download, isPending: isDownloading } = useDownloadInvoice({
        onSuccess: (blob, invoiceId) => {
            const invoice = invoices?.find((inv) => inv.id === invoiceId);
            const filename = `${invoice?.number ?? invoiceId}.pdf`;
            triggerBlobDownload(blob, filename);
        },
        onError: () => {
            toast.error(t('customers.invoices.downloadError'));
        },
    });

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
                            <TableHead>{t('field.status')}</TableHead>
                            <TableHead className="text-right">{t('field.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => {
                            const status = invoice.status ?? 'draft';
                            const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES.draft;
                            const statusKey = STATUS_KEYS[status];
                            const statusLabel = statusKey ? t(statusKey) : status;

                            return (
                                <TableRow key={invoice.id}>
                                    <TableCell className="text-sm text-gray-600">
                                        {formatDate(invoice.createdAt)}
                                    </TableCell>
                                    <TableCell className="text-sm font-medium">{invoice.number ?? '\u2014'}</TableCell>
                                    <TableCell className="text-sm font-medium">
                                        {formatAmount(invoice.amountDue, invoice.currency)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`rounded-md px-2 py-0.5 text-xs ${statusStyle}`}
                                        >
                                            {statusLabel}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            disabled={isDownloading}
                                            onClick={() => download(invoice.id)}
                                            title={t('customers.invoices.download')}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
