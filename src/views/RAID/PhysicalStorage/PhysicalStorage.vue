<template>
  <b-container fluid="xl">
    <page-title />
    <page-section v-if="physicalDeviceAllData.length">
      <b-row>
        <b-col>
          <b-card no-body>
            <b-tabs
              v-model="tabIndex"
              active-nav-item-class="font-weight-bold"
              card
              content-class="mt-3"
            >
              <b-tab
                v-for="data in physicalDeviceAllData"
                :key="data.raidId"
                :title="data.physicalId"
              >
                <b-table
                  responsive="md"
                  :fields="tableFields"
                  :items="data"
                  class="mb-0 text-center"
                  show-empty
                >
                </b-table>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
      </b-row>
    </page-section>
    <b-row v-else>
      <b-col sm="5">
        <span>
          <b-alert show variant="warning">{{
            $t('pagePhysicalDevice.noPhysicalDevice')
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
  name: 'PhysicalStorage',
  components: { PageTitle, PageSection },
  mixins: [LoadingBarMixin],
  data() {
    return {
      tabIndex: 0,
      tableItems: [],
      tableFields: [
        {
          key: 'Id',
          label: this.$t('pagePhysicalDevice.table.id'),
          sortable: true,
        },
        {
          key: 'FailurePredicted',
          label: this.$t('pagePhysicalDevice.table.failurePredicted'),
          sortable: true,
        },
        {
          key: 'BlockSizeBytes',
          label: this.$t('pagePhysicalDevice.table.blockSizeBytes'),
          sortable: true,
        },
        {
          key: 'Manufacturer',
          label: this.$t('pagePhysicalDevice.table.manufacturer'),
          sortable: true,
        },
        {
          key: 'NegotiatedSpeedGbs',
          label: this.$t('pagePhysicalDevice.table.negotiatedSpeedGbs'),
          sortable: true,
        },
        {
          key: 'Protocol',
          label: this.$t('pagePhysicalDevice.table.protocol'),
          sortable: true,
        },
        {
          key: 'Revision',
          label: this.$t('pagePhysicalDevice.table.revision'),
          sortable: true,
        },
        {
          key: 'SerialNumber',
          label: this.$t('pagePhysicalDevice.table.serialNumber'),
          sortable: true,
        },
        {
          key: 'Health',
          label: this.$t('pagePhysicalDevice.table.health'),
          sortable: true,
        },
      ],
    };
  },
  computed: {
    ...mapState('raid', ['physicalDeviceAllData', 'loader', 'physicalTab']),
  },
  watch: {
    loader() {
      if (this.loader) {
        this.endLoader();
      }
    },
    physicalDeviceAllData() {
      if (this.physicalDeviceAllData.length) {
        setTimeout(() => {
          this.physicalDeviceAllData.forEach((physicalDeviceData, index) => {
            if (physicalDeviceData.raidId == this.physicalTab) {
              this.tabIndex = index;
            }
          });
        }, 1000);
      }
    },
  },
  created() {
    this.startLoader();
    this.$store.dispatch('raid/getPhysicalData');
  },
};
</script>
