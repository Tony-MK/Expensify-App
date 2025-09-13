"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = require("react-native-reanimated");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ControlSelection_1 = require("@libs/ControlSelection");
function ImageCropView({ imageUri = '', containerSize = 0, panGesture = react_native_gesture_handler_1.Gesture.Pan(), maskImage = Expensicons.ImageCropCircleMask, ...props }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const containerStyle = StyleUtils.getWidthAndHeightStyle(containerSize, containerSize);
    const originalImageHeight = props.originalImageHeight;
    const originalImageWidth = props.originalImageWidth;
    const rotation = props.rotation;
    const translateX = props.translateX;
    const translateY = props.translateY;
    const scale = props.scale;
    // A reanimated memoized style, which updates when the image's size or scale changes.
    const imageStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        'worklet';
        const height = originalImageHeight.get();
        const width = originalImageWidth.get();
        const aspectRatio = height > width ? height / width : width / height;
        const rotate = (0, react_native_reanimated_1.interpolate)(rotation.get(), [0, 360], [0, 360]);
        return {
            transform: [{ translateX: translateX.get() }, { translateY: translateY.get() }, { scale: scale.get() * aspectRatio }, { rotate: `${rotate}deg` }],
        };
    }, [originalImageHeight, originalImageWidth, rotation, translateX, translateY, scale]);
    // We're preventing text selection with ControlSelection.blockElement to prevent safari
    // default behaviour of cursor - I-beam cursor on drag. See https://github.com/Expensify/App/issues/13688
    return (<react_native_gesture_handler_1.GestureDetector gesture={panGesture}>
            <react_native_reanimated_1.default.View ref={(el) => ControlSelection_1.default.blockElement(el)} style={[containerStyle, styles.imageCropContainer]}>
                <react_native_reanimated_1.default.Image style={[imageStyle, styles.h100, styles.w100]} source={{ uri: imageUri }} resizeMode="contain"/>
                <react_native_1.View style={[containerStyle, styles.l0, styles.b0, styles.pAbsolute]}>
                    <Icon_1.default src={maskImage} 
    // TODO uncomment the line once the tint color issue for android(https://github.com/expo/expo/issues/21530#issuecomment-1836283564) is fixed
    // fill={theme.iconReversed}
    width={containerSize} height={containerSize} key={containerSize}/>
                </react_native_1.View>
            </react_native_reanimated_1.default.View>
        </react_native_gesture_handler_1.GestureDetector>);
}
ImageCropView.displayName = 'ImageCropView';
// React.memo is needed here to prevent styles recompilation
// which sometimes may cause glitches during rerender of the modal
exports.default = react_1.default.memo(ImageCropView);
