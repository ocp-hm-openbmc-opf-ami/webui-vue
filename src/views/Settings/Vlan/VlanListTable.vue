<template>
  <div>
    <b-table
      responsive="md"
      hover
      :fields="tableFields"
      :items="form.tableItems"
      class="mb-0"
      show-empty
      @row-clicked="onRowSelected($event)"
    >
      <template #cell(actions)="{ item, index }">
        <table-row-action
          v-for="(action, actionIndex) in item.actions"
          :key="actionIndex"
          :value="action.value"
          :title="action.title"
          :enabled="action.enabled"
          @click-table-action="deleteTableRow(index)"
        >
          <template #icon>
            <icon-trashcan v-if="action.value === 'delete'" />
          </template>
        </table-row-action>
      </template>
    </b-table>
    <br />
    <div>
      <br />
      <b-row class="w-50 mb-2">
        <b-col class="d-sm-flex"
          ><span>{{ $t('pageVlan.table.id') }}</span></b-col
        >
        <b-col class="d-sm-flex">
          <b-form-group>
            <b-form-input
              id="vlanId"
              v-model="form.vlanId"
              :state="getValidationState($v.form.vlanId)"
            >
            </b-form-input>
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.vlanId.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template v-if="!$v.form.vlanId.numeric">
                {{ $t('global.form.invalidFormat') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
    </div>
    <b-button variant="primary" @click="addVlan()">
      {{ $t('pageVlan.table.add') }}
    </b-button>
  </div>
</template>

<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import IconTrashcan from '@carbon/icons-vue/es/trash-can/20';
import TableRowAction from '@/components/Global/TableRowAction';
import { mapState } from 'vuex';
import { required, numeric } from 'vuelidate/lib/validators';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';

export default {
  name: 'VlanListTable',
  components: { IconTrashcan, TableRowAction },
  mixins: [BVToastMixin, LoadingBarMixin, VuelidateMixin],
  props: {
    tabId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      rowSelected: false,
      form: {
        tableItems: [],
        vlanId: null,
      },
      actions: [
        {
          value: 'delete',
          title: this.$t('global.action.delete'),
        },
      ],
      tableFields: [
        {
          key: 'VirtualInterface',
          label: this.$t('pageVlan.table.virtualInterface'),
        },
        {
          key: 'VLANId',
          label: this.$t('pageVlan.table.id'),
        },
        { key: 'actions', label: '', tdClass: 'text-right' },
      ],
    };
  },
  computed: {
    ...mapState('vlan', ['vlanTableData']),
  },
  watch: {
    vlanTableData() {
      this.setVlanData();
    },
    // Watch for change in tab index
    tabId() {
      this.setVlanData();
    },
  },
  created() {
    this.setVlanData();
  },
  validations() {
    return {
      form: {
        vlanId: {
          required,
          numeric,
        },
      },
    };
  },
  methods: {
    tabIdFn() {
      var tabId = '';
      if (this.tabId == '') {
        tabId = this.$store.getters['vlan/vlanAllData'][0].Id;
      } else {
        tabId = this.tabId;
      }
      return tabId;
    },
    setVlanData() {
      this.form.tableItems = [];
      this.vlanTableData.forEach((rowData) => {
        if (this.tabIdFn() == rowData.Id.split('_')[0]) {
          const tableRow = {
            VLANEnable: rowData.VLANEnable,
            VirtualInterface: rowData.Id,
            VLANId: rowData.VLANId,
            actions: [
              {
                value: 'delete',
                title: this.$t('pageVlan.table.deleteVlan'),
                enabled: true,
              },
            ],
          };
          this.form.tableItems.push(tableRow);
        }
      });
      if (this.form.tableItems.length === 0) {
        this.form.tableItems.push({
          VLANEnable: null,
          VirtualInterface: '~',
          VLANId: '~',
          actions: [
            {
              value: '~',
              title: '~',
              enabled: false,
            },
          ],
        });
      }
      this.endLoader();
    },
    onRowSelected(rowData) {
      this.rowSelected = true;
      if (rowData.VLANId == '~') {
        this.form.vlanId = null;
      } else {
        this.form.vlanId = rowData.VLANId;
      }
    },
    addVlan() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.$bvModal
        .msgBoxConfirm(this.$tc('pageVlan.modal.confirmMessage'), {
          title: this.$tc('pageVlan.modal.confirmTitle'),
          okTitle: this.$t('global.action.ok'),
          cancelTitle: this.$t('global.action.cancel'),
          autoFocusButton: 'ok',
        })
        .then((addConfirmed) => {
          if (addConfirmed) {
            if (this.form.vlanId != '') {
              this.startLoader();
              const vlanInputData = {
                VLANId: parseInt(this.form.vlanId),
                VLANEnable: true,
                TabId: this.tabIdFn(),
              };
              this.$store
                .dispatch('vlan/addVlan', vlanInputData)
                .then((message) => {
                  this.$store.dispatch('vlan/getEthernetData');
                  this.successToast(message);
                })
                .catch(({ message }) => {
                  this.errorToast(message);
                  this.endLoader();
                });
            } else {
              this.errorToast(this.$tc('pageVlan.toast.errorVlanId'));
            }
          }
        });
    },
    deleteTableRow(index) {
      this.$bvModal
        .msgBoxConfirm(this.$tc('pageVlan.modal.confirmMessage'), {
          title: this.$tc('pageVlan.modal.confirmTitle'),
          okTitle: this.$t('global.action.ok'),
          cancelTitle: this.$t('global.action.cancel'),
          autoFocusButton: 'ok',
        })
        .then((deleteConfirmed) => {
          if (deleteConfirmed) {
            this.startLoader();
            const vlanInputData = {
              TabId: this.tabIdFn(),
              VirtualInterface: this.form.tableItems[index].VirtualInterface,
            };
            this.$store
              .dispatch('vlan/deleteVlan', vlanInputData)
              .then((message) => {
                this.$store.dispatch('vlan/getEthernetData');
                this.successToast(message);
              })
              .catch(({ message }) => {
                this.errorToast(message);
                this.endLoader();
              });
          }
        });
    },
  },
};
</script>
