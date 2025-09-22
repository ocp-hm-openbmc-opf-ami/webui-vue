<template>
  <div>
    <b-tabs active-nav-item-class="font-weight-bold" card content-class="xl-12">
      <b-tab
        v-if="fpgaDeviceBasedChecking"
        :title="$t('gpgpu.tab.gpgpuInterfaceProcessorTab')"
        @click="activeTab = 'fpgaProcessorTab'"
      >
        <fpga-processor-tab
          v-if="activeTab === 'fpgaProcessorTab'"
          :processor-info="processorInfo"
        ></fpga-processor-tab>
      </b-tab>
      <b-tab
        :title="$t('gpgpu.tab.gpgpuInterfaceChassisTab')"
        @click="activeTab = 'fpgaChassisTab'"
      >
        <fpga-chassis-tab
          v-if="activeTab === 'fpgaChassisTab'"
          :device-info="deviceInfo"
        ></fpga-chassis-tab>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin';
import FpgaProcessorTab from './FPGAProcessorTab.vue';
import FpgaChassisTab from './FPGAChassisTab.vue';

export default {
  components: {
    FpgaProcessorTab,
    FpgaChassisTab,
  },
  mixins: [LoadingBarMixin, BVToastMixin, VuelidateMixin],
  props: {
    deviceInfo: {
      type: Array,
      default: () => [],
    },
    processorInfo: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      activeTab: 'fpgaProcessorTab',
    };
  },
  computed: {
    fpgaDeviceBasedChecking() {
      return this.$store.getters['gpu/getFpgaModelStatusInfo'];
    },
  },
  created() {
    this.activeTab = this.fpgaDeviceBasedChecking
      ? 'fpgaProcessorTab'
      : 'fpgaChassisTab'; // activate the tab based on the model
  },
};
</script>
<style lang="scss">
.auto_scroll {
  overflow: auto;
  box-shadow: 4px 6px 12px 0 rgba(0, 0, 0, 0.3);
  background-color: white;
}
.table_auto {
  margin-bottom: 20px;
}
</style>
