<template>
  <b-container fluid="xl">
    <page-title />
    <page-section v-if="logicalDeviceAllData.length">
      <b-row>
        <b-col>
          <b-card no-body>
            <b-tabs
              v-model="tabIndex"
              active-nav-item-class="font-weight-bold"
              card
              content-class="mt-3"
            >
              <b-tab
                v-for="data in logicalDeviceAllData"
                :key="data.raidId"
                :title="data.logicalId"
                @click="getTabIndex(index)"
              >
                <b-table
                  responsive="md"
                  :fields="tableFields"
                  :items="data"
                  class="mb-0 text-center"
                  show-empty
                >
                  <template #cell(actions)="{ item }">
                    <table-row-action
                      v-for="(action, actionIndex) in item.actions"
                      :key="actionIndex"
                      :value="action.value"
                      :title="action.title"
                      :enabled="action.enabled"
                      @click-table-action="deleteTableRow(data.raidId, item)"
                    >
                      <template #icon>
                        <icon-trashcan v-if="action.value === 'delete'" />
                      </template>
                    </table-row-action>
                  </template>
                </b-table>
                <br />
                <b-row v-if="createButton">
                  <b-col sm="5">
                    <b-button
                      variant="primary"
                      @click="clickCreateButton(data.raidId)"
                    >
                      {{ $t('pageLogicalDevice.createLogicalDevice') }}
                    </b-button>
                  </b-col>
                </b-row>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
      </b-row>
    </page-section>
    <b-row v-else>
      <b-col sm="5">
        <span>
          <b-alert show variant="warning">{{
            $t('pageLogicalDevice.noLogicalDevice')
          }}</b-alert>
        </span>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import PageTitle from '@/components/Global/PageTitle';
