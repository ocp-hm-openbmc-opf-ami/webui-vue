<template>
  <page-section :section-title="$t('pageInventory.chassis')">
    <b-table
      responsive="md"
      hover
      :items="chassis"
      :fields="fields"
      show-empty
      :empty-text="$t('global.table.emptyMessage')"
      :busy="isBusy"
    >
      <!-- Expand chevron icon -->
      <template #cell(expandRow)="row">
        <b-button
          variant="link"
          data-test-id="hardwareStatus-button-expandChassis"
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
      <!-- Toggle identify LED -->
      <template #cell(identifyLed)="row">
        <b-form-checkbox
          v-if="hasIdentifyLed(row.item.identifyLed)"
          v-model="row.item.identifyLed"
          :disabled="isButtonDisable"
          name="switch"
          switch
          @change="toggleIdentifyLedValue(row.item)"
        >
          <span v-if="row.item.identifyLed">
            {{ $t('global.status.on') }}
          </span>
          <span v-else> {{ $t('global.status.off') }} </span>
        </b-form-checkbox>
        <div v-else>--</div>
      </template>
      <template #row-details="{ item }">
        <b-container fluid>
          <b-row>
            <b-col
              v-if="
                item.name || item.partNumber || item.serialNumber || item.model
              "
              class="mt-2"
              sm="6"
              xl="6"
            >
              <dl>
                <!-- Name -->
                <template v-if="item.name">
                  <dt>{{ $t('pageInventory.table.name') }}:</dt>
                  <dd>{{ dataFormatter(item.name) }}</dd>
                </template>
                <!-- Part number -->
                <template v-if="item.partNumber">
                  <dt>{{ $t('pageInventory.table.partNumber') }}:</dt>
                  <dd>{{ dataFormatter(item.partNumber) }}</dd>
                </template>
                <!-- Serial Number -->
                <template v-if="item.serialNumber">
                  <dt>{{ $t('pageInventory.table.serialNumber') }}:</dt>
                  <dd>{{ dataFormatter(item.serialNumber) }}</dd>
                </template>
                <!-- Model -->
                <template v-if="item.model">
                  <dt>{{ $t('pageInventory.table.model') }}:</dt>
                  <dd class="mb-2">
                    {{ dataFormatter(item.model) }}
                  </dd>
                </template>
              </dl>
            </b-col>
            <b-col
              v-if="item.statusState || item.power || item.assetTag"
              class="mt-2"
              sm="6"
              xl="6"
            >
              <dl>
                <!-- Status state -->
                <template v-if="item.statusState">
                  <dt>{{ $t('pageInventory.table.statusState') }}:</dt>
                  <dd>{{ dataFormatter(item.statusState) }}</dd>
                </template>
                <!-- Power state -->
                <template v-if="item.power">
                  <dt>{{ $t('pageInventory.table.power') }}:</dt>
                  <dd>{{ dataFormatter(item.power) }}</dd>
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
          </b-row>
          <div class="section-divider mb-3 mt-3"></div>
          <b-row>
            <b-col
              v-if="item.manufacturer || item.chassisType"
              class="mt-2"
              sm="6"
              xl="6"
            >
              <dl>
                <!-- Manufacturer -->
                <template v-if="item.manufacturer">
                  <dt>{{ $t('pageInventory.table.manufacturer') }}:</dt>
                  <dd>{{ dataFormatter(item.manufacturer) }}</dd>
                </template>
                <!-- Chassis Type -->
                <template v-if="item.chassisType">
                  <dt>{{ $t('pageInventory.table.chassisType') }}:</dt>
                  <dd>{{ dataFormatter(item.chassisType) }}</dd>
                </template>
              </dl>
            </b-col>
            <b-col
              v-if="item.minPowerWatts || item.maxPowerWatts"
              class="mt-2"
              sm="6"
              xl="6"
            >
              <dl>
                <!-- Min power -->
                <template v-if="item.minPowerWatts">
                  <dt>{{ $t('pageInventory.table.minPowerWatts') }}:</dt>
                  <dd>
                    {{ dataFormatter(item.minPowerWatts) }}
                    {{ $t('unit.W') }}
                  </dd>
                </template>
                <!-- Max power -->
                <template v-if="item.maxPowerWatts">
                  <dt>{{ $t('pageInventory.table.maxPowerWatts') }}:</dt>
                  <dd>
                    {{ dataFormatter(item.maxPowerWatts) }}
                    {{ $t('unit.W') }}
                  </dd>
                </template>
              </dl>
            </b-col>
          </b-row>
        </b-container>
      </template>
    </b-table>
  </page-section>
</template>

<script>
import PageSection from '@/components/Global/PageSection';
import IconChevron from '@carbon/icons-vue/es/chevron--down/20';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
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
          key: 'identifyLed',
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
    chassis() {
      return this.$store.getters['chassis/chassis'];
    },
  },
  created() {
    this.$store.dispatch('chassis/getChassisInfo').finally(() => {
      // Emit initial data fetch complete to parent component
      this.$root.$emit('hardware-status-chassis-complete');
      this.isBusy = false;
    });
  },
  methods: {
    toggleIdentifyLedValue(row) {
      this.$store
        .dispatch('chassis/updateIdentifyLedValue', {
          uri: row.uri,
          identifyLed: row.identifyLed,
        })
        .then(() => {
          if (row.identifyLed) {
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
    // TO DO: Remove this method when the LocationIndicatorActive is added from backend.
    hasIdentifyLed(identifyLed) {
      return typeof identifyLed === 'boolean';
    },
  },
};
</script>
