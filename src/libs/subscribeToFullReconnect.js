"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const App_1 = require("./actions/App");
const Log_1 = require("./Log");
let lastFullReconnectTime = '';
// We do not depend on updates on the UI to determine the last full reconnect time,
// so we can use `connectWithoutView` here.
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.LAST_FULL_RECONNECT_TIME,
    callback: (value) => {
        lastFullReconnectTime = value ?? '';
        doFullReconnectIfNecessary();
    },
});
let reconnectAppIfFullReconnectBefore = '';
// We do not depend on updates on the UI to determine if we should reconnect the app,
// so we can use `connectWithoutView` here.
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.NVP_RECONNECT_APP_IF_FULL_RECONNECT_BEFORE,
    callback: (value) => {
        reconnectAppIfFullReconnectBefore = value ?? '';
        doFullReconnectIfNecessary();
    },
});
function doFullReconnectIfNecessary() {
    if (lastFullReconnectTime >= reconnectAppIfFullReconnectBefore) {
        return;
    }
    Log_1.default.info('Full reconnect triggered', false, { lastFullReconnectTime, reconnectAppIfFullReconnectBefore });
    (0, App_1.reconnectApp)();
}
