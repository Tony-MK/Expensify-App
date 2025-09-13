"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = waitForAppLoaded;
const react_native_onyx_1 = require("react-native-onyx");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
// Once we get the sidebar loaded end mark we know that the app is ready to be used:
function waitForAppLoaded() {
    return new Promise((resolve) => {
        // We have used `connectWithoutView` here because it is not connected to any UI
        const connection = react_native_onyx_1.default.connectWithoutView({
            key: ONYXKEYS_1.default.IS_SIDEBAR_LOADED,
            callback: (isSidebarLoaded) => {
                if (!isSidebarLoaded) {
                    return;
                }
                resolve();
                react_native_onyx_1.default.disconnect(connection);
            },
        });
    });
}
