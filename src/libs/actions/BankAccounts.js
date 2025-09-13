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
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptWalletTerms = exports.verifyIdentity = exports.answerQuestionsForWallet = exports.openOnfidoFlow = exports.openPlaidBankLogin = exports.openPlaidBankAccountSelector = exports.cancelResetBankAccount = exports.requestResetBankAccount = exports.updateReimbursementAccountDraft = exports.setBankAccountSubStep = exports.hideBankAccountErrors = exports.resetNonUSDBankAccount = exports.resetUSDBankAccount = exports.resetReimbursementAccount = exports.setBankAccountFormValidationErrors = exports.goToWithdrawalAccountSetupStep = void 0;
exports.acceptACHContractForBankAccount = acceptACHContractForBankAccount;
exports.addBusinessWebsiteForDraft = addBusinessWebsiteForDraft;
exports.addPersonalBankAccount = addPersonalBankAccount;
exports.clearOnfidoToken = clearOnfidoToken;
exports.clearPersonalBankAccount = clearPersonalBankAccount;
exports.setPlaidEvent = setPlaidEvent;
exports.openPlaidView = openPlaidView;
exports.connectBankAccountManually = connectBankAccountManually;
exports.connectBankAccountWithPlaid = connectBankAccountWithPlaid;
exports.createCorpayBankAccount = createCorpayBankAccount;
exports.deletePaymentBankAccount = deletePaymentBankAccount;
exports.handlePlaidError = handlePlaidError;
exports.setPersonalBankAccountContinueKYCOnSuccess = setPersonalBankAccountContinueKYCOnSuccess;
exports.openPersonalBankAccountSetupView = openPersonalBankAccountSetupView;
exports.openReimbursementAccountPage = openReimbursementAccountPage;
exports.updateBeneficialOwnersForBankAccount = updateBeneficialOwnersForBankAccount;
exports.updateCompanyInformationForBankAccount = updateCompanyInformationForBankAccount;
exports.updatePersonalInformationForBankAccount = updatePersonalInformationForBankAccount;
exports.openWorkspaceView = openWorkspaceView;
exports.validateBankAccount = validateBankAccount;
exports.verifyIdentityForBankAccount = verifyIdentityForBankAccount;
exports.setReimbursementAccountLoading = setReimbursementAccountLoading;
exports.openPersonalBankAccountSetupWithPlaid = openPersonalBankAccountSetupWithPlaid;
exports.updateAddPersonalBankAccountDraft = updateAddPersonalBankAccountDraft;
exports.clearPersonalBankAccountSetupType = clearPersonalBankAccountSetupType;
exports.validatePlaidSelection = validatePlaidSelection;
exports.fetchCorpayFields = fetchCorpayFields;
exports.clearReimbursementAccountBankCreation = clearReimbursementAccountBankCreation;
exports.getCorpayBankAccountFields = getCorpayBankAccountFields;
exports.createCorpayBankAccountForWalletFlow = createCorpayBankAccountForWalletFlow;
exports.getCorpayOnboardingFields = getCorpayOnboardingFields;
exports.saveCorpayOnboardingCompanyDetails = saveCorpayOnboardingCompanyDetails;
exports.clearReimbursementAccountSaveCorpayOnboardingCompanyDetails = clearReimbursementAccountSaveCorpayOnboardingCompanyDetails;
exports.saveCorpayOnboardingBeneficialOwners = saveCorpayOnboardingBeneficialOwners;
exports.saveCorpayOnboardingDirectorInformation = saveCorpayOnboardingDirectorInformation;
exports.clearReimbursementAccountSaveCorpayOnboardingBeneficialOwners = clearReimbursementAccountSaveCorpayOnboardingBeneficialOwners;
exports.clearReimbursementAccountSaveCorpayOnboardingDirectorInformation = clearReimbursementAccountSaveCorpayOnboardingDirectorInformation;
exports.clearCorpayBankAccountFields = clearCorpayBankAccountFields;
exports.finishCorpayBankAccountOnboarding = finishCorpayBankAccountOnboarding;
exports.clearReimbursementAccountFinishCorpayBankAccountOnboarding = clearReimbursementAccountFinishCorpayBankAccountOnboarding;
exports.enableGlobalReimbursementsForUSDBankAccount = enableGlobalReimbursementsForUSDBankAccount;
exports.clearEnableGlobalReimbursementsForUSDBankAccount = clearEnableGlobalReimbursementsForUSDBankAccount;
exports.askForCorpaySignerInformation = askForCorpaySignerInformation;
exports.clearReimbursementAccount = clearReimbursementAccount;
exports.clearEnterSignerInformationFormSave = clearEnterSignerInformationFormSave;
exports.sendReminderForCorpaySignerInformation = sendReminderForCorpaySignerInformation;
exports.clearReimbursementAccountSendReminderForCorpaySignerInformation = clearReimbursementAccountSendReminderForCorpaySignerInformation;
var react_native_onyx_1 = require("react-native-onyx");
var API = require("@libs/API");
var types_1 = require("@libs/API/types");
var ErrorUtils_1 = require("@libs/ErrorUtils");
var Localize_1 = require("@libs/Localize");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var ReimbursementAccount_1 = require("./ReimbursementAccount");
var ReimbursementAccount_2 = require("./ReimbursementAccount");
Object.defineProperty(exports, "goToWithdrawalAccountSetupStep", { enumerable: true, get: function () { return ReimbursementAccount_2.goToWithdrawalAccountSetupStep; } });
Object.defineProperty(exports, "setBankAccountFormValidationErrors", { enumerable: true, get: function () { return ReimbursementAccount_2.setBankAccountFormValidationErrors; } });
Object.defineProperty(exports, "resetReimbursementAccount", { enumerable: true, get: function () { return ReimbursementAccount_2.resetReimbursementAccount; } });
Object.defineProperty(exports, "resetUSDBankAccount", { enumerable: true, get: function () { return ReimbursementAccount_2.resetUSDBankAccount; } });
Object.defineProperty(exports, "resetNonUSDBankAccount", { enumerable: true, get: function () { return ReimbursementAccount_2.resetNonUSDBankAccount; } });
Object.defineProperty(exports, "hideBankAccountErrors", { enumerable: true, get: function () { return ReimbursementAccount_2.hideBankAccountErrors; } });
Object.defineProperty(exports, "setBankAccountSubStep", { enumerable: true, get: function () { return ReimbursementAccount_2.setBankAccountSubStep; } });
Object.defineProperty(exports, "updateReimbursementAccountDraft", { enumerable: true, get: function () { return ReimbursementAccount_2.updateReimbursementAccountDraft; } });
Object.defineProperty(exports, "requestResetBankAccount", { enumerable: true, get: function () { return ReimbursementAccount_2.requestResetBankAccount; } });
Object.defineProperty(exports, "cancelResetBankAccount", { enumerable: true, get: function () { return ReimbursementAccount_2.cancelResetBankAccount; } });
var Plaid_1 = require("./Plaid");
Object.defineProperty(exports, "openPlaidBankAccountSelector", { enumerable: true, get: function () { return Plaid_1.openPlaidBankAccountSelector; } });
Object.defineProperty(exports, "openPlaidBankLogin", { enumerable: true, get: function () { return Plaid_1.openPlaidBankLogin; } });
var Wallet_1 = require("./Wallet");
Object.defineProperty(exports, "openOnfidoFlow", { enumerable: true, get: function () { return Wallet_1.openOnfidoFlow; } });
Object.defineProperty(exports, "answerQuestionsForWallet", { enumerable: true, get: function () { return Wallet_1.answerQuestionsForWallet; } });
Object.defineProperty(exports, "verifyIdentity", { enumerable: true, get: function () { return Wallet_1.verifyIdentity; } });
Object.defineProperty(exports, "acceptWalletTerms", { enumerable: true, get: function () { return Wallet_1.acceptWalletTerms; } });
function clearPlaid() {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.PLAID_LINK_TOKEN, '');
    react_native_onyx_1.default.set(ONYXKEYS_1.default.PLAID_CURRENT_EVENT, null);
    return react_native_onyx_1.default.set(ONYXKEYS_1.default.PLAID_DATA, CONST_1.default.PLAID.DEFAULT_DATA);
}
function clearInternationalBankAccount() {
    return clearPlaid()
        .then(function () { return react_native_onyx_1.default.set(ONYXKEYS_1.default.CORPAY_FIELDS, null); })
        .then(function () { return react_native_onyx_1.default.set(ONYXKEYS_1.default.FORMS.INTERNATIONAL_BANK_ACCOUNT_FORM_DRAFT, null); });
}
function openPlaidView() {
    clearPlaid().then(function () { return (0, ReimbursementAccount_1.setBankAccountSubStep)(CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.PLAID); });
}
function setPlaidEvent(eventName) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.PLAID_CURRENT_EVENT, eventName);
}
/**
 * Open the personal bank account setup flow, with an optional exitReportID to redirect to once the flow is finished.
 */
