"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stack_1 = require("@react-navigation/stack");
const react_1 = require("react");
const WideRHPContextProvider_1 = require("@components/WideRHPContextProvider");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Browser_1 = require("@libs/Browser");
const animation_1 = require("@libs/Navigation/PlatformStackNavigation/navigationOptions/animation");
const presentation_1 = require("@libs/Navigation/PlatformStackNavigation/navigationOptions/presentation");
const useModalCardStyleInterpolator_1 = require("./useModalCardStyleInterpolator");
// This function is necessary for proper animation if a wide format RHP screen is visible.
// In such case for every narrow screen on top of the wide screen we use only half width.
// The other half is transparent. To account for that we will divide screen width to make sure the animations starts in the right spot.
const getModifiedCardStyleInterpolatorProps = (props) => {
    return {
        ...props,
        layouts: {
            screen: {
                ...props.layouts.screen,
                width: props.layouts.screen.width / 2,
            },
        },
    };
};
const useRHPScreenOptions = () => {
    const styles = (0, useThemeStyles_1.default)();
    const customInterpolator = (0, useModalCardStyleInterpolator_1.default)();
    const { wideRHPRouteKeys } = (0, react_1.useContext)(WideRHPContextProvider_1.WideRHPContext);
    // We have to use the isSmallScreenWidth instead of shouldUseNarrow layout, because we want to have information about screen width without the context of side modal.
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    // Adjust props on wide layout and when the wide RHP is visible
    const shouldAdjustInterpolatorProps = !isSmallScreenWidth && wideRHPRouteKeys.length;
    return (0, react_1.useMemo)(() => {
        return {
            headerShown: false,
            animation: animation_1.default.SLIDE_FROM_RIGHT,
            gestureDirection: 'horizontal',
            web: {
                // The .forHorizontalIOS interpolator from `@react-navigation` is misbehaving on Safari, so we override it with Expensify custom interpolator
                cardStyleInterpolator: (0, Browser_1.isSafari)()
                    ? (props) => customInterpolator({ props })
                    : (props) => stack_1.CardStyleInterpolators.forHorizontalIOS(shouldAdjustInterpolatorProps ? getModifiedCardStyleInterpolatorProps(props) : props),
                presentation: presentation_1.default.TRANSPARENT_MODAL,
                cardOverlayEnabled: false,
                cardStyle: styles.navigationScreenCardStyle,
                gestureDirection: 'horizontal',
            },
        };
    }, [customInterpolator, shouldAdjustInterpolatorProps, styles.navigationScreenCardStyle]);
};
exports.default = useRHPScreenOptions;
