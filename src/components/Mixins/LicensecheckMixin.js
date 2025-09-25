import api from '@/store/api';

const LicenseMixin = {
  data() {
    return {
      licenseResponseCache: null,
      licenseEnabled: process.env.VUE_APP_ONETREE_LICENSE_ENABLED === 'true',
      validLicenses: [],
      licenseCheckComplete: false,
    };
  },
  created() {
    if (this.licenseEnabled) {
      this.fetchLicenseData();
    } else {
      this.licenseCheckComplete = true;
    }
  },
  methods: {
    LicenseState(model) {
      if (!this.licenseEnabled) {
        return true;
      }
      if (model === undefined) {
        return true;
      }
      const currentLicenses =
        this.$store.getters['license/getLicenseExpireData'];

      if (Array.isArray(currentLicenses) && currentLicenses.length > 0) {
        return currentLicenses.includes(model);
      }
      if (!this.licenseCheckComplete) {
        return true;
      }
      if (Array.isArray(this.validLicenses) && this.validLicenses.length > 0) {
        return this.validLicenses.includes(model);
      }
      return false;
    },
    fetchLicenseData() {
      if (!this.licenseEnabled) {
        return Promise.resolve();
      }
      if (this.licenseResponseCache !== null) {
        return Promise.resolve(this.licenseResponseCache);
      }

      return api
        .get('/redfish/v1/Oem/Ami/LicenseControl')
        .then((licenseControl) => {
          this.licenseResponseCache = licenseControl;

          const licenseFeature = licenseControl.data.LicenseKey.split(';');
          const validLicenses = [];

          licenseFeature?.forEach((val) => {
            const licenseVal = val.split(':');
            if (licenseVal[1] > 0) {
              const validLicenseDays =
                parseInt(
                  licenseVal[1] - licenseControl.data.ServicesUpCountDays,
                ) < 0
                  ? 0
                  : parseInt(
                      licenseVal[1] - licenseControl.data.ServicesUpCountDays,
                    );

              if (licenseVal[0] !== '' && validLicenseDays > 0) {
                validLicenses.push(licenseVal[0]);
              }
            }
          });

          this.validLicenses = validLicenses;

          this.$store.commit('license/setLicenseData', licenseControl);
          this.$store.commit('license/setLicenseExpireData', validLicenses);

          this.licenseCheckComplete = true;

          return licenseControl;
        })
        .catch((error) => {
          console.error('Error fetching license data:', error);
          this.licenseCheckComplete = true;

          if (!this.licenseEnabled) {
            this.validLicenses = [];
          }
        });
    },
  },
};

export default LicenseMixin;