function openPersonalBankAccountSetupView(_a) {
    var exitReportID = _a.exitReportID, policyID = _a.policyID, source = _a.source, _b = _a.shouldSetUpUSBankAccount, shouldSetUpUSBankAccount = _b === void 0 ? false : _b, _c = _a.isUserValidated, isUserValidated = _c === void 0 ? true : _c;
    clearInternationalBankAccount().then(function () {
        if (exitReportID) {
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_BANK_ACCOUNT, { exitReportID: exitReportID });
        }
        if (policyID) {
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_BANK_ACCOUNT, { policyID: policyID });
        }
        if (source) {
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_BANK_ACCOUNT, { source: source });
        }
        if (!isUserValidated) {
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_CONTACT_METHOD_VERIFY_ACCOUNT.getRoute(Navigation_1.default.getActiveRoute(), ROUTES_1.default.SETTINGS_ADD_BANK_ACCOUNT.route));
            return;
        }
        if (shouldSetUpUSBankAccount) {
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_ADD_US_BANK_ACCOUNT);
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_ADD_BANK_ACCOUNT.getRoute(Navigation_1.default.getActiveRoute()));
    });
}
/**
 * Open the personal bank account setup flow using Plaid, with an optional exitReportID to redirect to once the flow is finished.
 */
function openPersonalBankAccountSetupWithPlaid(exitReportID) {
    clearPlaid().then(function () {
        if (exitReportID) {
            react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_BANK_ACCOUNT, { exitReportID: exitReportID });
        }
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.FORMS.PERSONAL_BANK_ACCOUNT_FORM_DRAFT, { setupType: CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.PLAID });
    });
}
function clearPersonalBankAccountSetupType() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.FORMS.PERSONAL_BANK_ACCOUNT_FORM_DRAFT, { setupType: null });
}
/**
 * Whether after adding a bank account we should continue with the KYC flow. If so, we must specify the fallback route.
 */
