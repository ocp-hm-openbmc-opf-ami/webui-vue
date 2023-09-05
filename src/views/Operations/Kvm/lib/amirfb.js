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

/*
 * backslash and Intlbackslash have same X11 keysym mapped in en-uk
 * keyboard layout.
 * So defining custom X11 keysym value for Intlbackslash key mapping in server side.
 */
KeyTable.XK_Intlbackslash = 0x100005c; /* U+005C + 0x01000000 (Reference: X11/keysymdef.h)*/
KeyTable.XK_EuroSign = 0x20ac; /* U+20AC EURO SIGN (Reference: X11/keysymdef.h)*/

/* Uncomment to enable logging in browser debug console
 * Note:
 * 1. Enable 'verbose' log level in browser debug console to view log messages
 * 2. Do not enable this in production */
// Log.initLogging('debug');

/* Get key by value */
let _key = (val, obj = XtScancode /* default object for lookup */) =>
  Object.keys(obj).find((key) => obj[key] === val);

export default class AMI_RFB extends RFB {
  _handleKeyEvent(keysym, code, down) {
    let keyboardlayout = store.getters['kvm/getKeyboardLayout'];
    /* Parse the correct keyboard layout class name.
     * This is to avoid boilerplate code in switch case */
    let kbd = this['kbd_' + keyboardlayout.replace(/-/g, '_')];

    Log.Debug(
      `>> AMI_RFB._handleKeyEvent -> ${keyboardlayout} ` +
        `keysym:${keysym} code:${code} down:${down}`
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

    super.sendKey(keysym, code, down);
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
