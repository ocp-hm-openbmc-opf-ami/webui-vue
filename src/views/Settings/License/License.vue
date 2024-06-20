<template>
  <b-container fluid="xl">
    <page-title />
    <b-row class="align-items-end">
      <b-col xl="8">
        <div class="text-right mb10">
          <b-button
            variant="primary"
            class="mr10"
            :disabled="items.length <= 0"
            @click="initAddUserAlertCountLicenseModal()"
          >
            {{ $t('license.userAlertCount') }}
          </b-button>
          <b-button variant="primary" @click="initAddLicenseModal()">
            {{ $t('license.add_license_key') }}
          </b-button>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col xl="8">
        <b-table
          responsive="md"
          hover
          :fields="fields"
          :items="items"
          :empty-text="$t('global.table.emptyMessage')"
          show-empty
        >
          <template #cell(actions)="{ item }">
            <table-row-action
              v-for="(action, actionIndex) in item.actions"
              :key="actionIndex"
              :value="action.value"
              :title="action.title"
              :enabled="action.enabled"
              @click-table-action="onTableRowAction(item)"
            >
            </table-row-action>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <modal-add-license
      :modal-addlicese-success="isModalAddLicenseSuccess"
      @licenseKeyOk="onModallicenseKeyOk"
      @closeAddLicenseModal="iscloseAddLicenseModal"
    ></modal-add-license>
    <modal-add-user-alert-count-license
      :user-alert-countvalue="userAlertCountValue"
      :modal-addcount-success="isModalAddcountSuccess"
      @alertpercentageOk="onalertpercentageOk"
      @closeAddModal="iscloseAddcountModal"
    ></modal-add-user-alert-count-license>
  </b-container>
</template>
<script>
import TableRowAction from '@/components/Global/TableRowAction';
import PageTitle from '@/components/Global/PageTitle';

import LoadingBarMixin, { loading } from '@/components/Mixins/LoadingBarMixin';
import ModalAddLicense from './ModalAddLicense.vue';
import ModalAddUserAlertCountLicense from './ModalAddUserAlertCountLicense.vue';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import { mapState } from 'vuex';
export default {
  components: {
    TableRowAction,
    PageTitle,
    ModalAddLicense,
    ModalAddUserAlertCountLicense,
  },
  mixins: [LoadingBarMixin, BVToastMixin],
  data() {
    return {
      loading,
      fields: [
        {
          key: 'feature',
          label: 'Feature',
          class: 'text-center',
        },
        {
          key: 'validity',
          label: 'Validity(days)',
          class: 'text-center',
        },
        {
          key: 'ServicesUpCountDays',
          label: 'Services Up Count Days',
          class: 'text-center',
        },
        {
          key: 'uploadKeyValidity',
          label: 'User Uploaded Key(days)',
          class: 'text-center',
        },
      ],
      items: [],
      valueAllData: {},
      userAlertCountValue: 0,
      isModalAddLicenseSuccess: false,
      isModalAddcountSuccess: false,
    };
  },
  computed: {
    ...mapState('license', ['licenseData']),
  },
  watch: {
    licenseData() {
      this.initprocessdata();
    },
  },
  created() {
    this.startLoader();
    this.$store.dispatch('license/getUserAlertCount').finally(() => {
      this.endLoader();
    });
  },
  methods: {
    initAddLicenseModal() {
      this.$bvModal.show('modal-add-license');
    },
    initAddUserAlertCountLicenseModal() {
      this.$bvModal.show('modal-add-user-alert-count');
    },
    onalertpercentageOk(percentageval) {
      this.startLoader();
      this.$store
        .dispatch('license/setUserAlertCount', percentageval)
        .then((success) => {
          this.successToast(success);
          this.isModalAddcountSuccess = true;
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    initprocessdata() {
      this.valueAllData = this.$store.getters['license/getLicenseData'];
      const licenseFeature =
        this.valueAllData.data.Oem?.Ami.LicenseKey.split(';');
      this.items = [];
      licenseFeature?.forEach((val) => {
        const licenseVal = val.split(':');
        if (licenseVal[1] != undefined) {
          var validLicenseDays =
            parseInt(
              licenseVal[1] -
                this.valueAllData.data.Oem.Ami.ServicesUpCountDays,
            ) < 0
              ? 0
              : parseInt(
                  licenseVal[1] -
                    this.valueAllData.data.Oem.Ami.ServicesUpCountDays,
                );
        }
        if (licenseVal[0] != '' && licenseVal[1] != undefined) {
          const itemAdded = {
            feature: licenseVal[0],
            uploadKeyValidity: licenseVal[1],
            validity: parseInt(validLicenseDays),
            userAlertCount: this.valueAllData.data.Oem.Ami.UserAlertCount,
            ServicesUpCountDays:
              this.valueAllData.data.Oem.Ami.ServicesUpCountDays,
            GlobalLicenseValidity:
              this.valueAllData.data.Oem.Ami.GlobalLicenseValidity,
          };
          this.items.push(itemAdded);
          this.userAlertCountValue =
            this.valueAllData.data.Oem.Ami.UserAlertCount;
        }
      });
    },
    onModallicenseKeyOk(file) {
      this.fileTypeCorrect = this.getIsFileTypeCorrect(file);
      if (this.fileTypeCorrect) {
        this.addCertificate(file);
      } else {
        this.errorToast(
          this.$t('pageCertificates.alert.incorrectCertificateFileType'),
          {
            title: this.$t('pageCertificates.toast.errorAddCertificate'),
          },
        );
      }
    },
    addCertificate(file) {
      this.startLoader();
      this.$store
        .dispatch('license/uploadLicenseKey', file)
        .then((success) => {
          this.successToast(success);
          this.isModalAddLicenseSuccess = true;
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    getIsFileTypeCorrect(file) {
      const fileTypeExtension = file.name.split('.').pop();
      return fileTypeExtension === 'key';
    },
    iscloseAddcountModal(val) {
      this.isModalAddcountSuccess = val;
    },
    iscloseAddLicenseModal(val) {
      this.isModalAddLicenseSuccess = val;
    },
  },
};
</script>
<style lang="scss" scoped>
.mb10 {
  margin: 0 0 10px 0;
}
.mr10 {
  margin: 0 10px 0 0;
}
@media (max-width: 300px) {
  .mb10 {
    margin: 0 0 10px 0 !important;
  }
  .mr10 {
    margin: 0 0 10px 0 !important;
  }
}
</style>
