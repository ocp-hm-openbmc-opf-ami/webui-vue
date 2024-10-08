<template>
  <div :class="isFullWindow ? 'full-window-container' : 'terminal-container'">
    <b-row class="d-flex">
      <b-col sm="4" md="6">
        <alert
          v-if="connection ? false : true"
          variant="warning"
          :small="true"
          class="mt-4"
        >
          <p class="col-form-label">
            {{ $t('pageSerialOverLan.alert.disconnectedAlertMessage') }}
          </p>
        </alert>
      </b-col>
    </b-row>
    <b-row class="d-flex">
      <b-col class="d-flex flex-column justify-content-end">
        <dl class="mb-2" sm="6" md="6">
          <dt class="d-inline font-weight-bold mr-1">
            {{ $t('pageSerialOverLan.status') }}:
          </dt>
          <dd class="d-inline">
            <status-icon :status="serverStatusIcon" />
            {{
              connection
                ? $t('pageSerialOverLan.connected')
                : $t('pageSerialOverLan.disconnected')
            }}
          </dd>
        </dl>
      </b-col>

      <b-col v-if="!isFullWindow" class="d-flex justify-content-end">
        <b-button
          variant="link"
          type="button"
          :disabled="disable"
          @click="openConsoleWindow()"
        >
          <icon-launch />
          {{ $t('pageSerialOverLan.openNewTab') }}
        </b-button>
      </b-col>
    </b-row>
    <div id="terminal" ref="panel"></div>
  </div>
</template>

<script>
import Alert from '@/components/Global/Alert';
import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';
import { Terminal } from 'xterm';
import { throttle } from 'lodash';
import IconLaunch from '@carbon/icons-vue/es/launch/20';
import StatusIcon from '@/components/Global/StatusIcon';
import { mapState } from 'vuex';

export default {
  name: 'SerialOverLanConsole',
  components: {
    Alert,
    IconLaunch,
    StatusIcon,
  },
  props: {
    isFullWindow: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      resizeConsoleWindow: null,
      disable: false,
    };
  },
  computed: {
    ...mapState('authentication', ['consoleWindow']),
    serverStatus() {
      return this.$store.getters['global/serverStatus'];
    },
    connection() {
      return this.serverStatus === 'off' ? false : true;
    },
    serverStatusIcon() {
      return this.connection ? 'success' : 'danger';
    },
  },
  watch: {
    consoleWindow() {
      if (this.consoleWindow == false) window.isConsoleWindow.close();
    },
  },
  created() {
    this.$store.dispatch('global/getSystemInfo');
    window.addEventListener('beforeunload', this.handleChildWindowBeforeUnload);
  },
  mounted() {
    this.timeTrack();
    if (window.isConsoleWindow) {
      if (window.isConsoleWindow.closed) {
        this.openTerminal();
      } else {
        this.disable = true;
      }
    } else {
      this.openTerminal();
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeConsoleWindow);
    window.removeEventListener(
      'beforeunload',
      this.handleChildWindowBeforeUnload,
    );
    clearInterval(this.intervalId);
    this.closeTerminal();
  },
  methods: {
    openTerminal() {
      const token = this.$store.getters['authentication/token'];

      this.ws = new WebSocket(`wss://${window.location.host}/console0`, [
        token,
      ]);

      // Refer https://github.com/xtermjs/xterm.js/ for xterm implementation and addons.

      this.term = new Terminal({
        fontSize: 15,
        fontFamily:
          'SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
      });

      const attachAddon = new AttachAddon(this.ws);
      this.term.loadAddon(attachAddon);

      const fitAddon = new FitAddon();
      this.term.loadAddon(fitAddon);

      const SOL_THEME = {
        background: '#19273c',
        cursor: 'rgba(83, 146, 255, .5)',
        scrollbar: 'rgba(83, 146, 255, .5)',
      };
      this.term.setOption('theme', SOL_THEME);

      this.term.open(this.$refs.panel);
      fitAddon.fit();

      this.resizeConsoleWindow = throttle(() => {
        fitAddon.fit();
      }, 1000);
      window.addEventListener('resize', this.resizeConsoleWindow);
      this.term.onData((data) => {
        if (data.charCodeAt(0) === 127) {
          // ASCII 127 is the delete (DEL) character
          this.ws.send('\b');
        } else {
          this.term.write(data);
        }
      });
      try {
        this.ws.onopen = function () {
          console.log('websocket console0/ opened');
        };
        this.ws.onclose = function (event) {
          console.log(
            'websocket console0/ closed. code: ' +
              event.code +
              ' reason: ' +
              event.reason,
          );
        };
      } catch (error) {
        console.log(error);
      }
    },
    closeTerminal() {
      if (this.term) {
        this.term.dispose();
        this.term = null;
      }
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
    },
    openConsoleWindow() {
      // If isConsoleWindow is not null
      // Check the newly opened window is closed or not
      if (window.isConsoleWindow) {
        // If window is not closed set focus to new window
        // If window is closed, do open new window
        if (!window.isConsoleWindow.closed) {
          window.isConsoleWindow.focus();
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
      if (this.ws != null) {
        this.closeTerminal();
      }
      window.isConsoleWindow = window.open(
        '#/console/serial-over-lan-console',
        '_blank',
        'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=600,height=550',
      );
      this.timeTrack();
      this.disable = true;
    },
    handleChildWindowBeforeUnload() {
      if (window.isConsoleWindow && !window.isConsoleWindow.closed) {
        window.isConsoleWindow.close();
      }
    },
    timeTrack() {
      const intervalId = setInterval(() => {
        if (window.isConsoleWindow && window.isConsoleWindow.closed) {
          this.disable = false; // Update disable property when window is closed
          // Clear interval once disable value is false
          clearInterval(intervalId);
        }
      }, 1000); //To check open new window status every second
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~xterm/css/xterm.css';

#terminal {
  overflow: auto;
}

.full-window-container {
  width: 97%;
  margin: 1.5%;
}
</style>
