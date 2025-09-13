"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Browser_1 = require("@libs/Browser");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const CONST_1 = require("@src/CONST");
const BaseSelectionList_1 = require("./BaseSelectionList");
function SelectionList({ onScroll, shouldHideKeyboardOnScroll = true, ref, ...props }) {
    const [isScreenTouched, setIsScreenTouched] = (0, react_1.useState)(false);
    const touchStart = () => setIsScreenTouched(true);
    const touchEnd = () => setIsScreenTouched(false);
    (0, react_1.useEffect)(() => {
        if (!(0, DeviceCapabilities_1.canUseTouchScreen)()) {
            return;
        }
        // We're setting `isScreenTouched` in this listener only for web platforms with touchscreen (mWeb) where
        // we want to dismiss the keyboard only when the list is scrolled by the user and not when it's scrolled programmatically.
        document.addEventListener('touchstart', touchStart);
        document.addEventListener('touchend', touchEnd);
        return () => {
            document.removeEventListener('touchstart', touchStart);
            document.removeEventListener('touchend', touchEnd);
        };
    }, []);
    const [shouldDebounceScrolling, setShouldDebounceScrolling] = (0, react_1.useState)(false);
    const checkShouldDebounceScrolling = (event) => {
        if (!event) {
            return;
        }
        // Moving through items using the keyboard triggers scrolling by the browser, so we debounce programmatic scrolling to prevent jittering.
        if (event.key === CONST_1.default.KEYBOARD_SHORTCUTS.ARROW_DOWN.shortcutKey ||
            event.key === CONST_1.default.KEYBOARD_SHORTCUTS.ARROW_UP.shortcutKey ||
            event.key === CONST_1.default.KEYBOARD_SHORTCUTS.TAB.shortcutKey) {
            setShouldDebounceScrolling(event.type === 'keydown');
        }
    };
    (0, react_1.useEffect)(() => {
        document.addEventListener('keydown', checkShouldDebounceScrolling, { passive: true });
        document.addEventListener('keyup', checkShouldDebounceScrolling, { passive: true });
        return () => {
            document.removeEventListener('keydown', checkShouldDebounceScrolling);
            document.removeEventListener('keyup', checkShouldDebounceScrolling);
        };
    }, []);
    // In SearchPageBottomTab we use useAnimatedScrollHandler from reanimated(for performance reasons) and it returns object instead of function. In that case we cannot change it to a function call, that's why we have to choose between onScroll and defaultOnScroll.
    const defaultOnScroll = () => {
        // Only dismiss the keyboard whenever the user scrolls the screen or `shouldHideKeyboardOnScroll` is true
        if (!isScreenTouched || !shouldHideKeyboardOnScroll) {
            return;
        }
        react_native_1.Keyboard.dismiss();
    };
    return (<BaseSelectionList_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} ref={ref} onScroll={onScroll ?? defaultOnScroll} 
    // Ignore the focus if it's caused by a touch event on mobile chrome.
    // For example, a long press will trigger a focus event on mobile chrome.
    shouldIgnoreFocus={(0, Browser_1.isMobileChrome)() && isScreenTouched} shouldDebounceScrolling={shouldDebounceScrolling}/>);
}
SelectionList.displayName = 'SelectionList';
exports.default = SelectionList;
