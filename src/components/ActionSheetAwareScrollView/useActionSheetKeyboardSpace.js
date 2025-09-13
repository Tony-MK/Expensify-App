"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_keyboard_controller_1 = require("react-native-keyboard-controller");
const react_native_reanimated_1 = require("react-native-reanimated");
const useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const ActionSheetAwareScrollViewContext_1 = require("./ActionSheetAwareScrollViewContext");
const KeyboardState = {
    UNKNOWN: 0,
    OPENING: 1,
    OPEN: 2,
    CLOSING: 3,
    CLOSED: 4,
};
const SPRING_CONFIG = {
    mass: 3,
    stiffness: 1000,
    damping: 500,
};
const useAnimatedKeyboard = () => {
    const state = (0, react_native_reanimated_1.useSharedValue)(KeyboardState.UNKNOWN);
    const height = (0, react_native_reanimated_1.useSharedValue)(0);
    const lastHeight = (0, react_native_reanimated_1.useSharedValue)(0);
    const heightWhenOpened = (0, react_native_reanimated_1.useSharedValue)(0);
    (0, react_native_keyboard_controller_1.useKeyboardHandler)({
        onStart: (e) => {
            'worklet';
            // Save the last keyboard height
            if (e.height !== 0) {
                heightWhenOpened.set(e.height);
                height.set(0);
            }
            height.set(heightWhenOpened.get());
            lastHeight.set(e.height);
            state.set(e.height > 0 ? KeyboardState.OPENING : KeyboardState.CLOSING);
        },
        onMove: (e) => {
            'worklet';
            height.set(e.height);
        },
        onEnd: (e) => {
            'worklet';
            state.set(e.height > 0 ? KeyboardState.OPEN : KeyboardState.CLOSED);
            height.set(e.height);
        },
    }, []);
    return { state, height, heightWhenOpened };
};
function useActionSheetKeyboardSpace(props) {
    const { unmodifiedPaddings: { top: paddingTop = 0, bottom: paddingBottom = 0 }, } = (0, useSafeAreaPaddings_1.default)();
    const keyboard = useAnimatedKeyboard();
    const { position } = props;
    // Similar to using `global` in worklet but it's just a local object
    const syncLocalWorkletState = (0, react_native_reanimated_1.useSharedValue)(KeyboardState.UNKNOWN);
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    const { currentActionSheetState, transitionActionSheetStateWorklet: transition, resetStateMachine } = (0, react_1.useContext)(ActionSheetAwareScrollViewContext_1.ActionSheetAwareScrollViewContext);
    // Reset state machine when component unmounts
    // eslint-disable-next-line arrow-body-style
    (0, react_1.useEffect)(() => {
        return () => resetStateMachine();
    }, [resetStateMachine]);
    (0, react_native_reanimated_1.useAnimatedReaction)(() => keyboard.state.get(), (lastState) => {
        if (lastState === syncLocalWorkletState.get()) {
            return;
        }
        // eslint-disable-next-line react-compiler/react-compiler
        syncLocalWorkletState.set(lastState);
        if (lastState === KeyboardState.OPEN) {
            transition({ type: ActionSheetAwareScrollViewContext_1.Actions.OPEN_KEYBOARD });
        }
        else if (lastState === KeyboardState.CLOSED) {
            transition({ type: ActionSheetAwareScrollViewContext_1.Actions.CLOSE_KEYBOARD });
        }
    }, []);
    const translateY = (0, react_native_reanimated_1.useDerivedValue)(() => {
        const { current, previous } = currentActionSheetState.get();
        // We don't need to run any additional logic. it will always return 0 for idle state
        if (current.state === ActionSheetAwareScrollViewContext_1.States.IDLE) {
            return (0, react_native_reanimated_1.withSpring)(0, SPRING_CONFIG);
        }
        const keyboardHeight = keyboard.height.get() === 0 ? 0 : keyboard.height.get() - paddingBottom;
        // Sometimes we need to know the last keyboard height
        const lastKeyboardHeight = keyboard.heightWhenOpened.get() - paddingBottom;
        const { popoverHeight = 0, frameY, height } = current.payload ?? {};
        const invertedKeyboardHeight = keyboard.state.get() === KeyboardState.CLOSED ? lastKeyboardHeight : 0;
        const elementOffset = frameY !== undefined && height !== undefined && popoverHeight !== undefined ? frameY + paddingTop + height - (windowHeight - popoverHeight) : 0;
        // when the state is not idle we know for sure we have the previous state
        const previousPayload = previous.payload ?? {};
        const previousElementOffset = previousPayload.frameY !== undefined && previousPayload.height !== undefined && previousPayload.popoverHeight !== undefined
            ? previousPayload.frameY + paddingTop + previousPayload.height - (windowHeight - previousPayload.popoverHeight)
            : 0;
        const isOpeningKeyboard = syncLocalWorkletState.get() === 1;
        const isClosingKeyboard = syncLocalWorkletState.get() === 3;
        const isClosedKeyboard = syncLocalWorkletState.get() === 4;
        // Depending on the current and sometimes previous state we can return
        // either animation or just a value
        switch (current.state) {
            case ActionSheetAwareScrollViewContext_1.States.KEYBOARD_OPEN: {
                if (isClosedKeyboard || isOpeningKeyboard) {
                    return lastKeyboardHeight - keyboardHeight;
                }
                if (previous.state === ActionSheetAwareScrollViewContext_1.States.KEYBOARD_CLOSED_POPOVER || (previous.state === ActionSheetAwareScrollViewContext_1.States.KEYBOARD_OPEN && elementOffset < 0)) {
                    const returnValue = Math.max(keyboard.heightWhenOpened.get() - keyboard.height.get() - paddingBottom, 0) + Math.max(elementOffset, 0);
                    return returnValue;
                }
                return (0, react_native_reanimated_1.withSpring)(0, SPRING_CONFIG);
            }
            case ActionSheetAwareScrollViewContext_1.States.POPOVER_CLOSED: {
                return (0, react_native_reanimated_1.withSpring)(0, SPRING_CONFIG, () => {
                    transition({
                        type: ActionSheetAwareScrollViewContext_1.Actions.END_TRANSITION,
                    });
                });
            }
            case ActionSheetAwareScrollViewContext_1.States.POPOVER_OPEN: {
                if (popoverHeight) {
                    if (previousElementOffset !== 0 || elementOffset > previousElementOffset) {
                        const returnValue = elementOffset < 0 ? 0 : elementOffset;
                        return (0, react_native_reanimated_1.withSpring)(returnValue, SPRING_CONFIG);
                    }
                    const returnValue = Math.max(previousElementOffset, 0);
                    return (0, react_native_reanimated_1.withSpring)(returnValue, SPRING_CONFIG);
                }
                return 0;
            }
            case ActionSheetAwareScrollViewContext_1.States.KEYBOARD_POPOVER_OPEN: {
                if (keyboard.state.get() === KeyboardState.OPEN) {
                    return (0, react_native_reanimated_1.withSpring)(0, SPRING_CONFIG);
                }
                const nextOffset = elementOffset + lastKeyboardHeight;
                const scrollOffset = position?.get() ?? 0;
                // Check if there's a space not filled by content and we need to move
                const hasWhiteGap = popoverHeight &&
                    // Content would go too far up (beyond popover bounds)
                    (nextOffset < -popoverHeight ||
                        // Or content would go below top of screen (only if not significantly scrolled)
                        (nextOffset > 0 && popoverHeight < lastKeyboardHeight && scrollOffset < popoverHeight) ||
                        // Or content would create a gap by being positioned above minimum allowed position
                        (popoverHeight < lastKeyboardHeight && nextOffset > -popoverHeight && scrollOffset < popoverHeight) ||
                        // Or there's a significant gap considering scroll position
                        (popoverHeight < lastKeyboardHeight &&
                            scrollOffset > 0 &&
                            scrollOffset < popoverHeight &&
                            // When scrolled, check if the gap between content and keyboard would be too large
                            (nextOffset + scrollOffset > popoverHeight / 2 ||
                                // Or if content would be pushed too far down relative to scroll
                                elementOffset + scrollOffset > -popoverHeight / 2)));
                if (keyboard.state.get() === KeyboardState.CLOSED) {
                    if (hasWhiteGap) {
                        return (0, react_native_reanimated_1.withSpring)(nextOffset, SPRING_CONFIG);
                    }
                    if (nextOffset > invertedKeyboardHeight) {
                        return (0, react_native_reanimated_1.withSpring)(nextOffset < 0 ? 0 : nextOffset, SPRING_CONFIG);
                    }
                }
                if (elementOffset < 0) {
                    const heightDifference = (frameY ?? 0) - keyboardHeight - paddingTop - paddingBottom;
                    if (isClosingKeyboard) {
                        if (hasWhiteGap) {
                            const targetOffset = Math.max(heightDifference - (scrollOffset > 0 ? scrollOffset / 2 : 0), -popoverHeight);
                            return (0, react_native_reanimated_1.withSequence)((0, react_native_reanimated_1.withTiming)(keyboardHeight, { duration: 0 }), (0, react_native_reanimated_1.withSpring)(targetOffset, SPRING_CONFIG));
                        }
                        return (0, react_native_reanimated_1.withSpring)(Math.max(elementOffset + lastKeyboardHeight, -popoverHeight), SPRING_CONFIG);
                    }
                    if (hasWhiteGap && heightDifference > paddingTop) {
                        return (0, react_native_reanimated_1.withSequence)((0, react_native_reanimated_1.withTiming)(lastKeyboardHeight - keyboardHeight, { duration: 0 }), (0, react_native_reanimated_1.withSpring)(Math.max(heightDifference, -popoverHeight), SPRING_CONFIG));
                    }
                    return lastKeyboardHeight - keyboardHeight;
                }
                return lastKeyboardHeight;
            }
            case ActionSheetAwareScrollViewContext_1.States.KEYBOARD_CLOSED_POPOVER: {
                if (elementOffset < 0) {
                    transition({ type: ActionSheetAwareScrollViewContext_1.Actions.END_TRANSITION });
                    return 0;
                }
                if (keyboard.state.get() === KeyboardState.CLOSED) {
                    const returnValue = elementOffset + lastKeyboardHeight;
                    return returnValue;
                }
                if (keyboard.height.get() > 0) {
                    const returnValue = keyboard.heightWhenOpened.get() - keyboard.height.get() + elementOffset;
                    return returnValue;
                }
                return (0, react_native_reanimated_1.withTiming)(elementOffset + lastKeyboardHeight, {
                    duration: 0,
                });
            }
            default:
                return 0;
        }
    }, []);
    const animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        paddingTop: translateY.get(),
    }));
    return { animatedStyle };
}
exports.default = useActionSheetKeyboardSpace;
