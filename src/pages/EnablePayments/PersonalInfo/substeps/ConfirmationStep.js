"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmationStep_1 = require("@components/SubStepForms/ConfirmationStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const ErrorUtils = require("@libs/ErrorUtils");
const getSubstepValues_1 = require("@pages/EnablePayments/utils/getSubstepValues");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const WalletAdditionalDetailsForm_1 = require("@src/types/form/WalletAdditionalDetailsForm");
const PERSONAL_INFO_STEP_KEYS = WalletAdditionalDetailsForm_1.default.PERSONAL_INFO_STEP;
const PERSONAL_INFO_STEP_INDEXES = CONST_1.default.WALLET.SUBSTEP_INDEXES.PERSONAL_INFO;
function ConfirmationStep({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [walletAdditionalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_ADDITIONAL_DETAILS);
    const [walletAdditionalDetailsDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.WALLET_ADDITIONAL_DETAILS_DRAFT);
    const isLoading = walletAdditionalDetails?.isLoading ?? false;
    const error = ErrorUtils.getLatestErrorMessage(walletAdditionalDetails ?? {});
    const values = (0, react_1.useMemo)(() => (0, getSubstepValues_1.default)(PERSONAL_INFO_STEP_KEYS, walletAdditionalDetailsDraft, walletAdditionalDetails), [walletAdditionalDetails, walletAdditionalDetailsDraft]);
    const shouldAskForFullSSN = walletAdditionalDetails?.errorCode === CONST_1.default.WALLET.ERROR.SSN;
    const summaryItems = [
        {
            description: translate('personalInfoStep.legalName'),
            title: `${values[PERSONAL_INFO_STEP_KEYS.FIRST_NAME]} ${values[PERSONAL_INFO_STEP_KEYS.LAST_NAME]}`,
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(PERSONAL_INFO_STEP_INDEXES.LEGAL_NAME);
            },
        },
        {
            description: translate('common.dob'),
            title: values[PERSONAL_INFO_STEP_KEYS.DOB],
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(PERSONAL_INFO_STEP_INDEXES.DATE_OF_BIRTH);
            },
        },
        {
            description: translate('personalInfoStep.address'),
            title: `${values[PERSONAL_INFO_STEP_KEYS.STREET]}, ${values[PERSONAL_INFO_STEP_KEYS.CITY]}, ${values[PERSONAL_INFO_STEP_KEYS.STATE]} ${values[PERSONAL_INFO_STEP_KEYS.ZIP_CODE]}`,
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(PERSONAL_INFO_STEP_INDEXES.ADDRESS);
            },
        },
        {
            description: translate('common.phoneNumber'),
            title: values[PERSONAL_INFO_STEP_KEYS.PHONE_NUMBER],
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(PERSONAL_INFO_STEP_INDEXES.PHONE_NUMBER);
            },
        },
        {
            description: translate(shouldAskForFullSSN ? 'common.ssnFull9' : 'personalInfoStep.last4SSN'),
            title: values[PERSONAL_INFO_STEP_KEYS.SSN_LAST_4],
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(PERSONAL_INFO_STEP_INDEXES.SSN);
            },
        },
    ];
    return (<ConfirmationStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} pageTitle={translate('personalInfoStep.letsDoubleCheck')} summaryItems={summaryItems} showOnfidoLinks onfidoLinksTitle={`${translate('personalInfoStep.byAddingThisBankAccount')} `} isLoading={isLoading} error={error}/>);
}
ConfirmationStep.displayName = 'ConfirmationStep';
exports.default = ConfirmationStep;
