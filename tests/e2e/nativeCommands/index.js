"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adbTypeText = exports.executeFromPayload = exports.NativeCommandsAction = void 0;
const adbBackspace_1 = require("./adbBackspace");
const adbClear_1 = require("./adbClear");
const adbTypeText_1 = require("./adbTypeText");
exports.adbTypeText = adbTypeText_1.default;
// eslint-disable-next-line rulesdir/prefer-import-module-contents
const NativeCommandsAction_1 = require("./NativeCommandsAction");
Object.defineProperty(exports, "NativeCommandsAction", { enumerable: true, get: function () { return NativeCommandsAction_1.NativeCommandsAction; } });
const executeFromPayload = (actionName, payload) => {
    switch (actionName) {
        case NativeCommandsAction_1.NativeCommandsAction.scroll:
            throw new Error('Not implemented yet');
        case NativeCommandsAction_1.NativeCommandsAction.type:
            return (0, adbTypeText_1.default)(payload?.text ?? '');
        case NativeCommandsAction_1.NativeCommandsAction.backspace:
            return (0, adbBackspace_1.default)();
        case NativeCommandsAction_1.NativeCommandsAction.clear:
            return (0, adbClear_1.default)();
        default:
            throw new Error(`Unknown action: ${actionName}`);
    }
};
exports.executeFromPayload = executeFromPayload;
