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
        >
          <b-tab :title="$t('pageSystemInventory.system.system')"
            >{{ $t('pageSystemInventory.system.systemInfo') }} <system></system
          ></b-tab>
          <b-tab :title="$t('pageSystemInventory.processor.processor')">
            {{ $t('pageSystemInventory.processor.processorInfo') }}
            <processor></processor>
          </b-tab>
          <b-tab
            :title="$t('pageSystemInventory.memoryController.memoryController')"
          >
            {{
              $t('pageSystemInventory.memoryController.memoryControllerInfo')
            }}
            <memory-controller></memory-controller>
          </b-tab>
          <b-tab :title="$t('pageSystemInventory.baseBoard.baseBoard')">
            {{ $t('pageSystemInventory.baseBoard.baseBoardInfo')
            }}<baseboard></baseboard
            >{{
              $t('pageSystemInventory.networkInterfaces.networkInterfacesInfo')
            }}
            <network-interfaces></network-interfaces
            >{{
              $t(
                'pageSystemInventory.networkInterfaceIPv6.networkInterfaceIPv6Info',
              )
            }}
            <network-interface-ipv6></network-interface-ipv6
          ></b-tab>
          <b-tab :title="$t('pageSystemInventory.power.power')">
            {{ $t('pageSystemInventory.power.powerInfo')
            }}<power-control></power-control
            >{{ $t('pageSystemInventory.voltage.voltageControlInfo') }}
            <voltage-control></voltage-control
          ></b-tab>
          <b-tab :title="$t('pageSystemInventory.thermal.thermal')">
            {{ $t('pageSystemInventory.thermal.fanINFO') }}
            <thermal></thermal
            >{{ $t('pageSystemInventory.temperature.temperatureInfo') }}
            <temperature></temperature>
          </b-tab>
          <b-tab :title="$t('pageSystemInventory.pcieDevice.pcieDevice')">
            {{ $t('pageSystemInventory.pcieDevice.pcieDeviceInfo')
            }}<pcie-device></pcie-device
          ></b-tab>
          <b-tab :title="$t('pageSystemInventory.pcieFunction.pcieFunction')">
            {{ $t('pageSystemInventory.pcieFunction.pcieFunctionInfo')
            }}<pcie-function></pcie-function>
          </b-tab>
          <b-tab
            v-if="hideTab"
            :title="$t('pageSystemInventory.storage.storage')"
          >
            {{ $t('pageSystemInventory.storage.storageDriveInfo') }}
            <storage-drive></storage-drive>
            {{
              $t('pageSystemInventory.storageController.storageControllerInfo')
            }}
            <storage-controller></storage-controller>
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
import StorageDrive from './StorageDrive.vue';
import StorageController from './StorageController.vue';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
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
    StorageDrive,
    StorageController,
  },
  mixins: [LoadingBarMixin],
  data() {
    return {
      tabIndex: 0,
      hideTab: false,
    };
  },
  created() {
    this.startLoader();
    Promise.all([
      this.$store.dispatch('SystemStore/getSystemsInfo'),
      this.$store.dispatch('SystemStore/getBaseBoardInfo'),
      this.$store.dispatch('SystemStore/getMemoryControllersInfo'),
      this.$store.dispatch('SystemStore/getProcessorsInfo'),
      this.$store.dispatch('SystemStore/getBasebordInfoNetworkInterfacesIpv6'),
      this.$store.dispatch('SystemStore/getBasebordInfoNetworkinterfaces'),
      this.$store.dispatch('SystemStore/getPcieDeviceInfo'),
      this.$store.dispatch('SystemStore/getPcieFunctionInfo'),
      this.$store.dispatch('SystemStore/getPowerInfo'),
      this.$store.dispatch('SystemStore/getTemperatureInfo'),
      this.$store.dispatch('SystemStore/getFansInfo'),
      this.$store.dispatch('SystemStore/getVoltageInfo'),
    ]).finally(() => this.endLoader());
  },
};
</script>
