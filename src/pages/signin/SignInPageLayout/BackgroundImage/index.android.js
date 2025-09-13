"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expo_image_1 = require("expo-image");
const react_1 = require("react");
const react_native_1 = require("react-native");
const home_background__android_svg_1 = require("@assets/images/home-background--android.svg");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Session_1 = require("@libs/actions/Session");
function BackgroundImage({ pointerEvents, width, transitionDuration }) {
    const styles = (0, useThemeStyles_1.default)();
    const [isInteractionComplete, setIsInteractionComplete] = (0, react_1.useState)(false);
    const isAnonymous = (0, Session_1.isAnonymousUser)();
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
    // load the background image and Lottie animation only after user interactions to ensure smooth navigation transitions.
    if (!isInteractionComplete && isAnonymous) {
        return;
    }
    return (<expo_image_1.Image source={home_background__android_svg_1.default} pointerEvents={pointerEvents} style={[styles.signInBackground, { width }]} transition={transitionDuration}/>);
}
BackgroundImage.displayName = 'BackgroundImage';
exports.default = BackgroundImage;
