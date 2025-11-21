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
                  :disabled="isButtonDisable"
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
                      :disabled="isButtonDisable"
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
        <b-row class="mb-3">
          <b-col>
            <b-btn
              variant="primary"
              type="submit"
              data-test-id="eventFilter-button-saveSettings"
              :disabled="loading || isButtonDisable"
            >
              <icon-save />
              {{ $t('global.action.save') }}
            </b-btn>
          </b-col>
        </b-row>
        <b-row>
          <b-col xl="3">
            <b-form-group
              :label="$t('pageEventFilter.destinationType')"
              label-for="destinationType"
            >
              <b-form-select
                id="destination-type"
                v-model="destinationTypes"
                :options="destinationTypeOptions"
                :disabled="isButtonDisable"
                @change="changeDestinationType($event)"
              >
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
      </div>
    </b-form>
  </b-container>
</template>

<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin, { loading } from '@/components/Mixins/LoadingBarMixin';
import PageTitle from '@/components/Global/PageTitle';
import IconSave from '@carbon/icons-vue/es/save/20';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';

export default {
  name: 'EventFilterSettings',
  components: {
    PageTitle,
    IconSave,
  },
  mixins: [BVToastMixin, LoadingBarMixin],
  data() {
    return {
      alertData: this.$store.getters['eventFilter/getAlertData'],
      loading,
      localCheckAll: '',
      destinationTypes: '',
      destinationTypeOptions: [
        { value: 'SMTP', text: 'SMTP' },
        { value: 'SnmpTrap', text: 'SNMP Trap' },
        { value: 'Both', text: 'Both' },
      ],
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
    ...mapGetters('global', ['userPrivilege']),
    isButtonDisable() {
      return this.userPrivilege !== privilegesId.admin;
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
      this.destinationTypes =
        this.$store.getters['eventFilter/getDestinationType'];
      this.localCheckAll = this.$store.getters['eventFilter/getCheckAll'];
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
    changeDestinationType() {
      this.$store
        .dispatch('eventFilter/saveDestinationType', this.destinationTypes)
        .then((message) => {
          this.successToast(message);
        })
        .catch(({ message }) => this.errorToast(message));
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
