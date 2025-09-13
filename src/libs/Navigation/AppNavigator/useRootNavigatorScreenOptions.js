"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// We use Animated for all functionality related to wide RHP to make it easier
// to interact with react-navigation components (e.g., CardContainer, interpolator), which also use Animated.
// eslint-disable-next-line no-restricted-imports
const react_native_1 = require("react-native");
const WideRHPContextProvider_1 = require("@components/WideRHPContextProvider");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const animation_1 = require("@libs/Navigation/PlatformStackNavigation/navigationOptions/animation");
const presentation_1 = require("@libs/Navigation/PlatformStackNavigation/navigationOptions/presentation");
const variables_1 = require("@styles/variables");
const hideKeyboardOnSwipe_1 = require("./hideKeyboardOnSwipe");
const useModalCardStyleInterpolator_1 = require("./useModalCardStyleInterpolator");
const commonScreenOptions = {
    web: {
        cardOverlayEnabled: true,
    },
};
const useRootNavigatorScreenOptions = () => {
    const StyleUtils = (0, useStyleUtils_1.default)();
    const modalCardStyleInterpolator = (0, useModalCardStyleInterpolator_1.default)();
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth, shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const themeStyles = (0, useThemeStyles_1.default)();
    return {
        rightModalNavigator: {
            ...commonScreenOptions,
            ...hideKeyboardOnSwipe_1.default,
            animation: animation_1.default.SLIDE_FROM_RIGHT,
            // We want pop in RHP since there are some flows that would work weird otherwise
            animationTypeForReplace: 'pop',
            web: {
                presentation: presentation_1.default.TRANSPARENT_MODAL,
                cardStyleInterpolator: (props) => 
                // Add 1 to change range from [0, 1] to [1, 2]
                // Don't use outputMultiplier for the narrow layout
                modalCardStyleInterpolator({
                    props,
                    shouldAnimateSidePanel: true,
                    // Adjust output range to match the wide RHP size
                    outputRangeMultiplier: isSmallScreenWidth
                        ? undefined
                        : react_native_1.Animated.add(react_native_1.Animated.multiply(WideRHPContextProvider_1.expandedRHPProgress, variables_1.default.receiptPaneRHPMaxWidth / variables_1.default.sideBarWidth), 1),
                }),
            },
        },
        basicModalNavigator: {
            presentation: presentation_1.default.TRANSPARENT_MODAL,
            web: {
                cardOverlayEnabled: false,
                cardStyle: {
                    ...StyleUtils.getNavigationModalCardStyle(),
                    backgroundColor: 'transparent',
                    width: '100%',
                    top: 0,
                    left: 0,
                    position: 'fixed',
                },
                cardStyleInterpolator: (props) => modalCardStyleInterpolator({ props, isOnboardingModal: true }),
            },
        },
        splitNavigator: {
            ...commonScreenOptions,
            // We need to turn off animation for the full screen to avoid delay when closing screens.
            animation: animation_1.default.NONE,
            web: {
                cardStyleInterpolator: (props) => modalCardStyleInterpolator({ props, isFullScreenModal: true }),
                cardStyle: StyleUtils.getNavigationModalCardStyle(),
            },
        },
        fullScreen: {
            ...commonScreenOptions,
            // We need to turn off animation for the full screen to avoid delay when closing screens.
            animation: animation_1.default.NONE,
            web: {
                cardStyle: {
                    height: '100%',
                },
                cardStyleInterpolator: (props) => modalCardStyleInterpolator({ props, isFullScreenModal: true }),
            },
        },
        workspacesListPage: {
            ...commonScreenOptions,
            // We need to turn off animation for the full screen to avoid delay when closing screens.
            animation: animation_1.default.NONE,
            web: {
                cardStyleInterpolator: (props) => modalCardStyleInterpolator({ props, isFullScreenModal: true, animationEnabled: false, shouldAnimateSidePanel: true }),
                cardStyle: shouldUseNarrowLayout ? { ...StyleUtils.getNavigationModalCardStyle(), paddingLeft: 0 } : { ...themeStyles.h100, paddingLeft: variables_1.default.navigationTabBarSize },
            },
        },
    };
};
exports.default = useRootNavigatorScreenOptions;
