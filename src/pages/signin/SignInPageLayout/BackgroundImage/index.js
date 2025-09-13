"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Session_1 = require("@libs/actions/Session");
const BackgroundMobile = (0, react_1.lazy)(() => Promise.resolve().then(() => require('@assets/images/home-background--mobile.svg')).catch(() => ({
    default: () => null,
})));
const BackgroundDesktop = (0, react_1.lazy)(() => Promise.resolve().then(() => require('@assets/images/home-background--desktop.svg')).catch(() => ({
    default: () => null,
})));
function BackgroundImage({ width, transitionDuration, isSmallScreen = false }) {
    const styles = (0, useThemeStyles_1.default)();
    const [isInteractionComplete, setIsInteractionComplete] = (0, react_1.useState)(false);
    const isAnonymous = (0, Session_1.isAnonymousUser)();
    const BackgroundComponent = (0, react_1.useMemo)(() => {
        if (isSmallScreen) {
            return BackgroundMobile;
        }
        return BackgroundDesktop;
    }, [isSmallScreen]);
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
    if (!isInteractionComplete && isAnonymous) {
        return;
    }
    return (<react_1.Suspense fallback={null}>
            <react_native_reanimated_1.default.View style={styles.signInBackground} entering={react_native_reanimated_1.FadeIn.duration(transitionDuration)}>
                <BackgroundComponent width={width}/>
            </react_native_reanimated_1.default.View>
        </react_1.Suspense>);
}
BackgroundImage.displayName = 'BackgroundImage';
exports.default = BackgroundImage;
