<template>
  <b-container fluid="xl">
    <div v-if="networkOverlay">
      <b-overlay :show="true" opacity="0.6" no-wrap fixed class="full-overlay">
        <template #overlay>
          <div></div>
        </template>
      </b-overlay>
    </div>
    <page-title />
    <!-- Global settings for all interfaces -->
    <network-global-settings />
    <!-- Interface tabs -->
    <page-section v-show="ethernetData">
      <b-row>
        <b-col>
          <b-card no-body>
            <b-tabs
              active-nav-item-class="font-weight-bold"
              card
              content-class="mt-3"
            >
              <b-tab
                v-for="(data, index) in ethernetData"
                :key="data.Id"
                :title="data.Id"
                @click="getTabIndex(index)"
              >
                <!-- Interface settings -->
                <network-interface-settings
                  :tab-index="tabIndex"
                  :lan-interface-status="enableLANInterface"
                />
                <!-- IPV4 table -->
                <table-ipv-4
                  :tab-index="tabIndex"
                  :lan-interface-status="enableLANInterface"
                  @ipv4EditData="getIpv4EditData"
                  @ipv4TableData="getIpv4TableData"
                  @addIpv4="isAddIpv4"
                  @networkOverlay="isNetworkOverlay"
                />
                <!-- IPV6 table -->
                <table-ipv-6
                  :tab-index="tabIndex"
                  :lan-interface-status="enableLANInterface"
                  @ipv6EditData="getIpv6EditData"
                  @ipv6TableData="getIpv6TableData"
                  @addIpv6="isAddIpv6"
                  @networkOverlay="isNetworkOverlay"
                  @addIpv6TabIndex="isAddIpv6TabIndex"
                  @ipv6DeleteTableData="isIpv6DeleteTableData"
                />
                <!-- Static DNS table -->
                <table-dns
                  :tab-index="tabIndex"
                  :lan-interface-status="enableLANInterface"
                />
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
      </b-row>
    </page-section>
    <!-- Modals -->
    <modal-ipv4
      :default-gateway="defaultGateway"
      :ipv4-data="ipv4Data"
      :add-ipv4="addIpv4"
      @ok="saveIpv4Address"
    />
    <modal-ipv6
      :ipv6-data="ipv6Data"
      :add-ipv6="addIpv6"
      :ipv6-index-value="ipv6IndexValue"
      :modal-success="isIpv6ModalSuccess"
      :tab-index="tabIndex"
      @ok="saveIpv6Address"
      @closeIpv6Modal="isIpv6closeAddModal"
    />
    <modal-dns @ok="saveDnsAddress" />
    <modal-hostname :hostname="currentHostname" @ok="saveSettings" />
    <modal-mac-address :mac-address="currentMacAddress" @ok="saveSettings" />
    <modal-enable-lan
      :modal-success="isModalSuccess"
      :ethernet-data="enableLanNetworkSettings"
      @ok="enableLansave"
      @closeAddModal="iscloseAddModal"
    />
  </b-container>
</template>

<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import DataFormatterMixin from '@/components/Mixins/DataFormatterMixin';
import LoadingBarMixin, { loading } from '@/components/Mixins/LoadingBarMixin';
import ModalMacAddress from './ModalMacAddress.vue';
import ModalHostname from './ModalHostname.vue';
import ModalIpv4 from './ModalIpv4.vue';
import ModalIpv6 from './ModalIpv6.vue';
import ModalDns from './ModalDns.vue';
import NetworkGlobalSettings from './NetworkGlobalSettings.vue';
import NetworkInterfaceSettings from './NetworkInterfaceSettings.vue';
import PageSection from '@/components/Global/PageSection';
import PageTitle from '@/components/Global/PageTitle';
import TableIpv4 from './TableIpv4.vue';
import TableIpv6 from './TableIpv6.vue';
import TableDns from './TableDns.vue';
import ModalEnableLan from './ModalEnableLan.vue';
import { mapState } from 'vuex';
import _ from 'lodash';

