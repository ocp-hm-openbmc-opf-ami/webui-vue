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
          <b-tab :title="$t('pageSystemInventory.Processor.Processor')">
            {{ $t('pageSystemInventory.Processor.ProcessorInfo') }}
            <processor></processor>
          </b-tab>
          <b-tab
            :title="$t('pageSystemInventory.MemoryController.MemoryController')"
          >
            {{
              $t('pageSystemInventory.MemoryController.MemoryControllerInfo')
            }}
            <memory-controller></memory-controller>
          </b-tab>
          <b-tab :title="$t('pageSystemInventory.BaseBoard.BaseBoard')">
            {{ $t('pageSystemInventory.BaseBoard.BaseBoardInfo')
            }}<baseboard></baseboard
            >{{
              $t('pageSystemInventory.NetworkInterfaces.NetworkInterfacesInfo')
            }}
            <network-interfaces></network-interfaces
          ></b-tab>
          <b-tab :title="$t('pageSystemInventory.Power.Power')">
            {{ $t('pageSystemInventory.Power.PowerInfo')
            }}<power-control></power-control
            >{{ $t('pageSystemInventory.Voltage.VoltageControlInfo') }}
            <voltage-control></voltage-control
          ></b-tab>
          <b-tab :title="$t('pageSystemInventory.Thermal.Thermal')">
            {{ $t('pageSystemInventory.Thermal.FanINFO') }}
            <thermal></thermal
            >{{ $t('pageSystemInventory.temperature.temperatureInfo') }}
            <temperature></temperature>
          </b-tab>
          <b-tab :title="$t('pageSystemInventory.PCIEDevice.PCIEDevice')">
            {{ $t('pageSystemInventory.PCIEDevice.PCIEDeviceInfo')
            }}<pcie-device></pcie-device
          ></b-tab>
          <b-tab :title="$t('pageSystemInventory.PCIEFunction.PCIEFunction')">
            {{ $t('pageSystemInventory.PCIEFunction.PCIEFunctionInfo')
            }}<pcie-function></pcie-function>
          </b-tab>
          <b-tab :title="$t('pageSystemInventory.Storage.Storage')">
            {{ $t('pageSystemInventory.Storage.StorageDriveInfo') }}
            <storage-drive></storage-drive>
            {{
              $t('pageSystemInventory.StorageController.StorageControllerInfo')
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
import PowerControl from './PowerControl.vue';
import VoltageControl from './VoltageControl.vue';
import Thermal from './Thermal.vue';
import Temperature from './Temperature.vue';
import PcieDevice from './PcieDevice.vue';
import PcieFunction from './PcieFunction.vue';
import StorageDrive from './StorageDrive.vue';
import StorageController from './StorageController.vue';
export default {
  name: 'SystemInventory',
  components: {
    PageTitle,
    System,
    Processor,
    MemoryController,
    Baseboard,
    NetworkInterfaces,
    PowerControl,
    VoltageControl,
    Thermal,
    Temperature,
    PcieDevice,
    PcieFunction,
    StorageDrive,
    StorageController,
  },
  data() {
    return {
      tabIndex: 0,
    };
  },
};
</script>
