<template>
  <div>
    <div class="table-container table-control">
      <table class="table b-table table-hover">
        <thead role="rowgroup" class="thead-light">
          <tr>
            <th v-for="field in fields" :key="field.key" :class="field.class">
              {{ field.label }}
            </th>
            <th class="text-center"></th>
            <!-- for the Action empty header -->
          </tr>
        </thead>
        <draggable
          :list="paginatedItems"
          v-bind="dragOptions"
          tag="tbody"
          :data-ipversion="ipversion"
          handle=".draggable-row"
          @end="onDragEnd"
        >
          <tr
            v-for="(item, index) in paginatedItems"
            :key="item.id || index"
            class="draggable-row"
          >
            <td v-for="field in fields" :key="field.key" :class="field.class">
              {{ item[field.key] }}
            </td>
            <td class="text-center">
              <slot name="actions" :item="item" :index="index">
                <span v-if="item.actions && item.actions.length > 0">
                  <button
                    v-for="(action, actionIndex) in item.actions"
                    :key="actionIndex"
                    class="btn btn-link p-0"
                    :title="action.title"
                    :disabled="!action.enabled"
                    @click="$emit('table-row-action', item)"
                  >
                    <icon-trashcan />
                  </button>
                </span>
              </slot>
            </td>
          </tr>
        </draggable>
        <tbody v-if="paginatedItems.length === 0">
          <tr>
            <td :colspan="fields.length + 1" class="text-center">
              {{ emptyMessage }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <b-row>
      <b-col sm="6">
        <b-form-group
          class="table-pagination-select m0"
          :label="itemsPerPageLabel"
          label-for="pagination-items-per-page"
        >
          <b-form-select
            id="pagination-items-per-page"
            v-model="localPerPage"
            :options="itemsPerPageOptions"
          />
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-pagination
          v-model="localCurrentPage"
          first-number
          last-number
          :per-page="localPerPage === 0 ? totalRows : localPerPage"
          :total-rows="totalRows"
          aria-controls="table-session-logs"
          :limit="limit"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import IconTrashcan from '@carbon/icons-vue/es/trash-can/20';

export default {
  name: 'DraggablePaginatedTable',
  components: { draggable, IconTrashcan },
  props: {
    fields: { type: Array, required: true },
    items: { type: Array, required: true },
    perPage: { type: Number, required: true },
    currentPage: { type: Number, required: true },
    itemsPerPageOptions: { type: Array, required: true },
    totalRows: { type: Number, required: true },
    limit: { type: Number, default: 10 },
    dragOptions: { type: Object, default: () => ({}) },
    emptyMessage: { type: String, default: 'No data' },
    itemsPerPageLabel: { type: String, default: 'Items per page' },
    actionHeader: { type: String, default: '' },
    ipversion: { type: String, required: false, default: '' },
  },
  data() {
    return {
      localPerPage: this.perPage,
      localCurrentPage: this.currentPage,
    };
  },
  computed: {
    paginatedItems() {
      if (this.localPerPage === 0) return this.items;
      const start = (this.localCurrentPage - 1) * this.localPerPage;
      return this.items.slice(start, start + this.localPerPage);
    },
  },
  watch: {
    perPage(val) {
      this.localPerPage = val;
    },
    currentPage(val) {
      this.localCurrentPage = val;
    },
    localPerPage(val) {
      this.$emit('update:perPage', val);
    },
    localCurrentPage(val) {
      this.$emit('update:currentPage', val);
    },
  },
  methods: {
    onDragEnd(evt) {
      this.$emit('drag-end', evt);
    },
  },
};
</script>

<style scoped>
.table-container {
  position: relative;
}
.draggable-row {
  cursor: move;
}
.table-control {
  overflow: auto;
}
.m0 {
  margin: 0;
}
</style>
