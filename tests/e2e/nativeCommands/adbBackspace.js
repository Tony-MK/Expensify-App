"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const execAsync_1 = require("../utils/execAsync");
const Logger = require("../utils/logger");
const adbBackspace = () => {
    Logger.log(`🔙 Pressing backspace`);
    return (0, execAsync_1.default)(`adb shell input keyevent KEYCODE_DEL`).then(() => true);
};
exports.default = adbBackspace;
