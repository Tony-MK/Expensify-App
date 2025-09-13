"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Expensicons = require("@components/Icon/Expensicons");
const PaymentUtils_1 = require("@libs/PaymentUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const Navigation_1 = require("@navigation/Navigation");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const useCurrentUserPersonalDetails_1 = require("./useCurrentUserPersonalDetails");
const useLocalize_1 = require("./useLocalize");
const useOnyx_1 = require("./useOnyx");
const usePolicy_1 = require("./usePolicy");
const useThemeStyles_1 = require("./useThemeStyles");
/**
 * Configures and returns payment options based on the context of the IOU report and user settings.
 * It considers various conditions such as whether to show payment methods or an approval button, report types, and user preferences on payment methods.
 * It dynamically generates payment or approval options to ensure the user interface reflects the correct actions possible for the user's current situation.
 */
function usePaymentOptions({ currency = CONST_1.default.CURRENCY.USD, iouReport, chatReportID = '', formattedAmount = '', policyID = '-1', onPress, shouldHidePaymentOptions = false, shouldShowApproveButton = false, shouldDisableApproveButton = false, onlyShowPayElsewhere, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policy = (0, usePolicy_1.default)(policyID);
    const { accountID } = (0, useCurrentUserPersonalDetails_1.default)();
    // The app would crash due to subscribing to the entire report collection if chatReportID is an empty string. So we should have a fallback ID here.
    // eslint-disable-next-line rulesdir/no-default-id-values
    const [chatReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReportID || CONST_1.default.DEFAULT_NUMBER_ID}`, { canBeMissing: true });
    const policyEmployeeAccountIDs = (0, PolicyUtils_1.getPolicyEmployeeAccountIDs)(policy, accountID);
    const reportBelongsToWorkspace = policyID ? (0, ReportUtils_1.doesReportBelongToWorkspace)(chatReport, policyEmployeeAccountIDs, policyID) : false;
    const policyIDKey = reportBelongsToWorkspace ? policyID : CONST_1.default.POLICY.ID_FAKE;
    const [lastPaymentMethod, lastPaymentMethodResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD, {
        canBeMissing: true,
        selector: (paymentMethod) => {
            const paymentMethodType = paymentMethod?.[policyIDKey];
            if (typeof paymentMethodType === 'string') {
                return paymentMethodType;
            }
            if (typeof paymentMethodType?.lastUsed === 'string') {
                return paymentMethodType.lastUsed;
            }
            return paymentMethodType?.lastUsed.name;
        },
    });
    const isLoadingLastPaymentMethod = (0, isLoadingOnyxValue_1.default)(lastPaymentMethodResult);
    const [bankAccountList = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: true });
    const [fundList = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FUND_LIST, { canBeMissing: true });
    const lastPaymentMethodRef = (0, react_1.useRef)(lastPaymentMethod);
    (0, react_1.useEffect)(() => {
        if (isLoadingLastPaymentMethod) {
            return;
        }
        lastPaymentMethodRef.current = lastPaymentMethod;
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isLoadingLastPaymentMethod]);
    const isInvoiceReport = (!(0, EmptyObject_1.isEmptyObject)(iouReport) && (0, ReportUtils_1.isInvoiceReport)(iouReport)) || false;
    const shouldShowPayWithExpensifyOption = !shouldHidePaymentOptions;
    const shouldShowPayElsewhereOption = !shouldHidePaymentOptions && !isInvoiceReport;
    const paymentButtonOptions = (0, react_1.useMemo)(() => {
        const buttonOptions = [];
        const isExpenseReport = (0, ReportUtils_1.isExpenseReport)(iouReport);
        const paymentMethods = {
            [CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY]: {
                text: translate('iou.settleExpensify', { formattedAmount }),
                icon: Expensicons.Wallet,
                value: CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY,
            },
            [CONST_1.default.IOU.PAYMENT_TYPE.VBBA]: {
                text: translate('iou.settleExpensify', { formattedAmount }),
                icon: Expensicons.Wallet,
                value: CONST_1.default.IOU.PAYMENT_TYPE.VBBA,
            },
            [CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE]: {
                text: translate('iou.payElsewhere', { formattedAmount }),
                icon: Expensicons.Cash,
                value: CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE,
            },
        };
        const approveButtonOption = {
            text: translate('iou.approve', { formattedAmount }),
            icon: Expensicons.ThumbsUp,
            value: CONST_1.default.IOU.REPORT_ACTION_TYPE.APPROVE,
            disabled: !!shouldDisableApproveButton,
        };
        const canUseWallet = !isExpenseReport && !isInvoiceReport && currency === CONST_1.default.CURRENCY.USD;
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
            const formattedPaymentMethods = (0, PaymentUtils_1.formatPaymentMethods)(bankAccountList, fundList, styles);
            const isCurrencySupported = (0, Policy_1.isCurrencySupportedForDirectReimbursement)(currency);
            const getPaymentSubitems = (payAsBusiness) => formattedPaymentMethods.map((formattedPaymentMethod) => ({
                text: formattedPaymentMethod?.title ?? '',
                description: formattedPaymentMethod?.description ?? '',
                icon: formattedPaymentMethod?.icon,
                onSelected: () => onPress(CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY, payAsBusiness, formattedPaymentMethod.methodID, formattedPaymentMethod.accountType),
                iconStyles: formattedPaymentMethod?.iconStyles,
                iconHeight: formattedPaymentMethod?.iconSize,
                iconWidth: formattedPaymentMethod?.iconSize,
            }));
            if ((0, ReportUtils_1.isIndividualInvoiceRoom)(chatReport)) {
                buttonOptions.push({
                    text: translate('iou.settlePersonal', { formattedAmount }),
                    icon: Expensicons.User,
                    value: CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE,
                    backButtonText: translate('iou.individual'),
                    subMenuItems: [
                        ...(isCurrencySupported ? getPaymentSubitems(false) : []),
                        {
                            text: translate('iou.payElsewhere', { formattedAmount: '' }),
                            icon: Expensicons.Cash,
                            value: CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE,
                            onSelected: () => onPress(CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE),
                        },
                        {
                            text: translate('bankAccount.addBankAccount'),
                            icon: Expensicons.Bank,
                            onSelected: () => {
                                const bankAccountRoute = (0, ReportUtils_1.getBankAccountRoute)(chatReport);
                                Navigation_1.default.navigate(bankAccountRoute);
                            },
                        },
                    ],
                });
            }
            buttonOptions.push({
                text: translate('iou.settleBusiness', { formattedAmount }),
                icon: Expensicons.Building,
                value: CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE,
                backButtonText: translate('iou.business'),
                subMenuItems: [
                    ...(isCurrencySupported ? getPaymentSubitems(true) : []),
                    {
                        text: translate('bankAccount.addBankAccount'),
                        icon: Expensicons.Bank,
                        onSelected: () => {
                            const bankAccountRoute = (0, ReportUtils_1.getBankAccountRoute)(chatReport);
                            Navigation_1.default.navigate(bankAccountRoute);
                        },
                    },
                    {
                        text: translate('iou.payElsewhere', { formattedAmount: '' }),
                        icon: Expensicons.Cash,
                        value: CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE,
                        onSelected: () => onPress(CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE, true),
                    },
                ],
            });
        }
        if (shouldShowApproveButton) {
            buttonOptions.push(approveButtonOption);
        }
        // Put the preferred payment method to the front of the array, so it's shown as default. We assume their last payment method is their preferred.
        if (lastPaymentMethodRef.current) {
            return buttonOptions.sort((method) => (method.value === lastPaymentMethod ? -1 : 0));
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
