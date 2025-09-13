"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const Navigation_1 = require("@libs/Navigation/Navigation");
/**
 * On iOS, the navigation transition can sometimes break other animations, such as the closing modal.
 * In this case we need to wait for the animation to be complete before executing the navigation
 */
function navigateAfterInteraction(callback) {
    react_native_1.InteractionManager.runAfterInteractions(() => {
        Navigation_1.default.setNavigationActionToMicrotaskQueue(callback);
    });
}
exports.default = navigateAfterInteraction;
