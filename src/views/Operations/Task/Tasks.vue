<template>
  <div>
    <page-title />
    <b-row align-h="start">
      <b-col xl="12">
        <b-table
          responsive="md"
          show-empty
          :empty-text="$t('global.table.emptyMessage')"
          class="mb-0 text-center"
          :fields="fields"
          :items="tableItems"
          :sort-desc="true"
        >
          <!-- style-TargetUri column -->
          <template #cell(TargetUri)="{ value }">
            <p style="overflow-wrap: anywhere">{{ value }}</p>
          </template>
          <!-- StartTime column -->
          <template #cell(StartTime)="{ value }">
            <p class="mb-0">{{ value | formatDate }}</p>
            <p class="mb-0">{{ value | formatTime }}</p>
          </template>
          <!-- EndTime column -->
          <template #cell(EndTime)="{ value }">
            <p v-if="value === 'NA'">
              {{ value }}
            </p>
            <p v-if="value !== 'NA'" class="mb-0">{{ value | formatDate }}</p>
            <p v-if="value !== 'NA'" class="mb-0">{{ value | formatTime }}</p>
          </template>
          <!-- table actions column -->
          <template #cell(actions)="row">
            <table-row-action
              v-for="(action, index) in row.item.actions"
              :key="index"
              :value="action.value"
              :title="action.title"
              :enabled="action.enabled"
              @click-table-action="onTableRowAction($event, row.item)"
            >
              <template #icon>
                <b-button
                  v-if="action.value === 'cancel'"
                  class="btn btn-primary"
                  style="padding: 8px"
                  :data-test-id="`task-tableRowAction-cancel-${index}`"
                  :title="$t('pageTask.table.cancel')"
                  >Cancel
                </b-button>
                <label v-if="action.value === 'completed'">
                  <iconSuccess
                    v-if="action.value === 'completed'"
                    class="sucess-icon"
                /></label>
              </template>
            </table-row-action>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import PageTitle from '@/components/Global/PageTitle';
import TableRowAction from '@/components/Global/TableRowAction';
import IconCheckmark from '@carbon/icons-vue/es/checkmark--filled/20';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
export default {
  name: 'SmtpSettings',
  components: {
    PageTitle,
    TableRowAction,
    iconSuccess: IconCheckmark,
  },
  mixins: [BVToastMixin, LoadingBarMixin],
  data() {
    return {
      enabled: false,
      selectedRows: [],
      fields: [
        {
          key: 'Name',
          label: this.$t('pageTask.table.taskDescription'),
          sortable: true,
        },
        {
          key: 'PercentComplete',
          label: this.$t('pageTask.table.percentComplete'),
          sortable: true,
        },
        {
          key: 'HttpOperation',
          label: this.$t('pageTask.table.httpOperation'),
          sortable: true,
        },
        {
          key: 'TargetUri',
          label: this.$t('pageTask.table.targetUri'),
          sortable: true,
        },
        {
          key: 'StartTime',
          label: this.$t('pageTask.table.startTime'),
          sortable: true,
          tdClass: 'text-nowrap',
        },
        {
          key: 'EndTime',
          label: this.$t('pageTask.table.endTime'),
          sortable: true,
          tdClass: 'text-nowrap',
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
          title: this.$t('global.action.cancel'),
        },
        {
          value: 'completed',
          title: this.$t('global.action.completed'),
        },
      ],
    };
  },
  computed: {
    tableItems() {
      const taskData = this.$store.getters['task/taskData'];
      taskData.forEach((task) => {
        task.State = task.TaskState == 'New' ? 'Running' : task.TaskState;
        task.actions = this.tableAction(task.state);
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
                title: this.$t('pageTask.table.completed'),
                enabled: false,
              },
            ];
      return action;
    },
    onTableRowAction(action, item) {
      if (action === 'cancel')
        this.$bvModal
          .msgBoxConfirm(this.$t('pageTask.modal.cancelConfirmationMsg'), {
            title: this.$t('pageTask.modal.cancelConfirmationTitle'),
            okTitle: this.$t('global.action.yes'),
            cancelTitle: this.$t('global.action.no'),
          })
          .then((deleteConfirmed) => {
            if (deleteConfirmed) {
              this.startLoader();
              this.$store
                .dispatch('task/deleteTask', item.Id)
                .then((success) => this.successToast(success))
                .catch(({ message }) => this.errorToast(message))
                .finally(() => this.endLoader());
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
.sucess-icon {
  color: #8bae46;
  height: 25px;
  width: 25px;
}
.td .targetUri {
  overflow-wrap: anywhere;
}
</style>
