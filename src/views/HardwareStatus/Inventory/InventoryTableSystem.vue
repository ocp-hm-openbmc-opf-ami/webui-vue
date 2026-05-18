<template>
  <page-section :section-title="$t('pageInventory.system')">
    <b-table
      responsive="md"
      hover
      show-empty
      :items="systems"
      :fields="fields"
      :empty-text="$t('global.table.emptyMessage')"
      :busy="isBusy"
    >
      <!-- Expand chevron icon -->
      <template #cell(expandRow)="row">
        <b-button
          variant="link"
          data-test-id="hardwareStatus-button-expandSystem"
          :title="expandRowLabel"
          class="btn-icon-only"
          @click="toggleRowDetails(row)"
        >
          <icon-chevron />
          <span class="sr-only">{{ expandRowLabel }}</span>
        </b-button>
      </template>

      <!-- Health -->
      <template #cell(health)="{ value }">
        <status-icon :status="statusIcon(value)" />
        {{ value }}
      </template>

      <template #cell(locationIndicatorActive)="{ item }">
        <b-form-checkbox
          id="identifyLedSwitchSystem"
          v-model="item.locationIndicatorActive"
          :disabled="isButtonDisable"
          data-test-id="inventorySystem-toggle-identifyLed"
          switch
          @change="toggleIdentifyLedSwitch"
        >
          <span v-if="item.locationIndicatorActive">
            {{ $t('global.status.on') }}
          </span>
          <span v-else>{{ $t('global.status.off') }}</span>
        </b-form-checkbox>
      </template>

      <template #row-details="{ item }">
        <b-container fluid>
          <b-row>
            <b-col
              v-if="item.serialNumber || item.model || item.assetTag"
              class="mt-2"
              sm="6"
            >
              <dl>
                <!-- Serial number -->
                <template v-if="item.serialNumber">
                  <dt>{{ $t('pageInventory.table.serialNumber') }}:</dt>
                  <dd>{{ dataFormatter(item.serialNumber) }}</dd>
                </template>
                <!-- Model -->
                <template v-if="item.model">
                  <dt>{{ $t('pageInventory.table.model') }}:</dt>
                  <dd>{{ dataFormatter(item.model) }}</dd>
                </template>
                <!-- Asset tag -->
                <template v-if="item.assetTag">
                  <dt>{{ $t('pageInventory.table.assetTag') }}:</dt>
                  <dd class="mb-2">
                    {{ dataFormatter(item.assetTag) }}
                  </dd>
                </template>
              </dl>
            </b-col>
            <b-col
              v-if="item.statusState || item.powerState || item.healthRollup"
              class="mt-2"
              sm="6"
            >
              <dl>
                <!-- Status state -->
                <template v-if="item.statusState">
                  <dt>{{ $t('pageInventory.table.statusState') }}:</dt>
                  <dd>{{ dataFormatter(item.statusState) }}</dd>
                </template>
                <!-- Power state -->
                <template v-if="item.powerState">
                  <dt>{{ $t('pageInventory.table.power') }}:</dt>
                  <dd>{{ dataFormatter(item.powerState) }}</dd>
                </template>
                <!-- Health rollup -->
                <template v-if="item.healthRollup">
                  <dt>{{ $t('pageInventory.table.healthRollup') }}:</dt>
                  <dd>{{ dataFormatter(item.healthRollup) }}</dd>
                </template>
              </dl>
            </b-col>
          </b-row>
          <div class="section-divider mb-3 mt-3"></div>
          <b-row>
            <b-col
              v-if="
                item.manufacturer ||
                item.description ||
                item.subModel ||
                item.systemType
              "
              class="mt-1"
              sm="6"
            >
              <dl>
                <!-- Manufacturer -->
                <template v-if="item.manufacturer">
                  <dt>{{ $t('pageInventory.table.manufacturer') }}:</dt>
                  <dd>{{ dataFormatter(item.manufacturer) }}</dd>
                </template>
                <!-- Description -->
                <template v-if="item.description">
                  <dt>{{ $t('pageInventory.table.description') }}:</dt>
                  <dd>{{ dataFormatter(item.description) }}</dd>
                </template>
                <!-- Sub Model -->
                <template v-if="item.subModel">
                  <dt>{{ $t('pageInventory.table.subModel') }}:</dt>
                  <dd>
                    {{ dataFormatter(item.subModel) }}
                  </dd>
                </template>
                <!-- System Type -->
                <template v-if="item.systemType">
                  <dt>{{ $t('pageInventory.table.systemType') }}:</dt>
                  <dd>
                    {{ dataFormatter(item.systemType) }}
                  </dd>
                </template>
              </dl>
            </b-col>
            <b-col
              v-if="
                item.memorySummaryState ||
                item.memorySummaryHealth ||
                item.memorySummaryHealthRollup ||
                item.totalSystemMemoryGiB ||
                item.processorSummaryState ||
                item.processorSummaryHealth ||
                item.processorSummaryHealthRoll ||
                item.processorSummaryCount ||
                item.processorSummaryCoreCount
              "
              sm="6"
            >
              <!-- Memory Summary -->
              <template
                v-if="
                  item.memorySummaryState ||
                  item.memorySummaryHealth ||
                  item.memorySummaryHealthRollup ||
                  item.totalSystemMemoryGiB
                "
              >
                <p class="mt-1 mb-2 h6 float-none m-0">
                  {{ $t('pageInventory.table.memorySummary') }}
                </p>
                <dl class="ml-4">
                  <!-- Status state -->
                  <template v-if="item.memorySummaryState">
                    <dt>{{ $t('pageInventory.table.statusState') }}:</dt>
                    <dd>{{ dataFormatter(item.memorySummaryState) }}</dd>
                  </template>
                  <!-- Health -->
                  <template v-if="item.memorySummaryHealth">
                    <dt>{{ $t('pageInventory.table.health') }}:</dt>
                    <dd>{{ dataFormatter(item.memorySummaryHealth) }}</dd>
                  </template>
                  <!-- Health Roll  -->
                  <template v-if="item.memorySummaryHealthRollup">
                    <dt>{{ $t('pageInventory.table.healthRollup') }}:</dt>
                    <dd>{{ dataFormatter(item.memorySummaryHealthRollup) }}</dd>
                  </template>
                  <!-- Total system memory -->
                  <template v-if="item.totalSystemMemoryGiB">
                    <dt>
                      {{ $t('pageInventory.table.totalSystemMemoryGiB') }}:
                    </dt>
                    <dd>
                      {{ dataFormatter(item.totalSystemMemoryGiB) }}
                      {{ $t('unit.GiB') }}
                    </dd>
                  </template>
                </dl>
              </template>
              <!-- Processor Summary -->
              <template
                v-if="
                  item.processorSummaryState ||
                  item.processorSummaryHealth ||
                  item.processorSummaryHealthRoll ||
                  item.processorSummaryCount ||
                  item.processorSummaryCoreCount
                "
              >
                <p class="mt-1 mb-2 h6 float-none m-0">
                  {{ $t('pageInventory.table.processorSummary') }}
                </p>
                <dl class="ml-4">
                  <!-- Status state -->
                  <template v-if="item.processorSummaryState">
                    <dt>{{ $t('pageInventory.table.statusState') }}:</dt>
                    <dd>{{ dataFormatter(item.processorSummaryState) }}</dd>
                  </template>
                  <!-- Health -->
                  <template v-if="item.processorSummaryHealth">
                    <dt>{{ $t('pageInventory.table.health') }}:</dt>
                    <dd>{{ dataFormatter(item.processorSummaryHealth) }}</dd>
                  </template>
                  <!-- Health Rollup -->
                  <template v-if="item.processorSummaryHealthRoll">
                    <dt>{{ $t('pageInventory.table.healthRollup') }}:</dt>
                    <dd>
                      {{ dataFormatter(item.processorSummaryHealthRoll) }}
                    </dd>
                  </template>
                  <!-- Count -->
                  <template v-if="item.processorSummaryCount">
                    <dt>{{ $t('pageInventory.table.count') }}:</dt>
                    <dd>{{ dataFormatter(item.processorSummaryCount) }}</dd>
                  </template>
                  <!-- Core Count -->
                  <template v-if="item.processorSummaryCoreCount">
                    <dt>{{ $t('pageInventory.table.coreCount') }}:</dt>
                    <dd>{{ dataFormatter(item.processorSummaryCoreCount) }}</dd>
                  </template>
                </dl>
              </template>
            </b-col>
          </b-row>
        </b-container>
      </template>
    </b-table>
  </page-section>
