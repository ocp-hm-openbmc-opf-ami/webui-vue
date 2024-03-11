<template>
  <b-container fluid="xl">
    <page-title />
    <page-section v-if="totalNicData.length">
      <b-row>
        <b-col>
          <b-card no-body>
            <b-tabs
              active-nav-item-class="font-weight-bold"
              card
              content-class="mt-3"
            >
              <b-tab
                v-for="data in totalNicData"
                :key="data.deviceId"
                :title="
                  data.MCTP_over_SMBUS_EID != 0
                    ? 'NIC Controller - (Endpoint ID - ' +
                      data.MCTP_over_SMBUS_EID +
                      ')'
                    : 'NIC Controller - (Endpoint ID - ' +
                      data.MCTP_over_PCIE_EID +
                      ')'
                "
                @click="getTabIndex(data.deviceId, data.physicalPortNumber)"
              >
                <b-row v-if="data.vendorId" class="d-flex align-items-center">
                  <b-col sm="3" class="text-right">
                    <dd>
                      <strong>{{ $t('pageNic.vendorId') }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ data.vendorId }}
                    </dd>
                  </b-col>
                </b-row>
                <b-row v-if="data.deviceId" class="d-flex align-items-center">
                  <b-col sm="3" class="text-right">
                    <dd>
                      <strong>{{ $t('pageNic.deviceId') }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ data.deviceId }}
                    </dd>
                  </b-col>
                </b-row>
                <b-row
                  v-if="data.NCSIVersion"
                  class="d-flex align-items-center"
                >
                  <b-col sm="3" class="text-right">
                    <dd>
                      <strong>{{ $t('pageNic.NCSIVersion') }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ data.NCSIVersion }}
                    </dd>
                  </b-col>
                </b-row>

                <b-row v-if="data.linkStatus" class="d-flex align-items-center">
                  <b-col sm="3" class="text-right">
                    <dd>
                      <strong>{{ $t('pageNic.linkStatus') }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ data.linkStatus }}
                    </dd>
                  </b-col>
                </b-row>

                <b-row
                  v-if="data.firmwareName"
                  class="d-flex align-items-center"
                >
                  <b-col sm="3" class="text-right">
                    <dd>
                      <strong>{{ $t('pageNic.firmwareName') }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ data.firmwareName }}
                    </dd>
                  </b-col>
                </b-row>
                <b-row
                  v-if="data.firmwareVersion"
                  class="d-flex align-items-center"
                >
                  <b-col sm="3" class="text-right">
                    <dd>
                      <strong>{{ $t('pageNic.firmwareVersion') }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ data.firmwareVersion }}
                    </dd>
                  </b-col>
                </b-row>
                <b-row
                  v-if="data.currentTemperature"
                  class="d-flex align-items-center"
                >
                  <b-col sm="3" class="text-right">
                    <dd>
                      <strong>{{ $t('pageNic.currentTemperature') }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ data.currentTemperature + '&#176; C' }}
                    </dd>
                  </b-col>
                </b-row>
                <b-row
                  v-if="data.channelCount"
                  class="d-flex align-items-center"
                >
                  <b-col sm="3" class="text-right">
                    <dd>
                      <strong>{{ $t('pageNic.channelCount') }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ data.channelCount }}
                    </dd>
                  </b-col>
                </b-row>
                <b-row
                  v-if="data.signalDetected"
                  class="d-flex align-items-center"
                >
                  <b-col sm="3" class="text-right">
                    <dd>
                      <strong>{{ $t('pageNic.signalDetected') }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ data.signalDetected }}
                    </dd>
                  </b-col>
                </b-row>
                <b-row
                  v-if="data.physicalPortNumber"
                  class="d-flex align-items-center"
                >
                  <b-col sm="3" class="text-right">
                    <dd>
                      <strong>{{ $t('pageNic.physicalPortNumber') }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ data.physicalPortNumber }}
                    </dd>
                  </b-col>
                </b-row>
                <b-row v-if="data.health" class="d-flex align-items-center">
                  <b-col sm="3" class="text-right">
                    <dd>
                      <strong>{{ $t('pageNic.health') }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ data.health }}
                    </dd>
                  </b-col>
                </b-row>
                <b-row
                  v-if="data.getBootConfigProperties"
                  class="d-flex align-items-center"
                >
                  <b-col sm="3" class="text-right">
                    <dd>
                      <strong>{{
                        $t('pageNic.getBootConfigProperties')
                      }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ firstLetterUpperCase(data.getBootConfigProperties) }}
                    </dd>
                  </b-col>
                </b-row>
                <b-row
                  v-if="data.getNCCapabilitiesAndSettings"
                  class="d-flex align-items-center"
                >
                  <b-col sm="3" class="text-right">
                    <dd>
                      <strong>{{
                        $t('pageNic.getNCCapabilitiesAndSettings')
                      }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{
                        firstLetterUpperCase(data.getNCCapabilitiesAndSettings)
                      }}
                    </dd>
                  </b-col>
                </b-row>
                <b-row
                  v-if="data.getPFAssignmentProperties"
                  class="d-flex align-items-center"
                >
                  <b-col sm="3" class="text-right">
                    <dd>
                      <strong>{{
                        $t('pageNic.getPFAssignmentProperties')
                      }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ firstLetterUpperCase(data.getPFAssignmentProperties) }}
                    </dd>
                  </b-col>
                </b-row>
                <b-row
                  v-if="data.getPackageStatus"
                  class="d-flex align-items-center"
                >
                  <b-col sm="3" class="text-right">
                    <dd>
                      <strong>{{ $t('pageNic.getPackageStatus') }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ firstLetterUpperCase(data.getPackageStatus) }}
                    </dd>
                  </b-col>
                </b-row>
                <b-row
                  v-if="data.getPartitionStatisticsPropertiesnnelCount"
                  class="d-flex align-items-center"
                >
                  <b-col sm="3" class="text-right">
                    <dd>
                      <strong>{{
                        $t('pageNic.getPartitionStatisticsProperties')
                      }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{
                        firstLetterUpperCase(
                          data.getPartitionStatisticsPropertiesnnelCount
                        )
                      }}
                    </dd>
                  </b-col>
                </b-row>
                <b-row
                  v-if="data.getPortConfigurationProperties"
                  class="d-flex align-items-center"
                >
                  <b-col sm="3" class="text-right">
                    <dd>
                      <strong>{{
                        $t('pageNic.getPortConfigurationProperties')
                      }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{
                        firstLetterUpperCase(
                          data.getPortConfigurationProperties
                        )
                      }}
                    </dd>
                  </b-col>
                </b-row>
                <!-- <b-row v-if="data.UUID" class="d-flex align-items-center">
                  <b-col sm="3" class="text-right">
                    <dd>
                      <strong>{{ $t('pageNic.UUID') }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ data.UUID }}
                    </dd>
                  </b-col>
                </b-row>
                <b-row v-if="data.SVId" class="d-flex align-items-center">
                  <b-col sm="3" class="text-right">
                    <dd>
                      <strong>{{ $t('pageNic.SVId') }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ data.SVId }}
                    </dd>
                  </b-col>
                </b-row>
                <b-row v-if="data.SSId" class="d-flex align-items-center">
                  <b-col sm="3" class="text-right">
                    <dd>
                      <strong>{{ $t('pageNic.SSId') }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ data.SSId }}
                    </dd>
                  </b-col>
                </b-row> -->
                <b-row
                  v-if="data.manufacturerId"
                  class="d-flex align-items-center"
                >
                  <b-col sm="3" class="text-right">
                    <dd>
                      <strong>{{ $t('pageNic.manufacturerId') }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ data.manufacturerId }}
                    </dd>
                  </b-col>
                </b-row>
                <b-row
                  v-if="data.OEM_Mac_Address"
                  class="d-flex align-items-center"
                >
                  <b-col sm="3" class="text-right">
                    <dd>
                      <strong>{{ $t('pageNic.OEMMacAddress') }}</strong>
                    </dd>
                  </b-col>
                  <b-col>
                    <dd>
                      {{ data.OEM_Mac_Address }}
                    </dd>
                  </b-col>
                </b-row>
                <page-section
                  v-if="data.macAddress"
                  class="page-section"
                  :section-title="$t('pageNic.headers.MacAddress')"
                >
                  <b-row
                    v-if="data.macAddress"
                    class="d-flex align-items-center"
                  >
                    <b-col sm="3" class="text-right">
                      <dd>
                        <strong>{{ $t('pageNic.macAddressCount') }}</strong>
                      </dd>
                    </b-col>
                    <b-col>
                      <dd>
                        {{ data.macAddress.MACAddressCount }}
                      </dd>
                    </b-col>
                  </b-row>
                  <b-row
                    v-for="i in data.macAddress.MACAddressCount"
                    :key="i"
                    class="d-flex align-items-center"
                  >
                    <b-col sm="3" class="text-right">
                      <dd>
                        <strong>MACAddress{{ i }}</strong>
                      </dd>
                    </b-col>
                    <b-col>
                      <dd>
                        {{ data.macAddress[`MACAddress${i}`] }}
                      </dd>
                    </b-col>
                  </b-row>
                </page-section>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
      </b-row>
    </page-section>
    <b-row v-show="totalNicData.length === 0">
      <b-col sm="5">
        <span>
          <b-alert show variant="warning">{{
            $t('pageNic.noInformationAvailable')
          }}</b-alert>
        </span>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import PageSection from '@/components/Global/PageSection';
