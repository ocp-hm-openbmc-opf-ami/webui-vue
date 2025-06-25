<template>
  <page-section
    :section-title="$t('pageNetwork.ipv6')"
    class="network_header_block"
  >
    <span>
      <b-form-checkbox
        v-if="getOemAmiActions"
        v-model="enableIpv6Network"
        data-test-id="enableIpv6-network"
        switch
        class="network_header_enable"
        :disabled="interfaceId === 'hostusb0' || isButtonDisable"
        @change="ipv6StatusUpdate"
      >
      </b-form-checkbox>
    </span>
    <span v-if="enableIpv6InterfaceChecking">
      <b-col xl="6" class="p0 inline_block_element">
        <b-alert show variant="warning">{{
          $t('pageNetwork.ipv4ipv6statusinfo')
        }}</b-alert>
      </b-col>
    </span>
    <div>
      <b-row>
        <b-col md="3">
          <dl>
            <dt>{{ $t('pageNetwork.useDomainName') }}</dt>
            <dd>
              <b-form-checkbox
                v-model="useDomainNameState"
                data-test-id="DHCPv6-switch-useDomainName"
                switch
                :disabled="
                  interfaceId === 'hostusb0' ||
                  !ipv6SettingsStatus ||
                  isButtonDisable
                "
                @change="changeDhcpv6DomainNameState"
              >
                <span v-if="useDomainNameState">
                  {{ $t('global.status.enabled') }}
                </span>
                <span v-else>{{ $t('global.status.disabled') }}</span>
              </b-form-checkbox>
            </dd>
          </dl>
        </b-col>
        <b-col md="3">
          <dl>
            <dt>{{ $t('pageNetwork.useDns') }}</dt>
            <dd>
              <b-form-checkbox
                v-model="useDnsState"
                switch
                :disabled="
                  interfaceId === 'hostusb0' ||
                  !ipv6SettingsStatus ||
                  isButtonDisable
                "
                @change="changeDhcpv6DnsState"
              >
                <span v-if="useDnsState">
                  {{ $t('global.status.enabled') }}
                </span>
                <span v-else>{{ $t('global.status.disabled') }}</span>
              </b-form-checkbox>
            </dd>
          </dl>
        </b-col>
        <b-col md="3">
          <dl>
            <dt>{{ $t('pageNetwork.useNtp') }}</dt>
            <dd>
              <b-form-checkbox
                v-model="useNtpState"
                switch
                :disabled="
                  interfaceId === 'hostusb0' ||
                  !ipv6SettingsStatus ||
                  isButtonDisable
                "
                @change="changeDhcpv6NtpState"
              >
                <span v-if="useNtpState">
                  {{ $t('global.status.enabled') }}
                </span>
                <span v-else>{{ $t('global.status.disabled') }}</span>
              </b-form-checkbox>
            </dd>
          </dl>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <h3 class="h5">
            {{ $t('pageNetwork.ipv6Addresses') }}
          </h3>
        </b-col>
        <b-col class="text-right">
          <b-button
            :disabled="
              ipv6BtnDisable ||
              interfaceId === 'hostusb0' ||
              !ipv6SettingsStatus ||
              form.ipv6TableItems.length >= 16 ||
              isButtonDisable
            "
            variant="primary"
            @click="initAddIpv6Address()"
          >
            <icon-add />
            {{ $t('pageNetwork.table.addIpv6Address') }}
          </b-button>
        </b-col>
        <b-col class="text-right" md="3">
          <dl>
            <dd>
              <b-form-checkbox
                v-model="globalNetworkSettings[tabIndex].ipv6DhcpEnabled"
                switch
                :disabled="
                  interfaceId === 'hostusb0' ||
                  !ipv6SettingsStatus ||
                  isButtonDisable
                "
                @change="changeDhcpIpv6State"
              >
                <span>
                  {{ $t('pageNetwork.dhcp') }}
                </span>
              </b-form-checkbox>
            </dd>
          </dl>
        </b-col>
      </b-row>
      <b-table
        responsive="md"
        hover
        :fields="ipv6TableFields"
        :items="form.ipv6TableItems"
        :empty-text="$t('global.table.emptyMessage')"
        class="mb-0"
        show-empty
      >
        <template #cell(actions)="{ item, index }">
          <table-row-action
            v-for="(action, actionIndex) in item.actions"
            :key="actionIndex"
            :value="action.value"
            :title="action.title"
            :enabled="action.enabled && ipv6SettingsStatus"
            @click-table-action="onIpv6TableAction(action, $event, index, item)"
          >
            <template #icon>
              <icon-edit v-if="action.value === 'edit'" />
              <icon-trashcan v-if="action.value === 'delete'" />
            </template>
          </table-row-action>
        </template>
      </b-table>
    </div>
  </page-section>
