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
import system from './system.vue';
import processor from './processor.vue';
import memoryController from '@/views/SystemInventory/memoryController';
import baseboard from '@/views/SystemInventory/baseboard';
import networkInterfaces from '@/views/SystemInventory/networkInterfaces';
import powercontrol from '@/views/SystemInventory/powercontrol';
import voltagecontrol from '@/views/SystemInventory/voltagecontrol';
import thermal from '@/views/SystemInventory/thermal';
import temperature from '@/views/SystemInventory/temperature';
import pcieDevice from '@/views/SystemInventory/pcieDevice';
import pciefunction from '@/views/SystemInventory/pciefunction';
import storageDrive from './storageDrive.vue';
import storageController from '@/views/SystemInventory/storageController';
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
