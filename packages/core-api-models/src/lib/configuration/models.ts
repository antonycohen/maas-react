type ConfigurationFeatureName = "group" | "feed";
type FeatureConfig = { version: number; enabled: boolean };
type FeaturesConfigurations = Record<ConfigurationFeatureName, FeatureConfig>;

interface Configuration {
  featuresConfigurations?: FeaturesConfigurations;
}

export type {
  Configuration,
  FeatureConfig,
  FeaturesConfigurations,
  ConfigurationFeatureName,
};
