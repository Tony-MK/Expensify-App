"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const new_expensify_dark_svg_1 = require("@assets/images/new-expensify-dark.svg");
const ImageSVG_1 = require("@components/ImageSVG");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const BootSplash_1 = require("@libs/BootSplash");
function SplashScreenHider({ onHide = () => { } }) {
    const styles = (0, useThemeStyles_1.default)();
    const logoSizeRatio = BootSplash_1.default.logoSizeRatio || 1;
    const opacity = (0, react_native_reanimated_1.useSharedValue)(1);
    const scale = (0, react_native_reanimated_1.useSharedValue)(1);
    const opacityStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        opacity: opacity.get(),
    }));
    const scaleStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        transform: [{ scale: scale.get() }],
    }));
    const hideHasBeenCalled = (0, react_1.useRef)(false);
    const hide = (0, react_1.useCallback)(() => {
        // hide can only be called once
        if (hideHasBeenCalled.current) {
            return;
        }
        hideHasBeenCalled.current = true;
        BootSplash_1.default.hide().then(() => {
            scale.set((0, react_native_reanimated_1.withTiming)(0, {
                duration: 200,
                easing: react_native_reanimated_1.Easing.back(2),
            }));
            opacity.set((0, react_native_reanimated_1.withTiming)(0, {
                duration: 250,
                easing: react_native_reanimated_1.Easing.out(react_native_reanimated_1.Easing.ease),
            }, () => (0, react_native_reanimated_1.runOnJS)(onHide)()));
        });
    }, [opacity, scale, onHide]);
    return (<react_native_reanimated_1.default.View style={[react_native_1.StyleSheet.absoluteFill, styles.splashScreenHider, opacityStyle]}>
            <react_native_reanimated_1.default.View style={scaleStyle}>
                <ImageSVG_1.default onLoadEnd={hide} contentFit="fill" style={{ width: 100 * logoSizeRatio, height: 100 * logoSizeRatio }} src={new_expensify_dark_svg_1.default}/>
            </react_native_reanimated_1.default.View>
        </react_native_reanimated_1.default.View>);
}
SplashScreenHider.displayName = 'SplashScreenHider';
exports.default = SplashScreenHider;
