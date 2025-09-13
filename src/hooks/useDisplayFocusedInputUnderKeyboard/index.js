"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SplitListItem_1 = require("@components/SelectionList/SplitListItem");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useDisplayFocusedInputUnderKeyboard = () => {
    const listRef = (0, react_1.useRef)(null);
    const [inputIndexIsFocused, setInputIndexIsFocused] = (0, react_1.useState)(-1);
    const viewRef = (0, react_1.useRef)(null);
    const footerRef = (0, react_1.useRef)(null);
    const bottomOffset = (0, react_1.useRef)(0);
    const [scrollTrigger, debouncedScrollTrigger, setScrollTrigger] = (0, useDebouncedState_1.default)(0);
    (0, react_1.useEffect)(() => {
        if (debouncedScrollTrigger <= 0) {
            return;
        }
        listRef.current?.scrollToFocusedInput(inputIndexIsFocused);
        // We only want this effect to run when debouncedScrollTrigger changes, not when inputIndexIsFocused changes
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedScrollTrigger]);
    const scrollToFocusedInput = () => {
        setScrollTrigger(scrollTrigger + 1);
    };
    (0, react_1.useEffect)(() => {
        scrollToFocusedInput();
        // we doesn't need scrollToFocusedInput in deps, because we want it to run only after inputIndexIsFocused changes
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputIndexIsFocused]);
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const SplitListItemWithFocus = (0, react_1.useCallback)(((props) => (<SplitListItem_1.default onInputFocus={setInputIndexIsFocused} onInputBlur={() => setInputIndexIsFocused(-1)} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>)), []);
    SplitListItem_1.default.displayName = 'SplitListItemWithFocus';
    return {
        viewRef,
        footerRef,
        bottomOffset,
        listRef,
        scrollToFocusedInput,
        SplitListItem: SplitListItemWithFocus,
    };
};
exports.default = useDisplayFocusedInputUnderKeyboard;
