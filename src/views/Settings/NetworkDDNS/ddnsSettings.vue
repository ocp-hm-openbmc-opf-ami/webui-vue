<template>
  <b-container fluid="xl">
    <page-section
      :section-title="$t('pageDDNSNetwork.ddnsConfiguration.dhcpConfiguration')"
    >
      <b-row>
        <b-col sm="4">
          <b-form-group
            :label="$t('pageDDNSNetwork.ddnsConfiguration.sendHostNameEnabled')"
          >
            <b-form-checkbox
              v-model="sendHostNameEnabled"
              data-test-id="ddns-toggle-host-name"
              switch
              @change="changeHostNameEnabled"
            >
              <span v-if="sendHostNameEnabled">
                {{ $t('global.status.enabled') }}
              </span>
              <span v-else>{{ $t('global.status.disabled') }}</span>
            </b-form-checkbox>
          </b-form-group>
        </b-col>
        <b-col sm="4">
          <b-form-group
            :label="$t('pageDDNSNetwork.ddnsConfiguration.sendNsupdateEnabled')"
          >
            <b-form-checkbox
              v-model="sendNsupdateEnabled"
              data-test-id="ddns-toggle-ns-update"
              switch
              @change="changeNsupdateEnabled"
            >
              <span v-if="sendNsupdateEnabled">
                {{ $t('global.status.enabled') }}
              </span>
              <span v-else>{{ $t('global.status.disabled') }}</span>
            </b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-row>
    </page-section>
    <page-section
      :section-title="$t('pageDDNSNetwork.ddnsConfiguration.hostConfiguration')"
    >
      <b-row>
        <b-col sm="4">
          <b-form-group
            :label="$t('pageDDNSNetwork.ddnsConfiguration.hostNameSetting')"
          >
            <b-row>
              <b-col md="4">
                <b-form-radio
                  v-model="hostNameSetting"
                  name="Host-Name-Setting"
                  value="Manual"
                >
                  {{ $t('pageDDNSNetwork.ddnsConfiguration.manual') }}
                </b-form-radio>
              </b-col>
              <b-col>
                <b-form-radio
                  v-model="hostNameSetting"
                  name="Host-Name-Setting"
                  value="Auto"
                >
                  {{ $t('pageDDNSNetwork.ddnsConfiguration.auto') }}
                </b-form-radio>
              </b-col>
            </b-row>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group
            :label="$t('pageDDNSNetwork.ddnsConfiguration.staticHostName')"
            label-for="Static-Host-Name"
          >
            <b-form-input
              id="Static-Host-Name"
              v-model="StaticHostName"
              type="text"
              :disabled="hostNameSetting === 'Auto'"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </page-section>
    <page-section>
      <b-button type="submit" variant="primary" @click="saveConfigurations">
        {{ $t('global.action.save') }}
      </b-button>
    </page-section>
  </b-container>
</template>

<script>
import PageSection from '@/components/Global/PageSection';
import { mapState } from 'vuex';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
export default {
  name: 'DDNSSettings',
  components: {
    PageSection,
  },
  mixins: [BVToastMixin, LoadingBarMixin],
  data() {
    return {
      ipPriorityType: [
        {
          value: '1',
          text: this.$t('pageDDNSNetwork.ddnsConfiguration.ipv4IPPriority'),
        },
        {
          value: '2',
          text: this.$t('pageDDNSNetwork.ddnsConfiguration.ipv6IPPriority'),
        },
      ],
      IPriority: this.$store.getters['ddnsNetwork/ipPriority'],
      hostNameSetting: this.$store.getters['ddnsNetwork/hostName'],
      StaticHostName: this.$store.getters['ddnsNetwork/staticHostName'],
    };
  },
  computed: {
    ...mapState('ddnsNetwork', ['ipPriority', 'hostName', 'staticHostName']),
    sendHostNameEnabled: {
      get() {
        return this.$store.getters['ddnsNetwork/hostNameEnabled'];
      },
      set(newValue) {
        return newValue;
      },
    },
    sendNsupdateEnabled: {
      get() {
        return this.$store.getters['ddnsNetwork/nsUpdateEnabled'];
      },
      set(newValue) {
        return newValue;
      },
    },
  },
  watch: {
    ipPriority: function (value) {
      this.IPriority = value;
    },
    hostName: function (value) {
      this.hostNameSetting = value;
    },
    staticHostName: function (value) {
      this.StaticHostName = value;
    },
  },
  methods: {
    changeHostNameEnabled(state) {
      this.startLoader();
      this.$store
        .dispatch('ddnsNetwork/saveHostNameEnabled', state)
        .then((success) => {
          if (success) {
            this.successToast(success);
          }
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    changeNsupdateEnabled(state) {
      this.startLoader();
      this.$store
        .dispatch('ddnsNetwork/saveNsupdateEnabled', state)
        .then((success) => {
          if (success) {
            this.successToast(success);
          }
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    saveConfigurations() {
      let data = {};
      if (this.hostNameSetting === 'Manual') {
        data.HostNameSetting = this.hostNameSetting;
        data.StaticHostName = this.StaticHostName;
      }
      if (this.hostNameSetting === 'Auto') {
        data.HostNameSetting = this.hostNameSetting;
      }
      this.startLoader();
      this.$store
        .dispatch('ddnsNetwork/saveHostConfigurations', data)
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
