"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useSubStep_1 = require("@hooks/useSubStep");
const PhoneNumber_1 = require("@libs/PhoneNumber");
const IdologyQuestions_1 = require("@pages/EnablePayments/IdologyQuestions");
const getInitialSubstepForPersonalInfo_1 = require("@pages/EnablePayments/utils/getInitialSubstepForPersonalInfo");
const getSubstepValues_1 = require("@pages/EnablePayments/utils/getSubstepValues");
const Wallet = require("@userActions/Wallet");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const WalletAdditionalDetailsForm_1 = require("@src/types/form/WalletAdditionalDetailsForm");
const AddressStep_1 = require("./substeps/AddressStep");
const ConfirmationStep_1 = require("./substeps/ConfirmationStep");
const DateOfBirthStep_1 = require("./substeps/DateOfBirthStep");
const LegalNameStep_1 = require("./substeps/LegalNameStep");
const PhoneNumberStep_1 = require("./substeps/PhoneNumberStep");
const SocialSecurityNumberStep_1 = require("./substeps/SocialSecurityNumberStep");
const PERSONAL_INFO_STEP_KEYS = WalletAdditionalDetailsForm_1.default.PERSONAL_INFO_STEP;
const bodyContent = [LegalNameStep_1.default, DateOfBirthStep_1.default, AddressStep_1.default, PhoneNumberStep_1.default, SocialSecurityNumberStep_1.default, ConfirmationStep_1.default];
function PersonalInfoPage() {
    const { translate } = (0, useLocalize_1.default)();
    const [walletAdditionalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_ADDITIONAL_DETAILS);
    const [walletAdditionalDetailsDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.WALLET_ADDITIONAL_DETAILS_DRAFT);
    const showIdologyQuestions = walletAdditionalDetails?.questions && walletAdditionalDetails?.questions.length > 0;
    const values = (0, react_1.useMemo)(() => (0, getSubstepValues_1.default)(PERSONAL_INFO_STEP_KEYS, walletAdditionalDetailsDraft, walletAdditionalDetails), [walletAdditionalDetails, walletAdditionalDetailsDraft]);
    const submit = () => {
        const personalDetails = {
            phoneNumber: (values.phoneNumber && (0, PhoneNumber_1.parsePhoneNumber)(values.phoneNumber, { regionCode: CONST_1.default.COUNTRY.US }).number?.significant) ?? '',
            legalFirstName: values?.[PERSONAL_INFO_STEP_KEYS.FIRST_NAME] ?? '',
            legalLastName: values?.[PERSONAL_INFO_STEP_KEYS.LAST_NAME] ?? '',
            addressStreet: values?.[PERSONAL_INFO_STEP_KEYS.STREET] ?? '',
            addressCity: values?.[PERSONAL_INFO_STEP_KEYS.CITY] ?? '',
            addressState: values?.[PERSONAL_INFO_STEP_KEYS.STATE] ?? '',
            addressZip: values?.[PERSONAL_INFO_STEP_KEYS.ZIP_CODE] ?? '',
            dob: values?.[PERSONAL_INFO_STEP_KEYS.DOB] ?? '',
            ssn: values?.[PERSONAL_INFO_STEP_KEYS.SSN_LAST_4] ?? '',
        };
        // Attempt to set the personal details
        Wallet.updatePersonalDetails(personalDetails);
    };
    const startFrom = (0, react_1.useMemo)(() => (0, getInitialSubstepForPersonalInfo_1.default)(values), [values]);
    const { componentToRender: SubStep, isEditing, nextScreen, prevScreen, moveTo, screenIndex, goToTheLastStep, } = (0, useSubStep_1.default)({
        bodyContent,
        startFrom,
        onFinished: submit,
    });
    const handleBackButtonPress = () => {
        if (isEditing) {
            goToTheLastStep();
            return;
        }
        if (screenIndex === 0) {
            Wallet.updateCurrentStep(CONST_1.default.WALLET.STEP.ADD_BANK_ACCOUNT);
            return;
        }
        if (showIdologyQuestions) {
            Wallet.setAdditionalDetailsQuestions(null, '');
            return;
        }
        prevScreen();
    };
    return (<InteractiveStepWrapper_1.default wrapperID={PersonalInfoPage.displayName} headerTitle={translate('personalInfoStep.personalInfo')} handleBackButtonPress={handleBackButtonPress} startStepIndex={1} stepNames={CONST_1.default.WALLET.STEP_NAMES}>
            {showIdologyQuestions ? (<IdologyQuestions_1.default questions={walletAdditionalDetails?.questions ?? []} idNumber={walletAdditionalDetails?.idNumber ?? ''}/>) : (<SubStep isEditing={isEditing} onNext={nextScreen} onMove={moveTo}/>)}
        </InteractiveStepWrapper_1.default>);
}
PersonalInfoPage.displayName = 'PersonalInfoPage';
exports.default = PersonalInfoPage;
