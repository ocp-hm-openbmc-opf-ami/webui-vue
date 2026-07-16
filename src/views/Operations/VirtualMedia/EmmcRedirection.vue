<!-- EmmcRedirection.vue -->
<template>
  <b-container fluid>
    <page-section :section-title="$t('pageVirtualMedia.eMMC.title')">
      <b-row>
        <!-- Memory Usage Table -->
        <b-col sm="6" xl="4">
          <b-card no-body class="h-100">
            <b-card-header>
              <h3>{{ $t('pageVirtualMedia.eMMC.memoryUsage') }}</h3>
            </b-card-header>
            <b-card-body>
              <div v-if="loading" class="text-center p-3">
                <b-spinner small></b-spinner>
                <div>{{ $t('pageVirtualMedia.eMMC.loadingMemoryData') }}</div>
              </div>
              <b-table-simple v-else-if="memoryData" bordered>
                <b-tbody>
                  <b-tr>
                    <b-td class="font-weight-bold">{{
                      $t('pageVirtualMedia.eMMC.totalSize')
                    }}</b-td>
                    <b-td
                      >{{ memoryData.Total }}
                      {{ memoryData.TotalUnit || 'Mb' }}</b-td
                    >
                  </b-tr>
                  <b-tr>
                    <b-td class="font-weight-bold">{{
                      $t('pageVirtualMedia.eMMC.usedSize')
                    }}</b-td>
                    <b-td
                      >{{ memoryData.Used }}
                      {{ memoryData.UsedUnit || 'Mb' }}</b-td
                    >
                  </b-tr>
                  <b-tr>
                    <b-td class="font-weight-bold">{{
                      $t('pageVirtualMedia.eMMC.freeSize')
                    }}</b-td>
                    <b-td
                      >{{ memoryData.Free }}
                      {{ memoryData.FreeUnit || 'Mb' }}</b-td
                    >
                  </b-tr>
                  <b-tr v-if="redirectionImage">
                    <b-td class="font-weight-bold">{{
                      $t('pageVirtualMedia.eMMC.activeRedirectionImage')
                    }}</b-td>
                    <b-td>{{ redirectionImage }}</b-td>
                  </b-tr>
                </b-tbody>
              </b-table-simple>
              <b-alert v-else show variant="danger">{{
                $t('pageVirtualMedia.eMMC.unableToLoadMemory')
              }}</b-alert>
            </b-card-body>
          </b-card>
        </b-col>

        <!-- Image Selection and Actions -->
        <b-col sm="12" xl="8">
          <b-form @submit.prevent>
            <b-form-group :label="$t('pageVirtualMedia.eMMC.selectImage')">
              <div class="emmc-controls-container">
                <div class="emmc-select-container">
                  <b-form-select
                    v-if="imageOptions.length > 0"
                    v-model="selectedImage"
                    :options="imageOptions"
                    :state="selectedImage ? true : null"
                    size="sm"
                    class="emmc-select"
                    data-test-id="emmc-select-image"
                    @change="handleImageSelect"
                  ></b-form-select>
                </div>
                <div class="emmc-upload-container">
                  <div
                    v-if="isUploadInProgress"
                    class="emmc-upload-overlay"
                  ></div>
                  <b-form-file
                    v-model="uploadFile"
                    :state="fileValidationState"
                    :placeholder="$t('pageVirtualMedia.eMMC.choosePlaceholder')"
                    :browse-text="$t('global.action.browse')"
                    accept=".iso,.img, .nrg,.ima"
                    :disabled="isUploadInProgress"
                    size="sm"
                    class="emmc-file-input"
                    data-test-id="emmc-input-file"
                    @input="handleFileSelect"
                  ></b-form-file>
                  <b-button
                    variant="primary"
                    size="sm"
                    class="emmc-upload-btn"
                    :disabled="
                      !uploadFile ||
                      fileError ||
                      isUploadInProgress ||
                      isButtonDisabled
                    "
                    @click="handleUploadSubmit"
                  >
                    <template v-if="isUploadInProgress">
                      <b-spinner small class="mr-1"></b-spinner>
                      {{ $t('pageVirtualMedia.eMMC.uploading') }}
                    </template>
                    <template v-else>
                      <icon-upload class="mr-1" />
                      {{ $t('global.action.upload') }}
                    </template>
                  </b-button>
                </div>
              </div>
            </b-form-group>
          </b-form>

          <!-- Image List Table -->
          <b-table
            v-if="imageOptions.length > 0"
            :items="tableItems"
            :fields="fields"
            striped
            hover
            responsive
            class="mb-0"
          >
            <template #cell(actions)="{ item }">
              <div class="d-flex flex-wrap gap-2">
                <b-button
                  variant="primary"
                  size="sm"
                  class="mb-2 mb-sm-0 me-2"
                  :disabled="isAnyRedirectionActive || isButtonDisabled"
                  :title="
                    isAnyRedirectionActive
                      ? $t('pageVirtualMedia.eMMC.stopActiveRedirection')
                      : ''
                  "
                  @click="handleStart(item)"
                >
                  <icon-start class="mr-1" />
                  {{ $t('global.action.start') }}
                </b-button>
                <b-button
                  variant="secondary"
                  size="sm"
                  class="mb-2 mb-sm-0 me-2"
                  :disabled="!item.isActive || isButtonDisabled"
                  @click="handleStop(item)"
                >
                  <icon-stop class="mr-1" />
                  {{ $t('global.action.stop') }}
                </b-button>
                <b-button
                  variant="danger"
                  size="sm"
                  class="mb-2 mb-sm-0"
                  :disabled="item.isActive || isButtonDisabled"
                  @click="handleDelete(item)"
                >
                  <icon-delete class="mr-1" />
                  {{ $t('global.action.delete') }}
                </b-button>
              </div>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </page-section>

    <!-- Upload Image Modal -->

    <!-- Redirection Modal -->
    <b-modal
      id="modal-redirect"
      :title="$t('pageVirtualMedia.eMMC.startRedirection')"
      @ok="startRedirection"
    >
      <b-form-group :label="$t('pageVirtualMedia.eMMC.writeProtected')">
        <b-form-checkbox
          v-model="writeProtected"
          data-test-id="emmc-checkbox-writeProtected"
        >
          {{ $t('pageVirtualMedia.eMMC.enableWriteProtection') }}
        </b-form-checkbox>
      </b-form-group>
    </b-modal>
  </b-container>
