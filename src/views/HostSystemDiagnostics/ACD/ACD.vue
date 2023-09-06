<template>
  <b-container fluid="xl">
    <page-title :description="$t('pageAutonomousCrashDump.pageDescription')" />
    <b-row>
      <b-col>
        <b-table
          id="table-AutonomousCrashDump"
          ref="table"
          responsive="md"
          no-select-on-click
          hover
          show-empty
          :busy="isBusy"
          :fields="fields"
          :items="allConnections"
          :empty-text="emptyTableText"
          @row-selected="onRowSelected($event, allConnections.length)"
        >
          <template #cell(date)="{ value }">
            <span class="mb-0">{{ value | formatDate }}</span>
            <span class="mb-0 pl-1">{{ value | formatTime }}</span>
          </template>
          <template #cell(actions)="row" class="ml-3">
            <table-row-action
              v-for="(action, index) in row.item.actions"
              :key="index"
              :value="action.value"
              :title="action.title"
              :row-data="row.item"
              @click-table-action="onTableRowAction($event, row.item)"
              ><template #icon>
                <icon-view
                  v-if="action.value === 'view'"
                  :data-test-id="`AutonomousCrashDump-tableRowAction-view-${index}`"
                />
              </template>
            </table-row-action>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="text-right display">
        <b-form-group
          id="fieldset-horizontal"
          class="display"
          label-align-sm="left"
          :label="$t('pageAutonomousCrashDump.acd')"
        >
          <b-form-checkbox
            id="Acdswitch"
            v-model="Acdstate"
            class="display"
            date-test-id="AutonomousCrashDump-toggle-ACDstate"
            switch
            :disabled="polling === 'Running'"
            @change="changeAcdServer"
          >
            <span class="sr-only display">
              {{ $t('pageAutonomousCrashDump.acd') }}
            </span>
            <span v-if="Acdstate">
              {{ $t('global.status.enabled') }}
            </span>
            <span v-else>{{ $t('global.status.disabled') }}</span>
          </b-form-checkbox>
          <b-button
            id="downloadlog"
            title="Download logs"
            class="btn"
            variant="primary"
            :disabled="allConnections.length === 0"
            @click="downloadZipFile"
            >{{ $t('pageAutonomousCrashDump.action.download') }}</b-button
          >
          <b-tooltip target="downloadlog" triggers> </b-tooltip>
        </b-form-group>
        <b-button
          v-if="Hidebuttons && polling != 'Running'"
          id="toolbtn"
          title="Click to Generate the logs"
          variant="primary"
          @click="createCrashDump"
          ><icon-add />{{
            $t('pageAutonomousCrashDump.action.generate')
          }}</b-button
        >
        <b-tooltip :disabled="Hidebuttons === false" target="toolbtn" triggers>
        </b-tooltip>
        <loader v-if="polling === 'Running' || Hidebuttons === false"></loader>
      </b-col>
    </b-row>
    <modal-view :title="filename" :data="data"></modal-view>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import TableRowAction from '@/components/Global/TableRowAction';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import IconAdd from '@carbon/icons-vue/es/add--alt/20';
