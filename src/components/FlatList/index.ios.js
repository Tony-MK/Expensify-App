"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
// On iOS, we have to unset maintainVisibleContentPosition while the user is scrolling to prevent jumping to the beginning issue
function CustomFlatList(props, ref) {
    const { maintainVisibleContentPosition: originalMaintainVisibleContentPosition, ...rest } = props;
    const [isScrolling, setIsScrolling] = (0, react_1.useState)(false);
    const handleScrollBegin = (0, react_1.useCallback)(() => {
        setIsScrolling(true);
    }, []);
    const handleScrollEnd = (0, react_1.useCallback)(() => {
        setIsScrolling(false);
    }, []);
    const maintainVisibleContentPosition = isScrolling ? undefined : originalMaintainVisibleContentPosition;
    return (<react_native_1.FlatList 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest} ref={ref} maintainVisibleContentPosition={maintainVisibleContentPosition} onMomentumScrollBegin={handleScrollBegin} onMomentumScrollEnd={handleScrollEnd}/>);
}
CustomFlatList.displayName = 'CustomFlatListWithRef';
exports.default = (0, react_1.forwardRef)(CustomFlatList);
