"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const SkeletonViewContentLoader_1 = require("@components/SkeletonViewContentLoader");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const getVerticalMargin = (style) => {
    if (!style) {
        return 0;
    }
    const flattenStyle = react_native_1.StyleSheet.flatten(style);
    const marginVertical = Number(flattenStyle?.marginVertical ?? 0);
    const marginTop = Number(flattenStyle?.marginTop ?? 0);
    const marginBottom = Number(flattenStyle?.marginBottom ?? 0);
    return marginVertical + marginTop + marginBottom;
};
function ItemListSkeletonView({ shouldAnimate = true, renderSkeletonItem, fixedNumItems, gradientOpacityEnabled = false, itemViewStyle = {}, itemViewHeight = CONST_1.default.LHN_SKELETON_VIEW_ITEM_HEIGHT, speed, style, }) {
    const theme = (0, useTheme_1.default)();
    const themeStyles = (0, useThemeStyles_1.default)();
    const [numItems, setNumItems] = (0, react_1.useState)(fixedNumItems ?? 0);
    const totalItemHeight = itemViewHeight + getVerticalMargin(itemViewStyle);
    const handleLayout = (0, react_1.useCallback)((event) => {
        if (fixedNumItems) {
            return;
        }
        const totalHeight = event.nativeEvent.layout.height;
        const newNumItems = Math.ceil(totalHeight / totalItemHeight);
        if (newNumItems !== numItems) {
            setNumItems(newNumItems);
        }
    }, [fixedNumItems, numItems, totalItemHeight]);
    const skeletonViewItems = (0, react_1.useMemo)(() => {
        const items = [];
        for (let i = 0; i < numItems; i++) {
            const opacity = gradientOpacityEnabled ? 1 - i / (numItems - 1) : 1;
            items.push(<SkeletonViewContentLoader_1.default speed={speed} key={`skeletonContainer${i}`} animate={shouldAnimate} height={itemViewHeight} backgroundColor={theme.skeletonLHNIn} foregroundColor={theme.skeletonLHNOut} style={[themeStyles.mr5, itemViewStyle, { opacity }, { minHeight: itemViewHeight }]}>
                    {renderSkeletonItem({ itemIndex: i })}
                </SkeletonViewContentLoader_1.default>);
        }
        return items;
    }, [numItems, shouldAnimate, theme, themeStyles, renderSkeletonItem, gradientOpacityEnabled, itemViewHeight, itemViewStyle, speed]);
    return (<react_native_1.View style={[themeStyles.flex1, style]} onLayout={handleLayout}>
            {skeletonViewItems}
        </react_native_1.View>);
}
ItemListSkeletonView.displayName = 'ListItemSkeleton';
exports.default = ItemListSkeletonView;
