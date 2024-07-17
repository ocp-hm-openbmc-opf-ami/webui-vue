<template>
  <b-container fluid="xl">
    <page-title />
    <div v-if="!networkLinkFeatureStatus">
      <b-alert show variant="danger">{{
        $t('networkLink.networkLinkFeatureNotAvailable')
      }}</b-alert>
    </div>
    <div v-else>
      <b-row class="align-items-end form-background p-3">
        <b-col xl="6" class="align-items-end">
          <b-alert v-if="sameNetworkLink" show variant="warning">{{
            $t('networkLink.sameNetworkLinkSettings')
          }}</b-alert>
          <b-alert v-if="disabledNetworkLinkStatus" show variant="warning">{{
            $t('networkLink.modifyNetworkLinkSettings')
          }}</b-alert>
          <b-form id="form-networkLink">
            <b-row>
              <b-col sm="6">
                <b-form-group
                  :label="$t('networkLink.lanInterface')"
                  label-for="lanInterface"
                >
                  <b-form-select
                    id="protocol"
                    v-model="form.lanInterface"
                    class="input"
                    :options="linkInterfaceOptions"
                    data-test-id="lanInterface-option"
                    :state="getValidationState($v.form.lanInterface)"
                    @change="onChangeSelect"
                  ></b-form-select>
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.form.lanInterface.required">
                      {{ $t('global.form.fieldRequired') }}
                    </template>
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col sm="6">
                <b-form-group
                  class="mb-3"
                  :label="$t('networkLink.autonegotiation')"
                >
                  <b-form-checkbox
                    id="autoNegotiation"
                    v-model="form.AutoNeg"
                    data-test-id="networklink-autoNegotiation"
                    switch
                  >
                  </b-form-checkbox>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col sm="6">
                <b-form-group
                  :label="$t('networkLink.linkSpeed')"
                  label-for="linkSpeed"
                >
                  <div v-if="!form.AutoNeg">
                    <b-form-select
                      id="protocol"
                      v-model="form.SpeedMbps"
                      class="input"
                      :options="linkLinkSpeedOptions"
                      data-test-id="bondInterface-option"
                      :state="getValidationState($v.form.SpeedMbps)"
                      ><template #first>
                        <b-form-select-option :value="valueDefault" disabled>
                          {{ $t('global.form.selectAnOption') }}
                        </b-form-select-option>
                      </template></b-form-select
                    >
                    <b-form-invalid-feedback role="alert">
                      <template v-if="!$v.form.SpeedMbps.required">
                        {{ $t('global.form.fieldRequired') }}
                      </template>
                    </b-form-invalid-feedback>
                  </div>
                  <div v-else>
                    <span>
                      {{ speedMbpsLabel }} {{ $t('networkLink.Mbps') }}
                    </span>
                  </div>
                </b-form-group>
              </b-col>
              <b-col sm="6">
                <b-form-group :label="$t('networkLink.duplexMode')">
                  <b-form-radio-group
                    v-if="!form.AutoNeg"
                    v-model="form.FullDuplex"
                    stacked
                  >
                    <div>
                      <b-form-radio value="Full" class="mr10 radio-inline">
                        {{ $t('networkLink.fullDuplex') }}</b-form-radio
                      >
                      <b-form-radio value="Half" class="mr10 radio-inline">{{
                        $t('networkLink.halfDuplex')
                      }}</b-form-radio>
                    </div>
                  </b-form-radio-group>
                  <span v-else
                    >{{ form.FullDuplex }} {{ $t('networkLink.duplex') }}</span
                  >
                </b-form-group>
              </b-col>
            </b-row>
            <b-button
              form="form-networLink"
              type="submit"
              variant="primary"
              :disabled="disabledNetworkLinkStatus"
              @click="onSave"
            >
              {{ $t('global.action.save') }}
            </b-button>
          </b-form>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>
