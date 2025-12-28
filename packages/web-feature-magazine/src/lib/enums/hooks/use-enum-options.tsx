import { useGetEnums } from '@maas/core-api';

export const useEnumOptions = () => {
  const { data } = useGetEnums({
    offset: 0,
    limit: 100,
  });

  return (
    data?.data.map((enumItem) => ({
      value: enumItem.id,
      label: enumItem.name,
    })) || []
  );
};
