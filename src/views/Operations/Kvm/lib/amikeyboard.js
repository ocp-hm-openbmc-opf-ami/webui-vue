/*
 * =======================================================
 * AMI_KEYBOARD: AMI wrapper for noVNC RFB Keyboard module
 * @Author Amlana Bhuyan <amlanab@ami.com>
 * =======================================================
 */
import KEYBOARD from '@novnc/novnc/core/input/keyboard.js';
import * as Log from '@novnc/novnc/core/util/logging';
import store from '../../../../store';

/* Uncomment to enable logging in browser debug console
 * Note:
 * 1. Enable 'verbose' log level in browser debug console to view log messages
 * 2. Do not enable this in production */
// Log.initLogging('debug');

export default class AMI_KEYBOARD extends KEYBOARD {
  _handleKeyDown(e) {
    /*
     * ======================================================
     * KEYBOARD Extension to store the Keyboard LED state
     * of client machine (i.e the machine in which WebUI is
     * running) & store it in KVM store.
     * ======================================================
     */

    /* Variable to hold latest Keyboard LED state */
    let x = 0;

    if (e.getModifierState('NumLock')) {
      x = x | (1 << 0);
    }
    if (e.getModifierState('CapsLock')) {
      x = x | (1 << 1);
    }
    if (e.getModifierState('ScrollLock')) {
      x = x | (1 << 2);
    }
    Log.Debug('>> AMI_KEYBOARD_handleKeyDown : Keyboard Led state: ', x);
    if (x != store.getters['kvm/getclientKeyboardLEDState']) {
      store.commit('kvm/setclientKeyboardLEDState', x);
    }
    super._handleKeyDown(e);
  }
}