function setPersonalBankAccountContinueKYCOnSuccess(onSuccessFallbackRoute) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.PERSONAL_BANK_ACCOUNT, { onSuccessFallbackRoute: onSuccessFallbackRoute });
}
function clearPersonalBankAccount() {
    clearPlaid();
    react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSONAL_BANK_ACCOUNT, null);
    react_native_onyx_1.default.set(ONYXKEYS_1.default.FORMS.PERSONAL_BANK_ACCOUNT_FORM_DRAFT, null);
    clearPersonalBankAccountSetupType();
}
function clearOnfidoToken() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.ONFIDO_TOKEN, '');
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.ONFIDO_APPLICANT_ID, '');
}
function updateAddPersonalBankAccountDraft(bankData) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.FORMS.PERSONAL_BANK_ACCOUNT_FORM_DRAFT, bankData);
}
/**
 * Helper method to build the Onyx data required during setup of a Verified Business Bank Account
 */
function getVBBADataForOnyx(currentStep, shouldShowLoading) {
    if (shouldShowLoading === void 0) { shouldShowLoading = true; }
    return {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: shouldShowLoading,
                    errors: null,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: false,
                    errors: null,
                    // When setting up a bank account, we save the draft form values in Onyx.
                    // When we update the information for a step, the value of some fields that are returned from the API
                    // can be different from the value that we stored as the draft in Onyx (i.e. the phone number is formatted).
                    // This is why we store the current step used to call the API in order to update the corresponding draft data in Onyx.
                    // If currentStep is undefined that means this step don't need to update the data of the draft in Onyx.
                    draftStep: currentStep,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: false,
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('walletPage.addBankAccountFailure'),
                },
            },
        ],
    };
}
function addBusinessWebsiteForDraft(websiteUrl) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { website: websiteUrl });
}
/**
 * Submit Bank Account step with Plaid data so php can perform some checks.
 */
function connectBankAccountWithPlaid(bankAccountID, selectedPlaidBankAccount, policyID, lastPaymentMethod) {
    var _a;
    var _b, _c;
    var parameters = {
        bankAccountID: bankAccountID,
        routingNumber: selectedPlaidBankAccount.routingNumber,
        accountNumber: selectedPlaidBankAccount.accountNumber,
        bank: selectedPlaidBankAccount.bankName,
        plaidAccountID: selectedPlaidBankAccount.plaidAccountID,
        plaidAccessToken: selectedPlaidBankAccount.plaidAccessToken,
        plaidMask: selectedPlaidBankAccount.mask,
        isSavings: selectedPlaidBankAccount.isSavings,
        policyID: policyID,
    };
    var onyxData = getVBBADataForOnyx();
    var lastUsedPaymentMethod = typeof lastPaymentMethod === 'string' ? lastPaymentMethod : (_b = lastPaymentMethod === null || lastPaymentMethod === void 0 ? void 0 : lastPaymentMethod.expense) === null || _b === void 0 ? void 0 : _b.name;
    if (!lastUsedPaymentMethod) {
        (_c = onyxData.successData) === null || _c === void 0 ? void 0 : _c.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD,
            value: (_a = {},
                _a[policyID] = {
                    expense: {
                        name: CONST_1.default.IOU.PAYMENT_TYPE.VBBA,
                    },
                    lastUsed: {
                        name: lastUsedPaymentMethod !== null && lastUsedPaymentMethod !== void 0 ? lastUsedPaymentMethod : CONST_1.default.IOU.PAYMENT_TYPE.VBBA,
                    },
                },
                _a),
        });
    }
    API.write(types_1.WRITE_COMMANDS.CONNECT_BANK_ACCOUNT_WITH_PLAID, parameters, onyxData);
}
/**
 * Adds a bank account via Plaid
 *
 * TODO: offline pattern for this command will have to be added later once the pattern B design doc is complete
 */
