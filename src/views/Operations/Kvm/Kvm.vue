<template>
  <b-container fluid="xl">
    <page-title />
    <div v-if="!kvmServiceEnabledAccess">
      <b-alert show variant="warning">{{
        $t('pageKvm.disabledKVMService')
      }}</b-alert>
    </div>
    <div v-else class="terminal-container">
      <kvm-console :is-full-window="false" />
    </div>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import KvmConsole from './KvmConsole';
import { mapState } from 'vuex';

export default {
  name: 'Kvm',
  components: { PageTitle, KvmConsole },
  computed: {
    ...mapState('global', ['kvmServiceEnabledAccess']),
  },
  created() {
    this.$store.dispatch('global/getSystemInfo');
  },
};
</script>

<style scoped>
.terminal-container {
  width: 100%;
}
</style>
