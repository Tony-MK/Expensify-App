"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Modal_1 = require("@components/Modal");
const CONST_1 = require("@src/CONST");
const ValidateCodeActionContent_1 = require("./ValidateCodeActionContent");
function ValidateCodeActionModal({ isVisible, title, descriptionPrimary, descriptionSecondary, onClose, validateError, validatePendingAction, validateCodeActionErrorField, handleSubmitForm, clearError, sendValidateCode, isLoading, shouldHandleNavigationBack, disableAnimation, threeDotsMenuItems = [], onThreeDotsButtonPress = () => { }, }) {
    return (<Modal_1.default shouldHandleNavigationBack={shouldHandleNavigationBack} type={CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED} isVisible={isVisible} onClose={onClose} onBackdropPress={onClose} shouldUseModalPaddingStyle={false} animationInTiming={disableAnimation ? 1 : undefined}>
            <ValidateCodeActionContent_1.default title={title} descriptionPrimary={descriptionPrimary} descriptionSecondary={descriptionSecondary} validateCodeActionErrorField={validateCodeActionErrorField} handleSubmitForm={handleSubmitForm} clearError={clearError} onClose={onClose} sendValidateCode={sendValidateCode} validateError={validateError} validatePendingAction={validatePendingAction} threeDotsMenuItems={threeDotsMenuItems} onThreeDotsButtonPress={onThreeDotsButtonPress} isLoading={isLoading}/>
        </Modal_1.default>);
}
ValidateCodeActionModal.displayName = 'ValidateCodeActionModal';
exports.default = ValidateCodeActionModal;
