"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noop_1 = require("lodash/noop");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const FocusTrapForModal_1 = require("@components/FocusTrap/FocusTrapForModal");
const KeyboardAvoidingView_1 = require("@components/KeyboardAvoidingView");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const blurActiveElement_1 = require("@libs/Accessibility/blurActiveElement");
const getPlatform_1 = require("@libs/getPlatform");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const Backdrop_1 = require("./Backdrop");
const Container_1 = require("./Container");
function ReanimatedModal({ testID, animationInDelay, animationInTiming = CONST_1.default.MODAL.ANIMATION_TIMING.DEFAULT_IN, animationOutTiming = CONST_1.default.MODAL.ANIMATION_TIMING.DEFAULT_OUT, animationIn = 'fadeIn', animationOut = 'fadeOut', avoidKeyboard = false, coverScreen = true, children, hasBackdrop = true, backdropColor = 'black', backdropOpacity = variables_1.default.overlayOpacity, customBackdrop = null, isVisible = false, onModalWillShow = noop_1.default, onModalShow = noop_1.default, onModalWillHide = noop_1.default, onModalHide = noop_1.default, onDismiss, onBackdropPress = noop_1.default, onBackButtonPress = noop_1.default, style, type, statusBarTranslucent = false, onSwipeComplete, swipeDirection, swipeThreshold, shouldPreventScrollOnFocus, initialFocus, shouldIgnoreBackHandlerDuringTransition = false, ...props }) {
    const [isVisibleState, setIsVisibleState] = (0, react_1.useState)(isVisible);
    const [isContainerOpen, setIsContainerOpen] = (0, react_1.useState)(false);
    const [isTransitioning, setIsTransitioning] = (0, react_1.useState)(false);
    const { windowWidth, windowHeight } = (0, useWindowDimensions_1.default)();
    const backHandlerListener = (0, react_1.useRef)(null);
    const handleRef = (0, react_1.useRef)(undefined);
    const styles = (0, useThemeStyles_1.default)();
    const onBackButtonPressHandler = (0, react_1.useCallback)(() => {
        if (shouldIgnoreBackHandlerDuringTransition && isTransitioning) {
            return false;
        }
        if (isVisibleState) {
            onBackButtonPress();
            return true;
        }
        return false;
    }, [isVisibleState, onBackButtonPress, isTransitioning, shouldIgnoreBackHandlerDuringTransition]);
    const handleEscape = (0, react_1.useCallback)((e) => {
        if (e.key !== 'Escape' || onBackButtonPressHandler() !== true) {
            return;
        }
        e.stopImmediatePropagation();
    }, [onBackButtonPressHandler]);
    (0, react_1.useEffect)(() => {
        if ((0, getPlatform_1.default)() === CONST_1.default.PLATFORM.WEB || (0, getPlatform_1.default)() === CONST_1.default.PLATFORM.DESKTOP) {
            document.body.addEventListener('keyup', handleEscape, { capture: true });
        }
        else {
            backHandlerListener.current = react_native_1.BackHandler.addEventListener('hardwareBackPress', onBackButtonPressHandler);
        }
        return () => {
            if ((0, getPlatform_1.default)() === CONST_1.default.PLATFORM.WEB || (0, getPlatform_1.default)() === CONST_1.default.PLATFORM.DESKTOP) {
                document.body.removeEventListener('keyup', handleEscape, { capture: true });
            }
            else {
                backHandlerListener.current?.remove();
            }
        };
    }, [handleEscape, onBackButtonPressHandler]);
    (0, react_1.useEffect)(() => () => {
        if (handleRef.current) {
            react_native_1.InteractionManager.clearInteractionHandle(handleRef.current);
        }
        setIsVisibleState(false);
        setIsContainerOpen(false);
    }, 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    []);
    (0, react_1.useEffect)(() => {
        if (isVisible && !isContainerOpen && !isTransitioning) {
            handleRef.current = react_native_1.InteractionManager.createInteractionHandle();
            onModalWillShow();
            setIsVisibleState(true);
            setIsTransitioning(true);
        }
        else if (!isVisible && isContainerOpen && !isTransitioning) {
            handleRef.current = react_native_1.InteractionManager.createInteractionHandle();
            onModalWillHide();
            (0, blurActiveElement_1.default)();
            setIsVisibleState(false);
            setIsTransitioning(true);
        }
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isVisible, isContainerOpen, isTransitioning]);
    const backdropStyle = (0, react_1.useMemo)(() => {
        return { width: windowWidth, height: windowHeight, backgroundColor: backdropColor };
    }, [windowWidth, windowHeight, backdropColor]);
    const onOpenCallBack = (0, react_1.useCallback)(() => {
        setIsTransitioning(false);
        setIsContainerOpen(true);
        if (handleRef.current) {
            react_native_1.InteractionManager.clearInteractionHandle(handleRef.current);
        }
        onModalShow();
    }, [onModalShow]);
    const onCloseCallBack = (0, react_1.useCallback)(() => {
        setIsTransitioning(false);
        setIsContainerOpen(false);
        if (handleRef.current) {
            react_native_1.InteractionManager.clearInteractionHandle(handleRef.current);
        }
        // Because on Android, the Modal's onDismiss callback does not work reliably. There's a reported issue at:
        // https://stackoverflow.com/questions/58937956/react-native-modal-ondismiss-not-invoked
        // Therefore, we manually call onModalHide() here for Android.
        if ((0, getPlatform_1.default)() === CONST_1.default.PLATFORM.ANDROID) {
            onModalHide();
        }
    }, [onModalHide]);
    const containerView = (<Container_1.default pointerEvents="box-none" animationInTiming={animationInTiming} animationOutTiming={animationOutTiming} animationInDelay={animationInDelay} onOpenCallBack={onOpenCallBack} onCloseCallBack={onCloseCallBack} animationIn={animationIn} animationOut={animationOut} style={style} type={type} onSwipeComplete={onSwipeComplete} swipeDirection={swipeDirection}>
            {children}
        </Container_1.default>);
    const backdropView = (<Backdrop_1.default isBackdropVisible={isVisible} style={backdropStyle} customBackdrop={customBackdrop} onBackdropPress={onBackdropPress} animationInTiming={animationInTiming} animationOutTiming={animationOutTiming} animationInDelay={animationInDelay} backdropOpacity={backdropOpacity}/>);
    if (!coverScreen && isVisibleState) {
        return (<react_native_1.View pointerEvents="box-none" style={[styles.modalBackdrop, styles.modalContainerBox]}>
                {hasBackdrop && backdropView}
                {containerView}
            </react_native_1.View>);
    }
    const isBackdropMounted = isVisibleState || ((isTransitioning || isContainerOpen !== isVisibleState) && (0, getPlatform_1.default)() === CONST_1.default.PLATFORM.WEB);
    const modalVisibility = isVisibleState || isTransitioning || isContainerOpen !== isVisibleState;
    return (<react_native_reanimated_1.LayoutAnimationConfig skipExiting={(0, getPlatform_1.default)() !== CONST_1.default.PLATFORM.WEB}>
            <react_native_1.Modal transparent animationType="none" 
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    visible={modalVisibility} onRequestClose={onBackButtonPressHandler} statusBarTranslucent={statusBarTranslucent} testID={testID} onDismiss={() => {
            onDismiss?.();
            if ((0, getPlatform_1.default)() !== CONST_1.default.PLATFORM.ANDROID) {
                onModalHide();
            }
        }} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}>
                {isBackdropMounted && hasBackdrop && backdropView}
                {avoidKeyboard ? (<KeyboardAvoidingView_1.default behavior="padding" pointerEvents="box-none" style={[style, { margin: 0 }]}>
                        {isVisibleState && containerView}
                    </KeyboardAvoidingView_1.default>) : (<FocusTrapForModal_1.default active={modalVisibility} initialFocus={initialFocus} shouldPreventScroll={shouldPreventScrollOnFocus}>
                        {isVisibleState && containerView}
                    </FocusTrapForModal_1.default>)}
            </react_native_1.Modal>
        </react_native_reanimated_1.LayoutAnimationConfig>);
}
ReanimatedModal.displayName = 'ReanimatedModal';
exports.default = ReanimatedModal;
