<template>
  <div>
    <page-title />
    <b-row sm="12">
      <b-col sm="3">
        <span v-if="base64ImageData === 'Image File is  not Created'">
          <b-alert show variant="warning">{{
            $t('pageBsod.bsodImageNotAvailable')
          }}</b-alert>
        </span>
        <span v-if="base64ImageData != 'Image File is  not Created'">
          <b-alert show variant="success">{{
            $t('pageBsod.lastBsodCaptured')
          }}</b-alert>
        </span>
      </b-col>
      <b-col sm="8" class="text-right">
        <b-button
          v-if="base64ImageData != 'Image File is  not Created'"
          variant="primary"
          type="button"
          @click="downloadImage"
        >
          {{ $t('pageBsod.downloadBsodImage') }}
        </b-button>
        <b-button
          v-if="base64ImageData != 'Image File is  not Created'"
          class="ml-3"
          variant="primary"
          type="button"
          @click="deleteBsodImage"
        >
          {{ $t('pageBsod.deleteBsodImage') }}
        </b-button>
      </b-col>
    </b-row>
    <br />
    <img
      v-if="base64ImageData != 'Image File is  not Created'"
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

export default {
  name: 'Bsod',
  components: { PageTitle },
  mixins: [BVToastMixin, LoadingBarMixin],
  computed: {
    base64ImageData() {
      return this.$store.getters['bsod/bsodImageData'];
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
  },
};
</script>

<style scoped></style>
