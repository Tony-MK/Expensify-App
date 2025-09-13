"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.easing = void 0;
exports.getModalInAnimation = getModalInAnimation;
exports.getModalOutAnimation = getModalOutAnimation;
exports.getModalInAnimationStyle = getModalInAnimationStyle;
const react_native_reanimated_1 = require("react-native-reanimated");
const variables_1 = require("@styles/variables");
const easing = react_native_reanimated_1.Easing.bezier(0.76, 0.0, 0.24, 1.0).factory();
exports.easing = easing;
function getModalInAnimation(animationType) {
    switch (animationType) {
        case 'slideInRight':
            return {
                from: { transform: [{ translateX: '100%' }] },
                to: {
                    transform: [{ translateX: '0%' }],
                    easing,
                },
            };
        case 'slideInUp':
            return {
                from: { transform: [{ translateY: '100%' }] },
                to: {
                    transform: [{ translateY: '0%' }],
                    easing,
                },
            };
        case 'fadeIn':
            return {
                from: { opacity: 0 },
                to: {
                    opacity: variables_1.default.overlayOpacity,
                    easing,
                },
            };
        default:
            throw new Error('Unknown animation type');
    }
}
/**
 * @returns A function that takes a number between 0 and 1 and returns a ViewStyle object.
 */
function getModalInAnimationStyle(animationType) {
    switch (animationType) {
        case 'slideInRight':
            return (progress) => ({ transform: [{ translateX: `${100 * (1 - progress)}%` }] });
        case 'slideInUp':
            return (progress) => ({ transform: [{ translateY: `${100 * (1 - progress)}%` }] });
        case 'fadeIn':
            return (progress) => ({ opacity: progress });
        default:
            throw new Error('Unknown animation type');
    }
}
function getModalOutAnimation(animationType) {
    switch (animationType) {
        case 'slideOutRight':
            return {
                from: { transform: [{ translateX: '0%' }] },
                to: {
                    transform: [{ translateX: '100%' }],
                    easing,
                },
            };
        case 'slideOutDown':
            return {
                from: { transform: [{ translateY: '0%' }] },
                to: {
                    transform: [{ translateY: '100%' }],
                    easing,
                },
            };
        case 'fadeOut':
            return {
                from: { opacity: variables_1.default.overlayOpacity },
                to: {
                    opacity: 0,
                    easing,
                },
            };
        default:
            throw new Error('Unknown animation type');
    }
}
