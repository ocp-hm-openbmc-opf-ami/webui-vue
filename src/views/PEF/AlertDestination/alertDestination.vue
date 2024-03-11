<template>
  <b-container fluid="xl">
    <page-title :description="$t('pageAlertDestination.pageDescription')" />
    <b-btn
      variant="primary"
      data-test-id="alertDestination-button-sendTestAlert"
      @click="sendTestAlert"
    >
      {{ $t('pageAlertDestination.sendTestAlert') }}
    </b-btn>
  </b-container>
</template>

<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import PageTitle from '@/components/Global/PageTitle';

export default {
  name: 'AlertDestinationSettings',
  components: {
    PageTitle,
  },
  mixins: [BVToastMixin, LoadingBarMixin],
  methods: {
    sendTestAlert() {
      this.startLoader();
      const data = {
        Subject: 'Sample Mail',
        MailContent: 'Hi, This is just a sample mail!',
      };
      this.$store
        .dispatch('alertDestination/sendTestAlert', data)
        .then((success) => {
          this.successToast(success);
        })
        .catch(({ message }) => {
          this.errorToast(message);
        })
        .finally(() => {
          this.endLoader();
        });
    },
  },
};
</script>
