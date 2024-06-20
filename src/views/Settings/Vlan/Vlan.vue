<template>
  <b-container fluid="xl">
    <page-title />
    <page-section v-show="tabData">
      <b-row>
        <b-col>
          <b-card no-body>
            <b-tabs
              active-nav-item-class="font-weight-bold"
              card
              content-class="mt-3"
            >
              <b-tab
                v-for="(data, index) in tabData"
                :key="data.Id"
                :title="data.Id"
                @click="getTabIndex(data.Id, index)"
              >
                <vlan-list-table :tab-id="tabId" />
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
      </b-row>
    </page-section>
  </b-container>
</template>

<script>
import LoadingBarMixin, { loading } from '@/components/Mixins/LoadingBarMixin';
import PageSection from '@/components/Global/PageSection';
import PageTitle from '@/components/Global/PageTitle';
import VlanListTable from './VlanListTable.vue';
import { mapState } from 'vuex';
export default {
  name: 'Vlan',
  components: {
    PageSection,
    PageTitle,
    VlanListTable,
  },
  mixins: [LoadingBarMixin],
  data() {
    return {
      loading,
      tabIndex: 0,
      tabId: '',
      tabData: [],
    };
  },
  computed: {
    ...mapState('vlan', ['vlanAllData']),
  },
  watch: {
    vlanAllData() {
      this.tabData = [];
      this.vlanAllData.map((data) => {
        if (data.Id.length < 5) {
          this.tabData.push(data);
        }
      });
    },
  },
  created() {
    this.startLoader();
    Promise.all([this.$store.dispatch('vlan/getEthernetData')]).finally(() =>
      this.endLoader(),
    );
  },
  methods: {
    getTabIndex(id, selectedIndex) {
      this.tabIndex = selectedIndex;
      this.tabId = id;
    },
  },
};
</script>
