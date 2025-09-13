"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_svg_1 = require("react-native-svg");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ItemListSkeletonView_1 = require("./ItemListSkeletonView");
const barHeight = '8';
const shortBarWidth = '60';
const longBarWidth = '124';
function TableListItemSkeleton({ shouldAnimate = true, fixedNumItems, gradientOpacityEnabled = false }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<ItemListSkeletonView_1.default shouldAnimate={shouldAnimate} fixedNumItems={fixedNumItems} gradientOpacityEnabled={gradientOpacityEnabled} itemViewStyle={[styles.highlightBG, styles.mb2, styles.br3, styles.ml5]} renderSkeletonItem={() => (<>
                    <react_native_svg_1.Circle cx="40" cy="32" r="20"/>
                    <react_native_svg_1.Rect x="80" y="20" width={longBarWidth} height={barHeight}/>
                    <react_native_svg_1.Rect x="80" y="36" width={shortBarWidth} height={barHeight}/>
                </>)}/>);
}
TableListItemSkeleton.displayName = 'TableListItemSkeleton';
exports.default = TableListItemSkeleton;
