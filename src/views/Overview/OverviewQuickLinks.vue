<template>
  <b-card bg-variant="light" border-variant="info">
    <b-row class="d-flex justify-content-between align-items-center">
      <b-col sm="6" lg="9" class="mb-2 mt-2">
        <dl>
          <dt>{{ $t('pageOverview.bmcTime') }}</dt>
          <dd v-if="bmcTime" data-test-id="overviewQuickLinks-text-bmcTime">
            {{ bmcTime }}
          </dd>
          <dd v-else>--</dd>
        </dl>
      </b-col>
      <b-col sm="6" lg="3" class="mb-2 mt-2">
        <b-button
          to="/operations/serial-over-lan"
          variant="primary"
          data-test-id="overviewQuickLinks-button-solConsole"
          class="d-flex justify-content-between align-items-center"
        >
          {{ $t('pageOverview.solConsole') }}
          <icon-arrow-right />
        </b-button>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import ArrowRight16 from '@carbon/icons-vue/es/arrow--right/16';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LocalTimezoneLabelMixin from '@/components/Mixins/LocalTimezoneLabelMixin';

export default {
  name: 'QuickLinks',
  components: {
    IconArrowRight: ArrowRight16,
  },
  mixins: [BVToastMixin, LocalTimezoneLabelMixin],
  computed: {
    bmcTime() {
      let dateTime = this.$store.getters['global/bmcDateTime'];
      if (localStorage.getItem('storedUtcDisplay') == 'false') {
        return dateTime ? this.offsetDateTime(dateTime) : null;
      } else {
        return dateTime
          ? dateTime?.slice(0, 10) +
              ' ' +
              dateTime?.slice(11, 19) +
              ' (UTC' +
              dateTime?.slice(19) +
              ')'
          : null;
      }
    },
  },
  created() {
    Promise.all([this.$store.dispatch('global/getBmcTime')]).finally(() => {
      this.$root.$emit('overview-quicklinks-complete');
    });
  },
  methods: {
    offsetDateTime(dateTime) {
      var date = new Date(dateTime),
        dateFormat =
          [
            date.getFullYear().toString().padStart(2, '0'),
            (date.getMonth() + 1).toString().padStart(2, '0'),
            date.getDate().toString().padStart(2, '0'),
          ].join('-') +
          ' ' +
          [
            date.getHours().toString().padStart(2, '0'),
            date.getMinutes().toString().padStart(2, '0'),
            date.getSeconds().toString().padStart(2, '0'),
          ].join(':') +
          ' (' +
          this.localOffset() +
          ')';
      return dateFormat;
    },
  },
};
</script>

<style lang="scss" scoped>
dd,
dl {
  margin: 0;
}
</style>
