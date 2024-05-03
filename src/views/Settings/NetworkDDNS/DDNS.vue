<template>
  <b-container fluid="xl">
    <page-title></page-title>
    <ddns-settings></ddns-settings>
    <page-section v-show="ddnsEthernetData">
      <b-row>
        <b-col>
          <b-card no-body>
            <b-tabs
              active-nav-item-class="font-weight-bold"
              card
              content-class="mt-3"
            >
              <b-tab
                v-for="(data, index) in ddnsEthernetData"
                :key="data.Id"
                :title="data.Id"
                @click="getTabIndex(data.Id, index)"
              >
                <ddns-configuration :tab-index="tabIndex"></ddns-configuration>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
      </b-row>
    </page-section>
    <b-button
      v-if="hideNsupdate"
      type="submit"
      variant="primary"
      @click="doNSUpdate"
    >
      {{ $t('pageDDNSNetwork.ddnsConfiguration.doNsupdate') }}
    </b-button>
  </b-container>
</template>

<script>
import PageSection from '@/components/Global/PageSection';
import PageTitle from '@/components/Global/PageTitle';
import DdnsConfiguration from './ddnsConfiguration.vue';
import DdnsSettings from './ddnsSettings.vue';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import { mapState } from 'vuex';
export default {
  name: 'DDNSConfiguration',
  components: {
    PageSection,
    PageTitle,
    DdnsConfiguration,
    DdnsSettings,
  },
  mixins: [LoadingBarMixin, BVToastMixin],
  data() {
    return {
      tabIndex: 0,
      tabId: '',
      hideNsupdate: false,
    };
  },
  computed: {
    ...mapState('ddnsNetwork', ['ddnsEthernetData']),
  },
  created() {
    this.startLoader();
    Promise.all([
      this.$store.dispatch('ddnsNetwork/getDDNSEthernetData'),
    ]).finally(() => this.endLoader());
  },
  methods: {
    getTabIndex(id, selectedIndex) {
      this.tabIndex = selectedIndex;
      this.$store.dispatch('ddnsNetwork/setddnsSelectedTabId', id);
    },
    doNSUpdate() {
      this.startLoader();
      this.$store
        .dispatch('ddnsNetwork/nsUpdate')
        .then((success) => {
          if (success) {
            this.successToast(success);
          }
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
  },
};
</script>
