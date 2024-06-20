<template>
  <div>
    <div class="mb-2 mt-2">
      <b-dropdown variant="link" :disabled="dropdownStatus">
        <template #button-content>
          <span class="responsive-text">
            <icon-keyboard
              v-if="selectKeyboardLanguage == 'Open Soft Keyboard'"
            />
            {{ selectKeyboardLanguage }}</span
          >
        </template>
        <b-dropdown-item
          v-for="(languageName, index) in softKeyBoardLanguages"
          :key="index"
          :value="languageName"
          @click="
            changeKeyboardLanguage(languageName, 'displayObj' + languageName)
          "
        >
          {{ languageName }}
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <div v-show="showSoftKeyboard" class="closeBtnDiv">
      <button class="closeBtn" @click="closeSoftKeyboard()">
        <icon-close />
      </button>
    </div>
    <div v-show="showSoftKeyboard" class="keyboardContainer">
      <div class="simple-keyboard-main"></div>
      <div class="controlArrows">
        <div class="simple-keyboard-control"></div>
        <div class="simple-keyboard-arrows"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';
import layoutValues from './keyboardLayouts';
import IconClose from '@carbon/icons-vue/es/close/20';
import IconKeyboard from '@carbon/icons-vue/es/keyboard/20';

export default {
  name: 'KvmSoftKeyboard',
  components: { IconClose, IconKeyboard },
  data: () => ({
    ctlBtnStatus: false,
    altBtnStatus: false,
    cmdBtnStatus: false,
    capsBtnStatus: false,
    dropdownStatus: true,
    keyboard: null,
    keyboardControlPad: null,
    keyboardArrows: null,
    showSoftKeyboard: false,
    selectKeyboardLanguage: 'Open Soft Keyboard',
    softKeyBoardLanguages: [
      'English',
      'Italian',
      'Dutch',
      'French',
      'German',
      'Russian',
      'Spanish',
    ],
  }),
  mounted() {
    this.renderSoftkeyboard('displayObjEnglish');
    this.$root.$on('enable-softkeyboard-btn', () =>
      this.handleSoftkeyboardDropdown(false),
    );
    this.$root.$on('disable-softkeyboard-btn', () =>
      this.handleSoftkeyboardDropdown(true),
    );
  },
  methods: {
    handleSoftkeyboardDropdown(status) {
      this.dropdownStatus = status;
    },
    closeSoftKeyboard() {
      this.showSoftKeyboard = false;
      this.selectKeyboardLanguage = 'Open Soft Keyboard';
      this.$root.$emit('reset-keyboard-location');
    },
    changeKeyboardLanguage(name, val) {
      if (this.selectKeyboardLanguage == name) {
        this.selectKeyboardLanguage = 'Open Soft Keyboard';
        this.showSoftKeyboard = false;
      } else {
        this.showSoftKeyboard = true;
        this.selectKeyboardLanguage = name;
        this.renderSoftkeyboard(val);
      }
    },
    renderSoftkeyboard(val) {
      if (this.keyboard) {
        this.keyboard.destroy();
      }
      if (this.keyboardControlPad) {
        this.keyboardControlPad.destroy();
      }
      if (this.keyboardArrows) {
        this.keyboardArrows.destroy();
      }
      let commonKeyboardOptions = {
        onKeyPress: (button) => this.onKeyPress(button),
        theme: 'simple-keyboard hg-theme-default hg-layout-default',
        physicalKeyboardHighlight: false,
        syncInstanceInputs: true,
        mergeDisplay: true,
        debug: false,
      };
      this.keyboard = new Keyboard('.simple-keyboard-main', {
        ...commonKeyboardOptions,
        ...layoutValues.scanCodeLayoutObj,
        ...layoutValues[val],
      });
      this.keyboardControlPad = new Keyboard('.simple-keyboard-control', {
        ...commonKeyboardOptions,
        ...layoutValues.controlLayout,
        ...layoutValues.controlDisplayData,
      });
      this.keyboardArrows = new Keyboard('.simple-keyboard-arrows', {
        ...commonKeyboardOptions,
        ...layoutValues.arrowLayout,
      });
      this.retainExistingStatus();
    },
    retainExistingStatus() {
      if (this.$store.getters['kvm/getSoftKeyboardStatus'].capsKeyStatus) {
        this.keyboard.setOptions({ layoutName: 'caps' });
        this.updateKeyValues('{XK_Caps_Lock}', 'grey', true, 'capsKeyStatus');
      }
      if (this.$store.getters['kvm/getSoftKeyboardStatus'].shiftKeyStatus) {
        this.keyboard.setOptions({ layoutName: 'shift' });
        this.updateKeyValues('{XK_Shift_L}', 'grey', true, 'shiftKeyStatus');
      }
      if (this.$store.getters['kvm/getSoftKeyboardStatus'].altKeyStatus) {
        this.updateKeyValues('{XK_Alt_L}', 'grey', true, 'altKeyStatus');
      }
      if (this.$store.getters['kvm/getSoftKeyboardStatus'].ctlKeyStatus) {
        this.updateKeyValues('{XK_Control_L}', 'grey', true, 'ctlKeyStatus');
      }
      if (this.$store.getters['kvm/getSoftKeyboardStatus'].cmdKeyStatus) {
        this.updateKeyValues('{XK_Meta_L}', 'grey', true, 'cmdKeyStatus');
      }
    },
    getFormattedKeyId(button) {
      let formattedKey = button.replace('{', '').replace('}', '');
      if (button == '{space}') {
        formattedKey = 'XK_space';
      }
      if (button == '{XK_dot}') {
        formattedKey = 'XK_greater';
      }
      if (button == '{XK_left_bracket}') {
        formattedKey = 'XK_9';
      }
      if (button == '{XK_right_bracket}') {
        formattedKey = 'XK_0';
      }
      if (button.indexOf('_caps') != -1) {
        formattedKey = button.split('_caps')[0].replace('{', '');
      }
      if (button.indexOf('arrow') != -1) {
        formattedKey = layoutValues.keyMappingForArrowKeys[button];
      }
      return formattedKey;
    },
    onKeyPress(button) {
      let keyId = this.getFormattedKeyId(button);

      var keyValue = button;
      /**
       * Handling the shift and caps lock buttons
       */
      if (button === '{XK_Shift_L}' || button === '{XK_Shift_R}') {
        this.handleShift(keyId, keyValue);
      } else if (button === '{XK_Caps_Lock}') {
        this.handleCaps(keyId, keyValue);
      } else if (button === '{XK_Control_L}') {
        // handle Control button
        this.ctlBtnStatus =
          !this.$store.getters['kvm/getSoftKeyboardStatus'].ctlKeyStatus;
        this.$emit('onKeyPress', keyId, keyValue, this.ctlBtnStatus);
        if (this.ctlBtnStatus) {
          this.updateKeyValues(button, 'grey', true, 'ctlKeyStatus');
        } else {
          this.updateKeyValues(button, '', false, 'ctlKeyStatus');
        }
      } else if (button === '{XK_Alt_L}') {
        // handle alt buttom
        this.altBtnStatus =
          !this.$store.getters['kvm/getSoftKeyboardStatus'].altKeyStatus;
        this.$emit('onKeyPress', keyId, keyValue, this.altBtnStatus);
        if (this.altBtnStatus) {
          this.updateKeyValues(button, 'grey', true, 'altKeyStatus');
        } else {
          this.updateKeyValues(button, '', false, 'altKeyStatus');
        }
      } else if (button === '{XK_Meta_L}') {
        // handle command buttom
        this.cmdBtnStatus =
          !this.$store.getters['kvm/getSoftKeyboardStatus'].cmdKeyStatus;
        this.$emit('onKeyPress', keyId, keyValue, this.cmdBtnStatus);
        if (this.cmdBtnStatus) {
          this.updateKeyValues(button, 'grey', true, 'cmdKeyStatus');
        } else {
          this.updateKeyValues(button, '', false, 'cmdKeyStatus');
        }
      } else {
        /**
         * Handling all the other buttons
         */
        this.$emit('onKeyPress', keyId, keyValue, true);
        this.$emit('onKeyPress', keyId, keyValue, false);
        if (this.ctlBtnStatus) {
          this.ctlBtnStatus = false;
          this.releaseClt();
        }
        if (this.altBtnStatus) {
          this.altBtnStatus = false;
          this.releaseAlt();
        }
        if (this.cmdBtnStatus) {
          this.cmdBtnStatus = false;
          this.releaseCmd();
        }
      }
    },
    handleShift(keyId, keyValue) {
      let currentLayout = this.keyboard.options.layoutName;
      let shiftToggle = currentLayout === 'default' ? 'shift' : 'default';
      if (currentLayout == 'caps') {
        // when user click shift with caps on
        // release the caps button
        this.releaseCaps();
        shiftToggle = 'shift';
      }
      if (shiftToggle == 'shift') {
        this.$emit('onKeyPress', keyId, keyValue, true);
      } else {
        this.$emit('onKeyPress', keyId, keyValue, true);
        this.$emit('onKeyPress', keyId, keyValue, false);
      }
      this.keyboard.setOptions({ layoutName: shiftToggle });
      if (shiftToggle == 'shift') {
        this.updateKeyValues('{XK_Shift_L}', 'grey', true, 'shiftKeyStatus');
      } else {
        this.updateKeyValues('{XK_Shift_L}', '', false, 'shiftKeyStatus');
      }
      this.updateFuncBtnStatus();
    },
    handleCaps(keyId, keyValue) {
      let currentLayout = this.keyboard.options.layoutName;
      let capsToggle = currentLayout == 'caps' ? 'default' : 'caps';
      if (currentLayout == 'shift') {
        // when user click caps when the shift is enabled
        // relese the shift button
        this.releaseShift();
      }
      if (capsToggle) {
        this.$emit('onKeyPress', keyId, keyValue, true);
        this.$emit('onKeyPress', keyId, keyValue, false);
        this.keyboard.setOptions({ layoutName: capsToggle });
      }
      if (capsToggle == 'caps') {
        this.updateKeyValues('{XK_Caps_Lock}', 'grey', true, 'capsKeyStatus');
      } else {
        this.updateKeyValues('{XK_Caps_Lock}', '', false, 'capsKeyStatus');
      }
      this.releaseAlt();
      this.releaseCmd();
      this.releaseClt();
    },
    updateKeyValues(key, style, state, storeStatus) {
      if (this.keyboard?.getButtonElement(key)?.length) {
        this.keyboard.getButtonElement(key)[0].style.backgroundColor = style;
        this.keyboard.getButtonElement(key)[1].style.backgroundColor = style;
      } else {
        this.keyboard.getButtonElement(key).style.backgroundColor = style;
      }
      this.$store.commit('kvm/updateSoftKeyStatus', [state, storeStatus]);
    },
    releaseShift() {
      this.$emit('onKeyPress', 'XK_Shift_L', '{XK_Shift_L}', true);
      this.$emit('onKeyPress', 'XK_Shift_L', '{XK_Shift_L}', false);
      this.updateKeyValues('{XK_Shift_L}', '', false, 'shiftKeyStatus');
    },
    releaseCaps() {
      this.$emit('onKeyPress', 'XK_Caps_Lock', '{XK_Caps_Lock}', true);
      this.$emit('onKeyPress', 'XK_Caps_Lock', '{XK_Caps_Lock}', false);
      this.updateKeyValues('{XK_Caps_Lock}', '', false, 'capsKeyStatus');
    },
    releaseAlt() {
      this.$emit('onKeyPress', 'XK_Alt_L', '{XK_Alt_L}', false);
      this.updateKeyValues('{XK_Alt_L}', '', false, 'altKeyStatus');
    },
    releaseCmd() {
      this.$emit('onKeyPress', 'XK_Meta_L', '{XK_Meta_L}', false);
      this.updateKeyValues('{XK_Meta_L}', '', false, 'cmdKeyStatus');
    },
    releaseClt() {
      this.$emit('onKeyPress', 'XK_Control_L', '{XK_Control_L}', false);
      this.updateKeyValues('{XK_Control_L}', '', false, 'ctlKeyStatus');
    },
    updateFuncBtnStatus() {
      if (this.$store.getters['kvm/getSoftKeyboardStatus'].cmdKeyStatus) {
        this.updateKeyValues('{XK_Meta_L}', 'grey', true, 'cmdKeyStatus');
      } else {
        this.updateKeyValues('{XK_Meta_L}', '', false, 'cmdKeyStatus');
      }
      if (this.$store.getters['kvm/getSoftKeyboardStatus'].altKeyStatus) {
        this.updateKeyValues('{XK_Alt_L}', 'grey', true, 'altKeyStatus');
      } else {
        this.updateKeyValues('{XK_Alt_L}', '', false, 'altKeyStatus');
      }
      if (this.$store.getters['kvm/getSoftKeyboardStatus'].ctlKeyStatus) {
        this.updateKeyValues('{XK_Control_L}', 'grey', true, 'ctlKeyStatus');
      } else {
        this.updateKeyValues('{XK_Control_L}', '', false, 'ctlKeyStatus');
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
