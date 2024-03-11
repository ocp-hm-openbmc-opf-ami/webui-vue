import api from '@/store/api';

const NicStore = {
  namespaced: true,
  state: {
    nicData: [],
    nicNetworkAdopter: [],
  },
  getters: {
    getAllNicData: (state) => state.nicData,
    getNicNetworkAdopterData: (state) => state.nicNetworkAdopter,
  },
  mutations: {
    setNicNetworkAdopterData: (state, networkAdopters) =>
      (state.nicNetworkAdopter = networkAdopters),
    setNicDataToView: (state, obj) =>
      (state.nicData = state.nicData.concat(obj)),
    emptyExistingData: (state, data) => (state.nicData = data),
  },
  actions: {
    async getNicData({ dispatch, commit }) {
      return await api
        .get('/redfish/v1/Systems/system/NetworkInterfaces')
        .then((response) =>
          response.data.Members.map((nicInterface) => nicInterface['@odata.id'])
        )
        .then((nicInterfaceIds) =>
          api.all(
            nicInterfaceIds.map((eachNicInterface) => api.get(eachNicInterface))
          )
        )
        .then((nicInterfaceNetworks) => {
          let networkAdopters = nicInterfaceNetworks.map((eachNicNetwork) => {
            return eachNicNetwork.data.Links.NetworkAdapter['@odata.id'];
          });
          commit('emptyExistingData', []);
          console.log(networkAdopters);
          dispatch('getNicNetworkData', networkAdopters);
        });
    },
    async getNicNetworkData({ dispatch }, nicNetworkUrls) {
      api
        .all(nicNetworkUrls.map((nicNetworkUrl) => api.get(nicNetworkUrl)))
        .then((response) => {
          let fwVersion = 'N/A';
          let nicChannels = response.map((eachResponse) => {
            console.log(eachResponse);
            fwVersion = eachResponse.data.Controllers.FirmwarePackageVersion;
            let channelUrl = eachResponse.data.Controllers[0].Links.NetworkPorts.map(
              (each) => {
                return each['@odata.id'];
              }
            );
            console.log(channelUrl);
            let fwVerData = {
              channelUrl: channelUrl,
              fwVersion: fwVersion,
            };
            return fwVerData;
          });
          nicChannels.map((eachChannel) => {
            dispatch('getallNicData', eachChannel);
          });
        });
    },
    async getallNicData({ commit }, Url) {
      api
        .all(Url.channelUrl.map((eachUrl) => api.get(eachUrl)))
        .then((response) => {
          response.map((eachData) => {
            let finalObjWithNicData = {};
            let currentTemperature = 'N/A';
            let firmwareName = 'N/A';
            let deviceId = 'N/A';
            let firmwareVersion = 'N/A';
            let channelCount = 'N/A';
            let NCSIVersion = 'N/A';
            let getBootConfigProperties = 'N/A';
            let getNCCapabilitiesAndSettings = 'N/A';
            let getPFAssignmentProperties = 'N/A';
            let getPackageStatus = 'N/A';
            let getPartitionStatisticsPropertiesnnelCount = 'N/A';
            let getPortConfigurationProperties = 'N/A';
            let MCTP_over_PCIE_EID = 'N/A';
            let MCTP_over_SMBUS_EID = 'N/A';
            let manufacturerId = 'N/A';
            let OEM_Mac_Address = 'N/A';
            let macAddress = 'N/A';
            function checkKeyInObj(obj, key) {
              if (Object.keys(obj).includes(key)) {
                return obj[key];
              }
              return 'N/A';
            }
            if (eachData.data.Oem && eachData.data.Oem.OpenBmc) {
              currentTemperature = checkKeyInObj(
                eachData.data.Oem.OpenBmc,
                'CurrentTemperature'
              );
              firmwareName = checkKeyInObj(
                eachData.data.Oem.OpenBmc,
                'FirmwareName'
              );
              deviceId = checkKeyInObj(eachData.data.Oem.OpenBmc, 'DeviceId');
              firmwareVersion = checkKeyInObj(
                eachData.data.Oem.OpenBmc,
                'FirmwareVersion'
              );
              channelCount = checkKeyInObj(
                eachData.data.Oem.OpenBmc,
                'ChannelCount'
              );
              NCSIVersion = checkKeyInObj(
                eachData.data.Oem.OpenBmc,
                'NCSIVersion'
              );
              getBootConfigProperties = checkKeyInObj(
                eachData.data.Oem.OpenBmc,
                'GetBootConfigProperties'
              );
              getNCCapabilitiesAndSettings = checkKeyInObj(
                eachData.data.Oem.OpenBmc,
                'GetNCCapabilitiesAndSettings'
              );
              getPFAssignmentProperties = checkKeyInObj(
                eachData.data.Oem.OpenBmc,
                'GetPFAssignmentProperties'
              );
              getPackageStatus = checkKeyInObj(
                eachData.data.Oem.OpenBmc,
                'GetPackageStatus'
              );
              getPartitionStatisticsPropertiesnnelCount = checkKeyInObj(
                eachData.data.Oem.OpenBmc,
                'GetPartitionStatisticsProperties'
              );
              getPortConfigurationProperties = checkKeyInObj(
                eachData.data.Oem.OpenBmc,
                'GetPortConfigurationProperties'
              );
              MCTP_over_PCIE_EID = checkKeyInObj(
                eachData.data.Oem.OpenBmc,
                'MCTP_over_PCIE_EID'
              );
              MCTP_over_SMBUS_EID = checkKeyInObj(
                eachData.data.Oem.OpenBmc,
                'MCTP_over_SMBUS_EID'
              );
              manufacturerId = checkKeyInObj(
                eachData.data.Oem.OpenBmc,
                'ManufacturerId'
              );
              OEM_Mac_Address = checkKeyInObj(
                eachData.data.Oem.OpenBmc,
                'OEM_Mac_Address'
              );
              macAddress = eachData.data.Oem.OpenBmc;
              console.log(macAddress);
            }
            finalObjWithNicData['currentTemperature'] = currentTemperature;
            finalObjWithNicData['firmwareName'] = firmwareName;
            finalObjWithNicData['deviceId'] = deviceId;
            finalObjWithNicData['firmwareVersion'] = firmwareVersion;
            finalObjWithNicData['channelCount'] = channelCount;
            finalObjWithNicData['NCSIVersion'] = NCSIVersion;
            finalObjWithNicData[
              'getBootConfigProperties'
            ] = getBootConfigProperties;
            finalObjWithNicData[
              'getNCCapabilitiesAndSettings'
            ] = getNCCapabilitiesAndSettings;
            finalObjWithNicData[
              'getPFAssignmentProperties'
            ] = getPFAssignmentProperties;
            finalObjWithNicData['getPackageStatus'] = getPackageStatus;
            finalObjWithNicData[
              'getPartitionStatisticsPropertiesnnelCount'
            ] = getPartitionStatisticsPropertiesnnelCount;
            finalObjWithNicData[
              'getPortConfigurationProperties'
            ] = getPortConfigurationProperties;
            finalObjWithNicData['MCTP_over_PCIE_EID'] = MCTP_over_PCIE_EID;
            finalObjWithNicData['MCTP_over_SMBUS_EID'] = MCTP_over_SMBUS_EID;
            finalObjWithNicData['manufacturerId'] = manufacturerId;
            finalObjWithNicData['OEM_Mac_Address'] = OEM_Mac_Address;
            finalObjWithNicData['macAddress'] = macAddress;
            finalObjWithNicData['vendorId'] = eachData.data.VendorId
              ? eachData.data.VendorId
              : 'N/A';
            finalObjWithNicData['linkStatus'] = eachData.data.LinkStatus
              ? eachData.data.LinkStatus
              : 'N/A';
            finalObjWithNicData['signalDetected'] = eachData.data.SignalDetected
              ? eachData.data.SignalDetected
              : 'N/A';
            // finalObjWithNicData['currentSpeed'] = eachData.data
            //   .CurrentLinkSpeedMbps
            //   ? eachData.data.CurrentLinkSpeedMbps
            //   : 'N/A';
            finalObjWithNicData['physicalPortNumber'] = eachData.data
              .PhysicalPortNumber
              ? eachData.data.PhysicalPortNumber
              : 'N/A';
            finalObjWithNicData['health'] = eachData.data.Status.Health
              ? eachData.data.Status.Health
              : 'N/A';
            // finalObjWithNicData['macAddress'] = eachData.data.OEM_Mac_Address
            //   ? eachData.data.OEM_Mac_Address
            //   : 'N/A';
            // finalObjWithNicData['firmwareAddress'] = Url.fwVersion
            //   ? Url.fwVersion
            //   : 'N/A';
            console.log(finalObjWithNicData);
            commit('setNicDataToView', finalObjWithNicData);
          });
        });
    },
  },
};

export default NicStore;
