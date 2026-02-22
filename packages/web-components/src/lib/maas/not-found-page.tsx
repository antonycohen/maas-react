import { useNavigate } from 'react-router';
import { Button } from '../ui/button';

export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
            <h1 className="text-muted-foreground text-8xl font-bold tracking-tight">404</h1>
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold">Page introuvable</h2>
                <p className="text-muted-foreground max-w-md text-sm">
                    La page que vous recherchez n&apos;existe pas ou a été déplacée.
                </p>
            </div>
            <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate(-1)}>
                    Retour
                </Button>
                <Button onClick={() => navigate('/')}>Accueil</Button>
            </div>
        </div>
    );
};
