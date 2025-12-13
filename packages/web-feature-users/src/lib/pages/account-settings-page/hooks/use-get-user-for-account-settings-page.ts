import {useGetUserById} from '@maas/core-api';

export const useGetUserForAccountSettingsPage = (userId: string) => {
  const { data: user, isLoading } = useGetUserById({
    id: userId,
    fields: {
      id: null,
      firstName: null,
      lastName: null,
      email: null,
      notificationsPreferences: null,
      localizationPreferences: null,
      profileImage: {
        fields: {
          id: null,
          url: null,
        }
      },
    },
  });


  return { user, isLoading };
};
