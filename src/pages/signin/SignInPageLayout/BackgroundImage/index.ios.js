"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expo_image_1 = require("expo-image");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const home_background__ios_svg_1 = require("@assets/images/home-background--ios.svg");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Session_1 = require("@libs/actions/Session");
const CONST_1 = require("@src/CONST");
const SplashScreenStateContext_1 = require("@src/SplashScreenStateContext");
function BackgroundImage({ width, transitionDuration }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const [isInteractionComplete, setIsInteractionComplete] = (0, react_1.useState)(false);
    const isAnonymous = (0, Session_1.isAnonymousUser)();
    const opacity = (0, react_native_reanimated_1.useSharedValue)(0);
    const animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({ opacity: opacity.get() }));
    // This sets the opacity animation for the background image once it has loaded.
    function setOpacityAnimation() {
        opacity.set((0, react_native_reanimated_1.withTiming)(1, {
            duration: CONST_1.default.MICROSECONDS_PER_MS,
            easing: react_native_reanimated_1.Easing.ease,
        }));
    }
    (0, react_1.useEffect)(() => {
        if (!isAnonymous) {
            return;
        }
        const interactionTask = react_native_1.InteractionManager.runAfterInteractions(() => {
            setIsInteractionComplete(true);
        });
        return () => {
            interactionTask.cancel();
        };
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    const { splashScreenState } = (0, SplashScreenStateContext_1.useSplashScreenStateContext)();
    // Prevent rendering the background image until the splash screen is hidden.
    // See issue: https://github.com/Expensify/App/issues/34696
    if (splashScreenState !== CONST_1.default.BOOT_SPLASH_STATE.HIDDEN || (!isInteractionComplete && isAnonymous)) {
        return;
    }
    return (<react_native_reanimated_1.default.View style={[styles.signInBackground, StyleUtils.getWidthStyle(width), animatedStyle]}>
            <expo_image_1.Image source={home_background__ios_svg_1.default} onLoadEnd={() => setOpacityAnimation()} style={[styles.signInBackground, StyleUtils.getWidthStyle(width)]} transition={transitionDuration}/>
        </react_native_reanimated_1.default.View>);
}
BackgroundImage.displayName = 'BackgroundImage';
exports.default = BackgroundImage;
