<template>
  <b-container fluid="xl">
    <div class="form-background p-8">
      <b-row>
        <b-col md="9" lg="8" xl="9">
          <b-form-group :label="$t('pageBackupAndRestore.checkAll')">
            <b-form-checkbox
              v-model="allSelected"
              data-test-id="checkAllBackup"
              switch
            >
              <span v-if="checkAll">{{ $t('global.status.enabled') }}</span>
              <span v-else>{{ $t('global.status.disabled') }}</span>
            </b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="d-flex" cols="2">
          <dl class="mr-3 w-10">
            <dd class="font_style">
              {{ $t('pageBackupAndRestore.smtp') }}
            </dd>
          </dl>
        </b-col>
        <b-col cols="10">
          <b-form-checkbox id="smtp" v-model="SMTP" switch>
            <span v-if="SMTP">{{ $t('global.status.enabled') }}</span>
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
          <b-form-checkbox id="Authentication" v-model="Authentication" switch>
            <span v-if="Authentication">{{ $t('global.status.enabled') }}</span>
            <span v-else>{{ $t('global.status.disabled') }}</span>
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="d-flex" cols="2">
          <dl class="mr-3 w-10">
            <dd class="font_style">
              {{ $t('pageBackupAndRestore.virtualMedia') }}
            </dd>
          </dl>
        </b-col>
        <b-col cols="10">
          <b-form-checkbox id="virtualMedia" v-model="VirtualMedia" switch>
            <span v-if="VirtualMedia">{{ $t('global.status.enabled') }}</span>
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
          <b-form-checkbox id="ipmi" v-model="IPMI" switch>
            <span v-if="IPMI">{{ $t('global.status.enabled') }}</span>
            <span v-else>{{ $t('global.status.disabled') }}</span>
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="d-flex" cols="2">
          <dl class="mr-3 w-10">
            <dd class="font_style">
              {{ $t('pageBackupAndRestore.network') }}
            </dd>
          </dl>
        </b-col>
        <b-col cols="10">
          <b-form-checkbox id="network" v-model="Network" switch>
            <span v-if="Network">{{ $t('global.status.enabled') }}</span>
            <span v-else>{{ $t('global.status.disabled') }}</span>
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row v-if="hide">
        <b-col class="d-flex" cols="2">
          <dl class="mr-3 w-10">
            <dd class="font_style">
              {{ $t('pageBackupAndRestore.ntp') }}
            </dd>
          </dl>
        </b-col>
        <b-col cols="10">
          <b-form-checkbox id="ntp" v-model="NTP" switch>
            <span v-if="NTP">{{ $t('global.status.enabled') }}</span>
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
          <b-form-checkbox id="snmp" v-model="SNMP" switch>
            <span v-if="SNMP">{{ $t('global.status.enabled') }}</span>
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
          <b-form-checkbox id="sysLog" v-model="SysLog" switch>
            <span v-if="SysLog">{{ $t('global.status.enabled') }}</span>
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
            @click="handleSubmit"
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
      SMTP: this.$store.getters['backupAndRestore/smtp'],
      VirtualMedia: this.$store.getters['backupAndRestore/virtualMedia'],
      IPMI: this.$store.getters['backupAndRestore/ipmi'],
      Network: this.$store.getters['backupAndRestore/network'],
      NTP: this.$store.getters['backupAndRestore/ntp'],
      SNMP: this.$store.getters['backupAndRestore/snmp'],
      SysLog: this.$store.getters['backupAndRestore/sysLog'],
      checkAll: false,
      hide: false,
    };
  },
  computed: {
    allSelected: {
      get() {
        return this.SMTP && this.VirtualMedia && this.Network;
      },
      set(value) {
        this.checkAll = value;
        if (value) {
          this.SMTP = value;
          this.VirtualMedia = value;
          this.Network = value;
        } else {
          if (!(this.SMTP && this.VirtualMedia && this.Network)) {
            this.checkAll = false;
          } else {
            this.SMTP = value;
            this.VirtualMedia = value;
            this.Network = value;
          }
        }
      },
    },
    ...mapState('backupAndRestore', [
      'smtp',
      'ipmi',
      'virtualMedia',
      'network',
      'ntp',
      'snmp',
      'sysLog',
    ]),
  },
  watch: {
    smtp: function (value) {
      this.SMTP = value;
    },
    ipmi: function (value) {
      this.IPMI = value;
    },
    virtualMedia: function (value) {
      this.VirtualMedia = value;
    },
    network: function (value) {
      this.Network = value;
    },
    ntp: function (value) {
      this.NTP = value;
    },
    snmp: function (value) {
      this.SNMP = value;
    },
    sysLog: function (value) {
      this.SysLog = value;
    },
    SMTP(value) {
      if (!value) {
        this.checkAll = false;
      }
    },
    VirtualMedia(value) {
      if (!value) {
        this.checkAll = false;
      }
    },
    Network(value) {
      if (!value) {
        this.checkAll = false;
      }
    },
  },
  methods: {
    handleSubmit() {
      this.startLoader();
      let data = [];
      if (this.SMTP) {
        data.push('SMTP');
      }
      if (this.VirtualMedia) {
        data.push('Virtual-media');
      }
      if (this.IPMI) {
        data.push('IPMI');
      }
      if (this.Network) {
        data.push('Network');
      }
      if (this.NTP) {
        data.push('NTP');
      }
      if (this.SNMP) {
        data.push('SNMP');
      }
      if (this.SysLog) {
        data.push('Syslog');
      }
      this.$store
        .dispatch('backupAndRestore/updateBackup', data)
        .then((success) => {
          if (success) {
            this.successToast(success);
          }
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
  },
};
</script>
