<template>
  <b-modal
    id="modal-view"
    ref="modal"
    :title="$t('pageAutonomousCrashDump.modal.jsonViewer', { fileName: title })"
    size="xl"
    header-text-variant="dark"
  >
    <vue-json-pretty :deep="3" :show-icon="true" :data="data" />

    <template #modal-footer="{ cancel }">
      <b-button variant="primary" @click="cancel()">
        {{ $t('pageAutonomousCrashDump.action.close') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty';

export default {
  components: {
    VueJsonPretty,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
