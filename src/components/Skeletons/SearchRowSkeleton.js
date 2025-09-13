"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_svg_1 = require("react-native-svg");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ItemListSkeletonView_1 = require("./ItemListSkeletonView");
const barHeight = 8;
const longBarWidth = 120;
const leftPaneWidth = variables_1.default.sideBarWithLHBWidth + variables_1.default.navigationTabBarSize;
// 12 is the gap between the element and the right button
const gapWidth = 12;
// 80 is the width of the element itself
const rightSideElementWidth = 80;
// 24 is the padding of the central pane summing two sides
const centralPanePadding = 40;
// 80 is the width of the button on the right side
const rightButtonWidth = 80;
function SearchRowSkeleton({ shouldAnimate = true, fixedNumItems, gradientOpacityEnabled = false, containerStyle }) {
    const styles = (0, useThemeStyles_1.default)();
    const { windowWidth } = (0, useWindowDimensions_1.default)();
    const { shouldUseNarrowLayout, isLargeScreenWidth } = (0, useResponsiveLayout_1.default)();
    if (shouldUseNarrowLayout) {
        return (<react_native_1.View style={[styles.flex1, containerStyle]}>
                <ItemListSkeletonView_1.default itemViewHeight={CONST_1.default.SEARCH_SKELETON_VIEW_ITEM_HEIGHT} itemViewStyle={[styles.highlightBG, styles.mb2, styles.br3, styles.ml5]} gradientOpacityEnabled={gradientOpacityEnabled} shouldAnimate={shouldAnimate} fixedNumItems={fixedNumItems} renderSkeletonItem={() => (<>
                            <react_native_svg_1.Circle cx={24} cy={26} r={8}/>

                            <react_native_svg_1.Rect x={40} y={24} width={40} height={4}/>
                            <react_native_svg_1.Circle cx={96} cy={26} r={8}/>

                            <react_native_svg_1.Rect x={112} y={24} width={40} height={4}/>
                            <react_native_svg_1.Rect x={windowWidth - 130} y={12} width={80} height={28} rx={14} ry={14}/>

                            <react_native_svg_1.Rect x={16} y={56} width={36} height={40} rx={4} ry={4}/>
                            <react_native_svg_1.Rect x={64} y={65} width={124} height={8}/>
                            <react_native_svg_1.Rect x={64} y={79} width={60} height={8}/>
                            <react_native_svg_1.Rect x={windowWidth - 130} y={65} width={80} height={8}/>
                            <react_native_svg_1.Rect x={windowWidth - 110} y={79} width={60} height={8}/>
                        </>)}/>
            </react_native_1.View>);
    }
    return (<react_native_1.View style={[styles.flex1, containerStyle]}>
            <ItemListSkeletonView_1.default shouldAnimate={shouldAnimate} fixedNumItems={fixedNumItems} gradientOpacityEnabled={gradientOpacityEnabled} itemViewStyle={[styles.highlightBG, styles.mb2, styles.br3, styles.ml5]} renderSkeletonItem={() => (<>
                        <react_native_svg_1.Rect x={12} y={12} rx={5} ry={5} width={36} height={40}/>
                        <react_native_svg_1.Rect x={60} y={28} width={30} height={barHeight}/>
                        <react_native_svg_1.Rect x={102} y={28} width={longBarWidth} height={barHeight}/>
                        {isLargeScreenWidth && (<>
                                <react_native_svg_1.Rect x={234} y={28} width={longBarWidth} height={barHeight}/>

                                <react_native_svg_1.Rect x={366} y={28} width={60} height={barHeight}/>
                            </>)}

                        <react_native_svg_1.Rect 
        // We have to calculate this value to make sure the element is aligned to the button on the right side.
        x={windowWidth - leftPaneWidth - rightButtonWidth - gapWidth - centralPanePadding - gapWidth - rightSideElementWidth} y={28} width={80} height={barHeight}/>

                        <react_native_svg_1.Rect 
        // We have to calculate this value to make sure the element is aligned to the right border.
        x={windowWidth - leftPaneWidth - rightSideElementWidth - gapWidth - centralPanePadding} y={18} rx={15} ry={15} width={80} height={28}/>
                    </>)}/>
        </react_native_1.View>);
}
SearchRowSkeleton.displayName = 'SearchRowSkeleton';
exports.default = SearchRowSkeleton;