function addPersonalBankAccount(account, policyID, source, lastPaymentMethod) {
    var _a, _b, _c;
    var _d, _e, _f, _g, _h;
    var parameters = {
        addressName: (_d = account.addressName) !== null && _d !== void 0 ? _d : '',
        routingNumber: account.routingNumber,
        accountNumber: account.accountNumber,
        isSavings: (_e = account.isSavings) !== null && _e !== void 0 ? _e : false,
        setupType: 'plaid',
        bank: account.bankName,
        plaidAccountID: account.plaidAccountID,
        plaidAccessToken: account.plaidAccessToken,
    };
    if (policyID) {
        parameters.policyID = policyID;
    }
    if (source) {
        parameters.source = source;
    }
    var personalPolicy = (0, PolicyUtils_1.getPersonalPolicy)();
    var onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.PERSONAL_BANK_ACCOUNT,
                value: {
                    isLoading: true,
                    errors: null,
                    plaidAccountID: account.plaidAccountID,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.PERSONAL_BANK_ACCOUNT,
                value: {
                    isLoading: false,
                    errors: null,
                    shouldShowSuccess: true,
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.USER_WALLET,
                value: {
                    currentStep: CONST_1.default.WALLET.STEP.ADDITIONAL_DETAILS,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.PERSONAL_BANK_ACCOUNT,
                value: {
                    isLoading: false,
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('walletPage.addBankAccountFailure'),
                },
            },
        ],
    };
    if ((personalPolicy === null || personalPolicy === void 0 ? void 0 : personalPolicy.id) && !lastPaymentMethod) {
        (_f = onyxData.optimisticData) === null || _f === void 0 ? void 0 : _f.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD,
            value: (_a = {},
                _a[personalPolicy === null || personalPolicy === void 0 ? void 0 : personalPolicy.id] = {
                    iou: {
                        name: CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY,
                    },
                    lastUsed: {
                        name: CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY,
                    },
                },
                _a),
        });
        (_g = onyxData.successData) === null || _g === void 0 ? void 0 : _g.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD,
            value: (_b = {},
                _b[personalPolicy === null || personalPolicy === void 0 ? void 0 : personalPolicy.id] = {
                    iou: {
                        name: CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY,
                    },
                    lastUsed: {
                        name: CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY,
                    },
                },
                _b),
        });
        (_h = onyxData.failureData) === null || _h === void 0 ? void 0 : _h.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD,
            value: (_c = {},
                _c[personalPolicy === null || personalPolicy === void 0 ? void 0 : personalPolicy.id] = null,
                _c),
        });
    }
    API.write(types_1.WRITE_COMMANDS.ADD_PERSONAL_BANK_ACCOUNT, parameters, onyxData);
}
function deletePaymentBankAccount(bankAccountID, lastUsedPaymentMethods, bankAccount) {
    var _a, _b, _c;
    var parameters = { bankAccountID: bankAccountID };
    var bankAccountFailureData = __assign(__assign({}, bankAccount), { errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('bankAccount.error.deletePaymentBankAccount'), pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE });
    var personalPolicy = (0, PolicyUtils_1.getPersonalPolicy)();
    var onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: "".concat(ONYXKEYS_1.default.BANK_ACCOUNT_LIST),
                value: (_a = {}, _a[bankAccountID] = { pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE }, _a),
            },
        ],
        // Sometimes pusher updates aren't received when we close the App while still offline,
        // so we are setting the bankAccount to null here to ensure that it gets cleared out once we come back online.
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: "".concat(ONYXKEYS_1.default.BANK_ACCOUNT_LIST),
                value: (_b = {}, _b[bankAccountID] = null, _b),
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: "".concat(ONYXKEYS_1.default.BANK_ACCOUNT_LIST),
                value: (_c = {},
                    _c[bankAccountID] = bankAccountFailureData,
                    _c),
            },
        ],
    };
    Object.keys(lastUsedPaymentMethods !== null && lastUsedPaymentMethods !== void 0 ? lastUsedPaymentMethods : {}).forEach(function (paymentMethodID) {
        var _a, _b, _c, _d;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        var lastUsedPaymentMethod = lastUsedPaymentMethods === null || lastUsedPaymentMethods === void 0 ? void 0 : lastUsedPaymentMethods[paymentMethodID];
        if (typeof lastUsedPaymentMethod === 'string' || !lastUsedPaymentMethod) {
            return;
        }
        if ((personalPolicy === null || personalPolicy === void 0 ? void 0 : personalPolicy.id) === paymentMethodID && ((_e = lastUsedPaymentMethod.iou) === null || _e === void 0 ? void 0 : _e.name) === CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY) {
            var revertedLastUsedPaymentMethod = ((_f = lastUsedPaymentMethod.lastUsed) === null || _f === void 0 ? void 0 : _f.name) !== CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY ? (_g = lastUsedPaymentMethod.lastUsed) === null || _g === void 0 ? void 0 : _g.name : null;
            (_h = onyxData.successData) === null || _h === void 0 ? void 0 : _h.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD,
                value: (_a = {},
                    _a[personalPolicy === null || personalPolicy === void 0 ? void 0 : personalPolicy.id] = __assign({ iou: {
                            name: revertedLastUsedPaymentMethod,
                            bankAccountID: null,
                        } }, (!revertedLastUsedPaymentMethod ? { lastUsed: { name: null, bankAccountID: null } } : {})),
                    _a),
            });
            (_j = onyxData.failureData) === null || _j === void 0 ? void 0 : _j.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD,
                value: (_b = {},
                    _b[personalPolicy === null || personalPolicy === void 0 ? void 0 : personalPolicy.id] = {
                        expense: {
                            name: (_k = lastUsedPaymentMethod.iou) === null || _k === void 0 ? void 0 : _k.name,
                            bankAccountID: (_l = lastUsedPaymentMethod.iou) === null || _l === void 0 ? void 0 : _l.bankAccountID,
                        },
                        lastUsed: {
                            name: (_m = lastUsedPaymentMethod.lastUsed) === null || _m === void 0 ? void 0 : _m.name,
                            bankAccountID: (_o = lastUsedPaymentMethod.lastUsed) === null || _o === void 0 ? void 0 : _o.bankAccountID,
                        },
                    },
                    _b),
            });
        }
        if (((_p = lastUsedPaymentMethod === null || lastUsedPaymentMethod === void 0 ? void 0 : lastUsedPaymentMethod.expense) === null || _p === void 0 ? void 0 : _p.name) === CONST_1.default.IOU.PAYMENT_TYPE.VBBA) {
            var revertedLastUsedPaymentMethod = lastUsedPaymentMethod.lastUsed.name !== CONST_1.default.IOU.PAYMENT_TYPE.VBBA ? lastUsedPaymentMethod.lastUsed.name : null;
            (_q = onyxData.successData) === null || _q === void 0 ? void 0 : _q.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD,
                value: (_c = {},
                    _c[paymentMethodID] = __assign({ expense: {
                            name: revertedLastUsedPaymentMethod,
                            bankAccountID: null,
                        } }, (!revertedLastUsedPaymentMethod ? { lastUsed: { name: null, bankAccountID: null } } : {})),
                    _c),
            });
            (_r = onyxData.failureData) === null || _r === void 0 ? void 0 : _r.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD,
                value: (_d = {},
                    _d[paymentMethodID] = {
                        expense: {
                            name: (_s = lastUsedPaymentMethod.expense) === null || _s === void 0 ? void 0 : _s.name,
                            bankAccountID: (_t = lastUsedPaymentMethod.expense) === null || _t === void 0 ? void 0 : _t.bankAccountID,
                        },
                        lastUsed: {
                            name: (_u = lastUsedPaymentMethod.lastUsed) === null || _u === void 0 ? void 0 : _u.name,
                            bankAccountID: (_v = lastUsedPaymentMethod.lastUsed) === null || _v === void 0 ? void 0 : _v.bankAccountID,
                        },
                    },
                    _d),
            });
        }
    });
    API.write(types_1.WRITE_COMMANDS.DELETE_PAYMENT_BANK_ACCOUNT, parameters, onyxData);
}
/**
 * Update the user's personal information on the bank account in database.
 *
 * This action is called by the requestor step in the Verified Bank Account flow
 * @param bankAccountID - ID for bank account
 * @param params - User personal data
 * @param policyID - ID of the policy we're setting the bank account on
 * @param isConfirmPage - If we're submitting from the confirmation substep, to trigger all external checks
 */
