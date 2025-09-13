"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FloatingActionButtonAndPopover_1 = require("@pages/home/sidebar/FloatingActionButtonAndPopover");
function NavigationTabBarFloatingActionButton({ isTooltipAllowed }) {
    const popoverModal = (0, react_1.useRef)(null);
    /**
     * Method to hide popover when dragover.
     */
    const hidePopoverOnDragOver = (0, react_1.useCallback)(() => {
        if (!popoverModal.current) {
            return;
        }
        popoverModal.current.hideCreateMenu();
    }, []);
    /**
     * Method create event listener
     */
    const createDragoverListener = () => {
        document.addEventListener('dragover', hidePopoverOnDragOver);
    };
    /**
     * Method remove event listener.
     */
    const removeDragoverListener = () => {
        document.removeEventListener('dragover', hidePopoverOnDragOver);
    };
    return (<FloatingActionButtonAndPopover_1.default ref={popoverModal} isTooltipAllowed={isTooltipAllowed} onShowCreateMenu={createDragoverListener} onHideCreateMenu={removeDragoverListener}/>);
}
exports.default = NavigationTabBarFloatingActionButton;
