<template>
  <div class="input-password-toggle-container">
    <slot></slot>
    <b-button
      :title="togglePasswordLabel"
      variant="link"
      class="input-action-btn btn-icon-only"
      :class="[{ isVisible: isVisible }, isloginpage ? 'h50' : 'h35']"
      @click="toggleVisibility"
    >
      <icon-view-off v-if="isVisible" />
      <icon-view v-else />
      <span class="sr-only">{{ togglePasswordLabel }}</span>
    </b-button>
  </div>
</template>

<script>
import IconView from '@carbon/icons-vue/es/view/20';
import IconViewOff from '@carbon/icons-vue/es/view--off/20';

export default {
  name: 'InputPasswordToggle',
  components: { IconView, IconViewOff },
  props: {
    isloginpage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isVisible: false,
      togglePasswordLabel: this.$t('global.ariaLabel.showPassword'),
    };
  },
  methods: {
    toggleVisibility() {
      const firstChild = this.$children[0];
      const inputEl = firstChild ? firstChild.$el : null;

      this.isVisible = !this.isVisible;

      if (inputEl && inputEl.nodeName === 'INPUT') {
        inputEl.type = this.isVisible ? 'text' : 'password';
      }

      this.isVisible
        ? (this.togglePasswordLabel = this.$t('global.ariaLabel.hidePassword'))
        : (this.togglePasswordLabel = this.$t('global.ariaLabel.showPassword'));
    },
  },
};
</script>

<style lang="scss" scoped>
.input-password-toggle-container {
  position: relative;
}
.h35 {
  height: 35px;
}
</style>
