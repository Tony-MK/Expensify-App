"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const ValidateCodeActionModal_1 = require("@components/ValidateCodeActionModal");
const useBeforeRemove_1 = require("@hooks/useBeforeRemove");
const useDefaultFundID_1 = require("@hooks/useDefaultFundID");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Card_1 = require("@libs/actions/Card");
const User_1 = require("@libs/actions/User");
const CardUtils_1 = require("@libs/CardUtils");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const Navigation_1 = require("@navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function ConfirmationStep({ policyID, backTo, stepNames, startStepIndex }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [issueNewCard] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.ISSUE_NEW_EXPENSIFY_CARD}${policyID}`, { canBeMissing: true });
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: true });
    const validateError = (0, ErrorUtils_1.getLatestErrorMessageField)(issueNewCard);
    const [isValidateCodeActionModalVisible, setIsValidateCodeActionModalVisible] = (0, react_1.useState)(false);
    const data = issueNewCard?.data;
    const isSuccessful = issueNewCard?.isSuccessful;
    const defaultFundID = (0, useDefaultFundID_1.default)(policyID);
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const hasApprovalError = !!policy?.errorFields?.approvalMode;
    const isAddApprovalEnabled = policy?.approvalMode !== CONST_1.default.POLICY.APPROVAL_MODE.OPTIONAL && !hasApprovalError;
    const shouldDisableSubmitButton = !isAddApprovalEnabled && data?.limitType === CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.SMART;
    const submitButton = (0, react_1.useRef)(null);
    (0, useBeforeRemove_1.default)(() => setIsValidateCodeActionModalVisible(false));
    (0, react_1.useEffect)(() => {
        submitButton.current?.focus();
        (0, User_1.resetValidateActionCodeSent)();
    }, []);
    (0, react_1.useEffect)(() => {
        if (!isSuccessful) {
            return;
        }
        if (backTo) {
            Navigation_1.default.goBack(backTo);
        }
        else {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD.getRoute(policyID));
        }
        (0, Card_1.clearIssueNewCardFlow)(policyID);
    }, [backTo, policyID, isSuccessful]);
    const submit = (validateCode) => {
        // NOTE: For Expensify Card UK/EU, the backend will automatically detect the correct feedCountry to use
        (0, Card_1.issueExpensifyCard)(defaultFundID, policyID, isBetaEnabled(CONST_1.default.BETAS.EXPENSIFY_CARD_EU_UK) ? '' : CONST_1.default.COUNTRY.US, validateCode, data);
    };
    const errorMessage = (0, ErrorUtils_1.getLatestErrorMessage)(issueNewCard) || (shouldDisableSubmitButton ? translate('workspace.card.issueNewCard.disabledApprovalForSmartLimitError') : '');
    const editStep = (step) => {
        (0, Card_1.setIssueNewCardStepAndData)({ step, isEditing: true, policyID });
    };
    const handleBackButtonPress = () => {
        (0, Card_1.setIssueNewCardStepAndData)({ step: CONST_1.default.EXPENSIFY_CARD.STEP.CARD_NAME, policyID });
    };
    const translationForLimitType = (0, CardUtils_1.getTranslationKeyForLimitType)(data?.limitType);
    return (<InteractiveStepWrapper_1.default wrapperID={ConfirmationStep.displayName} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight headerTitle={translate('workspace.card.issueCard')} handleBackButtonPress={handleBackButtonPress} startStepIndex={startStepIndex} stepNames={stepNames} enableEdgeToEdgeBottomSafeAreaPadding>
            <ScrollView_1.default style={styles.pt0} contentContainerStyle={styles.flexGrow1} addBottomSafeAreaPadding>
                <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mt3]}>{translate('workspace.card.issueNewCard.letsDoubleCheck')}</Text_1.default>
                <Text_1.default style={[styles.textSupporting, styles.ph5, styles.mv3]}>{translate('workspace.card.issueNewCard.willBeReady')}</Text_1.default>
                <MenuItemWithTopDescription_1.default description={translate('workspace.card.issueNewCard.cardholder')} title={(0, PersonalDetailsUtils_1.getUserNameByEmail)(data?.assigneeEmail ?? '', 'displayName')} shouldShowRightIcon={!issueNewCard?.isChangeAssigneeDisabled} interactive={!issueNewCard?.isChangeAssigneeDisabled} onPress={() => editStep(CONST_1.default.EXPENSIFY_CARD.STEP.ASSIGNEE)}/>
                <MenuItemWithTopDescription_1.default description={translate('workspace.card.issueNewCard.cardType')} title={data?.cardType ? translate(`workspace.card.issueNewCard.${data?.cardType}Card`) : ''} shouldShowRightIcon onPress={() => editStep(CONST_1.default.EXPENSIFY_CARD.STEP.CARD_TYPE)}/>
                <MenuItemWithTopDescription_1.default description={translate('workspace.card.issueNewCard.limit')} title={(0, CurrencyUtils_1.convertToShortDisplayString)(data?.limit, data?.currency)} shouldShowRightIcon onPress={() => editStep(CONST_1.default.EXPENSIFY_CARD.STEP.LIMIT)}/>
                <MenuItemWithTopDescription_1.default description={translate('workspace.card.issueNewCard.limitType')} title={translationForLimitType ? translate(translationForLimitType) : ''} shouldShowRightIcon onPress={() => editStep(CONST_1.default.EXPENSIFY_CARD.STEP.LIMIT_TYPE)}/>
                <MenuItemWithTopDescription_1.default description={translate('workspace.card.issueNewCard.name')} title={data?.cardTitle} shouldShowRightIcon onPress={() => editStep(CONST_1.default.EXPENSIFY_CARD.STEP.CARD_NAME)}/>
                <react_native_1.View style={[styles.mh5, styles.pb5, styles.mt3, styles.flexGrow1, styles.justifyContentEnd]}>
                    <FormAlertWithSubmitButton_1.default buttonRef={submitButton} message={errorMessage} isAlertVisible={!!errorMessage} isDisabled={isOffline || shouldDisableSubmitButton} isMessageHtml={shouldDisableSubmitButton} isLoading={issueNewCard?.isLoading} onSubmit={() => setIsValidateCodeActionModalVisible(true)} buttonText={translate('workspace.card.issueCard')}/>
                </react_native_1.View>
            </ScrollView_1.default>
            {!!issueNewCard && (<ValidateCodeActionModal_1.default handleSubmitForm={submit} isLoading={issueNewCard?.isLoading} sendValidateCode={User_1.requestValidateCodeAction} validateCodeActionErrorField={data?.cardType === CONST_1.default.EXPENSIFY_CARD.CARD_TYPE.PHYSICAL ? 'createExpensifyCard' : 'createAdminIssuedVirtualCard'} validateError={validateError} clearError={() => (0, Card_1.clearIssueNewCardError)(policyID)} onClose={() => setIsValidateCodeActionModalVisible(false)} isVisible={isValidateCodeActionModalVisible} title={translate('cardPage.validateCardTitle')} descriptionPrimary={translate('cardPage.enterMagicCode', { contactMethod: account?.primaryLogin ?? '' })}/>)}
        </InteractiveStepWrapper_1.default>);
}
ConfirmationStep.displayName = 'ConfirmationStep';
exports.default = ConfirmationStep;
