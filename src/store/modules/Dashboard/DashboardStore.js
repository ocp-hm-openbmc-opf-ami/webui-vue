import api from '@/store/api';
import UtcDateTimeMixin from '@/components/Mixins/UtcDateTimeMixin';

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
    },
  },
  actions: {
    async fetchDashboardData({ commit }) {
      try {
        const response = await api.get('/redfish/v1/Oem/Ami/Dashboard');
        commit('setDashboardData', response.data);

        // Also update global store for backward compatibility
        // Some components still depend on global bmcTime and timeZone
        if (response.data.DateTime) {
          const bmcTime = UtcDateTimeMixin.methods.createDateWithISOString(
            response.data.DateTime,
          );
          commit('global/setBmcTime', bmcTime, { root: true });
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
      }
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
        // Revert the change by refetching dashboard data
        throw error;
      }
    },
  },
};

export default DashboardStore;
