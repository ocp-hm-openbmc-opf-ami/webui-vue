<template>
  <div>
    <page-section>
      <b-row>
        <b-col md="3">
          <dl>
            <dt>{{ $t('pageNetwork.linkStatus') }}</dt>
            <dd>
              {{ dataFormatter(linkStatus) }}
            </dd>
          </dl>
        </b-col>
        <b-col md="3">
          <dl>
            <dt>{{ $t('pageNetwork.speed') }}</dt>
            <dd>
              {{ dataFormatter(linkSpeed) }}
            </dd>
          </dl>
        </b-col>
      </b-row>
    </page-section>
    <page-section :section-title="$t('pageNetwork.interfaceSection')">
      <b-row>
        <b-col md="3">
          <dl>
            <dt>
              {{ $t('pageNetwork.fqdn') }}
            </dt>
            <dd>
              {{ dataFormatter(fqdn) }}
            </dd>
          </dl>
        </b-col>
        <b-col md="3">
          <dl class="text-nowrap">
            <dt>
              {{ $t('pageNetwork.macAddress') }}
              <b-button
                variant="link"
                class="p-1"
                :disabled="
                  interfaceId === 'hostusb0' ||
                  !lanInterfaceStatus ||
                  isButtonDisable
                "
                @click="initMacAddressModal()"
              >
                <icon-edit
                  :title="$t('pageNetwork.modal.editMacAddressTitle')"
                />
              </b-button>
            </dt>
            <dd>
              {{ dataFormatter(ethernetData.MACAddress) }}
            </dd>
          </dl>
        </b-col>
      </b-row>
    </page-section>
  </div>
</template>

<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import IconEdit from '@carbon/icons-vue/es/edit/16';
import PageSection from '@/components/Global/PageSection';
import DataFormatterMixin from '@/components/Mixins/DataFormatterMixin';
import { mapState } from 'vuex';

export default {
  name: 'Ipv4Table',
  components: {
    IconEdit,
    PageSection,
  },
  mixins: [BVToastMixin, DataFormatterMixin],
  props: {
    tabIndex: {
      type: Number,
      default: 0,
    },
    lanInterfaceStatus: {
      type: Boolean,
      default: true,
    },
    isButtonDisable: {
      required: true,
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedInterface: '',
      linkStatus: '',
      linkSpeed: '',
      fqdn: '',
      macAddress: '',
      interfaceId: this.$store.getters['network/selectedInterfaceId'],
    };
  },
  computed: {
    ...mapState('network', ['selectedInterfaceId']),
    ethernetData() {
      return this.$store.getters['network/ethernetData'][this.tabIndex];
    },
  },
  watch: {
    // Watch for change in tab index
    tabIndex() {
      this.getSettings();
    },
    selectedInterfaceId: function (value) {
      this.interfaceId = value;
    },
  },
  created() {
    this.getSettings();
  },
  methods: {
    getSettings() {
      this.selectedInterface = this.tabIndex;
      this.linkStatus = this.ethernetData.LinkStatus;
      // Display "Unknown" when AutoNeg is true and SpeedMbps is 65535
      if (
        this.ethernetData?.AutoNeg &&
        this.ethernetData?.SpeedMbps === 65535
      ) {
        this.linkSpeed = this.$t('global.status.unknown');
      } else {
        this.linkSpeed = this.ethernetData.SpeedMbps;
      }
      this.fqdn = this.ethernetData.FQDN;
      this.macAddress = this.ethernetData.MACAddress;
    },
    initMacAddressModal() {
      this.$bvModal.show('modal-mac-address');
    },
  },
};
</script>
