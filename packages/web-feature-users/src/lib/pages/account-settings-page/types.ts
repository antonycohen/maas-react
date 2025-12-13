import {ReadUser} from '@maas/core-api-models';

export type EditUserOutletContext = {
  user: ReadUser | undefined;
  isLoading: boolean;
};
