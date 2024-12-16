const VuelidateMixin = {
  methods: {
    getValidationState(model) {
      const { $dirty, $error } = model;
      return $dirty ? !$error : null;
    },
    validateRange(val, min, max) {
      return /^\d+$/.test(val) && val >= min && val <= max;
    },
  },
};

export default VuelidateMixin;
