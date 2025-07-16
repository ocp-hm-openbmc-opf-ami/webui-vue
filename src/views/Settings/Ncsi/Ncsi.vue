<template>
  <b-container fluid="xl">
    <page-title :description="$t('pageNcsi.pageDescription')" />
    <div v-if="!checkNcsi">
      <b-alert show variant="danger">{{
        $t('pageNcsi.toast.featureNotEnabled')
      }}</b-alert>
    </div>
    <div v-if="checkNcsi" class="form-background p-3">
      <b-row>
        <b-col class="col-sm-2 p-2">
          <dl>
            <dt>{{ $t('pageNcsi.ncsiInterfaceOptions') }}</dt>
          </dl>
        </b-col>
        <b-col lg="3">
          <b-form-select
            id="ncsi-interface"
            v-model="ncsiInterfaceId"
            :options="ncsiInterfaceOptions"
            data-test-id="ncsi-interface-select"
            :state="getValidationState($v.ncsiInterfaceId)"
            @change="changeInterfaceId"
          >
            <template #first>
              <b-form-select-option :value="null" disabled>
                {{ $t('global.form.selectAnOption') }}
              </b-form-select-option>
            </template>
          </b-form-select>
          <b-form-invalid-feedback role="alert">
            <template v-if="!$v.ncsiInterfaceId.required">
              {{ $t('global.form.fieldRequired') }}
            </template>
          </b-form-invalid-feedback>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="col-sm-2 p-2">
          <dl>
            <dt>{{ $t('pageNcsi.ncsiMode') }}</dt>
          </dl>
        </b-col>
        <b-col lg="6">
          <b-form-radio-group v-model="selectedMode">
            <b-form-radio
              v-model="form.enableConfiguration"
              value="Auto"
              data-test-id="ncsi-autoFailOverMode"
              class="mr-2"
            >
              {{ $t('pageNcsi.autoFailOverMode') }}
            </b-form-radio>
            <b-form-radio
              v-model="form.enableConfiguration"
              value="Manual"
              data-test-id="ncsi-manualSwitchMode"
            >
              {{ $t('pageNcsi.manualSwitchMode') }}
            </b-form-radio>
          </b-form-radio-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="col-sm-2 p-2">
          <dl>
            <dt>{{ $t('pageNcsi.packageId') }}</dt>
          </dl>
        </b-col>
        <b-col lg="3">
          <b-form-select
            id="ncsi-interface"
            v-model="ncsiPackageId"
            :disabled="selectedMode === 'Auto'"
            :options="packageIdOptions"
            :state="getValidationState($v.ncsiPackageId)"
            @input="$v.ncsiPackageId.$touch()"
          >
          </b-form-select>
          <b-form-invalid-feedback role="alert">
            <template v-if="!$v.ncsiPackageId.required">
              {{ $t('global.form.fieldRequired') }}
            </template>
          </b-form-invalid-feedback>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="col-sm-2 p-2">
          <dl>
            <dt>{{ $t('pageNcsi.channelNumber') }}</dt>
          </dl>
        </b-col>
        <b-col lg="3">
          <b-form-select
            id="ncsi-interface"
            v-model="ncsiChannelNumber"
            :disabled="selectedMode === 'Auto'"
            :options="channelNumberOptions"
            :state="getValidationState($v.ncsiChannelNumber)"
            @input="$v.ncsiChannelNumber.$touch()"
          >
          </b-form-select>
          <b-form-invalid-feedback role="alert">
            <template v-if="!$v.ncsiChannelNumber.required">
              {{ $t('global.form.fieldRequired') }}
            </template>
          </b-form-invalid-feedback>
        </b-col>
      </b-row>
      <b-button
        class="mt-2"
        variant="primary"
        type="submit"
        :disabled="isButtonDisable"
        data-test-id="ncsi-button-savencsiMode"
        @click="saveNcsiConfiguration"
      >
        <icon-save />
        {{ $t('global.action.save') }}
      </b-button>
    </div>
  </b-container>
