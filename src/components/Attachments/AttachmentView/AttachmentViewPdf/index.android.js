"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = require("react-native-reanimated");
const AttachmentCarouselPagerContext_1 = require("@components/Attachments/AttachmentCarousel/Pager/AttachmentCarouselPagerContext");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const BaseAttachmentViewPdf_1 = require("./BaseAttachmentViewPdf");
// If the user pans less than this threshold, we'll not enable/disable the pager scroll, since the touch will most probably be a tap.
// If the user moves their finger more than this threshold in the X direction, we'll enable the pager scroll. Otherwise if in the Y direction, we'll disable it.
const SCROLL_THRESHOLD = 10;
function AttachmentViewPdf(props) {
    const styles = (0, useThemeStyles_1.default)();
    const attachmentCarouselPagerContext = (0, react_1.useContext)(AttachmentCarouselPagerContext_1.default);
    const scale = (0, react_native_reanimated_1.useSharedValue)(1);
    // Reanimated freezes all objects captured in the closure of a worklet.
    // Since Reanimated 3, entire objects are captured instead of just the relevant properties.
    // See https://github.com/software-mansion/react-native-reanimated/pull/4060
    // Because context contains more properties, all of them (most notably the pager ref) were
    // frozen, which combined with Reanimated using strict mode since 3.6.0 was resulting in errors.
    // Without strict mode, it would just silently fail.
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze#description
    const isScrollEnabled = attachmentCarouselPagerContext === null ? undefined : attachmentCarouselPagerContext.isScrollEnabled;
    const offsetX = (0, react_native_reanimated_1.useSharedValue)(0);
    const offsetY = (0, react_native_reanimated_1.useSharedValue)(0);
    const isPanGestureActive = (0, react_native_reanimated_1.useSharedValue)(false);
    const Pan = react_native_gesture_handler_1.Gesture.Pan()
        .manualActivation(true)
        .onTouchesMove((evt) => {
        if (offsetX.get() !== 0 && offsetY.get() !== 0 && isScrollEnabled && scale.get() === 1) {
            const translateX = Math.abs((evt.allTouches.at(0)?.absoluteX ?? 0) - offsetX.get());
            const translateY = Math.abs((evt.allTouches.at(0)?.absoluteY ?? 0) - offsetY.get());
            const allowEnablingScroll = !isPanGestureActive.get() || isScrollEnabled.get();
            // if the value of X is greater than Y and the pdf is not zoomed in,
            // enable  the pager scroll so that the user
            // can swipe to the next attachment otherwise disable it.
            if (translateX > translateY && translateX > SCROLL_THRESHOLD && allowEnablingScroll) {
                // eslint-disable-next-line react-compiler/react-compiler
                isScrollEnabled.set(true);
            }
            else if (translateY > SCROLL_THRESHOLD) {
                isScrollEnabled.set(false);
            }
        }
        isPanGestureActive.set(true);
        offsetX.set(evt.allTouches.at(0)?.absoluteX ?? 0);
        offsetY.set(evt.allTouches.at(0)?.absoluteY ?? 0);
    })
        .onTouchesUp(() => {
        isPanGestureActive.set(false);
        if (!isScrollEnabled) {
            return;
        }
        isScrollEnabled.set(scale.get() === 1);
    });
    const Content = (0, react_1.useMemo)(() => (<BaseAttachmentViewPdf_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} onScaleChanged={(newScale) => {
            // The react-native-pdf's onScaleChanged event will sometimes give us scale values of e.g. 0.99... instead of 1,
            // even though we're not pinching/zooming
            // Rounding the scale value to 2 decimal place fixes this issue, since pinching will still be possible but very small pinches are ignored.
            scale.set(Math.round(newScale * 1e2) / 1e2);
        }}/>), [props, scale]);
    return (<react_native_1.View collapsable={false} style={styles.flex1}>
            {attachmentCarouselPagerContext === null ? (Content) : (<react_native_gesture_handler_1.GestureDetector gesture={Pan}>
                    <react_native_reanimated_1.default.View collapsable={false} style={[react_native_1.StyleSheet.absoluteFill, styles.justifyContentCenter, styles.alignItemsCenter]}>
                        {Content}
                    </react_native_reanimated_1.default.View>
                </react_native_gesture_handler_1.GestureDetector>)}
        </react_native_1.View>);
}
exports.default = (0, react_1.memo)(AttachmentViewPdf);
