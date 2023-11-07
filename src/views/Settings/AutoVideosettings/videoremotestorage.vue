<template>
  <div>
    <page-section>
      <b-row>
        <b-col md="6">
          <b-form-checkbox>
            {{ $t('pageVideo.VideoRemoteSettings.RecordVideotoRemoteServer') }}
          </b-form-checkbox>
          <b-row>
            <b-col cols="6">
              <div class="mt-2">
                <b-form-group
                  :label="$t('pageVideo.VideoRemoteSettings.MaximumDumps')"
                  label-for="MaximumDumps"
                >
                  <b-form-input
                    :id="MaximumDumps"
                    v-model="form.MaximumDumps"
                    disabled
                    :type="text"
                    placeholder="2"
                  />
                </b-form-group>
                <b-form-group
                  :label="
                    $t('pageVideo.VideoRemoteSettings.MaximumDurationinSec')
                  "
                  label-for="MaximumDurationinSec"
                >
                  <b-form-input
                    :id="MaximumDumps"
                    disabled
                    :type="text"
                    placeholder="20"
                  />
                </b-form-group>
                <b-form-group
                  :label="$t('pageVideo.VideoRemoteSettings.MaximumSizeinMB')"
                  label-for="MaximumSizeinMB"
                >
                  <b-form-input
                    :id="MaximumDumps"
                    disabled
                    :type="text"
                    placeholder="5"
                  />
                </b-form-group>
                <b-form-group
                  :label="$t('pageVideo.VideoRemoteSettings.ServerAddress')"
                  label-for="ServerAddress"
                >
                  <b-form-input
                    :id="MaximumDumps"
                    disabled
                    :type="text"
                    placeholder="10.0.124.75"
                  />
                </b-form-group>
                <b-form-group
                  :label="$t('pageVideo.VideoRemoteSettings.Pathinserver')"
                  label-for="Pathinserver"
                >
                  <b-form-input
                    :id="MaximumDumps"
                    disabled
                    :type="text"
                    placeholder="/home"
                  />
                </b-form-group>
                <b-form-group
                  :label="$t('pageVideo.VideoRemoteSettings.ShareType')"
                  label-for="ShareType"
                >
                  <b-form-row>
                    <b-form-radio
                      value="ShareType"
                      data-test-id="pageVideo.VideoRemoteSettings-sharetype"
                      class="mr-2"
                    >
                      {{ $t('pageVideo.VideoRemoteSettings.NFS') }}
                    </b-form-radio>
                    <b-form-radio
                      value="ShareType"
                      data-test-id="pageVideo.VideoRemoteSettings-sharetype"
                    >
                      {{ $t('pageVideo.VideoRemoteSettings.CIFS') }}
                    </b-form-radio>
                  </b-form-row>
                </b-form-group>
                <b-row class="mt-4 mb-5">
                  <b-col>
                    <b-btn
                      variant="primary"
                      type="submit"
                      data-test-id="smtp-button-saveSettings"
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
  name: 'Videoremotestorage',
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
    return {
      form: {
        MaximumDumps: '',
      },
    };
  },
  methods: {
    setFormValues(serviceType) {
      if (!serviceType) {
        serviceType = this.isActiveDirectoryEnabled
          ? this.activeDirectory
          : this.ldap;
      }
    },
  },
};
</script>
