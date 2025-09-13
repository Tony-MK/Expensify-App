"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const expensify_common_1 = require("expensify-common");
const pick_1 = require("lodash/pick");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const ReimbursementAccountLoadingIndicator_1 = require("@components/ReimbursementAccountLoadingIndicator");
const RenderHTML_1 = require("@components/RenderHTML");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useBeforeRemove_1 = require("@hooks/useBeforeRemove");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const usePrevious_1 = require("@hooks/usePrevious");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReimbursementAccountUtils_1 = require("@libs/ReimbursementAccountUtils");
const shouldReopenOnfido_1 = require("@libs/shouldReopenOnfido");
const withPolicy_1 = require("@pages/workspace/withPolicy");
const BankAccounts_1 = require("@userActions/BankAccounts");
const Policy_1 = require("@userActions/Policy/Policy");
const ReimbursementAccount_1 = require("@userActions/ReimbursementAccount");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const ConnectedVerifiedBankAccount_1 = require("./ConnectedVerifiedBankAccount");
const NonUSDVerifiedBankAccountFlow_1 = require("./NonUSD/NonUSDVerifiedBankAccountFlow");
const requiresDocusignStep_1 = require("./NonUSD/utils/requiresDocusignStep");
const USDVerifiedBankAccountFlow_1 = require("./USD/USDVerifiedBankAccountFlow");
const getFieldsForStep_1 = require("./USD/utils/getFieldsForStep");
const getStepToOpenFromRouteParams_1 = require("./USD/utils/getStepToOpenFromRouteParams");
const VerifiedBankAccountFlowEntryPoint_1 = require("./VerifiedBankAccountFlowEntryPoint");
function ReimbursementAccountPage({ route, policy, isLoadingPolicy, navigation }) {
    const { environmentURL } = (0, useEnvironment_1.default)();
    const session = (0, OnyxListItemProvider_1.useSession)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: true });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: true });
    const [plaidCurrentEvent = ''] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PLAID_CURRENT_EVENT, { canBeMissing: true });
    const [onfidoToken = ''] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONFIDO_TOKEN, { canBeMissing: true });
    const [isLoadingApp = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    const [isValidateCodeActionModalVisible, setIsValidateCodeActionModalVisible] = (0, react_1.useState)(false);
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const policyName = policy?.name ?? '';
    const policyIDParam = route.params?.policyID;
    const backTo = route.params.backTo;
    const isComingFromExpensifyCard = backTo?.includes(CONST_1.default.EXPENSIFY_CARD.ROUTE);
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const requestorStepRef = (0, react_1.useRef)(null);
    const prevReimbursementAccount = (0, usePrevious_1.default)(reimbursementAccount);
    const prevIsOffline = (0, usePrevious_1.default)(isOffline);
    const policyCurrency = policy?.outputCurrency ?? '';
    const isNonUSDWorkspace = policyCurrency !== CONST_1.default.CURRENCY.USD;
    const hasUnsupportedCurrency = isComingFromExpensifyCard && isBetaEnabled(CONST_1.default.BETAS.EXPENSIFY_CARD_EU_UK) && isNonUSDWorkspace
        ? !(0, CardUtils_1.isCurrencySupportedForECards)(policyCurrency)
        : !(0, Policy_1.isCurrencySupportedForGlobalReimbursement)(policyCurrency, isBetaEnabled(CONST_1.default.BETAS.GLOBAL_REIMBURSEMENTS_ON_ND));
    const nonUSDCountryDraftValue = reimbursementAccountDraft?.country ?? '';
    let workspaceRoute = '';
    const isFocused = (0, native_1.useIsFocused)();
    // Navigation.getActiveRoute() can return the route of previous page while this page is blurred
    // So add isFocused check to get the correct workspaceRoute
    if (isFocused) {
        workspaceRoute = `${environmentURL}/${ROUTES_1.default.WORKSPACE_OVERVIEW.getRoute(policyIDParam, Navigation_1.default.getActiveRoute())}`;
    }
    const contactMethodRoute = `${environmentURL}/${ROUTES_1.default.SETTINGS_CONTACT_METHODS.getRoute(backTo)}`;
    const achData = reimbursementAccount?.achData;
    const isPreviousPolicy = policyIDParam === achData?.policyID;
    const hasConfirmedUSDCurrency = (reimbursementAccountDraft?.[ReimbursementAccountForm_1.default.ADDITIONAL_DATA.COUNTRY] ?? '') !== '' || (achData?.accountNumber ?? '') !== '';
    const isDocusignStepRequired = (0, requiresDocusignStep_1.default)(policyCurrency);
    /**
     We main rely on `achData.currentStep` to determine the step to display in USD flow.
     This data is synchronized with the BE to know which step to resume/start from.
     Except for the CountryStep which exists purely in the FE.
     This function is to decide if we should start from the CountryStep.
     */
    const getInitialCurrentStep = () => {
        if (!hasConfirmedUSDCurrency) {
            return CONST_1.default.BANK_ACCOUNT.STEP.COUNTRY;
        }
        return achData?.currentStep ?? CONST_1.default.BANK_ACCOUNT.STEP.COUNTRY;
    };
    const currentStep = getInitialCurrentStep();
    const [nonUSDBankAccountStep, setNonUSDBankAccountStep] = (0, react_1.useState)(null);
    const [USDBankAccountStep, setUSDBankAccountStep] = (0, react_1.useState)(null);
    function getBankAccountFields(fieldNames) {
        return {
            ...(0, pick_1.default)(reimbursementAccount?.achData, ...fieldNames),
        };
    }
    /**
     * Returns true if a VBBA exists in any state other than OPEN or LOCKED
     */
    const hasInProgressVBBA = (0, react_1.useCallback)(() => {
        return !!achData?.bankAccountID && !!achData?.state && achData?.state !== CONST_1.default.BANK_ACCOUNT.STATE.OPEN && achData?.state !== CONST_1.default.BANK_ACCOUNT.STATE.LOCKED;
    }, [achData?.bankAccountID, achData?.state]);
    /** Returns true if user passed first step of flow for non USD VBBA */
    const hasInProgressNonUSDVBBA = (0, react_1.useCallback)(() => {
        return (!!achData?.bankAccountID && !!achData?.created) || nonUSDCountryDraftValue !== '';
    }, [achData?.bankAccountID, achData?.created, nonUSDCountryDraftValue]);
    /** Returns true if VBBA flow is in progress */
    const shouldShowContinueSetupButtonValue = (0, react_1.useMemo)(() => {
        if (isNonUSDWorkspace) {
            return hasInProgressNonUSDVBBA();
        }
        return hasInProgressVBBA();
    }, [isNonUSDWorkspace, hasInProgressNonUSDVBBA, hasInProgressVBBA]);
    /**
     When this page is first opened, `reimbursementAccount` prop might not yet be fully loaded from Onyx.
     Calculating `shouldShowContinueSetupButton` immediately on initial render doesn't make sense as
     it relies on incomplete data. Thus, we should wait to calculate it until we have received
     the full `reimbursementAccount` data from the server. This logic is handled within the useEffect hook,
     which acts similarly to `componentDidUpdate` when the `reimbursementAccount` dependency changes.
     */
    const [hasACHDataBeenLoaded, setHasACHDataBeenLoaded] = (0, react_1.useState)(reimbursementAccount !== CONST_1.default.REIMBURSEMENT_ACCOUNT.DEFAULT_DATA && isPreviousPolicy);
    const [shouldShowContinueSetupButton, setShouldShowContinueSetupButton] = (0, react_1.useState)(shouldShowContinueSetupButtonValue);
    const [shouldShowConnectedVerifiedBankAccount, setShouldShowConnectedVerifiedBankAccount] = (0, react_1.useState)(false);
    /**
     * Retrieve verified business bank account currently being set up.
     */
    function fetchData(preserveCurrentStep = false) {
        // We can specify a step to navigate to by using route params when the component mounts.
        // We want to use the same stepToOpen variable when the network state changes because we can be redirected to a different step when the account refreshes.
        const stepToOpen = preserveCurrentStep ? currentStep : (0, getStepToOpenFromRouteParams_1.default)(route, hasConfirmedUSDCurrency);
        const subStep = isPreviousPolicy ? (achData?.subStep ?? '') : '';
        let localCurrentStep = '';
        if (preserveCurrentStep) {
            localCurrentStep = currentStep;
        }
        else if (isPreviousPolicy) {
            localCurrentStep = achData?.currentStep ?? '';
        }
        if (policyIDParam) {
            (0, BankAccounts_1.openReimbursementAccountPage)(stepToOpen, subStep, localCurrentStep, policyIDParam);
        }
    }
    (0, useBeforeRemove_1.default)(() => setIsValidateCodeActionModalVisible(false));
    (0, react_1.useEffect)(() => {
        if (isPreviousPolicy) {
            return;
        }
        if (policyIDParam) {
            (0, BankAccounts_1.setReimbursementAccountLoading)(true);
        }
        (0, ReimbursementAccount_1.clearReimbursementAccountDraft)();
        // If the step to open is empty, we want to clear the sub step, so the connect option view is shown to the user
        const isStepToOpenEmpty = (0, getStepToOpenFromRouteParams_1.default)(route, hasConfirmedUSDCurrency) === '';
        if (isStepToOpenEmpty) {
            (0, BankAccounts_1.setBankAccountSubStep)(null);
            (0, BankAccounts_1.setPlaidEvent)(null);
        }
        fetchData();
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isPreviousPolicy]); // Only re-run this effect when isPreviousPolicy changes, which happens once when the component first loads
    (0, react_1.useEffect)(() => {
        if (!isPreviousPolicy) {
            return;
        }
        setShouldShowConnectedVerifiedBankAccount(isNonUSDWorkspace ? achData?.state === CONST_1.default.BANK_ACCOUNT.STATE.OPEN : achData?.currentStep === CONST_1.default.BANK_ACCOUNT.STEP.ENABLE);
        setShouldShowContinueSetupButton(shouldShowContinueSetupButtonValue);
    }, [achData?.currentStep, shouldShowContinueSetupButtonValue, isNonUSDWorkspace, isPreviousPolicy, achData?.state]);
    (0, react_1.useEffect)(() => {
        // Check for network change from offline to online
        if (prevIsOffline && !isOffline && prevReimbursementAccount && prevReimbursementAccount.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE) {
            fetchData(true);
        }
        if (!hasACHDataBeenLoaded) {
            if (reimbursementAccount !== CONST_1.default.REIMBURSEMENT_ACCOUNT.DEFAULT_DATA && reimbursementAccount?.isLoading === false) {
                setHasACHDataBeenLoaded(true);
            }
            return;
        }
        if (prevReimbursementAccount &&
            prevReimbursementAccount.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE &&
            reimbursementAccount?.pendingAction !== prevReimbursementAccount.pendingAction) {
            setShouldShowContinueSetupButton(hasInProgressVBBA());
        }
        if (shouldShowContinueSetupButton) {
            return;
        }
        const currentStepRouteParam = (0, getStepToOpenFromRouteParams_1.default)(route, hasConfirmedUSDCurrency);
        if (currentStepRouteParam === currentStep) {
            // If the user is connecting online with plaid, reset any bank account errors so we don't persist old data from a potential previous connection
            if (currentStep === CONST_1.default.BANK_ACCOUNT.STEP.BANK_ACCOUNT && achData?.subStep === CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.PLAID) {
                (0, BankAccounts_1.hideBankAccountErrors)();
            }
            // The route is showing the correct step, no need to update the route param or clear errors.
            return;
        }
        // Update the data that is returned from back-end to draft value
        const draftStep = reimbursementAccount?.draftStep;
        if (draftStep) {
            (0, BankAccounts_1.updateReimbursementAccountDraft)(getBankAccountFields((0, getFieldsForStep_1.default)(draftStep)));
        }
        if (currentStepRouteParam !== '') {
            // When we click "Connect bank account", we load the page without the current step param, if there
            // was an error when we tried to disconnect or start over, we want the user to be able to see the error,
            // so we don't clear it. We only want to clear the errors if we are moving between steps.
            (0, BankAccounts_1.hideBankAccountErrors)();
        }
        // Use the current page navigation object to set the param to the correct route in the stack
        navigation.setParams({ stepToOpen: (0, ReimbursementAccountUtils_1.getRouteForCurrentStep)(currentStep) });
    }, 
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    [isOffline, reimbursementAccount, hasACHDataBeenLoaded, shouldShowContinueSetupButton, currentStep]);
    const continueUSDVBBASetup = (0, react_1.useCallback)(() => {
        // If user comes back to the flow we never want to allow him to go through plaid again
        // so we're always showing manual setup with locked numbers he can not change
        (0, BankAccounts_1.setBankAccountSubStep)(CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.MANUAL).then(() => {
            setShouldShowContinueSetupButton(false);
            setUSDBankAccountStep(currentStep);
        });
    }, [currentStep]);
    const continueNonUSDVBBASetup = () => {
        const isPastSignerStep = achData?.corpay?.signerFullName && achData?.corpay?.authorizedToBindClientToAgreement === undefined;
        const allAgreementsChecked = reimbursementAccountDraft?.authorizedToBindClientToAgreement === true &&
            reimbursementAccountDraft?.agreeToTermsAndConditions === true &&
            reimbursementAccountDraft?.consentToPrivacyNotice === true &&
            reimbursementAccountDraft?.provideTruthfulInformation === true;
        setShouldShowContinueSetupButton(false);
        if (nonUSDCountryDraftValue !== '' && achData?.created === undefined) {
            setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.BANK_INFO);
            return;
        }
        if (achData?.created && achData?.corpay?.companyName === undefined) {
            setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.BUSINESS_INFO);
            return;
        }
        if (achData?.corpay?.companyName && achData?.corpay?.anyIndividualOwn25PercentOrMore === undefined) {
            setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.BENEFICIAL_OWNER_INFO);
            return;
        }
        if (achData?.corpay?.anyIndividualOwn25PercentOrMore !== undefined && achData?.corpay?.signerFullName === undefined) {
            setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.SIGNER_INFO);
            return;
        }
        if (isPastSignerStep && !allAgreementsChecked) {
            setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.AGREEMENTS);
            return;
        }
        if (isPastSignerStep && allAgreementsChecked && !isDocusignStepRequired) {
            setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.AGREEMENTS);
            return;
        }
        if (isPastSignerStep && allAgreementsChecked && isDocusignStepRequired) {
            setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.DOCUSIGN);
            return;
        }
        if (achData?.state === CONST_1.default.BANK_ACCOUNT.STATE.VERIFYING) {
            setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.FINISH);
        }
    };
    const goBack = (0, react_1.useCallback)(() => {
        const shouldShowOnfido = onfidoToken && !achData?.isOnfidoSetupComplete;
        switch (currentStep) {
            case CONST_1.default.BANK_ACCOUNT.STEP.COUNTRY:
                if (hasInProgressVBBA()) {
                    setShouldShowContinueSetupButton(true);
                }
                setUSDBankAccountStep(null);
                (0, BankAccounts_1.setBankAccountSubStep)(null);
                break;
            case CONST_1.default.BANK_ACCOUNT.STEP.BANK_ACCOUNT:
                (0, BankAccounts_1.setPlaidEvent)(null);
                (0, BankAccounts_1.goToWithdrawalAccountSetupStep)(CONST_1.default.BANK_ACCOUNT.STEP.COUNTRY);
                break;
            case CONST_1.default.BANK_ACCOUNT.STEP.COMPANY:
                (0, BankAccounts_1.clearOnfidoToken)();
                (0, BankAccounts_1.goToWithdrawalAccountSetupStep)(CONST_1.default.BANK_ACCOUNT.STEP.REQUESTOR);
                break;
            case CONST_1.default.BANK_ACCOUNT.STEP.REQUESTOR:
                if (shouldShowOnfido) {
                    (0, BankAccounts_1.clearOnfidoToken)();
                }
                else {
                    (0, BankAccounts_1.goToWithdrawalAccountSetupStep)(CONST_1.default.BANK_ACCOUNT.STEP.BANK_ACCOUNT);
                }
                break;
            case CONST_1.default.BANK_ACCOUNT.STEP.BENEFICIAL_OWNERS:
                (0, BankAccounts_1.goToWithdrawalAccountSetupStep)(CONST_1.default.BANK_ACCOUNT.STEP.COMPANY);
                break;
            case CONST_1.default.BANK_ACCOUNT.STEP.ACH_CONTRACT:
                (0, BankAccounts_1.goToWithdrawalAccountSetupStep)(CONST_1.default.BANK_ACCOUNT.STEP.BENEFICIAL_OWNERS);
                break;
            case CONST_1.default.BANK_ACCOUNT.STEP.VALIDATION:
                if ([CONST_1.default.BANK_ACCOUNT.STATE.VERIFYING, CONST_1.default.BANK_ACCOUNT.STATE.SETUP].some((value) => value === achData?.state)) {
                    (0, BankAccounts_1.goToWithdrawalAccountSetupStep)(CONST_1.default.BANK_ACCOUNT.STEP.ACH_CONTRACT);
                }
                else if (!isOffline && achData?.state === CONST_1.default.BANK_ACCOUNT.STATE.PENDING) {
                    setShouldShowContinueSetupButton(true);
                    setUSDBankAccountStep(null);
                }
                else {
                    Navigation_1.default.goBack();
                }
                break;
            default:
                Navigation_1.default.dismissModal();
        }
    }, [achData?.isOnfidoSetupComplete, achData?.state, currentStep, hasInProgressVBBA, isOffline, onfidoToken]);
    const isLoading = (isLoadingApp || (reimbursementAccount?.isLoading && !reimbursementAccount?.isCreateCorpayBankAccount)) &&
        (!plaidCurrentEvent || plaidCurrentEvent === CONST_1.default.BANK_ACCOUNT.PLAID.EVENTS_NAME.EXIT);
    const shouldShowOfflineLoader = !(isOffline &&
        [
            CONST_1.default.BANK_ACCOUNT.STEP.COUNTRY,
            CONST_1.default.BANK_ACCOUNT.STEP.BANK_ACCOUNT,
            CONST_1.default.BANK_ACCOUNT.STEP.COMPANY,
            CONST_1.default.BANK_ACCOUNT.STEP.REQUESTOR,
            CONST_1.default.BANK_ACCOUNT.STEP.BENEFICIAL_OWNERS,
            CONST_1.default.BANK_ACCOUNT.STEP.ACH_CONTRACT,
        ].some((value) => value === currentStep));
    if (isLoadingPolicy) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    // Show loading indicator when page is first time being opened and props.reimbursementAccount yet to be loaded from the server
    // or when data is being loaded. Don't show the loading indicator if we're offline and restarted the bank account setup process
    // On Android, when we open the app from the background, Onfido activity gets destroyed, so we need to reopen it.
    // eslint-disable-next-line react-compiler/react-compiler
    if ((!hasACHDataBeenLoaded || isLoading) &&
        shouldShowOfflineLoader &&
        (shouldReopenOnfido_1.default || !requestorStepRef?.current) &&
        !(currentStep === CONST_1.default.BANK_ACCOUNT.STEP.BANK_ACCOUNT && isValidateCodeActionModalVisible)) {
        return <ReimbursementAccountLoadingIndicator_1.default onBackButtonPress={goBack}/>;
    }
    if ((!isLoading && ((0, EmptyObject_1.isEmptyObject)(policy) || !(0, PolicyUtils_1.isPolicyAdmin)(policy))) || (0, PolicyUtils_1.isPendingDeletePolicy)(policy)) {
        return (<ScreenWrapper_1.default testID={ReimbursementAccountPage.displayName}>
                <FullPageNotFoundView_1.default shouldShow onBackButtonPress={PolicyUtils_1.goBackFromInvalidPolicy} onLinkPress={PolicyUtils_1.goBackFromInvalidPolicy} subtitleKey={(0, EmptyObject_1.isEmptyObject)(policy) || (0, PolicyUtils_1.isPendingDeletePolicy)(policy) ? undefined : 'workspace.common.notAuthorized'}/>
            </ScreenWrapper_1.default>);
    }
    let errorText;
    const userHasPhonePrimaryEmail = expensify_common_1.Str.endsWith(session?.email ?? '', CONST_1.default.SMS.DOMAIN);
    const throttledDate = reimbursementAccount?.throttledDate ?? '';
    if (userHasPhonePrimaryEmail) {
        errorText = <RenderHTML_1.default html={translate('bankAccount.hasPhoneLoginError', { contactMethodRoute })}/>;
    }
    else if (throttledDate) {
        errorText = <Text_1.default>{translate('bankAccount.hasBeenThrottledError')}</Text_1.default>;
    }
    else if (hasUnsupportedCurrency) {
        errorText = <RenderHTML_1.default html={translate('bankAccount.hasCurrencyError', { workspaceRoute })}/>;
    }
    if (errorText) {
        return (<ScreenWrapper_1.default testID={ReimbursementAccountPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('bankAccount.addBankAccount')} subtitle={policyName} onBackButtonPress={() => Navigation_1.default.goBack(backTo)}/>
                <react_native_1.View style={[styles.m5, styles.mv3, styles.flex1]}>{errorText}</react_native_1.View>
            </ScreenWrapper_1.default>);
    }
    if (shouldShowConnectedVerifiedBankAccount) {
        return (<ConnectedVerifiedBankAccount_1.default reimbursementAccount={reimbursementAccount} setShouldShowConnectedVerifiedBankAccount={setShouldShowConnectedVerifiedBankAccount} setUSDBankAccountStep={setUSDBankAccountStep} setNonUSDBankAccountStep={setNonUSDBankAccountStep} onBackButtonPress={goBack} isNonUSDWorkspace={isNonUSDWorkspace}/>);
    }
    if (isNonUSDWorkspace && nonUSDBankAccountStep !== null) {
        return (<NonUSDVerifiedBankAccountFlow_1.default nonUSDBankAccountStep={nonUSDBankAccountStep} setNonUSDBankAccountStep={setNonUSDBankAccountStep} setShouldShowContinueSetupButton={setShouldShowContinueSetupButton} policyID={policyIDParam} isComingFromExpensifyCard={isComingFromExpensifyCard} shouldShowContinueSetupButtonValue={shouldShowContinueSetupButtonValue} policyCurrency={policyCurrency}/>);
    }
    if (USDBankAccountStep !== null) {
        return (<USDVerifiedBankAccountFlow_1.default USDBankAccountStep={currentStep} policyID={policyIDParam} onBackButtonPress={goBack} requestorStepRef={requestorStepRef} onfidoToken={onfidoToken} setUSDBankAccountStep={setUSDBankAccountStep} setShouldShowConnectedVerifiedBankAccount={setShouldShowConnectedVerifiedBankAccount}/>);
    }
    return (<VerifiedBankAccountFlowEntryPoint_1.default setShouldShowContinueSetupButton={setShouldShowContinueSetupButton} reimbursementAccount={reimbursementAccount} onContinuePress={isNonUSDWorkspace ? continueNonUSDVBBASetup : continueUSDVBBASetup} policyName={policyName} isValidateCodeActionModalVisible={isValidateCodeActionModalVisible} toggleValidateCodeActionModal={setIsValidateCodeActionModalVisible} onBackButtonPress={Navigation_1.default.goBack} shouldShowContinueSetupButton={shouldShowContinueSetupButton} isNonUSDWorkspace={isNonUSDWorkspace} setNonUSDBankAccountStep={setNonUSDBankAccountStep} setUSDBankAccountStep={setUSDBankAccountStep} policyID={policyIDParam}/>);
}
ReimbursementAccountPage.displayName = 'ReimbursementAccountPage';
exports.default = (0, withPolicy_1.default)(ReimbursementAccountPage);
