<template>
  <b-container fluid="xl">
    <page-title :description="$t('pageAsd.pageDescription')" />
    <div class="form-background p-5">
      <b-col class="d-flex">
        <dl class="mr-3 w-10">
          <dd>
            {{ $t('pageAsd.asdServer') }}
          </dd>
        </dl>
        <b-form-checkbox
          id="asdServer"
          v-model="asdServer"
          switch
          @change="changeAsdServer"
        >
          <span v-if="asdServer">
            {{ $t('global.status.enabled') }}
          </span>
          <span v-else>{{ $t('global.status.disabled') }}</span>
        </b-form-checkbox>
      </b-col>
    </div>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';

export default {
  components: {
    PageTitle,
  },
  mixins: [LoadingBarMixin, BVToastMixin],
  computed: {
    asdServer: {
      get() {
        return this.$store.getters['asd/asdServerEnabled'];
      },
      set(newValue) {
        return newValue;
      },
    },
  },
  created() {
    this.startLoader();
    this.$store.dispatch('asd/getAsdServerStatus').finally(() => {
      this.endLoader();
    });
  },
  methods: {
    changeAsdServer(state) {
      this.$store
        .dispatch('asd/saveAsdServerStatus', state)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
  },
};
</script>
<style scoped></style>
