"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const throttle_1 = require("lodash/throttle");
const react_native_onyx_1 = require("react-native-onyx");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
/**
 * Toggle the test tools modal open or closed.
 * Throttle the toggle to make the modal stay open if you accidentally tap an extra time, which is easy to do.
 */
function toggleProfileTool(isProfilingInProgress = false) {
    const toggle = () => react_native_onyx_1.default.set(ONYXKEYS_1.default.APP_PROFILING_IN_PROGRESS, isProfilingInProgress);
    const throttledToggle = (0, throttle_1.default)(toggle, CONST_1.default.TIMING.TEST_TOOLS_MODAL_THROTTLE_TIME);
    throttledToggle();
}
exports.default = toggleProfileTool;
