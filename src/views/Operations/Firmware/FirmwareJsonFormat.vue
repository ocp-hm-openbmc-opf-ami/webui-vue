<template>
  <div>
    <page-section class="card_overflow">
      <b-card-group deck>
        <b-card>
          <template #header>
            <p class="font-weight-bold m-0">
              {{
                $t('pageFirmware.form.updateFirmware.multiPartUploadJsonFormat')
              }}
            </p>
          </template>
          <b-row>
            <b-col sm="12">
              <dl class="mb-0">
                <dt>
                  <pre class="card_overflow_hidden">{{
                    multipartJsonContent
                  }}</pre>
                </dt>
              </dl>
            </b-col>
          </b-row>
        </b-card>
      </b-card-group>
    </page-section>
  </div>
</template>

<script>
import PageSection from '@/components/Global/PageSection';
export default {
  name: 'FirmwareJSONFormat',
  components: { PageSection },
  props: {
    multipartJsonContent: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style>
.card_overflow .card-body {
  overflow: auto;
  max-height: 177px;
  padding-right: 0px;
}
.card_overflow_hidden {
  overflow: hidden;
}
</style>