import IconView from '@carbon/icons-vue/es/view/20';
import ModalView from './AcdModalview.vue';
import Loader from '@/components/Global/Loader';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { mapState } from 'vuex';
export default {
  components: {
    PageTitle,
    TableRowAction,
    IconView,
    IconAdd,
    ModalView,
    Loader,
  },
  mixins: [LoadingBarMixin, BVToastMixin],
  beforeRouteLeave(to, from, next) {
    // Hide loader if the user navigates to another page
    // before request is fulfilled.
    this.hideLoader();
    next();
  },
  data() {
    return {
      isBusy: true,
      filename: '',
      polling: null,
      Hidebuttons: true,
      emptyTableText: this.$t('global.table.emptyMessage'),
      data: {},
      fields: [
        {
          key: 'Sino',
          label: this.$t('pageAutonomousCrashDump.table.sino'),
        },
        {
          key: 'filename',
          label: this.$t('pageAutonomousCrashDump.table.fileName'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'date',
          label: this.$t('pageAutonomousCrashDump.table.fileInformation'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'actions',
          label: '',
          tdClass: 'text-right text-nowrap',
        },
      ],
    };
  },
  computed: {
    allConnections() {
      return this.$store.getters['acd/allCrashDump'].map((log) => {
        return {
          ...log,
          actions: [
            {
              value: 'view',
              title: this.$t('pageAutonomousCrashDump.action.view'),
            },
          ],
        };
      });
    },
    ...mapState('acd', ['allCrashDump', 'getJsonFile', 'TaskState']),
    Acdstate: {
      get() {
        return this.$store.getters['acd/ACDEnabled'];
      },
      set(newValue) {
        return newValue;
      },
    },
  },
  watch: {
    allCrashDump: function (value) {
      if (value.length !== 0) {
        this.filename = value[0].filename;
      }
    },
    getJsonFile: function (value) {
      this.data = value;
    },
    TaskState: function (value) {
      this.polling = value;
    },
    polling(newPolling) {
      if (newPolling === 'Running') {
        this.emptyTableText = this.$t(
          'pageAutonomousCrashDump.action.logInProgress'
        );
      } else {
        this.emptyTableText = this.$t('global.table.emptyMessage');
      }
    },
  },
  created() {
    this.startLoader();
    this.polling = this.TaskState;
    Promise.all([
      this.$store.dispatch('acd/getAcdServerStatus'),
      this.$store.dispatch('acd/getcrashDumpData'),
    ]).finally(() => this.endLoader());
    this.isBusy = false;
    const pollingFromLocalStorage = localStorage.getItem('polling');
    if (pollingFromLocalStorage !== null) {
      this.$store.dispatch('acd/checkStatus', pollingFromLocalStorage);
      this.checkStatus(pollingFromLocalStorage);
    }
  },
  methods: {
    createCrashDump() {
      this.$bvModal
        .msgBoxConfirm(
          this.$tc('pageAutonomousCrashDump.modal.confirmMessage'),
          {
            title: this.$tc('pageAutonomousCrashDump.modal.confirmTitle'),
            okTitle: this.$t('global.action.ok'),
            cancelTitle: this.$t('global.action.cancel'),
          }
        )
        .then((createCrashDump) => {
          if (createCrashDump) {
            this.Hidebuttons = false;
            this.$store
              .dispatch('acd/createCrashDump')
              .then((data) => {
                this.checkStatus(data);
              })
              .catch(({ message }) => {
                this.errorToast(message);
                if (message) {
                  this.Hidebuttons = true;
                  localStorage.removeItem('polling');
                }
              });
          }
        });
    },
    onTableRowAction(action, row) {
      switch (action) {
        case 'view':
          this.initModalView(row);
          break;
        default:
          break;
      }
    },
    downloadZipFile() {
      let zip = new JSZip();

      zip.file(this.filename, JSON.stringify(this.data, null, 2));

      zip.generateAsync({ type: 'blob' }).then((blob) => {
        const filenameExtention = this.filename.split('.json')[0];
        const zipFile = `${filenameExtention}.zip`;
        saveAs(blob, zipFile);
      });
    },
    changeAcdServer(state) {
      this.startLoader();
      this.$store
        .dispatch('acd/saveAcdServerStatus', state ? true : false)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    checkStatus(data) {
      var interval = setInterval(() => {
        this.Hidebuttons = false;
        this.$store.dispatch('acd/checkStatus', data).then((success) => {
          if (success) {
            this.successToast(success);
            this.Hidebuttons = true;
            localStorage.removeItem('polling');
            clearInterval(interval);
          }
        });
      }, 10000);
    },
    initModalView() {
      this.$bvModal.show('modal-view');
    },
  },
};
</script>
<style scoped lang="scss">
#table-ACD {
  td .btn-link {
    width: auto !important;
  }
}

.display {
  display: inline-block !important;
}

.btn {
  margin-left: 11px;
}
</style>
