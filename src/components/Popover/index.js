"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const Modal_1 = require("@components/Modal");
const PopoverProvider_1 = require("@components/PopoverProvider");
const PopoverWithoutOverlay_1 = require("@components/PopoverWithoutOverlay");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSidePanel_1 = require("@hooks/useSidePanel");
const TooltipRefManager_1 = require("@libs/TooltipRefManager");
const CONST_1 = require("@src/CONST");
const DISABLED_ANIMATION_DURATION = 1;
/*
 * This is a convenience wrapper around the Modal component for a responsive Popover.
 * On small screen widths, it uses BottomDocked modal type, and a Popover type on wide screen widths.
 */
function Popover(props) {
    const { isVisible, onClose, fullscreen, onLayout, animationOutTiming, animationInTiming = CONST_1.default.ANIMATED_TRANSITION, disableAnimation = true, withoutOverlay = false, anchorPosition = {}, anchorRef = () => { }, animationIn = 'fadeIn', animationOut = 'fadeOut', shouldCloseWhenBrowserNavigationChanged = true, } = props;
    // We need to use isSmallScreenWidth to apply the correct modal type and popoverAnchorPosition
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { shouldUseNarrowLayout, isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const withoutOverlayRef = (0, react_1.useRef)(null);
    const { close, popover } = react_1.default.useContext(PopoverProvider_1.PopoverContext);
    const { isSidePanelTransitionEnded } = (0, useSidePanel_1.default)();
    // This useEffect handles hiding popovers when SidePanel is animating.
    react_1.default.useEffect(() => {
        if (isSidePanelTransitionEnded || isSmallScreenWidth || !isVisible) {
            return;
        }
        onClose?.();
    }, [onClose, isSidePanelTransitionEnded, isSmallScreenWidth, isVisible]);
    // Not adding this inside the PopoverProvider
    // because this is an issue on smaller screens as well.
    react_1.default.useEffect(() => {
        if (!shouldCloseWhenBrowserNavigationChanged) {
            return;
        }
        const listener = () => {
            if (!isVisible) {
                return;
            }
            onClose?.();
        };
        window.addEventListener('popstate', listener);
        return () => {
            window.removeEventListener('popstate', listener);
        };
    }, [onClose, isVisible, shouldCloseWhenBrowserNavigationChanged]);
    const onCloseWithPopoverContext = () => {
        if (popover && 'current' in anchorRef) {
            close(anchorRef);
        }
        TooltipRefManager_1.default.hideTooltip();
        onClose?.();
    };
    if (!fullscreen && !shouldUseNarrowLayout) {
        return (0, react_dom_1.createPortal)(<Modal_1.default 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props} onClose={onCloseWithPopoverContext} type={CONST_1.default.MODAL.MODAL_TYPE.POPOVER} popoverAnchorPosition={anchorPosition} animationInTiming={disableAnimation ? DISABLED_ANIMATION_DURATION : animationInTiming} animationOutTiming={disableAnimation ? DISABLED_ANIMATION_DURATION : animationOutTiming} shouldCloseOnOutsideClick onLayout={onLayout} animationIn={animationIn} animationOut={animationOut}/>, document.body);
    }
    if (withoutOverlay && !shouldUseNarrowLayout) {
        return (0, react_dom_1.createPortal)(<PopoverWithoutOverlay_1.default 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props} withoutOverlayRef={withoutOverlayRef} animationIn={animationIn} animationOut={animationOut}/>, document.body);
    }
    return (<Modal_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} onClose={onCloseWithPopoverContext} shouldHandleNavigationBack={props.shouldHandleNavigationBack} type={isSmallScreenWidth ? CONST_1.default.MODAL.MODAL_TYPE.BOTTOM_DOCKED : CONST_1.default.MODAL.MODAL_TYPE.POPOVER} popoverAnchorPosition={isSmallScreenWidth ? undefined : anchorPosition} fullscreen={shouldUseNarrowLayout ? true : fullscreen} animationInTiming={disableAnimation && !shouldUseNarrowLayout ? DISABLED_ANIMATION_DURATION : animationInTiming} animationOutTiming={disableAnimation && !shouldUseNarrowLayout ? DISABLED_ANIMATION_DURATION : animationOutTiming} onLayout={onLayout} animationIn={animationIn} animationOut={animationOut}/>);
}
Popover.displayName = 'Popover';
exports.default = Popover;
