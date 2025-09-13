"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var native_1 = require("@react-navigation/native");
var expensify_common_1 = require("expensify-common");
var pick_1 = require("lodash/pick");
var react_1 = require("react");
var react_native_1 = require("react-native");
var FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
var FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var ReimbursementAccountLoadingIndicator_1 = require("@components/ReimbursementAccountLoadingIndicator");
var RenderHTML_1 = require("@components/RenderHTML");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var Text_1 = require("@components/Text");
var useBeforeRemove_1 = require("@hooks/useBeforeRemove");
var useEnvironment_1 = require("@hooks/useEnvironment");
var useLocalize_1 = require("@hooks/useLocalize");
var useNetwork_1 = require("@hooks/useNetwork");
var useOnyx_1 = require("@hooks/useOnyx");
var usePermissions_1 = require("@hooks/usePermissions");
var usePrevious_1 = require("@hooks/usePrevious");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var CardUtils_1 = require("@libs/CardUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var ReimbursementAccountUtils_1 = require("@libs/ReimbursementAccountUtils");
var shouldReopenOnfido_1 = require("@libs/shouldReopenOnfido");
var withPolicy_1 = require("@pages/workspace/withPolicy");
var BankAccounts_1 = require("@userActions/BankAccounts");
var Policy_1 = require("@userActions/Policy/Policy");
var ReimbursementAccount_1 = require("@userActions/ReimbursementAccount");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
var ConnectedVerifiedBankAccount_1 = require("./ConnectedVerifiedBankAccount");
var NonUSDVerifiedBankAccountFlow_1 = require("./NonUSD/NonUSDVerifiedBankAccountFlow");
var requiresDocusignStep_1 = require("./NonUSD/utils/requiresDocusignStep");
var USDVerifiedBankAccountFlow_1 = require("./USD/USDVerifiedBankAccountFlow");
var getFieldsForStep_1 = require("./USD/utils/getFieldsForStep");
var getStepToOpenFromRouteParams_1 = require("./USD/utils/getStepToOpenFromRouteParams");
var VerifiedBankAccountFlowEntryPoint_1 = require("./VerifiedBankAccountFlowEntryPoint");
function ReimbursementAccountPage(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j;
    var route = _a.route, policy = _a.policy, isLoadingPolicy = _a.isLoadingPolicy, navigation = _a.navigation;
    var environmentURL = (0, useEnvironment_1.default)().environmentURL;
    var session = (0, OnyxListItemProvider_1.useSession)();
    var reimbursementAccount = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: true })[0];
    var reimbursementAccountDraft = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: true })[0];
    var _k = (0, useOnyx_1.default)(ONYXKEYS_1.default.PLAID_CURRENT_EVENT, { canBeMissing: true })[0], plaidCurrentEvent = _k === void 0 ? '' : _k;
    var _l = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONFIDO_TOKEN, { canBeMissing: true })[0], onfidoToken = _l === void 0 ? '' : _l;
    var _m = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true })[0], isLoadingApp = _m === void 0 ? false : _m;
    var _o = (0, react_1.useState)(false), isValidateCodeActionModalVisible = _o[0], setIsValidateCodeActionModalVisible = _o[1];
    var isBetaEnabled = (0, usePermissions_1.default)().isBetaEnabled;
    var policyName = (_b = policy === null || policy === void 0 ? void 0 : policy.name) !== null && _b !== void 0 ? _b : '';
    var policyIDParam = (_c = route.params) === null || _c === void 0 ? void 0 : _c.policyID;
    var backTo = route.params.backTo;
    var isComingFromExpensifyCard = backTo === null || backTo === void 0 ? void 0 : backTo.includes(CONST_1.default.EXPENSIFY_CARD.ROUTE);
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var isOffline = (0, useNetwork_1.default)().isOffline;
    var requestorStepRef = (0, react_1.useRef)(null);
    var prevReimbursementAccount = (0, usePrevious_1.default)(reimbursementAccount);
    var prevIsOffline = (0, usePrevious_1.default)(isOffline);
    var policyCurrency = (_d = policy === null || policy === void 0 ? void 0 : policy.outputCurrency) !== null && _d !== void 0 ? _d : '';
    var isNonUSDWorkspace = policyCurrency !== CONST_1.default.CURRENCY.USD;
    var hasUnsupportedCurrency = isComingFromExpensifyCard && isBetaEnabled(CONST_1.default.BETAS.EXPENSIFY_CARD_EU_UK) && isNonUSDWorkspace
        ? !(0, CardUtils_1.isCurrencySupportedForECards)(policyCurrency)
        : !(0, Policy_1.isCurrencySupportedForGlobalReimbursement)(policyCurrency, isBetaEnabled(CONST_1.default.BETAS.GLOBAL_REIMBURSEMENTS_ON_ND));
    var nonUSDCountryDraftValue = (_e = reimbursementAccountDraft === null || reimbursementAccountDraft === void 0 ? void 0 : reimbursementAccountDraft.country) !== null && _e !== void 0 ? _e : '';
    var workspaceRoute = '';
    var isFocused = (0, native_1.useIsFocused)();
    // Navigation.getActiveRoute() can return the route of previous page while this page is blurred
    // So add isFocused check to get the correct workspaceRoute
    if (isFocused) {
        workspaceRoute = "".concat(environmentURL, "/").concat(ROUTES_1.default.WORKSPACE_OVERVIEW.getRoute(policyIDParam, Navigation_1.default.getActiveRoute()));
    }
    var contactMethodRoute = "".concat(environmentURL, "/").concat(ROUTES_1.default.SETTINGS_CONTACT_METHODS.getRoute(backTo));
    var achData = reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.achData;
    var isPreviousPolicy = policyIDParam === (achData === null || achData === void 0 ? void 0 : achData.policyID);
    var hasConfirmedUSDCurrency = ((_f = reimbursementAccountDraft === null || reimbursementAccountDraft === void 0 ? void 0 : reimbursementAccountDraft[ReimbursementAccountForm_1.default.ADDITIONAL_DATA.COUNTRY]) !== null && _f !== void 0 ? _f : '') !== '' || ((_g = achData === null || achData === void 0 ? void 0 : achData.accountNumber) !== null && _g !== void 0 ? _g : '') !== '';
    var isDocusignStepRequired = (0, requiresDocusignStep_1.default)(policyCurrency);
    /**
     We main rely on `achData.currentStep` to determine the step to display in USD flow.
     This data is synchronized with the BE to know which step to resume/start from.
     Except for the CountryStep which exists purely in the FE.
     This function is to decide if we should start from the CountryStep.
     */
    var getInitialCurrentStep = function () {
        var _a;
        if (!hasConfirmedUSDCurrency) {
            return CONST_1.default.BANK_ACCOUNT.STEP.COUNTRY;
        }
        return (_a = achData === null || achData === void 0 ? void 0 : achData.currentStep) !== null && _a !== void 0 ? _a : CONST_1.default.BANK_ACCOUNT.STEP.COUNTRY;
    };
    var currentStep = getInitialCurrentStep();
    var _p = (0, react_1.useState)(null), nonUSDBankAccountStep = _p[0], setNonUSDBankAccountStep = _p[1];
    var _q = (0, react_1.useState)(null), USDBankAccountStep = _q[0], setUSDBankAccountStep = _q[1];
    function getBankAccountFields(fieldNames) {
        return __assign({}, pick_1.default.apply(void 0, __spreadArray([reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.achData], fieldNames, false)));
    }
    /**
     * Returns true if a VBBA exists in any state other than OPEN or LOCKED
     */
    var hasInProgressVBBA = (0, react_1.useCallback)(function () {
        return !!(achData === null || achData === void 0 ? void 0 : achData.bankAccountID) && !!(achData === null || achData === void 0 ? void 0 : achData.state) && (achData === null || achData === void 0 ? void 0 : achData.state) !== CONST_1.default.BANK_ACCOUNT.STATE.OPEN && (achData === null || achData === void 0 ? void 0 : achData.state) !== CONST_1.default.BANK_ACCOUNT.STATE.LOCKED;
    }, [achData === null || achData === void 0 ? void 0 : achData.bankAccountID, achData === null || achData === void 0 ? void 0 : achData.state]);
    /** Returns true if user passed first step of flow for non USD VBBA */
    var hasInProgressNonUSDVBBA = (0, react_1.useCallback)(function () {
        return (!!(achData === null || achData === void 0 ? void 0 : achData.bankAccountID) && !!(achData === null || achData === void 0 ? void 0 : achData.created)) || nonUSDCountryDraftValue !== '';
    }, [achData === null || achData === void 0 ? void 0 : achData.bankAccountID, achData === null || achData === void 0 ? void 0 : achData.created, nonUSDCountryDraftValue]);
    /** Returns true if VBBA flow is in progress */
    var shouldShowContinueSetupButtonValue = (0, react_1.useMemo)(function () {
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
    var _r = (0, react_1.useState)(reimbursementAccount !== CONST_1.default.REIMBURSEMENT_ACCOUNT.DEFAULT_DATA && isPreviousPolicy), hasACHDataBeenLoaded = _r[0], setHasACHDataBeenLoaded = _r[1];
    var _s = (0, react_1.useState)(shouldShowContinueSetupButtonValue), shouldShowContinueSetupButton = _s[0], setShouldShowContinueSetupButton = _s[1];
    var _t = (0, react_1.useState)(false), shouldShowConnectedVerifiedBankAccount = _t[0], setShouldShowConnectedVerifiedBankAccount = _t[1];
    /**
     * Retrieve verified business bank account currently being set up.
     */
    function fetchData(preserveCurrentStep) {
        var _a, _b;
        if (preserveCurrentStep === void 0) { preserveCurrentStep = false; }
        // We can specify a step to navigate to by using route params when the component mounts.
        // We want to use the same stepToOpen variable when the network state changes because we can be redirected to a different step when the account refreshes.
        var stepToOpen = preserveCurrentStep ? currentStep : (0, getStepToOpenFromRouteParams_1.default)(route, hasConfirmedUSDCurrency);
        var subStep = isPreviousPolicy ? ((_a = achData === null || achData === void 0 ? void 0 : achData.subStep) !== null && _a !== void 0 ? _a : '') : '';
        var localCurrentStep = '';
        if (preserveCurrentStep) {
            localCurrentStep = currentStep;
        }
        else if (isPreviousPolicy) {
            localCurrentStep = (_b = achData === null || achData === void 0 ? void 0 : achData.currentStep) !== null && _b !== void 0 ? _b : '';
        }
        if (policyIDParam) {
            (0, BankAccounts_1.openReimbursementAccountPage)(stepToOpen, subStep, localCurrentStep, policyIDParam);
        }
    }
    (0, useBeforeRemove_1.default)(function () { return setIsValidateCodeActionModalVisible(false); });
    (0, react_1.useEffect)(function () {
        if (isPreviousPolicy) {
            return;
        }
        if (policyIDParam) {
            (0, BankAccounts_1.setReimbursementAccountLoading)(true);
        }
        (0, ReimbursementAccount_1.clearReimbursementAccountDraft)();
        // If the step to open is empty, we want to clear the sub step, so the connect option view is shown to the user
        var isStepToOpenEmpty = (0, getStepToOpenFromRouteParams_1.default)(route, hasConfirmedUSDCurrency) === '';
        if (isStepToOpenEmpty) {
            (0, BankAccounts_1.setBankAccountSubStep)(null);
            (0, BankAccounts_1.setPlaidEvent)(null);
        }
        fetchData();
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isPreviousPolicy]); // Only re-run this effect when isPreviousPolicy changes, which happens once when the component first loads
    (0, react_1.useEffect)(function () {
        if (!isPreviousPolicy) {
            return;
        }
        setShouldShowConnectedVerifiedBankAccount(isNonUSDWorkspace ? (achData === null || achData === void 0 ? void 0 : achData.state) === CONST_1.default.BANK_ACCOUNT.STATE.OPEN : (achData === null || achData === void 0 ? void 0 : achData.currentStep) === CONST_1.default.BANK_ACCOUNT.STEP.ENABLE);
        setShouldShowContinueSetupButton(shouldShowContinueSetupButtonValue);
    }, [achData === null || achData === void 0 ? void 0 : achData.currentStep, shouldShowContinueSetupButtonValue, isNonUSDWorkspace, isPreviousPolicy, achData === null || achData === void 0 ? void 0 : achData.state]);
    (0, react_1.useEffect)(function () {
        // Check for network change from offline to online
        if (prevIsOffline && !isOffline && prevReimbursementAccount && prevReimbursementAccount.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE) {
            fetchData(true);
        }
        if (!hasACHDataBeenLoaded) {
            if (reimbursementAccount !== CONST_1.default.REIMBURSEMENT_ACCOUNT.DEFAULT_DATA && (reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.isLoading) === false) {
                setHasACHDataBeenLoaded(true);
            }
            return;
        }
        if (prevReimbursementAccount &&
            prevReimbursementAccount.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE &&
            (reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.pendingAction) !== prevReimbursementAccount.pendingAction) {
            setShouldShowContinueSetupButton(hasInProgressVBBA());
        }
        if (shouldShowContinueSetupButton) {
            return;
        }
        var currentStepRouteParam = (0, getStepToOpenFromRouteParams_1.default)(route, hasConfirmedUSDCurrency);
        if (currentStepRouteParam === currentStep) {
            // If the user is connecting online with plaid, reset any bank account errors so we don't persist old data from a potential previous connection
            if (currentStep === CONST_1.default.BANK_ACCOUNT.STEP.BANK_ACCOUNT && (achData === null || achData === void 0 ? void 0 : achData.subStep) === CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.PLAID) {
                (0, BankAccounts_1.hideBankAccountErrors)();
            }
            // The route is showing the correct step, no need to update the route param or clear errors.
            return;
        }
        // Update the data that is returned from back-end to draft value
        var draftStep = reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.draftStep;
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
    var continueUSDVBBASetup = (0, react_1.useCallback)(function () {
        // If user comes back to the flow we never want to allow him to go through plaid again
        // so we're always showing manual setup with locked numbers he can not change
        (0, BankAccounts_1.setBankAccountSubStep)(CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.MANUAL).then(function () {
            setShouldShowContinueSetupButton(false);
            setUSDBankAccountStep(currentStep);
        });
    }, [currentStep]);
    var continueNonUSDVBBASetup = function () {
        var _a, _b, _c, _d, _e, _f, _g;
        var isPastSignerStep = ((_a = achData === null || achData === void 0 ? void 0 : achData.corpay) === null || _a === void 0 ? void 0 : _a.signerFullName) && ((_b = achData === null || achData === void 0 ? void 0 : achData.corpay) === null || _b === void 0 ? void 0 : _b.authorizedToBindClientToAgreement) === undefined;
        var allAgreementsChecked = (reimbursementAccountDraft === null || reimbursementAccountDraft === void 0 ? void 0 : reimbursementAccountDraft.authorizedToBindClientToAgreement) === true &&
            (reimbursementAccountDraft === null || reimbursementAccountDraft === void 0 ? void 0 : reimbursementAccountDraft.agreeToTermsAndConditions) === true &&
            (reimbursementAccountDraft === null || reimbursementAccountDraft === void 0 ? void 0 : reimbursementAccountDraft.consentToPrivacyNotice) === true &&
            (reimbursementAccountDraft === null || reimbursementAccountDraft === void 0 ? void 0 : reimbursementAccountDraft.provideTruthfulInformation) === true;
        setShouldShowContinueSetupButton(false);
        if (nonUSDCountryDraftValue !== '' && (achData === null || achData === void 0 ? void 0 : achData.created) === undefined) {
            setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.BANK_INFO);
            return;
        }
        if ((achData === null || achData === void 0 ? void 0 : achData.created) && ((_c = achData === null || achData === void 0 ? void 0 : achData.corpay) === null || _c === void 0 ? void 0 : _c.companyName) === undefined) {
            setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.BUSINESS_INFO);
            return;
        }
        if (((_d = achData === null || achData === void 0 ? void 0 : achData.corpay) === null || _d === void 0 ? void 0 : _d.companyName) && ((_e = achData === null || achData === void 0 ? void 0 : achData.corpay) === null || _e === void 0 ? void 0 : _e.anyIndividualOwn25PercentOrMore) === undefined) {
            setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.BENEFICIAL_OWNER_INFO);
            return;
        }
        if (((_f = achData === null || achData === void 0 ? void 0 : achData.corpay) === null || _f === void 0 ? void 0 : _f.anyIndividualOwn25PercentOrMore) !== undefined && ((_g = achData === null || achData === void 0 ? void 0 : achData.corpay) === null || _g === void 0 ? void 0 : _g.signerFullName) === undefined) {
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
        if ((achData === null || achData === void 0 ? void 0 : achData.state) === CONST_1.default.BANK_ACCOUNT.STATE.VERIFYING) {
            setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.FINISH);
        }
    };
    var goBack = (0, react_1.useCallback)(function () {
        var shouldShowOnfido = onfidoToken && !(achData === null || achData === void 0 ? void 0 : achData.isOnfidoSetupComplete);
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
                if ([CONST_1.default.BANK_ACCOUNT.STATE.VERIFYING, CONST_1.default.BANK_ACCOUNT.STATE.SETUP].some(function (value) { return value === (achData === null || achData === void 0 ? void 0 : achData.state); })) {
                    (0, BankAccounts_1.goToWithdrawalAccountSetupStep)(CONST_1.default.BANK_ACCOUNT.STEP.ACH_CONTRACT);
                }
                else if (!isOffline && (achData === null || achData === void 0 ? void 0 : achData.state) === CONST_1.default.BANK_ACCOUNT.STATE.PENDING) {
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
    }, [achData === null || achData === void 0 ? void 0 : achData.isOnfidoSetupComplete, achData === null || achData === void 0 ? void 0 : achData.state, currentStep, hasInProgressVBBA, isOffline, onfidoToken]);
    var isLoading = (isLoadingApp || ((reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.isLoading) && !(reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.isCreateCorpayBankAccount))) &&
        (!plaidCurrentEvent || plaidCurrentEvent === CONST_1.default.BANK_ACCOUNT.PLAID.EVENTS_NAME.EXIT);
    var shouldShowOfflineLoader = !(isOffline &&
        [
            CONST_1.default.BANK_ACCOUNT.STEP.COUNTRY,
            CONST_1.default.BANK_ACCOUNT.STEP.BANK_ACCOUNT,
            CONST_1.default.BANK_ACCOUNT.STEP.COMPANY,
            CONST_1.default.BANK_ACCOUNT.STEP.REQUESTOR,
            CONST_1.default.BANK_ACCOUNT.STEP.BENEFICIAL_OWNERS,
            CONST_1.default.BANK_ACCOUNT.STEP.ACH_CONTRACT,
        ].some(function (value) { return value === currentStep; }));
    if (isLoadingPolicy) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    // Show loading indicator when page is first time being opened and props.reimbursementAccount yet to be loaded from the server
    // or when data is being loaded. Don't show the loading indicator if we're offline and restarted the bank account setup process
    // On Android, when we open the app from the background, Onfido activity gets destroyed, so we need to reopen it.
    // eslint-disable-next-line react-compiler/react-compiler
    if ((!hasACHDataBeenLoaded || isLoading) &&
        shouldShowOfflineLoader &&
        (shouldReopenOnfido_1.default || !(requestorStepRef === null || requestorStepRef === void 0 ? void 0 : requestorStepRef.current)) &&
        !(currentStep === CONST_1.default.BANK_ACCOUNT.STEP.BANK_ACCOUNT && isValidateCodeActionModalVisible)) {
        return <ReimbursementAccountLoadingIndicator_1.default onBackButtonPress={goBack}/>;
    }
    if ((!isLoading && ((0, EmptyObject_1.isEmptyObject)(policy) || !(0, PolicyUtils_1.isPolicyAdmin)(policy))) || (0, PolicyUtils_1.isPendingDeletePolicy)(policy)) {
        return (<ScreenWrapper_1.default testID={ReimbursementAccountPage.displayName}>
                <FullPageNotFoundView_1.default shouldShow onBackButtonPress={PolicyUtils_1.goBackFromInvalidPolicy} onLinkPress={PolicyUtils_1.goBackFromInvalidPolicy} subtitleKey={(0, EmptyObject_1.isEmptyObject)(policy) || (0, PolicyUtils_1.isPendingDeletePolicy)(policy) ? undefined : 'workspace.common.notAuthorized'}/>
            </ScreenWrapper_1.default>);
    }
    var errorText;
    var userHasPhonePrimaryEmail = expensify_common_1.Str.endsWith((_h = session === null || session === void 0 ? void 0 : session.email) !== null && _h !== void 0 ? _h : '', CONST_1.default.SMS.DOMAIN);
    var throttledDate = (_j = reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.throttledDate) !== null && _j !== void 0 ? _j : '';
    if (userHasPhonePrimaryEmail) {
        errorText = <RenderHTML_1.default html={translate('bankAccount.hasPhoneLoginError', { contactMethodRoute: contactMethodRoute })}/>;
    }
    else if (throttledDate) {
        errorText = <Text_1.default>{translate('bankAccount.hasBeenThrottledError')}</Text_1.default>;
    }
    else if (hasUnsupportedCurrency) {
        errorText = <RenderHTML_1.default html={translate('bankAccount.hasCurrencyError', { workspaceRoute: workspaceRoute })}/>;
    }
    if (errorText) {
        return (<ScreenWrapper_1.default testID={ReimbursementAccountPage.displayName}>
                <HeaderWithBackButton_1.default title={translate('bankAccount.addBankAccount')} subtitle={policyName} onBackButtonPress={function () { return Navigation_1.default.goBack(backTo); }}/>
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
