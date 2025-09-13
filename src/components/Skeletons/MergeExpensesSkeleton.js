"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_svg_1 = require("react-native-svg");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ItemListSkeletonView_1 = require("./ItemListSkeletonView");
const barHeight = 7;
const longBarWidth = 120;
const mediumBarWidth = 60;
const shortBarWidth = 40;
function MergeExpensesSkeleton({ fixedNumItems, speed }) {
    const containerRef = (0, react_1.useRef)(null);
    const styles = (0, useThemeStyles_1.default)();
    const [pageWidth, setPageWidth] = react_1.default.useState(0);
    (0, react_1.useLayoutEffect)(() => {
        containerRef.current?.measure((x, y, width) => {
            setPageWidth(width - 24);
        });
    }, []);
    const skeletonItem = (0, react_1.useCallback)(() => {
        return (<>
                <react_native_svg_1.Rect x={12} y={12} width={36} height={40} rx={4} ry={4}/>
                <react_native_svg_1.Rect x={66} y={22} width={longBarWidth} height={barHeight}/>

                <react_native_svg_1.Rect x={66} y={36} width={mediumBarWidth} height={barHeight}/>

                <react_native_svg_1.Rect 
        // We have to calculate this value to make sure the element is aligned to the right border.
        x={pageWidth - 12 - mediumBarWidth} y={22} width={mediumBarWidth} height={barHeight}/>

                <react_native_svg_1.Rect 
        // We have to calculate this value to make sure the element is aligned to the right border.
        x={pageWidth - 12 - shortBarWidth} y={36} width={shortBarWidth} height={barHeight}/>
            </>);
    }, [pageWidth]);
    return (<react_native_1.View style={styles.flex1} ref={containerRef}>
            <ItemListSkeletonView_1.default itemViewHeight={64} itemViewStyle={[styles.highlightBG, styles.mb2, styles.br2, styles.ml3, styles.mr3]} shouldAnimate fixedNumItems={fixedNumItems} renderSkeletonItem={skeletonItem} speed={speed}/>
        </react_native_1.View>);
}
MergeExpensesSkeleton.displayName = 'MergeExpensesSkeleton';
exports.default = MergeExpensesSkeleton;
