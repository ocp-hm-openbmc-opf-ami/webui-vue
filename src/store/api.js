import Axios from 'axios';
import { setupCache, buildWebStorage } from 'axios-cache-interceptor';
//Do not change store import.
//Exact match alias set to support
//dotenv customizations.
import store from '../store';

Axios.defaults.headers.common['Accept'] = 'application/json';
Axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const axiosInstance = Axios.create({
  withCredentials: true,
});

const api = setupCache(axiosInstance, {
  debug: console.log,
  methods: ['get'],
  interpretHeader: false,
  etag: true,
  modifiedSince: false,
  staleIfError: false,
  ttl: 0,
  storage: buildWebStorage(localStorage, 'webui-vue-cache:'),
});

api.interceptors.response.use(undefined, (error) => {
  let response = error.response;

  // TODO: Provide user with a notification and way to keep system active
  if (response.status == 401) {
    const isConsoleWindow = store.getters['kvm/getIsConsoleWindow'];
    if (isConsoleWindow) {
      isConsoleWindow.isconsolewindowOpen.close();
    }
    const isKvm1ConsoleWindow = store.getters['kvm/getIsKvm1ConsoleWindow'];
    if (isKvm1ConsoleWindow) {
      isKvm1ConsoleWindow.isKvm1consolewindowOpen.close();
    }
    if (response.config.url != '/login') {
      const isConsoleWindow = store.getters['kvm/getIsConsoleWindow'];
      if (isConsoleWindow && isConsoleWindow.isconsolewindowOpen) {
        try {
          isConsoleWindow.isconsolewindowOpen.close();
        } catch (e) {
          console.log('Could not close KVM console window:', e);
        }
      }
      if (window.isConsoleWindow && !window.isConsoleWindow.closed) {
        try {
          window.isConsoleWindow.postMessage(
            { type: 'SOL_LOGOUT' },
            window.location.origin,
          );
          window.isConsoleWindow.close();
        } catch (e) {
          console.log('Could not close SOL console window:', e);
        }
      }
      store.commit('authentication/setConsoleWindow', false);
      store.commit('authentication/logout');
    }
  }

  if (response.status == 403) {
    // Skip unauthorized toast for VirtualMedia slot APIs and CertificateLocations
    const url = response.config?.url || '';
    const suppressedUrls = [
      /\/redfish\/v1\/Systems\/system\d?\/VirtualMedia\/Slot_/,
      /\/redfish\/v1\/CertificateService\/CertificateLocations/,
    ];
    if (!suppressedUrls.some((pattern) => url.match(pattern))) {
      // Check if action is unauthorized.
      // Toast error message will appear on screen
      // when the action is unauthorized.
      store.commit('global/setUnauthorized');
    }
  }

  return Promise.reject(error);
});

export default {
  get(path) {
    return api.get(path);
  },
  delete(path, payload) {
    return api.delete(path, payload);
  },
  post(path, payload, config) {
    return api.post(path, payload, config);
  },
  patch(path, payload) {
    return api.patch(path, payload);
  },
  put(path, payload) {
    return api.put(path, payload);
  },
  all(promises) {
    return Axios.all(promises);
  },
  spread(callback) {
    return Axios.spread(callback);
  },
};

export const getResponseCount = (responses) => {
  let successCount = 0;
  let errorCount = 0;

  responses.forEach((response) => {
    if (response instanceof Error) errorCount++;
    else successCount++;
  });

  return {
    successCount,
    errorCount,
  };
};
