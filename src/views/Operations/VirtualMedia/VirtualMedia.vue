<template>
  <b-container fluid="xl">
    <page-title />
    <div v-if="!LicenseState(licenseName)">
      <b-alert show variant="warning"
        >{{ $t('license.licenseExpired') }}
        <a href="#/settings/license">{{
          $t('license.licensePageLink')
        }}</a></b-alert
      >
    </div>
    <div v-else>
      <div v-if="!virtualMediaAccess">
        <b-alert show variant="danger">{{
          $t('pageVirtualMedia.permissionRestricted')
        }}</b-alert>
      </div>
      <div v-if="virtualMediaAccess">
        <div v-if="!virtualMediaServiceEnabledAccess">
          <b-alert show variant="warning">{{
            $t('pageVirtualMedia.disabledVirtualMediaService')
          }}</b-alert>
        </div>
        <div v-else>
          <b-row class="mb-4">
            <b-col md="12">
              <page-section
                :section-title="
                  $t('pageVirtualMedia.virtualMediaSubTitleFirst')
                "
              >
                <div v-if="mediaAlreadyRedirected.length">
                  <b-alert show variant="warning"
                    >{{
                      $t('pageVirtualMedia.mediaAlreadyRedirected', {
                        Slot: slotString(),
                      })
                    }}
                  </b-alert>
                </div>
                <b-row>
                  <b-col
                    v-for="(dev, $index) in proxyDevices"
                    :key="$index"
                    md="6"
                  >
                    <b-form-group :label="dev.id" label-class="bold">
                      <form-file
                        v-if="!dev.isActive"
                        :id="concatId(dev.id)"
                        v-model="dev.file"
                      >
                        <template #invalid>
                          <b-form-invalid-feedback role="alert">
                            {{ $t('global.form.required') }}
                          </b-form-invalid-feedback>
                        </template>
                      </form-file>
                    </b-form-group>
                    <b-button
                      v-if="!dev.isActive"
                      variant="primary"
                      :disabled="!dev.file || isButtonDisabled"
                      @click="handleActionClick(startVM, dev)"
                    >
                      {{ $t('pageVirtualMedia.start') }}
                    </b-button>
                    <b-button
                      v-if="dev.isActive"
                      variant="primary"
                      :disabled="
                        isButtonDisabled ||
                        (dev.id == 'Slot_0'
                          ? !slot0Started
                          : dev.id == 'Slot_1'
                            ? !slot1Started
                            : !dev.file)
                      "
                      @click="handleActionClick(stopVM, dev)"
                    >
                      {{ $t('pageVirtualMedia.stop') }}
                    </b-button>
                  </b-col>
                </b-row>
              </page-section>
            </b-col>
          </b-row>
          <b-row v-if="loadImageFromExternalServer" class="mb-4">
            <b-col md="12">
              <page-section
                :section-title="
                  $t('pageVirtualMedia.virtualMediaSubTitleSecond')
                "
              >
                <b-row>
                  <b-col
                    v-for="(device, $index) in legacyDevices"
                    :key="$index"
                    md="6"
                  >
                    <b-form-group
                      :label="device.id"
                      :label-for="device.id"
                      label-class="bold"
                    >
                      <b-button
                        variant="secondary"
                        :disabled="device.isActive"
                        @click="configureConnection(device)"
                      >
                        {{ $t('pageVirtualMedia.configureConnection') }}
                      </b-button>

                      <b-button
                        v-if="!device.isActive"
                        variant="primary"
                        class="float-right"
                        :disabled="!device.serverUri || isButtonDisabled"
                        @click="handleActionClick(startLegacy, device)"
                      >
                        {{ $t('pageVirtualMedia.start') }}
                      </b-button>
                      <b-button
                        v-if="device.isActive"
                        variant="primary"
                        class="float-right"
                        :disabled="isButtonDisabled"
                        @click="handleActionClick(stopLegacy, device)"
                      >
                        {{ $t('pageVirtualMedia.stop') }}
                      </b-button>
                    </b-form-group>
                  </b-col>
                </b-row>
              </page-section>
            </b-col>
          </b-row>
          <modal-configure-connection
            :connection="modalConfigureConnection"
            @ok="saveConnection"
          />
        </div>
      </div>
    </div>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import PageSection from '@/components/Global/PageSection';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import ModalConfigureConnection from './ModalConfigureConnection';