function updatePersonalInformationForBankAccount(bankAccountID, params, policyID, isConfirmPage) {
    if (!policyID) {
        return;
    }
    API.write(types_1.WRITE_COMMANDS.UPDATE_PERSONAL_INFORMATION_FOR_BANK_ACCOUNT, __assign(__assign({}, params), { bankAccountID: bankAccountID, policyID: policyID, confirm: isConfirmPage }), getVBBADataForOnyx(CONST_1.default.BANK_ACCOUNT.STEP.REQUESTOR, isConfirmPage));
}
function validateBankAccount(bankAccountID, validateCode, policyID) {
    var parameters = {
        bankAccountID: bankAccountID,
        validateCode: validateCode,
        policyID: policyID,
    };
    var onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: true,
                    errors: null,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: false,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: false,
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage'),
                },
            },
        ],
    };
    API.write(types_1.WRITE_COMMANDS.VALIDATE_BANK_ACCOUNT_WITH_TRANSACTIONS, parameters, onyxData);
}
function getCorpayBankAccountFields(country, currency) {
    var parameters = {
        countryISO: country,
        currency: currency,
        isWithdrawal: true,
        isBusinessBankAccount: true,
    };
    var onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.CORPAY_FIELDS,
                value: {
                    isLoading: true,
                    isSuccess: false,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.CORPAY_FIELDS,
                value: {
                    isLoading: false,
                    isSuccess: true,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.CORPAY_FIELDS,
                value: {
                    isLoading: false,
                    isSuccess: false,
                },
            },
        ],
    };
    return API.read(types_1.READ_COMMANDS.GET_CORPAY_BANK_ACCOUNT_FIELDS, parameters, onyxData);
}
function createCorpayBankAccount(fields, policyID) {
    var parameters = {
        type: 1,
        isSavings: false,
        isWithdrawal: true,
        inputs: JSON.stringify(fields),
        policyID: policyID,
    };
    var onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: true,
                    isCreateCorpayBankAccount: true,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: false,
                    isCreateCorpayBankAccount: false,
                    errors: null,
                    isSuccess: true,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: false,
                    isCreateCorpayBankAccount: false,
                    isSuccess: false,
                },
            },
        ],
    };
    return API.write(types_1.WRITE_COMMANDS.BANK_ACCOUNT_CREATE_CORPAY, parameters, onyxData);
}
function getCorpayOnboardingFields(country) {
    return API.read(types_1.READ_COMMANDS.GET_CORPAY_ONBOARDING_FIELDS, { countryISO: country });
}
function saveCorpayOnboardingCompanyDetails(parameters, bankAccountID) {
    var formattedParams = {
        inputs: JSON.stringify(parameters),
        bankAccountID: bankAccountID,
    };
    var onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isSavingCorpayOnboardingCompanyFields: true,
                    errors: null,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isSavingCorpayOnboardingCompanyFields: false,
                    isSuccess: true,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isSavingCorpayOnboardingCompanyFields: false,
                    isSuccess: false,
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage'),
                },
            },
        ],
    };
    return API.write(types_1.WRITE_COMMANDS.SAVE_CORPAY_ONBOARDING_COMPANY_DETAILS, formattedParams, onyxData);
}
function saveCorpayOnboardingBeneficialOwners(parameters) {
    var onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isSavingCorpayOnboardingBeneficialOwnersFields: true,
                    errors: null,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isSavingCorpayOnboardingBeneficialOwnersFields: false,
                    isSuccess: true,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isSavingCorpayOnboardingBeneficialOwnersFields: false,
                    isSuccess: false,
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage'),
                },
            },
        ],
    };
    return API.write(types_1.WRITE_COMMANDS.SAVE_CORPAY_ONBOARDING_BENEFICIAL_OWNER, parameters, onyxData);
}
function saveCorpayOnboardingDirectorInformation(parameters) {
    var onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isSavingCorpayOnboardingDirectorInformation: true,
                    errors: null,
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM,
                value: {
                    isSavingSignerInformation: true,
                    errors: null,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isSavingCorpayOnboardingDirectorInformation: false,
                    isSuccess: true,
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM,
                value: {
                    isSavingSignerInformation: false,
                    isSuccess: true,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isSavingCorpayOnboardingDirectorInformation: false,
                    isSuccess: false,
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage'),
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM,
                value: {
                    isSavingSignerInformation: false,
                    isSuccess: false,
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage'),
                },
            },
        ],
    };
    return API.write(types_1.WRITE_COMMANDS.SAVE_CORPAY_ONBOARDING_DIRECTOR_INFORMATION, parameters, onyxData);
}
function askForCorpaySignerInformation(parameters) {
    var onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isAskingForCorpaySignerInformation: true,
                    errors: null,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isAskingForCorpaySignerInformation: false,
                    isAskingForCorpaySignerInformationSuccess: true,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isAskingForCorpaySignerInformation: false,
                    isAskingForCorpaySignerInformationSuccess: false,
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage'),
                },
            },
        ],
    };
    return API.write(types_1.WRITE_COMMANDS.ASK_FOR_CORPAY_SIGNER_INFORMATION, parameters, onyxData);
}
function clearReimbursementAccount() {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, null);
}
function finishCorpayBankAccountOnboarding(parameters) {
    var onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isFinishingCorpayBankAccountOnboarding: true,
                    errors: null,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isFinishingCorpayBankAccountOnboarding: false,
                    isSuccess: true,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isFinishingCorpayBankAccountOnboarding: false,
                    isSuccess: false,
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage'),
                },
            },
        ],
    };
    return API.write(types_1.WRITE_COMMANDS.FINISH_CORPAY_BANK_ACCOUNT_ONBOARDING, parameters, onyxData);
}
function sendReminderForCorpaySignerInformation(parameters) {
    var onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isSendingReminderForCorpaySignerInformation: true,
                    errors: null,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isSendingReminderForCorpaySignerInformation: false,
                    isSuccess: true,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isSendingReminderForCorpaySignerInformation: false,
                    isSuccess: false,
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage'),
                },
            },
        ],
    };
    return API.write(types_1.WRITE_COMMANDS.SEND_REMINDER_FOR_CORPAY_SINGER_INFORMATION, parameters, onyxData);
}
function enableGlobalReimbursementsForUSDBankAccount(parameters) {
    var onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS,
                value: {
                    isEnablingGlobalReimbursements: true,
                    errors: null,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS,
                value: {
                    isEnablingGlobalReimbursements: false,
                    isSuccess: true,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS,
                value: {
                    isEnablingGlobalReimbursements: false,
                    isSuccess: false,
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('common.genericErrorMessage'),
                },
            },
        ],
    };
    return API.write(types_1.WRITE_COMMANDS.ENABLE_GLOBAL_REIMBURSEMENTS_FOR_USD_BANK_ACCOUNT, parameters, onyxData);
}
function clearEnableGlobalReimbursementsForUSDBankAccount() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS, { isSuccess: null, isEnablingGlobalReimbursements: null });
}
function clearCorpayBankAccountFields() {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.CORPAY_FIELDS, null);
}
function clearReimbursementAccountBankCreation() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { isCreateCorpayBankAccount: null, isSuccess: null, isLoading: null });
}
function clearReimbursementAccountSaveCorpayOnboardingCompanyDetails() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { isSuccess: null, isSavingCorpayOnboardingCompanyFields: null });
}
function clearReimbursementAccountSaveCorpayOnboardingBeneficialOwners() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { isSuccess: null, isSavingCorpayOnboardingBeneficialOwnersFields: null });
}
function clearReimbursementAccountSaveCorpayOnboardingDirectorInformation() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { isSuccess: null, isSavingCorpayOnboardingDirectorInformation: null });
}
function clearReimbursementAccountFinishCorpayBankAccountOnboarding() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { isSuccess: null, isFinishingCorpayBankAccountOnboarding: null });
}
function clearEnterSignerInformationFormSave() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM, { isSuccess: null, isSavingSignerInformation: null });
}
function clearReimbursementAccountSendReminderForCorpaySignerInformation() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { isSuccess: null, isSendingReminderForCorpaySignerInformation: null });
}
/**
 * Function to display and fetch data for Reimbursement Account step
 * @param stepToOpen - current step to open
 * @param subStep - particular step
 * @param localCurrentStep - last step on device
 * @param policyID - policy ID
 */
