"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stack_1 = require("@react-navigation/stack");
const react_1 = require("react");
const WideRHPContextProvider_1 = require("@components/WideRHPContextProvider");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const enhanceCardStyleInterpolator_1 = require("@libs/Navigation/AppNavigator/enhanceCardStyleInterpolator");
const hideKeyboardOnSwipe_1 = require("@libs/Navigation/AppNavigator/hideKeyboardOnSwipe");
function useModalStackScreenOptions() {
    const styles = (0, useThemeStyles_1.default)();
    // We have to use isSmallScreenWidth, otherwise the content of RHP 'jumps' on Safari - its width is set to size of screen and only after rerender it is set to the correct value
    // It works as intended on other browsers
    // https://github.com/Expensify/App/issues/63747
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const { wideRHPRouteKeys } = (0, react_1.useContext)(WideRHPContextProvider_1.WideRHPContext);
    return (0, react_1.useCallback)(({ route }) => {
        let cardStyleInterpolator;
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
        return {
            ...hideKeyboardOnSwipe_1.default,
            headerShown: false,
            animationTypeForReplace: 'pop',
            native: {
                contentStyle: styles.navigationScreenCardStyle,
            },
            web: {
                cardStyle: styles.navigationScreenCardStyle,
                cardStyleInterpolator,
            },
        };
    }, [isSmallScreenWidth, styles.navigationScreenCardStyle, styles.wideRHPExtendedCardInterpolatorStyles, wideRHPRouteKeys]);
}
exports.default = useModalStackScreenOptions;
