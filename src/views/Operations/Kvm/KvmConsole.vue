<template>
  <div :class="marginClass">
    <div ref="toolbar" class="kvm-toolbar">
      <b-row class="d-flex">
        <b-col class="d-flex flex-column justify-content-end" cols="4">
          <dl class="mb-2" sm="2" md="2">
            <dt class="d-inline font-weight-bold mr-1">
              {{ $t('pageKvm.status') }}:
            </dt>
            <dd class="d-inline">
              <status-icon :status="serverStatusIcon" />
              <span class="d-none d-md-inline"> {{ serverStatus }}</span>
            </dd>
          </dl>
        </b-col>

        <b-col class="d-flex justify-content-end pr-1">
          <b-button
            v-if="isConnected"
            variant="link"
            type="button"
            @click="sendCtrlAltDel"
          >
            <icon-arrow-down />
            {{ $t('pageKvm.buttonCtrlAltDelete') }}
          </b-button>
          <b-button
            v-if="!isFullWindow"
            variant="link"
            type="button"
            @click="openConsoleWindow()"
          >
            <icon-launch />
            {{ $t('pageKvm.openNewTab') }}
          </b-button>
          <b-button
            variant="link"
            class="bootSettingsBtn"
            :disabled="buttonStatus"
            @click="openBootModal"
          >
            <icon-settings />
            {{ $t('pageKvm.bootSettings.buttonBootSettings') }}</b-button
          >
          <div v-if="isBootModalOpen" class="modal">
            <div class="modal-content">
              <span class="close" @click="closeBootModal">&times;</span>
              <h2>
                {{ $t('pageKvm.bootSettings.bootSettingsHdr') }}
              </h2>
              <b-form novalidate @submit.prevent="handleSubmit">
                <b-form-group
                  :label="$t('pageKvm.bootSettings.bootSettingsOverride')"
                  label-for="boot-option"
                  class="mb-3"
                >
                  <b-form-select
                    id="boot-option"
                    v-model="form.bootOption"
                    :disabled="bootSourceOptions.length === 0"
                    :options="bootSourceOptions"
                    @change="onChangeSelect"
                  >
                  </b-form-select>
                  <b-tooltip target="boot-option" placement="right">
                    {{ $t('pageKvm.bootSettings.bootOptionsToolTips') }}
                  </b-tooltip>
                </b-form-group>
                <b-form-checkbox
                  v-model="form.oneTimeBoot"
                  class="mb-4"
                  :disabled="
                    form.bootOption === 'None' || bootSourceOptions.length === 0
                  "
                  @change="$v.form.oneTimeBoot.$touch()"
                >
                  {{ $t('pageKvm.bootSettings.enableOneTimeBoot') }}
                </b-form-checkbox>
                <b-button variant="primary" type="submit" class="mb-3 save">
                  {{ $t('global.action.save') }}
                </b-button>
                <b-button
                  variant="secondary"
                  type="cancel"
                  class="mb-3 cancel"
                  @click="handleCancel"
                >
                  {{ $t('global.action.cancel') }}
                </b-button>
              </b-form>
            </div>
          </div>
          <div class="serverPowerBtn">
            <b-dropdown variant="link" :disabled="buttonStatus">
              <template #button-content>
                <span class="responsive-text">
                  <b-icon icon="power"></b-icon>
                  {{ $t('pageKvm.power') }}
                </span>
              </template>
              <b-dropdown-item
                v-for="(option, index) in powerDropdownOptions"
                :key="index"
                v-b-tooltip.hover.rightbottom="getTooltipText(option)"
                :value="option"
                :disabled="isDropdownItemDisabled(option)"
                @click="handleNewDropdownClick(option)"
              >
                {{ option }}
              </b-dropdown-item>
            </b-dropdown>
          </div>
          <div v-if="isSoftkeyboardSupported" class="softkeyboardBtn">
            <draggable-div-vue>
              <template slot="header">
                <div>
                  <softKeyBoard ref="softkeyboard" @onKeyPress="onKeyPress" />
                </div>
              </template>
            </draggable-div-vue>
          </div>
        </b-col>
      </b-row>
    </div>
    <div id="terminal-kvm" ref="panel" :class="terminalClass"></div>
  </div>
</template>

<script>
import AMI_RFB from './lib/amirfb';
import Keys from '@novnc/novnc/core/input/keysym';
import StatusIcon from '@/components/Global/StatusIcon';
import IconLaunch from '@carbon/icons-vue/es/launch/20';
import IconArrowDown from '@carbon/icons-vue/es/arrow--down/16';
import IconSettings from '@carbon/icons-vue/es/settings--adjust/20';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import softKeyBoard from '@/components/SoftKeyboard/softKeyboard';
import DraggableDivVue from '@/components/SoftKeyboard/draggableDiv';
import '@/components/SoftKeyboard/softKeyboard.css';
import { throttle } from 'lodash';
import { mapState } from 'vuex';