</template>

<script>
import PageSection from '@/components/Global/PageSection';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import IconUpload from '@carbon/icons-vue/es/upload/20';
import IconStart from '@carbon/icons-vue/es/run/20';
import IconStop from '@carbon/icons-vue/es/stop/20';
import IconDelete from '@carbon/icons-vue/es/trash-can/20';
import {
  BSpinner,
  BTable,
  BTableSimple,
  BTr,
  BTd,
  BTbody,
  BButton,
  BContainer,
  BRow,
  BCol,
  BCard,
  BCardHeader,
  BCardBody,
  BForm,
  BFormGroup,
  BFormSelect,
  BFormFile,
  BFormCheckbox,
  BModal,
  BAlert,
} from 'bootstrap-vue';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';

export default {
  name: 'EmmcRedirection',
  components: {
    PageSection,
    BSpinner,
    BTable,
    BTableSimple,
    BTr,
    BTd,
    BTbody,
    BButton,
    BContainer,
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardBody,
    BForm,
    BFormGroup,
    BFormSelect,
    BFormFile,
    BFormCheckbox,
    BModal,
    BAlert,
    IconUpload,
    IconStart,
    IconStop,
    IconDelete,
  },
  mixins: [BVToastMixin],
  props: {
    virtualMediaServiceEnabledAccess: {
      required: true,
      type: Boolean,
    },
  },
  data() {
    return {
      loading: true,
      uploading: false,
      memoryData: null,
      redirectionImage: '',
      selectedImage: '',
      uploadFile: null,
      fileError: false,
      writeProtected: true,
      fields: [
        {
          key: 'imageName',
          label: this.$t('pageVirtualMedia.eMMC.imageName'),
        },
        {
          key: 'imageSize',
          label: this.$t('pageVirtualMedia.eMMC.imageSize'),
        },
        {
          key: 'actions',
          label: this.$t('global.action.actions'),
        },
      ],
      tableItems: [],
      imageOptions: [],
    };
  },
  computed: {
    isAnyRedirectionActive() {
      return (
        Boolean(this.redirectionImage) ||
        this.tableItems.some((item) => item.isActive)
      );
    },
    isUploadInProgress() {
      return (
        this.uploading ||
        this.$store.getters['virtualMedia/localMediaUploadInProgress']
      );
    },
    fileValidationState() {
      if (!this.uploadFile) return null;
      if (this.fileError) return false;
      const validExtensions = ['.iso', '.img', '.nrg', '.ima'];
      const fileExt = '.' + this.uploadFile.name.split('.').pop().toLowerCase();
      return validExtensions.includes(fileExt);
    },
    ...mapGetters('global', ['userPrivilege']),
    isButtonDisabled() {
      return this.userPrivilege !== privilegesId.admin;
    },
  },
  async mounted() {
    this.uploading =
      this.$store.getters['virtualMedia/localMediaUploadInProgress'];
    await this.getMemoryData();
    await this.getLocalMediaList();
  },
  methods: {
    async getMemoryData() {
      this.loading = true;
      this.memoryData = null;
      this.redirectionImage = '';
      try {
        const response = await this.$store.dispatch(
          'virtualMedia/getEmmcMemoryData',
        );

        if (response) {
          if (response.Memory) {
            this.memoryData = response.Memory;
          }
          if (response.RedirectionImage) {
            this.redirectionImage = response.RedirectionImage;
          }
        } else {
          console.error('Memory data not found in response:', response);
          if (this.virtualMediaServiceEnabledAccess) {
            this.errorToast(
              this.$t('pageVirtualMedia.eMMC.errorLoadingMemory'),
            );
          }
        }
      } catch (error) {
        console.error('Error loading memory data:', error);
        if (this.virtualMediaServiceEnabledAccess) {
          this.errorToast(this.$t('pageVirtualMedia.eMMC.errorLoadingMemory'));
        }
      } finally {
        this.loading = false;
      }
    },
    async getLocalMediaList() {
      try {
        const response = await this.$store.dispatch(
          'virtualMedia/getLocalMediaList',
        );
        this.imageOptions = response.Members.map((member) => {
          const name = member['@odata.id'].split('/').pop();
          return {
            value: member['@odata.id'],
            text: name,
          };
        }).sort((a, b) => a.text.localeCompare(b.text));

        if (this.imageOptions.length > 0) {
          if (
            this.redirectionImage &&
            this.imageOptions.some((opt) => opt.text === this.redirectionImage)
          ) {
            const option = this.imageOptions.find(
              (opt) => opt.text === this.redirectionImage,
            );
            this.selectedImage = option.value;
          } else {
            this.selectedImage = this.imageOptions[0].value;
          }
          await this.handleImageSelect(this.selectedImage);
        }
      } catch (error) {
        if (this.virtualMediaServiceEnabledAccess) {
          this.errorToast(this.$t('pageVirtualMedia.eMMC.errorLoadingImages'));
        }
      }
    },
    async handleImageSelect(odataId) {
      if (!odataId) return;
      try {
        const imageName = odataId.split('/').pop();
        const response = await this.$store.dispatch(
          'virtualMedia/getImageDetails',
          imageName,
        );
        this.tableItems = [
          {
            imageName: response.ImageName,
            imageSize: `${response.Size} ${response.Unit}`,
            isActive:
              response.RedirectionEnabled ||
              response.ImageName === this.redirectionImage,
            odataId: response['@odata.id'],
          },
        ];
      } catch (error) {
        this.errorToast(
          this.$t('pageVirtualMedia.eMMC.errorLoadingImageDetails'),
        );
        this.tableItems = [];
      }
    },
    handleFileSelect(file) {
      if (!file) {
        this.fileError = false;
        return;
      }

      const validExtensions = ['.iso', '.img', '.nrg', '.ima'];
      const fileExt = '.' + file.name.split('.').pop().toLowerCase();

      if (!validExtensions.includes(fileExt)) {
        this.errorToast(this.$t('pageVirtualMedia.eMMC.invalidFileType'));
        this.fileError = true;
        return;
      }

      const minSize = 600 * 1024; // 600 KB
      if (file.size < minSize) {
        this.errorToast(this.$t('pageVirtualMedia.eMMC.fileTooSmall'));
        this.fileError = true;
        return;
      }

      this.fileError = false;
    },
    async handleUploadSubmit() {
      if (!this.uploadFile || this.isUploadInProgress || this.fileError) return;
      this.uploading = true;
      try {
        await this.$store.dispatch('virtualMedia/uploadLocalMedia', {
          file: this.uploadFile,
          fileName: this.uploadFile.name,
        });
        this.successToast(this.$t('pageVirtualMedia.eMMC.uploadSuccess'));
        this.$root.$emit('refresh-application');
        await Promise.all([this.getLocalMediaList(), this.getMemoryData()]);
      } catch (error) {
        console.error('Upload error:', error);
        if (error.response && error.response.status === 413) {
          this.errorToast(
            this.$t('pageVirtualMedia.eMMC.imageSizeExceedsMemory'),
          );
          return;
        }
        if (error.response && error.response.status === 400) {
          const responseData = error.response.data;
          if (responseData && responseData['FilePath@Message.ExtendedInfo']) {
            const messages = responseData['FilePath@Message.ExtendedInfo'];
            const duplicateError = messages.find(
              (msg) =>
                msg.Message && msg.Message.includes('FilePath was duplicated'),
            );
            if (duplicateError) {
              this.errorToast(
                this.$t('pageVirtualMedia.eMMC.imageAlreadyExists'),
              );
              return;
            }
          }
        }
        this.errorToast(this.$t('pageVirtualMedia.eMMC.uploadError'));
      } finally {
        this.uploading =
          this.$store.getters['virtualMedia/localMediaUploadInProgress'];
        this.$bvModal.hide('modal-upload');
        this.uploadFile = null;
      }
    },
    resetForm() {
      this.uploadFile = null;
      this.uploading = false;
    },
    handleStart(item) {
      const [sizeValue, sizeUnit = ''] = String(item.imageSize).split(/\s+/);
      const size = Number.parseFloat(sizeValue);
      const minSize = 600;
      if (
        Number.isFinite(size) &&
        sizeUnit.toLowerCase() === 'kb' &&
        size < minSize
      ) {
        this.errorToast(
          this.$t('pageVirtualMedia.toast.virtualMediaErrorFileTooSmall'),
        );
        return;
      }
      this.selectedImage = item.odataId;
      this.$bvModal.show('modal-redirect');
    },
    async startRedirection() {
      try {
        await this.$store.dispatch('virtualMedia/startLocalMediaRedirect', {
          localMedia: this.selectedImage,
          writeProtected: this.writeProtected,
        });
        this.successToast(this.$t('pageVirtualMedia.eMMC.redirectionStarted'));
        const idx = this.tableItems.findIndex(
          (item) => item.odataId === this.selectedImage,
        );
        if (idx > -1) {
          this.$set(this.tableItems[idx], 'isActive', true);
        }
        await this.getMemoryData();
      } catch (error) {
        this.errorToast(
          this.$t('pageVirtualMedia.eMMC.errorStartingRedirection'),
        );
      }
    },
    async handleStop(item) {
      try {
        if (
          await this.$bvModal.msgBoxConfirm(
            this.$t('pageVirtualMedia.eMMC.stopConfirmation'),
          )
        ) {
          await this.$store.dispatch('virtualMedia/stopLocalMediaRedirect');
          this.successToast(
            this.$t('pageVirtualMedia.eMMC.redirectionStopped'),
          );
          const idx = this.tableItems.findIndex(
            (i) => i.imageName === item.imageName,
          );
          if (idx > -1) {
            this.$set(this.tableItems[idx], 'isActive', false);
          }
          await this.getMemoryData();
        }
      } catch (error) {
        this.errorToast(
          this.$t('pageVirtualMedia.eMMC.errorStoppingRedirection'),
        );
      }
    },
    async handleDelete(item) {
      try {
        if (
          await this.$bvModal.msgBoxConfirm(
            this.$t('pageVirtualMedia.eMMC.deleteConfirmation'),
          )
        ) {
          await this.$store.dispatch(
            'virtualMedia/deleteLocalMedia',
            item.odataId,
          );
          this.successToast(this.$t('pageVirtualMedia.eMMC.deleteSuccess'));
          await Promise.all([this.getLocalMediaList(), this.getMemoryData()]);
        }
      } catch (error) {
        this.errorToast(this.$t('pageVirtualMedia.eMMC.errorDeletingImage'));
      }
    },
  },
};
</script>

<style scoped>
.card {
  height: 100%;
}

.file-upload-wrapper {
  position: relative;
  width: 100%;
}

.custom-file {
  position: relative;
  width: 100%;
}

.custom-file-input {
  position: relative;
}

/* Override Bootstrap Vue's custom file input styles */
.custom-file-input ~ .custom-file-label {
  border-color: var(--danger) !important;
}

.custom-file-input.is-valid ~ .custom-file-label {
  border-color: var(--border-color);
}

.custom-file-input:focus ~ .custom-file-label {
  border-color: var(--primary);
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.custom-file-input.is-invalid ~ .custom-file-label {
  border-color: var(--danger);
}

.emmc-controls-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.emmc-select-container {
  min-width: 180px;
  max-width: 180px;
}

.emmc-select {
  width: 100%;
}

.emmc-upload-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.emmc-file-input {
  width: 180px !important;
}

.emmc-file-input + .custom-file-label {
  width: 180px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.emmc-upload-btn {
  margin-left: 0.5rem;
  white-space: nowrap;
}

.custom-file-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 31px;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
}

.custom-file-label::after {
  height: 29px;
  padding: 0.25rem 0.5rem;
  line-height: 1.5;
}
</style>
