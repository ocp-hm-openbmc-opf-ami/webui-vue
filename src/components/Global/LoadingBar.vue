<template>
  <transition name="fade">
    <div v-if="!isLoadingComplete">
      <b-overlay
        :blur="blur"
        :show="true"
        opacity="0.6"
        no-wrap
        fixed
        class="full-overlay"
      >
        <template #overlay>
          <div class="text-center">
            <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
            <p id="cancel-label">Please wait...</p>
          </div>
        </template>
      </b-overlay>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      loadingIndicatorValue: 0,
      isLoadingComplete: false,
      loadingIntervalId: null,
      timeoutId: null,
      blur: '3px',
    };
  },
  created() {
    this.$emit('load', this.isLoadingComplete);
    this.$root.$on('loader-start', () => {
      this.startLoadingInterval();
    });
    this.$root.$on('loader-end', () => {
      this.endLoadingInterval();
    });
    this.$root.$on('loader-hide', () => {
      this.hideLoadingBar();
    });
  },
  methods: {
    startLoadingInterval() {
      this.clearLoadingInterval();
      this.clearTimeout();
      this.loadingIndicatorValue = 0;
      this.isLoadingComplete = false;
      this.$emit('load', this.isLoadingComplete);
      this.loadingIntervalId = setInterval(() => {
        this.loadingIndicatorValue += 1;
        if (this.loadingIndicatorValue > 100) this.clearLoadingInterval();
      }, 100);
    },
    endLoadingInterval() {
      this.clearLoadingInterval();
      this.clearTimeout();
      this.loadingIndicatorValue = 100;
      this.timeoutId = setTimeout(() => {
        // Let animation complete before hiding
        // the loading bar
        this.isLoadingComplete = true;
        this.$emit('load', this.isLoadingComplete);
      }, 1000);
    },
    hideLoadingBar() {
      this.clearLoadingInterval();
      this.clearTimeout();
      this.loadingIndicatorValue = 0;
      this.isLoadingComplete = true;
      this.$emit('load', this.isLoadingComplete);
    },
    clearLoadingInterval() {
      if (this.loadingIntervalId) clearInterval(this.loadingIntervalId);
      this.loadingIntervalId = null;
    },
    clearTimeout() {
      if (this.timeoutId) clearTimeout(this.timeoutId);
      this.timeoutId = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -0.4rem;
  opacity: 1;
  transition: opacity $duration--moderate-01 $standard-easing--productive;
  height: 0.4rem;

  &.fade-enter, // Remove this vue2 based only class when switching to vue3
  &.fade-enter-from, // This is vue3 based only class modified from 'fade-enter'
  &.fade-leave-to {
    opacity: 0;
  }
}
.progress-bar {
  background-color: $loading-color;
}
</style>
