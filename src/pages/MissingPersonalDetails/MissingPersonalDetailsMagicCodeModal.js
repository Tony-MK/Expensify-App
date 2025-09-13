"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ValidateCodeActionModal_1 = require("@components/ValidateCodeActionModal");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const FormActions_1 = require("@libs/actions/FormActions");
const PersonalDetails_1 = require("@libs/actions/PersonalDetails");
const User_1 = require("@libs/actions/User");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function MissingPersonalDetailsMagicCodeModal({ onClose, isValidateCodeActionModalVisible, handleSubmitForm }) {
    const { translate } = (0, useLocalize_1.default)();
    const [privatePersonalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS, { canBeMissing: true });
    const [cardList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: true });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [validateCodeAction] = (0, useOnyx_1.default)(ONYXKEYS_1.default.VALIDATE_ACTION_CODE, { canBeMissing: true });
    const privateDetailsErrors = privatePersonalDetails?.errors ?? undefined;
    const validateLoginError = (0, ErrorUtils_1.getLatestError)(privateDetailsErrors);
    const primaryLogin = account?.primaryLogin ?? '';
    const areAllCardsShipped = Object.values(cardList ?? {})?.every((card) => card?.state !== CONST_1.default.EXPENSIFY_CARD.STATE.STATE_NOT_ISSUED);
    const missingDetails = !privatePersonalDetails?.legalFirstName ||
        !privatePersonalDetails?.legalLastName ||
        !privatePersonalDetails?.dob ||
        !privatePersonalDetails?.phoneNumber ||
        (0, EmptyObject_1.isEmptyObject)(privatePersonalDetails?.addresses) ||
        privatePersonalDetails.addresses.length === 0;
    (0, react_1.useEffect)(() => {
        if (missingDetails || !!privateDetailsErrors || !areAllCardsShipped) {
            return;
        }
        (0, FormActions_1.clearDraftValues)(ONYXKEYS_1.default.FORMS.PERSONAL_DETAILS_FORM);
        Navigation_1.default.goBack();
    }, [missingDetails, privateDetailsErrors, areAllCardsShipped]);
    const onBackButtonPress = () => {
        onClose?.();
    };
    const clearError = () => {
        if ((0, EmptyObject_1.isEmptyObject)(validateLoginError) && (0, EmptyObject_1.isEmptyObject)(validateCodeAction?.errorFields)) {
            return;
        }
        (0, PersonalDetails_1.clearPersonalDetailsErrors)();
    };
    return (<ValidateCodeActionModal_1.default clearError={clearError} onClose={onBackButtonPress} validateCodeActionErrorField="personalDetails" validateError={validateLoginError} isVisible={isValidateCodeActionModalVisible} title={translate('cardPage.validateCardTitle')} descriptionPrimary={translate('cardPage.enterMagicCode', { contactMethod: primaryLogin })} sendValidateCode={() => (0, User_1.requestValidateCodeAction)()} handleSubmitForm={handleSubmitForm} isLoading={privatePersonalDetails?.isLoading}/>);
}
MissingPersonalDetailsMagicCodeModal.displayName = 'MissingPersonalDetailsMagicCodeModal';
exports.default = MissingPersonalDetailsMagicCodeModal;