export default {
  name: 'Network',
  components: {
    ModalHostname,
    ModalMacAddress,
    ModalIpv4,
    ModalIpv6,
    ModalDns,
    NetworkGlobalSettings,
    NetworkInterfaceSettings,
    PageSection,
    PageTitle,
    TableDns,
    TableIpv4,
    TableIpv6,
    ModalEnableLan,
  },
  mixins: [BVToastMixin, DataFormatterMixin, LoadingBarMixin],
  beforeRouteLeave(to, from, next) {
    this.hideLoader();
    next();
  },
  data() {
    return {
      networkOverlay: false,
      currentHostname: '',
      currentMacAddress: '',
      defaultGateway: '',
      addIpv6: false,
      ipv6Data: null,
      ipv6TableData: [],
      ipv6Index: null,
      addIpv4: false,
      ipv4Data: null,
      ipv4TableData: [],
      ipv4Index: null,
      loading,
      tabIndex: 0,
      isModalSuccess: false,
      interfaceOptions: [],
      ineterfaceOptions: [],
      enableLANInterface: true,
      ipv6IndexValue: {},
      isIpv6ModalSuccess: false,
    };
  },
  computed: {
    ...mapState('network', ['ethernetData', 'enableLanNetworkSettings']),
  },
  watch: {
    ethernetData() {
      this.getModalInfo();
    },
  },
  created() {
    this.startLoader();
    Promise.all([this.$store.dispatch('network/getEthernetData')]).finally(() =>
      this.endLoader(),
    );
  },
  methods: {
    isNetworkOverlay() {
      this.networkOverlay = true;
    },
    isAddIpv6() {
      this.addIpv6 = true;
      this.ipv6Data = null;
      this.ipv6IndexValue = this.ethernetData[this.tabIndex];
    },
    isAddIpv6TabIndex() {
      this.addIpv6 = true;
      this.ipv6Data = null;
      this.ipv6IndexValue = this.ethernetData[this.tabIndex];
    },
    getIpv6TableData(ipv6) {
      this.getTabIndex(this.tabIndex);
      this.ipv6TableData = ipv6;
      this.ipv6Index = null;
      this.ipv6IndexValue = this.ethernetData[this.tabIndex];
    },
    isIpv6DeleteTableData() {
      this.getTabIndex(this.tabIndex);
      this.ipv6IndexValue = this.ethernetData[this.tabIndex];
    },
    getIpv6EditData(index) {
      this.ipv6Data = this.ipv6TableData[index];
      this.ipv6Index = index;
      this.addIpv6 = false;
      this.ipv6IndexValue = this.ethernetData[this.tabIndex];
    },
    isAddIpv4() {
      this.addIpv4 = true;
      this.ipv4Data = null;
    },
    getIpv4TableData(ipv4) {
      this.ipv4TableData = ipv4;
      this.ipv4Index = null;
    },
    getIpv4EditData(index) {
      this.ipv4Data = this.ipv4TableData[index];
      this.ipv4Index = index;
      this.addIpv4 = false;
    },
    getModalInfo() {
      this.defaultGateway =
        this.$store.getters['network/globalNetworkSettings'][
          this.tabIndex
        ].defaultGateway;

      this.currentHostname =
        this.$store.getters['network/globalNetworkSettings'][
          this.tabIndex
        ].hostname;

      this.currentMacAddress =
        this.$store.getters['network/globalNetworkSettings'][
          this.tabIndex
        ].macAddress;
    },
    getTabIndex(selectedIndex) {
      this.tabIndex = selectedIndex;
      this.$store.dispatch('network/setSelectedTabIndex', this.tabIndex);
      this.$store.dispatch(
        'network/setSelectedTabId',
        this.ethernetData[selectedIndex].Id,
      );
      this.getModalInfo();
    },
    saveIpv4Address(modalFormData) {
      this.startLoader();
      if (this.ipv4Index == null) {
        this.ipv4TableData.push(modalFormData);
      } else {
        this.ipv4TableData[this.ipv4Index] = modalFormData;
      }
      const ipv4Array = this.ipv4TableData.map((ipv4) => {
        const { Address, SubnetMask, Gateway } = ipv4;
        return {
          Address,
          SubnetMask,
          Gateway,
        };
      });
      this.$store
        .dispatch('network/editIpv4Address', ipv4Array)
        .then((message) => {
          this.successToast(message);
          this.$bvModal
            .msgBoxOk(this.$tc('pageNetwork.modal.informationMessage'), {
              title: this.$tc('pageNetwork.modal.informatiomTitle'),
            })
            .then((addConfirmed) => {
              if (addConfirmed) {
                this.networkOverlay = true;
                setTimeout(() => {
                  this.$store.dispatch('authentication/customizedResetLogout');
                  window.location.reload();
                }, 2000); // wait to load the session
              }
            });
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    saveIpv6Address(modalFormData) {
      this.startLoader();
      var ipv6AddressDataClone = [];
      ipv6AddressDataClone = _.cloneDeep(this.ipv6TableData);
      if (this.ipv6Index == null) {
        ipv6AddressDataClone.push(modalFormData);
      } else {
        ipv6AddressDataClone[this.ipv6Index] = modalFormData;
      }
      const dhcpv6State = this.ethernetData[this.tabIndex].DHCPv6.OperatingMode;
      const ipv6Data = ipv6AddressDataClone;
      const getOemAmiActions = this.ethernetData[this.tabIndex].Actions?.Oem
        ?.Ami
        ? true
        : false;
      this.$store
        .dispatch('network/saveIpv6Address', {
          dhcpv6State,
          ipv6Data,
          modalFormData,
          getOemAmiActions,
        })
        .then((message) => {
          this.successToast(message);
          this.isIpv6ModalSuccess = true;
          this.$bvModal
            .msgBoxOk(this.$tc('pageNetwork.modal.informationMessage'), {
              title: this.$tc('pageNetwork.modal.informatiomTitle'),
            })
            .then((addConfirmed) => {
              if (addConfirmed) {
                this.networkOverlay = true;
                setTimeout(() => {
                  this.$store.dispatch('authentication/customizedResetLogout');
                  window.location.reload();
                }, 2000); // wait to load the session
              }
            });
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    saveDnsAddress(modalFormData) {
      this.startLoader();
      this.$store
        .dispatch('network/saveDnsAddress', modalFormData)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    saveSettings(modalFormData) {
      this.startLoader();
      this.$store
        .dispatch('network/saveSettings', modalFormData)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    enableLansave(val) {
      this.startLoader();
      this.$store
        .dispatch('network/interfaceEnabledStatus', val)
        .then(() => {
          // this.successToast(message);
          this.$store.dispatch('authentication/customizedResetLogout');
          setTimeout(() => {
            window.location.reload();
          }, 2000); // wait to load the session
          this.isModalSuccess = true;
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    iscloseAddModal(val) {
      this.isModalSuccess = val;
    },
    isIpv6closeAddModal(val) {
      this.isIpv6ModalSuccess = val;
    },
  },
};
</script>
