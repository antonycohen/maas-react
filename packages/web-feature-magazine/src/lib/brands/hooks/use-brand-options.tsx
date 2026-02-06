import { useGetBrands } from '@maas/core-api';

export const useBrandOptions = () => {
    const { data } = useGetBrands({
        offset: 0,
        limit: 100,
    });

    return data?.data?.map((brand) => ({ value: brand.id, label: brand.name })) || [];
};
