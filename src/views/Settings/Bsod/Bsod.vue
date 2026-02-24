<template>
  <div>
    <page-title />
    <b-row class="align-items-center">
      <b-col class="d-flex">
        <b-alert
          v-if="base64ImageData === 'Image File is not Created'"
          show
          variant="warning"
          class="mb-0 d-inline-block"
          >{{ $t('pageBsod.bsodImageNotAvailable') }}</b-alert
        >
        <b-alert
          v-if="base64ImageData != 'Image File is not Created'"
          show
          variant="success"
          class="mb-0 d-inline-block"
          >{{ $t('pageBsod.lastBsodCaptured') }}</b-alert
        >
      </b-col>
      <b-col sm="auto" class="ml-auto">
        <b-button
          variant="primary"
          type="button"
          :disabled="isButtonDisable"
          @click="triggerBsodImage"
        >
          <icon-camera />
          {{ $t('pageBsod.triggerBsodImage') }}
        </b-button>
        <b-button
          v-if="base64ImageData != 'Image File is not Created'"
          class="ml-3"
          variant="primary"
          type="button"
          :disabled="isButtonDisable"
          @click="downloadImage"
        >
          <icon-download />
          {{ $t('pageBsod.downloadBsodImage') }}
        </b-button>
        <b-button
          v-if="base64ImageData != 'Image File is not Created'"
          class="ml-3"
          variant="primary"
          type="button"
          :disabled="isButtonDisable"
          @click="deleteBsodImage"
        >
          <icon-trashcan />
          {{ $t('pageBsod.deleteBsodImage') }}
        </b-button>
      </b-col>
    </b-row>
    <br />
    <img
      v-if="base64ImageData != 'Image File is not Created'"
      width="1500"
      :src="'data:image/jpeg;base64,' + base64ImageData"
      alt="Download BSOD Image"
    />
  </div>
</template>

<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import PageTitle from '@/components/Global/PageTitle';
import IconTrashcan from '@carbon/icons-vue/es/trash-can/20';
import IconDownload from '@carbon/icons-vue/es/download/20';
import IconCamera from '@carbon/icons-vue/es/camera--action/20';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';

export default {
  name: 'Bsod',
  components: { PageTitle, IconTrashcan, IconDownload, IconCamera },
  mixins: [BVToastMixin, LoadingBarMixin],
  computed: {
    base64ImageData() {
      return this.$store.getters['bsod/bsodImageData'];
    },
    ...mapGetters('global', ['userPrivilege']),
    isButtonDisable() {
      return this.userPrivilege === privilegesId.readOnly;
    },
  },
  created() {
    this.startLoader();
    this.$store
      .dispatch('bsod/getBsodImage')
      .finally(() => {
        this.endLoader();
      })
      .catch(({ message }) => this.errorToast(message));
  },
  methods: {
    downloadImage() {
      const linkSource = `data:${'image/jpeg'};base64,${this.base64ImageData}`;
      const downloadLink = document.createElement('a');
      downloadLink.href = linkSource;
      downloadLink.download = 'BSOD_SCREEN.jpeg';
      downloadLink.click();
    },
    deleteBsodImage() {
      this.startLoader();
      this.$store
        .dispatch('bsod/deleteBsodImage')
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    triggerBsodImage() {
      this.startLoader();
      this.$store
        .dispatch('bsod/triggerBsodImage')
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
  },
};
</script>

<style scoped></style>
