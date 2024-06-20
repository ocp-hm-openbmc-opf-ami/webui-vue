const LicenseMixin = {
  methods: {
    LicenseState(model) {
      let currentUserRoleas =
        this.$store.getters['license/getLicenseExpireData'];
      if (currentUserRoleas.length > 0 && model != undefined) {
        return currentUserRoleas.includes(model);
      }
    },
  },
};

export default LicenseMixin;
