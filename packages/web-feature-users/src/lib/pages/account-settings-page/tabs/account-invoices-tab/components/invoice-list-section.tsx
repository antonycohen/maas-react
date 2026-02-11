import { Invoice } from '@maas/core-api-models';
import { useDownloadMyInvoice, useGetInvoicePaymentUrl } from '@maas/core-api';
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
import { Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { triggerBlobDownload } from '../utils/trigger-blob-download';

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
};

export const InvoiceListSection = ({ invoices }: Props) => {
    const { mutate: download, isPending: isDownloading } = useDownloadMyInvoice({
        onSuccess: (blob, invoiceId) => {
            const invoice = invoices?.find((inv) => inv.id === invoiceId);
            const filename = `${invoice?.number ?? invoiceId}.pdf`;
            triggerBlobDownload(blob, filename);
        },
        onError: () => {
            toast.error('Impossible de télécharger la facture.');
        },
    });

    const { mutate: pay, isPending: isPaying } = useGetInvoicePaymentUrl({
        onSuccess: (data) => {
            window.open(data.paymentUrl, '_blank');
        },
        onError: () => {
            toast.error('Impossible de récupérer le lien de paiement.');
        },
    });

    if (!invoices || invoices.length === 0) {
        return (
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">Factures</CardTitle>
                    <CardDescription>Aucune facture disponible.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="rounded-2xl">
            <CardHeader>
                <CardTitle className="text-xl">Factures</CardTitle>
                <CardDescription>Historique de vos factures.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Numéro</TableHead>
                            <TableHead>Montant</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => {
                            const status = invoice.status ?? 'draft';
                            const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES.draft;
                            const statusLabel = STATUS_LABELS[status] ?? status;
                            const canPay = status === 'open' || status === 'uncollectible';

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
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                disabled={isDownloading}
                                                onClick={() => download(invoice.id)}
                                                title="Télécharger"
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            {canPay && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    disabled={isPaying}
                                                    onClick={() => pay(invoice.id)}
                                                    title="Payer"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
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
