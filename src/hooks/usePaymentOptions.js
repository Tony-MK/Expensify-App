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
var react_1 = require("react");
var Expensicons = require("@components/Icon/Expensicons");
var PaymentUtils_1 = require("@libs/PaymentUtils");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var Navigation_1 = require("@navigation/Navigation");
var Policy_1 = require("@userActions/Policy/Policy");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
var isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
var useCurrentUserPersonalDetails_1 = require("./useCurrentUserPersonalDetails");
var useLocalize_1 = require("./useLocalize");
var useOnyx_1 = require("./useOnyx");
var usePolicy_1 = require("./usePolicy");
var useThemeStyles_1 = require("./useThemeStyles");
/**
 * Configures and returns payment options based on the context of the IOU report and user settings.
 * It considers various conditions such as whether to show payment methods or an approval button, report types, and user preferences on payment methods.
 * It dynamically generates payment or approval options to ensure the user interface reflects the correct actions possible for the user's current situation.
 */
function usePaymentOptions(_a) {
    var _b = _a.currency, currency = _b === void 0 ? CONST_1.default.CURRENCY.USD : _b, iouReport = _a.iouReport, _c = _a.chatReportID, chatReportID = _c === void 0 ? '' : _c, _d = _a.formattedAmount, formattedAmount = _d === void 0 ? '' : _d, _e = _a.policyID, policyID = _e === void 0 ? '-1' : _e, onPress = _a.onPress, _f = _a.shouldHidePaymentOptions, shouldHidePaymentOptions = _f === void 0 ? false : _f, _g = _a.shouldShowApproveButton, shouldShowApproveButton = _g === void 0 ? false : _g, _h = _a.shouldDisableApproveButton, shouldDisableApproveButton = _h === void 0 ? false : _h, onlyShowPayElsewhere = _a.onlyShowPayElsewhere;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var policy = (0, usePolicy_1.default)(policyID);
    var accountID = (0, useCurrentUserPersonalDetails_1.default)().accountID;
    // The app would crash due to subscribing to the entire report collection if chatReportID is an empty string. So we should have a fallback ID here.
    // eslint-disable-next-line rulesdir/no-default-id-values
    var chatReport = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(chatReportID || CONST_1.default.DEFAULT_NUMBER_ID), { canBeMissing: true })[0];
    var policyEmployeeAccountIDs = (0, PolicyUtils_1.getPolicyEmployeeAccountIDs)(policy, accountID);
    var reportBelongsToWorkspace = policyID ? (0, ReportUtils_1.doesReportBelongToWorkspace)(chatReport, policyEmployeeAccountIDs, policyID) : false;
    var policyIDKey = reportBelongsToWorkspace ? policyID : CONST_1.default.POLICY.ID_FAKE;
    var _j = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD, {
        canBeMissing: true,
        selector: function (paymentMethod) {
            var paymentMethodType = paymentMethod === null || paymentMethod === void 0 ? void 0 : paymentMethod[policyIDKey];
            if (typeof paymentMethodType === 'string') {
                return paymentMethodType;
            }
            if (typeof (paymentMethodType === null || paymentMethodType === void 0 ? void 0 : paymentMethodType.lastUsed) === 'string') {
                return paymentMethodType.lastUsed;
            }
            return paymentMethodType === null || paymentMethodType === void 0 ? void 0 : paymentMethodType.lastUsed.name;
        },
    }), lastPaymentMethod = _j[0], lastPaymentMethodResult = _j[1];
    var isLoadingLastPaymentMethod = (0, isLoadingOnyxValue_1.default)(lastPaymentMethodResult);
    var _k = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: true })[0], bankAccountList = _k === void 0 ? (0, EmptyObject_1.getEmptyObject)() : _k;
    var _l = (0, useOnyx_1.default)(ONYXKEYS_1.default.FUND_LIST, { canBeMissing: true })[0], fundList = _l === void 0 ? (0, EmptyObject_1.getEmptyObject)() : _l;
    var lastPaymentMethodRef = (0, react_1.useRef)(lastPaymentMethod);
    (0, react_1.useEffect)(function () {
        if (isLoadingLastPaymentMethod) {
            return;
        }
        lastPaymentMethodRef.current = lastPaymentMethod;
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isLoadingLastPaymentMethod]);
    var isInvoiceReport = (!(0, EmptyObject_1.isEmptyObject)(iouReport) && (0, ReportUtils_1.isInvoiceReport)(iouReport)) || false;
    var shouldShowPayWithExpensifyOption = !shouldHidePaymentOptions;
    var shouldShowPayElsewhereOption = !shouldHidePaymentOptions && !isInvoiceReport;
    var paymentButtonOptions = (0, react_1.useMemo)(function () {
        var _a;
        var buttonOptions = [];
        var isExpenseReport = (0, ReportUtils_1.isExpenseReport)(iouReport);
        var paymentMethods = (_a = {},
            _a[CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY] = {
                text: translate('iou.settleExpensify', { formattedAmount: formattedAmount }),
                icon: Expensicons.Wallet,
                value: CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY,
            },
            _a[CONST_1.default.IOU.PAYMENT_TYPE.VBBA] = {
                text: translate('iou.settleExpensify', { formattedAmount: formattedAmount }),
                icon: Expensicons.Wallet,
                value: CONST_1.default.IOU.PAYMENT_TYPE.VBBA,
            },
            _a[CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE] = {
                text: translate('iou.payElsewhere', { formattedAmount: formattedAmount }),
                icon: Expensicons.Cash,
                value: CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE,
            },
            _a);
        var approveButtonOption = {
            text: translate('iou.approve', { formattedAmount: formattedAmount }),
            icon: Expensicons.ThumbsUp,
            value: CONST_1.default.IOU.REPORT_ACTION_TYPE.APPROVE,
            disabled: !!shouldDisableApproveButton,
        };
        var canUseWallet = !isExpenseReport && !isInvoiceReport && currency === CONST_1.default.CURRENCY.USD;
        // Only show the Approve button if the user cannot pay the expense
        if (shouldHidePaymentOptions && shouldShowApproveButton) {
            return [approveButtonOption];
        }
        if (onlyShowPayElsewhere) {
            return [paymentMethods[CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE]];
        }
        // To achieve the one tap pay experience we need to choose the correct payment type as default.
        if (canUseWallet) {
            buttonOptions.push(paymentMethods[CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY]);
        }
        if (isExpenseReport && shouldShowPayWithExpensifyOption) {
            buttonOptions.push(paymentMethods[CONST_1.default.IOU.PAYMENT_TYPE.VBBA]);
        }
        if (shouldShowPayElsewhereOption) {
            buttonOptions.push(paymentMethods[CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE]);
        }
        if (isInvoiceReport) {
            var formattedPaymentMethods_1 = (0, PaymentUtils_1.formatPaymentMethods)(bankAccountList, fundList, styles);
            var isCurrencySupported = (0, Policy_1.isCurrencySupportedForDirectReimbursement)(currency);
            var getPaymentSubitems = function (payAsBusiness) {
                return formattedPaymentMethods_1.map(function (formattedPaymentMethod) {
                    var _a, _b;
                    return ({
                        text: (_a = formattedPaymentMethod === null || formattedPaymentMethod === void 0 ? void 0 : formattedPaymentMethod.title) !== null && _a !== void 0 ? _a : '',
                        description: (_b = formattedPaymentMethod === null || formattedPaymentMethod === void 0 ? void 0 : formattedPaymentMethod.description) !== null && _b !== void 0 ? _b : '',
                        icon: formattedPaymentMethod === null || formattedPaymentMethod === void 0 ? void 0 : formattedPaymentMethod.icon,
                        onSelected: function () { return onPress(CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY, payAsBusiness, formattedPaymentMethod.methodID, formattedPaymentMethod.accountType); },
                        iconStyles: formattedPaymentMethod === null || formattedPaymentMethod === void 0 ? void 0 : formattedPaymentMethod.iconStyles,
                        iconHeight: formattedPaymentMethod === null || formattedPaymentMethod === void 0 ? void 0 : formattedPaymentMethod.iconSize,
                        iconWidth: formattedPaymentMethod === null || formattedPaymentMethod === void 0 ? void 0 : formattedPaymentMethod.iconSize,
                    });
                });
            };
            if ((0, ReportUtils_1.isIndividualInvoiceRoom)(chatReport)) {
                buttonOptions.push({
                    text: translate('iou.settlePersonal', { formattedAmount: formattedAmount }),
                    icon: Expensicons.User,
                    value: CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE,
                    backButtonText: translate('iou.individual'),
                    subMenuItems: __spreadArray(__spreadArray([], (isCurrencySupported ? getPaymentSubitems(false) : []), true), [
                        {
                            text: translate('iou.payElsewhere', { formattedAmount: '' }),
                            icon: Expensicons.Cash,
                            value: CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE,
                            onSelected: function () { return onPress(CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE); },
                        },
                        {
                            text: translate('bankAccount.addBankAccount'),
                            icon: Expensicons.Bank,
                            onSelected: function () {
                                var bankAccountRoute = (0, ReportUtils_1.getBankAccountRoute)(chatReport);
                                Navigation_1.default.navigate(bankAccountRoute);
                            },
                        },
                    ], false),
                });
            }
            buttonOptions.push({
                text: translate('iou.settleBusiness', { formattedAmount: formattedAmount }),
                icon: Expensicons.Building,
                value: CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE,
                backButtonText: translate('iou.business'),
                subMenuItems: __spreadArray(__spreadArray([], (isCurrencySupported ? getPaymentSubitems(true) : []), true), [
                    {
                        text: translate('bankAccount.addBankAccount'),
                        icon: Expensicons.Bank,
                        onSelected: function () {
                            var bankAccountRoute = (0, ReportUtils_1.getBankAccountRoute)(chatReport);
                            Navigation_1.default.navigate(bankAccountRoute);
                        },
                    },
                    {
                        text: translate('iou.payElsewhere', { formattedAmount: '' }),
                        icon: Expensicons.Cash,
                        value: CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE,
                        onSelected: function () { return onPress(CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE, true); },
                    },
                ], false),
            });
        }
        if (shouldShowApproveButton) {
            buttonOptions.push(approveButtonOption);
        }
        // Put the preferred payment method to the front of the array, so it's shown as default. We assume their last payment method is their preferred.
        if (lastPaymentMethodRef.current) {
            return buttonOptions.sort(function (method) { return (method.value === lastPaymentMethod ? -1 : 0); });
        }
        return buttonOptions;
        // We don't want to reorder the options when the preferred payment method changes while the button is still visible except for component initialization when the last payment method is not initialized yet.
        // We need to be sure that onPress should be wrapped in an useCallback to prevent unnecessary updates.
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [
        isLoadingLastPaymentMethod,
        iouReport,
        translate,
        formattedAmount,
        shouldDisableApproveButton,
        isInvoiceReport,
        currency,
        shouldHidePaymentOptions,
        shouldShowApproveButton,
        shouldShowPayWithExpensifyOption,
        shouldShowPayElsewhereOption,
        chatReport,
        onPress,
        onlyShowPayElsewhere,
    ]);
    return paymentButtonOptions;
}
exports.default = usePaymentOptions;
