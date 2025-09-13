"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const GenericPressable_1 = require("./GenericPressable");
function PressableWithoutFeedback({ pressStyle, focusStyle, screenReaderActiveStyle, shouldUseHapticsOnPress, shouldUseHapticsOnLongPress = false, ref, ...rest }) {
    return (<GenericPressable_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest} ref={ref} shouldUseHapticsOnLongPress={shouldUseHapticsOnLongPress}/>);
}
PressableWithoutFeedback.displayName = 'PressableWithoutFeedback';
exports.default = PressableWithoutFeedback;
