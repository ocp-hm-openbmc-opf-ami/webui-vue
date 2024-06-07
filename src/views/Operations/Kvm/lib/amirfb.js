/*
 * AMI_RFB: AMI wrapper for noVNC RFB
 * @author Mohammed Javith Akthar M <mohammedjavitham@ami.com>
 * @author Amlana Bhuyan <amlanab@ami.com>
 */
import RFB from '@novnc/novnc/core/rfb';
import XtScancode from '@novnc/novnc/core/input/xtscancodes.js';
import KeyTable from '@novnc/novnc/core/input/keysym';
import * as Log from '@novnc/novnc/core/util/logging';
import store from '../../../../store';
/* additional import for Keyboard LED sync */
import Keyboard from './amikeyboard';
import { encodings } from '@novnc/novnc/core/encodings';

/*
 * backslash and Intlbackslash have same X11 keysym mapped in en-uk
 * keyboard layout.
 * So defining custom X11 keysym value for Intlbackslash key mapping in server side.
 */
KeyTable.XK_Intlbackslash = 0x100005c; /* U+005C + 0x01000000 (Reference: X11/keysymdef.h)*/
KeyTable.XK_EuroSign = 0x20ac; /* U+20AC EURO SIGN (Reference: X11/keysymdef.h)*/

/* pseudo-encoding for HostKeyboardLED state request */
var pseudoEncodingKeyboardLedState = -131072; // 0xFFFE0000 (Reference:(libvncserver)rfb/rfbproto.h)

/* var used for indicating indivisual LED state */
var NUM_LOCK_LED_ON = 1 << 0; // 0th bit of output report set [0000 0001]
var SCROLL_LOCK_LED_ON = 1 << 2; // 2nd bit of output report set [0000 0100]

/* Uncomment to enable logging in browser debug console
 * Note:
 * 1. Enable 'verbose' log level in browser debug console to view log messages
 * 2. Do not enable this in production */
// Log.initLogging('debug');

/* Get key by value */
let _key = (val, obj = XtScancode /* default object for lookup */) =>
  Object.keys(obj).find((key) => obj[key] === val);

export default class AMI_RFB extends RFB {
  /* RFB Extention for including AMI_KEYBOARD (wrapper keyboard module) */
  constructor(target, url, options) {
    super(target, url, options);

    this._keyboard = null; // Keyboard input handler object
    this._keyboard = new Keyboard(this._canvas);
    this._keyboard.onkeyevent = this._handleKeyEvent.bind(this);

    this._hostLEDstate = -1; //variable to hold Host keyboard LED state

    Log.Debug('<< AMI_RFB.constructor');
  }
  /* RFB Extension for different physical keyboard layout support */
  _handleKeyEvent(keysym, code, down) {
    let keyboardlayout = store.getters['kvm/getKeyboardLayout'];
    /* Parse the correct keyboard layout class name.
     * This is to avoid boilerplate code in switch case */
    let kbd = this['kbd_' + keyboardlayout.replace(/-/g, '_')];

    var clientLEDstate = store.getters['kvm/getclientKeyboardLEDState'];
    /* Update the host LED status in KVM store */
    if (this._hostLEDstate != store.getters['kvm/gethostKeyboardLEDState']) {
      store.commit('kvm/sethostKeyboardLEDState', this._hostLEDstate);
    }
    Log.Debug(
      `>> AMI_RFB._handleKeyEvent -> ${keyboardlayout} ` +
        `keysym:${keysym} code:${code} down:${down}`
    );
    Log.Debug(
      `>> AMI_RFB._handleKeyEvent -> keyboard LED State: ` +
        `[CLIENT]:${clientLEDstate}  [HOST]:${this._hostLEDstate}`
    );

    switch (keyboardlayout) {
      /* add the keyboard layout here to enable custom key mapping */
      case 'en-gb':
        if (!keysym) {
          return;
        }
        if (keyboardlayout == 'en-gb') {
          /* Skip custom keymapping for 'AltGr(+shift) + backslash' key combination */
          if (
            (keysym == KeyTable.XK_backslash || keysym == KeyTable.XK_bar) &&
            code == _key(XtScancode.Backslash)
          )
            break;
        }
        code = kbd.code[keysym] || code;
        keysym = kbd.keysym[keysym] || keysym;
        break;
      default:
        break;
    }

    Log.Debug(
      `<< AMI_RFB._handleKeyEvent -> ${keyboardlayout} ` +
        `keysym:${keysym} code:${code} down:${down}`
    );

    /* KeyboardLED sync to client function call. */
    if (this._hostLEDstate != -1) {
      if (
        down == true &&
        keysym != KeyTable.XK_Caps_Lock &&
        keysym != KeyTable.XK_Num_Lock &&
        keysym != KeyTable.XK_Scroll_Lock
      ) {
        this._keyboardLedSynctoClient(this._hostLEDstate, clientLEDstate);
      }
    } else {
      Log.Debug(
        `<< AMI_RFB._handleKeyEvent -> LED sync not supported by server`
      );
    }
    super.sendKey(keysym, code, down);
  }

