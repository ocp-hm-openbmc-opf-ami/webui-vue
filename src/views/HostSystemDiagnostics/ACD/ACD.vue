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
          <!-- Fixed the issue by moving the class to the actual element -->
          <template #cell(actions)="row">
            <div class="ml-3">
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
                    @click="onClickView(row.item)"
                  />
                </template>
              </table-row-action>
            </div>
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
      allCrashDumpFiles: [],
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
    ...mapState('acd', ['allCrashDump', 'TaskState']),
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
        this.allCrashDumpFiles = value;
      }
    },
    TaskState: function (value) {
      this.polling = value;
    },
    polling(newPolling) {
      if (newPolling === 'Running') {
        this.emptyTableText = this.$t(
          'pageAutonomousCrashDump.action.logInProgress',
        );
      } else {
        this.emptyTableText = this.$t('global.table.emptyMessage');
      }
    },
  },
  created() {
    this.startLoader();
    this.polling = this.TaskState;
    Promise.all([this.$store.dispatch('acd/getAcdServerStatus')]).finally(() =>
      this.endLoader(),
    );
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
            autoFocusButton: 'cancel',
          },
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
    onTableRowAction(action) {
      switch (action) {
        case 'view':
          break;
        default:
          break;
      }
    },
    async downloadZipFile() {
      this.startLoader();
      let zip = new JSZip();
      let promises = [];
      for (let i = 0; i < this.allCrashDumpFiles.length; i++) {
        let filename = this.allCrashDumpFiles[i].filename;
        let url = this.allCrashDumpFiles[i].urls;
        let promise = this.$store
          .dispatch('acd/getJsonData', url)
          .then((response) => {
            zip.file(filename, JSON.stringify(response, null, 2));
          });
        promises.push(promise);
      }
      await Promise.all(promises);
      this.endLoader();
      let blob = await zip.generateAsync({ type: 'blob' });
      const filename = 'allCrashDumpFiles.zip';
      saveAs(blob, filename);
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
    onClickView(row) {
      this.startLoader();
      this.$store
        .dispatch('acd/getJsonData', row.urls)
        .then((response) => {
          this.filename = row.filename;
          this.data = response;
        })
        .finally(() => {
          this.initModalView(row);
          this.endLoader();
        });
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
