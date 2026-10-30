<template>
  <b-alert :show="alertDays !== null" variant="warning" class="mb-3" dismissible
    >{{ $t('license.licenseExpiryWarning', { days: alertDays }) }}
    <a href="#/settings/license">{{
      $t('license.licensePageLink')
    }}</a></b-alert
  >
</template>

<script>
import { parseLicenseAlertDays } from '@/utilities/LicenseAlert';

export default {
  name: 'LicenseExpiryAlert',
  props: {
    licenseName: {
      type: String,
      required: true,
    },
  },
  computed: {
    // Requires a parent page using LicensecheckMixin to populate
    // license/getLicenseData; alertDays stays null until then, so no banner shows.
    alertDays() {
      const licenseData = this.$store.getters['license/getLicenseData'];
      return parseLicenseAlertDays(
        licenseData?.data?.AlertMessage,
        this.licenseName,
      );
    },
  },
};
</script>
