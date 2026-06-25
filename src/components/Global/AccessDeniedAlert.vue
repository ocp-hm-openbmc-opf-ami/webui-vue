<template>
  <b-alert
    show
    variant="warning"
    class="mt-4"
    data-test-id="global-alert-accessDenied"
  >
    {{ $t('global.accessDeniedAlert.message', { pageName }) }}
  </b-alert>
</template>

<script>
export default {
  name: 'AccessDeniedAlert',
  props: {
    pageName: {
      type: String,
      default: '',
    },
  },
};
</script>