function openReimbursementAccountPage(stepToOpen, subStep, localCurrentStep, policyID) {
    var onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: true,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: false,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: false,
                },
            },
        ],
    };
    var parameters = {
        stepToOpen: stepToOpen,
        subStep: subStep,
        localCurrentStep: localCurrentStep,
        policyID: policyID,
    };
    return API.read(types_1.READ_COMMANDS.OPEN_REIMBURSEMENT_ACCOUNT_PAGE, parameters, onyxData);
}
/**
 * Updates the bank account in the database with the company step data
 * @param params - Business step form data
 * @param policyID - ID of the policy we're setting the bank account on
 * @param isConfirmPage - If we're submitting from the confirmation substep, to trigger all external checks
 */
function updateCompanyInformationForBankAccount(bankAccountID, params, policyID, isConfirmPage) {
    API.write(types_1.WRITE_COMMANDS.UPDATE_COMPANY_INFORMATION_FOR_BANK_ACCOUNT, __assign(__assign({}, params), { bankAccountID: bankAccountID, policyID: policyID, confirm: isConfirmPage }), getVBBADataForOnyx(CONST_1.default.BANK_ACCOUNT.STEP.COMPANY, isConfirmPage));
}
/**
 * Add beneficial owners for the bank account and verify the accuracy of the information provided
 * @param params - Beneficial Owners step form params
 */
