import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { usePublicRoutes } from '@maas/core-routes';

/**
 * Address is now combined with the payment step.
 * This page redirects to checkout success (for Stripe return URLs)
 * or to the payment page.
 */
export const PricingAdressePage = () => {
    const navigate = useNavigate();
    const publicRoutes = usePublicRoutes();

    useEffect(() => {
        navigate(publicRoutes.checkoutSuccess, { replace: true });
    }, [navigate, publicRoutes.checkoutSuccess]);

    return null;
};
