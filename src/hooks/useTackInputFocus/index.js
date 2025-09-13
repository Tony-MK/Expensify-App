"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useTackInputFocus;
const react_1 = require("react");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const Browser_1 = require("@libs/Browser");
const CONST_1 = require("@src/CONST");
/**
 * Detects input or text area focus on browsers, to avoid scrolling on virtual viewports
 */
function useTackInputFocus(enable = false) {
    const [, isInputFocusDebounced, setIsInputFocus] = (0, useDebouncedState_1.default)(false);
    const handleFocusIn = (0, react_1.useCallback)((event) => {
        const targetElement = event.target;
        if (targetElement.tagName === CONST_1.default.ELEMENT_NAME.INPUT || targetElement.tagName === CONST_1.default.ELEMENT_NAME.TEXTAREA) {
            setIsInputFocus(true);
        }
    }, [setIsInputFocus]);
    const handleFocusOut = (0, react_1.useCallback)((event) => {
        const targetElement = event.target;
        if (targetElement.tagName === CONST_1.default.ELEMENT_NAME.INPUT || targetElement.tagName === CONST_1.default.ELEMENT_NAME.TEXTAREA) {
            setIsInputFocus(false);
        }
    }, [setIsInputFocus]);
    (0, react_1.useEffect)(() => {
        if (!enable) {
            return;
        }
        // Putting the function here so a new instance of the function is created for each usage of the hook
        const resetScrollPositionOnVisualViewport = () => {
            if ((0, Browser_1.isChromeIOS)() && window.visualViewport?.offsetTop) {
                // On Chrome iOS, the visual viewport triggers a scroll event when the keyboard is opened, but some time the scroll position is not correct.
                // So this change is specific to Chrome iOS, helping to reset the viewport position correctly.
                window.scrollTo({ top: -window.visualViewport.offsetTop });
            }
            else {
                window.scrollTo({ top: 0 });
            }
        };
        window.addEventListener('focusin', handleFocusIn);
        window.addEventListener('focusout', handleFocusOut);
        window.visualViewport?.addEventListener('scroll', resetScrollPositionOnVisualViewport);
        return () => {
            window.removeEventListener('focusin', handleFocusIn);
            window.removeEventListener('focusout', handleFocusOut);
            window.visualViewport?.removeEventListener('scroll', resetScrollPositionOnVisualViewport);
        };
    }, [enable, handleFocusIn, handleFocusOut]);
    return isInputFocusDebounced;
}
