<template>
  <b-container fluid="xl">
    <div class="form-background p-8">
      <b-alert
        v-if="isAllToggleButtonsDisabled"
        show
        variant="info"
        class="mb-4"
      >
        <icon-information class="mr-2" />
        {{ $t('pageBackupAndRestore.downloadBackupFileInfo') }}
      </b-alert>

      <b-row>
        <b-col sm="6" md="3">
          <b-form-checkbox
            v-model="checkAll"
            data-test-id="checkAllBackup"
            @change="toggleAllButtons"
          >
            {{ $t('pageBackupAndRestore.checkAll') }}
          </b-form-checkbox>
          <hr class="my-3" style="border-color: #e9ecef" />
        </b-col>
      </b-row>
      <b-row v-if="togglebuttons.SMTP != undefined" class="mb-2">
        <b-col cols="12">
          <b-form-checkbox id="smtp" v-model="togglebuttons.SMTP">
            {{ $t('pageBackupAndRestore.smtp') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row v-if="hide" class="mb-2">
        <b-col cols="12">
          <b-form-checkbox
            id="Authentication"
            v-model="togglebuttons.Authentication"
          >
            {{ $t('pageBackupAndRestore.authentication') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row v-if="togglebuttons.VirtualMedia != undefined" class="mb-2">
        <b-col cols="12">
          <b-form-checkbox
            id="virtualMedia"
            v-model="togglebuttons.VirtualMedia"
          >
            {{ $t('pageBackupAndRestore.virtualMedia') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row v-if="hide" class="mb-2">
        <b-col cols="12">
          <b-form-checkbox id="ipmi" v-model="togglebuttons.IPMI">
            {{ $t('pageBackupAndRestore.ipmi') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row v-if="togglebuttons.Network != undefined" class="mb-2">
        <b-col cols="12">
          <b-form-checkbox id="network" v-model="togglebuttons.Network">
            {{ $t('pageBackupAndRestore.network') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row v-if="togglebuttons.NTP != undefined" class="mb-2">
        <b-col cols="12">
          <b-form-checkbox id="ntp" v-model="togglebuttons.NTP">
            {{ $t('pageBackupAndRestore.ntp') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row v-if="hide" class="mb-2">
        <b-col cols="12">
          <b-form-checkbox id="snmp" v-model="togglebuttons.SNMP">
            {{ $t('pageBackupAndRestore.snmp') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row v-if="hide" class="mb-2">
        <b-col cols="12">
          <b-form-checkbox id="sysLog" v-model="togglebuttons.SysLog">
            {{ $t('pageBackupAndRestore.sysLog') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-4 mb-5">
        <b-col>
          <b-button
            class="mt-2"
            type="submit"
            variant="primary"
            :disabled="isButtonDisable || isAllToggleButtonsDisabled"
            @click="handleDownload"
            ><icon-download />
            {{ $t('global.action.download') }}
          </b-button>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import IconDownload from '@carbon/icons-vue/es/document--download/20';
import IconInformation from '@carbon/icons-vue/es/information/20';
import { mapState } from 'vuex';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';
export default {
  name: 'Backup',
  components: { IconDownload, IconInformation },
  mixins: [BVToastMixin, LoadingBarMixin],
  props: {
    tabIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      hide: false,
      checkAll: '',
      togglebuttons: {},
    };
  },
  computed: {
    ...mapState('backupAndRestore', ['backupConfigValues']),
    ...mapGetters('global', ['userPrivilege']),
    isButtonDisable() {
      return this.userPrivilege !== privilegesId.admin;
    },
    isAllToggleButtonsDisabled() {
      return Object.values(this.togglebuttons).every((value) => !value);
    },
  },
  watch: {
    backupConfigValues() {
      this.initbackupConfigValues();
    },
    togglebuttons: {
      handler(val) {
        this.checkAll = Object.values(val).every((checked) => checked);
      },
      deep: true,
    },
  },
  created() {
    this.startLoader();
    this.$store
      .dispatch('backupAndRestore/getBackupConfig')
      .catch(({ message }) => this.errorToast(message))
      .finally(() => this.endLoader());
  },
  methods: {
    initbackupConfigValues() {
      const config =
        this.$store.getters['backupAndRestore/getBackupConfigValues'];
      this.togglebuttons = config;
    },
    handleDownload() {
      let data = [];
      if (this.togglebuttons.Network) {
        data.push('Network');
      }
      if (this.togglebuttons.NTP) {
        data.push('NTP');
      }
      if (this.togglebuttons.SMTP) {
        data.push('SMTP');
      }
      if (this.togglebuttons.VirtualMedia) {
        data.push('Virtual-media');
      }
      this.startLoader();
      this.$store
        .dispatch('backupAndRestore/updateBackup', data)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    toggleAllButtons() {
      Object.keys(this.togglebuttons).forEach((key) => {
        this.togglebuttons[key] = this.checkAll;
      });
    },
  },
};
</script>
