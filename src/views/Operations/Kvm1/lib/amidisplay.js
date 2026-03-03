/*
 * AMI_DISPLAY: AMI wrapper for noVNC Display module
 * @Author Amlana Bhuyan <amlanab@ami.com>
 */
import Display from '@novnc/novnc/core/display.js';
import * as Log from '@novnc/novnc/core/util/logging';

// Uncomment to enable logging in browser debug console
// Log.initLogging('debug');

export default class AMI_DISPLAY extends Display {
  // Override _scanRenderQ
  _scanRenderQ() {
    let ready = true;
    while (ready && this._renderQ.length > 0) {
      const a = this._renderQ[0];
      switch (a.type) {
        case 'flip':
          this.flip(true);
          break;
        case 'copy':
          this.copyImage(a.oldX, a.oldY, a.x, a.y, a.width, a.height, true);
          break;
        case 'fill':
          this.fillRect(a.x, a.y, a.width, a.height, a.color, true);
          break;
        case 'blit':
          this.blitImage(a.x, a.y, a.width, a.height, a.data, 0, true);
          break;
        case 'blitRgb':
          this.blitRgbImage(a.x, a.y, a.width, a.height, a.data, 0, true);
          break;
        case 'blitRgbx':
          this.blitRgbxImage(a.x, a.y, a.width, a.height, a.data, 0, true);
          break;
        case 'img':
          if (a.img.complete && a.img.width !== 0 && a.img.height !== 0) {
            if (a.img.width !== a.width || a.img.height !== a.height) {
              Log.Error(
                'Decoded image has incorrect dimensions. Got ' +
                  a.img.width +
                  'x' +
                  a.img.height +
                  '. Expected ' +
                  a.width +
                  'x' +
                  a.height +
                  '.',
              );
              if (a.img.width > 0 && a.img.height > 0) {
                Log.Info(
                  'Drawing image with new dimensions: ' +
                    ' (' +
                    a.img.width +
                    'x' +
                    a.img.height +
                    ')',
                );
                this.drawImage(a.img, a.img.width, a.img.height);
                if (ready) {
                  this._renderQ.shift();
                }
                break;
              }
              return;
            }
            this.drawImage(a.img, a.x, a.y);
          } else {
            a.img._noVNCDisplay = this;
            a.img.addEventListener('load', this._resumeRenderQ);
            ready = false;
          }
          break;
      }
      if (ready) {
        this._renderQ.shift();
      }
    }
    if (this._renderQ.length === 0 && this._flushing) {
      this._flushing = false;
      this.onflush();
    }
  }
}
