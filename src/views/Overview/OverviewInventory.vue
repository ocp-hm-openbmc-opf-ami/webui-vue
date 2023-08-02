<template>
  <overview-card
    :title="$t('pageOverview.inventory')"
    :to="`/hardware-status/inventory`"
  >
    <b-row class="mt-3">
      <b-col sm="6">
        <dl sm="6">
          <dt>{{ $t('pageOverview.systemIdentifyLed') }}</dt>
          <dd>
            <b-form-checkbox
              id="identifyLedSwitch"
              v-model="systems.locationIndicatorActive"
              data-test-id="overviewInventory-checkbox-identifyLed"
              switch
              @change="toggleIdentifyLedSwitch"
            >
              <span v-if="systems.locationIndicatorActive">
                {{ $t('global.status.on') }}
              </span>
              <span v-else>{{ $t('global.status.off') }}</span>
            </b-form-checkbox>
          </dd>
        </dl>
      </b-col>
      <b-col sm="6">
        <dl sm="6">
          <dt>{{ $t('global.table.overAllSystemHealth') }}</dt>
          <dd v-if="greenLed || amberLed || susackLed">
            <b-icon
              icon="circle-fill"
              :animation="greenBlinkStatus"
              :style="greenLedStatus"
              :title="greenLed"
              font-scale="2"
            />
            <span> </span>
            <b-icon
              icon="circle-fill"
              :animation="amberBlinkStatus"
              :style="amberLedStatus"
              :title="amberLed"
              font-scale="2"
            />
            <b-icon
              icon="circle-fill"
              :animation="susackBlinkStatus"
              :style="susackLedStatus"
              :title="susackLed"
              font-scale="2"
            />
          </dd>
          <dd v-else>
            {{ $t('global.status.notAvailable') }}
          </dd>
        </dl>
      </b-col>
    </b-row>
  </overview-card>
</template>

<script>
import OverviewCard from './OverviewCard';
import { BIcon } from 'bootstrap-vue';

export default {
  name: 'Inventory',
  components: {
    OverviewCard,
    BIcon,
  },
  data() {
    return {
      greenBlinkStatus: null,
      amberBlinkStatus: null,
      susackBlinkStatus: null,
      greenLedStatus: null,
      amberLedStatus: null,
      susackLedStatus: null,
      greenLed: '',
      amberLed: '',
      susackLed: '',
    };
  },
  computed: {
    systems() {
      let systemData = this.$store.getters['system/systems'][0];
      return systemData ? systemData : {};
    },
  },
  created() {
    this.$store.dispatch('system/getSystem').finally(() => {
      this.updateStatusLed();
      this.$root.$emit('overview-inventory-complete');
    });
  },
  methods: {
    toggleIdentifyLedSwitch(state) {
      this.$store
        .dispatch('system/changeIdentifyLedState', state)
        .catch(({ message }) => this.errorToast(message));
    },
    updateStatusLed() {
      // Handle Green LED status
      this.greenLed = this.$store.getters['system/getGreenLedStatus'];
      if (this.greenLed == 'Blinking') {
        this.greenBlinkStatus = 'throb';
        this.greenLedStatus = 'color: #008000; margin: 5px';
      }
      if (this.greenLed == 'On') {
        this.greenBlinkStatus = null;
        this.greenLedStatus = 'color: #008000; margin: 5px';
      }
      if (this.greenLed == 'Off' || this.greenLed == 'Unknown') {
        this.greenBlinkStatus = null;
        this.greenLedStatus =
          'color: #8fbc8f; margin: 5px; filter: brightness(0.9)';
      }
      // Handle Amber LED status
      this.amberLed = this.$store.getters['system/getAmberLedStatus'];
      if (this.amberLed == 'Blinking') {
        this.amberBlinkStatus = 'throb';
        this.amberLedStatus = 'color: #ffbf00; margin: 5px';
      }
      if (this.amberLed == 'On') {
        this.amberBlinkStatus = null;
        this.amberLedStatus = 'color: #ffbf00; margin: 5px';
      }
      if (this.amberLed == 'Off' || this.amberLed == 'Unknown') {
        this.amberBlinkStatus = null;
        this.amberLedStatus =
          'color: #cc9900; margin: 5px; filter: brightness(0.9)';
      }
      // Handle Susack LED status
      this.susackLed = this.$store.getters['system/getSusackLedStatus'];
      if (this.susackLed == 'Blinking') {
        this.susackBlinkStatus = 'throb';
        this.susackLedStatus = 'color: #00bfff; margin: 5px';
      }
      if (this.susackLed == 'On') {
        this.susackBlinkStatus = null;
        this.susackLedStatus = 'color: #00bfff; margin: 5px';
      }
      if (this.susackLed == 'Off' || this.susackLed == 'Unknown') {
        this.susackBlinkStatus = null;
        this.susackLedStatus =
          'color: #617f89; margin: 5px; filter: brightness(0.9)';
      }
    },
  },
};
</script>