</template>

<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import IconAdd from '@carbon/icons-vue/es/add--alt/20';
import IconEdit from '@carbon/icons-vue/es/edit/20';
import IconTrashcan from '@carbon/icons-vue/es/trash-can/20';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import PageSection from '@/components/Global/PageSection';
import TableRowAction from '@/components/Global/TableRowAction';
import { mapState } from 'vuex';
import _ from 'lodash';

export default {
  name: 'Ipv6Table',
  components: {
    IconAdd,
    IconEdit,
    IconTrashcan,
    PageSection,
    TableRowAction,
  },
  mixins: [BVToastMixin, LoadingBarMixin],
  props: {
    tabIndex: {
      type: Number,
      default: 0,
    },
    ipv6IndexValue: {
      type: Object,
      default: () => {},
    },
    isButtonDisable: {
      required: true,
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ipv6BtnDisable: false,
      form: {
        ipv6TableItems: [],
      },
      actions: [
        {
          value: 'edit',
          title: this.$t('global.action.edit'),
        },
        {
          value: 'delete',
          title: this.$t('global.action.delete'),
        },
      ],
      ipv6TableFields: [
        {
          key: 'Address',
          label: this.$t('pageNetwork.table.ipAddress'),
        },
        {
          key: 'PrefixLength',
          label: this.$t('pageNetwork.table.prefixLength'),
        },
        {
          key: 'Gateway',
          label: this.$t('pageNetwork.table.gateway'),
        },
        { key: 'actions', label: '', tdClass: 'text-right' },
      ],
      interfaceId: this.$store.getters['network/selectedInterfaceId'],
      enableIpv6Network: true,
      enableIpv6InterfaceChecking: false,
    };
  },
  computed: {
    ...mapState('network', [
      'ethernetData',
      'globalNetworkSettings',
      'selectedInterfaceId',
    ]),
    useDomainNameState: {
      get() {
        return this.$store.getters['network/globalNetworkSettings'][
          this.tabIndex
        ].dhcpv6.useDomainNameEnabled;
      },
      set(newValue) {
        return newValue;
      },
    },
    useDnsState: {
      get() {
        return this.$store.getters['network/globalNetworkSettings'][
          this.tabIndex
        ].dhcpv6.useDnsEnabled;
      },
      set(newValue) {
        return newValue;
      },
    },
    useNtpState: {
      get() {
        return this.$store.getters['network/globalNetworkSettings'][
          this.tabIndex
        ].dhcpv6.useNtpEnabled;
      },
      set(newValue) {
        return newValue;
      },
    },
    ipv6SettingsStatus() {
      return this.$store.getters['network/globalNetworkSettings'][this.tabIndex]
        .ipv6Status;
    },
    ipv4SettingsStatus() {
      return this.$store.getters['network/globalNetworkSettings'][this.tabIndex]
        .ipv4Status;
    },
    getOemAmiActions() {
      return this.ethernetData[this.tabIndex].Actions?.Oem?.Ami ? true : false;
    },
  },
  watch: {
    // Watch for change in tab index
    tabIndex() {
      this.getIpv6TableItems();
    },
    ethernetData() {
      this.getIpv6TableItems();
    },
    selectedInterfaceId: function (value) {
      this.interfaceId = value;
    },
  },
  created() {
    this.getIpv6TableItems();
  },
  methods: {
    getIpv6TableItems() {
      this.ipv6BtnDisable =
        this.ethernetData[this.tabIndex].IPv6StaticAddresses.length <= 16 &&
        this.ethernetData[this.tabIndex].DHCPv6.OperatingMode == 'Disabled'
          ? false
          : true;
      const index = this.tabIndex;
      const addresses = this.ipv6BtnDisable
        ? this.ethernetData[index].IPv6Addresses || []
        : this.ethernetData[index].IPv6StaticAddresses || []; //if IPV6 DHCP disabled take the take from the IPv6StaticAddresses due to index present.
      this.form.ipv6TableItems = addresses.filter((ipv6) => {
        if (ipv6.AddressOrigin !== 'LinkLocal') {
          return ipv6;
        }
      });
      if (
        this.ethernetData[index].IPv6StaticAddresses.length > 0 &&
        this.ethernetData[index].Actions?.Oem?.Ami
      ) {
        this.ipv6TableFields.splice(this.ipv6TableFields.length - 1, 0, {
          //adding the ipv6Index field to the table baseon the IPv6StaticAddresses length
          key: 'ipv6Index',
          label: this.$t('pageNetwork.table.ipv6Index'),
        });
      } else {
        this.ipv6TableFields = this.ipv6TableFields.filter(function (e) {
          //remove the ipv6Index field to the table if IPv6Addresses length
          return e.key !== 'ipv6Index';
        });
      }
      this.form.ipv6TableItems = this.form.ipv6TableItems.map((ipv6) => {
        return {
          Address: ipv6.Address,
          PrefixLength: ipv6.PrefixLength,
          Gateway: this.ethernetData[index].IPv6DefaultGateway,
          ...(ipv6.Oem?.Ami && {
            ipv6Index: ipv6.Oem.Ami.StaticIPv6AddressIndex,
          }), // Conditionally add ipv6Index
          actions: [
            {
              value: 'edit',
              title: this.$t('pageNetwork.table.editIpv6'),
              enabled:
                (this.ethernetData[this.tabIndex].DHCPv6.OperatingMode ==
                'Disabled'
                  ? true
                  : false) && !this.isButtonDisable,
            },
            {
              value: 'delete',
              title: this.$t('pageNetwork.table.deleteIpv6'),
              enabled:
                this.form.ipv6TableItems.length > 1 &&
                (this.ethernetData[this.tabIndex].DHCPv6.OperatingMode ==
                'Disabled'
                  ? true
                  : false) &&
                !this.isButtonDisable,
            },
          ],
        };
      });
      this.enableIpv6Network = this.ipv6SettingsStatus;
    },
    onIpv6TableAction(action, $event, index, item) {
      if ($event === 'delete') {
        this.deleteIpv6TableRow(index, item);
      } else {
        this.editIpv6TableRow(index);
      }
    },
    editIpv6TableRow(index) {
      this.$emit('ipv6TableData', this.form.ipv6TableItems);
      this.$emit('ipv6EditData', index);
      this.$bvModal.show('modal-add-ipv6');
    },
    deleteIpv6TableRow(index, ipv6DataItem) {
      var ipv6TabelDataList = [];
      ipv6TabelDataList = _.cloneDeep(this.form.ipv6TableItems);
      ipv6TabelDataList.splice(index, 1); //REP disable remove the delete IPV6 address from the list
      this.startLoader();
      this.$store
        .dispatch('network/deleteIpv6Address', {
          ipv6TabelDataList,
          ipv6DataItem,
        })
        .then((message) => {
          this.$store.dispatch('network/getEthernetData').then(() => {
            this.$emit('ipv6DeleteTableData');
            this.endLoader();
            this.successToast(message);
          });
        })
        .catch(({ message }) => {
          this.endLoader();
          this.errorToast(message);
        });
    },
    initAddIpv6Address() {
      this.$emit('addIpv6');
      this.$emit('ipv6TableData', this.form.ipv6TableItems);
      this.$bvModal.show('modal-add-ipv6');
    },
    changeDhcpIpv6State(dhcpEnable) {
      if (dhcpEnable) {
        this.$bvModal
          .msgBoxConfirm(this.$tc('pageNetwork.modal.confirmMessage'), {
            title: this.$tc('pageNetwork.modal.confirmTitle'),
            okTitle: this.$t('global.action.ok'),
            cancelTitle: this.$t('global.action.cancel'),
            autoFocusButton: 'ok',
          })
          .then((addConfirmed) => {
            if (addConfirmed) {
              const data = { dhcpEnable: dhcpEnable, index: this.tabIndex };
              this.$store.commit('network/setIpv6Dhcp', data);
              this.$store
                .dispatch('network/saveIpv6Dhcp', 'Enabled')
                .then((message) => {
                  this.successToast(message);
                  this.$bvModal
                    .msgBoxOk(
                      this.$tc('pageNetwork.modal.informationMessage'),
                      {
                        title: this.$tc('pageNetwork.modal.informatiomTitle'),
                      },
                    )
                    .then((addConfirmed) => {
                      if (addConfirmed) {
                        this.$emit('networkOverlay', true);
                        setTimeout(() => {
                          this.$store.dispatch(
                            'authentication/customizedResetLogout',
                          );
                          window.location.reload();
                        }, 2000); // wait to load the session
                      }
                    });
                })
                .catch(({ message }) => this.errorToast(message));
            } else {
              const data = { dhcpEnable: !dhcpEnable, index: this.tabIndex };
              this.$store.commit('network/setIpv6Dhcp', data);
            }
          });
      } else {
        this.$emit('addIpv6TabIndex');
        const data = { dhcpEnable: !dhcpEnable, index: this.tabIndex };
        this.$store.commit('network/setIpv6Dhcp', data);
        if (this.ethernetData[this.tabIndex].IPv6StaticAddresses.length <= 16) {
          this.$bvModal.show('modal-add-ipv6');
        } else {
          this.$bvModal.msgBoxOk(
            this.$tc('pageNetwork.modal.ipv6Confirmation'),
            {
              title: this.$tc('pageNetwork.modal.confirm'),
            },
          );
          const data = { dhcpEnable: dhcpEnable, index: this.tabIndex };
          this.$store.commit('network/setIpv6Dhcp', data);
          this.form.ipv6TableItems.forEach((element) => {
            element.actions = [
              {
                value: 'edit',
                title: this.$t('pageNetwork.table.editIpv6'),
                enabled: true,
              },
              {
                value: 'delete',
                title: this.$t('pageNetwork.table.deleteIpv6'),
                enabled: this.form.ipv6TableItems.length > 1 ? true : false,
              },
            ];
          });
        }
      }
    },
    changeDhcpv6DomainNameState(state) {
      this.$store
        .dispatch('network/saveDhcpv6DomainNameState', state)
        .then((success) => {
          this.successToast(success);
        })
        .catch(({ message }) => this.errorToast(message));
    },
    changeDhcpv6DnsState(state) {
      this.$store
        .dispatch('network/saveDhcpv6DnsState', state)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeDhcpv6NtpState(state) {
      this.$store
        .dispatch('network/saveDhcpv6NtpState', state)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    ipv6StatusUpdate(state) {
      const IPv6IPv6Configuration = {
        IPv6Enable: state,
      };
      if (this.ipv4SettingsStatus || state) {
        this.$bvModal
          .msgBoxConfirm(this.$t('pageNetwork.modal.confirmMsg'), {
            title: this.$tc('pageNetwork.ipv6'),
            okTitle: this.$tc('global.action.ok'),
            cancelTitle: this.$t('global.action.cancel'),
            autoFocusButton: 'ok',
          })
          .then((saveConfirmed) => {
            if (saveConfirmed) {
              this.startLoader();
              this.$store
                .dispatch(
                  'network/networkIpv4Ipv6Status',
                  IPv6IPv6Configuration,
                )
                .then(() => {
                  // this.successToast(success);
                  this.endLoader();
                  this.$store.dispatch('authentication/customizedResetLogout');
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000); // wait to load the session
                })
                .catch(({ message }) => this.errorToast(message));
            } else {
              this.enableIpv6Network = !this.enableIpv6Network;
            }
          });
      } else {
        this.enableIpv6Network = !this.enableIpv6Network;
        this.enableIpv6InterfaceChecking = true;
        setTimeout(() => {
          this.enableIpv6InterfaceChecking = false;
        }, 3000); // Show selected Network interface options Ipv6 Ipv4 enable/disable information for 3 seconds.
      }
    },
  },
};
</script>
<style lang="scss">
.network_header_block {
  h2 {
    display: inline-block;
  }
}
.network_header_enable {
  display: inline-block !important;
  margin-left: 10px;
}
.inline_block_element {
  display: inline-block;
}
</style>
