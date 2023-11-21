<template>
  <b-container fluid="xl">
    <div class="form-background p-5">
      <b-row>
        <b-form-group
          :label="$t('pageBackupAndRestore.uploadRestoreFiles')"
          label-for="image-file"
        >
          <form-file id="image-file" aria-describedby="image-file-help-block">
          </form-file>
        </b-form-group>
      </b-row>
      <b-row>
        <b-button class="mt-1" type="submit" variant="primary">
          {{ $t('global.action.save') }}
        </b-button>
      </b-row>
    </div>
  </b-container>
</template>
<script>
import FormFile from '@/components/Global/FormFile';
export default {
  name: 'Restore',
  components: { FormFile },
  props: {
    tabIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
