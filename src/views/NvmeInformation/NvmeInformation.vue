<template>
  <b-container fluid="xl">
    <page-title />
    <b-table
      id="table-nvme-info"
      ref="table"
      show-empty
      responsive="md"
      sort-by="id"
      :fields="fields"
      :items="tableItems"
      :empty-text="$t('global.table.emptyMessage')"
    >
      <!-- Expand chevron icon -->
      <template #cell(expandRow)="row">
        <b-button
          variant="link"
          :aria-label="expandRowLabel"
          :title="expandRowLabel"
          class="btn-icon-only"
          @click="toggleRowDetails(row)"
        >
          <icon-chevron />
        </b-button>
      </template>

      <template #row-details="{ item }">
        <b-container fluid>
          <b-row>
            <b-col>
              <dl>
                <dt>{{ $t('pageNvmeInformation.pcie0LinkSpeed') }}:</dt>
                <dd>
                  {{
                    item.PCIe_0_Link_Speed_0
                      ? item.PCIe_0_Link_Speed_0
                      : 'InActive'
                  }}
                </dd>
              </dl>
              <dl>
                <dt>{{ $t('pageNvmeInformation.pcie0LinkWidth') }}:</dt>
                <dd>
                  {{
                    item.PCIe_0_Link_Width_0
                      ? item.PCIe_0_Link_Width_0
                      : 'InActive'
                  }}
                </dd>
              </dl>
              <dl>
                <dt>{{ $t('pageNvmeInformation.port0PcieLinkActive') }}:</dt>
                <dd>
                  {{
                    item.Port_0_PCIe_Link_Active
                      ? 'PCIe Link UP'
                      : 'PCIe Link Down'
                  }}
                </dd>
              </dl>
              <dl>
                <dt>{{ $t('pageNvmeInformation.pcie1LinkSpeed') }}:</dt>
                <dd>
                  {{
                    item.PCIe_1_Link_Speed_1
                      ? item.PCIe_1_Link_Speed_1
                      : 'InActive'
                  }}
                </dd>
              </dl>
              <dl>
                <dt>{{ $t('pageNvmeInformation.port1PcieLinkActive') }}:</dt>
                <dd>
                  {{
                    item.Port_1_PCIe_Link_Active
                      ? 'PCIe Link UP'
                      : 'PCIe Link Down'
                  }}
                </dd>
              </dl>
              <dl>
                <dt>{{ $t('pageNvmeInformation.pcie1LinkWidth') }}:</dt>
                <dd>
                  {{
                    item.PCIe_1_Link_Width_1
                      ? item.PCIe_1_Link_Width_1
                      : 'InActive'
                  }}
                </dd>
              </dl>
              <dl>
                <dt>{{ $t('pageNvmeInformation.driveLifeConsumed') }}:</dt>
                <dd>
                  {{
                    item.Drive_Life_Consumed || item.Drive_Life_Consumed == 0
                      ? item.Drive_Life_Consumed + '%'
                      : 'InActive'
                  }}
                </dd>
              </dl>
            </b-col>
            <b-col>
              <dl>
                <dt>{{ $t('pageNvmeInformation.model') }}:</dt>
                <dd>{{ item.Model ? item.Model : 'InActive' }}</dd>
              </dl>
              <dl>
                <dt>{{ $t('pageNvmeInformation.serialNumber') }}:</dt>
                <dd>
                  {{ item.SerialNumber ? item.SerialNumber : 'InActive' }}
                </dd>
              </dl>
              <dl>
                <dt>{{ $t('pageNvmeInformation.nvmePowered') }}:</dt>
                <dd>{{ item.NVMe_Powered ? 'ON' : 'OFF' }}</dd>
              </dl>
              <dl>
                <dt>{{ $t('pageNvmeInformation.nvmeResetRequired') }}:</dt>
                <dd>
                  {{ item.NVMe_Reset_Required ? 'No reser required' : 'OFF' }}
                </dd>
              </dl>
              <dl>
                <dt>{{ $t('pageNvmeInformation.nvmeFunctional') }}:</dt>
                <dd>
                  {{ item.NVMe_Functional ? 'Functional' : 'Not Functional' }}
                </dd>
              </dl>
              <dl>
                <dt>{{ $t('pageNvmeInformation.partNumber') }}:</dt>
                <dd>
                  {{ item.PartNumber ? item.PartNumber : 'InActive' }}
                </dd>
              </dl>
              <dl>
                <dt>{{ $t('pageNvmeInformation.manufacturer') }}:</dt>
                <dd>
                  {{ item.Manufacturer ? item.Manufacturer : 'InActive' }}
                </dd>
              </dl>
            </b-col>
          </b-row>
        </b-container>
      </template>
    </b-table>
  </b-container>
</template>

<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import IconChevron from '@carbon/icons-vue/es/chevron--down/20';
import PageTitle from '@/components/Global/PageTitle';
import TableRowExpandMixin, {
  expandRowLabel,
} from '@/components/Mixins/TableRowExpandMixin';

export default {
  name: 'VlanListTable',
  components: {
    IconChevron,
    PageTitle,
  },
  mixins: [BVToastMixin, LoadingBarMixin, TableRowExpandMixin],
  props: {
    tabId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      tableItems: [],
      fields: [
        {
          key: 'Information',
          label: this.$t('pageNvmeInformation.nvmeSolidStateDrive'),
        },
        {
          key: 'expandRow',
          label: '',
          tdClass: 'table-row-expand',
        },
      ],
      expandRowLabel,
    };
  },
  created() {
    this.startLoader();
    this.$store
      .dispatch('nvme/getNvmeData')
      .finally(() => {
        this.tableItems = this.$store.getters['nvme/nvmeTableData'];
        this.endLoader();
      })
      .catch(({ message }) => this.errorToast(message));
  },
  methods: {},
};
</script>
<style>
.pad-right .table .b-table-details td {
  padding-right: 10px !important;
}
</style>
