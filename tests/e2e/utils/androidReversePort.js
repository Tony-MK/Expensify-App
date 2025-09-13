"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const execAsync_1 = require("./execAsync");
function androidReversePort() {
    return (0, execAsync_1.default)(`adb reverse tcp:${config_1.default.SERVER_PORT} tcp:${config_1.default.SERVER_PORT}`);
}
exports.default = androidReversePort;
