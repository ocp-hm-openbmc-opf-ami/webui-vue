<template>
  <b-container fluid="xl">
    <page-title :description="$t('pageLanDestinations.pageDescription')" />

    <!-- Header Section with Interface Selector -->
    <div class="mb-4">
      <b-row class="align-items-center">
        <b-col cols="12" md="4" class="mt-3 mt-md-0">
          <b-form-group
            :label="$t('pageLanDestinations.ethernetInterface')"
            label-for="interface-select"
            class="mb-0"
          >
            <b-form-select
              id="interface-select"
              v-model="selectedInterface"
              :options="interfaceOptions"
              @change="handleInterfaceChange"
            >
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
    </div>

    <!-- Subscriptions Table -->
    <div class="table-section">
      <b-table
        responsive
        hover
        :busy="loading"
        :fields="fields"
        :items="subscriptions"
        :per-page="perPage"
        :current-page="currentPage"
        show-empty
        :empty-text="$t('global.table.emptyMessage')"
      >
        <!-- Loading slot -->
        <template #table-busy>
          <div class="text-center my-2">
            <b-spinner class="align-middle mr-2"></b-spinner>
            <strong>{{ $t('global.status.loading') }}</strong>
          </div>
        </template>

        <!-- Index column -->
        <template #cell(index)="data">
          <span>{{ data.item.slotNumber }}</span>
        </template>

        <!-- Id column -->
        <template #cell(id)="data">
          <span>{{ data.item.id }}</span>
        </template>

        <!-- Status column -->
        <template #cell(status)="data">
          <span :class="{ 'text-muted': !data.item.configured }">
            {{
              getStatus(data.item.protocol, data.item.destination)
                ? 'Configured'
                : 'Not Configured'
            }}
          </span>
        </template>

        <!-- Protocol column -->
        <template #cell(protocol)="data">
          <span>{{ data.item.protocol }}</span>
        </template>

        <!-- Destination URL column -->
        <template #cell(destination)="data">
          <div v-if="data.item.configured">
            <div class="destination-url">{{ data.item.destination }}</div>
          </div>
          <span v-else class="text-muted">--</span>
        </template>

        <!-- Username column -->
        <template #cell(username)="data">
          <div v-if="data.item.configured">
            <div class="username">{{ data.item.username }}</div>
          </div>
          <span v-else class="text-muted">--</span>
        </template>

        <!-- Actions column -->
        <template #cell(actions)="data">
          <table-row-action
            v-if="data.item.configured"
            :value="data.item"
            :title="$t('pageLanDestinations.sendTestAlert')"
            :enabled="
              !isButtonDisabled &&
              getStatus(data.item.protocol, data.item.destination)
            "
            @click-table-action="onSendTestAlert(data.item)"
          >
            <template #icon>
              <icon-email />
            </template>
          </table-row-action>
          <table-row-action
            v-if="data.item.configured"
            :value="data.item"
            :title="$t('pageLanDestinations.editSubscription')"
            :enabled="!isButtonDisabled"
            @click-table-action="onEditSubscription(data.item)"
          >
            <template #icon>
              <icon-edit />
            </template>
          </table-row-action>
          <table-row-action
            v-if="data.item.configured"
            :value="data.item"
            :title="$t('pageLanDestinations.deleteSubscription')"
            :enabled="
              !isButtonDisabled &&
              getStatus(data.item.protocol, data.item.destination)
            "
            @click-table-action="onDeleteSubscription(data.item)"
          >
            <template #icon>
              <icon-trashcan />
            </template>
          </table-row-action>
          <table-row-action
            v-if="!data.item.configured"
            :value="data.item"
            :title="$t('pageLanDestinations.addSubscription')"
            :enabled="!isButtonDisabled"
            @click-table-action="onAddSubscription(data.item)"
          >
            <template #icon>
              <icon-add />
            </template>
          </table-row-action>
        </template>
      </b-table>

      <!-- Pagination -->
      <b-row>
        <b-col>
          <b-pagination
            v-model="currentPage"
            :total-rows="subscriptions.length"
            :per-page="perPage"
            aria-controls="subscriptions-table"
            first-number
            last-number
          ></b-pagination>
        </b-col>
      </b-row>
    </div>

    <!-- Edit/Add Subscription Modal -->
    <b-modal
      id="subscription-modal"
      :title="modalTitle"
      size="lg"
      @hidden="resetModal"
      @ok="handleModalOk"
    >
      <b-form>
        <!-- General Configuration Section -->
        <div class="mb-4">
          <b-form-group
            :label="$t('pageLanDestinations.protocol')"
            label-for="protocol"
          >
            <b-form-select
              id="protocol"
              v-model="form.protocol"
              :options="protocolOptions"
              required
            ></b-form-select>
          </b-form-group>

          <b-form-group
            v-if="!isSmtpProtocol"
            :label="$t('pageLanDestinations.destinationUrl')"
            label-for="destination"
          >
            <b-form-input
              id="destination"
              v-model="form.destination"
              :placeholder="$t('pageLanDestinations.destinationPlaceholder')"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            v-if="isSnmpV1OrV2Protocol"
            :label="$t('pageLanDestinations.communityString')"
            label-for="communityString"
            class="field-width"
          >
            <b-form-select
              id="communityString"
              v-model="form.communityString"
              :options="communityStringOptions"
              data-test-id="subscription-select-communityString"
            >
              <template #first>
                <b-form-select-option :value="null" disabled>
                  {{ $t('global.form.selectAnOption') }}
                </b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>

          <b-form-group
            v-if="isSmtpProtocol || isSnmpV3Protocol"
            :label="$t('pageLanDestinations.username')"
            label-for="username"
          >
            <b-form-select
              id="username"
              v-model="form.username"
              :options="usernameOptions"
              required
            ></b-form-select>
          </b-form-group>
        </div>
      </b-form>

      <template #modal-footer="{ ok, cancel }">
        <b-button variant="secondary" @click="cancel()">
          {{ $t('global.action.cancel') }}
        </b-button>
        <b-button variant="primary" @click="ok()">
          <icon-save class="mr-1" />
          {{ $t('global.action.save') }}
        </b-button>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import TableRowAction from '@/components/Global/TableRowAction';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin';
