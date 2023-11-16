<template>
  <div>
    <page-section>
      <b-row>
        <b-col md="6">
          <b-form-checkbox>
            {{ $t('pageVideo.videoRemoteSettings.recordVideotoRemoteServer') }}
          </b-form-checkbox>
          <b-row>
            <b-col cols="6">
              <div class="mt-2">
                <b-form-group
                  :label="$t('pageVideo.videoRemoteSettings.videoRemoteMaximumDumps')"
                  label-for="videoRemoteMaximumDumps"
                >
                  <b-form-input
                    :id="videoRemoteMaximumDumps"
                    disabled
                    :type="text"
                    placeholder="2"
                  />
                </b-form-group>
                <b-form-group
                  :label="
                    $t('pageVideo.videoRemoteSettings.videoRemoteMaximumDuration')
                  "
                  label-for="videoRemoteMaximumDuration"
                >
                  <b-form-input
                    :id="videoRemoteMaximumDuration"
                    disabled
                    :type="text"
                    placeholder="20"
                  />
                </b-form-group>
                <b-form-group
                  :label="$t('pageVideo.videoRemoteSettings.videoRemoteMaximumSize')"
                  label-for="videoRemoteMaximumSize"
                >
                  <b-form-input
                    :id="videoRemoteMaximumSize"
                    disabled
                    :type="text"
                    placeholder="5"
                  />
                </b-form-group>
                <b-form-group
                  :label="$t('pageVideo.videoRemoteSettings.videoRemoteServerAddress')"
                  label-for="videoRemoteServerAddress"
                >
                  <b-form-input
                    :id="videoRemoteServerAddress"
                    disabled
                    :type="text"
                    placeholder="10.0.124.75"
                  />
                </b-form-group>
                <b-form-group
                  :label="$t('pageVideo.videoRemoteSettings.videoRemotePathInServer')"
                  label-for="videoRemotePathInServer"
                >
                  <b-form-input
                    :id="videoRemotePathInServer"
                    disabled
                    :type="text"
                    placeholder="/home"
                  />
                </b-form-group>
                <b-form-group
                  :label="$t('pageVideo.videoRemoteSettings.videoRemoteShareType')"
                  label-for="videoRemoteShareType"
                >
                  <b-form-row>
                    <b-form-radio
                      value="ShareTypeNfs"
                      data-test-id="video-videoRemoteSettings-sharetype-nfs"
                      class="mr-2"
                    >
                      {{ $t('pageVideo.videoRemoteSettings.nfs') }}
                    </b-form-radio>
                    <b-form-radio
                      value="ShareTypeCifs"
                      data-test-id="video-videoRemoteSettings-sharetype-cifs"
                    >
                      {{ $t('pageVideo.videoRemoteSettings.cifs') }}
                    </b-form-radio>
                  </b-form-row>
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
    return {};
  },
  methods: {},
};
</script>
