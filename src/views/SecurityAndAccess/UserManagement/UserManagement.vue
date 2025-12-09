<template>
  <b-container fluid="xl">
    <page-title />
    <b-row>
      <b-col lg="2" class="channel-select-dropdown">
        <label for="privilege">{{
          $t('pageUserManagement.modal.channel')
        }}</label>
        <b-form-select
          id="privilege"
          v-model="filterChannelList"
          data-test-id="userManagement-select-privilege"
          :options="filterChannelListOptions"
          @change="userItemsInit"
        >
          <template #first>
            <b-form-select-option :value="null" disabled>
              {{ $t('global.form.selectAnOption') }}
            </b-form-select-option>
          </template>
        </b-form-select>
      </b-col>
      <b-col xl="7" class="text-right">
        <b-button
          variant="link"
          :disabled="globalPrivilege !== 'Administrator'"
          @click="initModalSettings"
        >
          <icon-settings />
          {{ $t('pageUserManagement.accountPolicySettings') }}
        </b-button>
        <b-button
          variant="primary"
          data-test-id="userManagement-button-addUser"
          :disabled="globalPrivilege !== 'Administrator'"
          @click="initModalUser(null)"
        >
          <icon-add />
          {{ $t('pageUserManagement.addUser') }}
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col xl="9">
        <table-toolbar
          ref="toolbar"
          :selected-items-count="selectedRows.length"
          :actions="tableToolbarActions"
          @clear-selected="clearSelectedRows($refs.table)"
          @batch-action="onBatchAction"
        />
        <b-table
          ref="table"
          responsive="md"
          selectable
          show-empty
          no-select-on-click
          hover
          :busy="isBusy"
          :fields="fields"
          :items="tableItems"
          :empty-text="$t('global.table.emptyMessage')"
          @row-selected="onRowSelected($event, tableItems.length)"
        >
          <!-- Checkbox column -->
          <template #head(checkbox)>
            <b-form-checkbox
              v-model="tableHeaderCheckboxModel"
              data-test-id="userManagement-checkbox-tableHeaderCheckbox"
              :indeterminate="tableHeaderCheckboxIndeterminate"
              @change="onChangeHeaderCheckbox($refs.table)"
            >
              <span class="sr-only">{{ $t('global.table.selectAll') }}</span>
            </b-form-checkbox>
          </template>
          <template #cell(checkbox)="row">
            <b-form-checkbox
              v-model="row.rowSelected"
              data-test-id="userManagement-checkbox-toggleSelectRow"
              :disabled="isCheckboxDisabled(row.item)"
              @change="toggleSelectRow($refs.table, row.index)"
            >
              <span class="sr-only">{{ $t('global.table.selectItem') }}</span>
            </b-form-checkbox>
          </template>

          <!-- table actions column -->
          <template #cell(actions)="{ item }">
            <table-row-action
              v-for="(action, index) in item.actions"
              :key="index"
              :value="action.value"
              :enabled="action.enabled"
              :title="action.title"
              @click-table-action="onTableRowAction($event, item)"
            >
              <template #icon>
                <icon-edit
                  v-if="action.value === 'edit'"
                  :data-test-id="`userManagement-tableRowAction-edit-${index}`"
                />
                <icon-trashcan
                  v-if="action.value === 'delete'"
                  :data-test-id="`userManagement-tableRowAction-delete-${index}`"
                />
              </template>
            </table-row-action>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row>
      <b-col xl="8">
        <b-button
          v-b-toggle.collapse-role-table
          data-test-id="userManagement-button-viewPrivilegeRoleDescriptions"
          variant="link"
          class="mt-3"
        >
          <icon-chevron />
          {{ $t('pageUserManagement.viewPrivilegeRoleDescriptions') }}
        </b-button>
        <b-collapse id="collapse-role-table" class="mt-3">
          <table-roles />
        </b-collapse>
      </b-col>
    </b-row>
    <b-row>
      <b-col xl="8">
        <b-button
          v-b-toggle.collapse-Password-rules
          data-test-id="userManagement-button-passwordComplexityRules"
          variant="link"
          class="mt-3"
        >
          <icon-chevron />
          {{ $t('pageUserManagement.passwordComplexityRules') }}
        </b-button>
        <b-collapse id="collapse-Password-rules" class="mt-3">
          <password-complexity-rules />
        </b-collapse>
      </b-col>
    </b-row>
    <!-- Modals -->
    <modal-settings :settings="setting" @ok="saveAccountSettings" />
    <modal-user
      :user="activeUser"
      :password-requirements="passwordRequirements"
      @ok="saveUser"
      @hidden="activeUser = null"
    />
  </b-container>
</template>

