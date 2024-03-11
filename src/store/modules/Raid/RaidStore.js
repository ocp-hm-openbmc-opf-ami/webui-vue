import api from '@/store/api';
import i18n from '@/i18n';
const RaidStore = {
  namespaced: true,
  state: {
    adapterData: [],
    physicalDeviceData: [],
    logicalDeviceData: [],
    logicalRaidID: [],
    occupiedDriveId: [],
    PhysicalDriveData: [],
    gInfo: [],
    totalLogicalCount: 0,
    totalPhysicalCount: 0,
    loader: null,
    logicalDeviceAllData: [],
    physicalDeviceAllData: [],
    physicalTab: '',
    logicalTab: '',
  },
  getters: {
    adapterData: (state) => state.adapterData,
    physicalDeviceData: (state) => state.physicalDeviceData,
    logicalDeviceData: (state) => state.logicalDeviceData,
  },
  mutations: {
    setAdapterData: (state, adapterData) => (state.adapterData = adapterData),
    setPhysicalDeviceData: (state, physicalDeviceData) =>
      (state.physicalDeviceData = physicalDeviceData),
    setLogicalDeviceAllData: (state, logicalDeviceAllData) =>
      (state.logicalDeviceAllData = logicalDeviceAllData),
    setPhysicalDeviceAllData: (state, physicalDeviceAllData) =>
      (state.physicalDeviceAllData = physicalDeviceAllData),
  },
  actions: {
    async getStorageData({ commit }) {
      return await api
        .get('/redfish/v1/Systems/system/Storage')
        .then((response) =>
          response.data.Members.map(
            (storageInterface) => storageInterface['@odata.id']
          )
        )
        .then((storageInterfaceIds) => {
          let adapterData = [];
          storageInterfaceIds.map((storageInterface) => {
            if (
              storageInterface.indexOf('Raid') != -1 ||
              storageInterface.indexOf('HBA') != -1 ||
              storageInterface.indexOf('mscc') != -1
            ) {
              api.get(storageInterface).then((storageInterface) => {
                if (storageInterface.data.StorageControllers) {
                  storageInterface.data.StorageControllers.forEach(
                    (storageController) => {
                      storageController.physicalDevice =
                        storageInterface.data.Drives.length;
                      storageController.logicalDevice = storageInterface.data
                        ?.Volumes
                        ? true
                        : false;
                      let tmp = storageController['@odata.id'].split('/');
                      let storage = tmp[6]
                        .replace('_', ' ')
                        .replace('#', '')
                        .toUpperCase();
                      if (storage.indexOf('RAID') != -1) {
                        storage = storage.replace('RAID', 'BRCM RAID');
                      } else if (storage.indexOf('MSCC') != -1) {
                        storage = storage.replace('MSCC', 'MSCC RAID');
                      } else if (storage.indexOf('HBA') != -1) {
                        storage = storage.replace('HBA', 'BRCM HBA');
                      }
                      storageController.storageId =
                        storage.split(' ')[0] +
                        ' ' +
                        storage.split(' ')[1] +
                        ' Storage ' +
                        storage.split(' ')[2] +
                        ', Controller ' +
                        tmp[8];
                      storageController.raidId =
                        storageInterface.data['@odata.id'].split('/').pop() +
                        '-' +
                        storageController['@odata.id'].split('/').pop();
                      if (storageController.SupportedRAIDTypes?.length) {
                        var supportedRAIDTypes = '';
                        storageController.SupportedRAIDTypes.forEach((type) => {
                          supportedRAIDTypes += type + ', ';
                        });
                        storageController.RAIDTypes = supportedRAIDTypes.slice(
                          0,
                          -2
                        );
                      }
                      adapterData.push(storageController);
                    }
                  );
                }
              });
            }
          });
          commit('setAdapterData', adapterData);
        })
        .catch((error) => console.log(error));
    },
    async getPhysicalData({ state, commit, dispatch }) {
      state.loader = false;
      return await api
        .get('/redfish/v1/Systems/system/Storage')
        .then((response) => {
          if (response.data.Members.length) {
            return response.data.Members.map(
              (storageInterface) => storageInterface['@odata.id']
            );
          } else state.loader = true;
        })
        .then((storageInterfaceIds) => {
          state.physicalDeviceData = [];
          storageInterfaceIds.map((storageInterface) => {
            if (
              storageInterface.indexOf('Raid') != -1 ||
              storageInterface.indexOf('HBA') != -1 ||
              storageInterface.indexOf('mscc') != -1
            ) {
              api.get(storageInterface).then((storageInterfacesData) => {
                let drives = storageInterfacesData.data.Drives;
                if (drives.length) {
                  let physicalDevice = [];
                  drives.forEach((drive) => {
                    physicalDevice.push(dispatch('physicalDevice', drive));
                  });
                  api
                    .all(physicalDevice)
                    .then((response) => {
                      response.raidId = response[0]['@odata.id'].split('/')[6];
                      let storage = response.raidId
                        .replace('_', ' ')
                        .toUpperCase();
                      if (storage.indexOf('RAID') != -1) {
                        storage = storage.replace('RAID', 'BRCM RAID');
                      } else if (storage.indexOf('MSCC') != -1) {
                        storage = storage.replace('MSCC', 'MSCC RAID');
                      } else if (storage.indexOf('HBA') != -1) {
                        storage = storage.replace('HBA', 'BRCM HBA');
                      }
                      response.physicalId =
                        storage.split(' ')[0] +
                        ' ' +
                        storage.split(' ')[1] +
                        ' Storage ' +
                        storage.split(' ')[2] +
                        ', Physical Devices';

                      state.physicalDeviceData.push(response);
                    })
                    .then(() => {
                      commit(
                        'setPhysicalDeviceAllData',
                        state.physicalDeviceData
                      );
                      state.loader = true;
                    });
                } else state.loader = true;
              });
            } else state.loader = true;
          });
        })
        .catch((error) => {
          console.log(error);
          state.loader = true;
        });
    },
    async physicalDevice(_, drive) {
      return await api
        .get(drive['@odata.id'])
        .then((physicalDeviceData) => {
          physicalDeviceData.data.Id =
            physicalDeviceData.data?.Id != undefined
              ? physicalDeviceData.data?.Id
              : 'N/A';
          physicalDeviceData.data.FailurePredicted =
            physicalDeviceData.data?.Oem?.OpenBmc?.FailurePredicted != undefined
              ? physicalDeviceData.data?.Oem?.OpenBmc?.FailurePredicted
              : 'N/A';
          physicalDeviceData.data.BlockSizeBytes =
            physicalDeviceData.data?.BlockSizeBytes != undefined
              ? physicalDeviceData.data?.BlockSizeBytes
              : 'N/A';
          physicalDeviceData.data.Manufacturer =
            physicalDeviceData.data.Manufacturer != undefined
              ? physicalDeviceData.data.Manufacturer
              : 'N/A';
          physicalDeviceData.data.NegotiatedSpeedGbs =
            physicalDeviceData.data?.NegotiatedSpeedGbs != undefined
              ? physicalDeviceData.data?.NegotiatedSpeedGbs
              : 'N/A';
          physicalDeviceData.data.Protocol =
            physicalDeviceData.data.Protocol != undefined
              ? physicalDeviceData.data.Protocol
              : 'N/A';
          physicalDeviceData.data.Revision =
            physicalDeviceData.data?.Revision != undefined
              ? physicalDeviceData.data?.Revision
              : 'N/A';
          physicalDeviceData.data.SerialNumber =
            physicalDeviceData.data?.SerialNumber != undefined
              ? physicalDeviceData.data?.SerialNumber
              : 'N/A';
          physicalDeviceData.data.Health =
            physicalDeviceData.data?.Status?.Health != undefined
              ? physicalDeviceData.data?.Status?.Health
              : 'N/A';
          return physicalDeviceData.data;
        })
        .catch((error) => console.log(error));
    },
    async getLogicalData({ commit, state }) {
      state.loader = false;
      return await api
        .get('/redfish/v1/Systems/system/Storage')
        .then((response) => {
          if (response.data.Members.length) {
            return response.data.Members.map(
              (storageInterface) => storageInterface['@odata.id']
            );
          } else state.loader = true;
        })
        .then((storageInterfaceIds) => {
          let logicalAllDataArray = [];
          state.occupiedDriveId = [];
          storageInterfaceIds.map((storageInterface) => {
            if (
              storageInterface.indexOf('Raid') != -1 ||
              storageInterface.indexOf('mscc') != -1
            ) {
              api.get(storageInterface).then((storageInterfacesData) => {
                if (storageInterfacesData.data.Drives.length) {
                  state.totalPhysicalCount =
                    storageInterfacesData.data.Drives.length;
                  let logicalData = [];
                  logicalData.raidId = storageInterfacesData.data[
                    '@odata.id'
                  ].split('/')[6];
                  let storage = logicalData.raidId
                    .replace('_', ' ')
                    .toUpperCase();
                  if (storage.indexOf('RAID') != -1) {
                    storage = storage.replace('RAID', 'BRCM RAID');
                  } else if (storage.indexOf('MSCC') != -1) {
                    storage = storage.replace('MSCC', 'MSCC RAID');
                  } else if (storage.indexOf('HBA') != -1) {
                    storage = storage.replace('HBA', 'BRCM HBA');
                  }
                  logicalData.logicalId =
                    storage.split(' ')[0] +
                    ' ' +
                    storage.split(' ')[1] +
                    ' Storage ' +
                    storage.split(' ')[2] +
                    ', Logical Devices';
                  logicalAllDataArray.push(logicalData);
                  state.gInfo.push(storageInterfacesData.data);
                  api
                    .get(storageInterfacesData.data.Volumes['@odata.id'])
                    .then((logicalInterface) => {
                      if (logicalInterface.data.Members.length) {
                        const logicalPromises = logicalInterface.data.Members.map(
                          (logicalInterface) =>
                            api
                              .get(logicalInterface['@odata.id'])
                              .then((logicalData) => {
                                logicalData.data.NumberOfPhysicalDevices =
                                  logicalData.data.Oem.OpenBmc.PdList.length;
                                logicalData.data.Health = logicalData.data
                                  ?.Status?.Health
                                  ? logicalData.data?.Status?.Health
                                  : 'N/A';
                                logicalData.data.actions = [
                                  {
                                    value: 'delete',
                                    enabled: true,
                                  },
                                ];
                                return logicalData.data;
                              })
                        );
                        return logicalPromises;
                      } else {
                        commit('setLogicalDeviceAllData', logicalAllDataArray);
                        state.loader = true;
                      }
                    })
                    .then((logicalPromises) => {
                      const PdList = [];
                      if (logicalPromises) {
                        api
                          .all(logicalPromises)
                          .then((logicalData) => {
                            if (logicalData.length) {
                              logicalData.forEach((logicalData) => {
                                logicalData.Oem.OpenBmc.PdList.forEach(
                                  (pdId) => {
                                    PdList.push(pdId);
                                  }
                                );
                                logicalAllDataArray.forEach((tab) => {
                                  if (
                                    tab.raidId ==
                                    logicalData['@odata.id'].split('/')[6]
                                  ) {
                                    tab.push(logicalData);
                                  }
                                });
                              });
                              state.occupiedDriveId.push(PdList);
                              commit(
                                'setLogicalDeviceAllData',
                                logicalAllDataArray
                              );
                            }
                          })
                          .then(() => {
                            state.loader = true;
                          });
                      }
                    });
                } else state.loader = true;
              });
            }
          });
        })
        .catch((error) => {
          state.loader = true;
          console.log(error);
        });
    },
    async getCreateLogicalData({ dispatch, state }) {
      return await api
        .get('/redfish/v1/Systems/system/Storage')
        .then((response) =>
          response.data.Members.map(
            (storageInterface) => storageInterface['@odata.id']
          )
        )
        .then((storageInterfaceIds) => {
          state.totalLogicalCount = 0;
          state.logicalRaidID = [];
          state.PhysicalDriveData = [];
          state.occupiedDriveId = [];
          storageInterfaceIds.map((storageInterface) => {
            if (
              storageInterface.indexOf('Raid') != -1 ||
              storageInterface.indexOf('mscc') != -1
            ) {
              state.gInfo = [];
              api.get(storageInterface).then((storageInterfacesData) => {
                if (storageInterfacesData.data.Drives.length) {
                  state.logicalRaidID.push(storageInterface.split('/').pop());
                }
                if (storageInterfacesData.data.Volumes) {
                  state.totalLogicalCount =
                    storageInterfacesData.data.Volumes.length;
                  state.gInfo.push(storageInterfacesData.data);
                  api
                    .get(storageInterfacesData.data.Volumes['@odata.id'])
                    .then((logicalInterface) => {
                      const PdList = [];
                      logicalInterface.data.Members.map((logicalInterface) => {
                        api
                          .get(logicalInterface['@odata.id'])
                          .then((logicalData) => {
                            logicalData.data.Oem.OpenBmc.PdList.forEach(
                              (pdId) => {
                                PdList.push(pdId);
                              }
                            );
                            return logicalData.data;
                          });
                      });
                      state.occupiedDriveId.push(PdList);
                    });
                }
                if (storageInterfacesData.data.Drives.length) {
                  let physicalDevice = [];
                  storageInterfacesData.data.Drives.forEach((drive) => {
                    physicalDevice.push(dispatch('physicalDevice', drive));
                  });
                  api.all(physicalDevice).then((response) => {
                    state.PhysicalDriveData.push(response);
                  });
                }
              });
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async saveNewLogicalDevice({ state }, { createData, raidController }) {
      var uri = '';
      state.gInfo.forEach((raidData) => {
        if (raidController == raidData['@odata.id'].split('/').pop()) {
          uri = raidData.Actions.Oem['#StorageCollection.CreateDrive'].target;
        }
      });
      return await api
        .post(uri, createData)
        .then((response) => {
          return response.data['@odata.id'];
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageLogicalDevice.toast.errorCreateLogicalDevice')
          );
        });
    },
    async checkStatus(_, uri) {
      return await api.get(uri).then((response) => {
        if (response.data.TaskState !== 'New') {
          return response.data.TaskState;
        }
      });
    },
    async deleteLogicalDevice(_, { raidId, lDriveId }) {
      const uri =
        raidId.indexOf('mscc') != -1
          ? '/redfish/v1/Systems/system/Storage/' +
            raidId +
            '/Actions/StorageMSCCLDrive.Delete'
          : '/redfish/v1/Systems/system/Storage/' +
            raidId +
            '/Actions/StorageLDrive.Delete';
      const payload =
        raidId.indexOf('mscc') != -1
          ? { LogicalDriveId: JSON.parse(lDriveId) }
          : { LDriveId: lDriveId };
      return await api
        .post(uri, payload)
        .then((response) => {
          return response.data['@odata.id'];
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageLogicalDevice.toast.errorDeleteLogicalDevice')
          );
        });
    },
  },
};

export default RaidStore;
