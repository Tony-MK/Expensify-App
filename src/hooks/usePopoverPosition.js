"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var CONST_1 = require("@src/CONST");
var useResponsiveLayout_1 = require("./useResponsiveLayout");
var defaultAnchorAlignment = {
    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
};
/**
 * Hook for calculating the position of a popover relative to an anchor element.
 *
 * Popovers are only used on larger screen widths. On small screens, the position will
 * default to `{horizontal: 0, vertical: 0, width: 0, height: 0}`.
 *
 * @returns An object containing a function to calculate the popover's position.
 *
 * @example
 * const { calculatePopoverPosition } = usePopoverPosition();
 *
 * // Later in a component
 * const position = await calculatePopoverPosition(anchorRef, {
 *   horizontal: 'center',
 *   vertical: 'top',
 * });
 * console.log(position);
 * // { horizontal: 120, vertical: 300, width: 50, height: 30 }
 */
function usePopoverPosition() {
    // Popovers are not used on small screen widths, but can be present in RHP
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    var isSmallScreenWidth = (0, useResponsiveLayout_1.default)().isSmallScreenWidth;
    var calculatePopoverPosition = (0, react_1.useCallback)(function (anchorRef, anchorAlignment) {
        if (anchorAlignment === void 0) { anchorAlignment = defaultAnchorAlignment; }
        if (isSmallScreenWidth || !anchorRef.current || !('measureInWindow' in anchorRef.current)) {
            return Promise.resolve({ horizontal: 0, vertical: 0, width: 0, height: 0 });
        }
        return new Promise(function (resolve) {
            var _a;
            (_a = anchorRef.current) === null || _a === void 0 ? void 0 : _a.measureInWindow(function (x, y, width, height) {
                var horizontal = x + width;
                if (anchorAlignment.horizontal === CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT) {
                    horizontal = x;
                }
                else if (anchorAlignment.horizontal === CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.CENTER) {
                    horizontal = x + width / 2;
                }
                var vertical = anchorAlignment.vertical === CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP
                    ? y + height + CONST_1.default.MODAL.POPOVER_MENU_PADDING // if vertical anchorAlignment is TOP, menu will open below the button and we need to add the height of button and padding
                    : y - CONST_1.default.MODAL.POPOVER_MENU_PADDING; // if it is BOTTOM, menu will open above the button so NO need to add height but DO subtract padding
                resolve({
                    horizontal: horizontal,
                    vertical: vertical,
                    width: width,
                    height: height,
                });
            });
        });
    }, [isSmallScreenWidth]);
    return { calculatePopoverPosition: calculatePopoverPosition };
}
exports.default = usePopoverPosition;
