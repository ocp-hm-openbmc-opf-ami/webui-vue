<template>
  <b-container fluid="xl">
    <page-title />
    <b-row>
      <b-col sm="4">
        <b-form-group :label="$t('fru.fruDevices')" label-for="fruDevices">
          <b-form-select
            id="fruChassisCollection"
            v-model="selectfruDevice"
            :options="fruDeviceOptions"
            data-test-id="fruChassisCollection-option"
            @change="fruDeviceChange"
          >
            <template #first>
              <b-form-select-option :value="null" disabled>
                {{ $t('global.form.selectAnOption') }}
              </b-form-select-option>
            </template></b-form-select
          >
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-table
          id="table-fruCollection"
          responsive="md"
          hover
          :items="getFruCollectionInfo"
          :fields="fields"
          show-empty
          :empty-text="$t('global.table.emptyMessage')"
        >
          <!-- Expand chevron icon -->
          <template #cell(expandRow)="row">
            <b-button
              variant="link"
              data-test-id="hardwareStatus-button-expandChassis"
              :title="expandRowLabel"
              class="btn-icon-only"
              @click="toggleRowDetails(row)"
            >
              <icon-chevron />
              <span class="sr-only">{{ expandRowLabel }}</span>
            </b-button>
          </template>

          <!-- Health -->
          <template #row-details="{ item }">
            <b-container fluid>
              <b-row>
                <b-col>
                  <dl v-if="item.id === $t('fru.board_Information')">
                    <dt>{{ $t('fru.boardVersion') }}:</dt>
                    <dd>
                      {{ item['Board Version'] || $t('global.action.na') }}
                    </dd>
                    <dt>{{ $t('fru.boardLanguageCode') }}:</dt>
                    <dd>
                      {{
                        item['Board language code']
                          ? $t('fru.lang_' + item['Board language code'])
                          : $t('global.action.na')
                      }}
                    </dd>
                    <dt>{{ $t('fru.boardManufacturerDate') }}:</dt>
                    <dd class="mb-2">
                      {{
                        formatFruDate(item['Board Mfg Date']) ||
                        $t('global.action.na')
                      }}
                    </dd>
                    <dt>{{ $t('fru.boardManufacturer') }}:</dt>
                    <dd class="mb-2">
                      {{ item['Board Mfg'] || $t('global.action.na') }}
                    </dd>
                    <dt>{{ $t('fru.boardProduct') }}:</dt>
                    <dd class="mb-2">
                      {{ item['Board Product'] || $t('global.action.na') }}
                    </dd>
                    <dt>{{ $t('fru.boardSerial') }}:</dt>
                    <dd class="mb-2">
                      {{ item['Board Serial'] || $t('global.action.na') }}
                    </dd>
                    <dt>{{ $t('fru.boardPartNumber') }}:</dt>
                    <dd class="mb-2">
                      {{ item['Board Part Number'] || $t('global.action.na') }}
                    </dd>
                  </dl>
                  <dl v-else>
                    <dt>{{ $t('fru.productLanguageCode') }}:</dt>
                    <dd class="mb-2">
                      {{
                        item['Product language code']
                          ? $t('fru.lang_' + item['Product language code'])
                          : $t('global.action.na')
                      }}
                    </dd>
                    <dt>{{ $t('fru.productManufacturer') }}:</dt>
                    <dd class="mb-2">
                      {{
                        item['Product Manufacturer'] || $t('global.action.na')
                      }}
                    </dd>
                    <dt>{{ $t('fru.productName') }}:</dt>
                    <dd class="mb-2">
                      {{ item['Product Name'] || $t('global.action.na') }}
                    </dd>
                    <dt>{{ $t('fru.productPartNumber') }}:</dt>
                    <dd class="mb-2">
                      {{
                        item['Product Part Number'] || $t('global.action.na')
                      }}
                    </dd>
                    <dt>{{ $t('fru.productVersion') }}:</dt>
                    <dd class="mb-2">
                      {{ item['Product Version'] || $t('global.action.na') }}
                    </dd>
                    <dt>{{ $t('fru.productSerial') }}:</dt>
                    <dd class="mb-2">
                      {{ item['Product Serial'] || $t('global.action.na') }}
                    </dd>
                  </dl>
                </b-col>
              </b-row>
            </b-container>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// import PageSection from '@/components/Global/PageSection';