const Connecting = 0;
const Connected = 1;
const Disconnected = 2;

export default {
  name: 'KvmConsole',
  components: {
    StatusIcon,
    IconLaunch,
    IconArrowDown,
    IconSettings,
    softKeyBoard,
    DraggableDivVue,
  },
  mixins: [BVToastMixin, LoadingBarMixin],
  props: {
    isFullWindow: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isConsoleWindow: null,
      isSoftkeyboardSupported:
        process.env.VUE_APP_KVM_SOFT_KEYBOARD_SUPPORT === 'true' ? true : false,
      rfb: null,
      isConnected: false,
      terminalClass: this.isFullWindow ? 'full-window' : '',
      marginClass: this.isFullWindow ? 'margin-left-full-window' : '',
      status: Connecting,
      convasRef: null,
      resizeKvmWindow: null,
      powerDropdownStatus: false,
      powerDropdownOptions: [
        this.$t('pageKvm.powerOperation.powerOn'),
        this.$t('pageKvm.powerOperation.gracefulShutdown'),
        this.$t('pageKvm.powerOperation.gracefulRestart'),
        this.$t('pageKvm.powerOperation.forcedShutdown'),
        this.$t('pageKvm.powerOperation.forcedRestart'),
      ],
      buttonStatus: true,
      isBootModalOpen: false,
      form: {
        bootOption: this.$store.getters['serverBootSettings/bootSource'],
        oneTimeBoot: this.$store.getters['serverBootSettings/overrideEnabled'],
      },
    };
  },
  computed: {
    ...mapState('authentication', ['consoleWindow']),
    ...mapState('serverBootSettings', [
      'bootSourceOptions',
      'bootSource',
      'overrideEnabled',
      'tpmEnabled',
    ]),
    serverStatusIcon() {
      if (this.status === Connected) {
        return 'success';
      } else if (this.status === Disconnected) {
        return 'danger';
      }
      return 'secondary';
    },
    powerStatus() {
      return this.$store.getters['controls/serverStatus'];
    },
    serverStatus() {
      if (this.status === Connected) {
        this.$root.$emit('enable-softkeyboard-btn');
        this.$root.$emit('enable-button');
        this.updatePowerActionDropDown(this.powerStatus);
        return this.$t('pageKvm.connected');
      } else if (this.status === Disconnected) {
        this.$root.$emit('disable-softkeyboard-btn');
        this.$root.$emit('disable-button');
        this.updatePowerActionDropDown(this.powerStatus);
        return this.$t('pageKvm.disconnected');
      } else if (this.getKvmActiveData()) {
        this.$root.$emit('disable-softkeyboard-btn');
        this.$root.$emit('disable-button');
        this.updatePowerActionDropDown(this.powerStatus);
        return this.$t('pageKvm.alreadyInMasterSession');
      }
      this.$root.$emit('disable-softkeyboard-btn');
      this.$root.$emit('disable-button');
      return this.$t('pageKvm.connecting');
    },
  },
  watch: {
    consoleWindow() {
      if (this.consoleWindow == false) this.isConsoleWindow.close();
    },
    bootSource: function (value) {
      this.form.bootOption = value;
    },
    overrideEnabled: function (value) {
      this.form.oneTimeBoot = value;
    },
  },
  validations: {
    // Empty validations to leverage vuelidate form states
    // to check for changed values
    form: {
      bootOption: {},
      oneTimeBoot: {},
    },
  },
  created() {
    this.startLoader();
    const bootSettingsPromise = new Promise((resolve) => {
      this.$root.$on('server-power-operations-boot-settings-complete', () =>
        resolve(),
      );
    });
    Promise.all([
      this.$store.dispatch('serverBootSettings/getBootSettings'),
      this.$store.dispatch('controls/getLastPowerOperationTime'),
      bootSettingsPromise,
    ]).finally(() => this.endLoader());
    this.$store.dispatch('controls/getLastPowerOperationTime');
    this.$store.dispatch('global/getSystemInfo');
    window.addEventListener('beforeunload', this.handleChildWindowBeforeUnload);
  },
  mounted() {
    setTimeout(() => {
      this.$store
        .dispatch('kvm/getData')
        .then(() => {
          if (this.getKvmActiveData()) {
            this.errorToast(this.$t('pageKvm.alreadyActiveSession'));
          } else {
            this.openTerminal();
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorToast(this.$t('pageKvm.errorInGettingActiveStatus'));
        })
        .finally(() => {
          this.endLoader();
        });
    }, 500);

    this.$root.$on('enable-button', () => this.handleButtonStatus(false));
    this.$root.$on('disable-button', () => this.handleButtonStatus(true));
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeKvmWindow);
    window.removeEventListener(
      'beforeunload',
      this.handleChildWindowBeforeUnload,
    );
    this.closeTerminal();
  },
  methods: {
    sendCtrlAltDel() {
      this.rfb.sendCtrlAltDel();
    },
    closeTerminal() {
      this.rfb.disconnect();
      this.rfb = null;
    },
    getKvmActiveData() {
      let kvmData = this.$store.getters['kvm/getKvmActiveStatus'];
      return kvmData;
    },
    openTerminal() {
      const token = this.$store.getters['authentication/token'];
      this.rfb = new AMI_RFB(
        this.$refs.panel,
        `wss://${window.location.host}/kvm/0`,
        { wsProtocols: [token] },
      );

      this.rfb.scaleViewport = true;
      this.rfb.clipViewport = true;
      const that = this;

      this.resizeKvmWindow = throttle(() => {
        setTimeout(that.setWidthToolbar, 0);
      }, 1000);
      window.addEventListener('resize', this.resizeKvmWindow);

      this.rfb.addEventListener('connect', () => {
        that.isConnected = true;
        that.status = Connected;
        that.setWidthToolbar();
      });

      this.rfb.addEventListener('disconnect', () => {
        this.isConnected = false;
        that.status = Disconnected;
      });
    },
    setWidthToolbar() {
      if (
        this.$refs.panel.children &&
        this.$refs.panel.children.length > 0 &&
        this.$refs.panel.children[0].children.length > 0
      ) {
        this.$refs.toolbar.style.width =
          this.$refs.panel.children[0].children[0].clientWidth - 10 + 'px';
      }
    },
    openConsoleWindow() {
      // If isConsoleWindow is not null
      // Check the newly opened window is closed or not
      if (this.isConsoleWindow) {
        // If window is not closed set focus to new window
        // If window is closed, do open new window
        if (!this.isConsoleWindow.closed) {
          this.isConsoleWindow.focus();
          return;
        } else {
          this.openNewWindow();
        }
      } else {
        // If isConsoleWindow is null, open new window
        this.openNewWindow();
      }
    },
    openNewWindow() {
      if (this.rfb != null) {
        this.closeTerminal();
        // close the softkeyboard if kvm is opening in new window
        const softkeyboardComponent = this.$refs.softkeyboard;
        if (softkeyboardComponent) {
          softkeyboardComponent.closeSoftKeyboard();
        }
      }
      this.isConsoleWindow = window.open(
        '#/console/kvm',
        'kvmConsoleWindow',
        'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=700,height=550',
      );
      this.$store.commit('kvm/setIsConsoleWindow', {
        isconsolewindowOpen: this.isConsoleWindow,
      });
    },
    handleChildWindowBeforeUnload() {
      if (this.isConsoleWindow && !this.isConsoleWindow.closed) {
        this.isConsoleWindow.close();
      }
    },
    onKeyPress(keyId, keyValue, status) {
      if (this.rfb) {
        this.rfb.sendKey(Keys[keyId], keyValue, status);
      }
    },

    // Handle dropdown keys for enable and disable dropdown items
    isDropdownItemDisabled(option) {
      let isDisabled = this.powerDropdownStatus !== 'on';

      // If the dropdown status is 'on', enable all options except 'Power ON'
      if (this.powerDropdownStatus === 'on') {
        isDisabled = option === this.$t('pageKvm.powerOperation.powerOn');
      }
      // If the dropdown status is 'off', disable all options except 'Power ON'
      else if (this.powerDropdownStatus === 'off') {
        isDisabled = option !== this.$t('pageKvm.powerOperation.powerOn');
      }
      return isDisabled;
    },

    handleButtonStatus(status) {
      this.buttonStatus = status;
    },

    openBootModal() {
      this.isBootModalOpen = true;
      this.form.bootOption =
        this.$store.getters['serverBootSettings/bootSource'];
      this.form.oneTimeBoot =
        this.$store.getters['serverBootSettings/overrideEnabled'];
    },

    closeBootModal() {
      this.isBootModalOpen = false;
    },

    handleSubmit() {
      this.startLoader();
      //const tpmPolicyChanged = this.$v.form.tpmPolicyOn.$dirty;
      let settings;
      let bootSource = this.form.bootOption;
      let overrideEnabled = this.form.oneTimeBoot;
      let tpmEnabled = null;
      tpmEnabled = this.$store.getters['serverBootSettings/tpmEnabled'];

      settings = { bootSource, overrideEnabled, tpmEnabled };
      console.log('current:', settings);
      this.$store
        .dispatch('serverBootSettings/saveSettings', settings)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => {
          this.$v.form.$reset();
          this.closeBootModal();
          this.endLoader();
        });
    },

    onChangeSelect(selectedOption) {
      this.$v.form.bootOption.$touch();
      // Disable one time boot if selected boot option is 'None'
      if (selectedOption === 'None') this.form.oneTimeBoot = false;
    },

    handleCancel() {
      this.closeBootModal();
    },

    handleNewDropdownClick(value) {
      switch (value) {
        case this.$t('pageKvm.powerOperation.powerOn'):
          this.powerOn();
          break;

        case this.$t('pageKvm.powerOperation.gracefulShutdown'):
          this.gracefulShutdown();
          break;

        case this.$t('pageKvm.powerOperation.gracefulRestart'):
          this.gracefulRestart();
          break;

        case this.$t('pageKvm.powerOperation.forcedShutdown'):
          this.forcedShutdown();
          break;

        case this.$t('pageKvm.powerOperation.forcedRestart'):
          this.forcedRestart();
          break;

        default:
          // Handle default case
          break;
      }
    },

    powerOn() {
      this.dispatchPowerAction('controls/serverPowerOn', 'on');
    },

    gracefulRestart() {
      this.dispatchPowerAction('controls/serverSoftReboot', 'on');
    },

    forcedRestart() {
      this.dispatchPowerAction('controls/serverHardReboot', 'on');
    },

    gracefulShutdown() {
      this.dispatchPowerAction('controls/serverSoftPowerOff', 'on');
    },

    forcedShutdown() {
      this.dispatchPowerAction('controls/serverHardPowerOff', 'off');
    },

    dispatchPowerAction(action, dropdownValue) {
      this.$store
        .dispatch(action, 'kvm')
        .then((message) => {
          this.updatePowerActionDropDown(dropdownValue);
          this.successToast(message);
        })
        .catch(({ message }) => this.errorToast(message));
    },

    updatePowerActionDropDown(value) {
      if (value === 'on') {
        this.powerDropdownStatus = 'on';
      } else if (value === 'off') {
        this.powerDropdownStatus = 'off';
      } else if (value === 'disable') {
        this.powerDropdownStatus = 'disable';
      }
    },

    //tooltip for dropdown items
    getTooltipText(option) {
      // Check if the option is disabled
      const isDisabled = this.isDropdownItemDisabled(option);

      // If the option is disabled, return a generic tooltip
      if (isDisabled) {
        return '';
      }
      // If the option is enabled, return the specific tooltip text
      switch (option) {
        case this.$t('pageKvm.powerOperation.powerOn'):
          return this.$t('pageKvm.powerOnTooltip');
        case this.$t('pageKvm.powerOperation.gracefulShutdown'):
          return this.$t('pageKvm.gracefulShutdownTooltip');
        case this.$t('pageKvm.powerOperation.gracefulRestart'):
          return this.$t('pageKvm.gracefulRestartTooltip');
        case this.$t('pageKvm.powerOperation.forcedShutdown'):
          return this.$t('pageKvm.forcedShutdownTooltip');
        case this.$t('pageKvm.powerOperation.forcedRestart'):
          return this.$t('pageKvm.forcedRestartTooltip');
        default:
          return '';
      }
    },
  },
};
</script>

<style scoped lang="scss">
.button-ctrl-alt-delete {
  float: right;
}

.kvm-status {
  padding-top: $spacer / 2;
  padding-left: $spacer / 4;
  display: inline-block;
}

.margin-left-full-window {
  margin-left: 5px;
}

.softkeyboardBtn {
  z-index: 0;
  padding-bottom: 55px;
}
.serverPowerBtn {
  padding-top: 8px !important;
}
.serverPowerBtn:hover {
  background-color: #e6e6e6;
}

.bootSettingsBtn {
  padding-top: 16px !important;
}

.modal {
  display: flex;
  position: fixed;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
}

.modal-content {
  padding: 30px;
  border: 1px solid #888;
  width: 400px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 20px;
}

.close:focus {
  color: black;
  text-decoration: none;
}

.save {
  float: right;
  margin-left: 2.5px;
}

.cancel {
  float: right;
  margin-right: 2.5px;
}
</style>
