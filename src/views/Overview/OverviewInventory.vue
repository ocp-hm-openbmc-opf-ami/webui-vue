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
          <dd v-if="greenLed || amberLed || blueLed">
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
              :animation="blueBlinkStatus"
              :style="blueLedStatus"
              :title="blueLed"
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
import { mapState } from 'vuex';

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
      blueBlinkStatus: null,
      greenLedStatus: null,
      amberLedStatus: null,
      blueLedStatus: null,
    };
  },
  computed: {
    ...mapState({
      systems: (state) => {
        let systemData = state.system.systems[0];
        return systemData ? systemData : {};
      },
    }),
    greenLed() {
      return this.$store.getters['system/getGreenLedStatus'];
    },
    amberLed() {
      return this.$store.getters['system/getAmberLedStatus'];
    },
    blueLed() {
      return this.$store.getters['system/getBlueLedStatus'];
    },
  },
  watch: {
    greenLed() {
      this.setGreenLED();
    },
    amberLed() {
      this.setAmberLed();
    },
    blueLed() {
      this.setBlueLed();
    },
  },
  created() {
    this.$root.$emit('overview-inventory-complete');
    this.setGreenLED();
    this.setAmberLed();
    this.setBlueLed();
  },
  methods: {
    toggleIdentifyLedSwitch(state) {
      this.$store
        .dispatch('system/changeIdentifyLedState', state)
        .catch(({ message }) => this.errorToast(message));
    },
    setGreenLED() {
      // Handle Green LED status
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
    },
    setAmberLed() {
      // Handle Amber LED status
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
    },
    setBlueLed() {
      // Handle Blue LED status
      if (this.blueLed == 'Blinking') {
        this.blueBlinkStatus = 'throb';
        this.blueLedStatus = 'color: #00bfff; margin: 5px';
      }
      if (this.blueLed == 'Off' || this.blueLed == 'Unknown') {
        this.blueBlinkStatus = null;
        this.blueLedStatus =
          'color: #617f89; margin: 5px; filter: brightness(0.9)';
      }
    },
  },
};
</script>
