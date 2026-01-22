<template>
  <b-container fluid="xl">
    <page-title />
    <b-row>
      <b-col sm="4">
        <b-form-group
          :label="$t('powerShelf.powerEquipmentDevices')"
          label-for="powerEquipmentDevices"
        >
          <b-form-select
            id="powerEquipmentDevices"
            v-model="selectedPowerEquipment"
            :options="powerEquipmentOptions"
            data-test-id="powerEquipment-option"
            @change="onPowerEquipmentChange"
          >
            <template #first>
              <b-form-select-option :value="null" disabled>
                {{ $t('global.form.selectAnOption') }}
              </b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="8">
        <b-table
          id="table-powerEquipment"
          responsive="md"
          hover
          :items="powerEquipmentInfo"
          :fields="fields"
          show-empty
          :empty-text="$t('global.table.emptyMessage')"
        >
          <!-- Expand chevron icon -->
          <template #cell(expandRow)="row">
            <b-button
              variant="link"
              data-test-id="powerEquipment-button-expand"
              :title="expandRowLabel"
              class="btn-icon-only"
              @click="toggleRowDetails(row)"
            >
              <icon-chevron />
              <span class="sr-only">{{ expandRowLabel }}</span>
            </b-button>
          </template>

          <!-- Row Details -->
          <template #row-details="{ item }">
            <b-container fluid>
              <b-row>
                <b-col>
                  <!-- Branches -->
                  <dl v-if="item.id === $t('powerShelf.branches')">
                    <div
                      v-for="(branch, index) in item.data"
                      :key="index"
                      class="branch-section"
                    >
                      <h5>{{ branch.Name || 'Branch ' + (index + 1) }}</h5>
                      <dt>{{ $t('powerShelf.id') }}:</dt>
                      <dd>{{ branch.Id || $t('global.action.na') }}</dd>
                      <dt>{{ $t('powerShelf.ratedCurrentAmps') }}:</dt>
                      <dd>
                        {{ branch.RatedCurrentAmps || $t('global.action.na') }}
                      </dd>
                      <dt>{{ $t('powerShelf.branchCircuitType') }}:</dt>
                      <dd>
                        {{ branch.CircuitType || $t('global.action.na') }}
                      </dd>
                      <dt>{{ $t('powerShelf.health') }}:</dt>
                      <dd>
                        {{
                          (branch.Status && branch.Status.Health) ||
                          $t('global.action.na')
                        }}
                      </dd>
                      <dt>{{ $t('powerShelf.state') }}:</dt>
                      <dd class="mb-3">
                        {{
                          (branch.Status && branch.Status.State) ||
                          $t('global.action.na')
                        }}
                      </dd>
                    </div>
                  </dl>

                  <!-- Mains -->
                  <dl v-else-if="item.id === $t('powerShelf.mains')">
                    <div
                      v-for="(main, index) in item.data"
                      :key="index"
                      class="main-section"
                    >
                      <h5>{{ main.Name || 'Main ' + (index + 1) }}</h5>
                      <dt>{{ $t('powerShelf.id') }}:</dt>
                      <dd>{{ main.Id || $t('global.action.na') }}</dd>
                      <dt>{{ $t('powerShelf.ratedCurrentAmps') }}:</dt>
                      <dd>
                        {{
                          (main.CurrentAmps && main.CurrentAmps.Reading) ||
                          $t('global.action.na')
                        }}
                      </dd>
                      <dt>{{ $t('powerShelf.nominalVoltage') }}:</dt>
                      <dd>
                        {{ main.NominalVoltage || $t('global.action.na') }}
                      </dd>
                      <dt>{{ $t('powerShelf.health') }}:</dt>
                      <dd>
                        {{ main.Health || $t('global.action.na') }}
                      </dd>
                    </div>
                  </dl>

                  <!-- Metrics -->
                  <dl v-else-if="item.id === $t('powerShelf.metrics')">
                    <dt>{{ $t('powerShelf.energyKwh') }}:</dt>
                    <dd>
                      {{
                        (item.data &&
                          item.data.EnergykWh &&
                          item.data.EnergykWh.Reading) ||
                        $t('global.action.na')
                      }}
                    </dd>
                    <dt>{{ $t('powerShelf.powerWatts') }}:</dt>
                    <dd>
                      {{
                        (item.data &&
                          item.data.PowerWatts &&
                          item.data.PowerWatts.Reading) ||
                        $t('global.action.na')
                      }}
                    </dd>
                    <dt>{{ $t('powerShelf.temperatureCelsius') }}:</dt>
                    <dd>
                      {{
                        (item.data &&
                          item.data.TemperatureCelsius &&
                          item.data.TemperatureCelsius.Reading) ||
                        $t('global.action.na')
                      }}
                    </dd>
                  </dl>

                  <!-- Outlets -->
                  <dl v-else-if="item.id === $t('powerShelf.outlets')">
                    <div
                      v-for="(outlet, index) in item.data"
                      :key="index"
                      class="outlet-section"
                    >
                      <h5>{{ outlet.Name || 'Outlet ' + (index + 1) }}</h5>
                      <dt>{{ $t('powerShelf.id') }}:</dt>
                      <dd>{{ outlet.Id || $t('global.action.na') }}</dd>
                      <dt>{{ $t('powerShelf.outletType') }}:</dt>
                      <dd>{{ outlet.OutletType || $t('global.action.na') }}</dd>
                      <dt>{{ $t('powerShelf.ratedCurrentAmps') }}:</dt>
                      <dd>
                        {{ outlet.RatedCurrentAmps || $t('global.action.na') }}
                      </dd>
                      <dt>{{ $t('powerShelf.nominalVoltage') }}:</dt>
                      <dd>
                        {{ outlet.NominalVoltage || $t('global.action.na') }}
                      </dd>
                      <dt>{{ $t('powerShelf.powerEnabled') }}:</dt>
                      <dd>
                        {{
                          outlet.PowerEnabled !== undefined
                            ? outlet.PowerEnabled
                            : $t('global.action.na')
                        }}
                      </dd>
                      <dt>{{ $t('powerShelf.health') }}:</dt>
                      <dd>
                        {{
                          (outlet.Status && outlet.Status.Health) ||
                          $t('global.action.na')
                        }}
                      </dd>
                      <dt>{{ $t('powerShelf.state') }}:</dt>
                      <dd class="mb-3">
                        {{
                          (outlet.Status && outlet.Status.State) ||
                          $t('global.action.na')
                        }}
                      </dd>
                    </div>
                  </dl>
                </b-col>
              </b-row>
            </b-container>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import IconChevron from '@carbon/icons-vue/es/chevron--down/20';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import TableRowExpandMixin from '@/components/Mixins/TableRowExpandMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';

