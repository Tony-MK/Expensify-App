"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useSubStep_1 = require("@hooks/useSubStep");
const getInitialSubStepForPersonalInfo_1 = require("@pages/ReimbursementAccount/USD/utils/getInitialSubStepForPersonalInfo");
const getSubStepValues_1 = require("@pages/ReimbursementAccount/utils/getSubStepValues");
const BankAccounts_1 = require("@userActions/BankAccounts");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const Address_1 = require("./subSteps/Address");
const Confirmation_1 = require("./subSteps/Confirmation");
const DateOfBirth_1 = require("./subSteps/DateOfBirth");
const FullName_1 = require("./subSteps/FullName");
const SocialSecurityNumber_1 = require("./subSteps/SocialSecurityNumber");
const PERSONAL_INFO_STEP_KEYS = ReimbursementAccountForm_1.default.PERSONAL_INFO_STEP;
const bodyContent = [FullName_1.default, DateOfBirth_1.default, SocialSecurityNumber_1.default, Address_1.default, Confirmation_1.default];
function PersonalInfo({ onBackButtonPress }, ref) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: true });
    const policyID = reimbursementAccount?.achData?.policyID;
    const values = (0, react_1.useMemo)(() => (0, getSubStepValues_1.default)(PERSONAL_INFO_STEP_KEYS, reimbursementAccountDraft, reimbursementAccount), [reimbursementAccount, reimbursementAccountDraft]);
    const bankAccountID = Number(reimbursementAccount?.achData?.bankAccountID);
    const submit = (0, react_1.useCallback)((isConfirmPage) => {
        (0, BankAccounts_1.updatePersonalInformationForBankAccount)(bankAccountID, { ...values }, policyID, isConfirmPage);
    }, [values, bankAccountID, policyID]);
    const isBankAccountVerifying = reimbursementAccount?.achData?.state === CONST_1.default.BANK_ACCOUNT.STATE.VERIFYING;
    const startFrom = (0, react_1.useMemo)(() => (isBankAccountVerifying ? 0 : (0, getInitialSubStepForPersonalInfo_1.default)(values)), [values, isBankAccountVerifying]);
    const { componentToRender: SubStep, isEditing, screenIndex, nextScreen, prevScreen, moveTo, goToTheLastStep, } = (0, useSubStep_1.default)({ bodyContent, startFrom, onFinished: () => submit(true), onNextSubStep: () => submit(false) });
    const handleBackButtonPress = () => {
        if (isEditing) {
            goToTheLastStep();
            return;
        }
        if (screenIndex === 0) {
            onBackButtonPress();
        }
        else {
            prevScreen();
        }
    };
    return (<InteractiveStepWrapper_1.default ref={ref} wrapperID={PersonalInfo.displayName} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight headerTitle={translate('personalInfoStep.personalInfo')} handleBackButtonPress={handleBackButtonPress} startStepIndex={2} stepNames={CONST_1.default.BANK_ACCOUNT.STEP_NAMES}>
            <SubStep isEditing={isEditing} onNext={nextScreen} onMove={moveTo}/>
        </InteractiveStepWrapper_1.default>);
}
PersonalInfo.displayName = 'PersonalInfo';
exports.default = (0, react_1.forwardRef)(PersonalInfo);
