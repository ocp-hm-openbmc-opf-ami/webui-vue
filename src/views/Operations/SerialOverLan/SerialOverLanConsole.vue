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
      term: null,
      ws: null,
      fitAddon: null,
      cols: 80,
      rows: 25,
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
        cols: this.cols,
        rows: this.rows,
        fontSize: 15,
        fontFamily:
          'SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
      });

      const attachAddon = new AttachAddon(this.ws);
      this.term.loadAddon(attachAddon);

      this.fitAddon = new FitAddon();
      this.term.loadAddon(this.fitAddon);

      const SOL_THEME = {
        background: '#19273c',
        cursor: 'rgba(83, 146, 255, .5)',
        scrollbar: 'rgba(83, 146, 255, .5)',
      };
      this.term.setOption('theme', SOL_THEME);

      this.term.open(this.$refs.panel);
      // Force exact 80x25 dimensions
      this.term.resize(this.cols, this.rows);
      this.term.focus();

      // ONLY call resize/fit on actual window resize events
      this.resizeConsoleWindow = throttle(() => {
        this.handleWindowResize();
      }, 100);
      window.addEventListener('resize', this.resizeConsoleWindow);

      // Define key maps
      this.linuxKeyMap = [
        [8, [0x08]],
        [9, [0x09]],
        [13, [0x0d]],
        [27, [0x1b]],
        [33, [0x1b, 0x5b, 0x35, 0x7e]],
        [34, [0x1b, 0x5b, 0x36, 0x7e]],
        [35, [0x1b, 0x5b, 0x46]],
        [36, [0x1b, 0x5b, 0x48]],
        [37, [0x1b, 0x5b, 0x44]],
        [38, [0x1b, 0x5b, 0x41]],
        [39, [0x1b, 0x5b, 0x43]],
        [40, [0x1b, 0x5b, 0x42]],
        [45, [0x1b, 0x5b, 0x32, 0x7e]],
        [46, [0x1b, 0x5b, 0x33, 0x7e]],
        [112, [0x1b, 0x4f, 0x50]],
        [113, [0x1b, 0x4f, 0x51]],
        [114, [0x1b, 0x4f, 0x52]],
        [115, [0x1b, 0x4f, 0x53]],
        [116, [0x1b, 0x4f, 0x54]],
        [117, [0x1b, 0x4f, 0x55]],
        [118, [0x1b, 0x4f, 0x56]],
        [119, [0x1b, 0x4f, 0x57]],
        [120, [0x1b, 0x4f, 0x58]],
        [121, [0x1b, 0x4f, 0x59]],
        [122, [0x1b, 0x4f, 0x5a]],
        [123, [0x1b, 0x4f, 0x5b]],
      ];

      this.AsciiKeyMap = [
        [50, 0x00],
        [65, 0x01],
        [66, 0x02],
        [67, 0x03],
        [68, 0x04],
        [69, 0x05],
        [70, 0x06],
        [71, 0x07],
        [72, 0x08],
        [73, 0x09],
        [74, 0x0a],
        [75, 0x0b],
        [76, 0x0c],
        [77, 0x0d],
        [78, 0x0e],
        [79, 0x0f],
        [80, 0x10],
        [81, 0x11],
        [82, 0x12],
        [83, 0x13],
        [84, 0x14],
        [85, 0x15],
        [86, 0x16],
        [87, 0x17],
        [88, 0x18],
        [89, 0x19],
        [90, 0x1a],
        [219, 0x1b],
        [220, 0x1c],
        [221, 0x1d],
        [54, 0x1e],
        [189, 0x1f],
        [191, 0x7f],
      ];
      this.term.element.addEventListener(
        'keydown',
        (e) => {
          console.log(
            'Key press event triggered',
            e.keyCode,
            e.key,
            e.key.length,
          );
          e.stopPropagation();

          let currentKey = e.keyCode;

          // Prevent spamming control characters
          if (
            e.key.length > 1 &&
            (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) &&
            e.key !== 'Backspace'
          ) {
            return;
          }

          if (currentKey === 17 || currentKey === 16) {
            return; // Ignore pure Ctrl and Shift key presses
          }

          if (e.ctrlKey && e.shiftKey) {
            for (
              let i = this.AsciiKeyMap.length - 2;
              i < this.AsciiKeyMap.length;
              i++
            ) {
              if (currentKey === this.AsciiKeyMap[i][0]) {
                e.preventDefault();
                let encoder = String.fromCharCode(this.AsciiKeyMap[i][1]);
                this.ws.send(encoder);
                return;
              }
            }
          } else if (e.ctrlKey) {
            for (let i = 0; i < this.AsciiKeyMap.length - 2; i++) {
              if (currentKey === this.AsciiKeyMap[i][0]) {
                e.preventDefault();
                let encoder = String.fromCharCode(this.AsciiKeyMap[i][1]);
                this.ws.send(encoder);
                return;
              }
            }
          } else {
            for (let i = 0; i < this.linuxKeyMap.length; i++) {
              if (currentKey === this.linuxKeyMap[i][0]) {
                e.preventDefault();
                let encoder = '';
                for (let j = 0; j < this.linuxKeyMap[i][1].length; j++) {
                  encoder += String.fromCharCode(this.linuxKeyMap[i][1][j]);
                }
                this.ws.send(encoder);
                return;
              }
            }
            // Avoid displaying the full name of one-character keys like 'Spacebar'
            if (e.key.length !== 1) return;
            if (this.term.buffer.active.cursorX == 0) {
              this.term.write('\r\n'); //newline
            }
          }
        },
        true,
      );
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
      this.fitAddon = null;
    },
    handleWindowResize() {
      // Only handle actual window resize for content fitting
      if (this.term && this.fitAddon) {
        this.fitAddon.fit();
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
