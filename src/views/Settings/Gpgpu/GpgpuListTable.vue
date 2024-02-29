<template>
  <div class="table_auto">
    <h3>{{ title }}</h3>
    <b-table
      responsive="md"
      hover
      :fields="fields"
      :items="dataItems"
      class="mb-0 auto_scroll"
      show-empty
      @row-clicked="onRowSelected($event)"
    >
      <template #cell(actions)="{ item }">
        <table-row-action
          v-for="(action, actionIndex) in item.actions"
          :key="actionIndex"
          :value="action.value"
          :title="action.title"
          :enabled="action.enabled"
        >
        </table-row-action>
      </template>
    </b-table>
  </div>
</template>

<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';

export default {
  name: 'GpgpuListTable',
  mixins: [BVToastMixin, LoadingBarMixin, VuelidateMixin],
  props: {
    dataItems: {
      type: Array,
      default: () => [],
    },
    fields: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  methods: {},
};
</script>
<style lang="scss">
.auto_scroll {
  overflow: auto;
  box-shadow: 4px 6px 12px 0 rgba(0, 0, 0, 0.3);
  background-color: white;
}
.table_auto {
  margin-bottom: 20px;
}
</style>
