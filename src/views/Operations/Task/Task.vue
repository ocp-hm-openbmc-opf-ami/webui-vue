<template>
  <b-container fluid="xl">
    <page-title />
    <b-row>
      <b-col xl="9">
        <b-table
          responsive="md"
          show-empty
          class="mb-0 text-center"
          :fields="fields"
          :items="tableItems"
        >
          <!-- table actions column -->
          <template #cell(actions)="{ item }">
            <table-row-action
              v-for="(action, index) in item.actions"
              :key="index"
              :value="action.value"
              :title="action.title"
              :enabled="action.enabled"
              @click-table-action="onTableRowAction($event, item)"
            >
              <template #icon>
                <icon-misuse
                  v-if="action.value === 'cancel'"
                  class="cancel-icon"
                  :data-test-id="`task-tableRowAction-cancel-${index}`"
                />
                <label v-if="action.value === 'completed'"> Completed</label>
              </template>
            </table-row-action>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import PageTitle from '@/components/Global/PageTitle';
import TableRowAction from '@/components/Global/TableRowAction';
import IconMisuse from '@carbon/icons-vue/es/misuse/20';
// import IconTrashcan from '@carbon/icons-vue/es/trash-can/20';
export default {
  name: 'SmtpSettings',
  components: {
    PageTitle,
    TableRowAction,
    // IconTrashcan,
    IconMisuse,
  },
  mixins: [LoadingBarMixin],
  data() {
    return {
      enabled: false,
      selectedRows: [],
      fields: [
        {
          key: 'Id',
          label: this.$t('pageTask.table.taskId'),
          sortable: true,
        },
        {
          key: 'Name',
          label: this.$t('pageTask.table.taskDescription'),
          sortable: true,
        },
        {
          key: 'Status',
          label: this.$t('pageTask.table.taskStatus'),
          sortable: true,
        },
        {
          key: 'actions',
          label: this.$t('pageTask.table.action'),
          sortable: true,
        },
      ],
      actions: [
        {
          value: 'cancel',
          title: this.$t('global.action.delete'),
        },
        {
          value: 'completed',
          title: this.$t('global.action.delete'),
        },
      ],
    };
  },
  computed: {
    tableItems() {
      const taskData = this.$store.getters['task/taskData'];
      taskData.forEach((task) => {
        task.Status = task.TaskState == 'New' ? 'Running' : task.TaskState;
        task.actions = this.tableAction(task.TaskState);
      });
      return taskData;
    },
  },
  created() {
    this.startLoader();
    this.$store.dispatch('task/getTaskData').finally(() => {
      this.endLoader();
    });
  },
  methods: {
    tableAction(state) {
      let action = [];
      action =
        state == 'New'
          ? [
              {
                value: 'cancel',
                title: this.$t('global.action.cancel'),
                enabled: true,
              },
            ]
          : [
              {
                value: 'completed',
                title: this.$t('pageUserManagement.editUser'),
                enabled: false,
              },
            ];
      return action;
    },
    onTableRowAction() {
      this.$bvModal
        .msgBoxConfirm(this.$t('pageTask.modal.cancelConfirmationMsg'), {
          title: this.$t('pageTask.modal.cancelConfirmationTitle'),
          okTitle: this.$t('global.action.yes'),
          cancelTitle: this.$t('global.action.no'),
        })
        .then((deleteConfirmed) => {
          if (deleteConfirmed) {
            this.startLoader();
            this.endLoader();
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.cancel-icon {
  color: #cb2026;
  height: 25px;
  width: 25px;
}
</style>
