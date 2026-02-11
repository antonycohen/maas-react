import { useOAuthStore } from '@maas/core-store-oauth';
import {
    Stepper,
    StepperItem,
    StepperTrigger,
    StepperIndicator,
    StepperSeparator,
    StepperTitle,
    StepperNav,
} from '@maas/web-components';

const STEPS_NOT_LOGGED_IN = [
    { step: 1, label: 'Connexion' },
    { step: 2, label: 'Paiement' },
    { step: 3, label: 'Adresse de livraison' },
];

const STEPS_LOGGED_IN = [
    { step: 1, label: 'Paiement' },
    { step: 2, label: 'Adresse de livraison' },
];

export type PricingStepName = 'auth' | 'paiement' | 'adresse';

export function getStepNumber(stepName: PricingStepName, isLoggedIn: boolean): number {
    if (isLoggedIn) {
        switch (stepName) {
            case 'auth':
                return 1;
            case 'paiement':
                return 1;
            case 'adresse':
                return 2;
        }
    }
    switch (stepName) {
        case 'auth':
            return 1;
        case 'paiement':
            return 2;
        case 'adresse':
            return 3;
    }
}

interface PricingStepperLayoutProps {
    currentStepName: PricingStepName;
    children: React.ReactNode;
}

export function PricingStepperLayout({ currentStepName, children }: PricingStepperLayoutProps) {
    const accessToken = useOAuthStore((s) => s.accessToken);
    const isLoggedIn = !!accessToken;
    const steps = isLoggedIn ? STEPS_LOGGED_IN : STEPS_NOT_LOGGED_IN;
    const currentStep = getStepNumber(currentStepName, isLoggedIn);

    return (
        <div className="container mx-auto flex w-full flex-col items-center px-5 py-10 xl:px-0">
            <div className="mb-8 w-full max-w-2xl">
                <Stepper value={currentStep}>
                    <StepperNav>
                        {steps.map((s, i) => (
                            <StepperItem key={s.step} step={s.step} disabled>
                                <StepperTrigger asChild>
                                    <div className="flex items-center gap-3">
                                        <StepperIndicator>{s.step}</StepperIndicator>
                                        <StepperTitle>{s.label}</StepperTitle>
                                    </div>
                                </StepperTrigger>
                                {i < steps.length - 1 && <StepperSeparator />}
                            </StepperItem>
                        ))}
                    </StepperNav>
                </Stepper>
            </div>
            <div className="w-full">{children}</div>
        </div>
    );
}
