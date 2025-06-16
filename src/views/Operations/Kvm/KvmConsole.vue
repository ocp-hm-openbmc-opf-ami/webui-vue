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
            v-if="isFullWindow && !isPopup && !isConsoleWindowOpen"
            variant="link"
            type="button"
            :disabled="isButtonDisable"
            @click="openConsoleWindow()"
          >
            <icon-launch />
            {{ $t('pageKvm.openNewTab') }}
          </b-button>
          <div class="serverPowerBtn">
            <b-dropdown variant="link" :disabled="isButtonDisable">
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
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import softKeyBoard from '@/components/SoftKeyboard/softKeyboard';
import DraggableDivVue from '@/components/SoftKeyboard/draggableDiv';
import '@/components/SoftKeyboard/softKeyboard.css';
import { throttle } from 'lodash';
import { mapState } from 'vuex';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';

const Connecting = 0;
const Connected = 1;
const Disconnected = 2;

export default {
  name: 'KvmConsole',
  components: {
    StatusIcon,
    IconLaunch,
    IconArrowDown,
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
      isConsoleWindowOpen: false, // Flag to track if the console window is open
      checkConsoleWindowInterval: null, // Interval ID for checking window status
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
      MaxkvmSession: false,
      AlreadykvmLaunched: false,
    };
  },
  computed: {
    ...mapState('authentication', ['consoleWindow']),
    ...mapGetters('global', ['userPrivilege']),
    isButtonDisable() {
      return this.userPrivilege !== privilegesId.admin;
    },
    isPopup() {
      return this.$route.query.popup === 'true';
    },
    serverStatusIcon() {
      if (this.AlreadykvmLaunched == true || this.MaxkvmSession == true) {
        return 'secondary';
      }
      if (this.status === Connected) {
        return 'success';
      } else if (this.status === Disconnected) {
        this.$root.$emit('disable-softkeyboard-btn');
        return 'danger';
      }
      return 'secondary';
    },
    powerStatus() {
      return this.$store.getters['controls/serverStatus'];
    },
    serverStatus() {
      if (this.AlreadykvmLaunched == true) {
        this.errorToast(this.$t('pageKvm.alreadyKVMSession'));
        return this.$t('pageKvm.alreadyKVMSessionactive');
      }
      if (this.MaxkvmSession == true) {
        this.errorToast(this.$t('pageKvm.maximumkvmSessionReached'));
        return this.$t('pageKvm.maximumSessionReached');
      }
      if (this.status === Connected) {
        if (this.rfb._fbName.indexOf('(View Only)') == -1) {
          this.$root.$emit('enable-softkeyboard-btn');
          this.updatePowerActionDropDown(this.powerStatus);
          return this.$t('pageKvm.connected');
        }
        this.$root.$emit('disable-softkeyboard-btn');
        return this.$t('pageKvm.connected') + ' ' + this.$t('pageKvm.viewonly');
      } else if (this.status === Disconnected) {
        this.$root.$emit('disable-softkeyboard-btn');
        this.updatePowerActionDropDown(this.powerStatus);
        return this.$t('pageKvm.disconnected');
      }
      this.$root.$emit('disable-softkeyboard-btn');
      return this.$t('pageKvm.connecting');
    },
  },
  watch: {
    consoleWindow() {
      if (this.consoleWindow == false) this.isConsoleWindow.close();
    },
  },
  created() {
    this.$store.dispatch('controls/getLastPowerOperationTime');
    this.$store.dispatch('global/getSystemInfo');
    window.addEventListener('beforeunload', this.handleChildWindowBeforeUnload);
    window.addEventListener('blur', this.handleSoftKeyboardSyncedClose);
  },
  mounted() {
    // Start periodic check when component is mounted
    this.checkConsoleWindowInterval = setInterval(() => {
      if (this.isConsoleWindow) {
        if (this.isConsoleWindow.closed) {
          this.isConsoleWindowOpen = false; // Update flag if window is closed
        }
      }
    }, 1000); // Check every second
    this.openTerminal();
  },
  beforeDestroy() {
    // Clear interval to prevent memory leaks
    if (this.checkConsoleWindowInterval) {
      clearInterval(this.checkConsoleWindowInterval);
    }
    this.handleSoftKeyboardSyncedClose();
    window.removeEventListener('resize', this.resizeKvmWindow);
    window.removeEventListener(
      'beforeunload',
      this.handleChildWindowBeforeUnload,
    );
    window.removeEventListener('blur', this.handleSoftKeyboardSyncedClose);
    this.closeTerminal();
  },
  methods: {
    sendCtrlAltDel() {
      this.rfb.sendCtrlAltDel();
    },
    closeTerminal() {
      if (this.rfb) {
        this.rfb.disconnect();
        this.rfb = null;
      }
    },
    openTerminal() {
      setTimeout(() => {
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

        this.rfb.addEventListener('disconnect', (event) => {
          this.isConnected = false;
          that.status = Disconnected;
          this.MaxkvmSession =
            event.detail.clean === 'Max session' ? true : false;
          this.AlreadykvmLaunched =
            event.detail.clean === 'AlreadyKVMLaunched' ? true : false;
        });
      }, 5000);
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
      if (this.isConsoleWindow && !this.isConsoleWindow.closed) {
        this.isConsoleWindow.focus();
        return;
      }
      this.openNewWindow();
    },
    openNewWindow() {
      if (this.rfb != null) {
        this.handleSoftKeyboardSyncedClose();
        this.closeTerminal();
      }
      this.isConsoleWindow = window.open(
        '#/console/kvm?popup=true', // Added query parameter
        'kvmConsoleWindow',
        'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=700,height=550',
      );
      this.isConsoleWindowOpen = true; // Set flag to true when the window opens
      this.$store.commit('kvm/setIsConsoleWindow', {
        isconsolewindowOpen: this.isConsoleWindow,
      });
    },
    handleChildWindowBeforeUnload() {
      this.handleSoftKeyboardSyncedClose();
      if (this.isConsoleWindow && !this.isConsoleWindow.closed) {
        this.isConsoleWindow.close();
        this.isConsoleWindowOpen = false; // Reset the flag when window closes
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
          window.events.fire('powerActionServerStatus');
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
    handleSoftKeyboardSyncedClose() {
      const softkeyboardComponent = this.$refs.softkeyboard;
      if (softkeyboardComponent) {
        softkeyboardComponent.resetSoftKeyboardCapsState();
        softkeyboardComponent.closeSoftKeyboard();
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
  padding-bottom: 57px;
}
.serverPowerBtn {
  padding-top: 8px !important;
}
.serverPowerBtn:hover {
  background-color: #e6e6e6;
}
</style>
