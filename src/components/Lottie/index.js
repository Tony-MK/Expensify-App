"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const lottie_react_native_1 = require("lottie-react-native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useAppState_1 = require("@hooks/useAppState");
const useNetwork_1 = require("@hooks/useNetwork");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Browser_1 = require("@libs/Browser");
const isSideModalNavigator_1 = require("@libs/Navigation/helpers/isSideModalNavigator");
const CONST_1 = require("@src/CONST");
const SplashScreenStateContext_1 = require("@src/SplashScreenStateContext");
function Lottie({ source, webStyle, shouldLoadAfterInteractions, ...props }, forwardedRef) {
    const animationRef = (0, react_1.useRef)(null);
    const appState = (0, useAppState_1.default)();
    const { splashScreenState } = (0, SplashScreenStateContext_1.useSplashScreenStateContext)();
    const styles = (0, useThemeStyles_1.default)();
    const [isError, setIsError] = react_1.default.useState(false);
    (0, useNetwork_1.default)({ onReconnect: () => setIsError(false) });
    const [animationFile, setAnimationFile] = (0, react_1.useState)();
    const [isInteractionComplete, setIsInteractionComplete] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setAnimationFile(source.file);
    }, [setAnimationFile, source.file]);
    (0, react_1.useEffect)(() => {
        if (!shouldLoadAfterInteractions) {
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
    const aspectRatioStyle = styles.aspectRatioLottie(source);
    const browser = (0, Browser_1.getBrowser)();
    const [hasNavigatedAway, setHasNavigatedAway] = react_1.default.useState(false);
    const navigationContainerRef = (0, react_1.useContext)(native_1.NavigationContainerRefContext);
    const navigator = (0, react_1.useContext)(native_1.NavigationContext);
    (0, react_1.useEffect)(() => {
        if (!browser || !navigationContainerRef || !navigator) {
            return;
        }
        const unsubscribeNavigationFocus = navigator.addListener('focus', () => {
            setHasNavigatedAway(false);
            animationRef.current?.play();
        });
        return unsubscribeNavigationFocus;
    }, [browser, navigationContainerRef, navigator]);
    (0, react_1.useEffect)(() => {
        if (!browser || !navigationContainerRef || !navigator) {
            return;
        }
        const unsubscribeNavigationBlur = navigator.addListener('blur', () => {
            const state = navigationContainerRef.getRootState();
            const targetRouteName = state?.routes?.[state?.index ?? 0]?.name;
            if (!(0, isSideModalNavigator_1.default)(targetRouteName) || (0, Browser_1.isMobile)()) {
                setHasNavigatedAway(true);
            }
        });
        return unsubscribeNavigationBlur;
    }, [browser, navigationContainerRef, navigator]);
    // If user is being navigated away, let pause the animation to prevent memory leak.
    // see issue: https://github.com/Expensify/App/issues/36645
    (0, react_1.useEffect)(() => {
        if (!animationRef.current || !hasNavigatedAway) {
            return;
        }
        animationRef?.current?.pause();
    }, [hasNavigatedAway]);
    // If the page navigates to another screen, the image fails to load, app is in background state, animation file isn't ready, or the splash screen isn't hidden yet,
    // we'll just render an empty view as the fallback to prevent
    // 1. heavy rendering, see issues: https://github.com/Expensify/App/issues/34696 and https://github.com/Expensify/App/issues/47273
    // 2. lag on react navigation transitions, see issue: https://github.com/Expensify/App/issues/44812
    if (isError ||
        appState.isBackground ||
        !animationFile ||
        hasNavigatedAway ||
        splashScreenState !== CONST_1.default.BOOT_SPLASH_STATE.HIDDEN ||
        (!isInteractionComplete && shouldLoadAfterInteractions)) {
        return (<react_native_1.View style={[aspectRatioStyle, props.style]} testID={CONST_1.default.LOTTIE_VIEW_TEST_ID}/>);
    }
    return (<lottie_react_native_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} source={animationFile} key={`${hasNavigatedAway}`} ref={(ref) => {
            if (typeof forwardedRef === 'function') {
                forwardedRef(ref);
            }
            else if (forwardedRef && 'current' in forwardedRef) {
                // eslint-disable-next-line no-param-reassign
                forwardedRef.current = ref;
            }
            animationRef.current = ref;
        }} style={[aspectRatioStyle, props.style]} webStyle={{ ...aspectRatioStyle, ...webStyle }} onAnimationFailure={() => setIsError(true)} testID={CONST_1.default.LOTTIE_VIEW_TEST_ID}/>);
}
Lottie.displayName = 'Lottie';
exports.default = (0, react_1.forwardRef)(Lottie);
