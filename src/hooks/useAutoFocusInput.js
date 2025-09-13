"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useAutoFocusInput;
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ComposerFocusManager_1 = require("@libs/ComposerFocusManager");
const InputUtils_1 = require("@libs/InputUtils");
const isWindowReadyToFocus_1 = require("@libs/isWindowReadyToFocus");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SplashScreenStateContext_1 = require("@src/SplashScreenStateContext");
const useOnyx_1 = require("./useOnyx");
const useSidePanel_1 = require("./useSidePanel");
function useAutoFocusInput(isMultiline = false) {
    const [isInputInitialized, setIsInputInitialized] = (0, react_1.useState)(false);
    const [isScreenTransitionEnded, setIsScreenTransitionEnded] = (0, react_1.useState)(false);
    const [modal] = (0, useOnyx_1.default)(ONYXKEYS_1.default.MODAL, { canBeMissing: true });
    const isPopoverVisible = modal?.willAlertModalBecomeVisible && modal?.isPopover;
    const { splashScreenState } = (0, SplashScreenStateContext_1.useSplashScreenStateContext)();
    const inputRef = (0, react_1.useRef)(null);
    const focusTimeoutRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!isScreenTransitionEnded || !isInputInitialized || !inputRef.current || splashScreenState !== CONST_1.default.BOOT_SPLASH_STATE.HIDDEN || isPopoverVisible) {
            return;
        }
        const focusTaskHandle = react_native_1.InteractionManager.runAfterInteractions(() => {
            if (inputRef.current && isMultiline) {
                (0, InputUtils_1.moveSelectionToEnd)(inputRef.current);
            }
            (0, isWindowReadyToFocus_1.default)().then(() => inputRef.current?.focus());
            setIsScreenTransitionEnded(false);
        });
        return () => {
            focusTaskHandle.cancel();
        };
    }, [isMultiline, isScreenTransitionEnded, isInputInitialized, splashScreenState, isPopoverVisible]);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        focusTimeoutRef.current = setTimeout(() => {
            setIsScreenTransitionEnded(true);
        }, CONST_1.default.ANIMATED_TRANSITION);
        return () => {
            setIsScreenTransitionEnded(false);
            if (!focusTimeoutRef.current) {
                return;
            }
            clearTimeout(focusTimeoutRef.current);
        };
    }, []));
    // Trigger focus when Side Panel transition ends
    const { isSidePanelTransitionEnded, shouldHideSidePanel } = (0, useSidePanel_1.default)();
    (0, react_1.useEffect)(() => {
        if (!shouldHideSidePanel) {
            return;
        }
        Promise.all([ComposerFocusManager_1.default.isReadyToFocus(), (0, isWindowReadyToFocus_1.default)()]).then(() => setIsScreenTransitionEnded(isSidePanelTransitionEnded));
    }, [isSidePanelTransitionEnded, shouldHideSidePanel]);
    const inputCallbackRef = (ref) => {
        inputRef.current = ref;
        if (isInputInitialized) {
            return;
        }
        if (ref && isMultiline) {
            (0, InputUtils_1.scrollToBottom)(ref);
        }
        setIsInputInitialized(true);
    };
    return { inputCallbackRef, inputRef };
}
