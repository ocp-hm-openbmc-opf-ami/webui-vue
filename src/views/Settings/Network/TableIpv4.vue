<template>
  <page-section :section-title="$t('pageNetwork.ipv4')">
    <b-row>
      <b-col md="3">
        <dl>
          <dt>{{ $t('pageNetwork.useDomainName') }}</dt>
          <dd>
            <b-form-checkbox
              v-model="useDomainNameState"
              data-test-id="DHCPv4-switch-useDomainName"
              switch
              :disabled="interfaceId === 'hostusb0'"
              @change="changeDhcpv4DomainNameState"
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
              data-test-id="DHCPv4-switch-useDns"
              switch
              :disabled="interfaceId === 'hostusb0'"
              @change="changeDhcpv4DnsState"
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
              data-test-id="DHCPv4-switch-useNtp"
              switch
              :disabled="interfaceId === 'hostusb0'"
              @change="changeDhcpv4NtpState"
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
          {{ $t('pageNetwork.ipv4Addresses') }}
        </h3>
      </b-col>
      <b-col class="text-right" md="3">
        <dl>
          <dd>
            <b-form-checkbox
              v-model="globalNetworkSettings[tabIndex].ipv4DhcpEnabled"
              switch
              :disabled="interfaceId === 'hostusb0'"
              @change="changeDhcpIpv4State"
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
      :fields="ipv4TableFields"
      :items="form.ipv4TableItems"
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
          :enabled="action.enabled"
          @click-table-action="editIpv4TableRow(index)"
        >
          <template #icon>
            <icon-edit v-if="action.value === 'edit'" />
          </template>
        </table-row-action>
      </template>
    </b-table>
  </page-section>
</template>

<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import IconEdit from '@carbon/icons-vue/es/edit/20';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import PageSection from '@/components/Global/PageSection';
import TableRowAction from '@/components/Global/TableRowAction';
import { mapState } from 'vuex';

