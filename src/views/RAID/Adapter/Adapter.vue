<template>
  <b-container fluid="xl">
    <page-title />
    <page-section v-if="adapterData.length">
      <b-row>
        <b-col>
          <b-card no-body>
            <b-tabs
              active-nav-item-class="font-weight-bold"
              card
              content-class="mt-3"
            >
              <b-tab
                v-for="data in adapterData"
                :key="data.raidId"
                :title="data.storageId"
              >
                <b-row
                  v-if="data.FirmwareVersion"
                  class="d-flex align-items-center"
                >
                  <b-col sm="2" class="text-right">
                    <dd>
                      <strong>{{ $t('pageAdapter.firmwareVersion') }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ data.FirmwareVersion }}
                    </dd>
                  </b-col>
                </b-row>
                <b-row v-if="data.MemberId" class="d-flex align-items-center">
                  <b-col sm="2" class="text-right">
                    <dd>
                      <strong>{{ $t('pageAdapter.memberId') }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ data.MemberId }}
                    </dd>
                  </b-col>
                </b-row>
                <b-row v-if="data.Model" class="d-flex align-items-center">
                  <b-col sm="2" class="text-right">
                    <dd>
                      <strong>{{ $t('pageAdapter.name') }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ data.Model }}
                    </dd>
                  </b-col>
                </b-row>
                <b-row
                  v-if="data.SerialNumber"
                  class="d-flex align-items-center"
                >
                  <b-col sm="2" class="text-right">
                    <dd>
                      <strong>{{ $t('pageAdapter.serialNumber') }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ data.SerialNumber }}
                    </dd>
                  </b-col>
                </b-row>
                <b-row v-if="data.RAIDTypes" class="d-flex align-items-center">
                  <b-col sm="2" class="text-right">
                    <dd>
                      <strong>{{
                        $t('pageAdapter.supportedRaidTypes')
                      }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ data.RAIDTypes }}
                    </dd>
                  </b-col>
                </b-row>
                <b-row class="mt-5">
                  <b-col sm="3">
                    <b-button
                      variant="primary"
                      to="/raid/physical-device"
                      :disabled="!data.physicalDevice"
                      @click="onClickPhysical(data.raidId)"
                    >
                      {{ $t('pageAdapter.viewPhysicalDevices') }}
                    </b-button>
                  </b-col>
                  <b-col sm="3">
                    <b-button
                      variant="primary"
                      to="/raid/logical-device"
                      :disabled="!data.physicalDevice || !data.logicalDevice"
                      @click="onClickLogical(data.raidId)"
                    >
                      {{ $t('pageAdapter.viewLogicalDevices') }}
                    </b-button>
                  </b-col>
                </b-row>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
      </b-row>
    </page-section>
    <b-row v-else>
      <b-col sm="4">
        <span>
          <b-alert show variant="warning">{{
            $t('pageAdapter.noRaidControllerAvailable')
          }}</b-alert>
        </span>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import PageTitle from '@/components/Global/PageTitle';
import PageSection from '@/components/Global/PageSection';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import { mapState } from 'vuex';
export default {
  name: 'Adapter',
  components: { PageTitle, PageSection },
  mixins: [LoadingBarMixin],
  data() {
    return {
      logicalDisabled: false,
    };
  },
  computed: {
    ...mapState('raid', ['adapterData']),
  },
  created() {
    this.$store.state.raid.physicalTab = '';
    this.$store.state.raid.logicalTab = '';
    this.startLoader();
    Promise.all([this.$store.dispatch('raid/getStorageData')]).finally(() =>
      this.endLoader()
    );
  },
  methods: {
    onClickPhysical(data) {
      this.$store.state.raid.physicalTab = data.split('-')[0];
    },
    onClickLogical(data) {
      this.$store.state.raid.logicalTab = data.split('-')[0];
    },
  },
};
</script>
