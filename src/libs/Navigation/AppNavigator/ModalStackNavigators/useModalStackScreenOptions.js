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
var enhanceCardStyleInterpolator_1 = require("@libs/Navigation/AppNavigator/enhanceCardStyleInterpolator");
var hideKeyboardOnSwipe_1 = require("@libs/Navigation/AppNavigator/hideKeyboardOnSwipe");
function useModalStackScreenOptions() {
    var styles = (0, useThemeStyles_1.default)();
    // We have to use isSmallScreenWidth, otherwise the content of RHP 'jumps' on Safari - its width is set to size of screen and only after rerender it is set to the correct value
    // It works as intended on other browsers
    // https://github.com/Expensify/App/issues/63747
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    var isSmallScreenWidth = (0, useResponsiveLayout_1.default)().isSmallScreenWidth;
    var wideRHPRouteKeys = (0, react_1.useContext)(WideRHPContextProvider_1.WideRHPContext).wideRHPRouteKeys;
    return (0, react_1.useCallback)(function (_a) {
        var route = _a.route;
        var cardStyleInterpolator;
        if (wideRHPRouteKeys.includes(route.key) && !isSmallScreenWidth) {
            // We need to use interpolator styles instead of regular card styles so we can use animated value for width.
            // It is necessary to have responsive width of the wide RHP for range 800px to 840px.
            cardStyleInterpolator = (0, enhanceCardStyleInterpolator_1.default)(stack_1.CardStyleInterpolators.forHorizontalIOS, {
                cardStyle: styles.wideRHPExtendedCardInterpolatorStyles,
            });
        }
        else {
            cardStyleInterpolator = stack_1.CardStyleInterpolators.forHorizontalIOS;
        }
        return __assign(__assign({}, hideKeyboardOnSwipe_1.default), { headerShown: false, animationTypeForReplace: 'pop', native: {
                contentStyle: styles.navigationScreenCardStyle,
            }, web: {
                cardStyle: styles.navigationScreenCardStyle,
                cardStyleInterpolator: cardStyleInterpolator,
            } });
    }, [isSmallScreenWidth, styles.navigationScreenCardStyle, styles.wideRHPExtendedCardInterpolatorStyles, wideRHPRouteKeys]);
}
exports.default = useModalStackScreenOptions;
