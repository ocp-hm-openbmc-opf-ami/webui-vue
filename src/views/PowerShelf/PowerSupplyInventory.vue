<template>
  <b-container fluid="xl">
    <page-title />
    <b-row>
      <b-col sm="4">
        <b-form-group
          :label="$t('powerShelf.powerSupplyDevices')"
          label-for="powerSupply"
        >
          <b-form-select
            id="powerSupply"
            v-model="selectedPowerSupplyDevice"
            :options="powerSupplyOptions"
            data-test-id="powerSupply-option"
            @change="powerSupplyInfoChange"
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
      <b-col xl="12">
        <b-card no-body>
          <b-tabs
            active-nav-item-class="font-weight-bold"
            card
            content-class="xl-12"
          >
            <b-tab
              :title="$t('powerShelf.tab.powerSupply')"
              @click="activeTab = 'powerSupplyTab'"
            >
              <power-supply-tab
                v-if="activeTab === 'powerSupplyTab'"
                :power-supply-info="powerSupplyInfo"
              />
            </b-tab>
            <b-tab
              :title="$t('powerShelf.tab.metrics')"
              @click="activeTab = 'metricsTab'"
            >
              <power-supply-metrics-tab
                v-if="activeTab === 'metricsTab'"
                :power-supply-metrics="powerSupplyMetrics"
                :selected-device="selectedPowerSupplyDevice"
              />
            </b-tab>
          </b-tabs>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import PowerSupplyTab from './PowerSupplyTab.vue';
import PowerSupplyMetricsTab from './PowerSupplyMetricsTab.vue';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';

export default {
  components: {
    PageTitle,
    PowerSupplyTab,
    PowerSupplyMetricsTab,
  },
  mixins: [BVToastMixin, LoadingBarMixin],
  data() {
    return {
      activeTab: 'powerSupplyTab',
      powerSupplyOptions: [],
      selectedPowerSupplyDevice: null,
      powerSupplyData: [],
      powerSupplyInfo: {},
      powerSupplyMetrics: {},
    };
  },
  created() {
    this.startLoader();
    this.$store
      .dispatch('powerShelf/getPowerSupplies')
      .then(() => {
        this.powerSupplyData =
          this.$store.getters['powerShelf/getPowerSupplyData'] || [];
        this.initPowerSupplyOptions();
      })
      .catch(({ message }) => {
        this.errorToast(message);
      })
      .finally(() => {
        this.endLoader();
      });
  },
  methods: {
    initPowerSupplyOptions() {
      this.powerSupplyOptions = [];
      if (this.powerSupplyData.length > 0) {
        this.powerSupplyData.forEach((val) => {
          this.powerSupplyOptions.push({
            value: val.Id,
            text: val.Name || val.Id,
          });
        });
        this.selectedPowerSupplyDevice = this.powerSupplyOptions[0].value;
        this.powerSupplyInfoChange(this.selectedPowerSupplyDevice);
      }
    },
    powerSupplyInfoChange(selectedval) {
      const selectedPS = this.powerSupplyData.find(
        (ps) => ps.Id === selectedval,
      );
      console.log('selectedPS', selectedPS);
      if (selectedPS) {
        this.powerSupplyInfo = {
          Id: selectedPS.Id,
          Name: selectedPS.Name,
          Model: selectedPS.Model,
          Manufacturer: selectedPS.Manufacturer,
          PartNumber: selectedPS.PartNumber,
          SerialNumber: selectedPS.SerialNumber,
          PowerSupplyType: selectedPS.PhaseWiringType,
          Health: selectedPS?.Status?.Health,
          State: selectedPS?.Status?.State,
        };
      }
      console.log('powerSupplyInfo', this.powerSupplyInfo);
    },
  },
};
</script>
