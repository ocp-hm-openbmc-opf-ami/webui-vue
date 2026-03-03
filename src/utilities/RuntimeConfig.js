/**
 * Runtime Configuration Manager
 *
 * This utility allows dynamic configuration at runtime,
 * overriding compile-time environment variables.
 *
 * Use this when you need to change configuration based on API responses
 * or other runtime conditions.
 */

class RuntimeConfig {
  constructor() {
    // Initialize with environment variables as defaults
    this.config = {
      ONETREE_MULTI_HOST_SUPPORT_ENABLED:
        process.env.VUE_APP_ONETREE_MULTI_HOST_SUPPORT_ENABLED === 'true',
    };

    // Flag to track if configuration has been loaded from API
    this.isInitialized = false;

    // Flag to track if multi-host routes have been added to router
    this.routesAdded = false;
  }

  /**
   * Set a configuration value
   * @param {string} key - Configuration key
   * @param {any} value - Configuration value
   */
  set(key, value) {
    this.config[key] = value;
  }

  /**
   * Get a configuration value
   * @param {string} key - Configuration key
   * @param {any} defaultValue - Default value if key not found
   * @returns {any} Configuration value
   */
  get(key, defaultValue = null) {
    return Object.prototype.hasOwnProperty.call(this.config, key)
      ? this.config[key]
      : defaultValue;
  }

  /**
   * Update multi-host support based on dashboard data
   * @param {Object} dashboardData - Dashboard API response data
   */
  updateFromDashboardData(dashboardData) {
    if (dashboardData && typeof dashboardData.DualNodeEnabled !== 'undefined') {
      this.set(
        'ONETREE_MULTI_HOST_SUPPORT_ENABLED',
        dashboardData.DualNodeEnabled === true,
      );
      this.isInitialized = true;
    }
    // this.set('ONETREE_MULTI_HOST_SUPPORT_ENABLED', true);
  }

  /**
   * Check if multi-host support is enabled
   * @returns {boolean}
   */
  isMultiHostEnabled() {
    return this.get('ONETREE_MULTI_HOST_SUPPORT_ENABLED', false);
  }

  /**
   * Check if configuration has been initialized from API
   * @returns {boolean}
   */
  isConfigInitialized() {
    return this.isInitialized;
  }

  /**
   * Check if multi-host routes have been added to the router
   * @returns {boolean}
   */
  areRoutesAdded() {
    return this.routesAdded;
  }

  /**
   * Mark that multi-host routes have been added to the router
   */
  setRoutesAdded() {
    this.routesAdded = true;
  }

  /**
   * Reset to default (environment) values
   */
  reset() {
    this.config.ONETREE_MULTI_HOST_SUPPORT_ENABLED =
      process.env.VUE_APP_ONETREE_MULTI_HOST_SUPPORT_ENABLED === 'true';
    this.isInitialized = false;
    this.routesAdded = false;
  }
}

// Export singleton instance
export default new RuntimeConfig();
