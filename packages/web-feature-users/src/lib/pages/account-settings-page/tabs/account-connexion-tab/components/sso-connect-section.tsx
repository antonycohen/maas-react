import { Card, CardContent, CardDescription, CardHeader, CardTitle, SsoConnector } from '@maas/web-components';
import { InfoIcon } from 'lucide-react';
import { ReadUser } from '@maas/core-api-models';
import { useTranslation } from '@maas/core-translations';

const GoogleLogo = () => (
    <svg viewBox="0 0 24 24" className="size-10">
        <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
    </svg>
);

const LinkedInLogo = () => (
    <svg viewBox="0 0 24 24" className="size-10">
        <rect fill="#0A66C2" width="24" height="24" rx="4" />
        <path
            fill="white"
            d="M7.5 8.5h-2v8h2v-8zm-1-3.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zm10 3.5h-2v1c-.5-.7-1.5-1.2-2.5-1.2-2.2 0-3.5 1.8-3.5 4.2s1.3 4.2 3.5 4.2c1 0 2-.5 2.5-1.2v1h2v-8zm-4.5 6.5c-1.1 0-2-.9-2-2.3s.9-2.3 2-2.3 2 .9 2 2.3-.9 2.3-2 2.3z"
        />
    </svg>
);

const MicrosoftLogo = () => (
    <svg viewBox="0 0 24 24" className="size-10">
        <rect x="1" y="1" width="10" height="10" fill="#F25022" />
        <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
        <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
        <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
    </svg>
);

export const SsoConnectSection = ({ user }: { user: ReadUser }) => {
    const { t } = useTranslation();

    // Get connected identifiers from user's socialIdentifiers
    const socialIdentifiers = user?.socialIdentifiers ?? {};
    const googleEmail = socialIdentifiers['google'] ?? null;
    const linkedInId = socialIdentifiers['linkedin'] ?? null;
    const microsoftId = socialIdentifiers['microsoft'] ?? null;

    const handleConnect = (provider: string) => {
        // TODO: Implement OAuth connection flow
        console.log(`Connect to ${provider}`);
    };

    const handleDisconnect = (provider: string) => {
        // TODO: Implement disconnect flow
        console.log(`Disconnect from ${provider}`);
    };

    return (
        <div className="flex flex-col gap-8 xl:flex-row">
            {/* Main content */}
            <Card className="flex-1 basis-1/2 rounded-2xl">
                <CardHeader className="border-b">
                    <CardTitle className="text-xl">{t('users.connectedAccounts')}</CardTitle>
                    <CardDescription>{t('users.connectedAccountsDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 pt-6">
                    <SsoConnector
                        logo={<GoogleLogo />}
                        providerName={t('users.google')}
                        isConnected={!!googleEmail}
                        identifier={googleEmail ?? undefined}
                        onConnect={() => handleConnect('google')}
                        onDisconnect={() => handleDisconnect('google')}
                    />
                    <SsoConnector
                        logo={<LinkedInLogo />}
                        providerName={t('users.linkedin')}
                        isConnected={!!linkedInId}
                        identifier={linkedInId ?? undefined}
                        onConnect={() => handleConnect('linkedin')}
                        onDisconnect={() => handleDisconnect('linkedin')}
                    />
                    <SsoConnector
                        logo={<MicrosoftLogo />}
                        providerName={t('users.microsoft')}
                        isConnected={!!microsoftId}
                        identifier={microsoftId ?? undefined}
                        onConnect={() => handleConnect('microsoft')}
                        onDisconnect={() => handleDisconnect('microsoft')}
                    />
                </CardContent>
            </Card>

            {/* Info sidebar */}
            <div className="order-first w-full shrink-0 basis-1/2 xl:order-last xl:w-80">
                <div className="bg-card inline-flex items-center justify-start gap-3 self-stretch rounded-[10px] border px-4 py-3">
                    <InfoIcon className="text-muted-foreground size-5 shrink-0" />
                    <p className="text-muted-foreground text-sm">{t('users.ssoInfo')}</p>
                </div>
            </div>
        </div>
    );
};