  /*
   * ==================================================================
   * Following function[_sendEncodings()] uses a local array to
   * send the supported encodings by the client.
   * As a result of which unable to use a wrapper for the parent
   * function.
   * Hence over-riding the parent function[RFB._sendEncodings()] with
   * the extention class(AMI_RFB) function [AMI_RFB._sendEncodings()].
   * NOTE:
   * extention to parent function is marked as follows:
   * ============ Extention START =====================
   *      this part of code is the added extention
   * ============ Extention END   =====================
   * ==================================================================
   */
  _sendEncodings() {
    const encs = [];

    // In preference order
    encs.push(encodings.encodingCopyRect);
    // Only supported with full depth support
    if (this._fbDepth == 24) {
      encs.push(encodings.encodingTight);
      encs.push(encodings.encodingTightPNG);
      encs.push(encodings.encodingHextile);
      encs.push(encodings.encodingRRE);
    }
    encs.push(encodings.encodingRaw);

    // Psuedo-encoding settings
    encs.push(encodings.pseudoEncodingQualityLevel0 + this._qualityLevel);
    encs.push(encodings.pseudoEncodingCompressLevel0 + this._compressionLevel);

    encs.push(encodings.pseudoEncodingDesktopSize);
    encs.push(encodings.pseudoEncodingLastRect);
    encs.push(encodings.pseudoEncodingQEMUExtendedKeyEvent);
    encs.push(encodings.pseudoEncodingExtendedDesktopSize);
    encs.push(encodings.pseudoEncodingXvp);
    encs.push(encodings.pseudoEncodingFence);
    encs.push(encodings.pseudoEncodingContinuousUpdates);
    encs.push(encodings.pseudoEncodingDesktopName);
    encs.push(encodings.pseudoEncodingExtendedClipboard);
    /* ================= Extention START ===================== */
    encs.push(pseudoEncodingKeyboardLedState);
    /* ================= Extention END   ===================== */
    if (this._fbDepth == 24) {
      encs.push(encodings.pseudoEncodingVMwareCursor);
      encs.push(encodings.pseudoEncodingCursor);
    }

    RFB.messages.clientEncodings(this._sock, encs);
  }

  /* RFB Extention for handling the supported new encoding */
  _handleRect() {
    if (this._FBU.encoding == pseudoEncodingKeyboardLedState) {
      return this._handleKeyboardLedState(this._FBU.x);
    }

    return super._handleRect();
  }