function updateBeneficialOwnersForBankAccount(bankAccountID, params, policyID) {
    API.write(types_1.WRITE_COMMANDS.UPDATE_BENEFICIAL_OWNERS_FOR_BANK_ACCOUNT, __assign(__assign({}, params), { bankAccountID: bankAccountID, policyID: policyID }), getVBBADataForOnyx());
}
/**
 * Accept the ACH terms and conditions and verify the accuracy of the information provided
 * @param params - Verification step form params
 */
function acceptACHContractForBankAccount(bankAccountID, params, policyID) {
    API.write(types_1.WRITE_COMMANDS.ACCEPT_ACH_CONTRACT_FOR_BANK_ACCOUNT, __assign(__assign({}, params), { bankAccountID: bankAccountID, policyID: policyID }), getVBBADataForOnyx());
}
/**
 * Create the bank account with manually entered data.
 */
function connectBankAccountManually(bankAccountID, bankAccount, policyID) {
    var parameters = {
        bankAccountID: bankAccountID,
        routingNumber: bankAccount.routingNumber,
        accountNumber: bankAccount.accountNumber,
        bank: bankAccount.bankName,
        plaidAccountID: bankAccount.plaidAccountID,
        plaidAccessToken: bankAccount.plaidAccessToken,
        plaidMask: bankAccount.mask,
        isSavings: bankAccount.isSavings,
        policyID: policyID,
    };
    API.write(types_1.WRITE_COMMANDS.CONNECT_BANK_ACCOUNT_MANUALLY, parameters, getVBBADataForOnyx(CONST_1.default.BANK_ACCOUNT.STEP.BANK_ACCOUNT));
}
/**
 * Verify the user's identity via Onfido
 */
