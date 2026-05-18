<template>
  <page-section :section-title="$t('pageInventory.bmcManager')">
    <b-table
      responsive="md"
      hover
      :items="items"
      :fields="fields"
      show-empty
      :empty-text="$t('global.table.emptyMessage')"
      :busy="isBusy"
    >
      <!-- Expand chevron icon -->
      <template #cell(expandRow)="row">
        <b-button
          variant="link"
          data-test-id="hardwareStatus-button-expandBmc"
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
                item.name ||
                item.partNumber ||
                item.serialNumber ||
                item.sparePartNumber ||
                item.model ||
                item.uuid ||
                item.serviceEntryPointUuid
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
                <!-- Serial number -->
                <template v-if="item.serialNumber">
                  <dt>{{ $t('pageInventory.table.serialNumber') }}:</dt>
                  <dd>{{ dataFormatter(item.serialNumber) }}</dd>
                </template>
                <!-- Spare part number -->
                <template v-if="item.sparePartNumber">
                  <dt>{{ $t('pageInventory.table.sparePartNumber') }}:</dt>
                  <dd>{{ dataFormatter(item.sparePartNumber) }}</dd>
                </template>
                <!-- Model -->
                <template v-if="item.model">
                  <dt>{{ $t('pageInventory.table.model') }}:</dt>
                  <dd>{{ dataFormatter(item.model) }}</dd>
                </template>
                <!-- UUID -->
                <template v-if="item.uuid">
                  <dt>{{ $t('pageInventory.table.uuid') }}:</dt>
                  <dd>{{ dataFormatter(item.uuid) }}</dd>
                </template>
                <!-- Service entry point UUID -->
                <template v-if="item.serviceEntryPointUuid">
                  <dt>
                    {{ $t('pageInventory.table.serviceEntryPointUuid') }}:
                  </dt>
                  <dd>{{ dataFormatter(item.serviceEntryPointUuid) }}</dd>
                </template>
              </dl>
            </b-col>
            <b-col
              v-if="
                item.statusState ||
                item.powerState ||
                item.healthRollup ||
                item.dateTime ||
                item.lastResetTime
              "
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
                <template v-if="item.powerState">
                  <dt>{{ $t('pageInventory.table.power') }}:</dt>
                  <dd>{{ dataFormatter(item.powerState) }}</dd>
                </template>
                <!-- Health rollup -->
                <template v-if="item.healthRollup">
                  <dt>{{ $t('pageInventory.table.healthRollup') }}:</dt>
                  <dd>{{ dataFormatter(item.healthRollup) }}</dd>
                </template>
                <!-- BMC date and time -->
                <template v-if="item.dateTime">
                  <dt>{{ $t('pageInventory.table.bmcDateTime') }}:</dt>
                  <dd>
                    {{ item.dateTime | formatDate }}
                    {{ item.dateTime | formatTime }}
                  </dd>
                </template>
                <!-- Reset date and time -->
                <template v-if="item.lastResetTime">
                  <dt>{{ $t('pageInventory.table.lastResetTime') }}:</dt>
                  <dd>
                    {{ item.lastResetTime | formatDate }}
                    {{ item.lastResetTime | formatTime }}
                  </dd>
                </template>
              </dl>
            </b-col>
          </b-row>
          <div class="section-divider mb-3 mt-3"></div>
          <b-row>
            <b-col
              v-if="item.manufacturer || item.description || item.managerType"
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
                <!-- Description -->
                <template v-if="item.description">
                  <dt>{{ $t('pageInventory.table.description') }}:</dt>
                  <dd>{{ dataFormatter(item.description) }}</dd>
                </template>
                <!-- Manager type -->
                <template v-if="item.managerType">
                  <dt>{{ $t('pageInventory.table.managerType') }}:</dt>
                  <dd>{{ dataFormatter(item.managerType) }}</dd>
                </template>
              </dl>
            </b-col>
            <b-col
              v-if="
                item.firmwareVersion ||
                item.commandShellConnectTypes ||
                item.commandShellMaxSessions ||
                item.commandShellEnabled
              "
              class="mt-2"
              sm="6"
              xl="6"
            >
              <!-- Firmware Version  -->
              <dl v-if="item.firmwareVersion">
                <dt>{{ $t('pageInventory.table.firmwareVersion') }}:</dt>
                <dd>{{ item.firmwareVersion }}</dd>
              </dl>
              <!-- Command Shell -->
              <template
                v-if="
                  item.commandShellConnectTypes ||
                  item.commandShellMaxSessions ||
                  item.commandShellEnabled
                "
              >
                <p class="mt-1 mb-2 h6 float-none m-0">
                  {{ $t('pageInventory.table.commandShell') }}
                </p>
                <dl class="ml-4">
                  <template v-if="item.commandShellConnectTypes">
                    <dt>
                      {{ $t('pageInventory.table.connectTypesSupported') }}:
                    </dt>
                    <dd>
                      {{ dataFormatterArray(item.commandShellConnectTypes) }}
                    </dd>
                  </template>
                  <template v-if="item.commandShellMaxSessions">
                    <dt>
                      {{ $t('pageInventory.table.maxConcurrentSessions') }}:
                    </dt>
                    <dd>
                      {{ dataFormatter(item.commandShellMaxSessions) }}
                    </dd>
                  </template>
                  <template v-if="item.commandShellEnabled">
                    <dt>{{ $t('pageInventory.table.serviceEnabled') }}:</dt>
                    <dd>
                      {{ dataFormatter(item.commandShellEnabled) }}
                    </dd>
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
import PageSection from '@/components/Global/PageSection';
import IconChevron from '@carbon/icons-vue/es/chevron--down/20';
import StatusIcon from '@/components/Global/StatusIcon';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
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
          key: 'health',
          label: this.$t('pageInventory.table.health'),
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
      return this.userPrivilege !== privilegesId.admin;
    },
    bmc() {
      return this.$store.getters['bmc/bmc'];
    },
    items() {
      if (this.bmc) {
        return [this.bmc];
      } else {
        return [];
      }
    },
  },
  created() {
    this.$store.dispatch('bmc/getBmcInfo').finally(() => {
      // Emit initial data fetch complete to parent component
      this.$root.$emit('hardware-status-bmc-manager-complete');
      this.isBusy = false;
    });
  },
  methods: {
    toggleIdentifyLedValue(row) {
      this.$store
        .dispatch('bmc/updateIdentifyLedValue', {
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
    // TO DO: remove hasIdentifyLed method once the following story is merged:
    // https://gerrit.openbmc-project.xyz/c/openbmc/bmcweb/+/43179
    hasIdentifyLed(identifyLed) {
      return typeof identifyLed === 'boolean';
    },
  },
};
</script>
