"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Modal_1 = require("@components/Modal");
const Navigation_1 = require("@libs/Navigation/Navigation");
const AttachmentModalBaseContent_1 = require("@pages/media/AttachmentModalScreen/AttachmentModalBaseContent");
const AttachmentModalContext_1 = require("@pages/media/AttachmentModalScreen/AttachmentModalContext");
const CONST_1 = require("@src/CONST");
function AttachmentModalContainer({ contentProps, modalType, onShow, onClose, shouldHandleNavigationBack }) {
    const [isVisible, setIsVisible] = (0, react_1.useState)(true);
    const attachmentsContext = (0, react_1.useContext)(AttachmentModalContext_1.default);
    const [shouldDisableAnimationAfterInitialMount, setShouldDisableAnimationAfterInitialMount] = (0, react_1.useState)(false);
    /**
     * Closes the modal.
     * @param {boolean} [shouldCallDirectly] If true, directly calls `onModalClose`.
     * This is useful when you plan to continue navigating to another page after closing the modal, to avoid freezing the app due to navigating to another page first and dismissing the modal later.
     * If `shouldCallDirectly` is false or undefined, it calls `attachmentModalHandler.handleModalClose` to close the modal.
     * This ensures smooth modal closing behavior without causing delays in closing.
     */
    const closeModal = (0, react_1.useCallback)((options) => {
        attachmentsContext.setCurrentAttachment(undefined);
        setIsVisible(false);
        onClose?.();
        Navigation_1.default.dismissModal();
        if (options?.onAfterClose) {
            options?.onAfterClose();
        }
    }, [attachmentsContext, onClose]);
    // After the modal has initially been mounted and animated in,
    // we don't want to show another animation when the modal type changes or
    // when the browser switches to narrow layout.
    (0, react_1.useEffect)(() => {
        react_native_1.InteractionManager.runAfterInteractions(() => {
            setShouldDisableAnimationAfterInitialMount(true);
        });
    }, []);
    (0, react_1.useEffect)(() => {
        onShow?.();
    }, [onShow]);
    return (<Modal_1.default disableAnimationIn={shouldDisableAnimationAfterInitialMount} isVisible={isVisible} type={modalType ?? CONST_1.default.MODAL.MODAL_TYPE.CENTERED_UNSWIPEABLE} propagateSwipe initialFocus={() => {
            if (!contentProps.submitRef?.current) {
                return false;
            }
            return contentProps.submitRef.current;
        }} shouldHandleNavigationBack={shouldHandleNavigationBack} onClose={closeModal} enableEdgeToEdgeBottomSafeAreaPadding>
            <AttachmentModalBaseContent_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...contentProps} shouldDisplayHelpButton={false} onClose={closeModal}/>
        </Modal_1.default>);
}
AttachmentModalContainer.displayName = 'AttachmentModalContainer';
exports.default = AttachmentModalContainer;
