import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Button } from '@maas/web-components';

export function CheckoutCancelPage() {
    return (
        <div className="flex w-full justify-center px-5 py-16 md:min-h-[650px] md:py-24">
            <div className="flex w-full max-w-lg flex-col items-center gap-8 text-center">
                <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
                    <XCircle className="text-text-secondary h-10 w-10" strokeWidth={1.5} />
                </div>

                <div className="flex flex-col gap-3">
                    <h1 className="font-heading text-foreground text-[34px] leading-10 font-semibold tracking-[-0.85px]">
                        Paiement annulé
                    </h1>
                    <p className="text-text-secondary text-base leading-relaxed">
                        Votre paiement n'a pas été finalisé. Aucun montant n'a été débité. Vous pouvez revenir à nos
                        offres pour réessayer à tout moment.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button asChild size="lg">
                        <Link to="/pricing">Retour aux offres</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link to="/">Retour à l'accueil</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
