"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
const shouldRenderOffscreen_1 = require("@libs/shouldRenderOffscreen");
const variables_1 = require("@styles/variables");
function OpacityView({ shouldDim, dimAnimationDuration = variables_1.default.dimAnimationDuration, children, style = [], dimmingValue = variables_1.default.hoverDimValue, needsOffscreenAlphaCompositing = false, }) {
    const opacity = (0, react_native_reanimated_1.useSharedValue)(1);
    const opacityStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        opacity: opacity.get(),
    }));
    react_1.default.useEffect(() => {
        opacity.set((0, react_native_reanimated_1.withTiming)(shouldDim ? dimmingValue : 1, { duration: dimAnimationDuration }));
    }, [shouldDim, dimmingValue, opacity, dimAnimationDuration]);
    return (<react_native_reanimated_1.default.View style={[opacityStyle, style]} needsOffscreenAlphaCompositing={shouldRenderOffscreen_1.default ? needsOffscreenAlphaCompositing : undefined}>
            {children}
        </react_native_reanimated_1.default.View>);
}
OpacityView.displayName = 'OpacityView';
exports.default = OpacityView;
