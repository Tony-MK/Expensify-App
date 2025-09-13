"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const execAsync_1 = require("../utils/execAsync");
const Logger = require("../utils/logger");
const adbTypeText = (text) => {
    Logger.log(`📝 Typing text: ${text}`);
    return (0, execAsync_1.default)(`adb shell input text "${text}"`).then(() => true);
};
exports.default = adbTypeText;
