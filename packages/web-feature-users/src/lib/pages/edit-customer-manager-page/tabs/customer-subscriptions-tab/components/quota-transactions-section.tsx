import { useState } from 'react';
import { useGetQuotaTransactions } from '@maas/core-api';
import { QuotaTransactionOperationType } from '@maas/core-api-models';
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@maas/web-components';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useTranslation } from '@maas/core-translations';

const OPERATION_STYLES: Record<QuotaTransactionOperationType, string> = {
    allocate: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    consume: 'border-blue-200 bg-blue-50 text-blue-700',
    adjust: 'border-amber-200 bg-amber-50 text-amber-700',
    refund: 'border-purple-200 bg-purple-50 text-purple-700',
    reset: 'border-gray-200 bg-gray-50 text-gray-700',
};

const OPERATION_TRANSLATION_KEYS: Record<QuotaTransactionOperationType, string> = {
    allocate: 'customers.quotaTransactions.operationAllocate',
    consume: 'customers.quotaTransactions.operationConsume',
    adjust: 'customers.quotaTransactions.operationAdjust',
    refund: 'customers.quotaTransactions.operationRefund',
    reset: 'customers.quotaTransactions.operationReset',
};

const OPERATIONS: QuotaTransactionOperationType[] = ['allocate', 'consume', 'adjust', 'refund', 'reset'];

const PAGE_SIZE = 10;

const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '\u2014';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

type Props = {
    customerId: string;
};

export const QuotaTransactionsSection = ({ customerId }: Props) => {
    const { t } = useTranslation();
    const [offset, setOffset] = useState(0);
    const [operationFilter, setOperationFilter] = useState<string>('all');

    const { data, isLoading } = useGetQuotaTransactions({
        customerId,
        fields: {
            id: null,
            amount: null,
            operationType: null,
            description: null,
            quota: { fields: { id: null, featureKey: null, quotaLimit: null, currentUsage: null } },
            referenceType: null,
            referenceId: null,
            createdAt: null,
        },
        offset,
        limit: PAGE_SIZE,
        filters: operationFilter !== 'all' ? { operationType: operationFilter } : undefined,
    });

    const transactions = data?.data ?? [];
    const totalCount = data?.pagination?.count ?? 0;
    const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const handlePrev = () => setOffset((prev) => Math.max(0, prev - PAGE_SIZE));
    const handleNext = () => setOffset((prev) => prev + PAGE_SIZE);

    const handleFilterChange = (value: string) => {
        setOperationFilter(value);
        setOffset(0);
    };

    if (isLoading && offset === 0) {
        return (
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">{t('customers.quotaTransactions.title')}</CardTitle>
                    <CardDescription>{t('common.loading')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-40 w-full rounded-xl" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="rounded-2xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1.5">
                        <CardTitle className="text-xl">{t('customers.quotaTransactions.title')}</CardTitle>
                        <CardDescription>{t('customers.quotaTransactions.description')}</CardDescription>
                    </div>
                    <Select value={operationFilter} onValueChange={handleFilterChange}>
                        <SelectTrigger className="w-44">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('customers.quotaTransactions.allOperations')}</SelectItem>
                            {OPERATIONS.map((op) => (
                                <SelectItem key={op} value={op}>
                                    {t(OPERATION_TRANSLATION_KEYS[op])}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                {transactions.length === 0 ? (
                    <p className="text-muted-foreground text-sm">{t('customers.quotaTransactions.noTransactions')}</p>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('customers.quotaTransactions.date')}</TableHead>
                                    <TableHead>{t('customers.quotaTransactions.feature')}</TableHead>
                                    <TableHead>{t('customers.quotaTransactions.operation')}</TableHead>
                                    <TableHead className="text-right">
                                        {t('customers.quotaTransactions.amount')}
                                    </TableHead>
                                    <TableHead>{t('customers.quotaTransactions.descriptionColumn')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((tx) => {
                                    const opType = tx.operationType as QuotaTransactionOperationType;
                                    const opStyle = OPERATION_STYLES[opType] ?? OPERATION_STYLES.adjust;
                                    const opTranslationKey = OPERATION_TRANSLATION_KEYS[opType];
                                    const isPositive =
                                        opType === 'allocate' || opType === 'refund' || opType === 'reset';

                                    return (
                                        <TableRow key={tx.id}>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {formatDate(tx.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-sm font-medium">
                                                {tx.quota?.featureKey ?? '\u2014'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`rounded-md px-2 py-0.5 text-xs ${opStyle}`}
                                                >
                                                    {opTranslationKey ? t(opTranslationKey) : tx.operationType}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span
                                                    className={`text-sm font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}
                                                >
                                                    {isPositive ? '+' : ''}
                                                    {tx.amount}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground max-w-48 truncate text-sm">
                                                {tx.description ?? '\u2014'}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-muted-foreground text-sm">
                                    {t('customers.quotaTransactions.pageInfo', {
                                        current: currentPage,
                                        total: totalPages,
                                    })}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        disabled={offset === 0 || isLoading}
                                        onClick={handlePrev}
                                    >
                                        <IconChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        disabled={offset + PAGE_SIZE >= totalCount || isLoading}
                                        onClick={handleNext}
                                    >
                                        <IconChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};