</template>
<script>
import PageTitle from '@/components/Global/PageTitle';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import { required } from 'vuelidate/lib/validators';
import { mapState } from 'vuex';
import IconSave from '@carbon/icons-vue/es/save/20';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';
export default {
  name: 'Ncsi',
  components: { PageTitle, IconSave },
  mixins: [LoadingBarMixin, BVToastMixin, VuelidateMixin],
  data() {
    return {
      ncsiChannelNumber: '',
      ncsiInterfaceData: [],
      ncsiInterfaceId: null,
      ncsiPackageId: '',
      selectedMode: '',
      form: {
        enableConfiguration: '',
      },
      ncsiInterfaceOptions: [],
      packageIdOptions: [
        { value: 0, text: this.$t('pageNcsi.options.packageOption') },
      ],
      channelNumberOptions: [],
      checkNcsi: true,
      ncsiData: [],
    };
  },
  computed: {
    ...mapState('ncsi', ['ncsiInterface']),
    ...mapGetters('global', ['userPrivilege']),
    isButtonDisable() {
      return this.userPrivilege !== privilegesId.admin;
    },
  },
  watch: {
    ncsiInterface() {
      this.bindNcsiData();
    },
  },
  validations() {
    return {
      ncsiChannelNumber: {
        required,
      },
      selectedMode: {
        required,
      },
      ncsiPackageId: {
        required,
      },
      ncsiInterfaceId: {
        required,
      },
    };
  },
  created() {
    this.startLoader();
    this.$store.dispatch('ncsi/getEthernetInterfaces').finally(() => {
      this.checkNcsiEnabled();
      this.endLoader();
    });
  },
  methods: {
    checkNcsiEnabled() {
      this.checkNcsi = this.$store.getters['ncsi/ncsiEnable'];
    },
    bindNcsiData() {
      this.ncsiInterfaceData = this.$store.getters['ncsi/ncsiInterface'];
      if (this.ncsiInterfaceData && this.ncsiInterfaceData.length > 0) {
        this.ncsiInterfaceData.forEach((val) => {
          this.ncsiInterfaceOptions.push({
            value: val,
            text: val,
          });
        });
        this.changeInterfaceId(this.ncsiInterfaceOptions[0].value);
      } else {
        this.ncsiInterfaceOptions = [];
      }
    },
    changeInterfaceId(selectedId) {
      this.startLoader();
      this.$store
        .dispatch('ncsi/getNcsiData', selectedId)
        .then(() => {
          this.ncsiData = this.$store.getters['ncsi/ncsiData'];
          if (this.ncsiData) {
            this.ncsiInterfaceId = selectedId;
            this.channelNumberOptions = [];
            this.selectedMode =
              this.ncsiData?.Oem?.Ami?.NCSIConfiguration?.Mode;
            const channelList =
              this.ncsiData?.Oem?.Ami?.NCSIConfiguration?.ChannelList[0];
            channelList.SupportedChannelsId.forEach((channel) => {
              this.channelNumberOptions.push({
                value: channel,
                text: `${channel} (package)`,
              });
            });
            this.ncsiPackageId = channelList.PackageId;
            this.ncsiChannelNumber =
              this.ncsiData?.Oem?.Ami?.NCSIConfiguration?.ChannelId;
          }
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => {
          this.endLoader();
        });
    },
    saveNcsiConfiguration() {
      let data = {};
      this.$v.$touch();
      if (this.$v.$invalid) return;
      if (this.selectedMode === 'Auto') {
        data.Mode = this.selectedMode;
        data.interFace = this.ncsiInterfaceId;
      }
      if (this.selectedMode === 'Manual') {
        data.Mode = this.selectedMode;
        data.PackageId = this.ncsiPackageId;
        data.ChannelId = this.ncsiChannelNumber;
        data.interFace = this.ncsiInterfaceId;
      }
      this.startLoader();
      this.$store
        .dispatch('ncsi/saveNcsiConfigurations', data)
        .then((success) => {
          if (success) {
            this.successToast(success);
            this.changeInterfaceId(data.interFace);
          }
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
  },
};
</script>
