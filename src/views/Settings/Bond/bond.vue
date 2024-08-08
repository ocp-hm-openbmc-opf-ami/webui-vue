<template>
  <b-container fluid="xl">
    <page-title />
    <div v-if="!enabledNetworkBond">
      <b-alert show variant="danger">{{
        $t('bond.featureNotAvailable')
      }}</b-alert>
    </div>
    <div v-else-if="interfacechecking">
      <b-col xl="6" class="p0">
        <b-alert show variant="warning">{{
          $t('bond.BondWithSingleInterface')
        }}</b-alert>
      </b-col>
    </div>
    <div v-else>
      <b-col xl="6" class="p0">
        <b-alert v-if="sameBondSettings" show variant="warning">{{
          $t('bond.sameBondSettings')
        }}</b-alert>
      </b-col>
      <b-row class="align-items-end">
        <b-col xl="6">
          <b-form id="form-enableBond">
            <b-row>
              <b-col sm="6">
                <b-form-group class="mb-3" :label="$t('bond.enableBonding')">
                  <b-form-checkbox
                    id="enableBonding"
                    v-model="form.enableBonding"
                    data-test-id="networkbond-enableBonding"
                    :disabled="bondInterfaceOptions.length <= 1"
                    switch
                  >
                  </b-form-checkbox>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col sm="6">
                <b-form-group
                  :label="$t('bond.mitMonitorinms')"
                  label-for="miiMonitorinms"
                >
                  <b-form-input
                    id="miiMonitorinms"
                    v-model="form.miiMonitorinms"
                    type="text"
                    data-test-id="miiMonitorinms-input"
                    :state="getValidationState($v.form.miiMonitorinms)"
                    :disabled="enabledinputfield"
                  />
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.form.miiMonitorinms.required">
                      {{ $t('global.form.fieldRequired') }}
                    </template>
                    <template
                      v-if="
                        $v.form.miiMonitorinms.required &&
                        !$v.form.miiMonitorinms.pattern
                      "
                    >
                      {{ $t('bond.miiRangeRequired') }}
                    </template>
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col sm="6">
                <b-form-group
                  :label="$t('bond.bondInterface')"
                  label-for="protocol"
                >
                  <b-form-select
                    id="protocol"
                    v-model="form.bondInterface"
                    class="input"
                    :options="bondInterfaceOptions"
                    data-test-id="bondInterface-option"
                    :state="getValidationState($v.form.bondInterface)"
                    :disabled="!form.enableBonding"
                    ><template #first>
                      <b-form-select-option :value="valuedefault" disabled>
                        {{ $t('global.form.selectAnOption') }}
                      </b-form-select-option>
                    </template></b-form-select
                  >
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.form.bondInterface.required">
                      {{ $t('global.form.fieldRequired') }}
                    </template>
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
            <b-button
              form="form-bond"
              type="submit"
              variant="primary"
              :disabled="bondInterfaceOptions.length <= 1"
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
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import PageTitle from '@/components/Global/PageTitle';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import LoadingBarMixin, { loading } from '@/components/Mixins/LoadingBarMixin';
import { requiredIf } from 'vuelidate/lib/validators';
import { mapState } from 'vuex';
export default {
  components: {
    PageTitle,
  },
  mixins: [LoadingBarMixin, VuelidateMixin, BVToastMixin],
  data() {
    return {
      currentHostname: '',
      currentMacAddress: '',
      defaultGateway: '',
      loading,
      valuedefault: '',
      bondInterfaceOptions: [],
      InterfaceOptionData: [],
      checkBondStatus: false,
      bondoldVal: {},
      sameBondSettings: false,
      interfacechecking: false,
      form: {
        miiMonitorinms: '',
        bondInterface: '',
        enableBonding: false,
      },
    };
  },
  computed: {
    ...mapState('bond', ['interfaceData']),
    enabledinputfield() {
      if (!this.form.enableBonding || this.checkBondStatus) {
        return true;
      } else {
        return false;
      }
    },
    enabledNetworkBond() {
      return this.$store.getters['network/getNetworkBond'];
    },
  },
  watch: {
    interfaceData() {
      this.getInterfaceInfo();
    },
  },
  created() {
    this.startLoader();
    this.$store.dispatch('bond/getBondEthernetData').finally(() => {
      this.endLoader();
    });
  },

  validations() {
    return {
      form: {
        miiMonitorinms: {
          required: requiredIf(function (form) {
            if (form.enableBonding) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.miiMonitorinmsCountValidation(val);
          },
        },
        bondInterface: {
          required: requiredIf(function (form) {
            if (form.enableBonding) {
              return true;
            }
          }),
        },
      },
    };
  },
  methods: {
    onSave() {
      if (
        this.checkBondStatus != this.form.enableBonding ||
        (this.bondoldVal.bondInterface != undefined &&
          this.bondoldVal.bondInterface != this.form.bondInterface) ||
        (this.bondoldVal.miiMonitorinms != undefined &&
          this.bondoldVal.miiMonitorinms != this.form.miiMonitorinms) ||
        (this.bondoldVal.enableBonding != undefined &&
          this.bondoldVal.enableBonding != this.form.enableBonding)
      ) {
        this.$v.$touch();
        if (this.$v.$invalid) return;
        this.$bvModal
          .msgBoxConfirm(this.$t('bond.confirmMsg'), {
            title: this.$tc('bond.bond'),
            okTitle: this.$tc('bond.confirmOk'),
            cancelTitle: this.$t('global.action.cancel'),
          })
          .then((deleteConfirmed) => {
            if (deleteConfirmed) {
              this.startLoader();
              if (this.form.enableBonding) {
                if (!this.checkBondStatus) {
                  //Bond enabled for the first time
                  this.$store
                    .dispatch('bond/setBondEthernetData', this.form)
                    .then(() => {
                      this.logout();
                    })
                    .catch(({ message }) => this.errorToast(message))
                    .finally(() => this.endLoader());
                } else {
                  //Bond enabled and tried to change the interface
                  this.$store
                    .dispatch('bond/setChangeActiveSlave', this.form)
                    .then(() => {
                      this.logout();
                    })
                    .catch(({ message }) => this.errorToast(message))
                    .finally(() => this.endLoader());
                }
              } else {
                this.$store
                  .dispatch('bond/deleteBondEthernetData')
                  .then(() => {
                    this.logout();
                  })
                  .catch(({ message }) => this.errorToast(message))
                  .finally(() => this.endLoader());
              }
            }
          });
      } else {
        this.sameBondSettings = true;
        setTimeout(() => {
          this.sameBondSettings = false;
        }, 5000);
      }
    },
    miiMonitorinmsCountValidation(value) {
      if (
        (this.form.enableBonding &&
          !(parseInt(value) >= 1 && parseInt(value) <= 100)) ||
        !/^[0-9]*$/.test(value)
      ) {
        return false;
      } else {
        return true;
      }
    },
    getInterfaceInfo() {
      this.InterfaceOptionData = this.$store.getters['bond/getInterfaceData'];
      this.InterfaceOptionData.forEach((val) => {
        if (!val.includes('usb') && !val.includes('bond')) {
          let interfaceoptions = {
            text: val,
            value: val,
          };
          this.bondInterfaceOptions.push(interfaceoptions);
        }
        if (val.includes('bond')) {
          // assign true when the bond is enabled and check for old value
          this.checkBondStatus = true;
          this.startLoader();
          this.$store
            .dispatch('bond/getbondData')
            .then(() => {
              this.bondEnabledDataBind();
            })
            .catch(({ message }) => this.errorToast(message))
            .finally(() => {
              this.endLoader();
            });
        }
      });
      //checking the singleInterface avaiability show/hide the warning message
      if (this.bondInterfaceOptions.length <= 1) {
        this.interfacechecking = true;
      } else {
        this.interfacechecking = false;
      }
    },
    async bondEnabledDataBind() {
      var getbonddata = this.$store.getters['bond/getBondEnabledData'];
      let res = getbonddata.ActiveSlave['@odata.id'].split('/');
      let lastElement = res[res.length - 1];
      this.bondoldVal.bondInterface = lastElement;
      (this.bondoldVal.miiMonitorinms = getbonddata.MIIMonitorinms),
        (this.bondoldVal.enableBonding = true),
        (this.form.miiMonitorinms = getbonddata.MIIMonitorinms),
        (this.form.bondInterface = lastElement),
        (this.form.enableBonding = true);
    },
    logout() {
      //due to ip change API call failed so customized the cookies
      this.$store.dispatch('authentication/customizedResetLogout');
    },
  },
};
</script>
<style scoped>
.p0 {
  padding: 0 !important;
}
</style>