import PageTitle from '@/components/Global/PageTitle';
import IconChevron from '@carbon/icons-vue/es/chevron--down/20';
import BVToastMixin from '@/components/Mixins/BVToastMixin';

import TableRowExpandMixin from '@/components/Mixins/TableRowExpandMixin';
import DataFormatterMixin from '@/components/Mixins/DataFormatterMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';

// import { privilegesId } from '@/store/modules/GlobalStore';

export default {
  components: { IconChevron, PageTitle },
  mixins: [
    BVToastMixin,
    TableRowExpandMixin,
    DataFormatterMixin,
    LoadingBarMixin,
  ],
  data() {
    return {
      isBusy: true,
      fields: [
        {
          key: 'expandRow',
          label: '',
          tdClass: 'table-row-expand',
        },
        {
          key: 'id',
          label: this.$t('fru.name'),
        },
      ],
      getFruCollectionInfo: [],
      selectfruDevice: null,
      fruDeviceOptions: [],
      isButtonDisable: false,
    };
  },
  created() {
    this.startLoader();
    this.$store
      .dispatch('fru/getFruDeviceInfo')
      .then(() => {
        var fruchassiaData = [];
        fruchassiaData = this.$store.getters['fru/getFruDeviceAvailable'];
        let fruOptionsVal = {};
        if (fruchassiaData.length > 0) {
          fruchassiaData.forEach((val) => {
            fruOptionsVal = {
              value: val,
              text: val['@odata.id'].split('/').pop(),
            };
            this.fruDeviceOptions.push(fruOptionsVal);
            this.selectfruDevice = this.fruDeviceOptions[0].value;
          });
          this.fruDeviceChange(this.selectfruDevice);
        }
      })
      .finally(() => {
        this.endLoader();
      })
      .catch(({ message }) => {
        this.errorToast(message);
      });
  },
  methods: {
    fruDeviceChange(value) {
      this.startLoader();
      this.getFruCollectionInfo = [];
      var listBoarddata = {};
      var listProductdata = {};
      this.$store
        .dispatch('fru/getFruCollectionInfo', value)
        .then(() => {
          const getFruinfo = this.$store.getters['fru/getFruCollectionInfo'];
          getFruinfo['FRU Device Description'].forEach((item) => {
            const itemvalue = item.split(':');
            if (itemvalue[0].trim().includes('Board')) {
              listBoarddata[itemvalue[0].trim()] = itemvalue[1]
                ? itemvalue[1].trim()
                : '';
              listBoarddata.id = this.$t('fru.board_Information');
            } else {
              listProductdata[itemvalue[0].trim()] = itemvalue[1]
                ? itemvalue[1].trim()
                : '';
              listProductdata.id = this.$t('fru.product_Information');
            }
          });
          if (Object.keys(listBoarddata).length > 1) {
            this.getFruCollectionInfo.push(listBoarddata);
          }
          if (Object.keys(listProductdata).length > 1) {
            this.getFruCollectionInfo.push(listProductdata);
          }
        })
        .finally(() => {
          this.endLoader();
        });
    },
    formatFruDate(dateStr) {
      if (!dateStr || dateStr.length < 15) return this.$t('global.action.na');
      const year = dateStr.slice(0, 4);
      const month = dateStr.slice(4, 6) - 1;
      const day = dateStr.slice(6, 8);
      const hour = dateStr.slice(9, 11);
      const minute = dateStr.slice(11, 13);
      const second = dateStr.slice(13, 15);

      const date = new Date(year, month, day, hour, minute, second);

      const pad = (n) => n.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    },
  },
};
</script>