export default {
  name: 'Ipv4Table',
  components: {
    IconEdit,
    PageSection,
    TableRowAction,
  },
  mixins: [BVToastMixin, LoadingBarMixin],
  props: {
    tabIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      networkOverlay: false,
      ipv4BtnDisable: false,
      form: {
        ipv4TableItems: [],
      },
      actions: [
        {
          value: 'edit',
          title: this.$t('global.action.edit'),
        },
      ],
      ipv4TableFields: [
        {
          key: 'Address',
          label: this.$t('pageNetwork.table.ipAddress'),
        },
        {
          key: 'Gateway',
          label: this.$t('pageNetwork.table.gateway'),
        },
        {
          key: 'SubnetMask',
          label: this.$t('pageNetwork.table.subnet'),
        },
        {
          key: 'AddressOrigin',
          label: this.$t('pageNetwork.table.addressOrigin'),
        },
        { key: 'actions', label: '', tdClass: 'text-right' },
      ],
      interfaceId: this.$store.getters['network/selectedInterfaceId'],
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
        ].dhcpv4.useDomainNameEnabled;
      },
      set(newValue) {
        return newValue;
      },
    },
    useDnsState: {
      get() {
        return this.$store.getters['network/globalNetworkSettings'][
          this.tabIndex
        ].dhcpv4.useDnsEnabled;
      },
      set(newValue) {
        return newValue;
      },
    },
    useNtpState: {
      get() {
        return this.$store.getters['network/globalNetworkSettings'][
          this.tabIndex
        ].dhcpv4.useNtpEnabled;
      },
      set(newValue) {
        return newValue;
      },
    },
  },
  watch: {
    // Watch for change in tab index
    tabIndex() {
      this.getIpv4TableItems();
    },
    ethernetData() {
      this.getIpv4TableItems();
    },
    selectedInterfaceId: function (value) {
      this.interfaceId = value;
    },
  },
  created() {
    this.getIpv4TableItems();
  },
  methods: {
    getIpv4TableItems() {
      this.ipv4BtnDisable =
        this.ethernetData[this.tabIndex].IPv4StaticAddresses.length < 2 &&
        this.ethernetData[this.tabIndex].DHCPv4.DHCPEnabled == false
          ? false
          : true;
      const index = this.tabIndex;
      const addresses = this.ethernetData[index].IPv4Addresses || [];
      this.form.ipv4TableItems = addresses.filter((ipv4) => {
        if (ipv4.AddressOrigin !== 'IPv4LinkLocal') {
          return ipv4;
        }
      });
      this.form.ipv4TableItems = this.form.ipv4TableItems.map((ipv4) => {
        return {
          Address: ipv4.Address,
          SubnetMask: ipv4.SubnetMask,
          Gateway: ipv4.Gateway,
          AddressOrigin: ipv4.AddressOrigin,
          actions: [
            {
              value: 'edit',
              title: this.$t('pageNetwork.table.editIpv4'),
              enabled:
                this.ethernetData[this.tabIndex].DHCPv4.DHCPEnabled == false
                  ? true
                  : false,
            },
          ],
        };
      });
    },
    editIpv4TableRow(index) {
      this.$emit('ipv4TableData', this.form.ipv4TableItems);
      this.$emit('ipv4EditData', index);
      this.$bvModal.show('modal-add-ipv4');
    },
    initAddIpv4Address() {
      this.$emit('addIpv4');
      this.$emit('ipv4TableData', this.form.ipv4TableItems);
      this.$bvModal.show('modal-add-ipv4');
    },
    changeDhcpIpv4State(dhcpEnable) {
      if (dhcpEnable) {
        this.$bvModal
          .msgBoxConfirm(this.$tc('pageNetwork.modal.confirmMessage'), {
            title: this.$tc('pageNetwork.modal.confirmTitle'),
            okTitle: this.$t('global.action.ok'),
            cancelTitle: this.$t('global.action.cancel'),
          })
          .then((addConfirmed) => {
            if (addConfirmed) {
              const data = { dhcpEnable: dhcpEnable, index: this.tabIndex };
              this.$store.commit('network/setIpv4Dhcp', data);
              this.$store
                .dispatch('network/saveIpv4Dhcp', true)
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
                      }
                    });
                })
                .catch(({ message }) => this.errorToast(message));
            } else {
              const data = { dhcpEnable: !dhcpEnable, index: this.tabIndex };
              this.$store.commit('network/setIpv4Dhcp', data);
            }
          });
      } else {
        const data = { dhcpEnable: !dhcpEnable, index: this.tabIndex };
        this.$store.commit('network/setIpv4Dhcp', data);
        if (this.ethernetData[this.tabIndex].IPv4StaticAddresses.length < 2) {
          this.$bvModal.show('modal-add-ipv4');
        } else {
          this.$bvModal.msgBoxOk(
            this.$tc('pageNetwork.modal.ipv4Confirmation'),
            {
              title: this.$tc('pageNetwork.modal.confirm'),
            },
          );
          const data = { dhcpEnable: dhcpEnable, index: this.tabIndex };
          this.$store.commit('network/setIpv4Dhcp', data);
          this.form.ipv4TableItems.forEach((element) => {
            element.actions = [
              {
                value: 'edit',
                title: this.$t('pageNetwork.table.editIpv4'),
                enabled: true,
              },
            ];
          });
        }
      }
    },
    changeDhcpv4DomainNameState(state) {
      this.$store
        .dispatch('network/saveDhcpv4DomainNameState', state)
        .then((success) => {
          this.successToast(success);
        })
        .catch(({ message }) => this.errorToast(message));
    },
    changeDhcpv4DnsState(state) {
      this.$store
        .dispatch('network/saveDhcpv4DnsState', state)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeDhcpv4NtpState(state) {
      this.$store
        .dispatch('network/saveDhcpv4NtpState', state)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
  },
};
</script>
