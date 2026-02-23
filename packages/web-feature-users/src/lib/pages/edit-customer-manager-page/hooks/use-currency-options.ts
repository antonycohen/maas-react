import { useMemo } from 'react';

const CURRENCIES = [
    { value: 'eur', label: 'Euro (EUR)' },
    { value: 'usd', label: 'Dollar US (USD)' },
    { value: 'gbp', label: 'Livre Sterling (GBP)' },
    { value: 'chf', label: 'Franc Suisse (CHF)' },
    { value: 'cad', label: 'Dollar Canadien (CAD)' },
];

export const useCurrencyOptions = () => {
    return useMemo(() => CURRENCIES, []);
};
