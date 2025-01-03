<template>
  <b-container fluid="xl">
    <page-title />
    <div class="form-background p-5">
      <b-row>
        <b-col class="d-flex" cols="2">
          <dl class="mr-3 w-10">
            <dd class="font_style">
              {{ $t('pageAmdRemoteDebug.yaapServer') }}
            </dd>
          </dl>
        </b-col>
        <b-col cols="10">
          <b-form-checkbox
            id="amdRemoteDebugServer"
            v-model="amdRemoteDebugServer"
            switch
            @change="changeAmdRemoteDebugServer"
          >
            <span v-if="amdRemoteDebugServer">
              {{ $t('global.status.enabled') }}
            </span>
            <span v-else>{{ $t('global.status.disabled') }}</span>
          </b-form-checkbox>
        </b-col>
      </b-row>
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
    amdRemoteDebugServer: {
      get() {
        return this.$store.getters[
          'amdRemoteDebug/amdRemoteDebugServerEnabled'
        ];
      },
      set(newValue) {
        return newValue;
      },
    },
  },
  created() {
    this.startLoader();
    this.$store
      .dispatch('amdRemoteDebug/getAmdRemoteDebugServerStatus')
      .finally(() => {
        this.endLoader();
      })
      .catch(({ message }) => {
        this.errorToast(message);
      });
  },
  methods: {
    changeAmdRemoteDebugServer(state) {
      this.startLoader();
      this.$store
        .dispatch(
          'amdRemoteDebug/saveAmdRemoteDebugServerStatus',
          state ? true : false,
        )
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
  },
};
</script>
<style scoped></style>
