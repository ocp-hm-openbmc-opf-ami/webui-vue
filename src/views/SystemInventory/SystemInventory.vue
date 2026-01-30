<template>
  <b-container fluid="xl">
    <page-title />
    <div>
      <!-- Tabs with card integration -->
      <b-card no-body>
        <b-tabs
          v-model="tabIndex"
          active-nav-item-class="font-weight-bold"
          card
          content-class="mt-3"
          @input="onTabChange"
        >
          <b-tab :title="$t('pageSystemInventory.system.system')"
            ><b>{{ $t('pageSystemInventory.system.systemInfo') }}</b>
            <system class="mt-2"></system
          ></b-tab>
          <b-tab :title="$t('pageSystemInventory.processor.processor')">
            <b>{{ $t('pageSystemInventory.processor.processorInfo') }}</b>
            <processor class="mt-2"></processor>
            <b>{{ $t('pageSystemInventory.processorFPGA.info') }}</b>
            <fpga class="mt-2"></fpga>
          </b-tab>
          <b-tab
            :title="$t('pageSystemInventory.memoryController.memoryController')"
          >
            <b>{{
              $t('pageSystemInventory.memoryController.memoryControllerInfo')
            }}</b>
            <memory-controller class="mt-2"></memory-controller>
            <b>{{ $t('pageSystemInventory.memoryAssembly.assemblyInfo') }}</b>
            <memory-assembly class="mt-2"></memory-assembly>
            <b>{{
              $t('pageSystemInventory.memoryMetrics.memortMetricsInfo')
            }}</b>
            <memory-metrics class="mt-2"></memory-metrics>
          </b-tab>
          <b-tab :title="$t('pageSystemInventory.baseBoard.baseBoard')">
            <b>{{ $t('pageSystemInventory.baseBoard.baseBoardInfo') }}</b
            ><baseboard class="mt-2"></baseboard
            ><b>{{
              $t('pageSystemInventory.networkInterfaces.networkInterfacesInfo')
            }}</b>
            <network-interfaces class="mt-2"></network-interfaces
            ><b>{{
              $t(
                'pageSystemInventory.networkInterfaceIPv6.networkInterfaceIPv6Info',
              )
            }}</b>
            <network-interface-ipv6 class="mt-2"></network-interface-ipv6
          ></b-tab>
          <b-tab :title="$t('pageSystemInventory.power.power')">
            <template v-if="!isAMDVenicePlatform">
              <b>{{ $t('pageSystemInventory.power.powerInfo') }}</b>
              <power-control class="mt-2"></power-control>
            </template>
            <b>{{ $t('pageSystemInventory.voltage.voltageControlInfo') }}</b>
            <voltage-control class="mt-2"></voltage-control
          ></b-tab>
          <b-tab :title="$t('pageSystemInventory.thermal.thermal')">
            <b>{{ $t('pageSystemInventory.thermal.fanINFO') }}</b>
            <thermal class="mt-2"></thermal
            ><b>{{ $t('pageSystemInventory.temperature.temperatureInfo') }}</b>
            <temperature class="mt-2"></temperature>
          </b-tab>
          <b-tab :title="$t('pageSystemInventory.pcieDevice.pcieDevice')">
            <b>{{ $t('pageSystemInventory.pcieDevice.pcieDeviceInfo') }}</b
            ><pcie-device class="mt-2"></pcie-device
          ></b-tab>
          <b-tab :title="$t('pageSystemInventory.pcieFunction.pcieFunction')">
            <b>{{ $t('pageSystemInventory.pcieFunction.pcieFunctionInfo') }}</b
            ><pcie-function class="mt-2"></pcie-function>
          </b-tab>
          <b-tab :title="$t('pageSystemInventory.storage.storage')">
            <b>{{ $t('pageSystemInventory.storage.storageInfo') }}</b>
            <storage-information class="mt-2"></storage-information>
            <b>{{ $t('pageSystemInventory.storage.storageControllerInfo') }}</b>
            <storage-controller class="mt-2"></storage-controller>
            <b>{{ $t('pageSystemInventory.storage.storageDriveInfo') }}</b>
            <storage-drive class="mt-2"></storage-drive>
            <b>{{ $t('pageSystemInventory.storage.storageVolumeInfo') }}</b>
            <storage-volume class="mt-2"></storage-volume>
            <b>{{ $t('pageSystemInventory.storage.simpleStorageInfo') }}</b>
            <simple-storage class="mt-2"></simple-storage>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </b-container>
