"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Browser_1 = require("@libs/Browser");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
function getCenteredModalStyles(styles, windowWidth, isSmallScreenWidth, isFullScreenWhenSmall = false) {
    const modalStyles = styles.centeredModalStyles(isSmallScreenWidth, isFullScreenWhenSmall);
    return {
        borderWidth: modalStyles.borderWidth,
        width: isSmallScreenWidth ? '100%' : windowWidth - modalStyles.marginHorizontal * 2,
    };
}
const createModalStyleUtils = ({ theme, styles }) => ({
    getModalStyles: (type, windowDimensions, popoverAnchorPosition = {}, innerContainerStyle = {}, outerStyle = {}, shouldUseModalPaddingStyle = true, safeAreaOptions = { modalOverlapsWithTopSafeArea: false, shouldDisableBottomSafeAreaPadding: false }) => {
        const { windowWidth, isSmallScreenWidth } = windowDimensions;
        let modalStyle = {
            margin: 0,
            ...outerStyle,
        };
        let modalContainerStyle;
        let swipeDirection;
        let animationIn;
        let animationOut;
        let hideBackdrop = false;
        let shouldAddBottomSafeAreaMargin = false;
        let shouldAddTopSafeAreaMargin = false;
        let shouldAddBottomSafeAreaPadding = false;
        let shouldAddTopSafeAreaPadding = false;
        switch (type) {
            case CONST_1.default.MODAL.MODAL_TYPE.FULLSCREEN:
                modalStyle = { ...modalStyle, height: '100%' };
                modalContainerStyle = {};
                swipeDirection = 'down';
                animationIn = 'slideInUp';
                animationOut = 'slideOutDown';
                break;
            case CONST_1.default.MODAL.MODAL_TYPE.CONFIRM:
                // A confirm modal is one that has a visible backdrop
                // and can be dismissed by clicking outside of the modal.
                modalStyle = {
                    ...modalStyle,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                };
                modalContainerStyle = {
                    boxShadow: theme.shadow,
                    borderRadius: variables_1.default.componentBorderRadiusLarge,
                    overflow: 'hidden',
                    width: variables_1.default.sideBarWidth,
                };
                // setting this to undefined we effectively disable the
                // ability to swipe our modal
                swipeDirection = undefined;
                animationIn = 'fadeIn';
                animationOut = 'fadeOut';
                break;
            case CONST_1.default.MODAL.MODAL_TYPE.CENTERED:
                // A centered modal is one that has a visible backdrop
                // and can be dismissed by clicking outside of the modal.
                // This modal should take up the entire visible area when
                // viewed on a smaller device (e.g. mobile or mobile web).
                modalStyle = {
                    ...modalStyle,
                    alignItems: 'center',
                    height: '100%',
                };
                modalContainerStyle = {
                    boxShadow: theme.shadow,
                    flex: 1,
                    marginTop: isSmallScreenWidth ? 0 : 20,
                    marginBottom: isSmallScreenWidth ? 0 : 20,
                    borderRadius: isSmallScreenWidth ? 0 : variables_1.default.componentBorderRadiusLarge,
                    overflow: 'hidden',
                    ...getCenteredModalStyles(styles, windowWidth, isSmallScreenWidth),
                };
                // Allow this modal to be dismissed with a swipe down or swipe right
                swipeDirection = ['down', 'right'];
                animationIn = isSmallScreenWidth ? 'slideInRight' : 'fadeIn';
                animationOut = isSmallScreenWidth ? 'slideOutRight' : 'fadeOut';
                shouldAddTopSafeAreaMargin = !isSmallScreenWidth;
                shouldAddBottomSafeAreaMargin = !isSmallScreenWidth;
                shouldAddTopSafeAreaPadding = isSmallScreenWidth;
                shouldAddBottomSafeAreaPadding = false;
                break;
            case CONST_1.default.MODAL.MODAL_TYPE.CENTERED_SWIPEABLE_TO_RIGHT:
                // A centered modal is one that has a visible backdrop
                // and can be dismissed by clicking outside of the modal.
                // This modal should take up the entire visible area when
                // viewed on a smaller device (e.g. mobile or mobile web).
                modalStyle = {
                    ...modalStyle,
                    alignItems: 'center',
                    height: '100%',
                };
                modalContainerStyle = {
                    boxShadow: theme.shadow,
                    flex: 1,
                    marginTop: isSmallScreenWidth ? 0 : 20,
                    marginBottom: isSmallScreenWidth ? 0 : 20,
                    borderRadius: isSmallScreenWidth ? 0 : variables_1.default.componentBorderRadiusLarge,
                    overflow: 'hidden',
                    ...getCenteredModalStyles(styles, windowWidth, isSmallScreenWidth),
                };
                // Allow this modal to be dismissed with a swipe to the right, required when we want to have a list in centered modal
                swipeDirection = ['right'];
                animationIn = isSmallScreenWidth ? 'slideInRight' : 'fadeIn';
                animationOut = isSmallScreenWidth ? 'slideOutRight' : 'fadeOut';
                shouldAddTopSafeAreaMargin = !isSmallScreenWidth;
                shouldAddBottomSafeAreaMargin = !isSmallScreenWidth;
                shouldAddTopSafeAreaPadding = isSmallScreenWidth;
                shouldAddBottomSafeAreaPadding = false;
                break;
            case CONST_1.default.MODAL.MODAL_TYPE.CENTERED_UNSWIPEABLE:
                // A centered modal that cannot be dismissed with a swipe.
                modalStyle = {
                    ...modalStyle,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                };
                modalContainerStyle = {
                    boxShadow: theme.shadow,
                    flex: 1,
                    marginTop: isSmallScreenWidth ? 0 : 20,
                    marginBottom: isSmallScreenWidth ? 0 : 20,
                    borderRadius: isSmallScreenWidth ? 0 : variables_1.default.componentBorderRadiusLarge,
                    overflow: 'hidden',
                    ...getCenteredModalStyles(styles, windowWidth, isSmallScreenWidth, true),
                };
                swipeDirection = undefined;
                animationIn = isSmallScreenWidth ? 'slideInRight' : 'fadeIn';
                animationOut = isSmallScreenWidth ? 'slideOutRight' : 'fadeOut';
                shouldAddTopSafeAreaMargin = !isSmallScreenWidth;
                shouldAddBottomSafeAreaMargin = !isSmallScreenWidth;
                shouldAddTopSafeAreaPadding = isSmallScreenWidth;
                shouldAddBottomSafeAreaPadding = false;
                break;
            case CONST_1.default.MODAL.MODAL_TYPE.CENTERED_SMALL:
                // A centered modal that takes up the minimum possible screen space on all devices
                modalStyle = {
                    ...modalStyle,
                    alignItems: 'center',
                    height: '100%',
                };
                modalContainerStyle = {
                    boxShadow: theme.shadow,
                    borderRadius: variables_1.default.componentBorderRadiusLarge,
                    borderWidth: 0,
                    marginTop: 'auto',
                    marginBottom: 'auto',
                };
                // Allow this modal to be dismissed with a swipe down or swipe right
                swipeDirection = ['down', 'right'];
                animationIn = 'fadeIn';
                animationOut = 'fadeOut';
                shouldAddTopSafeAreaMargin = false;
                shouldAddBottomSafeAreaMargin = false;
                shouldAddTopSafeAreaPadding = false;
                shouldAddBottomSafeAreaPadding = false;
                break;
            case CONST_1.default.MODAL.MODAL_TYPE.BOTTOM_DOCKED:
                modalStyle = {
                    ...modalStyle,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    height: '100%',
                };
                modalContainerStyle = {
                    width: '100%',
                    borderTopLeftRadius: variables_1.default.componentBorderRadiusLarge,
                    borderTopRightRadius: variables_1.default.componentBorderRadiusLarge,
                    justifyContent: 'center',
                    overflow: 'hidden',
                    boxShadow: theme.shadow,
                    // Workaround for Safari not supporting interactive-widget=resizes-content, sets max height of a container modal.
                    // This allows better scrolling experience after keyboard shows for modals with input, that are larger than remaining screen height.
                    // More info https://github.com/Expensify/App/pull/62799#issuecomment-2943136220.
                    ...((0, Browser_1.isMobileSafari)() ? { maxHeight: `${windowDimensions.windowHeight}px` } : {}),
                };
                if (shouldUseModalPaddingStyle) {
                    modalContainerStyle.paddingTop = variables_1.default.componentBorderRadiusLarge;
                    modalContainerStyle.paddingBottom = variables_1.default.componentBorderRadiusLarge;
                }
                shouldAddBottomSafeAreaPadding = !safeAreaOptions?.shouldDisableBottomSafeAreaPadding;
                shouldAddTopSafeAreaMargin = !!safeAreaOptions?.modalOverlapsWithTopSafeArea;
                swipeDirection = undefined;
                animationIn = 'slideInUp';
                animationOut = 'slideOutDown';
                break;
            case CONST_1.default.MODAL.MODAL_TYPE.POPOVER:
                modalStyle = {
                    ...modalStyle,
                    ...popoverAnchorPosition,
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                };
                modalContainerStyle = {
                    borderRadius: variables_1.default.componentBorderRadiusLarge,
                    borderWidth: 1,
                    borderColor: theme.border,
                    justifyContent: 'center',
                    overflow: 'hidden',
                    boxShadow: theme.shadow,
                };
                hideBackdrop = true;
                swipeDirection = undefined;
                animationIn = 'fadeIn';
                animationOut = 'fadeOut';
                break;
            case CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED:
                modalStyle = {
                    ...modalStyle,
                    marginLeft: isSmallScreenWidth ? 0 : windowWidth - variables_1.default.sideBarWidth,
                    width: isSmallScreenWidth ? '100%' : variables_1.default.sideBarWidth,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    height: '100%',
                };
                modalContainerStyle = {
                    width: isSmallScreenWidth ? '100%' : variables_1.default.sideBarWidth,
                    height: '100%',
                    overflow: 'hidden',
                };
                animationIn = 'slideInRight';
                animationOut = 'slideOutRight';
                swipeDirection = undefined;
                shouldAddBottomSafeAreaPadding = true;
                shouldAddTopSafeAreaPadding = true;
                break;
            default:
                modalStyle = { height: '100%' };
                modalContainerStyle = {};
                swipeDirection = 'down';
                animationIn = 'slideInUp';
                animationOut = 'slideOutDown';
        }
        modalContainerStyle = { ...modalContainerStyle, ...innerContainerStyle };
        return {
            modalStyle,
            modalContainerStyle,
            swipeDirection,
            animationIn,
            animationOut,
            hideBackdrop,
            shouldAddTopSafeAreaMargin,
            shouldAddBottomSafeAreaMargin,
            shouldAddBottomSafeAreaPadding,
            shouldAddTopSafeAreaPadding,
        };
    },
});
exports.default = createModalStyleUtils;
