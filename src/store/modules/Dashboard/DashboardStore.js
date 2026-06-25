import api from '@/store/api';
import UtcDateTimeMixin from '@/components/Mixins/UtcDateTimeMixin';
import RuntimeConfig from '@/utilities/RuntimeConfig';
import router from '@/router';
import Kvm1Console from '@/views/Operations/Kvm1/Kvm1Console';
import Kvm1 from '@/views/Operations/Kvm1/Kvm1';
import ServerPowerOperations1 from '@/views/Operations/ServerPowerOperations1';
import VirtualMediaHost02 from '@/views/Operations/VirtualMediaHost02';
import AutoVideoSettings from '@/views/Settings/AutoVideoSettings';
import VideoLogs from '@/views/Logs/VideoLogs';
import SerialOverLan1 from '@/views/Operations/SerialOverLan/SerialOverLan1';
import SerialOverLanConsole1 from '@/views/Operations/SerialOverLan/SerialOverLanConsole1';
import PostCodeLogs1 from '@/views/Logs/PostCodeLogs1';
import PageNotFound from '@/views/PageNotFound';

import i18n from '@/i18n';

// Cache for preventing duplicate API calls
let fetchPromise = null;

const rolesPrivilege = {
  administrator: 'Administrator',
  operator: 'Operator',
  readonly: 'ReadOnly',
};

