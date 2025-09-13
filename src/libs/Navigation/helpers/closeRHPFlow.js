"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = closeRHPFlow;
const native_1 = require("@react-navigation/native");
const Log_1 = require("@libs/Log");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
/**
 * Closes the last RHP flow, if there is only one, closes the entire RHP.
 */
function closeRHPFlow(navigationRef) {
    if (!navigationRef.isReady()) {
        return;
    }
    const state = navigationRef.getState();
    const lastRoute = state.routes.at(-1);
    const isLastRouteRHP = lastRoute?.name === NAVIGATORS_1.default.RIGHT_MODAL_NAVIGATOR;
    if (!isLastRouteRHP) {
        Log_1.default.warn('RHP Navigator has not been found when calling closeRHPFlow function');
        return;
    }
    let target = state.key;
    const hasMoreThanOneRoute = lastRoute?.state?.routes?.length && lastRoute.state.routes.length > 1;
    if (lastRoute?.state?.key && hasMoreThanOneRoute) {
        target = lastRoute.state.key;
    }
    navigationRef.dispatch({ ...native_1.StackActions.pop(), target });
}
