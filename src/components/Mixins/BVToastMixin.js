import StatusIcon from '../Global/StatusIcon';

const BVToastMixin = {
  components: {
    StatusIcon,
  },
  data() {
    return {
      toastId: null, // Store the current toast ID
    };
  },
  methods: {
    $_BVToastMixin_createTitle(title, status) {
      const statusIcon = this.$createElement('StatusIcon', {
        props: { status },
      });
      const titleWithIcon = this.$createElement(
        'strong',
        { class: 'toast-icon' },
        [statusIcon, title]
      );
      return titleWithIcon;
    },
    $_BVToastMixin_createBody(messageBody) {
      if (Array.isArray(messageBody)) {
        return messageBody.map((message) =>
          this.$createElement('p', { class: 'mb-0' }, message)
        );
      } else {
        return [this.$createElement('p', { class: 'mb-0' }, messageBody)];
      }
    },
    $_BVToastMixin_createTimestamp() {
      const timestamp = this.$options.filters.formatTime(new Date());
      return this.$createElement('p', { class: 'mt-3 mb-0' }, timestamp);
    },
    $_BVToastMixin_createRefreshAction() {
      return this.$createElement(
        'BLink',
        {
          class: 'd-inline-block mt-3',
          on: {
            click: () => {
              this.$root.$emit('refresh-application');
            },
          },
        },
        this.$t('global.action.refresh')
      );
    },
    $_BVToastMixin_initToast(body, title, variant, id) {
      (this.toastId = id), // Store the toast ID
        this.$root.$bvToast.toast(body, {
          title,
          variant,
          autoHideDelay:
            variant === 'danger' || variant === 'info' ? 20000 : 10000,
          noAutoHide:
            variant !== 'success' && variant !== 'danger' && variant !== 'info',
          isStatus: true,
          solid: true,
          id: id, // Assign the custom ID to the toast
        });
    },
    successToast(
      message,
      {
        title: t = this.$t('global.status.success'),
        timestamp,
        refreshAction,
      } = {}
    ) {
      const body = this.$_BVToastMixin_createBody(message);
      const title = this.$_BVToastMixin_createTitle(t, 'success');
      const id = `toast-${new Date().getTime()}`; // Unique ID for the toast
      if (refreshAction) body.push(this.$_BVToastMixin_createRefreshAction());
      if (timestamp) body.push(this.$_BVToastMixin_createTimestamp());
      this.$_BVToastMixin_initToast(body, title, 'success', id);
    },
    errorToast(
      message,
      {
        title: t = this.$t('global.status.error'),
        timestamp,
        refreshAction,
      } = {}
    ) {
      const body = this.$_BVToastMixin_createBody(message);
      const title = this.$_BVToastMixin_createTitle(t, 'danger');
      const id = `toast-${new Date().getTime()}`; // Unique ID for the toast
      if (refreshAction) body.push(this.$_BVToastMixin_createRefreshAction());
      if (timestamp) body.push(this.$_BVToastMixin_createTimestamp());
      this.$_BVToastMixin_initToast(body, title, 'danger', id);
    },
    warningToast(
      message,
      {
        title: t = this.$t('global.status.warning'),
        timestamp,
        refreshAction,
      } = {}
    ) {
      const body = this.$_BVToastMixin_createBody(message);
      const title = this.$_BVToastMixin_createTitle(t, 'warning');
      const id = `toast-${new Date().getTime()}`; // Unique ID for the toast
      if (refreshAction) body.push(this.$_BVToastMixin_createRefreshAction());
      if (timestamp) body.push(this.$_BVToastMixin_createTimestamp());
      this.$_BVToastMixin_initToast(body, title, 'warning', id);
    },
    infoToast(
      message,
      {
        title: t = this.$t('global.status.informational'),
        timestamp,
        refreshAction,
      } = {}
    ) {
      const body = this.$_BVToastMixin_createBody(message);
      const title = this.$_BVToastMixin_createTitle(t, 'info');
      const id = `toast-${new Date().getTime()}`; // Unique ID for the toast
      if (refreshAction) body.push(this.$_BVToastMixin_createRefreshAction());
      if (timestamp) body.push(this.$_BVToastMixin_createTimestamp());
      this.$_BVToastMixin_initToast(body, title, 'info', id);
    },
    clearToast() {
      if (this.toastId) {
        this.$root.$bvToast.hide(this.toastId); // Hide the toast by ID
        this.toastId = null; // Clear the stored ID
      }
    },
  },
};

export default BVToastMixin;
