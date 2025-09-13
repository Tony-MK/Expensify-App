"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Modal_1 = require("@components/Modal");
var CONST_1 = require("@src/CONST");
var ValidateCodeActionContent_1 = require("./ValidateCodeActionContent");
function ValidateCodeActionModal(_a) {
    var isVisible = _a.isVisible, title = _a.title, descriptionPrimary = _a.descriptionPrimary, descriptionSecondary = _a.descriptionSecondary, onClose = _a.onClose, validateError = _a.validateError, validatePendingAction = _a.validatePendingAction, validateCodeActionErrorField = _a.validateCodeActionErrorField, handleSubmitForm = _a.handleSubmitForm, clearError = _a.clearError, sendValidateCode = _a.sendValidateCode, isLoading = _a.isLoading, shouldHandleNavigationBack = _a.shouldHandleNavigationBack, disableAnimation = _a.disableAnimation, _b = _a.threeDotsMenuItems, threeDotsMenuItems = _b === void 0 ? [] : _b, _c = _a.onThreeDotsButtonPress, onThreeDotsButtonPress = _c === void 0 ? function () { } : _c;
    return (<Modal_1.default shouldHandleNavigationBack={shouldHandleNavigationBack} type={CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED} isVisible={isVisible} onClose={onClose} onBackdropPress={onClose} shouldUseModalPaddingStyle={false} animationInTiming={disableAnimation ? 1 : undefined}>
            <ValidateCodeActionContent_1.default title={title} descriptionPrimary={descriptionPrimary} descriptionSecondary={descriptionSecondary} validateCodeActionErrorField={validateCodeActionErrorField} handleSubmitForm={handleSubmitForm} clearError={clearError} onClose={onClose} sendValidateCode={sendValidateCode} validateError={validateError} validatePendingAction={validatePendingAction} threeDotsMenuItems={threeDotsMenuItems} onThreeDotsButtonPress={onThreeDotsButtonPress} isLoading={isLoading}/>
        </Modal_1.default>);
}
ValidateCodeActionModal.displayName = 'ValidateCodeActionModal';
exports.default = ValidateCodeActionModal;