</template>
<script>
import PageTitle from '@/components/Global/PageTitle';
import System from './System.vue';
import Processor from './Processor.vue';
import MemoryController from './MemoryController.vue';
import Baseboard from './Baseboard.vue';
import NetworkInterfaces from './NetworkInterfaces.vue';
import NetworkInterfaceIpv6 from './NetworkInterfaceIPv6.vue';
import PowerControl from './PowerControl.vue';
import VoltageControl from './VoltageControl.vue';
import Thermal from './Thermal.vue';
import Temperature from './Temperature.vue';
import PcieDevice from './PcieDevice.vue';
import PcieFunction from './PcieFunction.vue';
import StorageInformation from './StorageInformation.vue';
import StorageController from './StorageController.vue';
import StorageDrive from './StorageDrive.vue';
import StorageVolume from './StorageVolume.vue';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import Fpga from './FPGA.vue';
import MemoryAssembly from './Assembly.vue';
import MemoryMetrics from './MemoryMetrics.vue';
import SimpleStorage from './SimpleStorage.vue';
export default {
  name: 'SystemInventory',
  components: {
    PageTitle,
    System,
    Processor,
    MemoryController,
    Baseboard,
    NetworkInterfaces,
    NetworkInterfaceIpv6,
    PowerControl,
    VoltageControl,
    Thermal,
    Temperature,
    PcieDevice,
    PcieFunction,
    StorageInformation,
    StorageController,
    StorageDrive,
    StorageVolume,
    SimpleStorage,
    Fpga,
    MemoryAssembly,
    MemoryMetrics,
  },
  mixins: [LoadingBarMixin],
  data() {
    return {
      tabIndex: 0,
      hideTab: false,
      isAMDVenicePlatform:
        process.env.VUE_APP_ONETREE_MULTI_HOST_SUPPORT_ENABLED === 'true'
          ? true
          : false,
    };
  },
  created() {
    this.onTabChange(0); // Load first tab initially
  },
  methods: {
    async onTabChange(index) {
      this.startLoader();
      let apiCalls = [];

      // Only call ChassisCollection for tabs that need baseBoardId
      const tabsNeedingChassisCollection = [3, 4, 5]; // Baseboard, Power, Thermal
      if (tabsNeedingChassisCollection.includes(index)) {
        await this.$store.dispatch('SystemStore/ChassisCollection');
      }

      switch (index) {
        case 0: // System
          apiCalls.push(this.$store.dispatch('SystemStore/getSystemsInfo'));
          break;
        case 1: // Processor
          apiCalls.push(
            this.$store.dispatch('SystemStore/getProcessorsInfo'),
            // Add FPGA info if needed
          );
          break;
        case 2: // Memory Controller
          apiCalls.push(
            this.$store.dispatch('SystemStore/getMemoryControllersInfo'),
            // Add MemoryAssembly and MemoryMetrics if needed
          );
          break;
        case 3: // Baseboard
          apiCalls.push(
            this.$store.dispatch('SystemStore/getBaseBoardInfo'),
            this.$store.dispatch(
              'SystemStore/getBasebordInfoNetworkinterfaces',
            ),
            this.$store.dispatch(
              'SystemStore/getBasebordInfoNetworkInterfacesIpv6',
            ),
          );
          break;
        case 4: // Power
          if (!this.isAMDVenicePlatform) {
            apiCalls.push(this.$store.dispatch('SystemStore/getPowerInfo'));
          }
          apiCalls.push(this.$store.dispatch('SystemStore/getVoltageInfo'));
          break;
        case 5: // Thermal
          apiCalls.push(
            this.$store.dispatch('SystemStore/getFansInfo'),
            this.$store.dispatch('SystemStore/getTemperatureInfo'),
          );
          break;
        case 6: // PCIe Device
          apiCalls.push(this.$store.dispatch('SystemStore/getPcieDeviceInfo'));
          break;
        case 7: // PCIe Function
          apiCalls.push(
            this.$store.dispatch('SystemStore/getPcieFunctionInfo'),
          );
          break;
        case 8: // Storage (if shown)
          apiCalls.push(this.$store.dispatch('SystemStore/getStorageInfo'));
          apiCalls.push(
            this.$store.dispatch('SystemStore/getSimpleStorageInfo'),
          );
          break;
        default:
          break;
      }
      try {
        await Promise.all(apiCalls);
      } finally {
        this.endLoader();
      }
    },
  },
};
</script>
