"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
// Animated required for side panel navigation
// eslint-disable-next-line no-restricted-imports
const react_native_1 = require("react-native");
const react_native_modal_1 = require("react-native-modal");
const ColorSchemeWrapper_1 = require("@components/ColorSchemeWrapper");
const FocusTrapForModal_1 = require("@components/FocusTrap/FocusTrapForModal");
const NavigationBar_1 = require("@components/NavigationBar");
const ScreenWrapperOfflineIndicatorContext_1 = require("@components/ScreenWrapper/ScreenWrapperOfflineIndicatorContext");
const useKeyboardState_1 = require("@hooks/useKeyboardState");
const usePrevious_1 = require("@hooks/usePrevious");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSafeAreaInsets_1 = require("@hooks/useSafeAreaInsets");
const useSidePanel_1 = require("@hooks/useSidePanel");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const ComposerFocusManager_1 = require("@libs/ComposerFocusManager");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const NarrowPaneContext_1 = require("@libs/Navigation/AppNavigator/Navigators/NarrowPaneContext");
const Overlay_1 = require("@libs/Navigation/AppNavigator/Navigators/Overlay");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Modal_1 = require("@userActions/Modal");
const CONST_1 = require("@src/CONST");
const ModalContent_1 = require("./ModalContent");
const ModalContext_1 = require("./ModalContext");
const ReanimatedModal_1 = require("./ReanimatedModal");
const REANIMATED_MODAL_TYPES = [
    CONST_1.default.MODAL.MODAL_TYPE.BOTTOM_DOCKED,
    CONST_1.default.MODAL.MODAL_TYPE.FULLSCREEN,
    CONST_1.default.MODAL.MODAL_TYPE.POPOVER,
    CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED,
    CONST_1.default.MODAL.MODAL_TYPE.CENTERED,
    CONST_1.default.MODAL.MODAL_TYPE.CENTERED_SMALL,
    CONST_1.default.MODAL.MODAL_TYPE.CENTERED_UNSWIPEABLE,
    CONST_1.default.MODAL.MODAL_TYPE.CENTERED_SWIPEABLE_TO_RIGHT,
    CONST_1.default.MODAL.MODAL_TYPE.CONFIRM,
];
function ModalComponent({ type, shouldUseReanimatedModal, isVisible, shouldPreventScrollOnFocus, initialFocus, children, saveFocusState, onDismiss = () => { }, isKeyboardActive, ...props }) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    if ((type && REANIMATED_MODAL_TYPES.includes(type)) || shouldUseReanimatedModal) {
        return (<ReanimatedModal_1.default 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props} type={type} isVisible={isVisible} shouldPreventScrollOnFocus={shouldPreventScrollOnFocus} initialFocus={initialFocus} onDismiss={onDismiss}>
                <ModalContent_1.default onModalWillShow={saveFocusState} onDismiss={onDismiss}>
                    {children}
                </ModalContent_1.default>
                {!isKeyboardActive && <NavigationBar_1.default />}
            </ReanimatedModal_1.default>);
    }
    return (<react_native_modal_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} isVisible={isVisible} onDismiss={onDismiss}>
            <ModalContent_1.default onModalWillShow={saveFocusState} onDismiss={onDismiss}>
                <FocusTrapForModal_1.default active={isVisible} initialFocus={initialFocus} shouldPreventScroll={shouldPreventScrollOnFocus}>
                    {children}
                </FocusTrapForModal_1.default>
            </ModalContent_1.default>
            {!isKeyboardActive && <NavigationBar_1.default />}
        </react_native_modal_1.default>);
}
function BaseModal({ isVisible, onClose, shouldSetModalVisibility = true, onModalHide = () => { }, type, popoverAnchorPosition = {}, innerContainerStyle = {}, outerStyle, onModalShow = () => { }, onModalWillShow, onModalWillHide, propagateSwipe, fullscreen = true, animationIn, animationOut, useNativeDriver, useNativeDriverForBackdrop, hideModalContentWhileAnimating = false, animationInTiming, animationOutTiming, animationInDelay, statusBarTranslucent = true, navigationBarTranslucent = true, onLayout, avoidKeyboard = false, children, shouldUseCustomBackdrop = false, onBackdropPress, modalId, shouldEnableNewFocusManagement = false, restoreFocusType, shouldUseModalPaddingStyle = true, initialFocus = false, swipeThreshold = 150, swipeDirection, shouldPreventScrollOnFocus = false, disableAnimationIn = false, enableEdgeToEdgeBottomSafeAreaPadding, shouldApplySidePanelOffset = type === CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED, hasBackdrop, backdropOpacity, shouldUseReanimatedModal = false, shouldDisableBottomSafeAreaPadding = false, shouldIgnoreBackHandlerDuringTransition = false, forwardedFSClass = CONST_1.default.FULLSTORY.CLASS.UNMASK, }, ref) {
    // When the `enableEdgeToEdgeBottomSafeAreaPadding` prop is explicitly set, we enable edge-to-edge mode.
    const isUsingEdgeToEdgeMode = enableEdgeToEdgeBottomSafeAreaPadding !== undefined;
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { windowWidth, windowHeight } = (0, useWindowDimensions_1.default)();
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to apply correct modal width
    const canUseTouchScreen = (0, DeviceCapabilities_1.canUseTouchScreen)();
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth, shouldUseNarrowLayout, isInNarrowPaneModal } = (0, useResponsiveLayout_1.default)();
    const { sidePanelOffset } = (0, useSidePanel_1.default)();
    const sidePanelStyle = !shouldUseReanimatedModal && shouldApplySidePanelOffset && !isSmallScreenWidth ? { paddingRight: sidePanelOffset.current } : undefined;
    const sidePanelAnimatedStyle = (shouldUseReanimatedModal || type === CONST_1.default.MODAL.MODAL_TYPE.POPOVER || type === CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED) && shouldApplySidePanelOffset && !isSmallScreenWidth
        ? { transform: [{ translateX: react_native_1.Animated.multiply(sidePanelOffset.current, -1) }] }
        : undefined;
    const keyboardStateContextValue = (0, useKeyboardState_1.default)();
    const [modalOverlapsWithTopSafeArea, setModalOverlapsWithTopSafeArea] = (0, react_1.useState)(false);
    const [modalHeight, setModalHeight] = (0, react_1.useState)(0);
    const insets = (0, useSafeAreaInsets_1.default)();
    const shouldCallHideModalOnUnmount = (0, react_1.useRef)(false);
    const hideModalCallbackRef = (0, react_1.useRef)(undefined);
    const wasVisible = (0, usePrevious_1.default)(isVisible);
    const uniqueModalId = (0, react_1.useMemo)(() => modalId ?? ComposerFocusManager_1.default.getId(), [modalId]);
    const saveFocusState = (0, react_1.useCallback)(() => {
        if (shouldEnableNewFocusManagement) {
            ComposerFocusManager_1.default.saveFocusState(uniqueModalId);
        }
        ComposerFocusManager_1.default.resetReadyToFocus(uniqueModalId);
    }, [shouldEnableNewFocusManagement, uniqueModalId]);
    /**
     * Hides modal
     * @param callHideCallback - Should we call the onModalHide callback
     */
    const hideModal = (0, react_1.useCallback)((callHideCallback = true) => {
        shouldCallHideModalOnUnmount.current = false;
        if ((0, Modal_1.areAllModalsHidden)()) {
            (0, Modal_1.willAlertModalBecomeVisible)(false);
            if (shouldSetModalVisibility && !Navigation_1.default.isTopmostRouteModalScreen()) {
                (0, Modal_1.setModalVisibility)(false);
            }
        }
        if (callHideCallback) {
            onModalHide();
        }
        (0, Modal_1.onModalDidClose)();
        ComposerFocusManager_1.default.refocusAfterModalFullyClosed(uniqueModalId, restoreFocusType);
    }, [shouldSetModalVisibility, onModalHide, restoreFocusType, uniqueModalId]);
    (0, react_1.useEffect)(() => {
        let removeOnCloseListener;
        if (isVisible) {
            shouldCallHideModalOnUnmount.current = true;
            (0, Modal_1.willAlertModalBecomeVisible)(true, type === CONST_1.default.MODAL.MODAL_TYPE.POPOVER || type === CONST_1.default.MODAL.MODAL_TYPE.BOTTOM_DOCKED);
            // To handle closing any modal already visible when this modal is mounted, i.e. PopoverReportActionContextMenu
            if (onClose) {
                removeOnCloseListener = (0, Modal_1.setCloseModal)(onClose);
            }
        }
        return () => {
            if (!removeOnCloseListener) {
                return;
            }
            removeOnCloseListener();
        };
    }, [isVisible, wasVisible, onClose, type]);
    (0, react_1.useEffect)(() => {
        hideModalCallbackRef.current = hideModal;
    }, [hideModal]);
    (0, react_1.useEffect)(() => () => {
        if (!shouldCallHideModalOnUnmount.current) {
            return;
        }
        hideModalCallbackRef.current?.(true);
    }, 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    []);
    const handleShowModal = (0, react_1.useCallback)(() => {
        if (shouldSetModalVisibility) {
            (0, Modal_1.setModalVisibility)(true, type);
        }
        onModalShow();
    }, [onModalShow, shouldSetModalVisibility, type]);
    const handleBackdropPress = (e) => {
        if (e?.key === CONST_1.default.KEYBOARD_SHORTCUTS.ENTER.shortcutKey) {
            return;
        }
        if (onBackdropPress) {
            onBackdropPress();
        }
        else {
            onClose?.();
        }
    };
    const handleDismissModal = () => {
        ComposerFocusManager_1.default.setReadyToFocus(uniqueModalId);
    };
    // Checks if modal overlaps with topSafeArea. Used to offset tall bottom docked modals with keyboard.
    (0, react_1.useEffect)(() => {
        if (type !== CONST_1.default.MODAL.MODAL_TYPE.BOTTOM_DOCKED || !canUseTouchScreen || !isSmallScreenWidth) {
            return;
        }
        const { paddingTop } = StyleUtils.getPlatformSafeAreaPadding(insets);
        const availableHeight = windowHeight - modalHeight - keyboardStateContextValue.keyboardActiveHeight - paddingTop;
        setModalOverlapsWithTopSafeArea((keyboardStateContextValue.isKeyboardAnimatingRef.current || keyboardStateContextValue.isKeyboardActive) && Math.floor(availableHeight) <= 0);
    }, [
        StyleUtils,
        insets,
        keyboardStateContextValue.isKeyboardActive,
        keyboardStateContextValue.isKeyboardAnimatingRef,
        keyboardStateContextValue.keyboardActiveHeight,
        modalHeight,
        type,
        windowHeight,
        modalOverlapsWithTopSafeArea,
        canUseTouchScreen,
        isSmallScreenWidth,
    ]);
    const onViewLayout = (e) => {
        setModalHeight(e.nativeEvent.layout.height);
    };
    const { modalStyle, modalContainerStyle, animationIn: modalStyleAnimationIn, animationOut: modalStyleAnimationOut, shouldAddTopSafeAreaMargin, shouldAddBottomSafeAreaMargin, shouldAddTopSafeAreaPadding, shouldAddBottomSafeAreaPadding, hideBackdrop, } = (0, react_1.useMemo)(() => StyleUtils.getModalStyles(type, {
        windowWidth,
        windowHeight,
        isSmallScreenWidth,
        shouldUseNarrowLayout,
    }, popoverAnchorPosition, innerContainerStyle, outerStyle, shouldUseModalPaddingStyle, {
        modalOverlapsWithTopSafeArea,
        shouldDisableBottomSafeAreaPadding: !!shouldDisableBottomSafeAreaPadding,
    }), [
        StyleUtils,
        type,
        windowWidth,
        windowHeight,
        isSmallScreenWidth,
        shouldUseNarrowLayout,
        popoverAnchorPosition,
        innerContainerStyle,
        outerStyle,
        shouldUseModalPaddingStyle,
        modalOverlapsWithTopSafeArea,
        shouldDisableBottomSafeAreaPadding,
    ]);
    const modalPaddingStyles = (0, react_1.useMemo)(() => {
        const paddings = StyleUtils.getModalPaddingStyles({
            shouldAddBottomSafeAreaMargin,
            shouldAddTopSafeAreaMargin,
            // enableEdgeToEdgeBottomSafeAreaPadding is used as a temporary solution to disable safe area bottom spacing on modals, to allow edge-to-edge content
            shouldAddBottomSafeAreaPadding: !isUsingEdgeToEdgeMode && (!avoidKeyboard || !keyboardStateContextValue.isKeyboardActive) && shouldAddBottomSafeAreaPadding,
            shouldAddTopSafeAreaPadding,
            modalContainerStyle,
            insets,
        });
        return shouldUseModalPaddingStyle ? paddings : { paddingLeft: paddings.paddingLeft, paddingRight: paddings.paddingRight };
    }, [
        StyleUtils,
        avoidKeyboard,
        insets,
        isUsingEdgeToEdgeMode,
        keyboardStateContextValue.isKeyboardActive,
        modalContainerStyle,
        shouldAddBottomSafeAreaMargin,
        shouldAddBottomSafeAreaPadding,
        shouldAddTopSafeAreaMargin,
        shouldAddTopSafeAreaPadding,
        shouldUseModalPaddingStyle,
    ]);
    const modalContextValue = (0, react_1.useMemo)(() => ({
        activeModalType: isVisible ? type : undefined,
        default: false,
    }), [isVisible, type]);
    const animationInProps = (0, react_1.useMemo)(() => {
        // disableAnimationIn applies only to legacy modals. This should be removed once we fully migrate to `reanimated-modal`.
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (disableAnimationIn && ((type && !REANIMATED_MODAL_TYPES.includes(type)) || !shouldUseReanimatedModal)) {
            // We need to apply these animation props to completely disable the "animation in". Simply setting it to 0 and undefined will not work.
            // Based on: https://github.com/react-native-modal/react-native-modal/issues/191
            return {
                animationIn: { from: { opacity: 1 }, to: { opacity: 1 } },
                animationInTiming: 0,
            };
        }
        return {
            animationIn: animationIn ?? modalStyleAnimationIn,
            animationInDelay,
            animationInTiming,
        };
    }, [animationIn, animationInDelay, animationInTiming, disableAnimationIn, modalStyleAnimationIn, shouldUseReanimatedModal, type]);
    // In Modals we need to reset the ScreenWrapperOfflineIndicatorContext to allow nested ScreenWrapper components to render offline indicators,
    // except if we are in a narrow pane navigator. In this case, we use the narrow pane's original values.
    const { isInNarrowPane } = (0, react_1.useContext)(NarrowPaneContext_1.default);
    const { originalValues } = (0, react_1.useContext)(ScreenWrapperOfflineIndicatorContext_1.default);
    const offlineIndicatorContextValue = (0, react_1.useMemo)(() => (isInNarrowPane ? (originalValues ?? {}) : {}), [isInNarrowPane, originalValues]);
    const backdropOpacityAdjusted = hideBackdrop || (type === CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED && !isSmallScreenWidth && (isInNarrowPane || isInNarrowPaneModal)) // right_docked modals shouldn't add backdrops when opened in same-width RHP
        ? 0
        : backdropOpacity;
    return (<ModalContext_1.default.Provider value={modalContextValue}>
            <ScreenWrapperOfflineIndicatorContext_1.default.Provider value={offlineIndicatorContextValue}>
                <react_native_1.View 
    // this is a workaround for modal not being visible on the new arch in some cases
    // it's necessary to have a non-collapsible view as a parent of the modal to prevent
    // a conflict between RN core and Reanimated shadow tree operations
    // position absolute is needed to prevent the view from interfering with flex layout
    collapsable={false} style={[styles.pAbsolute, { zIndex: 1 }]}>
                    <ModalComponent 
    // Prevent the parent element to capture a click. This is useful when the modal component is put inside a pressable.
    onClick={(e) => e.stopPropagation()} onBackdropPress={handleBackdropPress} 
    // Note: Escape key on web/desktop will trigger onBackButtonPress callback
    // eslint-disable-next-line react/jsx-props-no-multi-spaces
    onBackButtonPress={Modal_1.closeTop} onModalShow={handleShowModal} propagateSwipe={propagateSwipe} onModalHide={hideModal} onModalWillShow={() => {
            saveFocusState();
            onModalWillShow?.();
        }} onModalWillHide={onModalWillHide} onDismiss={handleDismissModal} onSwipeComplete={onClose} swipeDirection={swipeDirection} shouldPreventScrollOnFocus={shouldPreventScrollOnFocus} initialFocus={initialFocus} swipeThreshold={swipeThreshold} isVisible={isVisible} backdropColor={theme.overlay} backdropOpacity={backdropOpacityAdjusted} backdropTransitionOutTiming={0} hasBackdrop={hasBackdrop ?? fullscreen} coverScreen={fullscreen} style={[modalStyle, sidePanelStyle]} deviceHeight={windowHeight} deviceWidth={windowWidth} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...animationInProps} animationOut={animationOut ?? modalStyleAnimationOut} animationOutTiming={animationOutTiming} useNativeDriver={useNativeDriver} useNativeDriverForBackdrop={useNativeDriverForBackdrop} hideModalContentWhileAnimating={hideModalContentWhileAnimating} statusBarTranslucent={statusBarTranslucent} navigationBarTranslucent={navigationBarTranslucent} onLayout={onLayout} avoidKeyboard={avoidKeyboard} customBackdrop={shouldUseCustomBackdrop ? <Overlay_1.default onPress={handleBackdropPress}/> : undefined} type={type} shouldUseReanimatedModal={shouldUseReanimatedModal} isKeyboardActive={keyboardStateContextValue?.isKeyboardActive} saveFocusState={saveFocusState} shouldIgnoreBackHandlerDuringTransition={shouldIgnoreBackHandlerDuringTransition}>
                        <react_native_1.Animated.View onLayout={onViewLayout} style={[styles.defaultModalContainer, modalContainerStyle, modalPaddingStyles, !isVisible && styles.pointerEventsNone, sidePanelAnimatedStyle]} ref={ref} fsClass={forwardedFSClass}>
                            <ColorSchemeWrapper_1.default>{children}</ColorSchemeWrapper_1.default>
                        </react_native_1.Animated.View>
                    </ModalComponent>
                </react_native_1.View>
            </ScreenWrapperOfflineIndicatorContext_1.default.Provider>
        </ModalContext_1.default.Provider>);
}
BaseModal.displayName = 'BaseModalWithRef';
exports.default = (0, react_1.forwardRef)(BaseModal);
