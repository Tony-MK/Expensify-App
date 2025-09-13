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
function isObjectStyle(style) {
    return !!style && typeof style === 'object';
}
/**
 * Higher-Order Function that enhances any card style interpolator
 * with additional custom styles while preserving the original functionality.
 *
 * @param interpolator - The original interpolator function to enhance
 * @param additionalStyles - Additional styles to merge with the original interpolator result
 * @returns Enhanced card style interpolator function
 */
var enhanceCardStyleInterpolator = function (interpolator, additionalStyles) {
    return function (props) {
        // Get the original result from the provided interpolator
        var enhancedResult = __assign({}, interpolator(props));
        // Deep merge nested style objects
        if (isObjectStyle(enhancedResult.cardStyle) && isObjectStyle(additionalStyles.cardStyle)) {
            enhancedResult.cardStyle = __assign(__assign({}, enhancedResult.cardStyle), additionalStyles.cardStyle);
        }
        if (isObjectStyle(enhancedResult.containerStyle) && isObjectStyle(additionalStyles.containerStyle)) {
            enhancedResult.containerStyle = __assign(__assign({}, enhancedResult.containerStyle), additionalStyles.containerStyle);
        }
        if (isObjectStyle(enhancedResult.overlayStyle) && isObjectStyle(additionalStyles.overlayStyle)) {
            enhancedResult.overlayStyle = __assign(__assign({}, enhancedResult.overlayStyle), additionalStyles.overlayStyle);
        }
        if (isObjectStyle(enhancedResult.shadowStyle) && isObjectStyle(additionalStyles.shadowStyle)) {
            enhancedResult.shadowStyle = __assign(__assign({}, enhancedResult.shadowStyle), additionalStyles.shadowStyle);
        }
        return enhancedResult;
    };
};
exports.default = enhanceCardStyleInterpolator;
