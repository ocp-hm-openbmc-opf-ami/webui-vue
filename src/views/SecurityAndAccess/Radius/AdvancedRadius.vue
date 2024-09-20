<template>
  <div>
    <page-section>
      <b-row>
        <b-col md="6">
          <b-row>
            <b-col cols="6">
              <div>
                <b-form-group
                  :label="$t('pageRadius.form.administrator')"
                  label-for="administrator"
                >
                  <b-form-input :id="administrator" :type="text" />
                </b-form-group>
                <b-form-group
                  :label="$t('pageRadius.form.operator')"
                  label-for="operator"
                >
                  <b-form-input :id="operator" :type="text" />
                </b-form-group>
                <b-form-group
                  :label="$t('pageRadius.form.user')"
                  label-for="user"
                >
                  <b-form-input :id="user" :type="text" />
                </b-form-group>
                <b-form-group
                  :label="$t('pageRadius.form.oemProprietary')"
                  label-for="oemProprietary"
                >
                  <b-form-input :id="oemProprietary" :type="text" />
                </b-form-group>
                <b-form-group
                  :label="$t('pageRadius.form.noAccess')"
                  label-for="noAccess"
                >
                  <b-form-input :id="noAccess" :type="text" />
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
