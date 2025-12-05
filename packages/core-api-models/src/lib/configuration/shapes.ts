import { Configuration } from './models';

export const configurationShape: Configuration = {
  featuresConfigurations: {
    group: { version: 1, enabled: true },
    feed: { version: 1, enabled: true },
  },
};