function verifyIdentityForBankAccount(bankAccountID, onfidoData, policyID) {
    var parameters = {
        bankAccountID: bankAccountID,
        onfidoData: JSON.stringify(onfidoData),
        policyID: policyID,
    };
    API.write(types_1.WRITE_COMMANDS.VERIFY_IDENTITY_FOR_BANK_ACCOUNT, parameters, getVBBADataForOnyx());
}
function openWorkspaceView(policyID) {
    API.read(types_1.READ_COMMANDS.OPEN_WORKSPACE_VIEW, {
        policyID: policyID,
    }, {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: true,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: false,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: false,
                },
            },
        ],
    });
}
function handlePlaidError(bankAccountID, error, errorDescription, plaidRequestID) {
    var parameters = {
        bankAccountID: bankAccountID,
        error: error,
        errorDescription: errorDescription,
        plaidRequestID: plaidRequestID,
    };
    API.write(types_1.WRITE_COMMANDS.BANK_ACCOUNT_HANDLE_PLAID_ERROR, parameters);
}
/**
 * Set the reimbursement account loading so that it happens right away, instead of when the API command is processed.
 */
function setReimbursementAccountLoading(isLoading) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { isLoading: isLoading });
}
function validatePlaidSelection(values) {
    var errorFields = {};
    if (!values.selectedPlaidAccountID) {
        errorFields.selectedPlaidAccountID = (0, Localize_1.translateLocal)('bankAccount.error.youNeedToSelectAnOption');
    }
    return errorFields;
}
function fetchCorpayFields(bankCountry, bankCurrency, isWithdrawal, isBusinessBankAccount) {
    API.write(types_1.WRITE_COMMANDS.GET_CORPAY_BANK_ACCOUNT_FIELDS, { countryISO: bankCountry, currency: bankCurrency, isWithdrawal: isWithdrawal, isBusinessBankAccount: isBusinessBankAccount }, {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.PERSONAL_BANK_ACCOUNT,
                value: {
                    isLoading: true,
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: ONYXKEYS_1.default.FORMS.INTERNATIONAL_BANK_ACCOUNT_FORM_DRAFT,
                value: {
                    bankCountry: bankCountry,
                    bankCurrency: bankCurrency !== null && bankCurrency !== void 0 ? bankCurrency : null,
                },
            },
        ],
        finallyData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.PERSONAL_BANK_ACCOUNT,
                value: {
                    isLoading: false,
                },
            },
        ],
    });
}
function createCorpayBankAccountForWalletFlow(data, classification, destinationCountry, preferredMethod) {
    var inputData = __assign(__assign({}, data), { classification: classification, destinationCountry: destinationCountry, preferredMethod: preferredMethod, setupType: 'manual', fieldsType: 'international', country: data.bankCountry, currency: data.bankCurrency });
    var parameters = {
        isWithdrawal: false,
        isSavings: true,
        inputs: JSON.stringify(inputData),
    };
    var onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: true,
                    isCreateCorpayBankAccount: true,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: false,
                    isCreateCorpayBankAccount: false,
                    errors: null,
                    isSuccess: true,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT,
                value: {
                    isLoading: false,
                    isCreateCorpayBankAccount: false,
                    isSuccess: false,
                    errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('walletPage.addBankAccountFailure'),
                },
            },
        ],
    };
    return API.write(types_1.WRITE_COMMANDS.BANK_ACCOUNT_CREATE_CORPAY, parameters, onyxData);
}
