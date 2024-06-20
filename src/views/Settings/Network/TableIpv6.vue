<template>
  <page-section :section-title="$t('pageNetwork.ipv6')">
    <b-row>
      <b-col>
        <h3 class="h5">
          {{ $t('pageNetwork.ipv6Addresses') }}
        </h3>
      </b-col>
      <b-col class="text-right">
        <b-button
          :disabled="ipv6BtnDisable"
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
          :enabled="action.enabled"
          @click-table-action="onIpv6TableAction(action, $event, index)"
        >
          <template #icon>
            <icon-edit v-if="action.value === 'edit'" />
            <icon-trashcan v-if="action.value === 'delete'" />
          </template>
        </table-row-action>
      </template>
    </b-table>
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
    };
  },
  computed: {
    ...mapState('network', ['ethernetData']),
    ...mapState('network', ['globalNetworkSettings']),
  },
  watch: {
    // Watch for change in tab index
    tabIndex() {
      this.getIpv6TableItems();
    },
    ethernetData() {
      this.getIpv6TableItems();
    },
  },
  created() {
    this.getIpv6TableItems();
  },
  methods: {
    getIpv6TableItems() {
      this.ipv6BtnDisable =
        this.ethernetData[this.tabIndex].IPv6StaticAddresses.length < 16 &&
        this.ethernetData[this.tabIndex].DHCPv6.OperatingMode == 'Disabled'
          ? false
          : true;
      const index = this.tabIndex;
      const addresses = this.ethernetData[index].IPv6Addresses || [];
      this.form.ipv6TableItems = addresses.filter((ipv6) => {
        if (ipv6.AddressOrigin !== 'LinkLocal') {
          return ipv6;
        }
      });
      this.form.ipv6TableItems = this.form.ipv6TableItems.map((ipv6) => {
        return {
          Address: ipv6.Address,
          PrefixLength: ipv6.PrefixLength,
          Gateway: this.ethernetData[index].IPv6DefaultGateway,
          actions: [
            {
              value: 'edit',
              title: this.$t('pageNetwork.table.editIpv6'),
              enabled:
                this.ethernetData[this.tabIndex].DHCPv6.OperatingMode ==
                'Disabled'
                  ? true
                  : false,
            },
            {
              value: 'delete',
              title: this.$t('pageNetwork.table.deleteIpv6'),
              enabled:
                this.form.ipv6TableItems.length > 1 &&
                this.ethernetData[this.tabIndex].DHCPv6.OperatingMode ==
                  'Disabled'
                  ? true
                  : false,
            },
          ],
        };
      });
    },
    onIpv6TableAction(action, $event, index) {
      if ($event === 'delete') {
        this.deleteIpv6TableRow(index);
      } else {
        this.editIpv6TableRow(index);
      }
    },
    editIpv6TableRow(index) {
      this.$emit('ipv6TableData', this.form.ipv6TableItems);
      this.$emit('ipv6EditData', index);
      this.$bvModal.show('modal-add-ipv6');
    },
    deleteIpv6TableRow(index) {
      this.form.ipv6TableItems.splice(index, 1);
      this.$store
        .dispatch('network/deleteIpv6Address', this.form.ipv6TableItems)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    initAddIpv6Address() {
      this.$emit('addIpv6');
      this.$emit('ipv6TableData', this.form.ipv6TableItems);
      this.$bvModal.show('modal-add-ipv6');
    },
    changeDhcpIpv6State(dhcpEnable) {
      if (dhcpEnable) {
        this.startLoader();
        this.$emit('addIpv6');
        const data = { dhcpEnable: dhcpEnable, index: this.tabIndex };
        this.$store.commit('network/setIpv6Dhcp', data);
        this.$store
          .dispatch('network/saveIpv6Dhcp', 'Enabled')
          .then((message) => {
            setTimeout(() => {
              this.$store.dispatch('network/getEthernetData');
              this.endLoader();
              this.successToast(message);
            }, 5000);
          })
          .catch(({ message }) => {
            this.endLoader();
            this.errorToast(message);
          });
      } else {
        const data = { dhcpEnable: !dhcpEnable, index: this.tabIndex };
        this.$store.commit('network/setIpv6Dhcp', data);
        if (this.ethernetData[this.tabIndex].IPv6StaticAddresses.length < 16) {
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
  },
};
</script>
