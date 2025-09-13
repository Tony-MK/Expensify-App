"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = addUtilsToWindow;
const react_native_onyx_1 = require("react-native-onyx");
const Environment_1 = require("@libs/Environment/Environment");
const markAllPolicyReportsAsRead_1 = require("@libs/markAllPolicyReportsAsRead");
const Session_1 = require("@userActions/Session");
/**
 * This is used to inject development/debugging utilities into the window object on web and desktop.
 * We do this only on non-production builds - these should not be used in any application code.
 */
function addUtilsToWindow() {
    if (!window) {
        return;
    }
    (0, Environment_1.isProduction)().then((isProduction) => {
        if (isProduction) {
            return;
        }
        window.Onyx = react_native_onyx_1.default;
        // We intentionally do not offer an Onyx.get API because we believe it will lead to code patterns we don't want to use in this repo, but we can offer a workaround for the sake of debugging
        window.Onyx.get = function (key) {
            return new Promise((resolve) => {
                // We have opted for `connectWithoutView` here as this is a debugging utility and does not relate to any view.
                const connection = react_native_onyx_1.default.connectWithoutView({
                    key,
                    callback: (value) => {
                        react_native_onyx_1.default.disconnect(connection);
                        resolve(value);
                    },
                    waitForCollectionCallback: true,
                });
            });
        };
        window.Onyx.log = function (key) {
            window.Onyx.get(key).then((value) => {
                /* eslint-disable-next-line no-console */
                console.log(value);
            });
        };
        window.setSupportToken = Session_1.setSupportAuthToken;
        // Workaround to give employees the ability to mark reports as read via the JS console
        window.markAllPolicyReportsAsRead = markAllPolicyReportsAsRead_1.default;
    });
}
