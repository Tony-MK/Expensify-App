"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const AttachmentCarouselPagerContext_1 = require("@components/Attachments/AttachmentCarousel/Pager/AttachmentCarouselPagerContext");
const ImageSVG_1 = require("@components/ImageSVG");
const MultiGestureCanvas_1 = require("@components/MultiGestureCanvas");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const variables_1 = require("@styles/variables");
const IconWrapperStyles_1 = require("./IconWrapperStyles");
function Icon({ src, width = variables_1.default.iconSizeNormal, height = variables_1.default.iconSizeNormal, fill = undefined, small = false, large = false, medium = false, inline = false, additionalStyles = [], hovered = false, pressed = false, testID = '', contentFit = 'cover', isButtonIcon = false, enableMultiGestureCanvas = false, }) {
    const StyleUtils = (0, useStyleUtils_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { width: iconWidth, height: iconHeight } = StyleUtils.getIconWidthAndHeightStyle(small, medium, large, width, height, isButtonIcon);
    const iconStyles = [StyleUtils.getWidthAndHeightStyle(width ?? 0, height), IconWrapperStyles_1.default, styles.pAbsolute, additionalStyles];
    const contentSize = { width: iconWidth, height: iconHeight };
    const [canvasSize, setCanvasSize] = (0, react_1.useState)();
    const isCanvasLoading = canvasSize === undefined;
    const updateCanvasSize = (0, react_1.useCallback)(({ nativeEvent: { layout: { width: layoutWidth, height: layoutHeight }, }, }) => setCanvasSize({ width: react_native_1.PixelRatio.roundToNearestPixel(layoutWidth), height: react_native_1.PixelRatio.roundToNearestPixel(layoutHeight) }), []);
    const isScrollingEnabledFallback = (0, react_native_reanimated_1.useSharedValue)(false);
    const attachmentCarouselPagerContext = (0, react_1.useContext)(AttachmentCarouselPagerContext_1.default);
    const { onTap, onSwipeDown, pagerRef, isScrollEnabled } = (0, react_1.useMemo)(() => {
        if (attachmentCarouselPagerContext === null) {
            return { pagerRef: undefined, isScrollEnabled: isScrollingEnabledFallback, onTap: () => { }, onSwipeDown: () => { } };
        }
        return { ...attachmentCarouselPagerContext };
    }, [attachmentCarouselPagerContext, isScrollingEnabledFallback]);
    if (inline) {
        return (<react_native_1.View testID={testID} style={[StyleUtils.getWidthAndHeightStyle(width ?? 0, height), styles.bgTransparent, styles.overflowVisible]}>
                <react_native_1.View style={iconStyles}>
                    <ImageSVG_1.default src={src} width={iconWidth} height={iconHeight} fill={fill} hovered={hovered} pressed={pressed} contentFit={contentFit}/>
                </react_native_1.View>
            </react_native_1.View>);
    }
    if ((0, DeviceCapabilities_1.canUseTouchScreen)() && enableMultiGestureCanvas) {
        return (<react_native_1.View style={react_native_1.StyleSheet.absoluteFill} onLayout={updateCanvasSize}>
                {!isCanvasLoading && (<MultiGestureCanvas_1.default isActive canvasSize={canvasSize} contentSize={contentSize} zoomRange={MultiGestureCanvas_1.DEFAULT_ZOOM_RANGE} pagerRef={pagerRef} isUsedInCarousel={false} isPagerScrollEnabled={isScrollEnabled} onTap={onTap} onSwipeDown={onSwipeDown}>
                        <react_native_1.View testID={testID} style={[additionalStyles]}>
                            <ImageSVG_1.default src={src} width={iconWidth} height={iconHeight} fill={fill} hovered={hovered} pressed={pressed} contentFit={contentFit}/>
                        </react_native_1.View>
                    </MultiGestureCanvas_1.default>)}
            </react_native_1.View>);
    }
    return (<react_native_1.View testID={testID} style={additionalStyles}>
            <ImageSVG_1.default src={src} width={iconWidth} height={iconHeight} fill={fill} hovered={hovered} pressed={pressed} contentFit={contentFit}/>
        </react_native_1.View>);
}
Icon.displayName = 'Icon';
exports.default = Icon;
