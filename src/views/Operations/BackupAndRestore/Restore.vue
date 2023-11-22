<template>
  <b-container fluid="xl">
    <div class="form-background p-5">
      <b-form @submit.prevent="onSubmitUpload">
        <b-row>
          <b-form-group
            :label="$t('pageBackupAndRestore.uploadRestoreFiles')"
            label-for="image-file"
          >
            <form-file
              id="image-file"
              v-model="file"
              accept=".tar"
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
        </b-row>
        <b-row>
          <b-button class="mt-1" type="submit" variant="primary">
            {{ $t('global.action.save') }}
          </b-button>
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
export default {
  name: 'Restore',
  components: { FormFile },
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
      this.startLoader();
      this.$store
        .dispatch('backupAndRestore/uploadRestoreFiles', this.file)
        .then((message) => {
          this.successToast(message);
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => {
          this.file = null;
          this.reset();
          this.endLoader();
        });
    },
    reset() {
      this.file = null;
      this.$v.$reset();
    },
  },
};
</script>
