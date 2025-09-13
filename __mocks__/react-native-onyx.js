"use strict";
/**
 * We are disabling the lint rule that doesn't allow the usage of Onyx.connect outside libs
 * because the intent of this file is to mock the usage of react-native-onyx so we will have to mock the connect function
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOnyx = exports.withOnyx = void 0;
// eslint-disable-next-line no-restricted-imports
const react_native_onyx_1 = require("react-native-onyx");
Object.defineProperty(exports, "useOnyx", { enumerable: true, get: function () { return react_native_onyx_1.useOnyx; } });
Object.defineProperty(exports, "withOnyx", { enumerable: true, get: function () { return react_native_onyx_1.withOnyx; } });
let connectCallbackDelay = 0;
function addDelayToConnectCallback(delay) {
    connectCallbackDelay = delay;
}
const reactNativeOnyxMock = {
    ...react_native_onyx_1.default,
    connectWithoutView: (mapping) => {
        const callback = (...params) => {
            if (connectCallbackDelay > 0) {
                setTimeout(() => {
                    mapping.callback?.(...params);
                }, connectCallbackDelay);
            }
            else {
                mapping.callback?.(...params);
            }
        };
        return react_native_onyx_1.default.connectWithoutView({
            ...mapping,
            callback,
        });
    },
    addDelayToConnectCallback,
};
exports.default = reactNativeOnyxMock;
