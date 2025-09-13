"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const execAsync_1 = require("../utils/execAsync");
const Logger = require("../utils/logger");
const adbClear = () => {
    Logger.log(`🧹 Clearing the typed text`);
    return (0, execAsync_1.default)(`
      function clear_input() {
          adb shell input keyevent KEYCODE_MOVE_END
          # delete up to 2 characters per 1 press, so 1..3 will delete up to 6 characters
          adb shell input keyevent --longpress $(printf 'KEYCODE_DEL %.0s' {1..3})
      }

      clear_input
    `).then(() => true);
};
exports.default = adbClear;
