"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useAnimatedHighlightStyle_1 = require("@hooks/useAnimatedHighlightStyle");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const MenuItem_1 = require("./MenuItem");
function HighlightableMenuItem({ wrapperStyle, highlighted, ...restOfProps }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    const flattenedWrapperStyles = react_native_1.StyleSheet.flatten(wrapperStyle);
    const animatedHighlightStyle = (0, useAnimatedHighlightStyle_1.default)({
        shouldHighlight: highlighted ?? false,
        height: flattenedWrapperStyles?.height ? Number(flattenedWrapperStyles.height) : styles.sectionMenuItem.height,
        borderRadius: flattenedWrapperStyles?.borderRadius ? Number(flattenedWrapperStyles.borderRadius) : styles.sectionMenuItem.borderRadius,
    });
    return (<MenuItem_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restOfProps} outerWrapperStyle={animatedHighlightStyle} wrapperStyle={wrapperStyle} ref={ref}/>);
}
HighlightableMenuItem.displayName = 'HighlightableMenuItem';
exports.default = (0, react_1.forwardRef)(HighlightableMenuItem);
