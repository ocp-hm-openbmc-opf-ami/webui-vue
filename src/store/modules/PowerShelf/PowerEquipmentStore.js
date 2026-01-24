import api from '@/store/api';
import i18n from '@/i18n';

const PowerEquipmentStore = {
  namespaced: true,
  state: {
    powerEquipmentData: [],
    powerEquipmentDetails: {},
  },
  getters: {
    getPowerEquipmentData: (state) => state.powerEquipmentData,
    getPowerEquipmentDetails: (state) => state.powerEquipmentDetails,
  },
  mutations: {
    setPowerEquipmentData: (state, powerEquipmentData) =>
      (state.powerEquipmentData = powerEquipmentData),
    setPowerEquipmentDetails: (state, powerEquipmentDetails) =>
      (state.powerEquipmentDetails = powerEquipmentDetails),
  },
  actions: {
    async getPowerEquipment({ commit }) {
      return await api
        .get('/redfish/v1/PowerEquipment')
        .then(async (response) => {
          const fetchPromises = [];

          // Fetch from PowerShelves if available
          if (response.data.PowerShelves) {
            const powerShelvesUrl = response.data.PowerShelves['@odata.id'];
            fetchPromises.push(
              api
                .get(powerShelvesUrl)
                .then(async (powerShelvesResponse) => {
                  if (powerShelvesResponse?.data?.Members) {
                    // Fetch all power shelf members in parallel
                    const memberPromises =
                      powerShelvesResponse.data.Members.map((member) =>
                        api.get(member['@odata.id']),
                      );
                    const results = await Promise.allSettled(memberPromises);
                    return results
                      .filter((result) => result.status === 'fulfilled')
                      .map((result) => result.value.data);
                  }
                  return [];
                })
                .catch((error) => {
                  console.log('Error fetching power shelves:', error);
                  return [];
                }),
            );
          }

          // Fetch from RackPDUs if available
          if (response.data.RackPDUs) {
            const rackPDUsUrl = response.data.RackPDUs['@odata.id'];
            fetchPromises.push(
              api
                .get(rackPDUsUrl)
                .then(async (rackPDUsResponse) => {
                  if (rackPDUsResponse?.data?.Members) {
                    // Fetch all rack PDU members in parallel
                    const memberPromises = rackPDUsResponse.data.Members.map(
                      (member) => api.get(member['@odata.id']),
                    );
                    const results = await Promise.allSettled(memberPromises);
                    return results
                      .filter((result) => result.status === 'fulfilled')
                      .map((result) => result.value.data);
                  }
                  return [];
                })
                .catch((error) => {
                  console.log('Error fetching rack PDUs:', error);
                  return [];
                }),
            );
          }

          // Wait for all fetches to complete and flatten the results
          const results = await Promise.all(fetchPromises);
          const powerEquipment = results.flat();

          commit('setPowerEquipmentData', powerEquipment);
          return powerEquipment;
        })
        .catch((error) => {
          console.log('Power equipment fetch error', error);
          throw new Error(
            i18n.t('powerShelf.toast.errorLoadingPowerEquipment'),
          );
        });
    },
    async getPowerEquipmentDetails({ commit }, equipment) {
      return await api
        .get(equipment['@odata.id'])
        .then(async (response) => {
          const details = {
            Branches: [],
            Mains: [],
            Metrics: null,
            Outlets: [],
          };

          // Prepare all fetch promises to run in parallel
          const fetchPromises = [];

          // Fetch Branches
          if (response.data.Branches) {
            const branchesUrl = response.data.Branches['@odata.id'];
            fetchPromises.push(
              api
                .get(branchesUrl)
                .then(async (branchesResponse) => {
                  if (branchesResponse?.data?.Members) {
                    const memberPromises = branchesResponse.data.Members.map(
                      (member) => api.get(member['@odata.id']),
                    );
                    const results = await Promise.allSettled(memberPromises);
                    details.Branches = results
                      .filter((result) => result.status === 'fulfilled')
                      .map((result) => result.value.data);
                  }
                })
                .catch((error) => {
                  console.log('Error fetching branches:', error);
                }),
            );
          }

          // Fetch Mains
          if (response.data.Mains) {
            const mainsUrl = response.data.Mains['@odata.id'];
            fetchPromises.push(
              api
                .get(mainsUrl)
                .then(async (mainsResponse) => {
                  if (mainsResponse?.data?.Members) {
                    const memberPromises = mainsResponse.data.Members.map(
                      (member) => api.get(member['@odata.id']),
                    );
                    const results = await Promise.allSettled(memberPromises);
                    details.Mains = results
                      .filter((result) => result.status === 'fulfilled')
                      .map((result) => result.value.data);
                  }
                })
                .catch((error) => {
                  console.log('Error fetching mains:', error);
                }),
            );
          }

          // Fetch Metrics
          if (response.data.Metrics) {
            const metricsUrl = response.data.Metrics['@odata.id'];
            fetchPromises.push(
              api
                .get(metricsUrl)
                .then((metricsResponse) => {
                  details.Metrics = metricsResponse.data;
                })
                .catch((error) => {
                  console.log('Error fetching metrics:', error);
                }),
            );
          }

          // Fetch Outlets
          if (response.data.Outlets) {
            const outletsUrl = response.data.Outlets['@odata.id'];
            fetchPromises.push(
              api
                .get(outletsUrl)
                .then(async (outletsResponse) => {
                  if (outletsResponse?.data?.Members) {
                    const memberPromises = outletsResponse.data.Members.map(
                      (member) => api.get(member['@odata.id']),
                    );
                    const results = await Promise.allSettled(memberPromises);
                    details.Outlets = results
                      .filter((result) => result.status === 'fulfilled')
                      .map((result) => result.value.data);
                  }
                })
                .catch((error) => {
                  console.log('Error fetching outlets:', error);
                }),
            );
          }

          // Wait for all fetches to complete
          await Promise.all(fetchPromises);

          commit('setPowerEquipmentDetails', details);
          return details;
        })
        .catch((error) => {
          console.log('Power equipment details fetch error', error);
          throw new Error(
            i18n.t('powerShelf.toast.errorLoadingPowerEquipmentDetails'),
          );
        });
    },
  },
};

export default PowerEquipmentStore;
