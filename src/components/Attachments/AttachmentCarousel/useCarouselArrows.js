"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DeviceCapabilities = require("@libs/DeviceCapabilities");
const CONST_1 = require("@src/CONST");
function useCarouselArrows() {
    const canUseTouchScreen = DeviceCapabilities.canUseTouchScreen();
    const [shouldShowArrows, setShouldShowArrowsInternal] = (0, react_1.useState)(canUseTouchScreen);
    const autoHideArrowTimeout = (0, react_1.useRef)(null);
    /**
     * Cancels the automatic hiding of the arrows.
     */
    const cancelAutoHideArrows = (0, react_1.useCallback)(() => {
        if (!autoHideArrowTimeout.current) {
            return;
        }
        clearTimeout(autoHideArrowTimeout.current);
    }, []);
    /**
     * Automatically hide the arrows if there is no interaction for 3 seconds.
     */
    const autoHideArrows = (0, react_1.useCallback)(() => {
        if (!canUseTouchScreen) {
            return;
        }
        cancelAutoHideArrows();
        autoHideArrowTimeout.current = setTimeout(() => {
            setShouldShowArrowsInternal(false);
        }, CONST_1.default.ARROW_HIDE_DELAY);
    }, [canUseTouchScreen, cancelAutoHideArrows]);
    /**
     * Sets the visibility of the arrows.
     */
    const setShouldShowArrows = (0, react_1.useCallback)((show = true) => {
        setShouldShowArrowsInternal(show);
        autoHideArrows();
    }, [autoHideArrows]);
    (0, react_1.useEffect)(() => {
        autoHideArrows();
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    return { shouldShowArrows, setShouldShowArrows, autoHideArrows, cancelAutoHideArrows };
}
exports.default = useCarouselArrows;
