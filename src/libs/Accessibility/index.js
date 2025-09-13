"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const moveAccessibilityFocus_1 = require("./moveAccessibilityFocus");
const useScreenReaderStatus = () => {
    const [isScreenReaderEnabled, setIsScreenReaderEnabled] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const subscription = react_native_1.AccessibilityInfo.addEventListener('screenReaderChanged', setIsScreenReaderEnabled);
        return () => {
            subscription?.remove();
        };
    }, []);
    return isScreenReaderEnabled;
};
const getHitSlopForSize = ({ x, y }) => {
    /* according to https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/adaptivity-and-layout/
    the minimum tappable area is 44x44 points */
    const minimumSize = 44;
    const hitSlopVertical = Math.max(minimumSize - x, 0) / 2;
    const hitSlopHorizontal = Math.max(minimumSize - y, 0) / 2;
    return {
        top: hitSlopVertical,
        bottom: hitSlopVertical,
        left: hitSlopHorizontal,
        right: hitSlopHorizontal,
    };
};
const useAutoHitSlop = () => {
    const [frameSize, setFrameSize] = (0, react_1.useState)({ x: 0, y: 0 });
    const onLayout = (0, react_1.useCallback)((event) => {
        const { layout } = event.nativeEvent;
        if (layout.width !== frameSize.x && layout.height !== frameSize.y) {
            setFrameSize({ x: layout.width, y: layout.height });
        }
    }, [frameSize]);
    return [getHitSlopForSize(frameSize), onLayout];
};
exports.default = {
    moveAccessibilityFocus: moveAccessibilityFocus_1.default,
    useScreenReaderStatus,
    useAutoHitSlop,
};
