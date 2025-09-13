"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardStateContext = void 0;
exports.KeyboardStateProvider = KeyboardStateProvider;
const react_1 = require("react");
const react_native_keyboard_controller_1 = require("react-native-keyboard-controller");
const react_native_reanimated_1 = require("react-native-reanimated");
const useSafeAreaInsets_1 = require("@hooks/useSafeAreaInsets");
const getKeyboardHeight_1 = require("@libs/getKeyboardHeight");
const KeyboardStateContext = (0, react_1.createContext)({
    isKeyboardShown: false,
    isKeyboardActive: false,
    keyboardHeight: 0,
    keyboardActiveHeight: 0,
    isKeyboardAnimatingRef: { current: false },
});
exports.KeyboardStateContext = KeyboardStateContext;
function KeyboardStateProvider({ children }) {
    const { bottom } = (0, useSafeAreaInsets_1.default)();
    const [keyboardHeight, setKeyboardHeight] = (0, react_1.useState)(0);
    const [keyboardActiveHeight, setKeyboardActiveHeight] = (0, react_1.useState)(0);
    const isKeyboardAnimatingRef = (0, react_1.useRef)(false);
    const [isKeyboardActive, setIsKeyboardActive] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const keyboardDidShowListener = react_native_keyboard_controller_1.KeyboardEvents.addListener('keyboardDidShow', (e) => {
            setKeyboardHeight((0, getKeyboardHeight_1.default)(e.height, bottom));
            setIsKeyboardActive(true);
        });
        const keyboardDidHideListener = react_native_keyboard_controller_1.KeyboardEvents.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
            setIsKeyboardActive(false);
        });
        const keyboardWillShowListener = react_native_keyboard_controller_1.KeyboardEvents.addListener('keyboardWillShow', (e) => {
            setIsKeyboardActive(true);
            setKeyboardActiveHeight(e.height);
        });
        const keyboardWillHideListener = react_native_keyboard_controller_1.KeyboardEvents.addListener('keyboardWillHide', () => {
            setIsKeyboardActive(false);
            setKeyboardActiveHeight(0);
        });
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
            keyboardWillShowListener.remove();
            keyboardWillHideListener.remove();
        };
    }, [bottom]);
    const setIsKeyboardAnimating = (0, react_1.useCallback)((isAnimating) => {
        isKeyboardAnimatingRef.current = isAnimating;
    }, []);
    (0, react_native_keyboard_controller_1.useKeyboardHandler)({
        onStart: () => {
            'worklet';
            (0, react_native_reanimated_1.runOnJS)(setIsKeyboardAnimating)(true);
        },
        onEnd: () => {
            'worklet';
            (0, react_native_reanimated_1.runOnJS)(setIsKeyboardAnimating)(false);
        },
    }, []);
    const contextValue = (0, react_1.useMemo)(() => ({
        keyboardHeight,
        keyboardActiveHeight,
        isKeyboardShown: keyboardHeight !== 0,
        isKeyboardAnimatingRef,
        isKeyboardActive,
    }), [isKeyboardActive, keyboardActiveHeight, keyboardHeight]);
    return <KeyboardStateContext.Provider value={contextValue}>{children}</KeyboardStateContext.Provider>;
}
