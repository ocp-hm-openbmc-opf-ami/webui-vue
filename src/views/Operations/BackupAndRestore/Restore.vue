<template>
  <b-container fluid="xl">
    <div class="form-background p-5">
      <b-row>
        <input type="file" />
      </b-row>
      <b-row>
        <b-button type="submit" variant="primary">
          {{ $t('global.action.save') }}
        </b-button>
      </b-row>
    </div>
  </b-container>
</template>
<script>
export default {
  name: 'Restore',
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
