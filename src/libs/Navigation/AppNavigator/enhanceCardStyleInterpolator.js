"use strict";
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
const enhanceCardStyleInterpolator = (interpolator, additionalStyles) => {
    return (props) => {
        // Get the original result from the provided interpolator
        const enhancedResult = { ...interpolator(props) };
        // Deep merge nested style objects
        if (isObjectStyle(enhancedResult.cardStyle) && isObjectStyle(additionalStyles.cardStyle)) {
            enhancedResult.cardStyle = {
                ...enhancedResult.cardStyle,
                ...additionalStyles.cardStyle,
            };
        }
        if (isObjectStyle(enhancedResult.containerStyle) && isObjectStyle(additionalStyles.containerStyle)) {
            enhancedResult.containerStyle = {
                ...enhancedResult.containerStyle,
                ...additionalStyles.containerStyle,
            };
        }
        if (isObjectStyle(enhancedResult.overlayStyle) && isObjectStyle(additionalStyles.overlayStyle)) {
            enhancedResult.overlayStyle = {
                ...enhancedResult.overlayStyle,
                ...additionalStyles.overlayStyle,
            };
        }
        if (isObjectStyle(enhancedResult.shadowStyle) && isObjectStyle(additionalStyles.shadowStyle)) {
            enhancedResult.shadowStyle = {
                ...enhancedResult.shadowStyle,
                ...additionalStyles.shadowStyle,
            };
        }
        return enhancedResult;
    };
};
exports.default = enhanceCardStyleInterpolator;
