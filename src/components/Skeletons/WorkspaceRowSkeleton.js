"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var useWindowDimensions_1 = require("@hooks/useWindowDimensions");
var variables_1 = require("@styles/variables");
var ItemListSkeletonView_1 = require("./ItemListSkeletonView");
var barHeight = 7;
var longBarWidth = 120;
var shortBarWidth = 60;
var leftPaneWidth = variables_1.default.navigationTabBarSize;
var gapWidth = 12;
function WorkspaceRowSkeleton(_a) {
    var _b = _a.shouldAnimate, shouldAnimate = _b === void 0 ? true : _b, fixedNumItems = _a.fixedNumItems, _c = _a.gradientOpacityEnabled, gradientOpacityEnabled = _c === void 0 ? false : _c;
    var styles = (0, useThemeStyles_1.default)();
    var windowWidth = (0, useWindowDimensions_1.default)().windowWidth;
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    // We calculate the width of the sections on the skeleton by first calculating the skeleton view width
    // Then we subtract the width by 66, which is the x position of the first part.
    var partWidth = Math.floor((windowWidth - leftPaneWidth - gapWidth * 2 - 66) / 3);
    return (<ItemListSkeletonView_1.default shouldAnimate={shouldAnimate} fixedNumItems={fixedNumItems} gradientOpacityEnabled={gradientOpacityEnabled} itemViewStyle={[styles.highlightBG, styles.mb2, styles.br3, styles.ml5]} renderSkeletonItem={function () { return (<>
                    <react_native_svg_1.Rect x={12} y={12} rx={5} ry={5} width={36} height={40}/>
                    <react_native_svg_1.Rect x={66} y={22} width={longBarWidth} height={barHeight}/>
                    <react_native_svg_1.Rect x={66} y={36} width={shortBarWidth} height={barHeight}/>
                    {!shouldUseNarrowLayout && (<>
                            <react_native_svg_1.Rect x={66 + partWidth} y={22} width={longBarWidth} height={barHeight}/>
                            <react_native_svg_1.Rect x={66 + partWidth} y={36} width={shortBarWidth} height={barHeight}/>
                            <react_native_svg_1.Rect x={66 + partWidth * 2} y={22} width={longBarWidth} height={barHeight}/>
                            <react_native_svg_1.Rect x={66 + partWidth * 2} y={36} width={shortBarWidth} height={barHeight}/>
                        </>)}
                </>); }}/>);
}
WorkspaceRowSkeleton.displayName = 'WorkspaceRowSkeleton';
exports.default = WorkspaceRowSkeleton;