import DataFormatterMixin from '@/components/Mixins/DataFormatterMixin';
export default {
  components: {
    PageTitle,
    PageSection,
  },
  mixins: [BVToastMixin, LoadingBarMixin, DataFormatterMixin],
  beforeRouteLeave(to, from, next) {
    // Hide loader if the user navigates to another page
    // before request is fulfilled.
    this.hideLoader();
    next();
  },
  // data() {
  //   return {
  //     data: this.$store.getters['nic/getAllNicData'],
  //     // tabIndex: 0,
  //     // isBusy: true,
  //     // fields: [
  //     //   {
  //     //     key: 'vendorId',
  //     //     label: this.$t('pageNic.vendorId'),
  //     //     class: 'text-center',
  //     //   },
  //     //   {
  //     //     key: 'deviceId',
  //     //     label: this.$t('pageNic.deviceId'),
  //     //     class: 'text-center',
  //     //   },
  //     //   {
  //     //     key: 'currentTemperature',
  //     //     label: this.$t('pageNic.currentTemperature'),
  //     //     class: 'text-center',
  //     //   },
  //     //   {
  //     //     key: 'channelCount',
  //     //     label: this.$t('pageNic.channelCount'),
  //     //     class: 'text-center',
  //     //   },
  //     //   {
  //     //     key: 'linkStatus',
  //     //     label: this.$t('pageNic.linkStatus'),
  //     //     class: 'text-center',
  //     //   },
  //     //   {
  //     //     key: 'firmwareName',
  //     //     label: this.$t('pageNic.firmwareName'),
  //     //     class: 'text-center',
  //     //   },
  //     //   {
  //     //     key: 'firmwareVersion',
  //     //     label: this.$t('pageNic.firmwareVersion'),
  //     //     class: 'text-center',
  //     //   },
  //     //   {
  //     //     key: 'flowControlConfiguration',
  //     //     label: this.$t('pageNic.flowControlConfiguration'),
  //     //     class: 'text-center',
  //     //   },
  //     //   {
  //     //     key: 'signalDetected',
  //     //     label: this.$t('pageNic.signalDetected'),
  //     //     class: 'text-center',
  //     //   },
  //     //   {
  //     //     key: 'physicalPortNumber',
  //     //     label: this.$t('pageNic.physicalPortNumber'),
  //     //     class: 'text-center',
  //     //   },
  //     //   {
  //     //     key: 'health',
  //     //     label: this.$t('pageNic.health'),
  //     //     class: 'text-center',
  //     //   },
  //     // ],
  //   };
  // },
  computed: {
    totalNicData() {
      return this.$store.getters['nic/getAllNicData'];
    },
  },
  created() {
    this.startLoader();
    Promise.all([this.$store.dispatch('nic/getNicData')]).finally(() => {
      this.endLoader();
      this.isBusy = false;
    });
  },
};
</script>
<style scoped>
.page-section {
  margin-bottom: 1rem;
}
</style>
