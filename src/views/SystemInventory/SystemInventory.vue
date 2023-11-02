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
            <memoryController></memoryController>
          </b-tab>
          <b-tab :title="$t('pageSystemInventory.BaseBoard.BaseBoard')">
            {{ $t('pageSystemInventory.BaseBoard.BaseBoardInfo')
            }}<baseboard></baseboard
            >{{
              $t('pageSystemInventory.NetworkInterfaces.NetworkInterfacesInfo')
            }}
            <networkInterfaces></networkInterfaces
          ></b-tab>
          <b-tab :title="$t('pageSystemInventory.Power.Power')">
            {{ $t('pageSystemInventory.Power.PowerInfo')
            }}<powercontrol></powercontrol
            >{{ $t('pageSystemInventory.Voltage.VoltageControlInfo') }}
            <voltagecontrol></voltagecontrol
          ></b-tab>
          <b-tab :title="$t('pageSystemInventory.Thermal.Thermal')">
            {{ $t('pageSystemInventory.Thermal.FanINFO') }}
            <thermal></thermal
            >{{ $t('pageSystemInventory.temperature.temperatureInfo') }}
            <temperature></temperature>
          </b-tab>
          <b-tab :title="$t('pageSystemInventory.PCIEDevice.PCIEDevice')">
            {{ $t('pageSystemInventory.PCIEDevice.PCIEDeviceInfo')
            }}<pcieDevice></pcieDevice
          ></b-tab>
          <b-tab :title="$t('pageSystemInventory.PCIEFunction.PCIEFunction')">
            {{ $t('pageSystemInventory.PCIEFunction.PCIEFunctionInfo')
            }}<pciefunction></pciefunction>
          </b-tab>
          <b-tab :title="$t('pageSystemInventory.Storage.Storage')">
            {{ $t('pageSystemInventory.Storage.StorageDriveInfo') }}
            <storageDrive></storageDrive>
            {{
              $t('pageSystemInventory.StorageController.StorageControllerInfo')
            }}
            <storageController></storageController>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </b-container>
</template>
<script>
import PageTitle from '@/components/Global/PageTitle';
import system from './System.vue';
import processor from './Processor.vue';
import memoryController from './MemoryController.vue';
import baseboard from './Baseboard.vue';
import networkInterfaces from './NetworkInterfaces.vue';
import powercontrol from './Powercontrol.vue';
import voltagecontrol from './Voltagecontrol.vue';
import thermal from './Thermal.vue';
import temperature from './Temperature.vue';
import pcieDevice from './PcieDevice.vue';
import pciefunction from './Pciefunction.vue';
import storageDrive from './StorageDrive.vue';
import storageController from './StorageController.vue';
export default {
  name: 'SystemInventory',
  components: {
    PageTitle,
    system,
    processor,
    memoryController,
    baseboard,
    networkInterfaces,
    powercontrol,
    voltagecontrol,
    thermal,
    temperature,
    pcieDevice,
    pciefunction,
    storageDrive,
    storageController,
  },
  data() {
    return {
      tabIndex: 0,
    };
  },
};
</script>
