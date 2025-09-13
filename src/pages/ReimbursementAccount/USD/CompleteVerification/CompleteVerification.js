"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useSubStep_1 = require("@hooks/useSubStep");
var getSubStepValues_1 = require("@pages/ReimbursementAccount/utils/getSubStepValues");
var BankAccounts_1 = require("@userActions/BankAccounts");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
var ConfirmAgreements_1 = require("./subSteps/ConfirmAgreements");
var COMPLETE_VERIFICATION_KEYS = ReimbursementAccountForm_1.default.COMPLETE_VERIFICATION;
var bodyContent = [ConfirmAgreements_1.default];
function CompleteVerification(_a) {
    var _b;
    var onBackButtonPress = _a.onBackButtonPress;
    var translate = (0, useLocalize_1.default)().translate;
    var reimbursementAccount = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false })[0];
    var reimbursementAccountDraft = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: true })[0];
    var values = (0, react_1.useMemo)(function () { return (0, getSubStepValues_1.default)(COMPLETE_VERIFICATION_KEYS, reimbursementAccountDraft, reimbursementAccount); }, [reimbursementAccount, reimbursementAccountDraft]);
    var policyID = (_b = reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.achData) === null || _b === void 0 ? void 0 : _b.policyID;
    var submit = (0, react_1.useCallback)(function () {
        var _a;
        (0, BankAccounts_1.acceptACHContractForBankAccount)(Number((_a = reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.achData) === null || _a === void 0 ? void 0 : _a.bankAccountID), {
            isAuthorizedToUseBankAccount: values.isAuthorizedToUseBankAccount,
            certifyTrueInformation: values.certifyTrueInformation,
            acceptTermsAndConditions: values.acceptTermsAndConditions,
        }, policyID);
    }, [reimbursementAccount, values, policyID]);
    var _c = (0, useSubStep_1.default)({ bodyContent: bodyContent, startFrom: 0, onFinished: submit }), SubStep = _c.componentToRender, isEditing = _c.isEditing, screenIndex = _c.screenIndex, nextScreen = _c.nextScreen, prevScreen = _c.prevScreen, moveTo = _c.moveTo, goToTheLastStep = _c.goToTheLastStep;
    var handleBackButtonPress = function () {
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
    return (<InteractiveStepWrapper_1.default wrapperID={CompleteVerification.displayName} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight headerTitle={translate('completeVerificationStep.completeVerification')} handleBackButtonPress={handleBackButtonPress} startStepIndex={6} stepNames={CONST_1.default.BANK_ACCOUNT.STEP_NAMES}>
            <SubStep isEditing={isEditing} onNext={nextScreen} onMove={moveTo}/>
        </InteractiveStepWrapper_1.default>);
}
CompleteVerification.displayName = 'CompleteVerification';
exports.default = CompleteVerification;