import { mapGetters, mapState } from 'vuex';
import IconEdit from '@carbon/icons-vue/es/edit/20';
import IconTrashcan from '@carbon/icons-vue/es/trash-can/20';
import IconAdd from '@carbon/icons-vue/es/add/20';
import IconSave from '@carbon/icons-vue/es/save/20';
import IconEmail from '@carbon/icons-vue/es/email/20';
import { privilegesId } from '@/store/modules/GlobalStore';

export default {
  name: 'LanDestinations',
  components: {
    PageTitle,
    TableRowAction,
    IconEdit,
    IconTrashcan,
    IconAdd,
    IconSave,
    IconEmail,
  },
  mixins: [BVToastMixin, LoadingBarMixin, VuelidateMixin],
  data() {
    return {
      currentPage: 1,
      perPage: 15,
      showPassword: false,
      isEditing: false,
      modalTitle: '',
      form: {
        name: '',
        destination: '',
        username: '',
        context: '',
        deliveryRetryPolicy: 'SuspendRetries',
        sendHeartbeat: false,
        heartbeatInterval: 30,
        communityString: '',
        protocol: 'SNMPv2c',
        ethernetInterface: '',
        destinationIndex: 0,
      },
      currentItem: null,
      retryPolicyOptions: [
        { value: 'SuspendRetries', text: 'Suspend Retries' },
        { value: 'RetryForever', text: 'Retry Forever' },
        {
          value: 'RetryForeverWithBackoff',
          text: 'Retry Forever With Backoff',
        },
      ],
      protocolOptions: [
        { value: 'SMTP', text: 'SMTP' },
        { value: 'SNMPv1', text: 'SNMPv1' },
        { value: 'SNMPv2c', text: 'SNMPv2c' },
        { value: 'SNMPv3', text: 'SNMPv3' },
      ],
      fields: [
        {
          key: 'index',
          label: this.$t('pageLanDestinations.index'),
          sortable: true,
        },
        {
          key: 'ID',
          label: this.$t('pageLanDestinations.Id'),
          sortable: true,
        },
        {
          key: 'status',
          label: this.$t('pageLanDestinations.status'),
          sortable: true,
        },
        {
          key: 'protocol',
          label: this.$t('pageLanDestinations.protocol'),
          sortable: true,
        },
        {
          key: 'destination',
          label: this.$t('pageLanDestinations.destination'),
        },
        {
          key: 'username',
          label: this.$t('pageLanDestinations.username'),
        },
        {
          key: 'actions',
          label: this.$t('pageLanDestinations.actions'),
          class: 'text-right',
        },
      ],
    };
  },
  computed: {
    ...mapState('lanDestinations', ['interfaces']),
    ...mapGetters('lanDestinations', [
      'subscriptions',
      'activeSlots',
      'totalSlots',
    ]),
    ...mapGetters('global', ['userPrivilege']),
    selectedInterface: {
      get() {
        return this.$store.getters['lanDestinations/selectedInterface'];
      },
      set(value) {
        this.$store.commit('lanDestinations/setSelectedInterface', value);
      },
    },
    loading: {
      get() {
        return this.$store.state.lanDestinations.loading;
      },
      set(value) {
        this.$store.commit('lanDestinations/setLoading', value);
      },
    },
    interfaceOptions() {
      return this.interfaces.map((iface, index) => ({
        value: iface,
        text:
          iface.toUpperCase() +
          (index === 0
            ? ' (' + this.$t('pageLanDestinations.active') + ')'
            : ''),
      }));
    },
    availableSlots() {
      return this.totalSlots - this.activeSlots;
    },
    interfaceStatus() {
      return this.$t('pageLanDestinations.linkUp');
    },
    isSmtpProtocol() {
      return this.form.protocol === 'SMTP';
    },
    isSnmpV3Protocol() {
      return this.form.protocol === 'SNMPv3';
    },
    isSnmpV1OrV2Protocol() {
      return (
        this.form.protocol === 'SNMPv1' || this.form.protocol === 'SNMPv2c'
      );
    },
    communityStringOptions() {
      return this.$store.getters['snmp/communityStrings'] || [];
    },
    usernameOptions() {
      if (this.form.protocol === 'SNMPv3') {
        return this.$store.getters['snmp/Snmpusers'] || [];
      } else if (this.form.protocol === 'SMTP') {
        return this.$store.getters['snmp/Smtpusers'] || [];
      }
      return [];
    },
    isButtonDisabled() {
      return this.userPrivilege !== privilegesId.admin;
    },
  },
  async created() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      this.startLoader();
      try {
        await this.$store.dispatch('lanDestinations/getAllSubscriptions');
        await this.$store.dispatch('lanDestinations/getInterfaceSubscriptions');
        await this.$store.dispatch('snmp/getSNMPProtocolStatus');
        await this.$store.dispatch('snmp/getUsers');
      } catch (error) {
        this.errorToast(this.$t('pageLanDestinations.toast.errorLoadingData'));
      } finally {
        this.endLoader();
      }
    },
    async handleInterfaceChange() {
      this.startLoader();
      try {
        await this.$store.dispatch(
          'lanDestinations/changeInterface',
          this.selectedInterface,
        );
        this.currentPage = 1;
      } catch (error) {
        this.errorToast(this.$t('pageLanDestinations.toast.errorLoadingData'));
      } finally {
        this.endLoader();
      }
    },
    onAddSubscription(item) {
      this.isEditing = false;
      this.currentItem = item;
      this.modalTitle = this.$t('pageLanDestinations.addSubscription');
      this.form = {
        name: `SNMP Trap Destination ${item.slotNumber}`,
        destination: '',
        username: '',
        context: '',
        deliveryRetryPolicy: 'SuspendRetries',
        sendHeartbeat: false,
        heartbeatInterval: 30,
        communityString: '',
        protocol: 'SNMPv2c',
        ethernetInterface: this.selectedInterface,
        destinationIndex: item.index,
      };
      this.$bvModal.show('subscription-modal');
    },
    onEditSubscription(item) {
      this.isEditing = true;
      this.currentItem = item;
      this.modalTitle = this.$t('pageLanDestinations.editSubscription');
      this.form = {
        name: item.name,
        destination: this.extractIpAddress(item.destination),
        username: item.username,
        context: item.context,
        deliveryRetryPolicy: item.deliveryRetryPolicy,
        sendHeartbeat: item.sendHeartbeat,
        heartbeatInterval: item.heartbeatInterval,
        communityString: item.communityString,
        protocol: item.protocol,
        ethernetInterface: item.ethernetInterface,
        destinationIndex: item.destinationIndex,
      };
      this.$bvModal.show('subscription-modal');
    },
    async onDeleteSubscription(item) {
      this.$bvModal
        .msgBoxConfirm(
          this.$t('pageLanDestinations.modal.deleteConfirmMessage', {
            destination: item.destination,
          }),
          {
            title: this.$t('pageLanDestinations.modal.deleteConfirmTitle'),
            okTitle: this.$t('global.action.delete'),
            cancelTitle: this.$t('global.action.cancel'),
            okVariant: 'danger',
          },
        )
        .then(async (confirmed) => {
          if (confirmed) {
            this.startLoader();
            try {
              const message = await this.$store.dispatch(
                'lanDestinations/deleteSubscription',
                item.uri,
              );
              this.successToast(message);
            } catch (error) {
              this.errorToast(error.message);
            } finally {
              this.endLoader();
            }
          }
        });
    },
    async onSendTestAlert(item) {
      this.startLoader();
      try {
        await this.$store.dispatch(
          'lanDestinations/sendSubscriptionMail',
          item.uri,
        );
        this.successToast(
          this.$t('pageLanDestinations.toast.sendTestAlertSuccess'),
        );
      } catch (error) {
        this.errorToast(
          this.$t('pageLanDestinations.toast.sendTestAlertError'),
        );
      } finally {
        this.endLoader();
      }
    },
    async handleModalOk(bvModalEvent) {
      bvModalEvent.preventDefault();

      const snmpv1Enabled = this.$store.getters['snmp/snmpv1Enabled'];
      const snmpv2cEnabled = this.$store.getters['snmp/snmpv2cEnabled'];
      const snmpv3Enabled = this.$store.getters['snmp/snmpv3Enabled'];
      const snmpProtocolEnabled = this.$store.getters['snmp/snmpProtocol'];

      if (
        this.form.protocol === 'SNMPv1' &&
        !snmpProtocolEnabled &&
        !snmpv1Enabled
      ) {
        this.errorToast(
          this.$t('pageLanDestinations.toast.errorSNMPv1Disabled'),
        );
        return;
      }
      if (
        this.form.protocol === 'SNMPv2c' &&
        !snmpProtocolEnabled &&
        !snmpv2cEnabled
      ) {
        this.errorToast(
          this.$t('pageLanDestinations.toast.errorSNMPv2cDisabled'),
        );
        return;
      }
      if (
        this.form.protocol === 'SNMPv3' &&
        !snmpProtocolEnabled &&
        !snmpv3Enabled
      ) {
        this.errorToast(
          this.$t('pageLanDestinations.toast.errorSNMPv3Disabled'),
        );
        return;
      }

      // Validation
      if (!this.isSmtpProtocol && !this.form.destination) {
        this.errorToast(
          this.$t('pageLanDestinations.toast.errorEmptyDestination'),
        );
        return;
      }
      if (
        !this.isSmtpProtocol &&
        !this.validateDestinationAddress(this.form.destination)
      ) {
        this.errorToast(
          `${this.$t('pageLanDestinations.destinationUrl')}: ${this.$t(
            'global.form.invalidFormat',
          )}`,
        );
        return;
      }
      if (this.isSnmpV1OrV2Protocol && !this.form.communityString) {
        this.errorToast(
          this.$t('pageLanDestinations.toast.errorEmptyCommunityString'),
        );
        return;
      }
      if (
        (this.isSmtpProtocol || this.isSnmpV3Protocol) &&
        (!this.form.username || this.form.username === '--')
      ) {
        this.form.username = '--'; // Set to empty string if no valid username is selected
        this.errorToast(this.$t('global.form.usernameRequired'));
        return;
      }

      this.startLoader();
      try {
        const submitPayload = {
          ...this.form,
          destination: this.formatDestinationForSubmit(),
        };
        let message;
        if (this.isEditing) {
          message = await this.$store.dispatch(
            'lanDestinations/updateSubscription',
            {
              uri: this.currentItem.uri,
              data: submitPayload,
            },
          );
        } else {
          message = await this.$store.dispatch(
            'lanDestinations/createSubscription',
            {
              index: this.currentItem.index,
              data: submitPayload,
            },
          );
        }
        this.successToast(message);
        this.$bvModal.hide('subscription-modal');
      } catch (error) {
        this.form.username = '--';
        this.errorToast(error.message);
      } finally {
        this.endLoader();
      }
    },
    resetModal() {
      this.form = {
        name: '',
        destination: '',
        username: '',
        context: '',
        deliveryRetryPolicy: 'SuspendRetries',
        sendHeartbeat: false,
        heartbeatInterval: 30,
        communityString: '',
        protocol: 'SNMPv2c',
        ethernetInterface: '',
        destinationIndex: 0,
      };
      this.currentItem = null;
      this.showPassword = false;
    },
    getStatus(protocol, destination) {
      if (protocol !== 'SNMPv1' || destination != '--') {
        return true;
      } else {
        return false;
      }
    },
    validateDestinationAddress(destination = '') {
      const ipAddress = this.extractIpAddress(destination).trim();
      if (!ipAddress) return false;

      return this.ipv4Regex(ipAddress) || this.ipv6Regex(ipAddress);
    },
    extractIpAddress(destination = '') {
      const withoutScheme = destination.replace(/^snmp:\/\//i, '');
      const withoutUser = withoutScheme.includes('@')
        ? withoutScheme.split('@').pop()
        : withoutScheme;

      // IPv6 with optional port: [fe80::1]:162
      const ipv6BracketMatch = withoutUser.match(/^\[([^\]]+)\](?::\d+)?$/);
      if (ipv6BracketMatch) {
        return ipv6BracketMatch[1];
      }

      // IPv4 with optional port: 192.168.1.10:162
      const ipv4WithPortMatch = withoutUser.match(
        /^(\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?$/,
      );
      if (ipv4WithPortMatch) {
        return ipv4WithPortMatch[1];
      }

      // Raw IPv6 without brackets/port
      return withoutUser || '';
    },
    formatSnmpDestination(destination = '') {
      const ipAddress = this.extractIpAddress(destination).trim();
      if (!ipAddress) return '';
      return ipAddress.includes(':')
        ? `snmp://[${ipAddress}]`
        : `snmp://${ipAddress}`;
    },
    formatSnmpV3Destination(destination = '', username = '') {
      const ipAddress = this.extractIpAddress(destination).trim();
      const userName = username.trim();
      if (!ipAddress || !userName) return '';

      return ipAddress.includes(':')
        ? `snmp://${userName}@[${ipAddress}]`
        : `snmp://${userName}@${ipAddress}`;
    },
    formatDestinationForSubmit() {
      if (this.isSnmpV3Protocol) {
        return this.formatSnmpV3Destination(
          this.form.destination,
          this.form.username,
        );
      }

      if (this.isSnmpV1OrV2Protocol) {
        return this.formatSnmpDestination(this.form.destination);
      }

      return this.form.destination;
    },
  },
};
</script>

<style lang="scss" scoped>
.info-box {
  padding: 1rem;
  background: var(--background-color);
  border-radius: 4px;
  border: 1px solid var(--border-color);

  .info-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
    letter-spacing: 0.5px;
  }

  .info-value {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
  }

  .info-sublabel {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
}

.table-section {
  background: var(--background-color);
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.destination-url {
  font-family: monospace;
  font-size: 0.9rem;
  color: var(--text-link);
}

h6 {
  display: flex;
  align-items: center;
  color: var(--text-primary);
  font-weight: 600;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}
</style>
