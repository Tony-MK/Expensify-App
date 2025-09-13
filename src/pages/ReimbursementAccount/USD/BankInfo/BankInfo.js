"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useSubStep_1 = require("@hooks/useSubStep");
var getPlaidOAuthReceivedRedirectURI_1 = require("@libs/getPlaidOAuthReceivedRedirectURI");
var getSubStepValues_1 = require("@pages/ReimbursementAccount/utils/getSubStepValues");
var BankAccounts_1 = require("@userActions/BankAccounts");
var ReimbursementAccount_1 = require("@userActions/ReimbursementAccount");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
var Manual_1 = require("./subSteps/Manual");
var Plaid_1 = require("./subSteps/Plaid");
var BANK_INFO_STEP_KEYS = ReimbursementAccountForm_1.default.BANK_INFO_STEP;
var manualSubSteps = [Manual_1.default];
var plaidSubSteps = [Plaid_1.default];
var receivedRedirectURI = (0, getPlaidOAuthReceivedRedirectURI_1.default)();
function BankInfo(_a) {
    var _b, _c, _d;
    var onBackButtonPress = _a.onBackButtonPress, policyID = _a.policyID, setUSDBankAccountStep = _a.setUSDBankAccountStep;
    var reimbursementAccount = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false })[0];
    var reimbursementAccountDraft = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: false })[0];
    var plaidLinkToken = (0, useOnyx_1.default)(ONYXKEYS_1.default.PLAID_LINK_TOKEN, { canBeMissing: true })[0];
    var lastPaymentMethod = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD, { canBeMissing: true })[0];
    var translate = (0, useLocalize_1.default)().translate;
    var _e = react_1.default.useState(false), redirectedFromPlaidToManual = _e[0], setRedirectedFromPlaidToManual = _e[1];
    var values = (0, react_1.useMemo)(function () { return (0, getSubStepValues_1.default)(BANK_INFO_STEP_KEYS, reimbursementAccountDraft, reimbursementAccount !== null && reimbursementAccount !== void 0 ? reimbursementAccount : {}); }, [reimbursementAccount, reimbursementAccountDraft]);
    var setupType = (_c = (_b = reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.achData) === null || _b === void 0 ? void 0 : _b.subStep) !== null && _c !== void 0 ? _c : '';
    var shouldReinitializePlaidLink = plaidLinkToken && receivedRedirectURI && setupType !== CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.MANUAL;
    if (shouldReinitializePlaidLink) {
        setupType = CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.PLAID;
    }
    var bankAccountID = Number((_d = reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.achData) === null || _d === void 0 ? void 0 : _d.bankAccountID);
    var submit = (0, react_1.useCallback)(function (submitData) {
        var _a, _b;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        var data = submitData;
        if (setupType === CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.MANUAL) {
            (0, BankAccounts_1.connectBankAccountManually)(bankAccountID, (_a = {},
                _a[BANK_INFO_STEP_KEYS.ROUTING_NUMBER] = (_c = data[BANK_INFO_STEP_KEYS.ROUTING_NUMBER]) !== null && _c !== void 0 ? _c : '',
                _a[BANK_INFO_STEP_KEYS.ACCOUNT_NUMBER] = (_d = data[BANK_INFO_STEP_KEYS.ACCOUNT_NUMBER]) !== null && _d !== void 0 ? _d : '',
                _a[BANK_INFO_STEP_KEYS.BANK_NAME] = (_f = (_e = data[BANK_INFO_STEP_KEYS.BANK_NAME]) !== null && _e !== void 0 ? _e : values === null || values === void 0 ? void 0 : values.bankName) !== null && _f !== void 0 ? _f : '',
                _a[BANK_INFO_STEP_KEYS.PLAID_ACCOUNT_ID] = (_g = data[BANK_INFO_STEP_KEYS.PLAID_ACCOUNT_ID]) !== null && _g !== void 0 ? _g : values === null || values === void 0 ? void 0 : values.plaidAccountID,
                _a[BANK_INFO_STEP_KEYS.PLAID_ACCESS_TOKEN] = (_j = (_h = data[BANK_INFO_STEP_KEYS.PLAID_ACCESS_TOKEN]) !== null && _h !== void 0 ? _h : values === null || values === void 0 ? void 0 : values.plaidAccessToken) !== null && _j !== void 0 ? _j : '',
                _a[BANK_INFO_STEP_KEYS.PLAID_MASK] = (_l = (_k = data[BANK_INFO_STEP_KEYS.PLAID_MASK]) !== null && _k !== void 0 ? _k : values === null || values === void 0 ? void 0 : values.mask) !== null && _l !== void 0 ? _l : '',
                _a[BANK_INFO_STEP_KEYS.IS_SAVINGS] = (_m = data[BANK_INFO_STEP_KEYS.IS_SAVINGS]) !== null && _m !== void 0 ? _m : false,
                _a), policyID);
        }
        else if (setupType === CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.PLAID) {
            (0, BankAccounts_1.connectBankAccountWithPlaid)(bankAccountID, (_b = {},
                _b[BANK_INFO_STEP_KEYS.ROUTING_NUMBER] = (_o = data[BANK_INFO_STEP_KEYS.ROUTING_NUMBER]) !== null && _o !== void 0 ? _o : '',
                _b[BANK_INFO_STEP_KEYS.ACCOUNT_NUMBER] = (_p = data[BANK_INFO_STEP_KEYS.ACCOUNT_NUMBER]) !== null && _p !== void 0 ? _p : '',
                _b[BANK_INFO_STEP_KEYS.BANK_NAME] = (_q = data[BANK_INFO_STEP_KEYS.BANK_NAME]) !== null && _q !== void 0 ? _q : '',
                _b[BANK_INFO_STEP_KEYS.PLAID_ACCOUNT_ID] = (_r = data[BANK_INFO_STEP_KEYS.PLAID_ACCOUNT_ID]) !== null && _r !== void 0 ? _r : '',
                _b[BANK_INFO_STEP_KEYS.PLAID_ACCESS_TOKEN] = (_s = data[BANK_INFO_STEP_KEYS.PLAID_ACCESS_TOKEN]) !== null && _s !== void 0 ? _s : '',
                _b[BANK_INFO_STEP_KEYS.PLAID_MASK] = (_t = data[BANK_INFO_STEP_KEYS.PLAID_MASK]) !== null && _t !== void 0 ? _t : '',
                _b[BANK_INFO_STEP_KEYS.IS_SAVINGS] = (_u = data[BANK_INFO_STEP_KEYS.IS_SAVINGS]) !== null && _u !== void 0 ? _u : false,
                _b), policyID, lastPaymentMethod === null || lastPaymentMethod === void 0 ? void 0 : lastPaymentMethod[policyID]);
        }
    }, [setupType, bankAccountID, lastPaymentMethod, values === null || values === void 0 ? void 0 : values.bankName, values === null || values === void 0 ? void 0 : values.plaidAccountID, values === null || values === void 0 ? void 0 : values.plaidAccessToken, values === null || values === void 0 ? void 0 : values.mask, policyID]);
    var bodyContent = setupType === CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.PLAID ? plaidSubSteps : manualSubSteps;
    var _f = (0, useSubStep_1.default)({ bodyContent: bodyContent, startFrom: 0, onFinished: submit }), SubStep = _f.componentToRender, isEditing = _f.isEditing, screenIndex = _f.screenIndex, nextScreen = _f.nextScreen, prevScreen = _f.prevScreen, moveTo = _f.moveTo;
    // Some services user connects to via Plaid return dummy account numbers and routing numbers e.g. Chase
    // In this case we need to redirect user to manual flow to enter real account number and routing number
    // and we need to do it only once so redirectedFromPlaidToManual flag is used
    (0, react_1.useEffect)(function () {
        if (redirectedFromPlaidToManual) {
            return;
        }
        if (setupType === CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.MANUAL && values.bankName !== '' && !redirectedFromPlaidToManual) {
            setRedirectedFromPlaidToManual(true);
        }
    }, [redirectedFromPlaidToManual, setupType, values]);
    var handleBackButtonPress = function () {
        if (screenIndex === 0) {
            onBackButtonPress();
            (0, ReimbursementAccount_1.hideBankAccountErrors)();
        }
        else {
            prevScreen();
        }
    };
    return (<InteractiveStepWrapper_1.default wrapperID={BankInfo.displayName} shouldEnablePickerAvoiding={false} handleBackButtonPress={handleBackButtonPress} headerTitle={translate('bankAccount.bankInfo')} startStepIndex={1} stepNames={CONST_1.default.BANK_ACCOUNT.STEP_NAMES}>
            <SubStep isEditing={isEditing} onNext={nextScreen} onMove={moveTo} setUSDBankAccountStep={setUSDBankAccountStep}/>
        </InteractiveStepWrapper_1.default>);
}
BankInfo.displayName = 'BankInfo';
exports.default = BankInfo;
