<template>
  <b-modal id="modal-snmp" ref="modal" @hidden="resetForm">
    <template #modal-title>
      <template v-if="snmpData">
        {{ $t('pageSnmp.addSubscrition') }}
      </template>
      <template v-else>
        {{ $t('pageSnmp.editSubscrition') }}
      </template>
    </template>
    <b-form id="form-snmp" novalidate @submit.prevent="handleSubmit">
      <b-container>
        <b-row>
          <b-col>
            <b-row>
              <b-form-group
                :label="$t('pageSnmp.modal.protocol')"
                label-for="protocol"
                class="field-width"
              >
                <b-form-select
                  id="protocol"
                  v-model="form.selectProtocol"
                  :options="protocolType"
                  data-test-id="snmp-select-protocol"
                  :disabled="!snmpData"
                  :state="getValidationState($v.form.selectProtocol)"
                  @input="$v.form.selectProtocol.$touch()"
                >
                  <template #first>
                    <b-form-select-option :value="null" disabled>
                      {{ $t('global.form.selectAnOption') }}
                    </b-form-select-option>
                  </template>
                </b-form-select>
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.form.selectProtocol.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-row>
            <b-row>
              <b-form-group
                :label="$t('pageSnmp.modal.subscriptionType')"
                label-for="subscriptionType"
                class="field-width"
              >
                <b-form-select
                  id="subscriptionType"
                  v-model="form.selectSubscriptionType"
                  :options="subscriptionType"
                  data-test-id="snmp-select-subscriptionType"
                  :disabled="!snmpData"
                  :state="getValidationState($v.form.selectSubscriptionType)"
                  @input="$v.form.selectSubscriptionType.$touch()"
                >
                  <template #first>
                    <b-form-select-option :value="null" disabled>
                      {{ $t('global.form.selectAnOption') }}
                    </b-form-select-option>
                  </template>
                </b-form-select>
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.form.selectSubscriptionType.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-row>
            <b-row v-if="form.selectProtocol != 'SNMPv3'">
              <b-form-group
                :label="$t('pageSnmp.modal.communityString')"
                label-for="protocol"
                class="field-width"
              >
                <b-form-select
                  id="protocol"
                  v-model="form.communityString"
                  :options="communityStringType"
                  data-test-id="snmp-select-communityString"
                  :disabled="!snmpData"
                  :state="getValidationState($v.form.communityString)"
                  @input="$v.form.communityString.$touch()"
                >
                  <template #first>
                    <b-form-select-option :value="null" disabled>
                      {{ $t('global.form.selectAnOption') }}
                    </b-form-select-option>
                  </template>
                </b-form-select>
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.form.communityString.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-row>
            <b-row>
              <b-form-group
                :label="$t('pageSnmp.modal.destination')"
                label-for="destination"
                class="field-width"
              >
                <b-form-input
                  id="destination"
                  v-model="form.destination"
                  type="text"
                  :disabled="!snmpData"
                  data-test-id="snmp-input-destination"
                  :state="getValidationState($v.form.destination)"
                  @input="$v.form.destination.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.form.destination.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.form.destination.required &&
                      !$v.form.destination.pattern
                    "
                  >
                    {{ $t('global.form.invalidFormat') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-row>
            <b-row>
              <b-form-group
                :label="$t('pageSnmp.modal.portNumber')"
                label-for="portNumber"
                class="field-width"
              >
                <b-form-input
                  id="portNumber"
                  v-model="form.portNumber"
                  type="text"
                  data-test-id="snmp-input-portNumber"
                  :state="getValidationState($v.form.portNumber)"
                  @input="$v.form.portNumber.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.form.portNumber.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.form.portNumber.required && !$v.form.portNumber.pattern
                    "
                  >
                    {{ $t('global.form.invalidFormat') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-row>
            <b-row v-if="form.selectProtocol === 'SNMPv3'">
              <b-form-group
                :label="$t('pageSnmp.modal.bmcUser')"
                label-for="bmcUser"
                class="field-width"
              >
                <b-form-select
                  id="bmcUser"
                  v-model="form.bmcUser"
                  :options="bmcUsersOptions"
                  data-test-id="snmp-input-bmcUser"
                  :disabled="!snmpData"
                  :state="getValidationState($v.form.bmcUser)"
                  @input="$v.form.bmcUser.$touch()"
                >
                  <template #first>
                    <b-form-select-option :value="null" disabled>
                      {{ $t('global.form.selectAnOption') }}
                    </b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </b-form>
    <template #modal-footer="{ cancel }">
      <b-button
        variant="secondary"
        data-test-id="userManagement-button-cancel"
        @click="cancel()"
      >
        <icon-cancel />
        {{ $t('pageSnmp.modal.cancel') }}
      </b-button>
      <b-button
        form="form-user"
        data-test-id="userManagement-button-submit"
        type="submit"
        variant="primary"
        @click="onOk"
      >
        <template v-if="snmpData">
          <icon-add />
          {{ $t('pageSnmp.modal.addTrap') }}
        </template>
        <template v-else>
          <icon-save />
          {{ $t('global.action.save') }}
        </template>
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { required, requiredIf } from 'vuelidate/lib/validators';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import { mapState } from 'vuex';
import IconSave from '@carbon/icons-vue/es/save/20';
import IconCancel from '@carbon/icons-vue/es/rule--cancelled/20';
import IconAdd from '@carbon/icons-vue/es/add--alt/20';

export default {
  components: { IconSave, IconCancel, IconAdd },
  mixins: [VuelidateMixin],
  props: {
    snmp: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        destination: '',
        selectSubscriptionType: null,
        selectProtocol: null,
        bmcUser: null,
        portNumber: '',
        communityString: null,
      },
      subscriptionType: [
        { value: 'SNMPTrap', text: this.$t('pageSnmp.snmpTrap') },
      ],
      protocolType: [
        { value: 'SNMPv1', text: this.$t('pageSnmp.snmpProtocolV1') },
        { value: 'SNMPv2c', text: this.$t('pageSnmp.snmpProtocolV2') },
        { value: 'SNMPv3', text: this.$t('pageSnmp.snmpProtocolV3') },
      ],
      snmpId: '',
      communityStringType: this.$store.getters['snmp/communityStrings'],
    };
  },
  computed: {
    snmpData() {
      return this.snmp ? false : true;
    },
    bmcUsersOptions() {
      return this.$store.getters['snmp/Bmcusers'];
    },
    ...mapState('snmp', ['communityStrings']),
  },
  watch: {
    snmp: function (value) {
      if (value === null) return;
      this.form.destination = value.destination;
      this.form.selectSubscriptionType = value.subscriptionType;
      this.form.selectProtocol = value.protocol;
      this.snmpId = value.Id;
      this.form.bmcUser = value.bmcUser;
    },
    communityStrings: function (value) {
      this.communityStringType = value;
    },
  },
  validations() {
    const baseValidations = {
      destination: {
        required,
        pattern: (val) => this.destinationAddressValidation(val),
      },
      selectSubscriptionType: { required },
      selectProtocol: { required },
      portNumber: {
        required,
        pattern: (val) => this.portNumberValidation(val),
      },
      communityString: {
        required: requiredIf(function () {
          return this.form.selectProtocol === 'SNMPv3' ? false : true;
        }),
      },
    };

    if (this.form.selectProtocol === 'SNMPv3') {
      Object.assign(baseValidations, {
        bmcUser: { required },
      });
    }

    return { form: baseValidations };
  },
  methods: {
    handleSubmit() {
      let SnmpTrap = {};

      if (this.snmpData) {
        this.$v.$touch();
        if (this.$v.$invalid) return;
        if (this.form.selectProtocol === 'SNMPv3') {
          SnmpTrap.destination =
            this.form.bmcUser +
            '@' +
            this.form.destination +
            ':' +
            this.form.portNumber;
          SnmpTrap.selectSubscriptionType = this.form.selectSubscriptionType;
          SnmpTrap.selectProtocol = this.form.selectProtocol;
          SnmpTrap.bmcUser = this.form.bmcUser;
        } else {
          SnmpTrap.destination =
            this.form.destination + ':' + this.form.portNumber;
          SnmpTrap.selectSubscriptionType = this.form.selectSubscriptionType;
          SnmpTrap.selectProtocol = this.form.selectProtocol;
          SnmpTrap.communityString = this.form.communityString;
        }
      } else {
        this.$v.$touch();
        if (this.$v.$invalid) return;
        if (this.$v.form.destination.$dirty) {
          SnmpTrap.destination =
            this.form.bmcUser +
            '@' +
            this.form.destination +
            ':' +
            this.form.portNumber;
        }
        if (this.$v.form.selectSubscriptionType.$dirty) {
          SnmpTrap.selectSubscriptionType = this.form.selectSubscriptionType;
        }
        if (this.$v.form.selectProtocol.$dirty) {
          SnmpTrap.selectProtocol = this.form.selectProtocol;
        }
        if (this.$v.form.communityString.$dirty) {
          SnmpTrap.communityString = this.form.communityString;
        }
        if (Object.entries(SnmpTrap).length === 1) {
          this.closeModal();
          return;
        }
      }
      this.$emit('ok', { isNewTrap: this.snmpData, SnmpTrap });
      this.closeModal();
    },
    closeModal() {
      this.$nextTick(() => {
        this.$refs.modal.hide();
      });
    },
    resetForm() {
      this.form.destination = '';
      this.form.selectSubscriptionType = null;
      this.form.selectProtocol = null;
      this.form.bmcUser = null;
      this.form.portNumber = '';
      this.form.communityString = null;
      this.$v.$reset();
      this.$emit('hidden');
    },
    onOk(bvModalEvt) {
      // prevent modal close
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    isValidIPv4(value) {
      let ipv4Reg =
        /^[a-zA-Z0-9._%+-]+@((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      // regex will return true for valid ipv4 addresses
      return ipv4Reg.test(value);
    },
    isValidIPv6(value) {
      let ipv6Reg =
        /(?:^|(?<=\s))[a-zA-Z0-9._%+-]+@(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))(?=\s|$)/;
      // regex will return true for valid ipv6 addresses
      return ipv6Reg.test(value);
    },
    destinationAddressValidation(value) {
      if (
        (!/((^((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))$)|(^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?$))/.test(
          value,
        ) ||
          /^localhost$|^127(?:\.[0-9]+){0,2}\.[0-9]+$|^(?:0*\\:)*?:?0*1$/.test(
            value,
          ) ||
          (value != undefined &&
            value != null &&
            (String(value).charAt(0) == '0' ||
              '#255.255.255.0#0.24.56.4#255.255.255.255#'.indexOf(
                '#' + value + '#',
              ) > -1)) ||
          value.trim() == '::') &&
        !/^(?=.{1,253}\.?$)([a-z][a-z0-9\\-]{0,61}[a-z0-9]\.)+([a-z]{2,63}|xn--[a-z0-9\\-]{1,58}[a-z0-9])\.?$/i.test(
          value,
        )
      ) {
        return false;
      } else {
        return true;
      }
    },
    portNumberValidation(value) {
      if (/^\d+$/.test(value) && value >= 1 && value <= 65535) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
<style scoped>
.field-width {
  width: 220%;
}
</style>
