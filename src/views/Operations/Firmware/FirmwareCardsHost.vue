<template>
  <page-section :section-title="$t('pageFirmware.sectionTitleHostCards')">
    <b-card-group deck>
      <!-- Running image -->
      <b-card>
        <template #header>
          <p class="font-weight-bold m-0">
            {{ $t('pageFirmware.cardTitleRunning') }}
          </p>
        </template>
        <dl class="mb-0">
          <dt>{{ $t('pageFirmware.cardBodyVersion') }}</dt>
          <dd class="mb-0">{{ runningVersion }}</dd>
        </dl>
      </b-card>

      <!-- Backup image -->
      <b-card>
        <template #header>
          <p class="font-weight-bold m-0">
            {{ $t('pageFirmware.cardTitleBackup') }}
          </p>
        </template>
        <dl class="mb-0">
          <dt>{{ $t('pageFirmware.cardBodyVersion') }}</dt>
          <dd class="mb-0">
            <status-icon v-if="showBackupImageStatus" status="danger" />
            <span v-if="showBackupImageStatus" class="sr-only">
              {{ backupStatus }}
            </span>
            {{ backupVersion }}
          </dd>
        </dl>
      </b-card>
      <b-card>
        <template #header>
          <p class="font-weight-bold m-0">
            {{ $t('pageFirmware.cardTitleClearConfig') }}
          </p>
        </template>
        <dl class="mb-0">
          <b-form-checkbox
            id="ClearConfigSwitch"
            v-model="clearConfigState"
            data-test-id="firmware-toggle-clear-Config"
            switch
            :disabled="isButtonDisable"
            @change="changeClearConfigState"
          >
            <span class="sr-only">
              {{ $t('pageFirmware.ClearConfig') }}
            </span>
            <span v-if="clearConfigState">
              {{ $t('global.status.enabled') }}
            </span>
            <span v-else>{{ $t('global.status.disabled') }}</span>
          </b-form-checkbox>
        </dl>
      </b-card>
    </b-card-group>
  </page-section>
</template>

<script>
import PageSection from '@/components/Global/PageSection';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';

export default {
  components: { PageSection },
  mixins: [BVToastMixin],
  computed: {
    ...mapGetters('global', ['userPrivilege']),
    isButtonDisable() {
      return this.userPrivilege === privilegesId.readOnly;
    },
    running() {
      return this.$store.getters['firmware/activeHostFirmware'];
    },
    backup() {
      return this.$store.getters['firmware/backupHostFirmware'];
    },
    clearConfigState: {
      get() {
        return this.$store.getters['firmware/clearConfigState'];
      },
      set(newValue) {
        return newValue;
      },
    },
    runningVersion() {
      if (this.running?.version === 'NA') {
        return '--';
      } else {
        return this.running?.version || '--';
      }
    },
    backupVersion() {
      return this.backup?.version || '--';
    },
    backupStatus() {
      return this.backup?.status || null;
    },
    showBackupImageStatus() {
      return (
        this.backupStatus === 'Critical' || this.backupStatus === 'Warning'
      );
    },
  },
  methods: {
    changeClearConfigState(state) {
      this.$store
        .dispatch('firmware/saveClearConfig', state ? true : false)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
  },
};
</script>

<style lang="scss" scoped>
.page-section {
  margin-top: -$spacer * 1.5;
}
</style>
