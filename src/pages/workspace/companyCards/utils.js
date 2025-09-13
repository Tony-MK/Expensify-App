"use strict";
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
exports.getExportMenuItem = getExportMenuItem;
var PolicyUtils_1 = require("@libs/PolicyUtils");
var CONST_1 = require("@src/CONST");
var ROUTES_1 = require("@src/ROUTES");
function getExportMenuItem(connectionName, policyID, translate, policy, companyCard, backTo) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50;
    var currentConnectionName = (0, PolicyUtils_1.getCurrentConnectionName)(policy);
    var defaultCard = translate('workspace.moreFeatures.companyCards.defaultCard');
    var defaultMenuItem = {
        name: defaultCard,
        value: defaultCard,
        id: defaultCard,
        currency: '',
    };
    var _51 = (_c = (_b = (_a = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _a === void 0 ? void 0 : _a.quickbooksOnline) === null || _b === void 0 ? void 0 : _b.config) !== null && _c !== void 0 ? _c : {}, nonReimbursableExpensesExportDestination = _51.nonReimbursableExpensesExportDestination, nonReimbursableExpensesAccount = _51.nonReimbursableExpensesAccount, reimbursableExpensesExportDestination = _51.reimbursableExpensesExportDestination, reimbursableExpensesAccount = _51.reimbursableExpensesAccount;
    var exportConfig = ((_f = (_e = (_d = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _d === void 0 ? void 0 : _d.intacct) === null || _e === void 0 ? void 0 : _e.config) !== null && _f !== void 0 ? _f : {}).export;
    var exportConfiguration = ((_j = (_h = (_g = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _g === void 0 ? void 0 : _g.xero) === null || _h === void 0 ? void 0 : _h.config) !== null && _j !== void 0 ? _j : {}).export;
    var config = (_m = (_l = (_k = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _k === void 0 ? void 0 : _k.netsuite) === null || _l === void 0 ? void 0 : _l.options) === null || _m === void 0 ? void 0 : _m.config;
    var bankAccounts = ((_q = (_p = (_o = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _o === void 0 ? void 0 : _o.xero) === null || _p === void 0 ? void 0 : _p.data) !== null && _q !== void 0 ? _q : {}).bankAccounts;
    var _52 = (_t = (_s = (_r = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _r === void 0 ? void 0 : _r.quickbooksOnline) === null || _s === void 0 ? void 0 : _s.data) !== null && _t !== void 0 ? _t : {}, creditCards = _52.creditCards, quickbooksOnlineBankAccounts = _52.bankAccounts;
    var creditCardAccounts = ((_w = (_v = (_u = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _u === void 0 ? void 0 : _u.quickbooksDesktop) === null || _v === void 0 ? void 0 : _v.data) !== null && _w !== void 0 ? _w : {}).creditCardAccounts;
    var exportQBD = ((_z = (_y = (_x = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _x === void 0 ? void 0 : _x.quickbooksDesktop) === null || _y === void 0 ? void 0 : _y.config) !== null && _z !== void 0 ? _z : {}).export;
    switch (connectionName) {
        case CONST_1.default.POLICY.CONNECTIONS.NAME.QBO: {
            var typeNonReimbursable = nonReimbursableExpensesExportDestination ? translate("workspace.qbo.accounts.".concat(nonReimbursableExpensesExportDestination)) : undefined;
            var typeReimbursable = reimbursableExpensesExportDestination ? translate("workspace.qbo.accounts.".concat(reimbursableExpensesExportDestination)) : undefined;
            var type = typeNonReimbursable !== null && typeNonReimbursable !== void 0 ? typeNonReimbursable : typeReimbursable;
            var description = currentConnectionName && type ? translate('workspace.moreFeatures.companyCards.integrationExport', { integration: currentConnectionName, type: type }) : undefined;
            var data = void 0;
            var shouldShowMenuItem = nonReimbursableExpensesExportDestination !== CONST_1.default.QUICKBOOKS_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.VENDOR_BILL;
            var selectedAccount_1;
            var defaultAccount_1 = (_0 = nonReimbursableExpensesAccount === null || nonReimbursableExpensesAccount === void 0 ? void 0 : nonReimbursableExpensesAccount.name) !== null && _0 !== void 0 ? _0 : reimbursableExpensesAccount === null || reimbursableExpensesAccount === void 0 ? void 0 : reimbursableExpensesAccount.name;
            var isDefaultTitle_1 = false;
            var exportType = void 0;
            var qboConfig = nonReimbursableExpensesExportDestination !== null && nonReimbursableExpensesExportDestination !== void 0 ? nonReimbursableExpensesExportDestination : reimbursableExpensesExportDestination;
            switch (qboConfig) {
                case CONST_1.default.QUICKBOOKS_REIMBURSABLE_ACCOUNT_TYPE.JOURNAL_ENTRY:
                case CONST_1.default.QUICKBOOKS_REIMBURSABLE_ACCOUNT_TYPE.CHECK:
                case CONST_1.default.QUICKBOOKS_REIMBURSABLE_ACCOUNT_TYPE.VENDOR_BILL:
                case CONST_1.default.QUICKBOOKS_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.CREDIT_CARD: {
                    data = creditCards !== null && creditCards !== void 0 ? creditCards : [];
                    isDefaultTitle_1 = !!(defaultAccount_1 &&
                        (!((_1 = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _1 === void 0 ? void 0 : _1.quickbooks_online_export_account) ||
                            ((_2 = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _2 === void 0 ? void 0 : _2.quickbooks_online_export_account) === CONST_1.default.COMPANY_CARDS.DEFAULT_EXPORT_TYPE));
                    selectedAccount_1 = (creditCards !== null && creditCards !== void 0 ? creditCards : []).find(function (currentCard) { var _a, _b; return currentCard.id === ((_b = (_a = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _a === void 0 ? void 0 : _a.quickbooks_online_export_account) !== null && _b !== void 0 ? _b : defaultAccount_1); });
                    exportType = CONST_1.default.COMPANY_CARDS.EXPORT_CARD_TYPES.NVP_QUICKBOOKS_ONLINE_EXPORT_ACCOUNT;
                    break;
                }
                case CONST_1.default.QUICKBOOKS_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.DEBIT_CARD: {
                    data = quickbooksOnlineBankAccounts !== null && quickbooksOnlineBankAccounts !== void 0 ? quickbooksOnlineBankAccounts : [];
                    isDefaultTitle_1 = !!(defaultAccount_1 &&
                        (!((_3 = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _3 === void 0 ? void 0 : _3.quickbooks_online_export_account_debit) ||
                            ((_4 = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _4 === void 0 ? void 0 : _4.quickbooks_online_export_account_debit) === CONST_1.default.COMPANY_CARDS.DEFAULT_EXPORT_TYPE));
                    selectedAccount_1 = (quickbooksOnlineBankAccounts !== null && quickbooksOnlineBankAccounts !== void 0 ? quickbooksOnlineBankAccounts : []).find(function (bank) { var _a, _b; return bank.id === ((_b = (_a = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _a === void 0 ? void 0 : _a.quickbooks_online_export_account_debit) !== null && _b !== void 0 ? _b : defaultAccount_1); });
                    exportType = CONST_1.default.COMPANY_CARDS.EXPORT_CARD_TYPES.NVP_QUICKBOOKS_ONLINE_EXPORT_ACCOUNT_DEBIT;
                    break;
                }
                default:
                    shouldShowMenuItem = false;
                    data = [];
            }
            var resultData = data.length > 0 ? __spreadArray([defaultMenuItem], data, true) : data;
            return {
                description: description,
                title: isDefaultTitle_1 ? defaultCard : selectedAccount_1 === null || selectedAccount_1 === void 0 ? void 0 : selectedAccount_1.name,
                exportType: exportType,
                shouldShowMenuItem: shouldShowMenuItem,
                exportPageLink: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT.getRoute(policyID, backTo),
                data: resultData.map(function (card) { return ({
                    value: card.id,
                    text: card.name,
                    keyForList: card.name,
                    isSelected: isDefaultTitle_1 ? card.name === defaultCard : card.id === (selectedAccount_1 === null || selectedAccount_1 === void 0 ? void 0 : selectedAccount_1.id),
                }); }),
            };
        }
        case CONST_1.default.POLICY.CONNECTIONS.NAME.XERO: {
            var type = translate('workspace.xero.xeroBankAccount');
            var description = currentConnectionName && type ? translate('workspace.moreFeatures.companyCards.integrationExport', { integration: type }) : undefined;
            var exportType = CONST_1.default.COMPANY_CARDS.EXPORT_CARD_TYPES.NVP_XERO_EXPORT_BANK_ACCOUNT;
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            var defaultAccount_2 = (exportConfiguration === null || exportConfiguration === void 0 ? void 0 : exportConfiguration.nonReimbursableAccount) || ((_5 = bankAccounts === null || bankAccounts === void 0 ? void 0 : bankAccounts[0]) === null || _5 === void 0 ? void 0 : _5.id);
            var isDefaultTitle_2 = !!(defaultAccount_2 &&
                (!((_6 = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _6 === void 0 ? void 0 : _6.xero_export_bank_account) || ((_7 = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _7 === void 0 ? void 0 : _7.xero_export_bank_account) === CONST_1.default.COMPANY_CARDS.DEFAULT_EXPORT_TYPE));
            var selectedAccount_2 = (bankAccounts !== null && bankAccounts !== void 0 ? bankAccounts : []).find(function (bank) { var _a, _b; return bank.id === ((_b = (_a = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _a === void 0 ? void 0 : _a.xero_export_bank_account) !== null && _b !== void 0 ? _b : defaultAccount_2); });
            var resultData = ((_8 = (bankAccounts !== null && bankAccounts !== void 0 ? bankAccounts : [])) === null || _8 === void 0 ? void 0 : _8.length) > 0 ? __spreadArray([defaultMenuItem], (bankAccounts !== null && bankAccounts !== void 0 ? bankAccounts : []), true) : bankAccounts;
            return {
                description: description,
                exportType: exportType,
                shouldShowMenuItem: !!(exportConfiguration === null || exportConfiguration === void 0 ? void 0 : exportConfiguration.nonReimbursableAccount),
                title: isDefaultTitle_2 ? defaultCard : selectedAccount_2 === null || selectedAccount_2 === void 0 ? void 0 : selectedAccount_2.name,
                exportPageLink: ROUTES_1.default.POLICY_ACCOUNTING_XERO_EXPORT.getRoute(policyID, backTo),
                data: (resultData !== null && resultData !== void 0 ? resultData : []).map(function (card) {
                    return {
                        value: card.id,
                        text: card.name,
                        keyForList: card.id,
                        isSelected: isDefaultTitle_2 ? card.name === defaultCard : (selectedAccount_2 === null || selectedAccount_2 === void 0 ? void 0 : selectedAccount_2.id) === card.id,
                    };
                }),
            };
        }
        case CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE: {
            var typeNonreimbursable = (config === null || config === void 0 ? void 0 : config.nonreimbursableExpensesExportDestination)
                ? translate("workspace.netsuite.exportDestination.values.".concat(config.nonreimbursableExpensesExportDestination, ".label"))
                : undefined;
            var typeReimbursable = (config === null || config === void 0 ? void 0 : config.reimbursableExpensesExportDestination)
                ? translate("workspace.netsuite.exportDestination.values.".concat(config.reimbursableExpensesExportDestination, ".label"))
                : undefined;
            var type = typeNonreimbursable !== null && typeNonreimbursable !== void 0 ? typeNonreimbursable : typeReimbursable;
            var title = '';
            var exportType = void 0;
            var shouldShowMenuItem = true;
            var description = currentConnectionName && type ? translate('workspace.moreFeatures.companyCards.integrationExport', { integration: currentConnectionName, type: type }) : undefined;
            var data = void 0;
            var defaultAccount = '';
            var isDefaultTitle_3 = false;
            var netSuiteConfig = (_9 = config === null || config === void 0 ? void 0 : config.nonreimbursableExpensesExportDestination) !== null && _9 !== void 0 ? _9 : config === null || config === void 0 ? void 0 : config.reimbursableExpensesExportDestination;
            switch (netSuiteConfig) {
                case CONST_1.default.NETSUITE_EXPORT_DESTINATION.VENDOR_BILL: {
                    var vendors = (_11 = (_10 = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _10 === void 0 ? void 0 : _10.netsuite) === null || _11 === void 0 ? void 0 : _11.options.data.vendors;
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    defaultAccount = (config === null || config === void 0 ? void 0 : config.defaultVendor) || ((_12 = vendors === null || vendors === void 0 ? void 0 : vendors[0]) === null || _12 === void 0 ? void 0 : _12.id);
                    isDefaultTitle_3 = !!(defaultAccount &&
                        (!((_13 = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _13 === void 0 ? void 0 : _13.netsuite_export_vendor) || ((_14 = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _14 === void 0 ? void 0 : _14.netsuite_export_vendor) === CONST_1.default.COMPANY_CARDS.DEFAULT_EXPORT_TYPE));
                    var selectedVendor_1 = (0, PolicyUtils_1.findSelectedVendorWithDefaultSelect)(vendors, (_16 = (_15 = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _15 === void 0 ? void 0 : _15.netsuite_export_vendor) !== null && _16 !== void 0 ? _16 : defaultAccount);
                    title = isDefaultTitle_3 ? defaultCard : selectedVendor_1 === null || selectedVendor_1 === void 0 ? void 0 : selectedVendor_1.name;
                    var resultData = (vendors !== null && vendors !== void 0 ? vendors : []).length > 0 ? __spreadArray([defaultMenuItem], (vendors !== null && vendors !== void 0 ? vendors : []), true) : vendors;
                    data = (resultData !== null && resultData !== void 0 ? resultData : []).map(function (_a) {
                        var id = _a.id, name = _a.name;
                        return {
                            value: id,
                            text: name,
                            keyForList: id,
                            isSelected: isDefaultTitle_3 ? name === defaultCard : (selectedVendor_1 === null || selectedVendor_1 === void 0 ? void 0 : selectedVendor_1.id) === id,
                        };
                    });
                    exportType = CONST_1.default.COMPANY_CARDS.EXPORT_CARD_TYPES.NVP_NETSUITE_EXPORT_VENDOR;
                    break;
                }
                case CONST_1.default.NETSUITE_EXPORT_DESTINATION.JOURNAL_ENTRY: {
                    var payableAccounts = (_18 = (_17 = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _17 === void 0 ? void 0 : _17.netsuite) === null || _18 === void 0 ? void 0 : _18.options.data.payableList;
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    defaultAccount = (config === null || config === void 0 ? void 0 : config.payableAcct) || ((_19 = payableAccounts === null || payableAccounts === void 0 ? void 0 : payableAccounts[0]) === null || _19 === void 0 ? void 0 : _19.id);
                    isDefaultTitle_3 = !!(defaultAccount &&
                        (!((_20 = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _20 === void 0 ? void 0 : _20.netsuite_export_payable_account) ||
                            ((_21 = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _21 === void 0 ? void 0 : _21.netsuite_export_payable_account) === CONST_1.default.COMPANY_CARDS.DEFAULT_EXPORT_TYPE));
                    var selectedPayableAccount_1 = (0, PolicyUtils_1.findSelectedBankAccountWithDefaultSelect)(payableAccounts, (_23 = (_22 = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _22 === void 0 ? void 0 : _22.netsuite_export_payable_account) !== null && _23 !== void 0 ? _23 : defaultAccount);
                    title = isDefaultTitle_3 ? defaultCard : selectedPayableAccount_1 === null || selectedPayableAccount_1 === void 0 ? void 0 : selectedPayableAccount_1.name;
                    var resultData = (payableAccounts !== null && payableAccounts !== void 0 ? payableAccounts : []).length > 0 ? __spreadArray([defaultMenuItem], (payableAccounts !== null && payableAccounts !== void 0 ? payableAccounts : []), true) : payableAccounts;
                    data = (resultData !== null && resultData !== void 0 ? resultData : []).map(function (_a) {
                        var id = _a.id, name = _a.name;
                        return {
                            value: id,
                            text: name,
                            keyForList: id,
                            isSelected: isDefaultTitle_3 ? name === defaultCard : (selectedPayableAccount_1 === null || selectedPayableAccount_1 === void 0 ? void 0 : selectedPayableAccount_1.id) === id,
                        };
                    });
                    exportType = CONST_1.default.COMPANY_CARDS.EXPORT_CARD_TYPES.NVP_NETSUITE_EXPORT_ACCOUNT;
                    break;
                }
                default:
                    shouldShowMenuItem = false;
                    data = [];
            }
            return {
                description: description,
                title: title,
                shouldShowMenuItem: shouldShowMenuItem,
                exportType: exportType,
                data: data,
                exportPageLink: ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT.getRoute(policyID, backTo),
            };
        }
        case CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT: {
            var isNonReimbursable = !!(exportConfig === null || exportConfig === void 0 ? void 0 : exportConfig.nonReimbursable);
            var isReimbursable = !!(exportConfig === null || exportConfig === void 0 ? void 0 : exportConfig.reimbursable);
            var typeNonReimbursable = isNonReimbursable ? translate("workspace.sageIntacct.nonReimbursableExpenses.values.".concat(exportConfig.nonReimbursable)) : undefined;
            var typeReimbursable = isReimbursable ? translate("workspace.sageIntacct.reimbursableExpenses.values.".concat(exportConfig.reimbursable)) : undefined;
            var type = typeNonReimbursable !== null && typeNonReimbursable !== void 0 ? typeNonReimbursable : typeReimbursable;
            var description = currentConnectionName && type ? translate('workspace.moreFeatures.companyCards.integrationExport', { integration: currentConnectionName, type: type }) : undefined;
            var exportType = void 0;
            var title = '';
            var isDefaultTitle_4 = false;
            var shouldShowMenuItem = true;
            var data = void 0;
            var sageConfig = (_24 = exportConfig === null || exportConfig === void 0 ? void 0 : exportConfig.nonReimbursable) !== null && _24 !== void 0 ? _24 : exportConfig === null || exportConfig === void 0 ? void 0 : exportConfig.reimbursable;
            switch (sageConfig) {
                case CONST_1.default.SAGE_INTACCT_NON_REIMBURSABLE_EXPENSE_TYPE.VENDOR_BILL:
                case CONST_1.default.SAGE_INTACCT_REIMBURSABLE_EXPENSE_TYPE.VENDOR_BILL: {
                    var defaultAccount = isNonReimbursable ? (0, PolicyUtils_1.getSageIntacctNonReimbursableActiveDefaultVendor)(policy) : exportConfig === null || exportConfig === void 0 ? void 0 : exportConfig.reimbursableExpenseReportDefaultVendor;
                    isDefaultTitle_4 = !!(((_25 = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _25 === void 0 ? void 0 : _25.intacct_export_vendor) === CONST_1.default.COMPANY_CARDS.DEFAULT_EXPORT_TYPE ||
                        (defaultAccount && !((_26 = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _26 === void 0 ? void 0 : _26.intacct_export_vendor)));
                    var vendors = (_30 = (_29 = (_28 = (_27 = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _27 === void 0 ? void 0 : _27.intacct) === null || _28 === void 0 ? void 0 : _28.data) === null || _29 === void 0 ? void 0 : _29.vendors) !== null && _30 !== void 0 ? _30 : [];
                    var selectedVendorID_1 = (_32 = (_31 = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _31 === void 0 ? void 0 : _31.intacct_export_vendor) !== null && _32 !== void 0 ? _32 : defaultAccount;
                    var selectedVendor_2 = (vendors !== null && vendors !== void 0 ? vendors : []).find(function (_a) {
                        var id = _a.id;
                        return id === selectedVendorID_1;
                    });
                    title = isDefaultTitle_4 ? defaultCard : selectedVendor_2 === null || selectedVendor_2 === void 0 ? void 0 : selectedVendor_2.value;
                    var resultData = (vendors !== null && vendors !== void 0 ? vendors : []).length > 0 ? __spreadArray([defaultMenuItem], (vendors !== null && vendors !== void 0 ? vendors : []), true) : vendors;
                    data = (resultData !== null && resultData !== void 0 ? resultData : []).map(function (_a) {
                        var id = _a.id, value = _a.value;
                        return {
                            value: id,
                            text: value,
                            keyForList: id,
                            isSelected: isDefaultTitle_4 ? value === defaultCard : (selectedVendor_2 === null || selectedVendor_2 === void 0 ? void 0 : selectedVendor_2.id) === id,
                        };
                    });
                    exportType = CONST_1.default.COMPANY_CARDS.EXPORT_CARD_TYPES.NVP_INTACCT_EXPORT_VENDOR;
                    break;
                }
                case CONST_1.default.SAGE_INTACCT_NON_REIMBURSABLE_EXPENSE_TYPE.CREDIT_CARD_CHARGE: {
                    var intacctCreditCards = (_36 = (_35 = (_34 = (_33 = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _33 === void 0 ? void 0 : _33.intacct) === null || _34 === void 0 ? void 0 : _34.data) === null || _35 === void 0 ? void 0 : _35.creditCards) !== null && _36 !== void 0 ? _36 : [];
                    var activeDefaultVendor_1 = (0, PolicyUtils_1.getSageIntacctNonReimbursableActiveDefaultVendor)(policy);
                    var defaultVendorAccount = ((_40 = (_39 = (_38 = (_37 = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _37 === void 0 ? void 0 : _37.intacct) === null || _38 === void 0 ? void 0 : _38.data) === null || _39 === void 0 ? void 0 : _39.vendors) !== null && _40 !== void 0 ? _40 : []).find(function (vendor) { return vendor.id === activeDefaultVendor_1; });
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    var defaultAccount = (exportConfig === null || exportConfig === void 0 ? void 0 : exportConfig.nonReimbursableAccount) || defaultVendorAccount;
                    isDefaultTitle_4 = !!(((_41 = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _41 === void 0 ? void 0 : _41.intacct_export_charge_card) === CONST_1.default.COMPANY_CARDS.DEFAULT_EXPORT_TYPE ||
                        (defaultAccount && !((_42 = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _42 === void 0 ? void 0 : _42.intacct_export_charge_card)));
                    var selectedVendorID_2 = (_44 = (_43 = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _43 === void 0 ? void 0 : _43.intacct_export_charge_card) !== null && _44 !== void 0 ? _44 : defaultAccount;
                    var selectedCard_1 = (intacctCreditCards !== null && intacctCreditCards !== void 0 ? intacctCreditCards : []).find(function (_a) {
                        var id = _a.id;
                        return id === selectedVendorID_2;
                    });
                    title = isDefaultTitle_4 ? defaultCard : selectedCard_1 === null || selectedCard_1 === void 0 ? void 0 : selectedCard_1.name;
                    var resultData = (intacctCreditCards !== null && intacctCreditCards !== void 0 ? intacctCreditCards : []).length > 0 ? __spreadArray([defaultMenuItem], (intacctCreditCards !== null && intacctCreditCards !== void 0 ? intacctCreditCards : []), true) : intacctCreditCards;
                    data = (resultData !== null && resultData !== void 0 ? resultData : []).map(function (_a) {
                        var id = _a.id, name = _a.name;
                        return {
                            value: id,
                            text: name,
                            keyForList: id,
                            isSelected: isDefaultTitle_4 ? name === defaultCard : (selectedCard_1 === null || selectedCard_1 === void 0 ? void 0 : selectedCard_1.id) === id,
                        };
                    });
                    exportType = CONST_1.default.COMPANY_CARDS.EXPORT_CARD_TYPES.NVP_INTACCT_EXPORT_CHARGE_CARD;
                    break;
                }
                default:
                    shouldShowMenuItem = false;
                    data = [];
            }
            return {
                description: description,
                shouldShowMenuItem: shouldShowMenuItem,
                exportType: exportType,
                title: title,
                exportPageLink: ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_EXPORT.getRoute(policyID, backTo),
                data: data,
            };
        }
        case CONST_1.default.POLICY.CONNECTIONS.NAME.QBD: {
            var nonReimbursableExpenses = exportQBD === null || exportQBD === void 0 ? void 0 : exportQBD.nonReimbursable;
            var reimbursableExpenses = exportQBD === null || exportQBD === void 0 ? void 0 : exportQBD.reimbursable;
            var typeNonReimbursable = nonReimbursableExpenses ? translate("workspace.qbd.accounts.".concat(nonReimbursableExpenses)) : undefined;
            var typeReimbursable = reimbursableExpenses ? translate("workspace.qbd.accounts.".concat(reimbursableExpenses)) : undefined;
            var type = typeNonReimbursable !== null && typeNonReimbursable !== void 0 ? typeNonReimbursable : typeReimbursable;
            var description = currentConnectionName && type ? translate('workspace.moreFeatures.companyCards.integrationExport', { integration: currentConnectionName, type: type }) : undefined;
            var data = void 0;
            var shouldShowMenuItem = nonReimbursableExpenses !== CONST_1.default.QUICKBOOKS_DESKTOP_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.CHECK &&
                nonReimbursableExpenses !== CONST_1.default.QUICKBOOKS_DESKTOP_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.VENDOR_BILL;
            var title = '';
            var selectedAccount_3 = '';
            var defaultAccount = (_45 = exportQBD === null || exportQBD === void 0 ? void 0 : exportQBD.nonReimbursableAccount) !== null && _45 !== void 0 ? _45 : exportQBD === null || exportQBD === void 0 ? void 0 : exportQBD.reimbursableAccount;
            var isDefaultTitle_5 = false;
            var exportType = void 0;
            var qbdConfig = nonReimbursableExpenses !== null && nonReimbursableExpenses !== void 0 ? nonReimbursableExpenses : reimbursableExpenses;
            switch (qbdConfig) {
                case CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.JOURNAL_ENTRY:
                case CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.CHECK:
                case CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.VENDOR_BILL:
                case CONST_1.default.QUICKBOOKS_DESKTOP_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.CREDIT_CARD: {
                    data = creditCardAccounts !== null && creditCardAccounts !== void 0 ? creditCardAccounts : [];
                    isDefaultTitle_5 = !!(((_46 = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _46 === void 0 ? void 0 : _46.quickbooks_desktop_export_account_credit) === CONST_1.default.COMPANY_CARDS.DEFAULT_EXPORT_TYPE ||
                        (defaultAccount && !((_47 = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _47 === void 0 ? void 0 : _47.quickbooks_desktop_export_account_credit)));
                    title = isDefaultTitle_5 ? defaultCard : (_48 = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _48 === void 0 ? void 0 : _48.quickbooks_desktop_export_account_credit;
                    selectedAccount_3 = (_50 = (_49 = companyCard === null || companyCard === void 0 ? void 0 : companyCard.nameValuePairs) === null || _49 === void 0 ? void 0 : _49.quickbooks_desktop_export_account_credit) !== null && _50 !== void 0 ? _50 : defaultAccount;
                    exportType = CONST_1.default.COMPANY_CARDS.EXPORT_CARD_TYPES.NVP_QUICKBOOKS_DESKTOP_EXPORT_ACCOUNT_CREDIT;
                    break;
                }
                default:
                    shouldShowMenuItem = false;
                    data = [];
            }
            var resultData = data.length > 0 ? __spreadArray([defaultMenuItem], data, true) : data;
            return {
                description: description,
                title: title,
                exportType: exportType,
                shouldShowMenuItem: shouldShowMenuItem,
                exportPageLink: ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT.getRoute(policyID, backTo),
                data: resultData.map(function (card) { return ({
                    value: card.name,
                    text: card.name,
                    keyForList: card.name,
                    isSelected: isDefaultTitle_5 ? card.name === defaultCard : card.name === selectedAccount_3,
                }); }),
            };
        }
        default:
            return undefined;
    }
}
