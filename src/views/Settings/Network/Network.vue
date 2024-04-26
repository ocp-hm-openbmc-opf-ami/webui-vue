<template>
  <b-container fluid="xl">
    <div v-if="networkOverlay">
      <b-overlay :show="true" opacity="0.6" no-wrap fixed class="full-overlay">
        <template #overlay>
          <div></div>
        </template>
      </b-overlay>
    </div>
    <page-title :description="$t('pageNetwork.pageDescription')" />
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
                <network-interface-settings :tab-index="tabIndex" />
                <!-- IPV4 table -->
                <table-ipv-4
                  :tab-index="tabIndex"
                  @ipv4EditData="getIpv4EditData"
                  @ipv4TableData="getIpv4TableData"
                  @addIpv4="isAddIpv4"
                  @networkOverlay="isNetworkOverlay"
                />
                <!-- IPV6 table -->
                <table-ipv-6
                  :tab-index="tabIndex"
                  @ipv6EditData="getIpv6EditData"
                  @ipv6TableData="getIpv6TableData"
                  @addIpv6="isAddIpv6"
                />
                <!-- Static DNS table -->
                <table-dns :tab-index="tabIndex" />
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
      @ok="saveIpv6Address"
    />
    <modal-dns @ok="saveDnsAddress" />
    <modal-hostname :hostname="currentHostname" @ok="saveSettings" />
    <modal-mac-address :mac-address="currentMacAddress" @ok="saveSettings" />
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
import { mapState } from 'vuex';

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
    };
  },
  computed: {
    ...mapState('network', ['ethernetData']),
  },
  watch: {
    ethernetData() {
      this.getModalInfo();
    },
  },
  created() {
    this.startLoader();
    Promise.all([this.$store.dispatch('network/getEthernetData')]).finally(() =>
      this.endLoader()
    );
  },
  methods: {
    isNetworkOverlay() {
      this.networkOverlay = true;
    },
    isAddIpv6() {
      this.addIpv6 = true;
      this.ipv6Data = null;
    },
    getIpv6TableData(ipv6) {
      this.ipv6TableData = ipv6;
      this.ipv6Index = null;
    },
    getIpv6EditData(index) {
      this.ipv6Data = this.ipv6TableData[index];
      this.ipv6Index = index;
      this.addIpv6 = false;
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
      this.defaultGateway = this.$store.getters[
        'network/globalNetworkSettings'
      ][this.tabIndex].defaultGateway;

      this.currentHostname = this.$store.getters[
        'network/globalNetworkSettings'
      ][this.tabIndex].hostname;

      this.currentMacAddress = this.$store.getters[
        'network/globalNetworkSettings'
      ][this.tabIndex].macAddress;
    },
    getTabIndex(selectedIndex) {
      this.tabIndex = selectedIndex;
      this.$store.dispatch('network/setSelectedTabIndex', this.tabIndex);
      this.$store.dispatch(
        'network/setSelectedTabId',
        this.ethernetData[selectedIndex].Id
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
              }
            });
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    saveIpv6Address(modalFormData) {
      this.startLoader();
      if (this.ipv6Index == null) {
        this.ipv6TableData.push(modalFormData);
      } else {
        this.ipv6TableData[this.ipv6Index] = modalFormData;
      }
      const dhcpv6State = this.ethernetData[this.tabIndex].DHCPv6.OperatingMode;
      const ipv6Data = this.ipv6TableData;
      this.$store
        .dispatch('network/saveIpv6Address', {
          dhcpv6State,
          ipv6Data,
          modalFormData,
        })
        .then((message) => {
          setTimeout(() => {
            this.$store.dispatch('network/getEthernetData');
            this.endLoader();
            this.successToast(message);
          }, 5000);
        })
        .catch(({ message }) => {
          this.$store.dispatch('network/getEthernetData');
          setTimeout(() => {
            this.endLoader();
            this.errorToast(message);
          }, 7000); // Giving a maximum delay time of 7000 ms due to a network service restart.
        });
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
  },
};
</script>
