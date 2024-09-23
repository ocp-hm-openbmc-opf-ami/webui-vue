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
              type="number"
              :state="getValidationState($v.form.vlanId)"
            >
            </b-form-input>
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.vlanId.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template v-else-if="!$v.form.vlanId.pattern">
                {{
                  $t('pageVlan.vlanRangeLimits', {
                    min: 2,
                    max: 4094,
                  })
                }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="w-50 mb-2">
        <b-col class="d-sm-flex"
          ><span>{{ $t('pageVlan.table.vlanPriority') }}</span></b-col
        >
        <b-col class="d-sm-flex">
          <b-form-group>
            <b-form-input
              id="vlanPriority"
              v-model="form.vlanPriority"
              type="number"
              :state="getValidationState($v.form.vlanPriority)"
            >
            </b-form-input>
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.vlanPriority.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template v-else-if="!$v.form.vlanPriority.pattern">
                {{
                  $t('pageVlan.vlanRangeLimits', {
                    min: 0,
                    max: 7,
                  })
                }}
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
import { required } from 'vuelidate/lib/validators';
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
        vlanPriority: null,
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
        {
          key: 'VLANPriority',
          label: this.$t('pageVlan.table.vlanPriority'),
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
          pattern: function (pw) {
            return this.vlanIdValidation(pw);
          },
        },
        vlanPriority: {
          required,
          pattern: function (pw) {
            return this.vlanPriorityValidation(pw);
          },
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
            VLANPriority: rowData.VLANPriority,
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
          VLANPriority: '~',
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
      this.form.vlanId = rowData.VLANId === '~' ? null : rowData.VLANId;
      this.form.vlanPriority =
        rowData.VLANPriority === '~' ? null : rowData.VLANPriority;
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
            if (this.form.vlanId != '' && this.form.vlanPriority != '') {
              this.startLoader();
              const vlanInputData = {
                VLANId: parseInt(this.form.vlanId),
                VLANPriority: parseInt(this.form.vlanPriority),
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
    vlanIdValidation(val) {
      if (!/^(?:[2-9]|[1-3][0-9]{1,3}|40[0-8][0-9]|409[0-4])$/.test(val)) {
        return false;
      }
      return true;
    },
    vlanPriorityValidation(val) {
      if (!/^[0-7]$/.test(val)) {
        return false;
      }
      return true;
    },
  },
};
</script>
