import api from '@/store/api';
import { uniqBy } from 'lodash';
import i18n from '@/i18n';

const SensorsStore = {
  namespaced: true,
  state: {
    sensors: [],
    graphSensors: {},
    sensorGraphRefresh: true,
  },
  getters: {
    sensors: (state) => state.sensors,
    graphSensors: (state) => state.graphSensors,
    sensorGraphRefreshGet: (state) => state.sensorGraphRefresh,
  },
  mutations: {
    setSensors: (state, sensors) => {
      state.sensors = uniqBy([...sensors, ...state.sensors], 'name');
    },
    setGraphSensors: (state, sensors) => {
      state.graphSensors = sensors;
    },
    setSensorGraph: (state, sensorGraphRefresh) => {
      state.sensorGraphRefresh = sensorGraphRefresh;
    },
  },
  actions: {
    async getAllSensors({ dispatch }) {
      const collection = await dispatch('getChassisCollection');
      if (!collection) return;
      const promises = collection.reduce((acc, id) => {
        acc.push(dispatch('getSensors', id));
        acc.push(dispatch('getThermalSensors', id));
        acc.push(dispatch('getPowerSensors', id));
        return acc;
      }, []);
      return await api.all(promises);
    },
    async getChassisCollection() {
      return await api
        .get('/redfish/v1/Chassis')
        .then(({ data: { Members } }) =>
          Members.map((member) => member['@odata.id']),
        )
        .catch((error) => console.log(error));
    },
    async getSensors({ commit }, id) {
      const sensors = await api
        .get(`${id}/Sensors`)
        .then((response) => response.data.Members)
        .catch((error) => console.log(error));
      if (!sensors) return;
      const promises = sensors.map((sensor) => {
        return api.get(sensor['@odata.id']).catch((error) => {
          console.log(error);
          return error;
        });
      });
      return await api.all(promises).then((responses) => {
        const sensorData = [];
        responses.forEach((response) => {
          if (response.data) {
            sensorData.push({
              id: response.data.Oem?.Ami['@odata.id'],
              name: response.data.Name,
              status: response.data.Status?.Health,
              state: response.data.Status?.State,
              currentValue: response.data.Reading,
              thresholdsId:
                (response.data?.Oem?.Ami?.SensorThreshold ?? '') === ''
                  ? null
                  : response.data?.Oem?.Ami?.SensorThreshold['@odata.id'],
              lowerCaution: response.data.Thresholds?.LowerCaution?.Reading,
              upperCaution: response.data.Thresholds?.UpperCaution?.Reading,
              lowerCritical: response.data.Thresholds?.LowerCritical?.Reading,
              upperCritical: response.data.Thresholds?.UpperCritical?.Reading,
              units: response.data.ReadingUnits,
            });
          }
        });
        commit('setSensors', sensorData);
      });
    },
    async getThermalSensors({ commit }, id) {
      return await api
        .get(`${id}/Thermal`)
        .then(({ data: { Fans = [], Temperatures = [] } }) => {
          const sensorData = [];
          Fans.forEach((sensor) => {
            sensorData.push({
              name: sensor.Name,
              status: sensor.Status.Health,
              state: sensor.Status.State,
              currentValue: sensor.Reading,
              lowerCaution: sensor.LowerThresholdNonCritical,
              upperCaution: sensor.UpperThresholdNonCritical,
              lowerCritical: sensor.LowerThresholdCritical,
              upperCritical: sensor.UpperThresholdCritical,
              units: sensor.ReadingUnits,
            });
          });
          Temperatures.forEach((sensor) => {
            sensorData.push({
              name: sensor.Name,
              status: sensor.Status.Health,
              state: sensor.Status.State,
              currentValue: sensor.ReadingCelsius,
              lowerCaution: sensor.LowerThresholdNonCritical,
              upperCaution: sensor.UpperThresholdNonCritical,
              lowerCritical: sensor.LowerThresholdCritical,
              upperCritical: sensor.UpperThresholdCritical,
              units: '℃',
            });
          });
          commit('setSensors', sensorData);
        })
        .catch((error) => console.log(error));
    },
    async getPowerSensors({ commit }, id) {
      return await api
        .get(`${id}/Power`)
        .then(({ data: { Voltages = [] } }) => {
          const sensorData = Voltages.map((sensor) => {
            return {
              name: sensor.Name,
              status: sensor.Status.Health,
              state: sensor.Status.State,
              currentValue: sensor.ReadingVolts,
              lowerCaution: sensor.LowerThresholdNonCritical,
              upperCaution: sensor.UpperThresholdNonCritical,
              lowerCritical: sensor.LowerThresholdCritical,
              upperCritical: sensor.UpperThresholdCritical,
              units: 'V',
            };
          });
          commit('setSensors', sensorData);
        })
        .catch((error) => console.log(error));
    },
    async getTimeInterval({ commit, state }, val) {
      let id = val.id == undefined ? state.graphSensors.id : val.id;
      return await api
        .get(id)
        .then((response) => {
          if (response.data) {
            commit('setGraphSensors', response.data);
          }
        })
        .catch((error) => console.log(error));
    },
    async setTimeInterval(_, val) {
      return await api
        .patch(val.id, { Interval: val.Interval, TimeFrame: val.TimeFrame })
        .then(() => {})
        .catch((error) => console.log(error));
    },
    setSensorGraphRefresh({ commit }, val) {
      commit('setSensorGraph', val);
    },
    async setSensorThresholdValue(_, { val, thresholdsUrlId }) {
      return await api
        .patch(thresholdsUrlId, { Thresholds: val })
        .then(() =>
          i18n.t('pageSensors.sensorThreshold.toast.successSaveThreshold'),
        )
        .catch(() => {
          throw new Error(
            i18n.t('pageSensors.sensorThreshold.toast.errorSaveThreshold'),
          );
        });
    },
  },
};

export default SensorsStore;