  /* Function to handle HostLEDstate data recieved from server */
  _handleKeyboardLedState(LEDState) {
    if (this._sock.rQwait('LEDState', 1)) {
      Log.Debug('<< AMI_RFB._handleKeyboardLedState not handled');
      return false;
    }
    this._hostLEDstate = LEDState;
    Log.Debug(
      '<< AMI_RFB._handleKeyboardLedState-KeyboardLedState:',
      this._hostLEDstate
    );
    return true;
  }
  /*
   * =========================================================
   * Function for Host KeyBoard LED sync to Client
   * ========================================================
   */
  _keyboardLedSynctoClient(hostLEDstate, clientLEDstate) {
    if (hostLEDstate == clientLEDstate) {
      Log.Debug(
        `>> AMI_RFB._keyboardLedSynctoClient -> HOST AND CLIENT are  in sync ` +
          `HostLEDstate:${hostLEDstate} clientLEDstate:${clientLEDstate}`
      );
      return;
    }

    Log.Debug(`>> AMI_RFB._keyboardLedSynctoClient -> syncing...`);
    /* syncing NUM_LOCK LEDstate of Host to client*/
    if (
      (clientLEDstate & NUM_LOCK_LED_ON) !=
      (hostLEDstate & NUM_LOCK_LED_ON)
    ) {
      super.sendKey(KeyTable.XK_Num_Lock, _key(XtScancode.NumLock), true);
      super.sendKey(KeyTable.XK_Num_Lock, _key(XtScancode.NumLock), false);
    }
    /* syncing SCROLL_LOCK LEDstate of Host to client*/
    if (
      (clientLEDstate & SCROLL_LOCK_LED_ON) !=
      (hostLEDstate & SCROLL_LOCK_LED_ON)
    ) {
      super.sendKey(KeyTable.XK_Scroll_Lock, _key(XtScancode.ScrollLock), true);
      super.sendKey(
        KeyTable.XK_Scroll_Lock,
        _key(XtScancode.ScrollLock),
        false
      );
    }
  }
}

/* Note: new keyboard layout should follow naming convention
 * kbd_{RFC5646_locale_code_in_lower_case}
 * e.g for en-GB -> kbd_en_gb
 * '-' needs to be substituted with '_' */
AMI_RFB.prototype.kbd_en_gb = {
  keysym: {
    [KeyTable.XK_quotedbl]: KeyTable.XK_at,
    [KeyTable.XK_at]: KeyTable.XK_quotedbl,
    [KeyTable.XK_numbersign]: KeyTable.XK_backslash,
    [KeyTable.XK_asciitilde]: KeyTable.XK_bar,
    [KeyTable.XK_backslash]: KeyTable.XK_Intlbackslash,
    [KeyTable.XK_bar]: KeyTable.XK_Intlbackslash,
    [KeyTable.XK_sterling]: KeyTable.XK_numbersign,
    [KeyTable.XK_EuroSign]: KeyTable.XK_dollar,
    [KeyTable.XK_notsign]: KeyTable.XK_grave,
    [KeyTable.XK_brokenbar]: KeyTable.XK_grave,
    [KeyTable.XK_Eacute]: KeyTable.XK_E,
    [KeyTable.XK_eacute]: KeyTable.XK_e,
    [KeyTable.XK_Uacute]: KeyTable.XK_U,
    [KeyTable.XK_uacute]: KeyTable.XK_u,
    [KeyTable.XK_Iacute]: KeyTable.XK_I,
    [KeyTable.XK_iacute]: KeyTable.XK_i,
    [KeyTable.XK_Oacute]: KeyTable.XK_O,
    [KeyTable.XK_oacute]: KeyTable.XK_o,
    [KeyTable.XK_Aacute]: KeyTable.XK_A,
    [KeyTable.XK_aacute]: KeyTable.XK_a,
    [KeyTable.XK_ISO_Level3_Shift]: KeyTable.XK_Alt_R,
  },
  code: {
    [KeyTable.XK_quotedbl]: _key(XtScancode.Quote),
    [KeyTable.XK_at]: _key(XtScancode.Digit2),
    [KeyTable.XK_numbersign]: _key(XtScancode.Digit3),
    [KeyTable.XK_asciitilde]: _key(XtScancode.Backquote),
  },
};