export default {
  components: { IconChevron, PageTitle },
  mixins: [BVToastMixin, TableRowExpandMixin, LoadingBarMixin],
  data() {
    return {
      fields: [
        {
          key: 'expandRow',
          label: '',
          tdClass: 'table-row-expand',
        },
        {
          key: 'id',
          label: this.$t('powerShelf.name'),
        },
      ],
      powerEquipmentInfo: [],
      selectedPowerEquipment: null,
      powerEquipmentOptions: [],
      powerEquipmentData: [],
    };
  },
  created() {
    this.startLoader();
    this.$store
      .dispatch('powerEquipment/getPowerEquipment')
      .then(() => {
        this.powerEquipmentData =
          this.$store.getters['powerEquipment/getPowerEquipmentData'] || [];
        return this.initPowerEquipmentOptions();
      })
      .catch(({ message }) => {
        this.errorToast(message);
      })
      .finally(() => {
        this.endLoader();
      });
  },
  methods: {
    initPowerEquipmentOptions() {
      this.powerEquipmentOptions = [];
      if (this.powerEquipmentData.length > 0) {
        this.powerEquipmentData.forEach((val) => {
          this.powerEquipmentOptions.push({
            value: val,
            text: val.Name || val.Id,
          });
        });
        this.selectedPowerEquipment = this.powerEquipmentOptions[0].value;
        // Return the promise so loader waits for details to load
        return this.powerEquipmentChange(this.selectedPowerEquipment);
      }
      return Promise.resolve();
    },
    onPowerEquipmentChange(value) {
      this.startLoader();
      this.powerEquipmentChange(value)
        .catch(({ message }) => {
          this.errorToast(message);
        })
        .finally(() => {
          this.endLoader();
        });
    },
    powerEquipmentChange(value) {
      this.powerEquipmentInfo = [];

      return this.$store
        .dispatch('powerEquipment/getPowerEquipmentDetails', value)
        .then(() => {
          const details =
            this.$store.getters['powerEquipment/getPowerEquipmentDetails'];

          // Branches
          if (details.Branches?.length > 0) {
            this.powerEquipmentInfo.push({
              id: this.$t('powerShelf.branches'),
              data: details.Branches,
            });
          }

          // Mains
          if (details.Mains?.length > 0) {
            this.powerEquipmentInfo.push({
              id: this.$t('powerShelf.mains'),
              data: details.Mains,
            });
          }

          // Metrics
          if (details.Metrics) {
            this.powerEquipmentInfo.push({
              id: this.$t('powerShelf.metrics'),
              data: details.Metrics,
            });
          }

          // Outlets
          if (details.Outlets?.length > 0) {
            this.powerEquipmentInfo.push({
              id: this.$t('powerShelf.outlets'),
              data: details.Outlets,
            });
          }
        })
        .catch(({ message }) => {
          this.errorToast(message);
        })
        .finally(() => {
          this.endLoader();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.branch-section,
.main-section,
.outlet-section {
  padding: 1rem 0;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }

  h5 {
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 600;
  }
}
</style>
