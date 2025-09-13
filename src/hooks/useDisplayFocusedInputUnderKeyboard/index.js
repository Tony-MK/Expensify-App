"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var SplitListItem_1 = require("@components/SelectionList/SplitListItem");
var useDebouncedState_1 = require("@hooks/useDebouncedState");
var useDisplayFocusedInputUnderKeyboard = function () {
    var listRef = (0, react_1.useRef)(null);
    var _a = (0, react_1.useState)(-1), inputIndexIsFocused = _a[0], setInputIndexIsFocused = _a[1];
    var viewRef = (0, react_1.useRef)(null);
    var footerRef = (0, react_1.useRef)(null);
    var bottomOffset = (0, react_1.useRef)(0);
    var _b = (0, useDebouncedState_1.default)(0), scrollTrigger = _b[0], debouncedScrollTrigger = _b[1], setScrollTrigger = _b[2];
    (0, react_1.useEffect)(function () {
        var _a;
        if (debouncedScrollTrigger <= 0) {
            return;
        }
        (_a = listRef.current) === null || _a === void 0 ? void 0 : _a.scrollToFocusedInput(inputIndexIsFocused);
        // We only want this effect to run when debouncedScrollTrigger changes, not when inputIndexIsFocused changes
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedScrollTrigger]);
    var scrollToFocusedInput = function () {
        setScrollTrigger(scrollTrigger + 1);
    };
    (0, react_1.useEffect)(function () {
        scrollToFocusedInput();
        // we doesn't need scrollToFocusedInput in deps, because we want it to run only after inputIndexIsFocused changes
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputIndexIsFocused]);
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    var SplitListItemWithFocus = (0, react_1.useCallback)((function (props) { return (<SplitListItem_1.default onInputFocus={setInputIndexIsFocused} onInputBlur={function () { return setInputIndexIsFocused(-1); }} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>); }), []);
    SplitListItem_1.default.displayName = 'SplitListItemWithFocus';
    return {
        viewRef: viewRef,
        footerRef: footerRef,
        bottomOffset: bottomOffset,
        listRef: listRef,
        scrollToFocusedInput: scrollToFocusedInput,
        SplitListItem: SplitListItemWithFocus,
    };
};
exports.default = useDisplayFocusedInputUnderKeyboard;