const DashboardStore = {
  namespaced: true,
  state: {
    dashboardData: null,
    isLoaded: false,
  },
  getters: {
    // Raw dashboard data
    dashboardData: (state) => state.dashboardData,
    isLoaded: (state) => state.isLoaded,

    // Health Status Icon (based on SeverityCounts)
    healthStatusIcon: (state) => {
      if (!state.dashboardData?.SeverityCounts) return 'secondary';

      const { Critical, Warning } = state.dashboardData.SeverityCounts;

      if (Critical > 0) return 'danger';
      if (Warning > 0) return 'warning';
      return 'success';
    },

    // Health Status Text
    healthStatus: (state) => {
      if (!state.dashboardData?.SeverityCounts) return '';

      const { Critical, Warning } = state.dashboardData.SeverityCounts;

      if (Critical > 0) return 'Critical';
      if (Warning > 0) return 'Warning';
      return 'OK';
    },

    // Power Status Icon (based on PowerState)
    powerStatusIcon: (state) => {
      if (!state.dashboardData?.PowerState) return 'secondary';

      switch (state.dashboardData.PowerState) {
        case 'On':
          return 'success';
        case 'Off':
          return 'secondary';
        default:
          return 'warning'; // For transitioning states
      }
    },

    // Power Status Text
    powerStatus: (state) => {
      if (!state.dashboardData?.PowerState) return 'unreachable';

      switch (state.dashboardData.PowerState) {
        case 'On':
          return 'on';
        case 'Off':
          return 'off';
        default:
          return 'transitioning';
      }
    },

    // Server Information
    serverInfo: (state) => {
      if (!state.dashboardData) {
        return {
          model: null,
          serialNumber: null,
          manufacturer: null,
        };
      }

      return {
        model: state.dashboardData.Model,
        serialNumber: state.dashboardData.SerialNumber,
        manufacturer: state.dashboardData.Manufacturer,
      };
    },

    // Event Log Counts
    eventLogCounts: (state) => {
      if (!state.dashboardData?.SeverityCounts) {
        return {
          critical: 0,
          warning: 0,
          ok: 0,
        };
      }

      return {
        critical: state.dashboardData.SeverityCounts.Critical || 0,
        warning: state.dashboardData.SeverityCounts.Warning || 0,
        ok: state.dashboardData.SeverityCounts.OK || 0,
      };
    },

    // System Health LEDs
    systemHealthLEDs: (state) => {
      if (!state.dashboardData?.Oem?.Ami?.PhysicalLED) {
        return {
          amberLED: null,
          blueLED: null,
          greenLED: null,
        };
      }

      const physicalLED = state.dashboardData?.Oem?.Ami?.PhysicalLED;
      return {
        amberLED: physicalLED?.AmberLED,
        blueLED: physicalLED?.BlueLED,
        greenLED: physicalLED?.GreenLED,
      };
    },

    // Location Indicator Status
    locationIndicatorStatus: (state) => {
      return state.dashboardData?.LocationIndicatorActive || false;
    },

    // BMC Date and Time
    bmcDateTime: (state) => {
      if (!state.dashboardData?.DateTime) return null;
      const dateObj = UtcDateTimeMixin.methods.createDateWithISOString(
        state.dashboardData.DateTime,
      );
      return dateObj;
    },

    // BMC Time Zone
    bmcTimeZone: (state) => {
      return state.dashboardData?.TimeZoneName || null;
    },

    // Legacy getters for backward compatibility with existing components
    // These mimic the structure of the old store modules

    // For EventLogStore compatibility
    allEvents: () => {
      // Return a mock array for components that expect event log entries
      // This is mainly for export functionality in OverviewEvents
      return [];
    },

    // For SystemStore compatibility
    systems: (state) => {
      if (!state.dashboardData) return [];

      return [
        {
          model: state.dashboardData.Model,
          serialNumber: state.dashboardData.SerialNumber,
          manufacturer: state.dashboardData.Manufacturer,
          locationIndicatorActive:
            state.dashboardData.LocationIndicatorActive || false,
          powerState: state.dashboardData.PowerState,
        },
      ];
    },

    // LED status getters for SystemStore compatibility
    getGreenLedStatus: (state, getters) => {
      return getters.systemHealthLEDs.greenLED;
    },

    getAmberLedStatus: (state, getters) => {
      return getters.systemHealthLEDs.amberLED;
    },

    getBlueLedStatus: (state, getters) => {
      return getters.systemHealthLEDs.blueLED;
    },
  },
  mutations: {
    setDashboardData: (state, data) => {
      state.dashboardData = data;
      state.isLoaded = true;
    },
    resetDashboardData: (state) => {
      state.dashboardData = null;
      state.isLoaded = false;
      // Clear the fetch promise cache to allow fresh fetch
      fetchPromise = null;
    },
  },
  actions: {
    async fetchDashboardData({ commit, state }, { force = false } = {}) {
      // If data is already loaded, return cached data (unless force is true)
      if (!force && state.isLoaded && state.dashboardData) {
        return state.dashboardData;
      }

      // If a fetch is already in progress, return the existing promise (unless force is true)
      if (!force && fetchPromise) {
        return fetchPromise;
      }

      // If force is true and a fetch is in progress, clear it to start a fresh fetch
      if (force && fetchPromise) {
        fetchPromise = null;
      }

      // Create new fetch promise
      fetchPromise = (async () => {
        try {
          const response = await api.get('/redfish/v1/Oem/Ami/Dashboard');
          commit('setDashboardData', response.data);
          // dynamic add routes based on multi-host support
          RuntimeConfig.updateFromDashboardData(response.data);
          if (
            RuntimeConfig.isMultiHostEnabled() &&
            !RuntimeConfig.areRoutesAdded()
          ) {
            // Remove PageNotFound route if it exists (to add it after dynamic routes)
            // if (router.getRoutes().some((r) => r.name === 'page-not-found')) {
            //   router.removeRoute('page-not-found');
            // }

            const existingRoutes = router.getRoutes();
            const routeExists = (name) =>
              existingRoutes.some((r) => r.name === name);

            // Add kvm1-console route to ConsoleLayout parent
            if (!routeExists('kvm1-console')) {
              router.addRoute('console-layout', {
                path: 'kvm1',
                name: 'kvm1-console',
                component: Kvm1Console,
                meta: {
                  requiresAuth: true,
                  title: i18n.t('appPageTitle.kvm1'),
                },
              });
            }
            if (!routeExists('kvm1')) {
              router.addRoute('app-layout', {
                path: 'operations/kvm1',
                name: 'kvm1',
                component: Kvm1,
                meta: {
                  requiresAuth: true,
                  title: i18n.t('appPageTitle.kvm1'),
                },
              });
            }
            if (!routeExists('server-power-operations1')) {
              router.addRoute('app-layout', {
                path: 'operations/server-power-operations1',
                name: 'server-power-operations1',
                component: ServerPowerOperations1,
                meta: {
                  requiresAuth: true,
                  title: i18n.t('appPageTitle.serverPowerOperations1'),
                },
              });
            }

            // Add virtual-media-host-02 route
            if (!routeExists('virtual-media-host-02')) {
              const roles = {
                administrator: 'Administrator',
                operator: 'Operator',
                readonly: 'ReadOnly',
              };
              router.addRoute('app-layout', {
                path: 'operations/virtual-media-host-01',
                name: 'virtual-media-host-02',
                component: VirtualMediaHost02,
                meta: {
                  requiresAuth: true,
                  title: i18n.t('appPageTitle.virtualMediaHost02'),
                  exclusiveToRoles: [
                    roles.administrator,
                    roles.operator,
                    roles.readonly,
                  ],
                },
              });
            }

            // Add serial-over-lan-console-1 route to ConsoleLayout parent
            if (!routeExists('serial-over-lan-console-1')) {
              router.addRoute('console-layout', {
                path: 'serial-over-lan-console-1',
                name: 'serial-over-lan-console-1',
                component: SerialOverLanConsole1,
                meta: {
                  title: i18n.t('appPageTitle.serialOverLan1'),
                },
              });
            }

            // Add serial-over-lan-1 route to AppLayout
            if (!routeExists('serial-over-lan-1')) {
              router.addRoute('app-layout', {
                path: '/operations/serial-over-lan-1',
                name: 'serial-over-lan-1',
                component: SerialOverLan1,
                meta: {
                  title: i18n.t('appPageTitle.serialOverLan1'),
                  exclusiveToRoles: [rolesPrivilege.administrator],
                },
              });
            }

            if (!routeExists('post-code-logs1')) {
              router.addRoute('app-layout', {
                path: '/logs/post-code-logs1',
                name: 'post-code-logs1',
                component: PostCodeLogs1,
                meta: {
                  title: i18n.t('appPageTitle.postCodeLogs1'),
                },
              });
            }

            // Add catch-all route AFTER all dynamic routes to ensure proper matching order
            if (!routeExists('page-not-found')) {
              router.addRoute('app-layout', {
                path: '*',
                name: 'page-not-found',
                component: PageNotFound,
                meta: {
                  title: i18n.t('appPageTitle.pageNotFound'),
                },
              });
            }

            RuntimeConfig.setRoutesAdded();
          } else {
            const existingRoutes = router.getRoutes();
            const routeExists = (name) =>
              existingRoutes.some((r) => r.name === name);
            // If multi-host is not enabled, only add video-log route
            if (!routeExists('video-log')) {
              router.addRoute('app-layout', {
                path: '/logs/video-log',
                name: 'video-log',
                component: VideoLogs,
                meta: {
                  title: i18n.t('appPageTitle.videoLog'),
                },
              });
            }

            if (!routeExists('auto-video')) {
              router.addRoute('app-layout', {
                path: '/settings/auto-video',
                name: 'auto-video',
                component: AutoVideoSettings,
                meta: {
                  title: i18n.t('appPageTitle.autoVideo'),
                },
              });
            }

            // Add page-not-found catch-all route after page-not-found
            if (!routeExists('page-not-found')) {
              router.addRoute('app-layout', {
                path: '*',
                name: 'page-not-found',
                component: PageNotFound,
                meta: {
                  title: i18n.t('appPageTitle.pageNotFound'),
                },
              });
            }

            // Mark routes as added even when multi-host is disabled
            RuntimeConfig.setRoutesAdded();
          }

          // Also update global store for backward compatibility
          // Some components still depend on global bmcTime and timeZone
          if (response.data.DateTime) {
            const bmcTime = UtcDateTimeMixin.methods.createDateWithISOString(
              response.data.DateTime,
            );
            commit('global/setBmcTime', bmcTime, { root: true });
            commit('global/setBmcDateTime', response.data.DateTime, {
              root: true,
            });
          }

          if (response.data.TimeZoneName) {
            commit('global/setTimeZone', response.data.TimeZoneName, {
              root: true,
            });
          }

          return response.data;
        } catch (error) {
          console.error('Failed to fetch dashboard data:', error);
          commit('resetDashboardData');
          throw error;
        } finally {
          // Clear the promise after completion (success or failure)
          fetchPromise = null;
        }
      })();

      return fetchPromise;
    },

    async updateLocationIndicator({ commit, state }, ledState) {
      try {
        await api.patch('/redfish/v1/Systems/system', {
          LocationIndicatorActive: ledState,
        });

        // Update local state
        if (state.dashboardData) {
          const updatedData = {
            ...state.dashboardData,
            LocationIndicatorActive: ledState,
          };
          commit('setDashboardData', updatedData);
        }
      } catch (error) {
        console.error('Failed to update location indicator:', error);
        if (ledState) {
          throw new Error(i18n.t('pageInventory.toast.errorEnableIdentifyLed'));
        } else {
          throw new Error(
            i18n.t('pageInventory.toast.errorDisableIdentifyLed'),
          );
        }
      }
    },
  },
};

export default DashboardStore;
