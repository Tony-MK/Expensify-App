"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_vision_camera_1 = require("react-native-vision-camera");
// Wraps a camera that will only be active when the tab is focused or as soon as it starts to become focused.
function Camera({ cameraTabIndex, ...props }, ref) {
    const isCameraActive = (0, native_1.useIsFocused)();
    return (<react_native_vision_camera_1.Camera ref={ref} photoQualityBalance="speed" 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} isActive={isCameraActive}/>);
}
Camera.displayName = 'NavigationAwareCamera';
exports.default = react_1.default.forwardRef(Camera);
