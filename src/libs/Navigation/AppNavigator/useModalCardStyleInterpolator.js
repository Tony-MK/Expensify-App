"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import Animated directly from 'react-native' as animations are used with navigation.
// eslint-disable-next-line no-restricted-imports
const react_native_1 = require("react-native");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSidePanel_1 = require("@hooks/useSidePanel");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const variables_1 = require("@styles/variables");
const useModalCardStyleInterpolator = () => {
    const { shouldUseNarrowLayout, onboardingIsMediumOrLargerScreenWidth } = (0, useResponsiveLayout_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { sidePanelOffset } = (0, useSidePanel_1.default)();
    const modalCardStyleInterpolator = ({ props: { current: { progress }, inverted, layouts: { screen }, }, isOnboardingModal = false, isFullScreenModal = false, shouldFadeScreen = false, shouldAnimateSidePanel = false, outputRangeMultiplier = 1, animationEnabled = true, }) => {
        if (isOnboardingModal ? onboardingIsMediumOrLargerScreenWidth : shouldFadeScreen) {
            return {
                cardStyle: { opacity: progress },
            };
        }
        const translateX = react_native_1.Animated.multiply(react_native_1.Animated.multiply(progress.interpolate({
            inputRange: [0, 1],
            outputRange: [shouldUseNarrowLayout ? screen.width : variables_1.default.sideBarWidth, 0],
            extrapolate: 'clamp',
        }), outputRangeMultiplier), inverted);
        const cardStyle = StyleUtils.getCardStyles(screen.width);
        if (animationEnabled && (!isFullScreenModal || shouldUseNarrowLayout)) {
            cardStyle.transform = [{ translateX }];
        }
        if (shouldAnimateSidePanel) {
            cardStyle.paddingRight = sidePanelOffset.current;
        }
        return {
            containerStyle: {
                overflow: 'hidden',
            },
            cardStyle,
        };
    };
    return modalCardStyleInterpolator;
};
exports.default = useModalCardStyleInterpolator;
