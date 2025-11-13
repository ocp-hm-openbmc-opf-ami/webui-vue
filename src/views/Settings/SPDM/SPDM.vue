<template>
  <b-container fluid="xl">
    <page-title :description="$t('pageSPDM.description')" />
    <page-section v-if="spdmData && spdmData.length > 0">
      <b-row>
        <b-col>
          <b-card no-body>
            <b-tabs
              v-model="selectedSpdmIndex"
              active-nav-item-class="font-weight-bold"
              card
              content-class="mt-3"
              @input="handleTabChange"
            >
              <b-tab v-for="data in spdmData" :key="data.Id" :title="data.Id">
                <spdm-info
                  @show-certificate="showCertificateModal"
                  @show-signed-measurements="showSignedMeasurementsModal"
                />
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
      </b-row>
    </page-section>
    <page-section v-else>
      <b-alert show variant="danger">{{
        $t('pageSPDM.componentIntegrityEmpty')
      }}</b-alert>
    </page-section>
    <b-modal
      id="certificate-modal"
      no-stacking
      size="lg"
      :title="$t('pageSPDM.spdmGetCertificate')"
    >
      <div style="word-break: break-all">
        {{ selectedSpdmCertificate }}
      </div>
      <template #modal-footer="{ hide }">
        <b-button
          variant="primary"
          data-test-id="spdm-model-certificate"
          @click="hide()"
        >
          <icon-close class="mr-2" />
          {{ $t('global.action.close') }}
        </b-button>
      </template>
    </b-modal>
    <b-modal
      id="signed-measurements-modal"
      no-stacking
      size="lg"
      :title="$t('pageSPDM.spdmGetSignedMeasurements')"
    >
      <div v-if="signedMeasurements">
        <pre style="white-space: pre-wrap; word-break: break-all">{{
          signedMeasurements
        }}</pre>
      </div>
      <template #modal-footer="{ hide }">
        <b-button
          variant="primary"
          data-test-id="spdm-model-signed-measurements"
          @click="hide()"
        >
          <icon-close class="mr-2" />
          {{ $t('global.action.close') }}
        </b-button>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import PageSection from '@/components/Global/PageSection';
import SpdmInfo from './SpdmInfo.vue';
import { mapState, mapActions } from 'vuex';
import IconClose from '@carbon/icons-vue/es/close/20';
import BVToastMixin from '@/components/Mixins/BVToastMixin';

export default {
  name: 'SPDM',
  components: {
    PageTitle,
    PageSection,
    SpdmInfo,
    IconClose,
  },
  mixins: [LoadingBarMixin, BVToastMixin],
  data() {
    return {
      // errorMessage: null,
      signedMeasurements: null,
    };
  },
  computed: {
    ...mapState('spdm', ['spdmData', 'selectedSpdmCertificate']),
    selectedSpdmIndex: {
      get() {
        return this.$store.state.spdm.selectedSpdmIndex;
      },
      set(value) {
        this.setSelectedTabIndex(value);
      },
    },
  },
  created() {
    this.startLoader();
    this.$store
      .dispatch('spdm/getSpdmData')
      .catch(({ message }) => {
        this.errorToast(message);
      })
      .finally(() => {
        this.endLoader();
      });
  },
  methods: {
    ...mapActions('spdm', ['setSelectedTabIndex', 'setSelectedTabId']),
    showCertificateModal() {
      this.$bvModal.show('certificate-modal');
    },
    showSignedMeasurementsModal(measurements) {
      this.signedMeasurements = measurements;
      this.$bvModal.show('signed-measurements-modal');
    },
    handleTabChange(index) {
      const selectedSpdm = this.spdmData[index];
      if (selectedSpdm) {
        this.setSelectedTabId(selectedSpdm.Id).then(() => {
          this.startLoader();
          this.$store
            .dispatch('spdm/getSpdmInfo')
            .catch(({ message }) => {
              this.errorToast(message);
            })
            .finally(() => {
              this.endLoader();
            });
        });
      }
    },
  },
};
</script>