<script>
import IconTrashcan from '@carbon/icons-vue/es/trash-can/20';
import IconEdit from '@carbon/icons-vue/es/edit/20';
import IconAdd from '@carbon/icons-vue/es/add--alt/20';
import IconSettings from '@carbon/icons-vue/es/settings/20';
import IconChevron from '@carbon/icons-vue/es/chevron--up/20';

import ModalUser from './ModalUser';
import ModalSettings from './ModalSettings';
import PageTitle from '@/components/Global/PageTitle';
import TableRoles from './TableRoles';
import TableToolbar from '@/components/Global/TableToolbar';
import TableRowAction from '@/components/Global/TableRowAction';
import PasswordComplexityRules from './PasswordComplexityRules.vue';

import BVTableSelectableMixin, {
  selectedRows,
  tableHeaderCheckboxModel,
  tableHeaderCheckboxIndeterminate,
} from '@/components/Mixins/BVTableSelectableMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import i18n from '@/i18n';

export default {
  name: 'UserManagement',
  components: {
    IconAdd,
    IconChevron,
    IconEdit,
    IconSettings,
    IconTrashcan,
    ModalSettings,
    ModalUser,
    PageTitle,
    TableRoles,
    TableRowAction,
    TableToolbar,
    PasswordComplexityRules,
  },
  mixins: [BVTableSelectableMixin, BVToastMixin, LoadingBarMixin],
  beforeRouteLeave(to, from, next) {
    this.hideLoader();
    next();
  },
  data() {
    return {
      isBusy: true,
      activeUser: null,
      setting: {},
      fields: [
        {
          key: 'checkbox',
        },
        {
          key: 'username',
          label: this.$t('pageUserManagement.table.username'),
        },
        {
          key: 'privilege',
          label: this.$t('pageUserManagement.table.privilege'),
          formatter: this.convertPrivilege,
        },
        {
          key: 'status',
          label: this.$t('pageUserManagement.table.status'),
          formatter: this.convertState,
        },
        {
          key: 'email',
          label: this.$t('pageUserManagement.table.email'),
        },
        {
          key: 'snmpUserEnabled',
          label: this.$t('pageUserManagement.table.snmpUserEnable'),
          tdClass: 'text-nowrap',
          formatter: this.convertState,
        },
        {
          key: 'algorithm',
          label: this.$t('pageUserManagement.table.algorithm'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'encryption',
          label: this.$t('pageUserManagement.table.encryption'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'readWritePermission',
          label: this.$t('pageUserManagement.table.readWritePermission'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'UserAccess',
          label: this.$t('pageUserManagement.table.userAccess'),
          tdClass: 'text-nowrap',
          formatter: this.convertState,
        },
        {
          key: 'actions',
          label: '',
          tdClass: 'text-right text-nowrap',
        },
      ],
      tableToolbarActions: [
        {
          value: 'delete',
          label: this.$t('global.action.delete'),
        },
        {
          value: 'enable',
          label: this.$t('global.action.enable'),
        },
        {
          value: 'disable',
          label: this.$t('global.action.disable'),
        },
      ],
      selectedRows: selectedRows,
      tableHeaderCheckboxModel: tableHeaderCheckboxModel,
      tableHeaderCheckboxIndeterminate: tableHeaderCheckboxIndeterminate,
      globalPrivilege: this.$store.getters['global/userPrivilege'],
      filterChannelList: null,
      filterChannelListOptions: [],
      tableItems: [],
    };
  },
  computed: {
    allUsers() {
      return this.$store.getters['userManagement/allUsers'];
    },
    settings() {
      return this.$store.getters['userManagement/accountSettings'];
    },
    passwordRequirements() {
      return this.$store.getters['userManagement/accountPasswordRequirements'];
    },
  },
  created() {
    this.getUsersInit();
  },
  methods: {
    getUsersInit() {
      this.startLoader();
      this.$store
        .dispatch('userManagement/getUsers')
        .then(() => {
          this.$store.dispatch('policies/getNetworkProtocolStatus').then(() => {
            this.channelInit();
          });
        })
        .finally(() => {
          this.endLoader();
          this.isBusy = false;
        });
      this.$store.dispatch('userManagement/getAccountSettings');
      this.$store.dispatch('userManagement/getAccountRoles');
    },
    editEnable(user) {
      if (
        'root' === this.$store.getters['global/username'] &&
        user.UserName !== 'root' &&
        user.Oem.Ami?.WebRoleId === 'Administrator'
      ) {
        return true;
      } else if (
        this.$store.getters['global/username'] === user.UserName ||
        'root' === this.$store.getters['global/username']
      ) {
        return true;
      } else {
        return user.UserName === 'root' ? false : true;
      }
    },
    initModalUser(user) {
      this.activeUser = user;
      this.$bvModal.show('modal-user');
    },
    initModalDelete(user) {
      this.$bvModal
        .msgBoxConfirm(
          this.$t('pageUserManagement.modal.deleteConfirmMessage', {
            user: user.username,
          }),
          {
            title: this.$tc('pageUserManagement.deleteUser'),
            okTitle: this.$tc('pageUserManagement.deleteUser'),
            cancelTitle: this.$t('global.action.cancel'),
            autoFocusButton: 'ok',
          },
        )
        .then((deleteConfirmed) => {
          if (deleteConfirmed) {
            this.deleteUser(user);
          }
        });
    },
    initModalSettings() {
      this.setting = this.settings;
      this.$bvModal.show('modal-settings');
    },
    saveUser({ isNewUser, userData }) {
      if (isNewUser) {
        this.startLoader();
        this.$store
          .dispatch('userManagement/createUser', userData)
          .then((success) => {
            this.successToast(success);
            this.getUsersInit();
          })
          .catch(({ message }) => this.errorToast(message))
          .finally(() => this.endLoader());
      } else {
        const passwordChangeRequired = userData.PasswordChangeRequired;
        const password = userData.password;
        if (
          this.$store.getters['global/username'] === userData.username &&
          (passwordChangeRequired || password)
        ) {
          this.$bvModal
            .msgBoxConfirm(
              this.$t('pageUserManagement.modal.logoutConfirmMessage', {
                user: userData.username,
              }),
              {
                title: this.$tc('pageUserManagement.modal.logoutAlert'),
                okTitle: this.$tc('global.action.ok'),
                cancelTitle: this.$t('global.action.cancel'),
              },
            )
            .then((passwordChangeRequired) => {
              if (passwordChangeRequired) {
                this.startLoader();
                this.$store
                  .dispatch('userManagement/updateUser', userData)
                  .then((success) => {
                    this.successToast(success);
                    this.getUsersInit();
                  })
                  .catch(({ message }) => this.errorToast(message))
                  .finally(() => this.endLoader());
              }
            });
        } else {
          this.startLoader();
          this.$store
            .dispatch('userManagement/updateUser', userData)
            .then((success) => {
              this.successToast(success);
              this.getUsersInit();
            })
            .catch(({ message }) => this.errorToast(message))
            .finally(() => this.endLoader());
        }
      }
    },
    deleteUser({ username }) {
      this.startLoader();
      this.$store
        .dispatch('userManagement/getSessionsData')
        .then((allSessions) => {
          let userDelete = true;
          allSessions.forEach((session) => {
            if (
              session.SessionType == 'WebUI' &&
              session.UserName == username
            ) {
              userDelete = false;
            }
          });
          return userDelete;
        })
        .then((userDelete) => {
          if (userDelete) {
            this.$store
              .dispatch('userManagement/deleteUser', username)
              .then((success) => {
                this.successToast(success);
                this.getUsersInit();
              })
              .catch(({ message }) => this.errorToast(message))
              .finally(() => this.endLoader());
          } else {
            this.endLoader();
            this.errorToast(
              i18n.t('pageUserManagement.toast.errorDeleteLoggedUser', {
                username,
              }),
            );
          }
        });
    },
    onBatchAction(action) {
      switch (action) {
        case 'delete':
          this.$bvModal
            .msgBoxConfirm(
              this.$tc(
                'pageUserManagement.modal.batchDeleteConfirmMessage',
                this.selectedRows.length,
              ),
              {
                title: this.$tc(
                  'pageUserManagement.deleteUser',
                  this.selectedRows.length,
                ),
                okTitle: this.$tc(
                  'pageUserManagement.deleteUser',
                  this.selectedRows.length,
                ),
                cancelTitle: this.$t('global.action.cancel'),
                autoFocusButton: 'ok',
              },
            )
            .then((deleteConfirmed) => {
              if (deleteConfirmed) {
                this.startLoader();
                this.$store
                  .dispatch('userManagement/deleteUsers', this.selectedRows)
                  .then((messages) => {
                    messages.forEach(({ type, message }) => {
                      if (type === 'success') {
                        this.successToast(message);
                        this.getUsersInit();
                      }
                      if (type === 'error') this.errorToast(message);
                    });
                  })
                  .finally(() => this.endLoader());
              }
            });
          break;
        case 'enable':
          this.startLoader();
          this.$store
            .dispatch('userManagement/enableUsers', this.selectedRows)
            .then((messages) => {
              messages.forEach(({ type, message }) => {
                if (type === 'success') {
                  this.successToast(message);
                  this.getUsersInit();
                }
                if (type === 'error') this.errorToast(message);
              });
            })
            .finally(() => this.endLoader());
          break;
        case 'disable':
          this.startLoader();
          this.$store
            .dispatch('userManagement/disableUsers', this.selectedRows)
            .then((messages) => {
              messages.forEach(({ type, message }) => {
                if (type === 'success') {
                  this.successToast(message);
                  this.getUsersInit();
                }
                if (type === 'error') this.errorToast(message);
              });
            })
            .finally(() => this.endLoader());
          break;
      }
    },
    onTableRowAction(action, row) {
      switch (action) {
        case 'edit':
          this.initModalUser(row);
          break;
        case 'delete':
          this.initModalDelete(row);
          break;
        default:
          break;
      }
    },
    saveAccountSettings(settings) {
      this.startLoader();
      this.$store
        .dispatch('userManagement/saveAccountSettings', settings)
        .then((message) => {
          this.successToast(message);
          this.getUsersInit();
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    isCheckboxDisabled(item) {
      // Disable checkbox if the row belongs to the 'root' user or the current logged-in user
      return (
        item.UserName === 'root' ||
        item.UserName === this.$store.getters['global/username']
      );
    },
    onChangeHeaderCheckbox(tableRef) {
      if (tableRef) {
        if (this.tableHeaderCheckboxModel) {
          // Select all rows except for the root user and the logged-in user
          this.allUsers.forEach((user, index) => {
            if (!this.isCheckboxDisabled(user)) {
              tableRef.selectRow(index);
            }
          });
        } else {
          tableRef.clearSelected();
        }
      }
    },
    userItemsInit() {
      // transform user data to table data
      this.tableItems = [];
      this.allUsers.map((user) => {
        this.tableItems.push({
          rowSelected: false, // Ensure rowSelected is initialized
          username: user.UserName,
          privilege:
            user?.Oem?.Ami?.ChannelPrivileges?.filter(
              (channel) => channel.ChannelId === this.filterChannelList,
            )?.map((channel) => channel.ChannelPrivilege)[0] ?? 'NA',
          status: user.Locked
            ? 'Locked'
            : user.Enabled
              ? 'Enabled'
              : 'Disabled',
          email: user?.Oem?.Ami?.SMTP?.SMTPMailId || 'NA',
          snmpUserEnabled: user?.Oem?.Ami?.SNMP?.SNMPAccessEnableStatus
            ? 'Enabled'
            : 'Disabled',
          algorithm: user?.Oem?.Ami?.SNMP?.Algorithm
            ? user?.Oem?.Ami?.SNMP?.Algorithm
            : 'NA',
          encryption: user?.Oem?.Ami?.SNMP?.Encryption
            ? user?.Oem?.Ami?.SNMP?.Encryption
            : 'NA',
          readWritePermission: user?.Oem?.Ami?.SNMP?.Access
            ? user?.Oem?.Ami?.SNMP?.Access
            : 'NA',
          UserAccess:
            user?.Oem?.Ami?.ChannelPrivileges?.filter(
              (channel) => channel.ChannelId === this.filterChannelList,
            )?.map((channel) => channel.ChannelAccess)[0] ?? 'NA',
          actions: [
            {
              value: 'edit',
              enabled: this.editEnable(user),
              title: this.$t('pageUserManagement.editUser'),
            },
            {
              value: 'delete',
              enabled:
                user.UserName === this.$store.getters['global/username']
                  ? false
                  : true && user.UserName === 'root'
                    ? false
                    : true,
              title: this.$tc('pageUserManagement.deleteUser'),
            },
          ],
          ...user,
        });
      });
    },
    channelInit() {
      let channelOptionsVal = {};
      let getChannelListValue = [];
      this.filterChannelListOptions = [];
      getChannelListValue = this.$store.getters['policies/getChannelList'];
      if (getChannelListValue.length > 0) {
        getChannelListValue.forEach((val) => {
          channelOptionsVal = {
            value: val.ChannelId,
            text: val.ChannelId,
          };
          this.filterChannelListOptions.push(channelOptionsVal);
          this.filterChannelList = this.filterChannelListOptions[0].value;
        });
        this.userItemsInit();
      }
    },
    convertState(value) {
      if (value === null || value === undefined) return '';
      const valueType = typeof value;
      let status = value;
      switch (valueType) {
        case 'string':
          status = this.$t(`global.status.${value.toLowerCase()}`);
          break;
        case 'boolean':
          status = this.$t(`global.status.${String(value).toLowerCase()}`);
          break;
        default:
          return String(value);
      }
      if (status !== value) return status;
      else return value;
    },
    convertPrivilege(value) {
      if (!value) return '';
      const role = value.toLowerCase();
      if (role.includes('administrator')) {
        return this.$t('pageSessions.table.administrator');
      } else if (role.includes('operator')) {
        return this.$t('pageSessions.table.operator');
      } else if (role.includes('readonly')) {
        return this.$t('pageSessions.table.readOnly');
      }
      return value;
    },
  },
};
</script>

<style lang="scss" scoped>
.btn.collapsed {
  svg {
    transform: rotate(180deg);
  }
}
.channel-select-dropdown {
  display: flex;
  label {
    margin-right: 20px;
    font-size: 16px;
  }
}
</style>
