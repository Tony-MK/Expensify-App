"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Add a visual viewport resize listener if available. Return a function to remove the listener.
 */
const addViewportResizeListener = (onViewportResize) => {
    if (!window.visualViewport) {
        return () => { };
    }
    window.visualViewport.addEventListener('resize', onViewportResize);
    return () => window.visualViewport?.removeEventListener('resize', onViewportResize);
};
exports.default = addViewportResizeListener;
