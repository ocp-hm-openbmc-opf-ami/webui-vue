import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

// Mock the api module
jest.mock('@/store/api', () => ({
  get: jest.fn(),
  patch: jest.fn(),
}));

// Mock router to prevent circular dependency
jest.mock('@/router', () => ({
  __esModule: true,
  default: {
    getRoutes: jest.fn(() => []),
    addRoute: jest.fn(),
    removeRoute: jest.fn(),
  },
}));

// Mock RuntimeConfig
jest.mock('@/utilities/RuntimeConfig', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

// Mock i18n
jest.mock('@/i18n', () => ({
  __esModule: true,
  default: {
    t: jest.fn((key) => key),
  },
}));

// Mock component imports
jest.mock('@/views/Operations/Kvm1/Kvm1Console', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('@/views/Operations/Kvm1/Kvm1', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('@/views/Operations/ServerPowerOperations1', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('@/views/Operations/VirtualMediaHost02', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('@/views/Settings/AutoVideoSettings', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('@/views/Logs/VideoLogs', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('@/views/PageNotFound', () => ({
  __esModule: true,
  default: {},
}));

// Mock UtcDateTimeMixin
jest.mock('@/components/Mixins/UtcDateTimeMixin', () => ({
  __esModule: true,
  default: {
    methods: {
      createDateWithISOString: (isoString) => new Date(isoString),
    },
  },
}));

describe('DashboardStore', () => {
  let store;
  let DashboardStore;

  beforeEach(() => {
    // Import the store fresh for each test
    DashboardStore =
      require('@/store/modules/Dashboard/DashboardStore').default;

    // Mock global store for testing cross-module commits
    const GlobalStore = {
      namespaced: true,
      state: {
        bmcTime: null,
        timeZone: null,
      },
      mutations: {
        setBmcTime: (state, bmcTime) => (state.bmcTime = bmcTime),
        setTimeZone: (state, timeZone) => (state.timeZone = timeZone),
      },
    };

    store = new Vuex.Store({
      modules: {
        dashboard: DashboardStore,
        global: GlobalStore,
      },
    });
  });

  describe('getters', () => {
    const mockDashboardData = {
      SeverityCounts: {
        Critical: 2,
        Warning: 5,
        OK: 10,
      },
      PowerState: 'On',
      Model: 'Test Model',
      SerialNumber: '12345',
      Manufacturer: 'Test Manufacturer',
      LocationIndicatorActive: true,
      DateTime: '2025-08-12T06:24:50Z',
      TimeZoneName: 'UTC',
      Oem: {
        Ami: {
          PhysicalLED: {
            AmberLED: 'Blinking',
            BlueLED: 'Off',
            GreenLED: 'On',
          },
        },
      },
    };

    beforeEach(() => {
      store.commit('dashboard/setDashboardData', mockDashboardData);
    });

    describe('healthStatusIcon', () => {
      it('should return "danger" when critical events exist', () => {
        expect(store.getters['dashboard/healthStatusIcon']).toBe('danger');
      });

      it('should return "warning" when only warning events exist', () => {
        const dataWithWarnings = {
          ...mockDashboardData,
          SeverityCounts: { Critical: 0, Warning: 3, OK: 10 },
        };
        store.commit('dashboard/setDashboardData', dataWithWarnings);
        expect(store.getters['dashboard/healthStatusIcon']).toBe('warning');
      });

      it('should return "success" when no critical or warning events exist', () => {
        const dataWithOkOnly = {
          ...mockDashboardData,
          SeverityCounts: { Critical: 0, Warning: 0, OK: 10 },
        };
        store.commit('dashboard/setDashboardData', dataWithOkOnly);
        expect(store.getters['dashboard/healthStatusIcon']).toBe('success');
      });
    });

    describe('powerStatusIcon', () => {
      it('should return "success" when power state is On', () => {
        expect(store.getters['dashboard/powerStatusIcon']).toBe('success');
      });

      it('should return "secondary" when power state is Off', () => {
        const dataWithPowerOff = {
          ...mockDashboardData,
          PowerState: 'Off',
        };
        store.commit('dashboard/setDashboardData', dataWithPowerOff);
        expect(store.getters['dashboard/powerStatusIcon']).toBe('secondary');
      });

      it('should return "warning" for transitioning states', () => {
        const dataWithTransitioning = {
          ...mockDashboardData,
          PowerState: 'PoweringOn',
        };
        store.commit('dashboard/setDashboardData', dataWithTransitioning);
        expect(store.getters['dashboard/powerStatusIcon']).toBe('warning');
      });
    });

    describe('serverInfo', () => {
      it('should return correct server information', () => {
        const serverInfo = store.getters['dashboard/serverInfo'];
        expect(serverInfo).toEqual({
          model: 'Test Model',
          serialNumber: '12345',
          manufacturer: 'Test Manufacturer',
        });
      });
    });

    describe('eventLogCounts', () => {
      it('should return correct event log counts', () => {
        const counts = store.getters['dashboard/eventLogCounts'];
        expect(counts).toEqual({
          critical: 2,
          warning: 5,
          ok: 10,
        });
      });
    });

    describe('systemHealthLEDs', () => {
      it('should return correct LED states', () => {
        const leds = store.getters['dashboard/systemHealthLEDs'];
        expect(leds).toEqual({
          amberLED: 'Blinking',
          blueLED: 'Off',
          greenLED: 'On',
        });
      });
    });

    describe('locationIndicatorStatus', () => {
      it('should return correct location indicator status', () => {
        expect(store.getters['dashboard/locationIndicatorStatus']).toBe(true);
      });
    });

    describe('bmcDateTime', () => {
      it('should return correct BMC date time', () => {
        const bmcDateTime = store.getters['dashboard/bmcDateTime'];
        expect(bmcDateTime).toEqual(new Date('2025-08-12T06:24:50Z'));
      });
    });
  });

  describe('mutations', () => {
    it('should set dashboard data correctly', () => {
      const testData = { test: 'data' };
      store.commit('dashboard/setDashboardData', testData);

      expect(store.getters['dashboard/dashboardData']).toEqual(testData);
      expect(store.getters['dashboard/isLoaded']).toBe(true);
    });

    it('should reset dashboard data correctly', () => {
      store.commit('dashboard/setDashboardData', { test: 'data' });
      store.commit('dashboard/resetDashboardData');

      expect(store.getters['dashboard/dashboardData']).toBeNull();
      expect(store.getters['dashboard/isLoaded']).toBe(false);
    });
  });
});
