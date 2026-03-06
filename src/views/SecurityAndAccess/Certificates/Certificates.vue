<template>
  <b-container fluid="xl">
    <page-title />
    <b-row>
      <b-col xl="11">
        <!-- Expired certificates banner -->
        <alert :show="expiredCertificateTypes.length > 0" variant="danger">
          <template v-if="expiredCertificateTypes.length > 1">
            {{ $t('pageCertificates.alert.certificatesExpiredMessage') }}
          </template>
          <template v-else>
            {{
              $t('pageCertificates.alert.certificateExpiredMessage', {
                certificate: expiredCertificateTypes[0],
              })
            }}
          </template>
        </alert>
        <!-- Expiring certificates banner -->
        <alert :show="expiringCertificateTypes.length > 0" variant="warning">
          <template v-if="expiringCertificateTypes.length > 1">
            {{ $t('pageCertificates.alert.certificatesExpiringMessage') }}
          </template>
          <template v-else>
            {{
              $t('pageCertificates.alert.certificateExpiringMessage', {
                certificate: expiringCertificateTypes[0],
              })
            }}
          </template>
        </alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col xl="11" class="text-right">
        <b-button
          v-b-modal.generate-csr
          data-test-id="certificates-button-generateCsr"
          variant="link"
          :disabled="isButtonDisable"
        >
          <icon-add />
          {{ $t('pageCertificates.generateCsr') }}
        </b-button>
        <b-button
          variant="primary"
          :disabled="certificatesForUpload.length === 0"
          @click="initModalUploadCertificate(null)"
        >
          <icon-add />
          {{ $t('pageCertificates.addNewCertificate') }}
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col xl="11">
        <b-table
          responsive="md"
          show-empty
          hover
          :busy="isBusy"
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
                    <dt>
                      {{ $t('pageCertificates.table.certificateVersion') }}:
                    </dt>
                    <dd>
                      {{ dataFormatter(item.certificateVersion) }}
                    </dd>
                  </dl>
                  <dl>
                    <dt>{{ $t('pageCertificates.table.serialNumber') }}:</dt>
                    <dd>{{ dataFormatter(item.serialNumber) }}</dd>
                  </dl>
                  <dl>
                    <dt>
                      {{ $t('pageCertificates.table.signatureAlgorithm') }}:
                    </dt>
                    <dd>
                      {{ dataFormatter(item.signatureAlgorithm) }}
                    </dd>
                  </dl>
                  <dl>
                    <dt>{{ $t('pageCertificates.table.publicKey') }}:</dt>
                    <dd>{{ dataFormatter(item.publicKey) }}</dd>
                  </dl>
                  <dl>
                    <dt>
                      {{ $t('pageCertificates.table.issuerOrganization') }}:
                    </dt>
                    <dd>{{ dataFormatter(item.issuedByOrganization) }}</dd>
                  </dl>
                  <dl>
                    <dt>
                      {{ $t('pageCertificates.table.issuerCommonName') }}:
                    </dt>
                    <dd>{{ dataFormatter(item.issuedBy) }}</dd>
                  </dl>
                  <dl>
                    <dt>
                      {{
                        $t('pageCertificates.table.issuerOrganizationalUnit')
                      }}:
                    </dt>
                    <dd>
                      {{ dataFormatter(item.issuedByOrganizationalUnit) }}
                    </dd>
                  </dl>
                  <dl>
                    <dt>{{ $t('pageCertificates.table.issuerCity') }}:</dt>
                    <dd>{{ dataFormatter(item.issuedByCity) }}</dd>
                  </dl>
                  <dl>
                    <dt>{{ $t('pageCertificates.table.issuerState') }}:</dt>
                    <dd>
                      {{ dataFormatter(item.issuedByState) }}
                    </dd>
                  </dl>
                  <dl>
                    <dt>{{ $t('pageCertificates.table.issuerCountry') }}:</dt>
                    <dd>{{ dataFormatter(item.issuedByCountry) }}</dd>
                  </dl>
                  <dl>
                    <dt>
                      {{ $t('pageCertificates.table.issuerEmailAddress') }}:
                    </dt>
                    <dd>{{ dataFormatter(item.issuerEmail) }}</dd>
                  </dl>
                </b-col>
                <b-col>
                  <dl>
                    <!-- Modified date -->
                    <dt>{{ $t('pageCertificates.table.validFrom') }}:</dt>
                    <dd v-if="item.validFrom">
                      {{ item.validFrom | formatDate }}
                      {{ item.validFrom | formatTime }}
                    </dd>
                    <dd v-else>--</dd>
                  </dl>
                  <dl>
                    <!-- Modified date -->
                    <dt>{{ $t('pageCertificates.table.validUntil') }}:</dt>
                    <dd v-if="item.validUntil">
                      {{ item.validUntil | formatDate }}
                      {{ item.validUntil | formatTime }}
                    </dd>
                    <dd v-else>--</dd>
                  </dl>
                  <dl>
                    <dt>
                      {{ $t('pageCertificates.table.issuedToOrganization') }}:
                    </dt>
                    <dd>{{ dataFormatter(item.issuedToOrganization) }}</dd>
                  </dl>
                  <dl>
                    <!-- Name -->
                    <dt>
                      {{ $t('pageCertificates.table.issuedToCommonName') }}:
                    </dt>
                    <dd>{{ dataFormatter(item.issuedTo) }}</dd>
                  </dl>
                  <dl>
                    <dt>
                      {{
                        $t('pageCertificates.table.issuedToOrganizationalUnit')
                      }}:
                    </dt>
                    <dd>
                      {{ dataFormatter(item.issuedToOrganizationalUnit) }}
                    </dd>
                  </dl>
                  <dl>
                    <dt>{{ $t('pageCertificates.table.issuedToCity') }}:</dt>
                    <dd>{{ dataFormatter(item.issuedToCity) }}</dd>
                  </dl>
                  <dl>
                    <dt>{{ $t('pageCertificates.table.issuedToState') }}:</dt>
                    <dd>
                      {{ dataFormatter(item.issuedToState) }}
                    </dd>
                  </dl>
                  <dl>
                    <dt>{{ $t('pageCertificates.table.issuedToCountry') }}:</dt>
                    <dd>{{ dataFormatter(item.issuedToCountry) }}</dd>
                  </dl>
                  <dl>
                    <dt>
                      {{ $t('pageCertificates.table.issuedToEmailAddress') }}:
                    </dt>
                    <dd>{{ dataFormatter(item.issuedToEmail) }}</dd>
                  </dl>
                </b-col>
              </b-row>
            </b-container>
          </template>
          <template #cell(validFrom)="{ value }">
            {{ value | formatDate }}
          </template>

          <template #cell(validUntil)="{ value }">
            <status-icon
              v-if="getDaysUntilExpired(value) < 31"
              :status="getIconStatus(value)"
            />
            {{ value | formatDate }}
          </template>

          <template #cell(actions)="{ value, item }">
            <table-row-action
              v-for="(action, index) in value"
              :key="index"
              :value="action.value"
              :title="action.title"
              :enabled="action.enabled"
              @click-table-action="onTableRowAction($event, item)"
            >
              <template #icon>
                <icon-replace v-if="action.value === 'replace'" />
                <icon-trashcan v-if="action.value === 'delete'" />
              </template>
            </table-row-action>
          </template>
        </b-table>
      </b-col>
    </b-row>

    <!-- Modals -->
    <modal-upload-certificate :certificate="modalCertificate" @ok="onModalOk" />
    <modal-generate-csr />
  </b-container>