import NbdServer from '@/utilities/NBDServer';
import FormFile from '@/components/Global/FormFile';
import { mapState } from 'vuex';

//license checking
import LicensecheckMixin from '@/components/Mixins/LicensecheckMixin';

export default {
  name: 'VirtualMedia',
  components: { PageTitle, PageSection, ModalConfigureConnection, FormFile },
  mixins: [BVToastMixin, LoadingBarMixin, LicensecheckMixin],
  data() {
    return {
      isButtonDisabled: false,
      modalConfigureConnection: null,
      loadImageFromExternalServer:
        process.env.VUE_APP_VIRTUAL_MEDIA_LIST_ENABLED === 'true'
          ? true
          : false,
      licenseName: 'MEDIA',
    };
  },
  computed: {
    ...mapState('global', ['virtualMediaServiceEnabledAccess']),
    proxyDevices() {
      return this.$store.getters['virtualMedia/proxyDevices'];
    },
    virtualMediaAccess() {
      return this.$store.getters['virtualMedia/virtualMediaAccess'];
    },
    mediaAlreadyRedirected() {
      return this.$store.getters['virtualMedia/mediaAlreadyRedirected'];
    },
    legacyDevices() {
      return this.$store.getters['virtualMedia/legacyDevices'];
    },
    vmStarted: {
      get() {
        return this.$store.getters['virtualMedia/vmStarted'];
      },
      set(newValue) {
        return newValue;
      },
    },
    slot0Started: {
      get() {
        return this.$store.getters['virtualMedia/slot0Started'];
      },
      set(newValue) {
        return newValue;
      },
    },
    slot1Started: {
      get() {
        return this.$store.getters['virtualMedia/slot1Started'];
      },
      set(newValue) {
        return newValue;
      },
    },
    legacyStarted: {
      get() {
        return this.$store.getters['virtualMedia/legacyStarted'];
      },
      set(newValue) {
        return newValue;
      },
    },
  },
  created() {
    this.$store.dispatch('global/getSystemInfo');
    this.getVirtualMedia();
    this.$root.$on('stop-vmedia', () => {
      this.proxyDevices.forEach((dev) => this.stopVM(dev));
    });
  },
  methods: {
    getVirtualMedia() {
      this.startLoader();
      this.$store
        .dispatch('virtualMedia/getData')
        .then(() => {
          this.proxyDevices.forEach((dev) => {
            if (dev.nbd && !dev.isActive) {
              this.stopVM(dev);
            }
          });
        })
        .catch(({ message }) => {
          this.errorToast(message);
        })
        .finally(() => this.endLoader());
    },
    slotString() {
      if (this.mediaAlreadyRedirected.length == 1) {
        return this.mediaAlreadyRedirected[0];
      } else return 'Slot_0 and Slot_1';
    },
    startVM(device) {
      const token = this.$store.getters['authentication/token'];
      device.nbd = new NbdServer(
        `wss://${window.location.host}${device.websocket}`,
        device.file,
        device.id,
        token,
      );
      device.nbd.socketStarted = () => {
        this.successToast(this.$t('pageVirtualMedia.toast.serverRunning'));
        if (device.id == 'Slot_0') {
          this.$store.state.virtualMedia.slot0Started = true;
          this.$store.state.virtualMedia.slot0Nbd = device.nbd;
        } else if (device.id == 'Slot_1') {
          this.$store.state.virtualMedia.slot1Started = true;
          this.$store.state.virtualMedia.slot1Nbd = device.nbd;
        }
      };
      device.nbd.errorReadingFile = () => {
        this.errorToast(this.$t('pageVirtualMedia.toast.errorReadingFile'));
        if (device.id == 'Slot_0') {
          this.$store.state.virtualMedia.slot0Started = false;
          this.$store.state.virtualMedia.slot0Nbd = null;
        } else if (device.id == 'Slot_1') {
          this.$store.state.virtualMedia.slot1Started = false;
          this.$store.state.virtualMedia.slot1Nbd = null;
        }
      };
      device.nbd.socketClosed = (code) => {
        if (code === 1000)
          this.successToast(
            this.$t('pageVirtualMedia.toast.serverClosedSuccessfully'),
          );
        else
          this.errorToast(
            this.$t('pageVirtualMedia.toast.serverClosedWithErrors'),
          );
        if (device.id == 'Slot_0') {
          this.$store.state.virtualMedia.slot0Started = false;
          this.$store.state.virtualMedia.slot0Nbd = null;
        } else if (device.id == 'Slot_1') {
          this.$store.state.virtualMedia.slot1Started = false;
          this.$store.state.virtualMedia.slot1Nbd = null;
        }
        this.getVirtualMedia();
        device.file = null;
        device.isActive = false;
        this.$store.state.virtualMedia.vmStarted = --this.vmStarted;
      };
      this.$store.state.virtualMedia.vmStarted = ++this.vmStarted;
      device.nbd.start();
      device.isActive = true;
    },
    stopVM(device) {
      if (device.nbd) {
        device.nbd.stop();
      }
    },
    startLegacy(connectionData) {
      var data = {};
      switch (connectionData.transferProtocolType) {
        case 'NFS':
          data.Image =
            'nfs://' +
            connectionData.serverUri +
            ':' +
            connectionData.imagePath;
          break;
        case 'CIFS':
          data.Image =
            'smb://' + connectionData.serverUri + connectionData.imagePath;
          break;
        case 'HTTPS':
          data.Image =
            'https://' + connectionData.serverUri + connectionData.imagePath;
          break;
      }
      data.UserName = connectionData.username;
      data.Password = connectionData.password;
      data.WriteProtected = !connectionData.isRW;
      data.TransferProtocolType = connectionData.transferProtocolType;
      data.Inserted = true;
      this.startLoader();
      this.$store
        .dispatch('virtualMedia/mountImage', {
          id: connectionData.id,
          data: data,
        })
        .then(() => {
          this.$store.state.virtualMedia.legacyStarted = ++this.legacyStarted;
          this.successToast(
            this.$t('pageVirtualMedia.toast.serverConnectionEstablished'),
          );
          connectionData.isActive = true;
        })
        .catch(() => {
          this.errorToast(this.$t('pageVirtualMedia.toast.errorMounting'));
          this.isActive = false;
        })
        .finally(() => this.endLoader());
    },
    stopLegacy(connectionData) {
      this.$store
        .dispatch('virtualMedia/unmountImage', connectionData.id)
        .then(() => {
          this.$store.state.virtualMedia.legacyStarted = --this.legacyStarted;
          this.successToast(
            this.$t('pageVirtualMedia.toast.serverClosedSuccessfully'),
          );
          connectionData.isActive = false;
          connectionData.password = '';
          connectionData.username = '';
        })
        .catch(() => {
          this.errorToast(this.$t('pageVirtualMedia.toast.errorUnmounting'));
          connectionData.password = '';
          connectionData.username = '';
        })
        .finally(() => this.endLoader());
    },
    saveConnection(connectionData) {
      this.modalConfigureConnection.serverUri = connectionData.serverUri;
      this.modalConfigureConnection.imagePath = connectionData.imagePath;
      this.modalConfigureConnection.username = connectionData.username;
      this.modalConfigureConnection.password = connectionData.password;
      this.modalConfigureConnection.isRW = connectionData.isRW;
      this.modalConfigureConnection.transferProtocolType =
        connectionData.transferProtocolType;
    },
    configureConnection(connectionData) {
      const storeData = this.$store.getters['virtualMedia/slotData'];
      const matchedElement = storeData.find(
        (element) => element.data.id === connectionData.id,
      );
      if (matchedElement) {
        Object.assign(connectionData, matchedElement.data);
      }
      connectionData.password = '';
      this.modalConfigureConnection = connectionData;
      this.$bvModal.show('configure-connection');
    },
    concatId(val) {
      return val.split(' ').join('_').toLowerCase();
    },
    handleActionClick(action, param) {
      this.disableButtonsforTime(5000);
      action(param);
    },
    disableButtonsforTime(delay) {
      this.isButtonDisabled = true;
      setTimeout(() => {
        this.isButtonDisabled = false;
      }, delay);
    },
  },
};
</script>