<script>
import PageTitle from '@/components/Global/PageTitle';
import LoadingBarMixin, { loading } from '@/components/Mixins/LoadingBarMixin';
import { required, requiredIf } from 'vuelidate/lib/validators';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import _ from 'lodash';
import { mapState } from 'vuex';
export default {
  components: {
    PageTitle,
  },
  mixins: [LoadingBarMixin, VuelidateMixin, BVToastMixin],
  data() {
    return {
      valueDefault: '',
      loading,
      form: {
        AutoNeg: '',
        SpeedMbps: '',
        FullDuplex: '',
        lanInterface: '',
      },
      networkLinkoldVal: {},
      linkInterfaceOptions: [],
      InterfaceOptionData: [],
      linkLinkSpeedOptions: [
        {
          text: '100 Mbps',
          value: 100,
        },
        {
          text: '10 Mbps',
          value: 10,
        },
      ],
      networkLinkData: [],
      sameNetworkLink: false,
      speedMbpsLabel: '',
      disabledNetworkLinkStatus: false,
      networkLinkFeatureStatus: true,
    };
  },
  computed: {
    ...mapState('networkLink', ['interfaceData']),
    enabledinputfield() {
      if (!this.form.enableBonding || this.checkBondStatus) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    interfaceData() {
      this.getInterfaceInfo();
    },
  },
  created() {
    this.startLoader();
    this.$store.dispatch('networkLink/getNetworkEthernetData').finally(() => {
      this.endLoader();
    });
  },
  validations() {
    return {
      form: {
        lanInterface: {
          required,
        },
        SpeedMbps: {
          required: requiredIf(function (form) {
            if (!form.AutoNeg && !this.disabledNetworkLinkStatus) {
              return true;
            }
          }),
        },
      },
    };
  },
  methods: {
    getInterfaceInfo() {
      this.InterfaceOptionData =
        this.$store.getters['networkLink/getInterfaceData'];
      this.InterfaceOptionData.forEach((val) => {
        if (!val.includes('usb')) {
          let interfaceoptions = {
            text: val,
            value: val,
          };
          this.linkInterfaceOptions.push(interfaceoptions);
        }
      });

      this.onChangeSelect(this.linkInterfaceOptions[0].value);
    },
    onChangeSelect(selectedVal) {
      this.startLoader();
      this.$store
        .dispatch('networkLink/getInterfaceNetworkLinkData', selectedVal)
        .then(() => {
          this.networkLinkData =
            this.$store.getters['networkLink/getNetworkLinkData'];
          if (
            this.networkLinkData.Oem?.Ami?.NCSIConfiguration?.IsNCSI ==
            undefined
          ) {
            this.networkLinkFeatureStatus = false;
          }
          this.form = {
            AutoNeg: this.networkLinkData.AutoNeg,
            lanInterface: selectedVal,
            SpeedMbps: '',
          };
          this.speedMbpsLabel = this.networkLinkData.SpeedMbps;
          if (
            !this.networkLinkData.AutoNeg &&
            (this.networkLinkData.SpeedMbps == 10 ||
              this.networkLinkData.SpeedMbps == 100)
          ) {
            this.form.SpeedMbps = this.networkLinkData.SpeedMbps;
          }
          if (this.networkLinkData.FullDuplex) {
            this.form.FullDuplex = 'Full';
          } else {
            this.form.FullDuplex = 'Half';
          }
          this.networkLinkoldVal = _.cloneDeep(this.form);
          if (
            this.networkLinkData.VLAN?.VLANEnable ||
            this.networkLinkData.Oem?.Ami?.BondConfiguration
          ) {
            this.disabledNetworkLinkStatus = true;
          } else {
            this.disabledNetworkLinkStatus = false;
          }
        })
        .finally(() => {
          this.endLoader();
        });
    },
    onSave() {
      if (!this.disabledNetworkLinkStatus) {
        this.$v.$touch();
        if (this.$v.$invalid) return;
        let networkInterfaceLink = {};
        if (
          JSON.stringify(this.form) !== JSON.stringify(this.networkLinkoldVal)
        ) {
          this.startLoader();
          if (this.form.AutoNeg) {
            networkInterfaceLink.AutoNeg = this.form.AutoNeg;
          } else {
            networkInterfaceLink = _.cloneDeep(this.form);
            networkInterfaceLink.FullDuplex =
              this.form.FullDuplex == 'Full' ? true : false;
          }
          const selectedLanInterface = this.form.lanInterface;
          delete networkInterfaceLink.lanInterface;
          this.$store
            .dispatch('networkLink/setInterfaceNetworkLinkData', {
              networkInterfaceLink,
              selectedLanInterface,
            })
            .then((success) => {
              this.successToast(success);
              this.networkLinkoldVal = {};
              this.onChangeSelect(selectedLanInterface);
            })
            .catch(({ message }) => {
              this.errorToast(message);
              this.endLoader();
            });
        } else {
          this.sameNetworkLink = true;
          setTimeout(() => {
            this.sameNetworkLink = false;
          }, 3000); // Show same Network Link Configuration information for 5 seconds.
        }
      }
    },
  },
};
</script>
<style scoped>
.radio-inline {
  display: inline-block;
}
.mr10 {
  margin-right: 10px;
}
</style>
