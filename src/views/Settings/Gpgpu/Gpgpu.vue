<template>
  <b-container fluid="xl">
    <page-title />
    <b-row>
      <b-col xl="12">
        <b-card no-body>
          <b-tabs
            active-nav-item-class="font-weight-bold"
            card
            content-class="xl-12"
          >
            <b-tab
              :title="$t('gpgpu.gpgpuInterfaceHeader')"
              @click="activeTab = 'gpgpuTab'"
            >
              <gpu-info
                v-if="activeTab === 'gpgpuTab'"
                :processor-info="gpuProcessorInfo"
              ></gpu-info>
            </b-tab>
            <b-tab
              :title="$t('gpgpu.fpga.fpgaInterfaceHeader')"
              @click="activeTab = 'fpgaTab'"
            >
              <fpga-info
                v-if="activeTab === 'fpgaTab'"
                :device-info="fpgaDeviceInfo"
                :processor-info="fpgaProcessorInfo"
              ></fpga-info>
            </b-tab>
            <b-tab title="BaseBoard" @click="activeTab = 'baseBoardTab'">
              <base-board-info
                v-if="activeTab === 'baseBoardTab'"
                :device-info="baseBoardDeviceInfo"
              ></base-board-info>
            </b-tab>
          </b-tabs>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import PageTitle from '@/components/Global/PageTitle';
import GpuInfo from './Gpu.vue';
import FpgaInfo from './FPGA.vue';
import BaseBoardInfo from './BaseBoard.vue';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';

export default {
  components: {
    PageTitle,
    GpuInfo,
    FpgaInfo,
    BaseBoardInfo,
  },
  mixins: [LoadingBarMixin, BVToastMixin],
  data() {
    return {
      chassisInfo: '',
      fpgaDeviceInfo: [],
      baseBoardDeviceInfo: [],
      gpuSystemsInfo: {},
      gpuProcessorInfo: [],
      fpgaProcessorInfo: [],
      activeTab: 'gpgpuTab',
    };
  },
  created() {
    this.startLoader();
    this.$store.dispatch('gpu/getGpgpuChassisData').catch(({ message }) => {
      this.endLoader();
      this.errorToast(message);
    });
    this.startLoader();
    this.$store
      .dispatch('firmware/getFirmwareInventory')
      .catch(({ message }) => {
        this.endLoader();
        this.errorToast(message);
      });
    this.startLoader();
    this.$store
      .dispatch('gpu/getGpuSystems')
      .then(() => {
        this.startLoader();
        this.gpuSystemsInfo = this.$store.getters['gpu/getGpuSystemsInfo'];
        this.$store
          .dispatch('gpu/getGpuProcessors', this.gpuSystemsInfo)
          .then(() => {
            this.gpuProcessorInfo =
              this.$store.getters['gpu/getGpuProcessorData'];
            this.fpgaProcessorInfo =
              this.$store.getters['gpu/getFpgaProcessorData'];
            this.endLoader();
          })
          .catch(({ message }) => {
            this.endLoader();
            this.errorToast(message);
          });
      })
      .catch(({ message }) => {
        this.errorToast(message);
        this.endLoader();
      });
  },
};
</script>
