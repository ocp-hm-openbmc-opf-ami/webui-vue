<template>
  <b-button
    class="btn-tooltip"
    variant="link"
    :class="visible ? null : 'collapsed'"
    :aria-expanded="visible ? 'true' : 'false'"
    :aria-controls="id"
    @click="toggleCollapse"
  >
    <icon-tooltip />
  </b-button>
</template>

<script>
import IconTooltip from '@carbon/icons-vue/es/information--filled/24';

export default {
  components: { IconTooltip },
  props: {
    id: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggleCollapse() {
      this.$emit('toggle-visibility');
    },
  },
};
</script>

<style lang="scss" scoped>
// .btn-tooltip {
//   padding: 0;
//   line-height: 1em;
//   svg {
//     vertical-align: baseline;
//   }
// }
</style>
