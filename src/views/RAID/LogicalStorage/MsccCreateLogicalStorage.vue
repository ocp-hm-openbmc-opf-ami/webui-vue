<template>
  <b-container fluid="xl">
    <page-title />
    <b-form class="form">
      <b-row>
        <b-col sm="3">
          <b-form-group
            :label="$t('pageLogicalDevice.raidController')"
            label-for="raidController"
          >
            <b-form-select
              id="raidController"
              v-model="raidController"
              :options="logicalRaidID"
              @change="changeRaidController"
            >
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group
            :label="$t('pageLogicalDevice.raidLevel')"
            label-for="raidLevel"
          >
            <b-form-select
              id="raidLevel"
              v-model="RaidLevel"
              :options="raidLevelOptions"
            >
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group
            :label="$t('pageLogicalDevice.logicalDeviceName')"
            label-for="LDName"
          >
            <b-form-input id="LDName" v-model="LDName" type="text" />
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group
            :label="$t('pageLogicalDevice.arrayNumber')"
            label-for="arrayNumber"
          >
            <b-form-input id="arrayNumber" v-model="arrayNumber" type="text" />
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group
            :label="$t('pageLogicalDevice.stripSize')"
            label-for="stripSize"
          >
            <b-form-input
              id="stripSize"
              v-model="stripSize"
              type="number"
              :state="getValidationState($v.stripSize)"
              @input="$v.stripSize.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.stripSize.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group :label="$t('pageLogicalDevice.size')" label-for="size">
            <b-form-input
              id="size"
              v-model="size"
              type="number"
              :state="getValidationState($v.size)"
              @input="$v.size.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.size.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group
            :label="$t('pageLogicalDevice.parityGroupCount')"
            label-for="parityGroupCount"
          >
            <b-form-input
              id="parityGroupCount"
              v-model="parityGroupCount"
              type="number"
              :state="getValidationState($v.parityGroupCount)"
              @input="$v.parityGroupCount.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.parityGroupCount.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col v-if="unConfiguredPhysicalDeviceOptions.length" sm="3">
          <b-form-group
            :label="$t('pageLogicalDevice.unConfiguredPhysicalDrive')"
            label-for="unConfiguredPhysicalDevice"
          >
            <b-form-checkbox-group
              id="unConfiguredPhysicalDevice"
              v-model="unConfiguredPhysicalDevice"
              :options="unConfiguredPhysicalDeviceOptions"
              :state="getValidationState($v.unConfiguredPhysicalDevice)"
              @input="$v.unConfiguredPhysicalDevice.$touch()"
            ></b-form-checkbox-group>
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.unConfiguredPhysicalDevice.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
    <b-row>
      <b-col sm="1">
        <b-button
          variant="primary"
          :disabled="onCreateBtnDisable"
          @click="onCreate"
        >
          {{ $t('global.action.create') }}
        </b-button>
      </b-col>
      <b-col sm="1">
        <b-button variant="primary" to="/raid/logical-device">
          {{ $t('global.action.cancel') }}
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import PageTitle from '@/components/Global/PageTitle';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import { required } from 'vuelidate/lib/validators';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import { mapState } from 'vuex';
export default {
  name: 'MsccCreateLogicalStorage',
  components: { PageTitle },
  mixins: [LoadingBarMixin, BVToastMixin, VuelidateMixin],
  validations: {
    unConfiguredPhysicalDevice: {
      required,
    },
    size: {
      required,
    },
    parityGroupCount: {
      required,
    },
    stripSize: {
      required,
    },
  },
  data() {
    return {
      raidController: '',
      LDName: '',
      RaidLevel: 0,
      stripSize: 0,
      arrayNumber: 0,
      parityGroupCount: 0,
      size: 0,
      onCreateBtnDisable: false,
      unConfiguredPhysicalDevice: [],
      raidLevelOptions: [
        { value: 'RAID0', text: 'RAID0' },
        { value: 'RAID1', text: 'RAID1' },
        { value: 'RAID5', text: 'RAID5' },
        { value: 'RAID6', text: 'RAID6' },
        { value: 'RAIDIE1', text: 'RAID IE (RLQ = 1)' },
        { value: 'RAIDIE', text: 'RAID 1E (RLQ = 0)' },
        { value: 'RAIDIE0', text: 'RAID IE0 (RLQ = 0)' },
        { value: 'RAID00', text: 'RAID00' },
        { value: 'RAID10', text: 'RAID10' },
        { value: 'RAID50', text: 'RAID50' },
        { value: 'RAID60', text: 'RAID60' },
      ],
      unConfiguredPhysicalDeviceOptions: [],
    };
  },
  computed: {
    ...mapState('raid', [
      'gInfo',
      'logicalRaidID',
      'occupiedDriveId',
      'PhysicalDriveData',
    ]),
  },
  watch: {
    logicalRaidID() {
      this.raidController = this.logicalRaidID[0];
    },
    occupiedDriveId() {
      if (this.occupiedDriveId.length) {
        this.changeRaidController();
      }
    },
    PhysicalDriveData() {
      if (this.PhysicalDriveData.length) {
        this.changeRaidController();
      }
    },
  },
  created() {
    this.startLoader();
    Promise.all([
      this.$store.dispatch('raid/getCreateLogicalData'),
    ]).finally(() => this.endLoader());
  },
  methods: {
    onCreate() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      var createData = {
        LDName: this.LDName,
        RaidLevel:
          'com.ami.storage.mscc.ctrl.LogicalDrive.RaidType.' + this.RaidLevel,
        ArrayNumber: parseInt(this.arrayNumber),
        PdList: this.intArrayValue(this.unConfiguredPhysicalDevice),
        StripSize: parseInt(this.stripSize),
        Size: parseInt(this.size),
        ParityGroupCount: parseInt(this.parityGroupCount),
        Accelerator:
          'com.ami.storage.mscc.ctrl.LogicalDrive.LdAccelerator.ControllerCache',
      };
      const raidController = this.raidController;
      this.startLoader();
      this.$store
        .dispatch('raid/saveNewLogicalDevice', {
          createData,
          raidController,
        })
        .then((response) => {
          this.checkStatus(response);
        })
        .catch(({ message }) => {
          this.endLoader();
          this.errorToast(message);
        });
    },
    intArrayValue(value) {
      var result = [];
      value.forEach((val) => {
        result.push(parseInt(val));
      });
      return result;
    },
    changeRaidController() {
      this.unConfiguredPhysicalDeviceOptions = [];
      let index = 0;
      let raidLevels = [];
      if (this.gInfo[index].StorageControllers[0].SupportedRAIDTypes) {
        this.raidLevelOptions.forEach((raidlevel) => {
          this.gInfo[index].StorageControllers[0].SupportedRAIDTypes.forEach(
            (support) => {
              if (raidlevel.text == support) {
                raidLevels.push(raidlevel);
              }
            }
          );
        });
        this.raidLevelOptions = raidLevels;
      }
      this.logicalRaidID.forEach((logical, indexValue) => {
        if (this.raidController == logical) {
          index = indexValue;
        }
      });
      if (this.occupiedDriveId[index].length) {
        this.PhysicalDriveData[index].forEach((PhysicalDriveData) => {
          if (this.occupiedDriveId[index].length) {
            if (
              this.occupiedDriveId[index].length &&
              this.occupiedDriveId[index].indexOf(
                parseInt(PhysicalDriveData.Oem.OpenBmc.PDeviceId)
              ) != -1
            ) {
              return;
            }
          }
          let unConfiguredPhysicalDevice = {
            value: PhysicalDriveData.Oem.OpenBmc.PDeviceId,
            text:
              PhysicalDriveData.Name.split('_')[0] +
              ' (' +
              PhysicalDriveData.Oem.OpenBmc.PDeviceId +
              ')',
          };
          this.unConfiguredPhysicalDeviceOptions.push(
            unConfiguredPhysicalDevice
          );
        });
        if (
          this.PhysicalDriveData[index].length ==
          this.occupiedDriveId[index].length
        ) {
          this.onCreateBtnDisable = true;
          this.$bvModal.msgBoxOk(
            this.$tc('pageLogicalDevice.modal.noPhysicalDeviceAvailable'),
            {
              title: this.$tc('global.action.alert'),
            }
          );
        }
      } else {
        if (this.PhysicalDriveData[index]?.length) {
          this.onCreateBtnDisable = false;
          this.PhysicalDriveData[index].forEach((PhysicalDriveData) => {
            if (this.occupiedDriveId[index].length) {
              if (
                this.occupiedDriveId[index].length &&
                this.occupiedDriveId[index].indexOf(
                  parseInt(PhysicalDriveData.Oem.OpenBmc.PDeviceId)
                ) != -1
              ) {
                return;
              }
            }
            let unConfiguredPhysicalDevice = {
              value: PhysicalDriveData.Oem.OpenBmc.PDeviceId,
              text:
                PhysicalDriveData.Name.split('_')[0] +
                ' (' +
                PhysicalDriveData.Oem.OpenBmc.PDeviceId +
                ')',
            };
            this.unConfiguredPhysicalDeviceOptions.push(
              unConfiguredPhysicalDevice
            );
          });
        }
      }
    },
  },
};
</script>
