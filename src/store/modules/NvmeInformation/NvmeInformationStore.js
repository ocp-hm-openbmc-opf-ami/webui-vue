import api from '@/store/api';
import i18n from '@/i18n';

const NetworkStore = {
  namespaced: true,
  state: {
    nvmeTableData: [],
  },
  getters: {
    nvmeTableData: (state) => state.nvmeTableData,
  },
  mutations: {
    setNvmeTableData: (state, nvmeData) => {
      state.nvmeTableData = nvmeData;
    },
  },
  actions: {
    async getNvmeData({ commit }) {
      const nvme = [];
      console.log(nvme);
      return await api
        .get('/redfish/v1/Systems/system/Storage/Nvme')
        .then((response) => response.data.Controllers['@odata.id'])
        .then((controllersUrl) => {
          api.get(controllersUrl).then(({ data: { Members } }) => {
            Members.forEach((Controllers, index) => {
              api.get(Controllers['@odata.id']).then((response) => {
                const controller = response.data;
                controller.Information = 'NVMe Information ' + (index + 1);
                controller.Manufacturer = response.data.Manufacturer;
                controller.Model = response.data.Model;
                controller.SerialNumber = response.data.SerialNumber;
                controller.PartNumber = response.data.PartNumber;
                controller.NVMe_Powered =
                  response.data.Oem?.Ami.NVMeMISubSystemInformation.SubSystemHealthStatusPoll?.CompositeControllerStatus?.Ready;
                controller.NVMe_Functional =
                  response.data.Oem?.Ami.NVMeMISubSystemInformation.SubSystemHealthStatusPoll?.DriveFunctional;
                controller.Drive_Life_Consumed =
                  response.data.Oem?.Ami.NVMeMISubSystemInformation.SubSystemHealthStatusPoll?.PDLU;
                controller.NVMe_Reset_Required =
                  response.data.Oem?.Ami.NVMeMISubSystemInformation.SubSystemHealthStatusPoll?.ResetNotRequired;
                controller.Port_0_PCIe_Link_Active =
                  response.data.Oem?.Ami.NVMeMISubSystemInformation.SubSystemHealthStatusPoll?.Port0PCIeLinkActive;
                controller.Port_1_PCIe_Link_Active =
                  response.data.Oem?.Ami.NVMeMISubSystemInformation.SubSystemHealthStatusPoll?.Port1PCIeLinkActive;

                api
                  .get(controller.Ports['@odata.id'])
                  .then(({ data: { Members = [] } }) => {
                    let i = 0;
                    Members.forEach((Ports) => {
                      api.get(Ports['@odata.id']).then((response) => {
                        controller['PCIe_0_Link_Speed_' + i] =
                          response.data.Oem?.Ami.PortInformation.CurrentLinkSpeed;
                        controller['PCIe_0_Link_Width_' + i] =
                          response.data.Oem?.Ami.PortInformation.MaxLinkWidth;
                        controller['PCIe_1_Link_Speed_' + i] =
                          response.data.Oem?.Ami.PortInformation.CurrentLinkSpeed;
                        controller['PCIe_1_Link_Width_' + i] =
                          response.data.Oem?.Ami.PortInformation.MaxLinkWidth;
                        i++;
                      });
                    });

                    nvme.push(controller);
                  });
              });
            });
          });
          commit('setNvmeTableData', nvme);
        })
        .catch(() => {
          throw new Error(
            i18n.tc('pageNvmeInformation.toast.errorShowingNVMeInfo')
          );
        });
    },
  },
};

export default NetworkStore;
