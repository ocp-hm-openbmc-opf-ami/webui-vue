import i18n from '@/i18n';

const TableRowExpandMixin = {
  data() {
    return {
      expandRowLabel: this.getExpandRowLabel(true),
    };
  },
  methods: {
    toggleRowDetails(row) {
      row.toggleDetails();
      this.expandRowLabel = this.getExpandRowLabel(row.detailsShowing);
    },
    getExpandRowLabel(isExpanded) {
      return isExpanded
        ? i18n.t('global.table.expandTableRow')
        : i18n.t('global.table.collapseTableRow');
    },
    updateExpandRowLabel() {
      this.expandRowLabel = this.getExpandRowLabel(true);
    },
  },
  watch: {
    '$i18n.locale'() {
      this.updateExpandRowLabel();
    },
  },
};

export default TableRowExpandMixin;
