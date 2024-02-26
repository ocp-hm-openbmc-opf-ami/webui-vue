import api from '@/store/api';
import { uniqBy } from 'lodash';

const SensorsStore = {
  namespaced: true,
  state: {
    sensors: [],
    graphsensors: {},
  },
  getters: {
    sensors: (state) => state.sensors,
    GraphSensors: (state) => state.graphsensors,
  },
  mutations: {
    setSensors: (state, sensors) => {
      state.sensors = uniqBy([...sensors, ...state.sensors], 'name');
    },
    SetGraphSensors: (state, sensors) => {
      state.graphsensors = sensors;
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
          Members.map((member) => member['@odata.id'])
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
              id: response.data['@odata.id'],
              name: response.data.Name,
              status: response.data.Status?.Health,
              currentValue: response.data.Reading,
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
    async getTimeInterval({ commit }, val) {
      return await api
        .get(val.id)
        .then((response) => {
          var sensorGraphData = {};
          if (response.data) {
            if (val.value == 10) {
              sensorGraphData = {
                id: response.data['@odata.id'],
                name: response.data.Name,
                status: response.data.Status?.Health,
                currentValue: response.data.Reading,
                lowerCaution: response.data.Thresholds?.LowerCaution?.Reading,
                upperCaution: response.data.Thresholds?.UpperCaution?.Reading,
                lowerCritical: response.data.Thresholds?.LowerCritical?.Reading,
                upperCritical: response.data.Thresholds?.UpperCritical?.Reading,
                units: response.data.ReadingUnits,
                History: [
                  {
                    ReadingCelsius: 10.5,
                    Time: 1708974060,
                  },
                  {
                    ReadingCelsius: 5.5,
                    Time: 1708974629,
                  },
                  {
                    ReadingCelsius: 15.5,
                    Time: 1708975247,
                  },
                  {
                    ReadingCelsius: 20.5,
                    Time: 1708975857,
                  },
                  {
                    ReadingCelsius: 13.0,
                    Time: 1708976469,
                  },
                  {
                    ReadingCelsius: 23.0,
                    Time: 1708977022,
                  },
                ],
              };
            }
            if (val.value == 20) {
              sensorGraphData = {
                id: response.data['@odata.id'],
                name: response.data.Name,
                status: response.data.Status?.Health,
                currentValue: response.data.Reading,
                lowerCaution: response.data.Thresholds?.LowerCaution?.Reading,
                upperCaution: response.data.Thresholds?.UpperCaution?.Reading,
                lowerCritical: response.data.Thresholds?.LowerCritical?.Reading,
                upperCritical: response.data.Thresholds?.UpperCritical?.Reading,
                units: response.data.ReadingUnits,
                History: [
                  {
                    ReadingCelsius: 0.5,
                    Time: 1708974060,
                  },
                  {
                    ReadingCelsius: 5.5,
                    Time: 1708975247,
                  },
                  {
                    ReadingCelsius: 7.5,
                    Time: 1708976434,
                  },
                  {
                    ReadingCelsius: 8.5,
                    Time: 1708977621,
                  },
                  {
                    ReadingCelsius: 9.5,
                    Time: 1708978808,
                  },
                  {
                    ReadingCelsius: 15.5,
                    Time: 1708979995,
                  },
                ],
              };
            }
            if (val.value == 30) {
              sensorGraphData = {
                id: response.data['@odata.id'],
                name: response.data.Name,
                status: response.data.Status?.Health,
                currentValue: response.data.Reading,
                lowerCaution: response.data.Thresholds?.LowerCaution?.Reading,
                upperCaution: response.data.Thresholds?.UpperCaution?.Reading,
                lowerCritical: response.data.Thresholds?.LowerCritical?.Reading,
                upperCritical: response.data.Thresholds?.UpperCritical?.Reading,
                units: response.data.ReadingUnits,
                History: [
                  {
                    ReadingCelsius: 1.5,
                    Time: 1708974060,
                  },
                  {
                    ReadingCelsius: 2.5,
                    Time: 1708975860,
                  },
                  {
                    ReadingCelsius: 3.5,
                    Time: 1708977660,
                  },
                  {
                    ReadingCelsius: 4.5,
                    Time: 1708979460,
                  },
                  {
                    ReadingCelsius: 5.5,
                    Time: 1708981260,
                  },
                  {
                    ReadingCelsius: 6.5,
                    Time: 1708983060,
                  },
                ],
              };
            }
          }
          commit('SetGraphSensors', sensorGraphData);
        })
        .catch((error) => console.log(error));
    },
  },
};

export default SensorsStore;
