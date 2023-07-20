<template>
  <b-container fluid="xl">
    <b-row>
      <b-col md="8" xl="6">
        <page-title></page-title>
      </b-col>
    </b-row>
    <b-form>
      <b-form-radio-group v-model="restoreOption" stacked>
        <div>
          <b-form-radio value="ResetToDefaultButKeepReservedSettings">{{
            $t('PageOperations.form.RestoreDefaultPartial')
          }}</b-form-radio>
        </div>
        <div class="mt-2">
          <b-form-radio value="ResetAll">{{
            $t('PageOperations.form.RestoreDefaultFull')
          }}</b-form-radio>
        </div>
      </b-form-radio-group>
      <div class="mt-3">
        <b-button variant="primary" @click="onRestoreToDefaults"
          >Restore</b-button
        >
      </div>
    </b-form>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
export default {
  name: 'FactoryDefault',
  components: { PageTitle },
  mixins: [LoadingBarMixin, BVToastMixin],
  data() {
    return {
      restoreOption: 'ResetAll',
    };
  },
  methods: {
    onRestoreToDefaults() {
      if (this.restoreOption === 'ResetAll') {
        this.$bvModal
          .msgBoxConfirm(
            this.$tc('PageFactoryDefault.toast.FactoryDefaultConfirmationFull'),
            {
              title: this.$tc('PageFactoryDefault.toast.title'),
              okTitle: this.$tc('PageFactoryDefault.toast.okTitle'),
              cancelTitle: this.$t('global.action.cancel'),
            }
          )
          .then((RestoreConfirmation) => {
            if (RestoreConfirmation) {
              this.$store
                .dispatch(
                  'FactoryDefault/restoreToDefaults',
                  this.restoreOption
                )
                .then((message) => {
                  this.successToast(message);
                  this.logout();
                })
                .catch(({ message }) => this.errorToast(message));
            }
          });
      } else {
        this.$bvModal
          .msgBoxConfirm(
            this.$tc(
              'PageFactoryDefault.toast.FactoryDefaultConfirmationPartial'
            ),
            {
              title: this.$tc('PageFactoryDefault.toast.title'),
              okTitle: this.$tc('PageFactoryDefault.toast.okTitle'),
              cancelTitle: this.$t('global.action.cancel'),
            }
          )
          .then((RestoreConfirmation) => {
            if (RestoreConfirmation) {
              this.$store
                .dispatch(
                  'FactoryDefault/restoreToDefaults',
                  this.restoreOption
                )
                .then((message) => {
                  this.successToast(message);
                  this.logout();
                })
                .catch(({ message }) => this.errorToast(message));
            }
          });
      }
    },
    logout() {
      this.$store.dispatch('authentication/logout');
    },
  },
};
</script>

<style></style>
