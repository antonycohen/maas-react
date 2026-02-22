import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {
    /* no-op: useSyncExternalStore requires a subscribe function */
};

export const useIsClient = () =>
    useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );
