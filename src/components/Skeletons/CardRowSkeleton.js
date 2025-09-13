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
const leftPaneWidth = variables_1.default.sideBarWithLHBWidth;
const gapWidth = 12;
const rightSideElementWidth = 50;
const centralPanePadding = 50;
const rightButtonWidth = 20;
function CardRowSkeleton({ shouldAnimate = true, fixedNumItems, gradientOpacityEnabled = false }) {
    const styles = (0, useThemeStyles_1.default)();
    const { windowWidth } = (0, useWindowDimensions_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    return (<ItemListSkeletonView_1.default shouldAnimate={shouldAnimate} fixedNumItems={fixedNumItems} gradientOpacityEnabled={gradientOpacityEnabled} itemViewStyle={[styles.highlightBG, styles.mb3, styles.br3, styles.ml5]} renderSkeletonItem={() => (<>
                    <react_native_svg_1.Circle cx={36} cy={32} r={20}/>
                    <react_native_svg_1.Rect x={66} y={22} width={longBarWidth} height={barHeight}/>

                    <react_native_svg_1.Rect x={66} y={36} width={shortBarWidth} height={barHeight}/>

                    {!shouldUseNarrowLayout && (<>
                            <react_native_svg_1.Rect 
            // We have to calculate this value to make sure the element is aligned to the button on the right side.
            x={windowWidth - leftPaneWidth - rightButtonWidth - gapWidth - centralPanePadding - gapWidth - rightSideElementWidth} y={28} width={20} height={barHeight}/>

                            <react_native_svg_1.Rect 
            // We have to calculate this value to make sure the element is aligned to the right border.
            x={windowWidth - leftPaneWidth - rightSideElementWidth - gapWidth - centralPanePadding} y={28} width={50} height={barHeight}/>
                        </>)}
                </>)}/>);
}
CardRowSkeleton.displayName = 'CardRowSkeleton';
exports.default = CardRowSkeleton;
