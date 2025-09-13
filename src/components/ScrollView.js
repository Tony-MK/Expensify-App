"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
// eslint-disable-next-line no-restricted-imports
const react_native_1 = require("react-native");
const useBottomSafeSafeAreaPaddingStyle_1 = require("@hooks/useBottomSafeSafeAreaPaddingStyle");
function ScrollView({ children, scrollIndicatorInsets, contentContainerStyle: contentContainerStyleProp, addBottomSafeAreaPadding, addOfflineIndicatorBottomSafeAreaPadding, ref, ...props }) {
    const contentContainerStyle = (0, useBottomSafeSafeAreaPaddingStyle_1.default)({
        addBottomSafeAreaPadding,
        addOfflineIndicatorBottomSafeAreaPadding,
        style: contentContainerStyleProp,
    });
    return (<react_native_1.ScrollView ref={ref} 
    // on iOS, navigation animation sometimes cause the scrollbar to appear
    // on middle/left side of ScrollView. scrollIndicatorInsets with right
    // to closest value to 0 fixes this issue, 0 (default) doesn't work
    // See: https://github.com/Expensify/App/issues/31441
    contentContainerStyle={contentContainerStyle} scrollIndicatorInsets={scrollIndicatorInsets ?? { right: Number.MIN_VALUE }} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}>
            {children}
        </react_native_1.ScrollView>);
}
ScrollView.displayName = 'ScrollView';
exports.default = ScrollView;
