"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForTextInputValue = exports.waitForEvent = exports.tap = exports.waitForElement = void 0;
const react_native_1 = require("react-native");
const E2EGenericPressableWrapper = require("@components/Pressable/GenericPressable/index.e2e");
const Performance_1 = require("@libs/Performance");
const waitForElement = (testID) => {
    console.debug(`[E2E] waitForElement: ${testID}`);
    if (E2EGenericPressableWrapper.getPressableProps(testID)) {
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        const subscription = react_native_1.DeviceEventEmitter.addListener('onBecameVisible', (_testID) => {
            if (_testID !== testID) {
                return;
            }
            subscription.remove();
            resolve(undefined);
        });
    });
};
exports.waitForElement = waitForElement;
const waitForTextInputValue = (text, _testID) => {
    return new Promise((resolve) => {
        const subscription = react_native_1.DeviceEventEmitter.addListener('onChangeText', ({ testID, value }) => {
            if (_testID !== testID || value !== text) {
                return;
            }
            subscription.remove();
            resolve(undefined);
        });
    });
};
exports.waitForTextInputValue = waitForTextInputValue;
const waitForEvent = (eventName) => {
    return new Promise((resolve) => {
        Performance_1.default.subscribeToMeasurements((entry) => {
            if (entry.name !== eventName) {
                return;
            }
            resolve(entry);
        });
    });
};
exports.waitForEvent = waitForEvent;
const tap = (testID) => {
    console.debug(`[E2E] Press on: ${testID}`);
    E2EGenericPressableWrapper.getPressableProps(testID)?.onPress?.({});
};
exports.tap = tap;
