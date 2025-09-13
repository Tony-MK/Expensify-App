"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_svg_1 = require("react-native-svg");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ItemListSkeletonView_1 = require("./Skeletons/ItemListSkeletonView");
function getLinedWidth(index) {
    const step = index % 3;
    if (step === 0) {
        return '100%';
    }
    if (step === 1) {
        return '50%';
    }
    return '25%';
}
function OptionsListSkeletonView({ shouldAnimate = true, shouldStyleAsTable = false, gradientOpacityEnabled = false, fixedNumItems, speed }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<ItemListSkeletonView_1.default fixedNumItems={fixedNumItems} speed={speed} shouldAnimate={shouldAnimate} style={[styles.overflowHidden]} itemViewStyle={shouldStyleAsTable && [styles.highlightBG, styles.mb2, styles.ml5, styles.br2]} gradientOpacityEnabled={gradientOpacityEnabled} renderSkeletonItem={({ itemIndex }) => {
            const lineWidth = getLinedWidth(itemIndex);
            return (<>
                        <react_native_svg_1.Circle cx={shouldStyleAsTable ? '36' : '40'} cy="32" r="20"/>
                        <react_native_svg_1.Rect x={shouldStyleAsTable ? '68' : '72'} y="18" width="20%" height="8"/>
                        <react_native_svg_1.Rect x={shouldStyleAsTable ? '68' : '72'} y="38" width={shouldStyleAsTable ? '10%' : lineWidth} height="8"/>
                    </>);
        }}/>);
}
OptionsListSkeletonView.displayName = 'OptionsListSkeletonView';
exports.default = OptionsListSkeletonView;
