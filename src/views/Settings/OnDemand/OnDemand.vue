<template>
  <b-container fluid="xl">
    <page-title :description="$t('appPageTitle.onDemand')" default />
    <div>
      <b-form-group
        :label="$t('pageOnDemand.availableCPU')"
        label-for="table-style-variant"
      >
        <b-form-select
          id="table-style-variant"
          class="form-select"
          v-model="tableVariantState"
          :options="tableVariantOptions"
          @change="tableVariantValue"
        >
        </b-form-select>
      </b-form-group>
      <b-table
        id="table-AutonomousCrashDump"
        ref="table"
        responsive="md"
        no-select-on-click
        hover
        show-empty
        :busy="isBusy"
        :items="AllOnDemand"
        :fields="fields"
        :table-variant="tableVariantState"
      ></b-table>
    </div>
  </b-container>
</template>
<script>
import PageTitle from '@/components/Global/PageTitle';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import { mapState } from 'vuex';

export default {
  name: 'OnDemand',
  components: { PageTitle },
  mixins: [LoadingBarMixin, BVToastMixin],
  data() {
    return {
      isBusy: true,
      fields: [
        {
          key: 'Name',
          label: this.$t('pageOnDemand.table.name'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'DynamicFeature',
          label: this.$t('pageOnDemand.table.dynamicFeature'),
          tdClass: 'text-break text-wrap',
        },
        {
          key: 'MeteringFeature',
          label: this.$t('pageOnDemand.table.meteringFeature'),
          tdClass: 'text-break text-wrap',
        },
        {
          key: 'ProvisionFeature',
          label: this.$t('pageOnDemand.table.provisionFeature'),
          tdClass: 'text-break text-wrap',
        },
        {
          key: 'StateFeature',
          label: this.$t('pageOnDemand.table.stateFeature'),
          tdClass: 'text-break text-wrap',
        },
      ],
      tableVariantState: this.$t('pageOnDemand.all'),
    };
  },
  computed: {
    AllOnDemand() {
      const onDemandData = this.$store.getters['ondemand/Ondemand'];
      if (Array.isArray(onDemandData)) {
        return onDemandData.map((data) => {
          return {
            ...data,
          };
        });
      } else {
        if (onDemandData != '') {
          this.errorToast(onDemandData);
          return [];
        }
        return [];
      }
    },
    tableVariantOptions() {
      if (this.AllOnDemand.length === 0) {
        return [];
      } else {
        return this.$store.getters['ondemand/tableVariants'];
      }
    },
    ...mapState('ondemand', ['loader']),
  },
  watch: {
    loader() {
      if (this.loader) {
        this.endLoader();
      }
    },
  },
  created() {
    this.startLoader();
    this.$store
      .dispatch('ondemand/getOnDemandData')
      .finally(() => {
        this.isBusy = false;
      })
      .catch(({ message }) => this.errorToast(message));
  },
  methods: {
    tableVariantValue() {
      this.startLoader();
      if (this.tableVariantState === this.$t('pageOnDemand.all')) {
        this.$store
          .dispatch('ondemand/getOnDemandData')
          .catch(({ message }) => this.errorToast(message));
      } else {
        this.$store
          .dispatch('ondemand/updateProcessors', this.tableVariantState)
          .catch(({ message }) => this.errorToast(message))
          .finally(() => this.endLoader());
      }
    },
  },
};
</script>
<style scoped>
.form-select {
  width: auto;
}
</style>
