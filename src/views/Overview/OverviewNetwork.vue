<template>
  <overview-card
    v-if="network"
    :title="$t('pageOverview.networkInformation')"
    :to="`/settings/network`"
  >
    <b-row class="mt-3">
      <b-col sm="6">
        <dl>
          <dt>{{ $t('pageOverview.hostName') }}</dt>
          <dd>{{ dataFormatter(network.hostname) }}</dd>
        </dl>
      </b-col>
      <b-col sm="6">
        <dl>
          <dt>{{ $t('pageOverview.linkStatus') }}</dt>
          <dd>
            {{ dataFormatter(network.linkStatus) }}
          </dd>
        </dl>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <dl>
          <dt>{{ $t('pageOverview.ipv4') }}</dt>
          <dd>
            {{ dataFormatter(network.staticAddress) }}
          </dd>
        </dl>
      </b-col>
      <b-col>
        <dl>
          <dt>{{ $t('pageOverview.dhcp') }}</dt>
          <dd>
            {{
              dataFormatter(
                network.dhcpAddress.length !== 0
                  ? network.dhcpAddress[0].Address
                  : null
              )
            }}
          </dd>
        </dl>
      </b-col>
    </b-row>
  </overview-card>
</template>

<script>
import OverviewCard from './OverviewCard';
import DataFormatterMixin from '@/components/Mixins/DataFormatterMixin';

export default {
  name: 'Network',
  components: {
    OverviewCard,
  },
  mixins: [DataFormatterMixin],
  computed: {
    network() {
      var networkData;
      var globalNetwork = this.$store.getters['network/globalNetworkSettings'];
      if (globalNetwork.length) {
        this.$store.getters['network/globalNetworkSettings'].forEach(
          (network) => {
            if (network.id == 'eth0') {
              networkData = network;
            }
          }
        );
      }
      return networkData;
    },
  },
  created() {
    this.$store.dispatch('network/getEthernetData').finally(() => {
      this.$root.$emit('overview-network-complete');
    });
  },
};
</script>
