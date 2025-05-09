<template>
  <b-modal
    id="modal-update-firmware"
    :title="$t('pageFirmware.sectionTitleUpdateFirmware')"
    :ok-title="$t('pageFirmware.form.updateFirmware.startUpdate')"
    :cancel-title="$t('global.action.cancel')"
    @ok="$emit('ok')"
  >
    <template v-if="isSingleFileUploadEnabled">
      <p>
        {{ $t('pageFirmware.modal.updateFirmwareInfo') }}
      </p>
      <p>
        {{
          $t('pageFirmware.modal.updateFirmwareInfo2', {
            running: runningBmcVersion,
          })
        }}
      </p>
      <p class="m-0">
        {{ $t('pageFirmware.modal.updateFirmwareInfo3') }}
      </p>
    </template>
    <template v-else>
      <template v-if="isPFREnable">
        {{ $t('pageFirmware.modal.updateFirmwareInfoPfr') }}
      </template>
      <template v-else>
        {{ $t('pageFirmware.modal.updateFirmwareInfoDefault') }}
      </template>
    </template>
  </b-modal>
</template>

<script>
export default {
  data() {
    return {
      isPFREnable: process.env.VUE_APP_PFR_SUPPORT === 'true' ? true : false,
    };
  },
  computed: {
    runningBmc() {
      return this.$store.getters['firmware/activeBmcFirmware'];
    },
    runningBmcVersion() {
      return this.runningBmc?.version || '--';
    },
    isSingleFileUploadEnabled() {
      return this.$store.getters['firmware/isSingleFileUploadEnabled'];
    },
  },
};
</script>
