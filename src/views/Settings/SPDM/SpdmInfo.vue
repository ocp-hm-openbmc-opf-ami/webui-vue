<template>
  <div>
    <b-row v-if="spdmInfo">
      <b-col>
        <b-table
          responsive
          striped
          :items="componentInfoItems"
          :fields="componentInfoFields"
          thead-class="d-none"
        >
          <template #cell(value)="{ item }">
            <span v-if="item.key === 'ComponentIntegrityEnabled'">
              {{
                item.value ? $t('global.action.yes') : $t('global.action.no')
              }}
            </span>
            <span v-else>{{ item.value }}</span>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row v-if="spdmInfo" class="mt-3">
      <b-col>
        <b-button
          variant="primary"
          data-test-id="spdm-get-signed-measurements"
          :disabled="isProcessingTask"
          @click="handleGetSignedMeasurements"
        >
          <icon-download class="mr-1" />
          {{ $t('pageSPDM.spdmGetSignedMeasurements') }}
        </b-button>
        <b-button
          class="ml-2"
          data-test-id="spdm-get-certificate"
          variant="primary"
          @click="handleGetCertificate"
        >
          <icon-certificate class="mr-1" />
          {{ $t('pageSPDM.spdmGetCertificate') }}
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import IconDownload from '@carbon/icons-vue/es/download/20';
import IconCertificate from '@carbon/icons-vue/es/certificate/20';

export default {
  name: 'SpdmInfo',
  components: { IconDownload, IconCertificate },
  mixins: [BVToastMixin, LoadingBarMixin],
  data() {
    return {
      form: {
        slotId: 0,
        nonce: '',
        version: null,
      },
      signedMeasurements: null,
      signedMeasurementsCopied: false,
      isProcessingTask: false,
      componentInfoFields: [
        {
          key: 'label',
          label: 'Property',
          class: 'font-weight-bold',
        },
        {
          key: 'value',
          label: 'Value',
        },
      ],
    };
  },
  computed: {
    ...mapState('spdm', [
      'spdmInfo',
      'spdmActionInfo',
      'selectedSpdmId',
      'selectedSpdmCertificate',
    ]),
    componentInfoItems() {
      if (!this.spdmInfo) return [];

      return [
        {
          label: this.$t('pageSPDM.id'),
          value: this.spdmInfo.Id || 'N/A',
          key: 'Id',
        },
        {
          label: this.$t('pageSPDM.name'),
          value: this.spdmInfo.Name || 'N/A',
          key: 'Name',
        },
        {
          label: this.$t('pageSPDM.componentIntegrityEnabled'),
          value: this.spdmInfo.ComponentIntegrityEnabled,
          key: 'ComponentIntegrityEnabled',
        },
        {
          label: this.$t('pageSPDM.componentIntegrityType'),
          value: this.spdmInfo.ComponentIntegrityType || 'N/A',
          key: 'ComponentIntegrityType',
        },
        {
          label: this.$t('pageSPDM.componentIntegrityTypeVersion'),
          value: this.spdmInfo.ComponentIntegrityTypeVersion || 'N/A',
          key: 'ComponentIntegrityTypeVersion',
        },
      ];
    },
    spdmVersions() {
      return this.spdmActionInfo?.SPDMVersion?.AllowableValues || [];
    },
    parameters() {
      return this.spdmActionInfo?.Parameters || [];
    },
  },
  watch: {
    spdmVersions(newVal) {
      if (newVal.length > 0) {
        this.form.version = newVal[0];
      }
    },
  },
  created() {
    if (this.spdmVersions.length > 0) {
      this.form.version = this.spdmVersions[0];
    }
  },
  methods: {
    ...mapActions('spdm', {
      getSignedMeasurementsAction: 'getSignedMeasurements',
      pollTaskStatus: 'pollTaskStatus',
      getSignedMeasurementsData: 'getSignedMeasurementsData',
      getCertificate: 'getCertificate',
    }),
    async handleGetSignedMeasurements() {
      this.startLoader();
      if (this.isProcessingTask) return;

      this.isProcessingTask = true;
      this.signedMeasurements = null;

      try {
        // Start the SPDM Get Signed Measurements task
        const taskResponse = await this.getSignedMeasurementsAction({
          spdmId: this.selectedSpdmId,
        });

        // Extract task location from response data @odata.id field
        const taskLocation = taskResponse.data?.['@odata.id'];

        if (taskLocation) {
          // Poll the task until completion
          await this.pollTaskUntilComplete(taskLocation);
        }
      } catch (error) {
        console.error('Error in SPDM Get Signed Measurements:', error);
        this.errorToast(this.$t('pageSPDM.getSignedMeasurementsError'));
      } finally {
        this.isProcessingTask = false;
        this.endLoader();
      }
    },

    async pollTaskUntilComplete(taskLocation) {
      const maxPollingAttempts = 30; // Maximum 30 attempts (30 seconds)
      let attempts = 0;

      while (attempts < maxPollingAttempts) {
        try {
          const taskStatus = await this.pollTaskStatus(taskLocation);

          if (taskStatus.TaskState === 'Completed') {
            // Task completed successfully, get data from Location in Payload.HttpHeaders
            const httpHeaders = taskStatus.Payload?.HttpHeaders || [];
            let location = null;

            // Find the Location header in the HttpHeaders array
            for (const header of httpHeaders) {
              if (typeof header === 'string' && header.includes('Location:')) {
                location = header.replace('Location:', '').trim();
                break;
              }
            }

            if (location) {
              try {
                // Get the signed measurements data from Location
                const measurementsData =
                  await this.getSignedMeasurementsData(location);
                this.signedMeasurements = measurementsData.SignedMeasurements;
                if (!this.signedMeasurements) {
                  this.signedMeasurements = this.$t(
                    'pageSPDM.noSignedMeasurementsData',
                  );
                } else {
                  this.$emit(
                    'show-signed-measurements',
                    this.signedMeasurements,
                  );
                }

                this.successToast(
                  this.$t('pageSPDM.signedMeasurementsDataSuccess'),
                );
              } catch (dataError) {
                console.error(
                  'Error fetching signed measurements data:',
                  dataError,
                );
                this.errorToast(this.$t('pageSPDM.failedToFetchData'));
              }
            } else {
              this.errorToast(this.$t('pageSPDM.noLocationFound'));
            }
            break;
          } else if (
            taskStatus.TaskState === 'Exception' ||
            taskStatus.TaskState === 'Cancelled'
          ) {
            throw new Error(
              this.$t('pageSPDM.taskFailed', { status: taskStatus.TaskState }),
            );
          }

          // Wait 1 second before next poll
          await new Promise((resolve) => setTimeout(resolve, 1000));
          attempts++;
        } catch (error) {
          console.error('Error polling task status:', error);
          throw error;
        }
      }

      if (attempts >= maxPollingAttempts) {
        throw new Error('pageSPDM.taskTimeout');
      }
    },

    getSignedMeasurements() {
      // Legacy method - keeping for backward compatibility
      this.getSignedMeasurementsAction({
        spdmId: this.selectedSpdmId,
        ...this.form,
      })
        .then((response) => {
          this.signedMeasurements = response.data;
        })
        .catch((error) => {
          console.error('Error getting signed measurements:', error);
          this.signedMeasurements = error.response.data;
        });
    },
    handleGetCertificate() {
      this.startLoader();
      this.getCertificate({ spdmId: this.selectedSpdmId })
        .then((success) => {
          this.$emit('show-certificate');
          this.successToast(success);
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => {
          this.endLoader();
        });
    },
  },
};
</script>
