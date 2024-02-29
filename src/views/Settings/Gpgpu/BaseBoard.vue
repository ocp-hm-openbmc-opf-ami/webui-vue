<template>
  <b-tabs active-nav-item-class="font-weight-bold" card content-class="xl-12">
    <b-tab :title="$t('gpgpu.baseboard.baseBoardInterfaceAssemblyTab')">
      <gpgpu-list-table
        :fields="baseboard_infofields"
        :data-items="baseboard_info"
        :title="
          $t('gpgpu.baseboard.baseBoardInterfaceBaseBoardAssemblyContentTitle')
        "
      ></gpgpu-list-table>
    </b-tab>
    <b-tab :title="$t('gpgpu.baseboard.baseBoardInterfaceSensorsTab')">
      <gpgpu-list-table
        :fields="baseboard_sensorfields"
        :data-items="baseboard_sensor"
        :title="
          $t('gpgpu.baseboard.baseBoardInterfaceChassisSensorsInfoContentTitle')
        "
      ></gpgpu-list-table>
    </b-tab>
  </b-tabs>
</template>
<script>
import GpgpuListTable from './GpgpuListTable.vue';
export default {
  components: {
    GpgpuListTable,
  },
  data() {
    return {
      baseboard_infofields: [
        'Id',
        'SerialNumber',
        'PartNumber',
        'ProductionDate',
        'Vendor',
        'Model',
      ],
      baseboard_sensorfields: [
        'Name',
        'ReadingType',
        'ReadingUnits',
        'Reading',
      ],
      baseboard_info: [
        {
          Id: '0',
          SerialNumber: '1234567890123',
          PartNumber: '753-24351-0000-000',
          ProductionDate: 'Thu Jan  5 21:30:00 2023\n',
          Vendor: 'NVIDIA',
          Model: 'P4351',
        },
        {
          Id: '1',
          SerialNumber: '1234567890123',
          PartNumber: '675-24351-2000-EVT',
          ProductionDate: 'NA',
          Vendor: 'NA',
          Model: 'NA',
        },
      ],
      baseboard_sensor: [
        {
          Name: 'Inlet_Sensor_2',
          ReadingType: 'Temperature',
          ReadingUnits: 'Cel',
          Reading: '25',
        },
        {
          Name: 'PCB_Sensor_2',
          ReadingType: 'Temperature',
          ReadingUnits: 'Cel',
          Reading: '32',
        },
        {
          Name: 'Inlet_Sensor_3',
          ReadingType: 'Temperature',
          ReadingUnits: 'Cel',
          Reading: '30',
        },
        {
          Name: 'PCB_Sensor_4',
          ReadingType: 'Temperature',
          ReadingUnits: 'Cel',
          Reading: 'NA',
        },
        {
          Name: 'PCB_Sensor_1',
          ReadingType: 'Temperature',
          ReadingUnits: 'Cel',
          Reading: '29',
        },
        {
          Name: 'PCB_Sensor_3',
          ReadingType: 'Temperature',
          ReadingUnits: 'Cel',
          Reading: '31',
        },
        {
          Name: 'Inlet_Sensor_4',
          ReadingType: 'Temperature',
          ReadingUnits: 'Cel',
          Reading: '31',
        },
        {
          Name: 'Inlet_Sensor_1',
          ReadingType: 'Temperature',
          ReadingUnits: 'Cel',
          Reading: '24',
        },
      ],
      selectbaseboardAssemblyDevice: '',
      baseboardAssemblyOptions: [],
      //baseboard Chassis
      baseboardChassisOptions: [],
      baseboardChassisinfo: [],
      baseboardChassisSensorInfo: [],
      selectbaseboardChassisDevice: '',
    };
  },
};
</script>
