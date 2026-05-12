<template>
  <b-container fluid="xl">
    <page-title
      :custom-title="
        isFeatureEnabled('VUE_APP_ONETREE_PSM_ENABLED')
          ? $t('pageRebootBmc.rebootPmc')
          : $t('pageRebootBmc.rebootBmc')
      "
    />
    <b-row>
      <b-col md="8" lg="8" xl="6">
        <page-section>
          <b-row>
            <b-col>
              <dl>
                <dt>
                  {{
                    !isFeatureEnabled('VUE_APP_ONETREE_PSM_ENABLED')
                      ? $t('pageRebootBmc.lastReboot')
                      : $t('pageRebootBmc.lastRebootPmc')
                  }}
                </dt>
                <dd v-if="lastBmcRebootTime">
                  {{ lastBmcRebootTime | formatDate }}
                  {{ lastBmcRebootTime | formatTime }}
                </dd>
                <dd v-else>--</dd>
              </dl>
            </b-col>
          </b-row>
          {{
            !isFeatureEnabled('VUE_APP_ONETREE_PSM_ENABLED')
              ? $t('pageRebootBmc.rebootInformation')
              : $t('pageRebootBmc.rebootPmcInformation')
          }}
          <b-button
            variant="primary"
            class="d-block mt-5"
            data-test-id="rebootBmc-button-reboot"
            :disabled="isButtonDisable"
            @click="onClick"
          >
            <icon-reset />
            {{
              !isFeatureEnabled('VUE_APP_ONETREE_PSM_ENABLED')
                ? $t('pageRebootBmc.rebootBmc')
                : $t('pageRebootBmc.rebootPmc')
            }}
          </b-button>
        </page-section>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import PageSection from '@/components/Global/PageSection';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import FeatureMixin from '@/components/Mixins/FeatureMixin';
import IconReset from '@carbon/icons-vue/es/reset/20';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';

export default {
  name: 'RebootBmc',
  components: { PageTitle, PageSection, IconReset },
  mixins: [BVToastMixin, LoadingBarMixin, FeatureMixin],
  beforeRouteLeave(to, from, next) {
    this.hideLoader();
    next();
  },
  computed: {
    ...mapGetters('global', ['userPrivilege']),
    isButtonDisable() {
      return this.userPrivilege !== privilegesId.admin;
    },
    lastBmcRebootTime() {
      return this.$store.getters['controls/lastBmcRebootTime'];
    },
  },
  created() {
    this.startLoader();
    this.$store
      .dispatch('controls/getLastBmcRebootTime')
      .finally(() => this.endLoader());
  },
  methods: {
    onClick() {
      this.$bvModal
        .msgBoxConfirm(
          this.isFeatureEnabled('VUE_APP_ONETREE_PSM_ENABLED')
            ? this.$t('pageRebootBmc.modalPmc.confirmMessage')
            : this.$t('pageRebootBmc.modal.confirmMessage'),
          {
            title: this.isFeatureEnabled('VUE_APP_ONETREE_PSM_ENABLED')
              ? this.$t('pageRebootBmc.modalPmc.confirmTitle')
              : this.$t('pageRebootBmc.modal.confirmTitle'),
            okTitle: this.$t('global.action.confirm'),
            cancelTitle: this.$t('global.action.cancel'),
            autoFocusButton: 'ok',
          },
        )
        .then((confirmed) => {
          if (confirmed) this.rebootBmc();
        });
    },
    rebootBmc() {
      this.startLoader();
      this.$store
        .dispatch('controls/rebootBmc')
        .then((message) => {
          this.successToast(message);
          setTimeout(() => {
            this.$store.dispatch('authentication/clearCookie');
          }, 10000); // wait to load the session
        })
        .catch(({ message }) => {
          this.errorToast(message);
          this.endLoader();
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
