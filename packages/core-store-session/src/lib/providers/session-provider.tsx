import { ReactNode, useEffect } from 'react';
import { useSetupSessionUser } from './session-items/use-setup-session-user';
import { useSetupSubscriptionStatus } from './session-items/use-setup-subscription-status';
import { useSessionStore } from '../store/session-store';

export function SessionProvider({ children }: { children: ReactNode }) {
    const setIsLoading = useSessionStore((state) => state.setIsLoading);

    const { isLoading: userIsLoading } = useSetupSessionUser();
    const { isLoading: subscriptionIsLoading } = useSetupSubscriptionStatus();

    useEffect(() => {
        setIsLoading(userIsLoading || subscriptionIsLoading);
    }, [userIsLoading, subscriptionIsLoading, setIsLoading]);

    return children;
}
