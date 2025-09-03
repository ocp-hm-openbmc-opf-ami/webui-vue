<template>
  <b-container fluid="xl">
    <div class="form-background p-5">
      <b-form @submit.prevent="onSubmitUpload">
        <b-row sm="3">
          <b-col sm="4">
            <b-form-group
              :label="$t('pageBackupAndRestore.uploadRestoreFiles')"
              label-for="image-file"
            >
              <b-form-text id="username-help-block">
                {{ $t('pageBackupAndRestore.tarFileOnly') }}
              </b-form-text>
              <form-file
                id="image-file"
                ref="formFile"
                v-model="file"
                accept=".tar"
                :disabled="isButtonDisable"
                :state="getValidationState($v.file)"
                aria-describedby="image-file-help-block"
                @input="onFileUpload($event)"
              >
                <template #invalid>
                  <b-form-invalid-feedback role="alert">
                    {{ $t('global.form.required') }}
                  </b-form-invalid-feedback>
                </template>
              </form-file>
            </b-form-group>
          </b-col>
          <b-col sm="3">
            <b-button
              class="upload-button"
              type="submit"
              variant="primary"
              :disabled="isButtonDisable"
            >
              <icon-upload />
              {{ $t('global.action.upload') }}
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </div>
  </b-container>
</template>
<script>
import FormFile from '@/components/Global/FormFile';
import { required } from 'vuelidate/lib/validators';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import IconUpload from '@carbon/icons-vue/es/upload/20';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';
export default {
  name: 'Restore',
  components: { FormFile, IconUpload },
  mixins: [BVToastMixin, LoadingBarMixin, VuelidateMixin],
  props: {
    tabIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      file: null,
    };
  },
  computed: {
    ...mapGetters('global', ['userPrivilege']),
    isButtonDisable() {
      return this.userPrivilege !== privilegesId.admin;
    },
  },
  validations() {
    return {
      file: {
        required,
      },
    };
  },
  methods: {
    onFileUpload(file) {
      this.file = file;
      this.$v.file.$touch();
    },
    onSubmitUpload() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.$bvModal
        .msgBoxConfirm(
          this.$tc('pageBackupAndRestore.toast.restoreConfirmation'),
          {
            title: this.$tc('pageBackupAndRestore.toast.confirmTitle'),
            okTitle: this.$t('global.action.ok'),
            cancelTitle: this.$t('global.action.cancel'),
            autoFocusButton: 'ok',
          },
        )
        .then((confirmed) => {
          if (confirmed) {
            this.$store
              .dispatch('backupAndRestore/uploadRestoreFiles', this.file)
              .then((message) => {
                this.successToast(message);
                this.clearFile();
              })
              .catch(({ message }) => {
                this.errorToast(message);
                this.clearFile();
              })
              .finally(() => {
                this.reset();
                this.endLoader();
              });
          }
        });
    },
    reset() {
      this.file = null;
      this.$v.$reset();
    },
    clearFile() {
      const formFileComponent = this.$refs.formFile;
      if (formFileComponent) {
        formFileComponent.clearSelectedFile();
      }
    },
  },
};
</script>
<style scoped>
.upload-button {
  margin-top: 54px;
}
</style>
