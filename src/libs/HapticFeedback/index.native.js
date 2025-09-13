"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_haptic_feedback_1 = require("react-native-haptic-feedback");
const hapticFeedback = {
    press: () => {
        react_native_haptic_feedback_1.default.trigger('impactLight', {
            enableVibrateFallback: true,
        });
    },
    longPress: () => {
        react_native_haptic_feedback_1.default.trigger('impactHeavy', {
            enableVibrateFallback: true,
        });
    },
    success: () => {
        react_native_haptic_feedback_1.default.trigger('notificationSuccess', {
            enableVibrateFallback: true,
        });
    },
    error: () => {
        react_native_haptic_feedback_1.default.trigger('notificationError', {
            enableVibrateFallback: true,
        });
    },
};
exports.default = hapticFeedback;
