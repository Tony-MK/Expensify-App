"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HapticFeedback_1 = require("@libs/HapticFeedback");
function usePaymentAnimations() {
    const [isPaidAnimationRunning, setIsPaidAnimationRunning] = (0, react_1.useState)(false);
    const [isApprovedAnimationRunning, setIsApprovedAnimationRunning] = (0, react_1.useState)(false);
    const [isSubmittingAnimationRunning, setIsSubmittingAnimationRunning] = (0, react_1.useState)(false);
    const stopAnimation = (0, react_1.useCallback)(() => {
        setIsPaidAnimationRunning(false);
        setIsApprovedAnimationRunning(false);
        setIsSubmittingAnimationRunning(false);
    }, []);
    const startAnimation = (0, react_1.useCallback)(() => {
        setIsPaidAnimationRunning(true);
        HapticFeedback_1.default.longPress();
    }, []);
    const startApprovedAnimation = (0, react_1.useCallback)(() => {
        setIsApprovedAnimationRunning(true);
        HapticFeedback_1.default.longPress();
    }, []);
    const startSubmittingAnimation = (0, react_1.useCallback)(() => {
        setIsSubmittingAnimationRunning(true);
        HapticFeedback_1.default.longPress();
    }, []);
    return {
        isPaidAnimationRunning,
        isApprovedAnimationRunning,
        isSubmittingAnimationRunning,
        stopAnimation,
        startAnimation,
        startApprovedAnimation,
        startSubmittingAnimation,
    };
}
exports.default = usePaymentAnimations;
