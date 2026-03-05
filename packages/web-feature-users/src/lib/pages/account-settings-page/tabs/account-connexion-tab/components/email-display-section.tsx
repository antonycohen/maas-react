import { ReadUser } from '@maas/core-api-models';
import { Badge, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@maas/web-components';
import { useTranslation } from '@maas/core-translations';

type EmailDisplaySectionProps = {
    user: ReadUser;
};

export const EmailDisplaySection = ({ user }: EmailDisplaySectionProps) => {
    const { t } = useTranslation();

    // TODO: Get verification status from user data when available
    const isVerified = true;

    return (
        <Card className="rounded-2xl">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">Email</CardTitle>
                    <Badge
                        variant="outline"
                        className={
                            isVerified
                                ? 'gap-1.5 rounded-md border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700'
                                : 'border-muted bg-muted/50 text-muted-foreground gap-1.5 rounded-md px-2 py-0.5 text-xs'
                        }
                    >
                        <span
                            className={`size-2 rounded-full ${
                                isVerified ? 'bg-emerald-400' : 'bg-muted-foreground/50'
                            }`}
                        />
                        {isVerified ? t('status.verified') : t('status.notVerified')}
                    </Badge>
                </div>
                <CardDescription>{t('users.changeEmail')}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 py-6">
                    <label className="w-1/3 text-sm font-medium">{t('field.email')}</label>
                    <div className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                        {user.email}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
