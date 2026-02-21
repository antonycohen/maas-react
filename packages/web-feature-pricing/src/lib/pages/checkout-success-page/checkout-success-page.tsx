import { Link } from 'react-router-dom';
import { CircleCheck } from 'lucide-react';
import { Button } from '@maas/web-components';
import { usePublicRoutes } from '@maas/core-routes';

export function CheckoutSuccessPage() {
    const publicRoutes = usePublicRoutes();

    return (
        <div className="flex w-full justify-center px-5 py-16 md:min-h-[650px] md:py-24">
            <div className="flex w-full max-w-lg flex-col items-center gap-8 text-center">
                <div className="bg-success/10 flex h-16 w-16 items-center justify-center rounded-full">
                    <CircleCheck className="text-success h-10 w-10" strokeWidth={1.5} />
                </div>

                <div className="flex flex-col gap-3">
                    <h1 className="font-heading text-foreground text-[34px] leading-10 font-semibold tracking-[-0.85px]">
                        Merci pour votre abonnement&nbsp;!
                    </h1>
                    <p className="text-text-secondary text-base leading-relaxed">
                        Votre paiement a bien été pris en compte. Vous pouvez dès à présent profiter de l'ensemble de
                        vos contenus.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button asChild size="lg">
                        <Link to={publicRoutes.account}>Accéder à mon compte</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link to={publicRoutes.home}>Retour à l'accueil</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
