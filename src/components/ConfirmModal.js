"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const usePrevious_1 = require("@hooks/usePrevious");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const ConfirmContent_1 = require("./ConfirmContent");
const Modal_1 = require("./Modal");
function ConfirmModal({ confirmText = '', cancelText = '', prompt = '', success = true, danger = false, onCancel = () => { }, onBackdropPress, shouldDisableConfirmButtonWhenOffline = false, shouldShowCancelButton = true, shouldSetModalVisibility = true, title = '', iconSource, onModalHide = () => { }, titleStyles, iconAdditionalStyles, promptStyles, shouldCenterContent = false, shouldStackButtons = true, isVisible, onConfirm, image, imageStyles, iconWidth, iconHeight, iconFill, shouldCenterIcon, shouldShowDismissIcon, titleContainerStyles, shouldReverseStackedButtons, shouldEnableNewFocusManagement, restoreFocusType, isConfirmLoading, shouldHandleNavigationBack, shouldIgnoreBackHandlerDuringTransition, }) {
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to use the correct modal type
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    // Previous state needed for exiting animation to play correctly.
    const prevVisible = (0, usePrevious_1.default)(isVisible);
    // Perf: Prevents from rendering whole confirm modal on initial render.
    if (!isVisible && !prevVisible) {
        return null;
    }
    return (<Modal_1.default onClose={onCancel} onBackdropPress={onBackdropPress} isVisible={isVisible} shouldSetModalVisibility={shouldSetModalVisibility} onModalHide={onModalHide} type={isSmallScreenWidth ? CONST_1.default.MODAL.MODAL_TYPE.BOTTOM_DOCKED : CONST_1.default.MODAL.MODAL_TYPE.CONFIRM} innerContainerStyle={styles.pv0} shouldEnableNewFocusManagement={shouldEnableNewFocusManagement} restoreFocusType={restoreFocusType} shouldHandleNavigationBack={shouldHandleNavigationBack} shouldIgnoreBackHandlerDuringTransition={shouldIgnoreBackHandlerDuringTransition}>
            <ConfirmContent_1.default title={title} 
    /* Disable onConfirm function if the modal is being dismissed, otherwise the confirmation
function can be triggered multiple times if the user clicks on the button multiple times. */
    onConfirm={() => (isVisible ? onConfirm() : null)} onCancel={onCancel} confirmText={confirmText} cancelText={cancelText} prompt={prompt} success={success} danger={danger} isVisible={isVisible} shouldDisableConfirmButtonWhenOffline={shouldDisableConfirmButtonWhenOffline} shouldShowCancelButton={shouldShowCancelButton} shouldCenterContent={shouldCenterContent} iconSource={iconSource} contentStyles={isSmallScreenWidth && shouldShowDismissIcon ? styles.mt2 : undefined} iconFill={iconFill} iconHeight={iconHeight} iconWidth={iconWidth} shouldCenterIcon={shouldCenterIcon} shouldShowDismissIcon={shouldShowDismissIcon} titleContainerStyles={titleContainerStyles} iconAdditionalStyles={iconAdditionalStyles} titleStyles={titleStyles} promptStyles={promptStyles} shouldStackButtons={shouldStackButtons} shouldReverseStackedButtons={shouldReverseStackedButtons} image={image} imageStyles={imageStyles} isConfirmLoading={isConfirmLoading}/>
        </Modal_1.default>);
}
ConfirmModal.displayName = 'ConfirmModal';
exports.default = ConfirmModal;
