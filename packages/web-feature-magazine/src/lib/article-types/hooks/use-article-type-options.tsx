import { useGetArticleTypes } from '@maas/core-api';

export const useArticleTypeOptions = () => {
  const { data } = useGetArticleTypes({
    offset: 0,
    limit: 100,
    filters: {
      isActive: true,
    },
  });

  return (
    data?.data.map((articleType) => ({
      value: articleType.id,
      label: articleType.name,
    })) || []
  );
};
