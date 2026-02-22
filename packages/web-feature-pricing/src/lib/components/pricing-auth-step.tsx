import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { getAuthorizationUrl } from '@maas/core-api';
import { useOAuthStore } from '@maas/core-store-oauth';
import { usePublicRoutes } from '@maas/core-routes';

export function PricingAuthStep() {
    const navigate = useNavigate();
    const accessToken = useOAuthStore((s) => s.accessToken);
    const publicRoutes = usePublicRoutes();
    const [iframeUrl, setIframeUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const hasInitialized = useRef(false);

    // Generate OAuth authorization URL with template=iframe
    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        if (accessToken) {
            navigate(publicRoutes.pricingPaiement, { replace: true });
            return;
        }

        getAuthorizationUrl()
            .then((url) => {
                setIframeUrl(`${url}&template=iframe`);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
            });
    }, [accessToken, navigate]);

    // Poll for auth token changes (iframe sets cookies, we rehydrate to detect)
    useEffect(() => {
        if (accessToken) {
            navigate(publicRoutes.pricingPaiement, { replace: true });
            return;
        }

        const interval = setInterval(() => {
            // Force rehydration from cookie storage to detect tokens set by iframe
            useOAuthStore.persist.rehydrate();
        }, 1000);

        return () => clearInterval(interval);
    }, [accessToken, navigate]);

    return (
        <div className="animate-in fade-in slide-in-from-top-4 w-full duration-300">
            <div className="border-border bg-background overflow-hidden rounded-xl border">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-0 md:px-8 md:pt-8">
                    <div className="flex flex-col gap-1">
                        <p className="text-text-secondary text-xs font-semibold tracking-wide uppercase">
                            Connectez-vous pour continuer
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(publicRoutes.pricing)}
                        className="text-text-secondary hover:text-foreground cursor-pointer text-sm font-medium transition-colors"
                    >
                        Retour
                    </button>
                </div>

                {/* OAuth iframe */}
                <div className="p-6 md:px-8 md:pb-8">
                    {isLoading && (
                        <div className="flex h-[500px] items-center justify-center">
                            <div className="border-brand-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
                        </div>
                    )}
                    {iframeUrl && <iframe src={iframeUrl} className="h-[550px] w-full border-0" title="Connexion" />}
                </div>
            </div>
        </div>
    );
}
