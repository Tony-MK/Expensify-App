"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useBottomSafeSafeAreaPaddingStyle_1 = require("@hooks/useBottomSafeSafeAreaPaddingStyle");
const AnimatedSectionList_1 = require("./AnimatedSectionList");
function BaseSectionList({ addBottomSafeAreaPadding, addOfflineIndicatorBottomSafeAreaPadding, contentContainerStyle: contentContainerStyleProp, ref, ...restProps }) {
    const contentContainerStyle = (0, useBottomSafeSafeAreaPaddingStyle_1.default)({ addBottomSafeAreaPadding, addOfflineIndicatorBottomSafeAreaPadding, style: contentContainerStyleProp });
    return (<AnimatedSectionList_1.default contentContainerStyle={contentContainerStyle} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restProps} ref={ref}/>);
}
BaseSectionList.displayName = 'BaseSectionList';
exports.default = BaseSectionList;
