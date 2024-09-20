<template>
  <div>
    <page-section>
      <b-row>
        <b-col md="6">
          <b-form-checkbox>
            {{ $t('pageRadius.enableRadiusAuthentication') }}
          </b-form-checkbox>
          <b-row>
            <b-col cols="6">
              <div class="mt-3">
                <b-form-group
                  :label="$t('pageRadius.form.serviceAddress')"
                  label-for="serviceAddress"
                >
                  <b-form-input :id="serviceAddress" :type="text" />
                </b-form-group>
                <b-form-group
                  :label="$t('pageRadius.form.port')"
                  label-for="port"
                >
                  <b-form-input :id="port" :type="text" />
                </b-form-group>
                <b-form-group
                  :label="$t('pageRadius.form.secret')"
                  label-for="secret"
                >
                  <b-form-input :id="secret" :type="text" />
                </b-form-group>
                <b-row class="mt-4 mb-5">
                  <b-col>
                    <b-btn
                      variant="primary"
                      type="submit"
                      data-test-id="videoRemoteStorage-button-saveSettings"
                      :disabled="loading"
                    >
                      {{ $t('global.action.saveSettings') }}
                    </b-btn>
                  </b-col>
                </b-row>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </page-section>
  </div>
</template>

<script>
import PageSection from '@/components/Global/PageSection';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import DataFormatterMixin from '@/components/Mixins/DataFormatterMixin';

export default {
  name: 'GeneralRadius',
  components: {
    PageSection,
  },
  mixins: [BVToastMixin, DataFormatterMixin],
  props: {
    tabIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
