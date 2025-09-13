"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_svg_1 = require("react-native-svg");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var ItemListSkeletonView_1 = require("./ItemListSkeletonView");
var barHeight = 7;
var longBarWidth = 120;
var mediumBarWidth = 60;
var shortBarWidth = 40;
function MergeExpensesSkeleton(_a) {
    var fixedNumItems = _a.fixedNumItems, speed = _a.speed;
    var containerRef = (0, react_1.useRef)(null);
    var styles = (0, useThemeStyles_1.default)();
    var _b = react_1.default.useState(0), pageWidth = _b[0], setPageWidth = _b[1];
    (0, react_1.useLayoutEffect)(function () {
        var _a;
        (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.measure(function (x, y, width) {
            setPageWidth(width - 24);
        });
    }, []);
    var skeletonItem = (0, react_1.useCallback)(function () {
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
