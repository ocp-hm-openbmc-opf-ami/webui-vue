import i18n from '@/i18n';
export const currentPage = 1;
export const perPage = 20;
const BVPaginationMixin = {
  data() {
    return {
      itemsPerPageOptions: this.getItemsPerPageOptions(),
    };
  },
  methods: {
    getTotalRowCount(count) {
      return this.perPage === 0 ? 0 : count;
    },
    getItemsPerPageOptions() {
      return [
        {
          value: 10,
          text: '10',
        },
        {
          value: 20,
          text: '20',
        },
        {
          value: 30,
          text: '30',
        },
        {
          value: 40,
          text: '40',
        },
        {
          value: 0,
          text: i18n.t('global.table.viewAll'),
        },
      ];
    },
    updateItemsPerPageOptions() {
      this.itemsPerPageOptions = this.getItemsPerPageOptions();
    },
  },
  watch: {
    '$i18n.locale'() {
      this.updateItemsPerPageOptions();
    },
  },
};

export default BVPaginationMixin;
