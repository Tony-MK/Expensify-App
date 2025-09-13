"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useHandleBackButton_1 = require("@hooks/useHandleBackButton");
const useLocalize_1 = require("@hooks/useLocalize");
const useRootNavigationState_1 = require("@hooks/useRootNavigationState");
const useSubStep_1 = require("@hooks/useSubStep");
const FormActions_1 = require("@libs/actions/FormActions");
const isNavigatorName_1 = require("@libs/Navigation/helpers/isNavigatorName");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const AccountHolderInformation_1 = require("./substeps/AccountHolderInformation");
const AccountType_1 = require("./substeps/AccountType");
const BankAccountDetails_1 = require("./substeps/BankAccountDetails");
const BankInformation_1 = require("./substeps/BankInformation");
const Confirmation_1 = require("./substeps/Confirmation");
const CountrySelection_1 = require("./substeps/CountrySelection");
const Success_1 = require("./substeps/Success");
const utils_1 = require("./utils");
const formSteps = [CountrySelection_1.default, BankAccountDetails_1.default, AccountType_1.default, BankInformation_1.default, AccountHolderInformation_1.default, Confirmation_1.default, Success_1.default];
function getSkippedSteps(skipAccountTypeStep, skipAccountHolderInformationStep) {
    const skippedSteps = [];
    if (skipAccountTypeStep) {
        skippedSteps.push(CONST_1.default.CORPAY_FIELDS.INDEXES.MAPPING.ACCOUNT_TYPE);
    }
    if (skipAccountHolderInformationStep) {
        skippedSteps.push(CONST_1.default.CORPAY_FIELDS.INDEXES.MAPPING.ACCOUNT_HOLDER_INFORMATION);
    }
    return skippedSteps;
}
function InternationalDepositAccountContent({ privatePersonalDetails, corpayFields, bankAccountList, draftValues, country, isAccountLoading }) {
    const { translate } = (0, useLocalize_1.default)();
    const fieldsMap = (0, react_1.useMemo)(() => (0, utils_1.getFieldsMap)(corpayFields), [corpayFields]);
    const values = (0, react_1.useMemo)(() => (0, utils_1.getSubstepValues)(privatePersonalDetails, corpayFields, bankAccountList, draftValues, country, fieldsMap), [privatePersonalDetails, corpayFields, bankAccountList, draftValues, country, fieldsMap]);
    const initialAccountHolderDetailsValues = (0, react_1.useMemo)(() => (0, utils_1.getInitialPersonalDetailsValues)(privatePersonalDetails), [privatePersonalDetails]);
    const startFrom = (0, react_1.useMemo)(() => (0, utils_1.getInitialSubstep)(values, fieldsMap), [fieldsMap, values]);
    const skipAccountTypeStep = (0, EmptyObject_1.isEmptyObject)(fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.ACCOUNT_TYPE]);
    const skipAccountHolderInformationStep = (0, utils_1.testValidation)(initialAccountHolderDetailsValues, fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.ACCOUNT_HOLDER_INFORMATION]);
    const skippedSteps = getSkippedSteps(skipAccountTypeStep, skipAccountHolderInformationStep);
    const topmostFullScreenRoute = (0, useRootNavigationState_1.default)((state) => state.routes.findLast((route) => (0, isNavigatorName_1.isFullScreenName)(route.name)));
    const goBack = (0, react_1.useCallback)(() => {
        switch (topmostFullScreenRoute?.name) {
            case NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR:
                Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_WALLET);
                break;
            case NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR:
                Navigation_1.default.closeRHPFlow();
                break;
            default:
                Navigation_1.default.goBack();
                break;
        }
    }, [topmostFullScreenRoute?.name]);
    const handleFinishStep = (0, react_1.useCallback)(() => {
        (0, FormActions_1.clearDraftValues)(ONYXKEYS_1.default.FORMS.INTERNATIONAL_BANK_ACCOUNT_FORM);
        goBack();
    }, [goBack]);
    const { componentToRender: SubStep, isEditing, nextScreen, prevScreen, screenIndex, moveTo, resetScreenIndex, } = (0, useSubStep_1.default)({ bodyContent: formSteps, startFrom, onFinished: handleFinishStep, skipSteps: skippedSteps });
    const handleBackButtonPress = () => {
        if (isEditing) {
            resetScreenIndex(CONST_1.default.CORPAY_FIELDS.INDEXES.MAPPING.CONFIRMATION);
            return true;
        }
        // Clicking back on the first screen should dismiss the modal
        if (screenIndex === CONST_1.default.CORPAY_FIELDS.INDEXES.MAPPING.COUNTRY_SELECTOR) {
            (0, FormActions_1.clearDraftValues)(ONYXKEYS_1.default.FORMS.INTERNATIONAL_BANK_ACCOUNT_FORM);
            goBack();
            return true;
        }
        // Clicking back on the success screen should dismiss the modal
        if (screenIndex === CONST_1.default.CORPAY_FIELDS.INDEXES.MAPPING.SUCCESS) {
            (0, FormActions_1.clearDraftValues)(ONYXKEYS_1.default.FORMS.INTERNATIONAL_BANK_ACCOUNT_FORM);
            goBack();
            return true;
        }
        prevScreen();
        return true;
    };
    (0, useHandleBackButton_1.default)(handleBackButtonPress);
    const handleNextScreen = (0, react_1.useCallback)(() => {
        if (isEditing) {
            resetScreenIndex(CONST_1.default.CORPAY_FIELDS.INDEXES.MAPPING.CONFIRMATION);
            return;
        }
        nextScreen();
    }, [resetScreenIndex, isEditing, nextScreen]);
    if (isAccountLoading) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<ScreenWrapper_1.default shouldEnableMaxHeight testID={InternationalDepositAccountContent.displayName} forwardedFSClass={CONST_1.default.FULLSTORY.CLASS.MASK}>
            <HeaderWithBackButton_1.default title={translate('bankAccount.addBankAccount')} onBackButtonPress={handleBackButtonPress}/>
            <SubStep isEditing={isEditing} onNext={handleNextScreen} onMove={moveTo} screenIndex={screenIndex} resetScreenIndex={resetScreenIndex} formValues={values} fieldsMap={fieldsMap}/>
        </ScreenWrapper_1.default>);
}
InternationalDepositAccountContent.displayName = 'InternationalDepositAccountContent';
exports.default = InternationalDepositAccountContent;
