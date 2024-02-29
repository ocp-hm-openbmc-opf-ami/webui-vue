<template>
  <b-tabs active-nav-item-class="font-weight-bold" card content-class="xl-12">
    <b-tab :title="$t('gpgpu.tab.gpgpuInterfaceProcessorTab')">
      <b-row>
        <b-col sm="4">
          <b-form-group
            :label="$t('gpgpu.gpgpuDevices')"
            label-for="fpgaProcessor"
          >
            <b-form-select
              id="fpgaProcessor"
              v-model="selectfpgaProcessorDevice"
              :options="fpgaProcessorOptions"
              data-test-id="fpgaProcessor-option"
              @change="fpgaProcessorInfoChange"
            ></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <gpgpu-list-table
        :fields="fpgainfofields"
        :data-items="fpgainfo"
        :title="$t('gpgpu.fpga.fpgaInterfaceFpgaContentTitle')"
      ></gpgpu-list-table>
      <gpgpu-list-table
        :fields="fpgaPortInfofields"
        :data-items="fpgaPortInfo"
        :title="$t('gpgpu.fpga.fpgaInterfaceProcessorPortContentTitle')"
      ></gpgpu-list-table>
    </b-tab>
    <b-tab :title="$t('gpgpu.tab.gpgpuInterfaceChassisTab')">
      <b-row>
        <b-col sm="4">
          <b-form-group
            :label="$t('gpgpu.gpgpuDevices')"
            label-for="fpgaChassis"
          >
            <b-form-select
              id="fpgaChassis"
              v-model="selectfpgaChassisDevice"
              :options="fpgaChassisOptions"
              data-test-id="fpgaChassis-option"
              @change="fpgaChassisInfoChange"
            ></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <gpgpu-list-table
        :fields="fpgaChassisinfofields"
        :data-items="fpgaChassisinfo"
        :title="$t('gpgpu.fpga.fpgaInterfaceFpgaContentTitle')"
      ></gpgpu-list-table>
      <gpgpu-list-table
        :fields="fpgaChassisSensorInfofields"
        :data-items="fpgaChassisSensorInfo"
        :title="$t('gpgpu.fpga.fpgaInterfaceFpgaContentTitle')"
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
      fpgainfofields: ['Id', 'Name', 'FirmwareVersion', 'ProcessorType'],
      fpgaPortInfofields: [
        'Id',
        'Name',
        'CurrentSpeedGbps',
        'ActiveWidth',
        'MetricsId',
        'MetricsName',
        'PCIeErrorsNAKSentCount',
        'PCIeErrorsL0ToRecoveryCount',
        'PCIeErrorsReplayCount',
        'PCIeErrorsNonFatalErrorCount',
        'PCIeErrorsReplayRolloverCount',
        'PCIeErrorsNAKReceivedCount',
        'PCIeErrorsCorrectableErrorCount',
        'PCIeErrorsFatalErrorCount',
      ],
      fpgaChassisinfofields: ['Id', 'Name', 'ResourceExists', 'ChassisType'],
      fpgaChassisSensorInfofields: [
        'Id',
        'Name',
        'ReadingType',
        'ReadingUnits',
        'Reading',
      ],
      fpga_info: [
        {
          Id: 'FPGA_0',
          Name: 'Processor',
          FirmwareVersion: '0.70',
          ProcessorType: 'FPGA',
          fpga_port_info: [
            {
              Id: 'PCIeToHOST_0',
              Name: 'PCIeToHOST_0',
              CurrentSpeedGbps: '1',
              ActiveWidth: '1',
              MetricsId: 'Metrics',
              MetricsName: 'PCIeToHOST_0',
              PCIeErrorsNAKSentCount: '0',
              PCIeErrorsL0ToRecoveryCount: '1',
              PCIeErrorsReplayCount: '0',
              PCIeErrorsNonFatalErrorCount: '1',
              PCIeErrorsReplayRolloverCount: '0',
              PCIeErrorsNAKReceivedCount: '0',
              PCIeErrorsCorrectableErrorCount: '0',
              PCIeErrorsFatalErrorCount: '0',
            },
            {
              Id: 'PCIeToHOST_0',
              Name: 'PCIeToHOST_0',
              CurrentSpeedGbps: '1',
              ActiveWidth: '1',
              MetricsId: 'Metrics',
              MetricsName: 'PCIeToHOST_0',
              PCIeErrorsNAKSentCount: '0',
              PCIeErrorsL0ToRecoveryCount: '1',
              PCIeErrorsReplayCount: '0',
              PCIeErrorsNonFatalErrorCount: '1',
              PCIeErrorsReplayRolloverCount: '0',
              PCIeErrorsNAKReceivedCount: '0',
              PCIeErrorsCorrectableErrorCount: '0',
              PCIeErrorsFatalErrorCount: '0',
            },
          ],
        },
        {
          Id: 'FPGA_1',
          Name: 'Processor',
          FirmwareVersion: '0.70',
          ProcessorType: 'FPGA',
          fpga_port_info: [
            {
              Id: 'PCIeToHOST_1',
              Name: 'PCIeToHOST_1',
              CurrentSpeedGbps: '1',
              ActiveWidth: '1',
              MetricsId: 'Metrics',
              MetricsName: 'PCIeToHOST_0',
              PCIeErrorsNAKSentCount: '0',
              PCIeErrorsL0ToRecoveryCount: '1',
              PCIeErrorsReplayCount: '0',
              PCIeErrorsNonFatalErrorCount: '1',
              PCIeErrorsReplayRolloverCount: '0',
              PCIeErrorsNAKReceivedCount: '0',
              PCIeErrorsCorrectableErrorCount: '0',
              PCIeErrorsFatalErrorCount: '0',
            },
            {
              Id: 'PCIeToHOST_1',
              Name: 'PCIeToHOST_1',
              CurrentSpeedGbps: '1',
              ActiveWidth: '1',
              MetricsId: 'Metrics',
              MetricsName: 'PCIeToHOST_0',
              PCIeErrorsNAKSentCount: '0',
              PCIeErrorsL0ToRecoveryCount: '1',
              PCIeErrorsReplayCount: '0',
              PCIeErrorsNonFatalErrorCount: '1',
              PCIeErrorsReplayRolloverCount: '0',
              PCIeErrorsNAKReceivedCount: '0',
              PCIeErrorsCorrectableErrorCount: '0',
              PCIeErrorsFatalErrorCount: '0',
            },
          ],
        },
      ],
      fpga_chassis: [
        {
          Id: 'Chassis',
          Name: 'FPGA_0',
          ResourceExists: 'true',
          ChassisType: 'Component',
          fpga_sensors_info: [
            {
              Id: 'FPGA_0_TEMP_0',
              Name: 'FPGA_0_TEMP_0',
              ReadingType: 'Temperature',
              ReadingUnits: 'Cel',
              Reading: '7686',
            },
            {
              Id: 'FPGA_0_TEMP_0',
              Name: 'FPGA_0_TEMP_0',
              ReadingType: 'Temperature',
              ReadingUnits: 'Cel',
              Reading: '7686',
            },
          ],
        },
        {
          Id: 'Chassis',
          Name: 'FPGA_1',
          ResourceExists: 'true',
          ChassisType: 'Component',
          fpga_sensors_info: [
            {
              Id: 'FPGA_1_TEMP_0',
              Name: 'FPGA_1_TEMP_0',
              ReadingType: 'Temperature',
              ReadingUnits: 'Cel',
              Reading: '7686',
            },
            {
              Id: 'FPGA_1_TEMP_0',
              Name: 'FPGA_1_TEMP_0',
              ReadingType: 'Temperature',
              ReadingUnits: 'Cel',
              Reading: '7686',
            },
          ],
        },
      ],
      //fpga Info
      fpgainfo: [],
      fpgaPortInfo: [],
      selectfpgaProcessorDevice: '',
      fpgaProcessorOptions: [],
      //fpga Chassis
      fpgaChassisOptions: [],
      fpgaChassisinfo: [],
      fpgaChassisSensorInfo: [],
      selectfpgaChassisDevice: '',
    };
  },
  created() {
    this.iteam();
  },
  methods: {
    iteam() {
      this.fpgaProcessorOptionBind();
      this.fpgaChassisOptionBind();
    },
    //fpga Info
    fpgaProcessorOptionBind() {
      this.fpga_info.forEach((val) => {
        if (this.fpga_info.length > 0) {
          let fpgaOptionsVal = {
            value: val.Id,
            text: val.Id,
          };
          this.fpgaProcessorOptions.push(fpgaOptionsVal);
          this.selectfpgaProcessorDevice = this.fpgaProcessorOptions[0].value;
          this.fpgaProcessorInfoChange(this.selectfpgaProcessorDevice);
        }
      });
    },
    fpgaProcessorInfoChange(selectedval) {
      this.fpgainfo = [];
      this.fpgaPortInfo = [];
      this.fpga_info.forEach((val) => {
        if (selectedval == val.Id) {
          if (this.fpga_info.length > 0) {
            let fpga_info = {
              Id: val.Id,
              Name: val.Name,
              FirmwareVersion: val.FirmwareVersion,
              ProcessorType: val.ProcessorType,
            };
            this.fpgainfo.push(fpga_info);
            this.fpgaPortInfo = val.fpga_port_info;
          }
        }
      });
    },
    fpgaChassisOptionBind() {
      this.fpga_chassis.forEach((val) => {
        if (this.fpga_chassis.length > 0) {
          let fpgaOptionsVal = {
            value: val.Name,
            text: val.Name,
          };
          this.fpgaChassisOptions.push(fpgaOptionsVal);
          this.selectfpgaChassisDevice = this.fpgaChassisOptions[0].value;
          this.fpgaChassisInfoChange(this.selectfpgaChassisDevice);
        }
      });
    },
    fpgaChassisInfoChange(selectedval) {
      this.fpgaChassisinfo = [];
      this.fpgaChassisSensorInfo = [];
      this.fpga_chassis.forEach((val) => {
        if (selectedval == val.Name) {
          if (this.fpga_chassis.length > 0) {
            let fpga_Chassis_info = {
              Id: val.Id,
              Name: val.Name,
              ResourceExists: val.ResourceExists,
              ChassisType: val.ChassisType,
            };
            this.fpgaChassisinfo.push(fpga_Chassis_info);
            this.fpgaChassisSensorInfo = val.fpga_sensors_info;
          }
        }
      });
    },
  },
};
</script>
