<template>
  <b-container fluid="xl">
    <page-title />
    <b-form class="form">
      <b-row v-if="true">
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
              v-model="prl"
              :options="raidLevelOptions"
              @change="changeRaidLevel"
            >
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group
            v-if="isSpanDepth"
            :label="$t('pageLogicalDevice.spanDepth')"
            label-for="spanDepth"
          >
            <b-form-input
              id="spanDepth"
              v-model="spanDepth"
              type="number"
              :state="getValidationState($v.spanDepth)"
              @input="$v.spanDepth.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.spanDepth.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group
            v-if="isNumberOfDrives"
            :label="$t('pageLogicalDevice.numberOfDrives')"
            label-for="numberOfDrives"
          >
            <b-form-input
              id="numberOfDrives"
              v-model="numberOfDrives"
              type="number"
              :state="getValidationState($v.numberOfDrives)"
              @input="$v.numberOfDrives.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.numberOfDrives.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group
            :label="$t('pageLogicalDevice.virtualDeviceName')"
            label-for="virtualDeviceName"
          >
            <b-form-input
              id="virtualDeviceName"
              v-model="virtualDeviceName"
              type="text"
            />
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group
            :label="$t('pageLogicalDevice.initState')"
            label-for="initState"
          >
            <b-form-select
              id="initState"
              v-model="initState"
              :options="initStateOptions"
            >
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group
            :label="$t('pageLogicalDevice.stripeSize')"
            label-for="stripeSize"
          >
            <b-form-input
              id="stripeSize"
              v-model="stripeSize"
              type="number"
              :state="getValidationState($v.stripeSize)"
              @input="$v.stripeSize.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.stripeSize.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group
            :label="$t('pageLogicalDevice.readPolicy')"
            label-for="readPolicy"
          >
            <b-form-select
              id="readPolicy"
              v-model="readPolicy"
              :options="readPolicyOptions"
            >
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group
            :label="$t('pageLogicalDevice.writePolicy')"
            label-for="writePolicy"
          >
            <b-form-select
              id="writePolicy"
              v-model="writePolicy"
              :options="writePolicyOptions"
            >
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group
            :label="$t('pageLogicalDevice.ioPolicy')"
            label-for="ioPolicy"
          >
            <b-form-select
              id="ioPolicy"
              v-model="ioPolicy"
              :options="ioPolicyOptions"
            >
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group
            :label="$t('pageLogicalDevice.accessPolicy')"
            label-for="accessPolicy"
          >
            <b-form-select
              id="accessPolicy"
              v-model="accessPolicy"
              :options="accessPolicyOptions"
            >
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group
            :label="$t('pageLogicalDevice.diskCacheCapacity')"
            label-for="diskCacheCapacity"
          >
            <b-form-select
              id="diskCacheCapacity"
              v-model="diskCacheCapacity"
              :options="diskCacheCapacityOptions"
            >
            </b-form-select>
          </b-form-group>
        </b-col>
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
  name: 'BrcmCreateLogicalStorage',
  components: { PageTitle },
  mixins: [LoadingBarMixin, BVToastMixin, VuelidateMixin],
  validations: {
    unConfiguredPhysicalDevice: {
      required,
    },
    spanDepth: {
      required,
    },
    numberOfDrives: {
      required,
    },
    stripeSize: {
      required,
    },
  },
  data() {
    return {
      LDName: '',
      onCreateBtnDisable: false,
      isSpanDepth: false,
      isNumberOfDrives: false,
      virtualDeviceName: '',
      raidController: '',
      prl: 0,
      spanDepth: '',
      numberOfDrives: '',
      initState: 0,
      stripeSize: 0,
      readPolicy: 0,
      writePolicy: 0,
      ioPolicy: 0,
      accessPolicy: 0,
      diskCacheCapacity: 0,
      unConfiguredPhysicalDevice: [],
      raidLevelOptions: [
        { value: '0', text: 'RAID0' },
        { value: '1', text: 'RAID1' },
        { value: '2', text: 'RAID5' },
        { value: '3', text: 'RAID6' },
        { value: '4', text: 'RAID IE (RLQ = 1)' },
        { value: '5', text: 'RAID 1E (RLQ = 0)' },
        { value: '6', text: 'RAID IE0 (RLQ = 0)' },
        { value: '7', text: 'RAID00' },
        { value: '8', text: 'RAID10' },
        { value: '9', text: 'RAID50' },
        { value: '10', text: 'RAID60' },
      ],
      initStateOptions: [
        {
          value: '0',
          text: this.$t('pageLogicalDevice.initStateOptions.noInitialization'),
        },
        {
          value: '1',
          text: this.$t(
            'pageLogicalDevice.initStateOptions.quickInitialization'
          ),
        },
        {
          value: '2',
          text: this.$t(
            'pageLogicalDevice.initStateOptions.fastInitialization'
          ),
        },
      ],
      readPolicyOptions: [
        {
          value: '0',
          text: this.$t('pageLogicalDevice.readPolicyOptions.noReadAhead'),
        },
        {
          value: '1',
          text: this.$t('pageLogicalDevice.readPolicyOptions.alwaysReadAhead'),
        },
      ],
      writePolicyOptions: [
        {
          value: '0',
          text: this.$t('pageLogicalDevice.writePolicyOptions.writeThrough'),
        },
        {
          value: '1',
          text: this.$t('pageLogicalDevice.writePolicyOptions.alwaysWriteBack'),
        },
        {
          value: '2',
          text: this.$t(
            'pageLogicalDevice.writePolicyOptions.writeBackWithBBU'
          ),
        },
      ],
      ioPolicyOptions: [
        {
          value: '0',
          text: this.$t('pageLogicalDevice.ioPolicyOptions.directIO'),
        },
        {
          value: '1',
          text: this.$t('pageLogicalDevice.ioPolicyOptions.cachedIO'),
        },
      ],
      accessPolicyOptions: [
        {
          value: '0',
          text: this.$t('pageLogicalDevice.accessPolicyOptions.readWrite'),
        },
        {
          value: '1',
          text: this.$t('pageLogicalDevice.accessPolicyOptions.readOnly'),
        },
        {
          value: '2',
          text: this.$t('pageLogicalDevice.accessPolicyOptions.blocked'),
        },
      ],
      diskCacheCapacityOptions: [
        {
          value: '0',
          text: this.$t('pageLogicalDevice.diskCacheCapacityOptions.unchanged'),
        },
        {
          value: '1',
          text: this.$t('pageLogicalDevice.diskCacheCapacityOptions.enabled'),
        },
        {
          value: '2',
          text: this.$t('pageLogicalDevice.diskCacheCapacityOptions.disabled'),
        },
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
      let spanDept = 1;
      let numberOfDrives = 0;
      if (this.prl >= 7 && this.prl <= 10) {
        if (this.spanDepth != 2) {
          this.errorToast(
            this.$t('pageLogicalDevice.toast.errorMinMaxSpanDepth')
          );
          return;
        }
        if (
          this.unConfiguredPhysicalDevice.length !=
          this.spanDepth * this.numberOfDrives
        ) {
          this.errorToast(
            this.$t('pageLogicalDevice.toast.errorSpanDepthDrives')
          );
          return;
        }
        spanDept = parseInt(this.spanDepth);
        numberOfDrives = parseInt(this.numberOfDrives);
      } else {
        numberOfDrives = this.unConfiguredPhysicalDevice.length;
      }
      if (numberOfDrives > this.unConfiguredPhysicalDevice.length) {
        this.errorToast(
          this.$t('pageLogicalDevice.toast.errorNumberOfDrivesValidation')
        );
        return;
      }
      var createData = {
        CmdParm: 1,
        Prl: parseInt(this.prl),
        StripeSize: parseInt(this.stripeSize),
        InitState: parseInt(this.initState),
        DiskCachePolicy: parseInt(this.diskCacheCapacity),
        Readpolicy: parseInt(this.readPolicy),
        Writepolicy: parseInt(this.writePolicy),
        Iopolicy: parseInt(this.ioPolicy),
        Accesspolicy: parseInt(this.accessPolicy),
        SpanDepth: spanDept,
        VDName: this.getNameInDecimal(this.virtualDeviceName),
        SizeLow: 0,
        SizeHigh: 0,
        NumDrives: numberOfDrives,
        Accelerator: 0,
        ParityGroupCount: 0,
        ArrayNumber: 0,
        SpanID: this.getSpanID(this.unConfiguredPhysicalDevice, spanDept),
        DeviceID: this.intArrayValue(this.unConfiguredPhysicalDevice),
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
    checkStatus(data) {
      var interval = setInterval(() => {
        this.$store.dispatch('raid/checkStatus', data).then((response) => {
          if (response) {
            clearInterval(interval);
            let title = '';
            let message = '';
            if (response == 'SUCCESS') {
              setTimeout(() => {
                this.endLoader();
                title = this.$tc('global.action.success');
                message = this.$tc(
                  'pageLogicalDevice.toast.successCreateLogicalDevice'
                );
                this.$bvModal
                  .msgBoxOk(message, {
                    title: title,
                  })
                  .then(() => {
                    if (response == 'SUCCESS') {
                      this.$router.push('/raid/logical-device');
                    }
                  });
              }, 15000);
            } else {
              this.endLoader();
              switch (response) {
                case 'RAID_DEVICE_NOT_PRESENT':
                  return this.errorToast(
                    this.$tc(
                      'pageLogicalDevice.toast.errorRaidDeviceNotPresent'
                    )
                  );
                case 'RAID_CTRL_ID_INVALID':
                  return this.errorToast(
                    this.$tc('pageLogicalDevice.toast.errorRaidCtrlIdInvalid')
                  );
                case 'RAID_CTRL_DEVID_INVALID':
                  return this.errorToast(
                    this.$tc(
                      'pageLogicalDevice.toast.errorRaidCtrlDevIdInvalid'
                    )
                  );
                case 'RAID_NO_VIRTUAL_DEVICE_PRESENT':
                  return this.errorToast(
                    this.$tc(
                      'pageLogicalDevice.toast.errorRaidNoVirtualDevicePresent'
                    )
                  );
                case 'RAID_OPERATION_NOT_PERMITTED':
                  return this.errorToast(
                    this.$tc(
                      'pageLogicalDevice.toast.errorRaidOperationNotPermitted'
                    )
                  );
                case 'RAID_UNSUPPORTED_PHYSICAL_DEV':
                  return this.errorToast(
                    this.$tc(
                      'pageLogicalDevice.toast.errorRaidUnsupportedPhysicalDev'
                    )
                  );
                case 'RAID_UNSUPPORTED_LOGICAL_DEV':
                  return this.errorToast(
                    this.$tc(
                      'pageLogicalDevice.toast.errorRaidUnsupportedLogicalDev'
                    )
                  );
                case 'RAID_CONTROLLER_BUSY':
                  return this.errorToast(
                    this.$tc('pageLogicalDevice.toast.errorRaidControllerBusy')
                  );
                default:
                  return this.errorToast(
                    this.$tc('pageLogicalDevice.toast.errorCreateLogicalDevice')
                  );
              }
            }
          }
        });
      }, 5000);
    },
    getSpanID(deviceId, spanDept) {
      var spanIDArray = [];
      if (spanDept < 2) {
        spanIDArray = new Array(deviceId.length + 1)
          .join('0')
          .split('')
          .map(parseFloat);
      } else {
        //spanDept should be 2 for RAID00, RAID10, RAID50, RAID60
        spanIDArray = Array.from({ length: deviceId.length }, (_, index) =>
          index < deviceId.length / spanDept ? 0 : 1
        );
      }
      return spanIDArray;
    },
    intArrayValue(value) {
      var result = [];
      value.forEach((val) => {
        result.push(parseInt(val));
      });
      return result;
    },
    getNameInDecimal(vdName) {
      var tmp = [];
      if (vdName.length) {
        for (var i = 0; i < vdName.length; i++) {
          var decimalVal = vdName.charCodeAt(i);
          tmp.push(decimalVal);
        }
      }
      return tmp;
    },
    changeRaidLevel(prl) {
      if (prl >= 7 && prl <= 10) {
        this.isSpanDepth = true;
        this.isNumberOfDrives = true;
      } else {
        this.isSpanDepth = false;
        this.isNumberOfDrives = false;
      }
    },
    changeRaidController() {
      this.unConfiguredPhysicalDeviceOptions = [];
      let index = 0;
      // let raidLevels = [];
      if (this.gInfo[index].StorageControllers[0].SupportedRAIDTypes) {
        // this.raidLevelOptions.forEach((raidlevel) => {
        //   this.gInfo[index].StorageControllers[0].SupportedRAIDTypes.forEach(
        //     (support) => {
        //       if (raidlevel.text == support) {
        //         raidLevels.push(raidlevel);
        //       }
        //     }
        //   );
        // });
        // this.raidLevelOptions = raidLevels;
      }
      // this.raidLevelOptions = raidLevels;
      // console.log(this.raidLevelOptions);
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
