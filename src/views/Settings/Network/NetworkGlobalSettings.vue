<template>
  <page-section v-if="firstInterface">
    <b-row>
      <b-col md="3">
        <dl>
          <dt>
            {{ $t('pageNetwork.hostname') }}
          </dt>
          <dd style="word-break: break-all" data-test-id="host-name">
            {{ dataFormatter(firstInterface.hostname) }}
          </dd>
        </dl>
      </b-col>
      <b-col md="3">
        <dl>
          <dt>
            {{ $t('pageNetwork.enableLAN') }}
            <b-button
              variant="link"
              class="p-2"
              data-test-id="disable-lan-button"
              :disabled="isButtonDisable"
              @click="initEnableLansModal()"
            >
              <icon-edit />
            </b-button>
          </dt>
        </dl>
      </b-col>
    </b-row>
  </page-section>
</template>

<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import IconEdit from '@carbon/icons-vue/es/edit/16';
import DataFormatterMixin from '@/components/Mixins/DataFormatterMixin';
import PageSection from '@/components/Global/PageSection';
import { mapState } from 'vuex';

export default {
  name: 'GlobalNetworkSettings',
  components: { IconEdit, PageSection },
  mixins: [BVToastMixin, DataFormatterMixin],
  props: {
    isButtonDisable: {
      required: true,
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hostname: '',
    };
  },
  computed: {
    ...mapState('network', ['ethernetData']),
    firstInterface() {
      return this.$store.getters['network/globalNetworkSettings'][0];
    },
  },
  methods: {
    initSettingsModal() {
      this.$bvModal.show('modal-hostname');
    },
    initEnableLansModal() {
      this.$bvModal.show('modal-enable-lan');
    },
  },
};
</script>
