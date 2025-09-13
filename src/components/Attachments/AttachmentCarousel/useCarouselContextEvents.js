"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
function useCarouselContextEvents(setShouldShowArrows) {
    const scale = (0, react_1.useRef)(1);
    const isScrollEnabled = (0, react_native_reanimated_1.useSharedValue)(true);
    /**
     * Toggles the arrows visibility
     */
    const onRequestToggleArrows = (0, react_1.useCallback)((showArrows) => {
        if (showArrows === undefined) {
            setShouldShowArrows?.((prevShouldShowArrows) => !prevShouldShowArrows);
            return;
        }
        setShouldShowArrows?.(showArrows);
    }, [setShouldShowArrows]);
    /**
     * This callback is passed to the MultiGestureCanvas/Lightbox through the AttachmentCarouselPagerContext.
     * It is used to react to zooming/pinching and (mostly) enabling/disabling scrolling on the pager,
     * as well as enabling/disabling the carousel buttons.
     */
    const handleScaleChange = (0, react_1.useCallback)((newScale) => {
        if (newScale === scale.current) {
            return;
        }
        scale.current = newScale;
        const newIsScrollEnabled = newScale === 1;
        if (isScrollEnabled.get() === newIsScrollEnabled) {
            return;
        }
        isScrollEnabled.set(newIsScrollEnabled);
        onRequestToggleArrows(newIsScrollEnabled);
    }, [isScrollEnabled, onRequestToggleArrows]);
    /**
     * This callback is passed to the MultiGestureCanvas/Lightbox through the AttachmentCarouselPagerContext.
     * It is used to trigger touch events on the pager when the user taps on the MultiGestureCanvas/Lightbox.
     */
    const handleTap = (0, react_1.useCallback)(() => {
        if (!isScrollEnabled.get()) {
            return;
        }
        onRequestToggleArrows();
    }, [isScrollEnabled, onRequestToggleArrows]);
    return { handleTap, handleScaleChange, scale, isScrollEnabled };
}
exports.default = useCarouselContextEvents;
