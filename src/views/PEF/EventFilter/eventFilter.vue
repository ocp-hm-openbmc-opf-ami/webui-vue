<template>
  <b-container fluid="xl">
    <page-title :description="$t('pageEventFilter.pageDescription')" />
    <b-form novalidate @submit.prevent="handleSubmit">
      <div class="form-background p-3">
        <b-form-group
          class="m-0"
          :label="$t('pageEventFilter.sectionTitle')"
          label-class="sr-only"
          :disabled="loading"
        >
          <b-row>
            <b-col md="9" lg="8" xl="9">
              <b-form-group :label="$t('pageEventFilter.enableAllEvents')">
                <b-form-checkbox
                  v-model="checkAll"
                  data-test-id="checkAllEventFilter"
                  switch
                  @change="enableAllTheEvents"
                >
                  <span v-if="checkAll">{{ $t('global.status.enabled') }}</span>
                  <span v-else>{{ $t('global.status.disabled') }}</span>
                </b-form-checkbox>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="9" lg="8" xl="9">
              <b-row>
                <b-col
                  v-for="(events, $index) in alertData"
                  v-show="events.isSupported"
                  :key="$index"
                  sm="6"
                  xl="4"
                >
                  <b-form-group :label="$t(events.eventName)">
                    <b-form-checkbox
                      v-model="events.enableStatus"
                      data-test-id="alert-input-enable"
                      switch
                    >
                      <span v-if="events.enableStatus">
                        {{ $t('global.status.enabled') }}
                      </span>
                      <span v-else>{{ $t('global.status.disabled') }}</span>
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-form-group>
      </div>
      <b-row class="mt-4 mb-5">
        <b-col>
          <b-btn
            variant="primary"
            type="submit"
            data-test-id="eventFilter-button-saveSettings"
            :disabled="loading"
          >
            {{ $t('global.action.saveSettings') }}
          </b-btn>
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin, { loading } from '@/components/Mixins/LoadingBarMixin';
import PageTitle from '@/components/Global/PageTitle';

export default {
  name: 'EventFilterSettings',
  components: {
    PageTitle,
  },
  mixins: [BVToastMixin, LoadingBarMixin],
  data() {
    return {
      alertData: this.$store.getters['eventFilter/getAlertData'],
      loading,
      localCheckAll: this.$store.getters['eventFilter/getCheckAll'],
    };
  },
  computed: {
    checkAll: {
      get() {
        return this.localCheckAll;
      },
      set(newValue) {
        this.localCheckAll = newValue;
      },
    },
  },
  watch: {
    // Watch for changes in localCheckAll and update the store
    localCheckAll(newValue) {
      this.$store.commit('eventFilter/setCheckAll', newValue);
    },
  },
  created() {
    this.startLoader();
    this.$store.dispatch('eventFilter/getEventFilterData').finally(() => {
      this.endLoader();
    });
  },
  methods: {
    handleSubmit() {
      this.startLoader();
      this.$store
        .dispatch('eventFilter/setEventFilterData', this.alertData)
        .then((success) => {
          this.successToast(success);
          this.localCheckAll = this.$store.getters['eventFilter/getCheckAll'];
        })
        .catch(({ message }) => {
          this.errorToast(message);
        })
        .finally(() => {
          this.endLoader();
        });
    },
    enableAllTheEvents(checkAll) {
      this.alertData.forEach((each) => {
        each.enableStatus = checkAll;
      });
      // Update localCheckAll when all events are enabled/disabled
      this.localCheckAll = checkAll;
    },
  },
};
</script>
