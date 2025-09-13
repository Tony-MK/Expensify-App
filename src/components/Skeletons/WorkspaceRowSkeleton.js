"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_svg_1 = require("react-native-svg");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const variables_1 = require("@styles/variables");
const ItemListSkeletonView_1 = require("./ItemListSkeletonView");
const barHeight = 7;
const longBarWidth = 120;
const shortBarWidth = 60;
const leftPaneWidth = variables_1.default.navigationTabBarSize;
const gapWidth = 12;
function WorkspaceRowSkeleton({ shouldAnimate = true, fixedNumItems, gradientOpacityEnabled = false }) {
    const styles = (0, useThemeStyles_1.default)();
    const { windowWidth } = (0, useWindowDimensions_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    // We calculate the width of the sections on the skeleton by first calculating the skeleton view width
    // Then we subtract the width by 66, which is the x position of the first part.
    const partWidth = Math.floor((windowWidth - leftPaneWidth - gapWidth * 2 - 66) / 3);
    return (<ItemListSkeletonView_1.default shouldAnimate={shouldAnimate} fixedNumItems={fixedNumItems} gradientOpacityEnabled={gradientOpacityEnabled} itemViewStyle={[styles.highlightBG, styles.mb2, styles.br3, styles.ml5]} renderSkeletonItem={() => (<>
                    <react_native_svg_1.Rect x={12} y={12} rx={5} ry={5} width={36} height={40}/>
                    <react_native_svg_1.Rect x={66} y={22} width={longBarWidth} height={barHeight}/>
                    <react_native_svg_1.Rect x={66} y={36} width={shortBarWidth} height={barHeight}/>
                    {!shouldUseNarrowLayout && (<>
                            <react_native_svg_1.Rect x={66 + partWidth} y={22} width={longBarWidth} height={barHeight}/>
                            <react_native_svg_1.Rect x={66 + partWidth} y={36} width={shortBarWidth} height={barHeight}/>
                            <react_native_svg_1.Rect x={66 + partWidth * 2} y={22} width={longBarWidth} height={barHeight}/>
                            <react_native_svg_1.Rect x={66 + partWidth * 2} y={36} width={shortBarWidth} height={barHeight}/>
                        </>)}
                </>)}/>);
}
WorkspaceRowSkeleton.displayName = 'WorkspaceRowSkeleton';
exports.default = WorkspaceRowSkeleton;
