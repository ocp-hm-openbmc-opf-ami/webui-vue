const VuelidateMixin = {
  methods: {
    getValidationState(model) {
      const { $dirty, $error } = model;
      return $dirty ? !$error : null;
    },
    validateRange(val, min, max) {
      return /^\d+$/.test(val) && val >= min && val <= max;
    },
    //checking a value if value not come return NA
    getValidValue: function (val) {
      return val === null || val === undefined || val === '' ? 'NA' : val;
    },
  },
};

export default VuelidateMixin;