</template>

<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import PageSection from '@/components/Global/PageSection';
import IconChevron from '@carbon/icons-vue/es/chevron--down/20';

import StatusIcon from '@/components/Global/StatusIcon';

import TableRowExpandMixin from '@/components/Mixins/TableRowExpandMixin';
import DataFormatterMixin from '@/components/Mixins/DataFormatterMixin';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';

export default {
  components: { IconChevron, PageSection, StatusIcon },
  mixins: [BVToastMixin, TableRowExpandMixin, DataFormatterMixin],
  data() {
    return {
      isBusy: true,
      fields: [
        {
          key: 'expandRow',
          label: '',
          tdClass: 'table-row-expand',
        },
        {
          key: 'id',
          label: this.$t('pageInventory.table.id'),
          formatter: this.dataFormatter,
        },
        {
          key: 'hardwareType',
          label: this.$t('pageInventory.table.hardwareType'),
          formatter: this.dataFormatter,
          tdClass: 'text-nowrap',
        },
        {
          key: 'health',
          label: this.$t('pageInventory.table.health'),
          formatter: this.dataFormatter,
          tdClass: 'text-nowrap',
        },
        {
          key: 'locationIndicatorActive',
          label: this.$t('pageInventory.table.identifyLed'),
          formatter: this.dataFormatter,
        },
      ],
    };
  },
  computed: {
    ...mapGetters('global', ['userPrivilege']),
    isButtonDisable() {
      return this.userPrivilege === privilegesId.readOnly;
    },
    systems() {
      return this.$store.getters['system/systems'];
    },
  },
  created() {
    this.$store.dispatch('system/getSystem').finally(() => {
      // Emit initial data fetch complete to parent component
      this.$root.$emit('hardware-status-system-complete');
      this.isBusy = false;
    });
  },
  methods: {
    toggleIdentifyLedSwitch(state) {
      this.$store
        .dispatch('system/changeIdentifyLedState', state)
        .then(() => {
          if (state) {
            this.successToast(
              this.$t('pageInventory.toast.successEnableIdentifyLed'),
            );
          } else {
            this.successToast(
              this.$t('pageInventory.toast.successDisableIdentifyLed'),
            );
          }
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => {
          this.$store.dispatch('system/getSystem');
          this.$store.dispatch('bmc/getBmcInfo');
          this.$store.dispatch('chassis/getChassisInfo');
        });
    },
  },
};
</script>