</template>

<script>
import IconAdd from '@carbon/icons-vue/es/add--alt/20';
import IconReplace from '@carbon/icons-vue/es/renew/20';
import IconTrashcan from '@carbon/icons-vue/es/trash-can/20';

import ModalGenerateCsr from './ModalGenerateCsr';
import ModalUploadCertificate from './ModalUploadCertificate';
import PageTitle from '@/components/Global/PageTitle';
import TableRowAction from '@/components/Global/TableRowAction';
import StatusIcon from '@/components/Global/StatusIcon';
import Alert from '@/components/Global/Alert';

import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';
import IconChevron from '@carbon/icons-vue/es/chevron--down/20';
import TableRowExpandMixin from '@/components/Mixins/TableRowExpandMixin';
import DataFormatterMixin from '@/components/Mixins/DataFormatterMixin';

export default {
  name: 'Certificates',
  components: {
    Alert,
    IconAdd,
    IconReplace,
    IconTrashcan,
    ModalGenerateCsr,
    ModalUploadCertificate,
    PageTitle,
    StatusIcon,
    TableRowAction,
    IconChevron,
  },
  mixins: [
    BVToastMixin,
    LoadingBarMixin,
    TableRowExpandMixin,
    DataFormatterMixin,
  ],
  beforeRouteLeave(to, from, next) {
    this.hideLoader();
    next();
  },
  data() {
    return {
      isBusy: true,
      modalCertificate: null,
      fileTypeCorrect: undefined,
      fields: [
        {
          key: 'expandRow',
          label: '',
          tdClass: 'table-row-expand',
        },
        {
          key: 'certificate',
          label: this.$t('pageCertificates.table.certificate'),
        },
        {
          key: 'issuedBy',
          label: this.$t('pageCertificates.table.issuedBy'),
        },
        {
          key: 'issuedTo',
          label: this.$t('pageCertificates.table.issuedTo'),
        },
        {
          key: 'validFrom',
          label: this.$t('pageCertificates.table.validFrom'),
        },
        {
          key: 'validUntil',
          label: this.$t('pageCertificates.table.validUntil'),
        },
        {
          key: 'actions',
          label: '',
          tdClass: 'text-right text-nowrap',
        },
      ],
    };
  },
  computed: {
    ...mapGetters('global', ['userPrivilege']),
    isButtonDisable() {
      return this.userPrivilege !== privilegesId.admin;
    },
    certificates() {
      return this.$store.getters['certificates/allCertificates'];
    },
    tableItems() {
      return this.certificates.map((certificate) => {
        return {
          ...certificate,
          actions: [
            {
              value: 'replace',
              title: this.$t('pageCertificates.replaceCertificate'),
            },
            {
              value: 'delete',
              title: this.$t('pageCertificates.deleteCertificate'),
              enabled:
                certificate.type !== 'HTTPS Certificate' &&
                certificate.type !== 'ASD Certificate'
                  ? true
                  : false,
            },
          ],
        };
      });
    },
    certificatesForUpload() {
      return this.$store.getters['certificates/availableUploadTypes'];
    },
    bmcTime() {
      return this.$store.getters['global/bmcTime'];
    },
    expiredCertificateTypes() {
      return this.certificates.reduce((acc, val) => {
        const daysUntilExpired = this.getDaysUntilExpired(val.validUntil);
        if (daysUntilExpired < 1) {
          acc.push(val.certificate);
        }
        return acc;
      }, []);
    },
    expiringCertificateTypes() {
      return this.certificates.reduce((acc, val) => {
        const daysUntilExpired = this.getDaysUntilExpired(val.validUntil);
        if (daysUntilExpired < 31 && daysUntilExpired > 0) {
          acc.push(val.certificate);
        }
        return acc;
      }, []);
    },
  },
  async created() {
    this.startLoader();
    await this.$store.dispatch('global/getBmcTime');
    this.$store.dispatch('certificates/getCertificates').finally(() => {
      this.endLoader();
      this.isBusy = false;
    });
  },
  methods: {
    onTableRowAction(event, rowItem) {
      switch (event) {
        case 'replace':
          this.initModalUploadCertificate(rowItem);
          break;
        case 'delete':
          this.initModalDeleteCertificate(rowItem);
          break;
        default:
          break;
      }
    },
    initModalUploadCertificate(certificate = null) {
      this.modalCertificate = certificate;
      this.$bvModal.show('upload-certificate');
    },
    initModalDeleteCertificate(certificate) {
      this.$bvModal
        .msgBoxConfirm(
          this.$t('pageCertificates.modal.deleteConfirmMessage', {
            issuedBy: certificate.issuedBy,
            certificate: certificate.certificate,
          }),
          {
            title: this.$t('pageCertificates.deleteCertificate'),
            okTitle: this.$t('global.action.delete'),
            cancelTitle: this.$t('global.action.cancel'),
            autoFocusButton: 'ok',
          },
        )
        .then((deleteConfirmed) => {
          if (deleteConfirmed) this.deleteCertificate(certificate);
        });
    },
    onModalOk({ addNew, file, type, location }) {
      if (addNew) {
        // Upload a new certificate
        this.fileTypeCorrect = this.getIsFileTypeCorrect(file);
        if (this.fileTypeCorrect) {
          this.addNewCertificate(file, type);
        } else {
          this.errorToast(
            this.$t('pageCertificates.alert.incorrectCertificateFileType'),
            {
              title: this.$t('pageCertificates.toast.errorAddCertificate'),
            },
          );
        }
      } else {
        // Replace an existing certificate
        this.replaceCertificate(file, type, location);
      }
    },
    addNewCertificate(file, type) {
      if (this.fileTypeCorrect === true) {
        this.startLoader();
        this.$store
          .dispatch('certificates/addNewCertificate', { file, type })
          .then((success) => this.successToast(success))
          .catch(({ message }) => this.errorToast(message))
          .finally(() => this.endLoader());
      }
    },
    replaceCertificate(file, type, location) {
      this.startLoader();
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onloadend = (event) => {
        const certificateString = event.target.result;
        this.$store
          .dispatch('certificates/replaceCertificate', {
            certificateString,
            type,
            location,
          })
          .then((success) => {
            // Show special message for HTTPS Certificate
            if (type === 'HTTPS Certificate') {
              this.successToast(
                this.$t(
                  'pageCertificates.toast.successReplaceHttpsCertificate',
                ),
              );
            } else {
              this.successToast(success);
            }
          })
          .catch(({ message }) => this.errorToast(message))
          .finally(() => this.endLoader());
      };
    },
    deleteCertificate({ type, location }) {
      this.startLoader();
      this.$store
        .dispatch('certificates/deleteCertificate', {
          type,
          location,
        })
        .then((success) => this.successToast(success))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    getDaysUntilExpired(date) {
      if (this.bmcTime) {
        const validUntilMs = date.getTime();
        const currentBmcTimeMs = this.bmcTime.getTime();
        const oneDayInMs = 24 * 60 * 60 * 1000;
        return Math.round((validUntilMs - currentBmcTimeMs) / oneDayInMs);
      }
      return new Date();
    },
    getIconStatus(date) {
      const daysUntilExpired = this.getDaysUntilExpired(date);
      if (daysUntilExpired < 1) {
        return 'danger';
      } else if (daysUntilExpired < 31) {
        return 'warning';
      }
    },
    getIsFileTypeCorrect(file) {
      const fileTypeExtension = file.name.split('.').pop();
      return fileTypeExtension === 'pem';
    },
  },
};
</script>
