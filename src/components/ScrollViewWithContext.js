"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollContext = void 0;
const react_1 = require("react");
const ScrollView_1 = require("./ScrollView");
const MIN_SMOOTH_SCROLL_EVENT_THROTTLE = 16;
const ScrollContext = (0, react_1.createContext)({
    contentOffsetY: 0,
    scrollViewRef: null,
});
exports.ScrollContext = ScrollContext;
/*
 * <ScrollViewWithContext /> is a wrapper around <ScrollView /> that provides a ref to the <ScrollView />.
 * <ScrollViewWithContext /> can be used as a direct replacement for <ScrollView />
 * if it contains one or more <Picker /> / <RNPickerSelect /> components.
 * Using this wrapper will automatically handle scrolling to the picker's <TextInput />
 * when the picker modal is opened
 */
function ScrollViewWithContext({ onScroll, scrollEventThrottle, children, ref, ...restProps }) {
    const [contentOffsetY, setContentOffsetY] = (0, react_1.useState)(0);
    const defaultScrollViewRef = (0, react_1.useRef)(null);
    const scrollViewRef = ref ?? defaultScrollViewRef;
    const setContextScrollPosition = (event) => {
        if (onScroll) {
            onScroll(event);
        }
        setContentOffsetY(event.nativeEvent.contentOffset.y);
    };
    const contextValue = (0, react_1.useMemo)(() => ({
        scrollViewRef,
        contentOffsetY,
    }), [scrollViewRef, contentOffsetY]);
    return (<ScrollView_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restProps} ref={scrollViewRef} onScroll={setContextScrollPosition} 
    // It's possible for scrollEventThrottle to be 0, so we must use "||" to fallback to MIN_SMOOTH_SCROLL_EVENT_THROTTLE.
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    scrollEventThrottle={scrollEventThrottle || MIN_SMOOTH_SCROLL_EVENT_THROTTLE}>
            <ScrollContext.Provider value={contextValue}>{children}</ScrollContext.Provider>
        </ScrollView_1.default>);
}
ScrollViewWithContext.displayName = 'ScrollViewWithContext';
exports.default = ScrollViewWithContext;
