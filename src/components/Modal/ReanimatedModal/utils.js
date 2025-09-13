"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.easing = void 0;
exports.getModalInAnimation = getModalInAnimation;
exports.getModalOutAnimation = getModalOutAnimation;
exports.getModalInAnimationStyle = getModalInAnimationStyle;
var react_native_reanimated_1 = require("react-native-reanimated");
var variables_1 = require("@styles/variables");
var easing = react_native_reanimated_1.Easing.bezier(0.76, 0.0, 0.24, 1.0).factory();
exports.easing = easing;
function getModalInAnimation(animationType) {
    switch (animationType) {
        case 'slideInRight':
            return {
                from: { transform: [{ translateX: '100%' }] },
                to: {
                    transform: [{ translateX: '0%' }],
                    easing: easing,
                },
            };
        case 'slideInUp':
            return {
                from: { transform: [{ translateY: '100%' }] },
                to: {
                    transform: [{ translateY: '0%' }],
                    easing: easing,
                },
            };
        case 'fadeIn':
            return {
                from: { opacity: 0 },
                to: {
                    opacity: variables_1.default.overlayOpacity,
                    easing: easing,
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
            return function (progress) { return ({ transform: [{ translateX: "".concat(100 * (1 - progress), "%") }] }); };
        case 'slideInUp':
            return function (progress) { return ({ transform: [{ translateY: "".concat(100 * (1 - progress), "%") }] }); };
        case 'fadeIn':
            return function (progress) { return ({ opacity: progress }); };
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
                    easing: easing,
                },
            };
        case 'slideOutDown':
            return {
                from: { transform: [{ translateY: '0%' }] },
                to: {
                    transform: [{ translateY: '100%' }],
                    easing: easing,
                },
            };
        case 'fadeOut':
            return {
                from: { opacity: variables_1.default.overlayOpacity },
                to: {
                    opacity: 0,
                    easing: easing,
                },
            };
        default:
            throw new Error('Unknown animation type');
    }
}
