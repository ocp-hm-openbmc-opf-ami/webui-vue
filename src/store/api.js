import Axios from 'axios';
//Do not change store import.
//Exact match alias set to support
//dotenv customizations.
import store from '../store';
import Cookies from 'js-cookie';

const api = Axios.create({
  withCredentials: true,
});

api.interceptors.response.use(undefined, (error) => {
  let response = error.response;

  // TODO: Provide user with a notification and way to keep system active
  if (response.status == 401) {
    if (response.config.url != '/login') {
      window.location = '/login';
      // Commit logout to remove XSRF-TOKEN cookie
      store.commit('authentication/logout');
    }
  }

  if (response.status == 403) {
    // Check if action is unauthorized.
    // Toast error message will appear on screen
    // when the action is unauthorized.
    store.commit('global/setUnauthorized');
  }

  return Promise.reject(error);
});

const splitString = function (stringToSplit) {
  let tmp = stringToSplit.split('/').pop();
  return 'localApi/' + tmp;
};

export default {
  get(path, params, cancelSource) {
    path = splitString(path);
    if (path != 'localApi/') {
      return api.get(path);
    } else {
      return cancelSource && cancelSource.token
        ? api.get(path, { cancelToken: cancelSource.token, params })
        : api.get(path, { params });
    }
  },
  delete(path, payload) {
    return api.delete(path, payload);
  },
  post(path, payload, config) {
    console.log('1', path);
    if (path.indexOf('login') != -1) {
      Cookies.set('XSRF-TOKEN', 'DCRS2vYgXbdZxXuT2xig');
      Cookies.set('SESSION', '832CGiPefdz5m7uG5tlk');
      return api.get(path);
    }
    console.log(path);
    if (path.indexOf('logout') != -1) {
      return api.get(path);
    }
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
  getCancelTokenSource() {
    return Axios.CancelToken.source();
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
