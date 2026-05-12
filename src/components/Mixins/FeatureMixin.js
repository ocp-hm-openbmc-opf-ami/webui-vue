// Shared utility for non-component JS files (router, navigation, etc.)
// Pass one or more VUE_APP_* env variable names - returns true only if ALL are enabled.
// Usage: isFeatureEnabled('VUE_APP_ONETREE_KVM_ENABLED', 'VUE_APP_ONETREE_POWER_ENABLED')
export const isFeatureEnabled = (...features) => {
  return features.every((feature) => process.env[feature] === 'true');
};

// Mixin for Vue components - exposes isFeatureEnabled() as a method.
// Usage in template: v-if="isFeatureEnabled('VUE_APP_ONETREE_KVM_ENABLED', 'VUE_APP_ONETREE_POWER_ENABLED')"
const FeatureMixin = {
  methods: {
    isFeatureEnabled(...features) {
      return isFeatureEnabled(...features);
    },
  },
};

export default FeatureMixin;
