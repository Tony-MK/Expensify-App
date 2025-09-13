"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useSubStep_1 = require("@hooks/useSubStep");
const Navigation_1 = require("@navigation/Navigation");
const BankAccounts_1 = require("@userActions/BankAccounts");
const FormActions_1 = require("@userActions/FormActions");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Address_1 = require("./subSteps/Address");
const Confirmation_1 = require("./subSteps/Confirmation");
const DateOfBirth_1 = require("./subSteps/DateOfBirth");
const JobTitle_1 = require("./subSteps/JobTitle");
const Name_1 = require("./subSteps/Name");
const UploadDocuments_1 = require("./subSteps/UploadDocuments");
const getSignerDetailsAndSignerFiles_1 = require("./utils/getSignerDetailsAndSignerFiles");
const bodyContent = [Name_1.default, JobTitle_1.default, DateOfBirth_1.default, Address_1.default, UploadDocuments_1.default, Confirmation_1.default];
function EnterSignerInfo({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const bankAccountID = Number(route.params.bankAccountID);
    const policyID = route.params.policyID;
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false });
    const [enterSignerInfoForm] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM, { canBeMissing: true });
    const [enterSignerInfoFormDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM_DRAFT, { canBeMissing: true });
    const submit = (0, react_1.useCallback)(() => {
        const { signerDetails, signerFiles } = (0, getSignerDetailsAndSignerFiles_1.default)(enterSignerInfoFormDraft, account?.primaryLogin ?? '');
        (0, BankAccounts_1.saveCorpayOnboardingDirectorInformation)({
            inputs: JSON.stringify(signerDetails),
            ...signerFiles,
            bankAccountID,
        });
    }, [account?.primaryLogin, bankAccountID, enterSignerInfoFormDraft]);
    const { componentToRender: EnterSignerInfoForm, isEditing, screenIndex, nextScreen, prevScreen, moveTo, goToTheLastStep, } = (0, useSubStep_1.default)({ bodyContent, startFrom: 0, onFinished: submit });
    (0, react_1.useEffect)(() => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (enterSignerInfoForm?.errors || enterSignerInfoForm?.isSavingSignerInformation || !enterSignerInfoForm?.isSuccess) {
            return;
        }
        if (enterSignerInfoForm?.isSuccess) {
            (0, BankAccounts_1.clearEnterSignerInformationFormSave)();
            Navigation_1.default.closeRHPFlow();
        }
        return () => {
            (0, BankAccounts_1.clearEnterSignerInformationFormSave)();
        };
    }, [enterSignerInfoForm]);
    (0, react_1.useEffect)(() => {
        return (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM);
    }, []);
    const handleBackButtonPress = (0, react_1.useCallback)(() => {
        (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM);
        if (isEditing) {
            goToTheLastStep();
            return;
        }
        if (screenIndex > 0) {
            prevScreen();
        }
        else {
            Navigation_1.default.goBack();
        }
    }, [goToTheLastStep, isEditing, prevScreen, screenIndex]);
    return (<InteractiveStepWrapper_1.default wrapperID={EnterSignerInfo.displayName} handleBackButtonPress={handleBackButtonPress} headerTitle={translate('signerInfoStep.signerInfo')}>
            <EnterSignerInfoForm isEditing={isEditing} onNext={nextScreen} onMove={moveTo} policyID={policyID}/>
        </InteractiveStepWrapper_1.default>);
}
EnterSignerInfo.displayName = 'EnterSignerInfo';
exports.default = EnterSignerInfo;
