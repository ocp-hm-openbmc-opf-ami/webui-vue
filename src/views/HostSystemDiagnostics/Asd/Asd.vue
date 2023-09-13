<template>
  <b-container fluid="xl">
    <page-title :description="$t('pageAsd.pageDescription')" />
    <div class="form-background p-5">
      <b-row>
        <b-col class="d-flex" cols="2">
          <dl class="mr-3 w-10">
            <dd class="font_style">
              {{ $t('pageAsd.asdServer') }}
            </dd>
          </dl>
        </b-col>
        <b-col cols="10">
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
      </b-row>
      <b-row class="d-flex margin">
        <b-col class="d-flex" cols="2">
          <span class="font_style">
            {{ $t('pageAsd.TLSAuthentication') }}
          </span>
        </b-col>
        <b-col cols="10">
          <span>
            {{ firstLetterUpperCase(TLSAuthentication) }}
          </span>
        </b-col>
      </b-row>
      <b-row class="d-flex">
        <b-col cols="2">
          <span class="font_style">
            {{ $t('pageAsd.JTAGInfo') }}
          </span>
        </b-col>
        <b-col cols="10">
          <span>
            {{ JTagInformation }}
          </span>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import DataFormatterMixin from '@/components/Mixins/DataFormatterMixin';

export default {
  components: {
    PageTitle,
  },
  mixins: [LoadingBarMixin, BVToastMixin, DataFormatterMixin],
  computed: {
    asdServer: {
      get() {
        return this.$store.getters['asd/asdServerEnabled'];
      },
      set(newValue) {
        return newValue;
      },
    },
    TLSAuthentication() {
      return this.$store.getters['asd/TLSAuthentication'];
    },
    JTagInformation() {
      return this.$store.getters['asd/JTagInformation'];
    },
  },
  created() {
    this.startLoader();
    this.$store
      .dispatch('asd/getAsdServerStatus')
      .finally(() => {
        this.endLoader();
      })
      .catch(({ message }) => this.errorToast(message));
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
<style scoped>
.font_style {
  font-weight: 700;
}
.margin {
  margin-bottom: 23px;
}
</style>
