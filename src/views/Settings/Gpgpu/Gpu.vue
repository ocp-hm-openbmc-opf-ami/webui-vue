<template>
  <b-tabs active-nav-item-class="font-weight-bold" card content-class="xl-12">
    <b-tab
      :title="$t('gpgpu.tab.gpgpuInterfaceProcessorTab')"
      @click="activeTab = 'gpuProcessorTab'"
    >
      <gpu-processor-tab
        v-if="activeTab === 'gpuProcessorTab'"
        :processor-info="processorInfo"
      />
    </b-tab>
    <b-tab
      :title="$t('gpgpu.tab.gpgpuInterfaceMemoryTab')"
      @click="activeTab = 'gpuMemoryTab'"
    >
      <gpu-memory-tab v-if="activeTab === 'gpuMemoryTab'"></gpu-memory-tab>
    </b-tab>
    <b-tab
      :title="$t('gpgpu.tab.gpgpuInterfaceChassisTab')"
      @click="activeTab = 'gpuChassisTab'"
    >
      <gpu-chassis-tab v-if="activeTab === 'gpuChassisTab'"></gpu-chassis-tab>
    </b-tab>
  </b-tabs>
</template>
<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin';
import GpuProcessorTab from './GpuProcessorTab.vue';
import GpuMemoryTab from './GpuMemoryTab.vue';
import GpuChassisTab from './GpuChassisTab.vue';

export default {
  components: {
    GpuProcessorTab,
    GpuMemoryTab,
    GpuChassisTab,
  },
  mixins: [BVToastMixin, LoadingBarMixin, VuelidateMixin],
  props: {
    processorInfo: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      activeTab: 'gpuProcessorTab',
    };
  },
};
</script>
<style lang="scss" scoped>
.auto_scroll {
  overflow: auto;
  box-shadow: 4px 6px 12px 0 rgba(0, 0, 0, 0.3);
  background-color: white;
}
.table_auto {
  margin-bottom: 20px;
}
</style>
