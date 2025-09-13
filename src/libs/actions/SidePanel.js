"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
/**
 * Open the side panel
 *
 * @param shouldOpenOnNarrowScreen - Whether to open the side panel on narrow screen
 */
function openSidePanel(shouldOpenOnNarrowScreen) {
    const optimisticData = [
        {
            key: ONYXKEYS_1.default.NVP_SIDE_PANEL,
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            value: shouldOpenOnNarrowScreen ? { open: true, openNarrowScreen: true } : { open: true },
        },
    ];
    const params = { isNarrowScreen: shouldOpenOnNarrowScreen };
    API.write(types_1.WRITE_COMMANDS.OPEN_SIDE_PANEL, params, { optimisticData });
}
/**
 * Close the side panel
 *
 * @param shouldCloseOnNarrowScreen - Whether to close the side panel on narrow screen
 */
function closeSidePanel(shouldCloseOnNarrowScreen) {
    const optimisticData = [
        {
            key: ONYXKEYS_1.default.NVP_SIDE_PANEL,
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            value: shouldCloseOnNarrowScreen ? { openNarrowScreen: false } : { open: false },
        },
    ];
    const params = { isNarrowScreen: shouldCloseOnNarrowScreen };
    API.write(types_1.WRITE_COMMANDS.CLOSE_SIDE_PANEL, params, { optimisticData });
}
exports.default = { openSidePanel, closeSidePanel };
