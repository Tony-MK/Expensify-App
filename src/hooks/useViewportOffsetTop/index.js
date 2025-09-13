"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useViewportOffsetTop;
const react_1 = require("react");
const Browser = require("@libs/Browser");
const VisualViewport_1 = require("@libs/VisualViewport");
/**
 * A hook that returns the offset of the top edge of the visual viewport
 */
function useViewportOffsetTop(shouldAdjustScrollView = false) {
    const [viewportOffsetTop, setViewportOffsetTop] = (0, react_1.useState)(0);
    const cachedDefaultOffsetTop = (0, react_1.useRef)(0);
    const updateOffsetTop = (0, react_1.useCallback)((event) => {
        let targetOffsetTop = window.visualViewport?.offsetTop ?? 0;
        if (event?.target instanceof VisualViewport) {
            targetOffsetTop = event.target.offsetTop;
        }
        if (Browser.isMobileSafari() && shouldAdjustScrollView && window.visualViewport) {
            const clientHeight = document.body.clientHeight;
            const adjustScrollY = clientHeight - window.visualViewport.height;
            if (cachedDefaultOffsetTop.current === 0) {
                cachedDefaultOffsetTop.current = targetOffsetTop;
            }
            if (adjustScrollY > targetOffsetTop) {
                setViewportOffsetTop(adjustScrollY);
            }
            else if (targetOffsetTop !== 0 && adjustScrollY === targetOffsetTop) {
                setViewportOffsetTop(cachedDefaultOffsetTop.current);
            }
            else {
                setViewportOffsetTop(targetOffsetTop);
            }
        }
        else {
            setViewportOffsetTop(targetOffsetTop);
        }
    }, [shouldAdjustScrollView]);
    (0, react_1.useEffect)(() => (0, VisualViewport_1.default)(updateOffsetTop), [updateOffsetTop]);
    (0, react_1.useEffect)(() => {
        // We don't want to trigger window.scrollTo when we are already at the target position. It causes unnecessary style recalculations.
        if (!shouldAdjustScrollView || viewportOffsetTop === window.scrollY) {
            return;
        }
        window.scrollTo({ top: viewportOffsetTop, behavior: 'smooth' });
    }, [shouldAdjustScrollView, viewportOffsetTop]);
    return viewportOffsetTop;
}
