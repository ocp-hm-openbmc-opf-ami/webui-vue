export const searchFilter = null;

const SearchFilterMixin = {
  methods: {
    onChangeSearchInput(searchValue) {
      this.searchFilter = searchValue;
    },
    onClearSearchInput() {
      this.searchFilter = null;
    },
    customTableFilter(row, filter) {
      if (!filter) return true;
      const searchTerm = filter.toLowerCase();
      return row._searchableText && row._searchableText.includes(searchTerm);
    },
  },
};

export default SearchFilterMixin;
