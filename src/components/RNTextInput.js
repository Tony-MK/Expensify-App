"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const useTheme_1 = require("@hooks/useTheme");
const CONST_1 = require("@src/CONST");
// Convert the underlying TextInput into an Animated component so that we can take an animated ref and pass it to a worklet
const AnimatedTextInput = react_native_reanimated_1.default.createAnimatedComponent(react_native_1.TextInput);
function RNTextInputWithRef({ ref, forwardedFSClass = CONST_1.default.FULLSTORY.CLASS.MASK, ...props }) {
    const theme = (0, useTheme_1.default)();
    return (<AnimatedTextInput allowFontScaling={false} textBreakStrategy="simple" keyboardAppearance={theme.colorScheme} ref={(refHandle) => {
            if (typeof ref !== 'function') {
                return;
            }
            ref(refHandle);
        }} 
    // eslint-disable-next-line react/forbid-component-props
    fsClass={forwardedFSClass} 
    // eslint-disable-next-line
    {...props}/>);
}
RNTextInputWithRef.displayName = 'RNTextInputWithRef';
exports.default = RNTextInputWithRef;
