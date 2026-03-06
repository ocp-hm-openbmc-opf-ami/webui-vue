import { mount, createLocalVue, createWrapper } from '@vue/test-utils';
import Vue from 'vue';
import Vuex from 'vuex';
import i18n from '@/i18n';
import AppHeader from '@/components/AppHeader';

// Mock HTMLCanvasElement for qrcode.vue component
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillStyle: '',
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(),
  putImageData: jest.fn(),
  createImageData: jest.fn(),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
}));
HTMLCanvasElement.prototype.toDataURL = jest.fn(() => '');

// Silencing warnings about undefined Bootsrap-vue components
Vue.config.silent = true;
const localVue = createLocalVue();
localVue.use(Vuex);
window.events = {
  listen: jest.fn(), // Mock the listen function
};

describe('AppHeader.vue', () => {
  const actions = {
    'global/getServerStatus': jest.fn(),
    'global/getManagerinstance': jest.fn(),
    'eventLog/getEventLogData': jest.fn(),
    'authentication/resetStoreState': jest.fn(),
    'license/getUserAlertCount': jest.fn(),
    'global/getSystemInfo': jest.fn(),
    'controls/getLastPowerOperationTime': jest.fn(),
    'dashboard/fetchDashboardData': jest.fn().mockResolvedValue({}),
  };
  let state;

  beforeEach(() => {
    // Define the state for the license module
    state = {
      isLicense: true, // Set to true or false depending on your test scenario
    };
  });
  const store = new Vuex.Store({
    actions,
    modules: {
      license: {
        namespaced: true,
        state,
      },
      dashboard: {
        namespaced: true,
        state: {
          dashboardData: null,
          isLoaded: false,
        },
        getters: {
          powerStatus: () => 'on',
        },
        actions: {
          fetchDashboardData: jest.fn().mockResolvedValue({}),
        },
      },
    },
  });
  const wrapper = mount(AppHeader, {
    store,
    localVue,
    i18n,
    mocks: {
      $t: (key) => key,
    },
  });

  // Reset dispatch between tests so that multiple
  // actions are not dispatched for each test
  beforeEach(() => {
    store.dispatch = jest.fn();
  });

  it('should exist', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should render correctly', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('refresh button click should emit refresh event', async () => {
    wrapper.get('#app-header-refresh').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('refresh')).toBeTruthy();
  });

  it('nav-trigger button click should emit toggle-navigation event', async () => {
    const rootWrapper = createWrapper(wrapper.vm.$root);
    wrapper.get('#app-header-trigger').trigger('click');
    await wrapper.vm.$nextTick();
    expect(rootWrapper.emitted('toggle-navigation')).toBeTruthy();
  });

  it('logout button should dispatch authentication/logout', async () => {
    wrapper.get('[data-test-id="appHeader-link-logout"]').trigger('click');
    await wrapper.vm.$nextTick();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('change:isNavigationOpen event should set isNavigationOpen prop to false', async () => {
    const rootWrapper = createWrapper(wrapper.vm.$root);
    rootWrapper.vm.$emit('change-is-navigation-open', false);
    await rootWrapper.vm.$nextTick();
    expect(wrapper.vm.isNavigationOpen).toEqual(false);
  });
});
