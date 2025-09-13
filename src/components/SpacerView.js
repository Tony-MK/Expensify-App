"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
const usePrevious_1 = require("@hooks/usePrevious");
const CONST_1 = require("@src/CONST");
function SpacerView({ shouldShow, style }) {
    const marginVertical = (0, react_native_reanimated_1.useSharedValue)(shouldShow ? CONST_1.default.HORIZONTAL_SPACER.DEFAULT_MARGIN_VERTICAL : CONST_1.default.HORIZONTAL_SPACER.HIDDEN_MARGIN_VERTICAL);
    const borderBottomWidth = (0, react_native_reanimated_1.useSharedValue)(shouldShow ? CONST_1.default.HORIZONTAL_SPACER.DEFAULT_BORDER_BOTTOM_WIDTH : CONST_1.default.HORIZONTAL_SPACER.HIDDEN_BORDER_BOTTOM_WIDTH);
    const prevShouldShow = (0, usePrevious_1.default)(shouldShow);
    const duration = CONST_1.default.ANIMATED_TRANSITION;
    const animatedStyles = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        borderBottomWidth: (0, react_native_reanimated_1.withTiming)(borderBottomWidth.get(), { duration }),
        marginTop: (0, react_native_reanimated_1.withTiming)(marginVertical.get(), { duration }),
        marginBottom: (0, react_native_reanimated_1.withTiming)(marginVertical.get(), { duration }),
    }));
    react_1.default.useEffect(() => {
        if (shouldShow === prevShouldShow) {
            return;
        }
        const values = {
            marginVertical: shouldShow ? CONST_1.default.HORIZONTAL_SPACER.DEFAULT_MARGIN_VERTICAL : CONST_1.default.HORIZONTAL_SPACER.HIDDEN_MARGIN_VERTICAL,
            borderBottomWidth: shouldShow ? CONST_1.default.HORIZONTAL_SPACER.DEFAULT_BORDER_BOTTOM_WIDTH : CONST_1.default.HORIZONTAL_SPACER.HIDDEN_BORDER_BOTTOM_WIDTH,
        };
        marginVertical.set(values.marginVertical);
        borderBottomWidth.set(values.borderBottomWidth);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- we only need to trigger when shouldShow prop is changed
    }, [shouldShow, prevShouldShow]);
    return <react_native_reanimated_1.default.View style={[animatedStyles, style]}/>;
}
SpacerView.displayName = 'SpacerView';
exports.default = SpacerView;
