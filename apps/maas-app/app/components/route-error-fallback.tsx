import { useNavigate } from 'react-router';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Shared fallback UI for React Router ErrorBoundary exports.
 * Renders when a route throws an error during loading or rendering.
 */
export function RouteErrorFallback() {
    const navigate = useNavigate();

    return (
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
            <div className="bg-destructive/10 flex h-12 w-12 items-center justify-center rounded-full">
                <AlertCircle className="text-destructive h-6 w-6" />
            </div>
            <div className="space-y-1">
                <h2 className="text-lg font-semibold">Une erreur est survenue</h2>
                <p className="text-muted-foreground max-w-md text-sm">
                    Une erreur inattendue s'est produite. Veuillez réessayer ou rafraîchir la page.
                </p>
            </div>
            <button
                onClick={() => navigate(0)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
                <RefreshCw className="h-4 w-4" />
                Réessayer
            </button>
        </div>
    );
}
