<template>
  <b-container fluid="xl">
    <div class="form-background p-8">
      <b-row>
        <b-col md="9" lg="8" xl="9">
          <b-form-group :label="$t('pageBackupAndRestore.checkAll')">
            <b-form-checkbox
              v-model="checkAll"
              data-test-id="checkAllBackup"
              switch
              @change="toggleAllButtons"
            >
              <span v-if="checkAll">{{ $t('global.status.enabled') }}</span>
              <span v-else>{{ $t('global.status.disabled') }}</span>
            </b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row v-if="togglebuttons.SMTP != undefined">
        <b-col class="d-flex" cols="2">
          <dl class="mr-3 w-10">
            <dd class="font_style">
              {{ $t('pageBackupAndRestore.smtp') }}
            </dd>
          </dl>
        </b-col>
        <b-col cols="10">
          <b-form-checkbox id="smtp" v-model="togglebuttons.SMTP" switch>
            <span v-if="togglebuttons.SMTP">{{
              $t('global.status.enabled')
            }}</span>
            <span v-else>{{ $t('global.status.disabled') }}</span>
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row v-if="hide">
        <b-col class="d-flex" cols="2">
          <dl class="mr-3 w-10">
            <dd class="font_style">
              {{ $t('pageBackupAndRestore.authentication') }}
            </dd>
          </dl>
        </b-col>
        <b-col cols="10">
          <b-form-checkbox
            id="Authentication"
            v-model="togglebuttons.Authentication"
            switch
          >
            <span v-if="togglebuttons.Authentication">{{
              $t('global.status.enabled')
            }}</span>
            <span v-else>{{ $t('global.status.disabled') }}</span>
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row v-if="togglebuttons.VirtualMedia != undefined">
        <b-col class="d-flex" cols="2">
          <dl class="mr-3 w-10">
            <dd class="font_style">
              {{ $t('pageBackupAndRestore.virtualMedia') }}
            </dd>
          </dl>
        </b-col>
        <b-col cols="10">
          <b-form-checkbox
            id="virtualMedia"
            v-model="togglebuttons.VirtualMedia"
            switch
          >
            <span v-if="togglebuttons.VirtualMedia">{{
              $t('global.status.enabled')
            }}</span>
            <span v-else>{{ $t('global.status.disabled') }}</span>
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row v-if="hide">
        <b-col class="d-flex" cols="2">
          <dl class="mr-3 w-10">
            <dd class="font_style">
              {{ $t('pageBackupAndRestore.ipmi') }}
            </dd>
          </dl>
        </b-col>
        <b-col cols="10">
          <b-form-checkbox id="ipmi" v-model="togglebuttons.IPMI" switch>
            <span v-if="togglebuttons.IPMI">{{
              $t('global.status.enabled')
            }}</span>
            <span v-else>{{ $t('global.status.disabled') }}</span>
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row v-if="togglebuttons.Network != undefined">
        <b-col class="d-flex" cols="2">
          <dl class="mr-3 w-10">
            <dd class="font_style">
              {{ $t('pageBackupAndRestore.network') }}
            </dd>
          </dl>
        </b-col>
        <b-col cols="10">
          <b-form-checkbox id="network" v-model="togglebuttons.Network" switch>
            <span v-if="togglebuttons.Network">{{
              $t('global.status.enabled')
            }}</span>
            <span v-else>{{ $t('global.status.disabled') }}</span>
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row v-if="togglebuttons.NTP != undefined">
        <b-col class="d-flex" cols="2">
          <dl class="mr-3 w-10">
            <dd class="font_style">
              {{ $t('pageBackupAndRestore.ntp') }}
            </dd>
          </dl>
        </b-col>
        <b-col cols="10">
          <b-form-checkbox id="ntp" v-model="togglebuttons.NTP" switch>
            <span v-if="togglebuttons.NTP">{{
              $t('global.status.enabled')
            }}</span>
            <span v-else>{{ $t('global.status.disabled') }}</span>
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row v-if="hide">
        <b-col class="d-flex" cols="2">
          <dl class="mr-3 w-10">
            <dd class="font_style">
              {{ $t('pageBackupAndRestore.snmp') }}
            </dd>
          </dl>
        </b-col>
        <b-col cols="10">
          <b-form-checkbox id="snmp" v-model="togglebuttons.SNMP" switch>
            <span v-if="togglebuttons.SNMP">{{
              $t('global.status.enabled')
            }}</span>
            <span v-else>{{ $t('global.status.disabled') }}</span>
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row v-if="hide">
        <b-col class="d-flex" cols="2">
          <dl class="mr-3 w-10">
            <dd class="font_style">
              {{ $t('pageBackupAndRestore.sysLog') }}
            </dd>
          </dl>
        </b-col>
        <b-col cols="10">
          <b-form-checkbox id="sysLog" v-model="togglebuttons.SysLog" switch>
            <span v-if="togglebuttons.SysLog">{{
              $t('global.status.enabled')
            }}</span>
            <span v-else>{{ $t('global.status.disabled') }}</span>
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-4 mb-5">
        <b-col>
          <b-button
            class="mt-2"
            type="submit"
            variant="primary"
            :disabled="isButtonDisable"
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
import { mapState } from 'vuex';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';
export default {
  name: 'Backup',
  components: { IconDownload },
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
