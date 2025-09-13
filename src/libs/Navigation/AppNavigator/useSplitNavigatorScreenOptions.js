"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const animation_1 = require("@libs/Navigation/PlatformStackNavigation/navigationOptions/animation");
const variables_1 = require("@styles/variables");
const CONFIG_1 = require("@src/CONFIG");
const hideKeyboardOnSwipe_1 = require("./hideKeyboardOnSwipe");
const useModalCardStyleInterpolator_1 = require("./useModalCardStyleInterpolator");
const commonScreenOptions = {
    web: {
        cardOverlayEnabled: true,
    },
};
const useSplitNavigatorScreenOptions = () => {
    const themeStyles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const modalCardStyleInterpolator = (0, useModalCardStyleInterpolator_1.default)();
    return {
        sidebarScreen: {
            ...commonScreenOptions,
            title: CONFIG_1.default.SITE_TITLE,
            headerShown: false,
            web: {
                // Note: The card* properties won't be applied on mobile platforms, as they use the native defaults.
                cardStyleInterpolator: (props) => modalCardStyleInterpolator({ props }),
                cardStyle: {
                    ...StyleUtils.getNavigationModalCardStyle(),
                    width: shouldUseNarrowLayout ? '100%' : variables_1.default.sideBarWithLHBWidth + variables_1.default.navigationTabBarSize,
                    // We need to shift the sidebar to not be covered by the StackNavigator so it can be clickable.
                    marginLeft: shouldUseNarrowLayout ? 0 : -(variables_1.default.sideBarWithLHBWidth + variables_1.default.navigationTabBarSize),
                    paddingLeft: shouldUseNarrowLayout ? 0 : variables_1.default.navigationTabBarSize,
                    ...(shouldUseNarrowLayout ? {} : themeStyles.borderRight),
                },
            },
        },
        centralScreen: {
            ...commonScreenOptions,
            ...hideKeyboardOnSwipe_1.default,
            headerShown: false,
            title: CONFIG_1.default.SITE_TITLE,
            animation: shouldUseNarrowLayout ? animation_1.default.SLIDE_FROM_RIGHT : animation_1.default.NONE,
            animationTypeForReplace: 'pop',
            web: {
                cardStyleInterpolator: (props) => modalCardStyleInterpolator({ props, isFullScreenModal: true, shouldAnimateSidePanel: true }),
                cardStyle: shouldUseNarrowLayout ? StyleUtils.getNavigationModalCardStyle() : themeStyles.h100,
            },
        },
    };
};
exports.default = useSplitNavigatorScreenOptions;
