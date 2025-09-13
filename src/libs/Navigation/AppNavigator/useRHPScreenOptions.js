"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var stack_1 = require("@react-navigation/stack");
var react_1 = require("react");
var WideRHPContextProvider_1 = require("@components/WideRHPContextProvider");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Browser_1 = require("@libs/Browser");
var animation_1 = require("@libs/Navigation/PlatformStackNavigation/navigationOptions/animation");
var presentation_1 = require("@libs/Navigation/PlatformStackNavigation/navigationOptions/presentation");
var useModalCardStyleInterpolator_1 = require("./useModalCardStyleInterpolator");
// This function is necessary for proper animation if a wide format RHP screen is visible.
// In such case for every narrow screen on top of the wide screen we use only half width.
// The other half is transparent. To account for that we will divide screen width to make sure the animations starts in the right spot.
var getModifiedCardStyleInterpolatorProps = function (props) {
    return __assign(__assign({}, props), { layouts: {
            screen: __assign(__assign({}, props.layouts.screen), { width: props.layouts.screen.width / 2 }),
        } });
};
var useRHPScreenOptions = function () {
    var styles = (0, useThemeStyles_1.default)();
    var customInterpolator = (0, useModalCardStyleInterpolator_1.default)();
    var wideRHPRouteKeys = (0, react_1.useContext)(WideRHPContextProvider_1.WideRHPContext).wideRHPRouteKeys;
    // We have to use the isSmallScreenWidth instead of shouldUseNarrow layout, because we want to have information about screen width without the context of side modal.
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    var isSmallScreenWidth = (0, useResponsiveLayout_1.default)().isSmallScreenWidth;
    // Adjust props on wide layout and when the wide RHP is visible
    var shouldAdjustInterpolatorProps = !isSmallScreenWidth && wideRHPRouteKeys.length;
    return (0, react_1.useMemo)(function () {
        return {
            headerShown: false,
            animation: animation_1.default.SLIDE_FROM_RIGHT,
            gestureDirection: 'horizontal',
            web: {
                // The .forHorizontalIOS interpolator from `@react-navigation` is misbehaving on Safari, so we override it with Expensify custom interpolator
                cardStyleInterpolator: (0, Browser_1.isSafari)()
                    ? function (props) { return customInterpolator({ props: props }); }
                    : function (props) { return stack_1.CardStyleInterpolators.forHorizontalIOS(shouldAdjustInterpolatorProps ? getModifiedCardStyleInterpolatorProps(props) : props); },
                presentation: presentation_1.default.TRANSPARENT_MODAL,
                cardOverlayEnabled: false,
                cardStyle: styles.navigationScreenCardStyle,
                gestureDirection: 'horizontal',
            },
        };
    }, [customInterpolator, shouldAdjustInterpolatorProps, styles.navigationScreenCardStyle]);
};
exports.default = useRHPScreenOptions;
