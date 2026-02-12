import { useMemo, useState } from 'react';
import { useCountries } from '@maas/core-api';
import { AsyncCombobox, Input } from '@maas/web-components';
import type { AddressFormData } from '../store/pricing-store';

export function validateAddress(address: AddressFormData): Partial<Record<keyof AddressFormData, string>> {
    const errors: Partial<Record<keyof AddressFormData, string>> = {};
    if (!address.firstName.trim()) errors.firstName = 'Le prénom est requis';
    if (!address.lastName.trim()) errors.lastName = 'Le nom est requis';
    if (!address.line1.trim()) errors.line1 = "L'adresse est requise";
    if (!address.city.trim()) errors.city = 'La ville est requise';
    if (!address.postalCode.trim()) errors.postalCode = 'Le code postal est requis';
    if (!address.country.trim()) errors.country = 'Le pays est requis';
    return errors;
}

interface AddressFormProps {
    address: AddressFormData;
    onChange: (address: Partial<AddressFormData>) => void;
    errors: Partial<Record<keyof AddressFormData, string>>;
}

export function AddressForm({ address, onChange, errors }: AddressFormProps) {
    const [countrySearch, setCountrySearch] = useState('');
    const { data: countries, isLoading: isLoadingCountries } = useCountries();

    const countryOptions = useMemo(() => {
        const options = Object.entries(countries ?? {}).map(([code, name]) => ({ id: code, label: name }));
        if (!countrySearch) return options;
        const term = countrySearch.toLowerCase();
        return options.filter((o) => o.label.toLowerCase().includes(term));
    }, [countries, countrySearch]);

    const selectedCountry = useMemo(
        () =>
            address.country && countries
                ? { id: address.country, label: countries[address.country] ?? address.country }
                : null,
        [address.country, countries]
    );

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                    <label className="text-foreground text-sm font-medium">Prénom</label>
                    <Input
                        value={address.firstName}
                        onChange={(e) => onChange({ firstName: e.target.value })}
                        placeholder="Jean"
                        aria-invalid={!!errors.firstName}
                    />
                    {errors.firstName && <span className="text-destructive text-xs">{errors.firstName}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-foreground text-sm font-medium">Nom</label>
                    <Input
                        value={address.lastName}
                        onChange={(e) => onChange({ lastName: e.target.value })}
                        placeholder="Dupont"
                        aria-invalid={!!errors.lastName}
                    />
                    {errors.lastName && <span className="text-destructive text-xs">{errors.lastName}</span>}
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-foreground text-sm font-medium">Adresse</label>
                <Input
                    value={address.line1}
                    onChange={(e) => onChange({ line1: e.target.value })}
                    placeholder="123 Rue de la République"
                    aria-invalid={!!errors.line1}
                />
                {errors.line1 && <span className="text-destructive text-xs">{errors.line1}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-foreground text-sm font-medium">Complément d'adresse (optionnel)</label>
                <Input
                    value={address.line2}
                    onChange={(e) => onChange({ line2: e.target.value })}
                    placeholder="Appartement, bâtiment, etc."
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                    <label className="text-foreground text-sm font-medium">Code postal</label>
                    <Input
                        value={address.postalCode}
                        onChange={(e) => onChange({ postalCode: e.target.value })}
                        placeholder="75001"
                        aria-invalid={!!errors.postalCode}
                    />
                    {errors.postalCode && <span className="text-destructive text-xs">{errors.postalCode}</span>}
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-foreground text-sm font-medium">Ville</label>
                    <Input
                        value={address.city}
                        onChange={(e) => onChange({ city: e.target.value })}
                        placeholder="Paris"
                        aria-invalid={!!errors.city}
                    />
                    {errors.city && <span className="text-destructive text-xs">{errors.city}</span>}
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-foreground text-sm font-medium">Pays</label>
                <AsyncCombobox
                    value={selectedCountry}
                    onChange={(option) => onChange({ country: option?.id ?? '' })}
                    onSearchChange={setCountrySearch}
                    options={countryOptions}
                    isLoading={isLoadingCountries}
                    placeholder="Sélectionner un pays"
                    searchPlaceholder="Rechercher un pays..."
                    emptyMessage="Aucun pays trouvé."
                    loadingMessage="Chargement..."
                    aria-invalid={!!errors.country}
                />
                {errors.country && <span className="text-destructive text-xs">{errors.country}</span>}
            </div>
        </div>
    );
}
