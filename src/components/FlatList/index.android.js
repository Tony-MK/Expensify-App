"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
// FlatList wrapped with the freeze component will lose its scroll state when frozen (only for Android).
// CustomFlatList saves the offset and use it for scrollToOffset() when unfrozen.
function CustomFlatList(props, ref) {
    const lastScrollOffsetRef = (0, react_1.useRef)(0);
    const onScreenFocus = (0, react_1.useCallback)(() => {
        if (typeof ref === 'function') {
            return;
        }
        if (!ref?.current || !lastScrollOffsetRef.current) {
            return;
        }
        if (ref.current && lastScrollOffsetRef.current) {
            ref.current.scrollToOffset({ offset: lastScrollOffsetRef.current, animated: false });
        }
    }, [ref]);
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    const onMomentumScrollEnd = (0, react_1.useCallback)((event) => {
        lastScrollOffsetRef.current = event.nativeEvent.contentOffset.y;
    }, []);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        onScreenFocus();
    }, [onScreenFocus]));
    return (<react_native_1.FlatList 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} onScroll={props.onScroll} onMomentumScrollEnd={onMomentumScrollEnd} ref={ref}/>);
}
CustomFlatList.displayName = 'CustomFlatListWithRef';
exports.default = (0, react_1.forwardRef)(CustomFlatList);
