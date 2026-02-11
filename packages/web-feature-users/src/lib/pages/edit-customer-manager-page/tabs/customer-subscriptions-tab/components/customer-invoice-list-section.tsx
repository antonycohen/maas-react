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

const STATUS_STYLES: Record<string, string> = {
    paid: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    open: 'border-blue-200 bg-blue-50 text-blue-700',
    draft: 'border-gray-200 bg-gray-50 text-gray-700',
    void: 'border-red-200 bg-red-50 text-red-700',
    uncollectible: 'border-orange-200 bg-orange-50 text-orange-700',
};

const STATUS_LABELS: Record<string, string> = {
    paid: 'Payée',
    open: 'Ouverte',
    draft: 'Brouillon',
    void: 'Annulée',
    uncollectible: 'Irrécouvrable',
};

const formatAmount = (amountInCents: number, currency: string | null): string => {
    const amount = amountInCents / 100;
    const currencyCode = currency?.toUpperCase() ?? 'EUR';
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currencyCode,
    }).format(amount);
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
    const { mutate: download, isPending: isDownloading } = useDownloadInvoice({
        onSuccess: (blob, invoiceId) => {
            const invoice = invoices?.find((inv) => inv.id === invoiceId);
            const filename = `${invoice?.number ?? invoiceId}.pdf`;
            triggerBlobDownload(blob, filename);
        },
        onError: () => {
            toast.error('Unable to download invoice.');
        },
    });

    if (isLoading) {
        return (
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">Invoices</CardTitle>
                    <CardDescription>Loading...</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (!invoices || invoices.length === 0) {
        return (
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">Invoices</CardTitle>
                    <CardDescription>No invoices available.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="rounded-2xl">
            <CardHeader>
                <CardTitle className="text-xl">Invoices</CardTitle>
                <CardDescription>Customer invoice history.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Number</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => {
                            const status = invoice.status ?? 'draft';
                            const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES.draft;
                            const statusLabel = STATUS_LABELS[status] ?? status;

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
                                            title="Download"
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
