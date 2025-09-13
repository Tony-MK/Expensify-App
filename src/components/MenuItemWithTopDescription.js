"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useAnimatedHighlightStyle_1 = require("@hooks/useAnimatedHighlightStyle");
const useTheme_1 = require("@hooks/useTheme");
const MenuItem_1 = require("./MenuItem");
function MenuItemWithTopDescription({ highlighted, outerWrapperStyle, ref, ...props }) {
    const theme = (0, useTheme_1.default)();
    const highlightedOuterWrapperStyle = (0, useAnimatedHighlightStyle_1.default)({
        shouldHighlight: highlighted ?? false,
        highlightColor: theme.messageHighlightBG,
        itemEnterDelay: 0,
    });
    return (<MenuItem_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} ref={ref} shouldShowBasicTitle shouldShowDescriptionOnTop outerWrapperStyle={highlighted ? highlightedOuterWrapperStyle : outerWrapperStyle}/>);
}
MenuItemWithTopDescription.displayName = 'MenuItemWithTopDescription';
exports.default = MenuItemWithTopDescription;
