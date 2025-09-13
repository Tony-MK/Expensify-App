"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isEmpty_1 = require("lodash/isEmpty");
const truncate_1 = require("lodash/truncate");
const react_1 = require("react");
const ButtonWithDropdownMenu_1 = require("@components/ButtonWithDropdownMenu");
const Expensicons = require("@components/Icon/Expensicons");
const Expensicons_1 = require("@components/Icon/Expensicons");
const KYCWall_1 = require("@components/KYCWall");
const LockedAccountModalProvider_1 = require("@components/LockedAccountModalProvider");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Policy_1 = require("@libs/actions/Policy/Policy");
const Search_1 = require("@libs/actions/Search");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PaymentUtils_1 = require("@libs/PaymentUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const BankAccounts_1 = require("@userActions/BankAccounts");
const IOU_1 = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function SettlementButton({ addDebitCardRoute = ROUTES_1.default.IOU_SEND_ADD_DEBIT_CARD, kycWallAnchorAlignment = {
    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT, // button is at left, so horizontal anchor is at LEFT
    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP, // we assume that popover menu opens below the button, anchor is at TOP
}, paymentMethodDropdownAnchorAlignment = {
    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT, // caret for dropdown is at right, so horizontal anchor is at RIGHT
    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP, // we assume that popover menu opens below the button, anchor is at TOP
}, buttonSize = CONST_1.default.DROPDOWN_BUTTON_SIZE.MEDIUM, chatReportID = '', currency = CONST_1.default.CURRENCY.USD, enablePaymentsRoute, iouReport, isDisabled = false, isLoading = false, formattedAmount = '', onPress, pressOnEnter = false, policyID = '-1', shouldHidePaymentOptions = false, shouldShowApproveButton = false, shouldDisableApproveButton = false, style, disabledStyle, shouldShowPersonalBankAccountOption = false, enterKeyEventListenerPriority = 0, confirmApproval, useKeyboardShortcuts = false, onPaymentOptionsShow, onPaymentOptionsHide, onlyShowPayElsewhere, wrapperStyle, shouldUseShortForm = false, hasOnlyHeldExpenses = false, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const policy = (0, usePolicy_1.default)(policyID);
    const { accountID } = (0, useCurrentUserPersonalDetails_1.default)();
    // The app would crash due to subscribing to the entire report collection if chatReportID is an empty string. So we should have a fallback ID here.
    // eslint-disable-next-line rulesdir/no-default-id-values
    const [chatReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReportID || CONST_1.default.DEFAULT_NUMBER_ID}`, { canBeMissing: true });
    const [isUserValidated] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { selector: (account) => account?.validated, canBeMissing: true });
    const policyEmployeeAccountIDs = (0, PolicyUtils_1.getPolicyEmployeeAccountIDs)(policy, accountID);
    const reportBelongsToWorkspace = policyID ? (0, ReportUtils_1.doesReportBelongToWorkspace)(chatReport, policyEmployeeAccountIDs, policyID) : false;
    const policyIDKey = reportBelongsToWorkspace ? policyID : (iouReport?.policyID ?? CONST_1.default.POLICY.ID_FAKE);
    const [userWallet] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET, { canBeMissing: true });
    const hasActivatedWallet = [CONST_1.default.WALLET.TIER_NAME.GOLD, CONST_1.default.WALLET.TIER_NAME.PLATINUM].includes(userWallet?.tierName ?? '');
    const [lastPaymentMethods, lastPaymentMethodResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD, { canBeMissing: true });
    const lastPaymentMethod = (0, react_1.useMemo)(() => {
        if (!iouReport?.type) {
            return;
        }
        return (0, Search_1.getLastPolicyPaymentMethod)(policyIDKey, lastPaymentMethods, iouReport?.type, (0, ReportUtils_1.isIOUReport)(iouReport));
    }, [policyIDKey, iouReport, lastPaymentMethods]);
    const lastBankAccountID = (0, Search_1.getLastPolicyBankAccountID)(policyIDKey, lastPaymentMethods, iouReport?.type);
    const [fundList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FUND_LIST, { canBeMissing: true });
    const [policies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const activeAdminPolicies = (0, PolicyUtils_1.getActiveAdminWorkspaces)(policies, accountID.toString()).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    const reportID = iouReport?.reportID;
    const hasPreferredPaymentMethod = !!lastPaymentMethod;
    const isLoadingLastPaymentMethod = (0, isLoadingOnyxValue_1.default)(lastPaymentMethodResult);
    const lastPaymentPolicy = (0, usePolicy_1.default)(lastPaymentMethod);
    const [bankAccountList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: true });
    const bankAccount = bankAccountList?.[lastBankAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID];
    const isExpenseReport = (0, ReportUtils_1.isExpenseReport)(iouReport);
    // whether the user has single policy and the expense is p2p
    const hasSinglePolicy = !isExpenseReport && activeAdminPolicies.length === 1;
    const hasMultiplePolicies = !isExpenseReport && activeAdminPolicies.length > 1;
    const lastPaymentMethodRef = (0, react_1.useRef)(lastPaymentMethod);
    const formattedPaymentMethods = (0, PaymentUtils_1.formatPaymentMethods)(bankAccountList ?? {}, fundList ?? {}, styles);
    const hasIntentToPay = ((formattedPaymentMethods.length === 1 && (0, ReportUtils_1.isIOUReport)(iouReport)) || !!policy?.achAccount) && !lastPaymentMethod;
    (0, react_1.useEffect)(() => {
        if (isLoadingLastPaymentMethod) {
            return;
        }
        lastPaymentMethodRef.current = lastPaymentMethod;
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isLoadingLastPaymentMethod]);
    const isInvoiceReport = (!(0, EmptyObject_1.isEmptyObject)(iouReport) && (0, ReportUtils_1.isInvoiceReport)(iouReport)) || false;
    const { isAccountLocked, showLockedAccountModal } = (0, react_1.useContext)(LockedAccountModalProvider_1.LockedAccountContext);
    const shouldShowPayWithExpensifyOption = !shouldHidePaymentOptions;
    const shouldShowPayElsewhereOption = !shouldHidePaymentOptions && !isInvoiceReport;
    function getLatestBankAccountItem() {
        if (!policy?.achAccount?.bankAccountID) {
            return;
        }
        const policyBankAccounts = formattedPaymentMethods.filter((method) => method.methodID === policy?.achAccount?.bankAccountID);
        return policyBankAccounts.map((formattedPaymentMethod) => {
            const { icon, title, description, methodID } = formattedPaymentMethod ?? {};
            return {
                text: title ?? '',
                description: description ?? '',
                icon: typeof icon === 'number' ? Expensicons_1.Bank : icon,
                onSelected: () => onPress(CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY, true, undefined),
                methodID,
                value: CONST_1.default.PAYMENT_METHODS.BUSINESS_BANK_ACCOUNT,
            };
        });
    }
    function getLatestPersonalBankAccount() {
        return formattedPaymentMethods.filter((ba) => ba.accountData?.type === CONST_1.default.BANK_ACCOUNT.TYPE.PERSONAL);
    }
    const personalBankAccountList = getLatestPersonalBankAccount();
    const latestBankItem = getLatestBankAccountItem();
    const paymentButtonOptions = (0, react_1.useMemo)(() => {
        const buttonOptions = [];
        const paymentMethods = {
            [CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT]: {
                text: hasActivatedWallet ? translate('iou.settleWallet', { formattedAmount: '' }) : translate('iou.settlePersonal', { formattedAmount: '' }),
                icon: Expensicons.User,
                value: CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT,
                shouldUpdateSelectedIndex: false,
            },
            [CONST_1.default.PAYMENT_METHODS.BUSINESS_BANK_ACCOUNT]: {
                text: translate('iou.settleBusiness', { formattedAmount: '' }),
                icon: Expensicons.Building,
                value: CONST_1.default.PAYMENT_METHODS.BUSINESS_BANK_ACCOUNT,
                shouldUpdateSelectedIndex: false,
            },
            [CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE]: {
                text: translate('iou.payElsewhere', { formattedAmount: '' }),
                icon: Expensicons.CheckCircle,
                value: CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE,
                shouldUpdateSelectedIndex: false,
            },
        };
        const approveButtonOption = {
            text: translate('iou.approve', { formattedAmount }),
            icon: Expensicons.ThumbsUp,
            value: CONST_1.default.IOU.REPORT_ACTION_TYPE.APPROVE,
            disabled: !!shouldDisableApproveButton,
        };
        const canUseWallet = !isExpenseReport && !isInvoiceReport && currency === CONST_1.default.CURRENCY.USD;
        const canUseBusinessBankAccount = isExpenseReport || ((0, ReportUtils_1.isIOUReport)(iouReport) && reportID && !(0, ReportActionsUtils_1.hasRequestFromCurrentAccount)(reportID, accountID ?? CONST_1.default.DEFAULT_NUMBER_ID));
        const canUsePersonalBankAccount = shouldShowPersonalBankAccountOption || (0, ReportUtils_1.isIOUReport)(iouReport);
        const isPersonalOnlyOption = canUsePersonalBankAccount && !canUseBusinessBankAccount;
        // Only show the Approve button if the user cannot pay the expense
        if (shouldHidePaymentOptions && shouldShowApproveButton) {
            return [approveButtonOption];
        }
        if (onlyShowPayElsewhere) {
            return [paymentMethods[CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE]];
        }
        // To achieve the one tap pay experience we need to choose the correct payment type as default.
        if (canUseWallet) {
            if (personalBankAccountList.length && canUsePersonalBankAccount) {
                buttonOptions.push({
                    text: translate('iou.settleWallet', { formattedAmount: '' }),
                    value: CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT,
                    icon: Expensicons.Wallet,
                });
            }
            else if (canUsePersonalBankAccount) {
                buttonOptions.push(paymentMethods[CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT]);
            }
            if (activeAdminPolicies.length === 0 && !isPersonalOnlyOption) {
                buttonOptions.push(paymentMethods[CONST_1.default.PAYMENT_METHODS.BUSINESS_BANK_ACCOUNT]);
            }
        }
        const shouldShowBusinessBankAccountOptions = isExpenseReport && shouldShowPayWithExpensifyOption && !isPersonalOnlyOption;
        if (shouldShowBusinessBankAccountOptions) {
            if (!(0, isEmpty_1.default)(latestBankItem) && latestBankItem) {
                buttonOptions.push({
                    text: latestBankItem.at(0)?.text ?? '',
                    icon: latestBankItem.at(0)?.icon,
                    value: CONST_1.default.PAYMENT_METHODS.BUSINESS_BANK_ACCOUNT,
                    description: latestBankItem.at(0)?.description,
                });
            }
            else {
                buttonOptions.push(paymentMethods[CONST_1.default.PAYMENT_METHODS.BUSINESS_BANK_ACCOUNT]);
            }
        }
        if ((hasMultiplePolicies || hasSinglePolicy) && canUseWallet && !isPersonalOnlyOption) {
            activeAdminPolicies.forEach((activePolicy) => {
                const policyName = activePolicy.name;
                buttonOptions.push({
                    text: translate('iou.payWithPolicy', { policyName: (0, truncate_1.default)(policyName, { length: CONST_1.default.ADDITIONAL_ALLOWED_CHARACTERS }), formattedAmount: '' }),
                    icon: Expensicons.Building,
                    value: activePolicy.id,
                    shouldUpdateSelectedIndex: false,
                });
            });
        }
        if (shouldShowPayElsewhereOption) {
            buttonOptions.push({
                ...paymentMethods[CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE],
                ...(!buttonOptions.length && shouldUseShortForm ? { text: translate('iou.pay') } : {}),
            });
        }
        if (isInvoiceReport) {
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
        latestBankItem,
        activeAdminPolicies,
        latestBankItem,
    ]);
    const selectPaymentType = (event, iouPaymentType) => {
        if (policy && (0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(policy.id)) {
            Navigation_1.default.navigate(ROUTES_1.default.RESTRICTED_ACTION.getRoute(policy.id));
            return;
        }
        if (iouPaymentType === CONST_1.default.IOU.REPORT_ACTION_TYPE.APPROVE) {
            if (confirmApproval) {
                confirmApproval();
            }
            else {
                (0, IOU_1.approveMoneyRequest)(iouReport);
            }
            return;
        }
        onPress(iouPaymentType, false);
    };
    const selectPaymentMethod = (event, triggerKYCFlow, paymentMethod, selectedPolicy) => {
        if (!isUserValidated) {
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_CONTACT_METHOD_VERIFY_ACCOUNT.getRoute(Navigation_1.default.getActiveRoute()));
            return;
        }
        if (policy && (0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(policy.id)) {
            Navigation_1.default.navigate(ROUTES_1.default.RESTRICTED_ACTION.getRoute(policy.id));
            return;
        }
        let paymentType;
        switch (paymentMethod) {
            case CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT:
                paymentType = CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY;
                break;
            case CONST_1.default.PAYMENT_METHODS.BUSINESS_BANK_ACCOUNT:
                paymentType = CONST_1.default.IOU.PAYMENT_TYPE.VBBA;
                break;
            default:
                paymentType = CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE;
        }
        triggerKYCFlow(event, paymentType, paymentMethod, selectedPolicy ?? (event ? lastPaymentPolicy : undefined));
        if (paymentType === CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY || paymentType === CONST_1.default.IOU.PAYMENT_TYPE.VBBA) {
            (0, BankAccounts_1.setPersonalBankAccountContinueKYCOnSuccess)(ROUTES_1.default.ENABLE_PAYMENTS);
        }
    };
    const getCustomText = () => {
        if (shouldUseShortForm) {
            return translate('iou.pay');
        }
        if (lastPaymentMethod === CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE && !isInvoiceReport) {
            return translate('iou.payElsewhere', { formattedAmount });
        }
        return translate('iou.settlePayment', { formattedAmount });
    };
    const getSecondaryText = () => {
        if (shouldUseShortForm ||
            isInvoiceReport ||
            lastPaymentMethod === CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE ||
            (paymentButtonOptions.length === 1 && paymentButtonOptions.every((option) => option.value === CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE)) ||
            (shouldHidePaymentOptions && (shouldShowApproveButton || onlyShowPayElsewhere))) {
            return undefined;
        }
        if (lastPaymentPolicy) {
            return lastPaymentPolicy.name;
        }
        const bankAccountToDisplay = hasIntentToPay ? formattedPaymentMethods.at(0) : bankAccount;
        if (lastPaymentMethod === CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY || (hasIntentToPay && (0, ReportUtils_1.isInvoiceReport)(iouReport))) {
            if (!personalBankAccountList.length) {
                return;
            }
            return translate('common.wallet');
        }
        if ((lastPaymentMethod === CONST_1.default.IOU.PAYMENT_TYPE.VBBA || hasIntentToPay) && !!policy?.achAccount) {
            if (policy?.achAccount?.accountNumber) {
                return translate('paymentMethodList.bankAccountLastFour', { lastFour: policy?.achAccount?.accountNumber?.slice(-4) });
            }
            if (!bankAccountToDisplay?.accountData?.accountNumber) {
                return;
            }
            return translate('paymentMethodList.bankAccountLastFour', { lastFour: bankAccountToDisplay?.accountData?.accountNumber?.slice(-4) });
        }
        if (bankAccount?.accountData?.type === CONST_1.default.BANK_ACCOUNT.TYPE.BUSINESS && (0, ReportUtils_1.isExpenseReport)(iouReport)) {
            return translate('paymentMethodList.bankAccountLastFour', { lastFour: bankAccount?.accountData?.accountNumber?.slice(-4) ?? '' });
        }
        return undefined;
    };
    const handlePaymentSelection = (event, selectedOption, triggerKYCFlow) => {
        if (isAccountLocked) {
            showLockedAccountModal();
            return;
        }
        const isPaymentMethod = Object.values(CONST_1.default.PAYMENT_METHODS).includes(selectedOption);
        const shouldSelectPaymentMethod = (isPaymentMethod ?? lastPaymentPolicy ?? !(0, isEmpty_1.default)(latestBankItem)) && !shouldShowApproveButton && !shouldHidePaymentOptions;
        const selectedPolicy = activeAdminPolicies.find((activePolicy) => activePolicy.id === selectedOption);
        if (!!selectedPolicy || shouldSelectPaymentMethod) {
            selectPaymentMethod(event, triggerKYCFlow, selectedOption, selectedPolicy);
            return;
        }
        selectPaymentType(event, selectedOption);
    };
    const customText = getCustomText();
    const secondaryText = (0, truncate_1.default)(getSecondaryText(), { length: CONST_1.default.FORM_CHARACTER_LIMIT });
    const defaultSelectedIndex = paymentButtonOptions.findIndex((paymentOption) => {
        if (lastPaymentMethod === CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE) {
            return paymentOption.value === CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE;
        }
        if (latestBankItem?.length) {
            return paymentOption.value === latestBankItem.at(0)?.value;
        }
        if (lastPaymentPolicy?.id) {
            return paymentOption.value === lastPaymentPolicy.id;
        }
        return false;
    });
    const shouldUseSplitButton = hasPreferredPaymentMethod || !!lastPaymentPolicy || ((0, ReportUtils_1.isExpenseReport)(iouReport) && hasIntentToPay);
    const shouldLimitWidth = shouldUseShortForm && shouldUseSplitButton && !paymentButtonOptions.length;
    return (<KYCWall_1.default onSuccessfulKYC={(paymentType) => onPress(paymentType, undefined, undefined)} enablePaymentsRoute={enablePaymentsRoute} addDebitCardRoute={addDebitCardRoute} isDisabled={isOffline} source={CONST_1.default.KYC_WALL_SOURCE.REPORT} chatReportID={chatReportID} addBankAccountRoute={isExpenseReport ? ROUTES_1.default.BANK_ACCOUNT_WITH_STEP_TO_OPEN.getRoute(iouReport?.policyID, undefined, Navigation_1.default.getActiveRoute()) : undefined} iouReport={iouReport} policy={lastPaymentPolicy} anchorAlignment={kycWallAnchorAlignment} shouldShowPersonalBankAccountOption={shouldShowPersonalBankAccountOption}>
            {(triggerKYCFlow, buttonRef) => (<ButtonWithDropdownMenu_1.default onOptionsMenuShow={onPaymentOptionsShow} onOptionsMenuHide={onPaymentOptionsHide} buttonRef={buttonRef} shouldAlwaysShowDropdownMenu={isInvoiceReport && !onlyShowPayElsewhere} customText={customText} menuHeaderText={isInvoiceReport ? translate('workspace.invoices.paymentMethods.chooseInvoiceMethod') : undefined} isSplitButton={shouldUseSplitButton && !isInvoiceReport} isDisabled={isDisabled} isLoading={isLoading} defaultSelectedIndex={defaultSelectedIndex !== -1 ? defaultSelectedIndex : 0} onPress={(event, iouPaymentType) => handlePaymentSelection(event, iouPaymentType, triggerKYCFlow)} success={!hasOnlyHeldExpenses} secondLineText={secondaryText} pressOnEnter={pressOnEnter} options={paymentButtonOptions} onOptionSelected={(option) => {
                if (paymentButtonOptions.length === 1) {
                    return;
                }
                handlePaymentSelection(undefined, option.value, triggerKYCFlow);
            }} style={style} shouldUseShortForm={shouldUseShortForm} shouldPopoverUseScrollView={paymentButtonOptions.length > 5} containerStyles={paymentButtonOptions.length > 5 ? styles.settlementButtonListContainer : {}} wrapperStyle={[wrapperStyle, shouldLimitWidth ? styles.settlementButtonShortFormWidth : {}]} disabledStyle={disabledStyle} buttonSize={buttonSize} anchorAlignment={paymentMethodDropdownAnchorAlignment} enterKeyEventListenerPriority={enterKeyEventListenerPriority} useKeyboardShortcuts={useKeyboardShortcuts} shouldUseModalPaddingStyle={paymentButtonOptions.length <= 5}/>)}
        </KYCWall_1.default>);
}
SettlementButton.displayName = 'SettlementButton';
exports.default = SettlementButton;
