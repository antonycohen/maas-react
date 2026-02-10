import { Quota } from '@maas/core-api-models';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Progress } from '@maas/web-components';

type Props = {
    quotas: Quota[] | undefined;
};

const formatFeatureKey = (key: string): string => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

export const QuotaUsageSection = ({ quotas }: Props) => {
    const activeQuotas = quotas?.filter((q) => q.status === 'active') ?? [];

    return (
        <Card className="rounded-2xl">
            <CardHeader>
                <CardTitle className="text-xl">Utilisation des quotas</CardTitle>
                <CardDescription>Suivi de votre consommation par rapport aux limites de votre plan.</CardDescription>
            </CardHeader>
            <CardContent>
                {activeQuotas.length === 0 ? (
                    <p className="text-sm text-gray-500">Aucun quota disponible.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {activeQuotas.map((quota) => {
                            const limit = quota.quotaLimit ?? 0;
                            const used = quota.currentUsage ?? 0;
                            const percentage = limit > 0 ? Math.round((used / limit) * 100) : 0;
                            return (
                                <div key={quota.id} className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">
                                            {quota.featureKey ? formatFeatureKey(quota.featureKey) : quota.id}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {used} / {limit}
                                        </span>
                                    </div>
                                    <Progress value={percentage} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