import PageSection from '@/components/Global/PageSection';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import IconTrashcan from '@carbon/icons-vue/es/trash-can/20';
import TableRowAction from '@/components/Global/TableRowAction';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import { mapState } from 'vuex';
export default {
  name: 'LogicalStorage',
  components: { PageTitle, PageSection, IconTrashcan, TableRowAction },
  mixins: [LoadingBarMixin, BVToastMixin],
  data() {
    return {
      createButton: true,
      tabIndex: 0,
      actions: [
        {
          value: 'delete',
          title: this.$t('global.action.delete'),
        },
      ],
      tableFields: [
        {
          key: 'Name',
          label: this.$t('pageLogicalDevice.table.name'),
          sortable: true,
        },
        {
          key: 'RAIDType',
          label: this.$t('pageLogicalDevice.table.raidType'),
          sortable: true,
        },
        {
          key: 'StripSizeBytes',
          label: this.$t('pageLogicalDevice.table.stripSizeBytes'),
          sortable: true,
        },
        {
          key: 'ReadCachePolicy',
          label: this.$t('pageLogicalDevice.table.readCachePolicyType'),
          sortable: true,
        },
        {
          key: 'WriteCachePolicy',
          label: this.$t('pageLogicalDevice.table.writeCachePolicyType'),
          sortable: true,
        },
        {
          key: 'CapacityBytes',
          label: this.$t('pageLogicalDevice.table.capacityBytes'),
          sortable: true,
        },
        {
          key: 'NumberOfPhysicalDevices',
          label: this.$t('pageLogicalDevice.table.numberOfPhysicalDevices'),
          sortable: true,
        },
        {
          key: 'Health',
          label: this.$t('pageLogicalDevice.table.health'),
          sortable: true,
        },
        { key: 'actions', label: '', tdClass: 'text-right' },
      ],
    };
  },
  computed: {
    ...mapState('raid', [
      'logicalDeviceAllData',
      'loader',
      'logicalTab',
      'totalPhysicalCount',
      'occupiedDriveId',
    ]),
  },
  watch: {
    loader() {
      if (this.loader) {
        this.endLoader();
      }
    },
    occupiedDriveId() {
      this.createButton =
        this.totalPhysicalCount != this.occupiedDriveId[0]?.length
          ? true
          : false;
    },
    logicalDeviceAllData() {
      if (this.logicalDeviceAllData.length) {
        this.logicalDeviceAllData.forEach((logicalDeviceData) => {
          logicalDeviceData.forEach((deviceData) => {
            deviceData.Name = this.checkProperty(deviceData.Name, 'Name');
            deviceData.RAIDType = this.checkProperty(
              deviceData.RAIDType,
              'RAIDType'
            );
            deviceData.StripSizeBytes = this.checkProperty(
              deviceData.StripSizeBytes,
              'StripSizeBytes'
            );
            deviceData.ReadCachePolicy = this.checkProperty(
              deviceData.ReadCachePolicy,
              'ReadCachePolicy'
            );
            deviceData.WriteCachePolicy = this.checkProperty(
              deviceData.WriteCachePolicy,
              'WriteCachePolicy'
            );
            deviceData.CapacityBytes = this.checkProperty(
              deviceData.CapacityBytes,
              'CapacityBytes'
            );
            deviceData.NumberOfPhysicalDevices = this.checkProperty(
              deviceData.NumberOfPhysicalDevices,
              'NumberOfPhysicalDevices'
            );
            deviceData.Health = this.checkProperty(deviceData.Health, 'Health');
          });
        });
        setTimeout(() => {
          this.logicalDeviceAllData.forEach((logicalDeviceData, index) => {
            if (logicalDeviceData.raidId == this.logicalTab) {
              this.tabIndex = index;
            }
          });
        }, 1000);
      }
    },
  },
  created() {
    this.startLoader();
    this.$store.dispatch('raid/getLogicalData');
  },
  methods: {
    clickCreateButton(tabId) {
      if (tabId.indexOf('mscc') != -1)
        this.$router.push('/raid/mscc-create-logical-device');
      if (tabId.indexOf('Raid') != -1)
        this.$router.push('/raid/brcm-create-logical-device');
    },
    getTabIndex(index) {
      this.createButton =
        this.totalPhysicalCount != this.occupiedDriveId[index]?.length
          ? true
          : false;
    },
    checkProperty(obj, key) {
      if (obj) {
        if (key == 'CapacityBytes') {
          var tmp = this.checkTheBytes(obj);
          return tmp;
        }
        return obj;
      } else {
        return 'N/A';
      }
    },
    checkTheBytes(bytes) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes == 0) return '0 Bytes';
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    },
    checkStatus(data) {
      var interval = setInterval(() => {
        this.$store.dispatch('raid/checkStatus', data).then((response) => {
          if (response) {
            clearInterval(interval);
            if (response == 'SUCCESS') {
              setTimeout(() => {
                this.successToast(
                  this.$tc('pageLogicalDevice.toast.successDeleteLogicalDevice')
                );
                this.$store.dispatch('raid/getLogicalData');
              }, 15000);
            } else {
              switch (response) {
                case 'RAID_DEVICE_NOT_PRESENT':
                  return this.errorToast(
                    this.$tc(
                      'pageLogicalDevice.toast.errorRaidDeviceNotPresent'
                    )
                  );
                case 'RAID_CTRL_ID_INVALID':
                  return this.errorToast(
                    this.$tc('pageLogicalDevice.toast.errorRaidCtrlIdInvalid')
                  );
                case 'RAID_CTRL_DEVID_INVALID':
                  return this.errorToast(
                    this.$tc(
                      'pageLogicalDevice.toast.errorRaidCtrlDevIdInvalid'
                    )
                  );
                case 'RAID_NO_VIRTUAL_DEVICE_PRESENT':
                  return this.errorToast(
                    this.$tc(
                      'pageLogicalDevice.toast.errorRaidNoVirtualDevicePresent'
                    )
                  );
                case 'RAID_OPERATION_NOT_PERMITTED':
                  return this.errorToast(
                    this.$tc(
                      'pageLogicalDevice.toast.errorRaidOperationNotPermitted'
                    )
                  );
                case 'RAID_UNSUPPORTED_PHYSICAL_DEV':
                  return this.errorToast(
                    this.$tc(
                      'pageLogicalDevice.toast.errorRaidUnsupportedPhysicalDev'
                    )
                  );
                case 'RAID_UNSUPPORTED_LOGICAL_DEV':
                  return this.errorToast(
                    this.$tc(
                      'pageLogicalDevice.toast.errorRaidUnsupportedLogicalDev'
                    )
                  );
                case 'RAID_CONTROLLER_BUSY':
                  return this.errorToast(
                    this.$tc('pageLogicalDevice.toast.errorRaidControllerBusy')
                  );
                default:
                  return this.errorToast(
                    this.$tc('pageLogicalDevice.toast.errorCreateLogicalDevice')
                  );
              }
            }
          }
        });
      }, 5000);
    },
    deleteTableRow(raidId, item) {
      const lDriveId = item['@odata.id'].split('/').pop();
      this.$bvModal
        .msgBoxConfirm(
          this.$t('pageLogicalDevice.modal.deleteConfirmationMsg'),
          {
            title: this.$t('pageLogicalDevice.modal.deleteConfirmationTitle'),
            okTitle: this.$t('global.action.delete'),
            cancelTitle: this.$t('global.action.cancel'),
          }
        )
        .then((deleteConfirmed) => {
          if (deleteConfirmed) {
            this.startLoader();
            this.$store
              .dispatch('raid/deleteLogicalDevice', {
                raidId,
                lDriveId,
              })
              .then((response) => {
                if (response) {
                  this.checkStatus(response);
                } else this.endLoader();
              })
              .catch(({ message }) => {
                this.errorToast(message);
                this.endLoader();
              });
          }
        });
    },
  },
};
</script>
