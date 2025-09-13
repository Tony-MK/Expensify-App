"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldShowProfileTool = shouldShowProfileTool;
const throttle_1 = require("lodash/throttle");
const Browser_1 = require("@libs/Browser");
const Navigation_1 = require("@libs/Navigation/Navigation");
const navigationRef_1 = require("@libs/Navigation/navigationRef");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const Modal_1 = require("./Modal");
/**
 * Get the backTo parameter from the current test tools modal route
 */
function getBackToParam() {
    const route = navigationRef_1.default.current?.getCurrentRoute();
    if (route?.name === SCREENS_1.default.TEST_TOOLS_MODAL.ROOT && route.params) {
        return route.params.backTo;
    }
    return undefined;
}
/**
 * Toggle the test tools modal open or closed.
 * Throttle the toggle to make the modal stay open if you accidentally tap an extra time, which is easy to do.
 */
const throttledToggle = (0, throttle_1.default)(() => {
    const currentRoute = Navigation_1.default.getActiveRoute();
    const backTo = getBackToParam();
    if (currentRoute.includes(ROUTES_1.default.TEST_TOOLS_MODAL.route)) {
        if (backTo) {
            Navigation_1.default.goBack(backTo);
        }
        else {
            Navigation_1.default.goBack();
        }
        return;
    }
    const openTestToolsModal = () => {
        setTimeout(() => Navigation_1.default.navigate(ROUTES_1.default.TEST_TOOLS_MODAL.getRoute(Navigation_1.default.getActiveRoute())), CONST_1.default.MODAL.ANIMATION_TIMING.DEFAULT_IN);
    };
    // Dismiss any current modal before showing test tools modal
    // We need to handle test drive modal differently using Navigation.goBack() to properly clean up its navigation state
    // Without this, the URL would revert to onboarding/test-drive or onboarding/test-drive/demo while the modal is already dismissed, leading to an unresponsive state
    if (currentRoute.includes('test-drive')) {
        Navigation_1.default.goBack();
        openTestToolsModal();
    }
    else {
        (0, Modal_1.close)(() => {
            openTestToolsModal();
        });
    }
}, CONST_1.default.TIMING.TEST_TOOLS_MODAL_THROTTLE_TIME, { leading: true, trailing: false });
function toggleTestToolsModal() {
    throttledToggle();
}
function shouldShowProfileTool() {
    const browser = (0, Browser_1.getBrowser)();
    const isSafariOrFirefox = browser === CONST_1.default.BROWSER.SAFARI || browser === CONST_1.default.BROWSER.FIREFOX;
    if (isSafariOrFirefox || (0, Browser_1.isChromeIOS)()) {
        return false;
    }
    return true;
}
exports.default = toggleTestToolsModal;
