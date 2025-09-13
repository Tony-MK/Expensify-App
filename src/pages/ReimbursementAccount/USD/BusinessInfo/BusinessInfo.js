"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const pick_1 = require("lodash/pick");
const react_1 = require("react");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useSubStep_1 = require("@hooks/useSubStep");
const PhoneNumber_1 = require("@libs/PhoneNumber");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const getInitialSubStepForBusinessInfo_1 = require("@pages/ReimbursementAccount/USD/utils/getInitialSubStepForBusinessInfo");
const getSubStepValues_1 = require("@pages/ReimbursementAccount/utils/getSubStepValues");
const BankAccounts_1 = require("@userActions/BankAccounts");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const AddressBusiness_1 = require("./subSteps/AddressBusiness");
const ConfirmationBusiness_1 = require("./subSteps/ConfirmationBusiness");
const IncorporationCode_1 = require("./subSteps/IncorporationCode");
const IncorporationDateBusiness_1 = require("./subSteps/IncorporationDateBusiness");
const IncorporationStateBusiness_1 = require("./subSteps/IncorporationStateBusiness");
const NameBusiness_1 = require("./subSteps/NameBusiness");
const PhoneNumberBusiness_1 = require("./subSteps/PhoneNumberBusiness");
const TaxIdBusiness_1 = require("./subSteps/TaxIdBusiness");
const TypeBusiness_1 = require("./subSteps/TypeBusiness/TypeBusiness");
const WebsiteBusiness_1 = require("./subSteps/WebsiteBusiness");
const BUSINESS_INFO_STEP_KEYS = ReimbursementAccountForm_1.default.BUSINESS_INFO_STEP;
const bodyContent = [
    NameBusiness_1.default,
    TaxIdBusiness_1.default,
    WebsiteBusiness_1.default,
    PhoneNumberBusiness_1.default,
    AddressBusiness_1.default,
    TypeBusiness_1.default,
    IncorporationDateBusiness_1.default,
    IncorporationStateBusiness_1.default,
    IncorporationCode_1.default,
    ConfirmationBusiness_1.default,
];
function BusinessInfo({ onBackButtonPress }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: true });
    const getBankAccountFields = (0, react_1.useCallback)((fieldNames) => ({
        ...(0, pick_1.default)(reimbursementAccount?.achData, ...fieldNames),
        ...(0, pick_1.default)(reimbursementAccountDraft, ...fieldNames),
    }), [reimbursementAccount, reimbursementAccountDraft]);
    const policyID = reimbursementAccount?.achData?.policyID;
    const values = (0, react_1.useMemo)(() => (0, getSubStepValues_1.default)(BUSINESS_INFO_STEP_KEYS, reimbursementAccountDraft, reimbursementAccount), [reimbursementAccount, reimbursementAccountDraft]);
    const submit = (0, react_1.useCallback)((isConfirmPage) => {
        const companyWebsite = expensify_common_1.Str.sanitizeURL(values.website, CONST_1.default.COMPANY_WEBSITE_DEFAULT_SCHEME);
        (0, BankAccounts_1.updateCompanyInformationForBankAccount)(Number(reimbursementAccount?.achData?.bankAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID), {
            ...values,
            ...getBankAccountFields(['routingNumber', 'accountNumber', 'bankName', 'plaidAccountID', 'plaidAccessToken', 'isSavings']),
            companyTaxID: values.companyTaxID?.replace(CONST_1.default.REGEX.NON_NUMERIC, ''),
            companyPhone: (0, PhoneNumber_1.parsePhoneNumber)(values.companyPhone ?? '', { regionCode: CONST_1.default.COUNTRY.US }).number?.significant,
            website: (0, ValidationUtils_1.isValidWebsite)(companyWebsite) ? companyWebsite : undefined,
        }, policyID, isConfirmPage);
    }, [reimbursementAccount, values, getBankAccountFields, policyID]);
    const isBankAccountVerifying = reimbursementAccount?.achData?.state === CONST_1.default.BANK_ACCOUNT.STATE.VERIFYING;
    const startFrom = (0, react_1.useMemo)(() => (isBankAccountVerifying ? 0 : (0, getInitialSubStepForBusinessInfo_1.default)(values)), [values, isBankAccountVerifying]);
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
    return (<InteractiveStepWrapper_1.default wrapperID={BusinessInfo.displayName} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight headerTitle={translate('businessInfoStep.businessInfo')} handleBackButtonPress={handleBackButtonPress} startStepIndex={4} stepNames={CONST_1.default.BANK_ACCOUNT.STEP_NAMES}>
            <SubStep isEditing={isEditing} onNext={nextScreen} onMove={moveTo}/>
        </InteractiveStepWrapper_1.default>);
}
BusinessInfo.displayName = 'BusinessInfo';
exports.default = BusinessInfo;
