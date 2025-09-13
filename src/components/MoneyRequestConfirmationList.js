"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const fast_equals_1 = require("fast-equals");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useMouseContext_1 = require("@hooks/useMouseContext");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const usePrevious_1 = require("@hooks/usePrevious");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const blurActiveElement_1 = require("@libs/Accessibility/blurActiveElement");
const IOU_1 = require("@libs/actions/IOU");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const DistanceRequestUtils_1 = require("@libs/DistanceRequestUtils");
const IOUUtils_1 = require("@libs/IOUUtils");
const Log_1 = require("@libs/Log");
const MoneyRequestUtils_1 = require("@libs/MoneyRequestUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const Button_1 = require("./Button");
const ButtonWithDropdownMenu_1 = require("./ButtonWithDropdownMenu");
const DelegateNoAccessModalProvider_1 = require("./DelegateNoAccessModalProvider");
const FormHelpMessage_1 = require("./FormHelpMessage");
const MoneyRequestAmountInput_1 = require("./MoneyRequestAmountInput");
const MoneyRequestConfirmationListFooter_1 = require("./MoneyRequestConfirmationListFooter");
const Pressable_1 = require("./Pressable");
const ProductTrainingContext_1 = require("./ProductTrainingContext");
const SelectionList_1 = require("./SelectionList");
const UserListItem_1 = require("./SelectionList/UserListItem");
const SettlementButton_1 = require("./SettlementButton");
const Text_1 = require("./Text");
const EducationalTooltip_1 = require("./Tooltip/EducationalTooltip");
function MoneyRequestConfirmationList({ transaction, onSendMoney, onConfirm, iouType = CONST_1.default.IOU.TYPE.SUBMIT, iouAmount, isDistanceRequest, isManualDistanceRequest, isPerDiemRequest = false, isPolicyExpenseChat = false, iouCategory = '', shouldShowSmartScanFields = true, isEditingSplitBill, iouCurrencyCode, isReceiptEditable, iouMerchant, selectedParticipants: selectedParticipantsProp, payeePersonalDetails: payeePersonalDetailsProp, isReadOnly = false, policyID, reportID = '', receiptPath = '', iouAttendees, iouComment, receiptFilename = '', iouCreated, iouIsBillable = false, onToggleBillable, hasSmartScanFailed, reportActionID, action = CONST_1.default.IOU.ACTION.CREATE, shouldDisplayReceipt = false, expensesNumber = 0, isConfirmed, isConfirming, onPDFLoadError, onPDFPassword, iouIsReimbursable = true, onToggleReimbursable, showRemoveExpenseConfirmModal, }) {
    const [policyCategoriesReal] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${policyID}`, { canBeMissing: true });
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`, { canBeMissing: true });
    const [policyReal] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: true });
    const [policyDraft] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_DRAFTS}${policyID}`, { canBeMissing: true });
    const [defaultMileageRate] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_DRAFTS}${policyID}`, {
        selector: (selectedPolicy) => DistanceRequestUtils_1.default.getDefaultMileageRate(selectedPolicy),
        canBeMissing: true,
    });
    const [policyCategoriesDraft] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES_DRAFT}${policyID}`, { canBeMissing: true });
    const [lastSelectedDistanceRates] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_SELECTED_DISTANCE_RATES, { canBeMissing: true });
    const [currencyList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CURRENCY_LIST, { canBeMissing: false });
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const { isDelegateAccessRestricted, showDelegateNoAccessModal } = (0, react_1.useContext)(DelegateNoAccessModalProvider_1.DelegateNoAccessContext);
    const isTestReceipt = (0, react_1.useMemo)(() => {
        return transaction?.receipt?.isTestReceipt ?? false;
    }, [transaction?.receipt?.isTestReceipt]);
    const isTestDriveReceipt = (0, react_1.useMemo)(() => {
        return transaction?.receipt?.isTestDriveReceipt ?? false;
    }, [transaction?.receipt?.isTestDriveReceipt]);
    const isManagerMcTestReceipt = (0, react_1.useMemo)(() => {
        return isBetaEnabled(CONST_1.default.BETAS.NEWDOT_MANAGER_MCTEST) && selectedParticipantsProp.some((participant) => (0, ReportUtils_1.isSelectedManagerMcTest)(participant.login));
    }, [isBetaEnabled, selectedParticipantsProp]);
    const { shouldShowProductTrainingTooltip, renderProductTrainingTooltip } = (0, ProductTrainingContext_1.useProductTrainingContext)(isTestDriveReceipt ? CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_DRIVE_CONFIRMATION : CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.SCAN_TEST_CONFIRMATION, isTestDriveReceipt || isManagerMcTestReceipt);
    const policy = policyReal ?? policyDraft;
    const policyCategories = policyCategoriesReal ?? policyCategoriesDraft;
    const styles = (0, useThemeStyles_1.default)();
    const { translate, toLocaleDigit } = (0, useLocalize_1.default)();
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const isTypeRequest = iouType === CONST_1.default.IOU.TYPE.SUBMIT;
    const isTypeSplit = iouType === CONST_1.default.IOU.TYPE.SPLIT;
    const isTypeSend = iouType === CONST_1.default.IOU.TYPE.PAY;
    const isTypeTrackExpense = iouType === CONST_1.default.IOU.TYPE.TRACK;
    const isTypeInvoice = iouType === CONST_1.default.IOU.TYPE.INVOICE;
    const isScanRequest = (0, react_1.useMemo)(() => (0, TransactionUtils_1.isScanRequest)(transaction), [transaction]);
    const isCreateExpenseFlow = !!transaction?.isFromGlobalCreate && !isPerDiemRequest;
    const isCustomUnitRateIDForP2P = (0, TransactionUtils_1.isCustomUnitRateIDForP2P)(transaction);
    const transactionID = transaction?.transactionID;
    const customUnitRateID = (0, TransactionUtils_1.getRateID)(transaction);
    const subRates = transaction?.comment?.customUnit?.subRates ?? [];
    (0, react_1.useEffect)(() => {
        if (customUnitRateID !== '-1' || !isDistanceRequest || !transactionID || !policy?.id) {
            return;
        }
        const defaultRate = defaultMileageRate?.customUnitRateID;
        const lastSelectedRate = lastSelectedDistanceRates?.[policy.id] ?? defaultRate;
        const rateID = lastSelectedRate;
        if (!rateID) {
            return;
        }
        (0, IOU_1.setCustomUnitRateID)(transactionID, rateID);
    }, [defaultMileageRate, customUnitRateID, lastSelectedDistanceRates, policy?.id, transactionID, isDistanceRequest]);
    const mileageRate = DistanceRequestUtils_1.default.getRate({ transaction, policy, policyDraft });
    const rate = mileageRate.rate;
    const prevRate = (0, usePrevious_1.default)(rate);
    const unit = mileageRate.unit;
    const prevUnit = (0, usePrevious_1.default)(unit);
    const currency = mileageRate.currency ?? CONST_1.default.CURRENCY.USD;
    const prevCurrency = (0, usePrevious_1.default)(currency);
    const prevSubRates = (0, usePrevious_1.default)(subRates);
    // A flag for showing the categories field
    const shouldShowCategories = (isPolicyExpenseChat || isTypeInvoice) && (!!iouCategory || (0, OptionsListUtils_1.hasEnabledOptions)(Object.values(policyCategories ?? {})));
    const shouldShowMerchant = shouldShowSmartScanFields && !isDistanceRequest && !isTypeSend && !isPerDiemRequest;
    const policyTagLists = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getTagLists)(policyTags), [policyTags]);
    const shouldShowTax = (0, PolicyUtils_1.isTaxTrackingEnabled)(isPolicyExpenseChat, policy, isDistanceRequest, isPerDiemRequest);
    const previousTransactionAmount = (0, usePrevious_1.default)(transaction?.amount);
    const previousTransactionCurrency = (0, usePrevious_1.default)(transaction?.currency);
    const previousTransactionModifiedCurrency = (0, usePrevious_1.default)(transaction?.modifiedCurrency);
    const previousCustomUnitRateID = (0, usePrevious_1.default)(customUnitRateID);
    (0, react_1.useEffect)(() => {
        // previousTransaction is in the condition because if it is falsy, it means this is the first time the useEffect is triggered after we load it, so we should calculate the default
        // tax even if the other parameters are the same against their previous values.
        if (!shouldShowTax ||
            !transaction ||
            !transactionID ||
            (transaction.taxCode &&
                previousTransactionModifiedCurrency === transaction.modifiedCurrency &&
                previousTransactionCurrency === transaction.currency &&
                previousCustomUnitRateID === customUnitRateID)) {
            return;
        }
        const defaultTaxCode = (0, TransactionUtils_1.getDefaultTaxCode)(policy, transaction);
        (0, IOU_1.setMoneyRequestTaxRate)(transactionID, defaultTaxCode ?? '');
    }, [customUnitRateID, policy, previousCustomUnitRateID, previousTransactionCurrency, previousTransactionModifiedCurrency, shouldShowTax, transaction, transactionID]);
    const isMovingTransactionFromTrackExpense = (0, IOUUtils_1.isMovingTransactionFromTrackExpense)(action);
    const distance = (0, TransactionUtils_1.getDistanceInMeters)(transaction, unit);
    const prevDistance = (0, usePrevious_1.default)(distance);
    const shouldCalculateDistanceAmount = isDistanceRequest && (iouAmount === 0 || prevRate !== rate || prevDistance !== distance || prevCurrency !== currency || prevUnit !== unit);
    const shouldCalculatePerDiemAmount = isPerDiemRequest && (iouAmount === 0 || JSON.stringify(prevSubRates) !== JSON.stringify(subRates) || prevCurrency !== currency);
    const hasRoute = (0, TransactionUtils_1.hasRoute)(transaction, isDistanceRequest);
    const isDistanceRequestWithPendingRoute = isDistanceRequest && (!hasRoute || !rate) && !isMovingTransactionFromTrackExpense;
    const distanceRequestAmount = DistanceRequestUtils_1.default.getDistanceRequestAmount(distance, unit ?? CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_MILES, rate ?? 0);
    let amountToBeUsed = iouAmount;
    if (shouldCalculateDistanceAmount) {
        amountToBeUsed = distanceRequestAmount;
    }
    else if (shouldCalculatePerDiemAmount) {
        const perDiemRequestAmount = (0, IOU_1.computePerDiemExpenseAmount)({ subRates });
        amountToBeUsed = perDiemRequestAmount;
    }
    const formattedAmount = isDistanceRequestWithPendingRoute ? '' : (0, CurrencyUtils_1.convertToDisplayString)(amountToBeUsed, isDistanceRequest ? currency : iouCurrencyCode);
    const formattedAmountPerAttendee = isDistanceRequestWithPendingRoute || isScanRequest
        ? ''
        : (0, CurrencyUtils_1.convertToDisplayString)(amountToBeUsed / (iouAttendees?.length && iouAttendees.length > 0 ? iouAttendees.length : 1), isDistanceRequest ? currency : iouCurrencyCode);
    const isFocused = (0, native_1.useIsFocused)();
    const [formError, debouncedFormError, setFormError] = (0, useDebouncedState_1.default)('');
    const [didConfirm, setDidConfirm] = (0, react_1.useState)(isConfirmed);
    const [didConfirmSplit, setDidConfirmSplit] = (0, react_1.useState)(false);
    // Clear the form error if it's set to one among the list passed as an argument
    const clearFormErrors = (0, react_1.useCallback)((errors) => {
        if (!errors.includes(formError)) {
            return;
        }
        setFormError('');
    }, [formError, setFormError]);
    const shouldDisplayFieldError = (0, react_1.useMemo)(() => {
        if (!isEditingSplitBill) {
            return false;
        }
        return (!!hasSmartScanFailed && (0, TransactionUtils_1.hasMissingSmartscanFields)(transaction)) || (didConfirmSplit && (0, TransactionUtils_1.areRequiredFieldsEmpty)(transaction));
    }, [isEditingSplitBill, hasSmartScanFailed, transaction, didConfirmSplit]);
    const isMerchantEmpty = (0, react_1.useMemo)(() => !iouMerchant || (0, TransactionUtils_1.isMerchantMissing)(transaction), [transaction, iouMerchant]);
    const isMerchantRequired = isPolicyExpenseChat && (!isScanRequest || isEditingSplitBill) && shouldShowMerchant;
    const isCategoryRequired = !!policy?.requiresCategory && !isTypeInvoice;
    (0, react_1.useEffect)(() => {
        if (shouldDisplayFieldError && didConfirmSplit) {
            setFormError('iou.error.genericSmartscanFailureMessage');
            return;
        }
        if (shouldDisplayFieldError && hasSmartScanFailed) {
            setFormError('iou.receiptScanningFailed');
            return;
        }
        // reset the form error whenever the screen gains or loses focus
        setFormError('');
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- we don't want this effect to run if it's just setFormError that changes
    }, [isFocused, transaction, shouldDisplayFieldError, hasSmartScanFailed, didConfirmSplit]);
    (0, react_1.useEffect)(() => {
        // We want this effect to run only when the transaction is moving from Self DM to a expense chat
        if (!transactionID || !isDistanceRequest || !isMovingTransactionFromTrackExpense || !isPolicyExpenseChat) {
            return;
        }
        const errorKey = 'iou.error.invalidRate';
        const policyRates = DistanceRequestUtils_1.default.getMileageRates(policy);
        // If the selected rate belongs to the policy, clear the error
        if (customUnitRateID && Object.keys(policyRates).includes(customUnitRateID)) {
            clearFormErrors([errorKey]);
            return;
        }
        // If there is a distance rate in the policy that matches the rate and unit of the currently selected mileage rate, select it automatically
        const matchingRate = Object.values(policyRates).find((policyRate) => policyRate.rate === mileageRate.rate && policyRate.unit === mileageRate.unit);
        if (matchingRate?.customUnitRateID) {
            (0, IOU_1.setCustomUnitRateID)(transactionID, matchingRate.customUnitRateID);
            return;
        }
        if (isCustomUnitRateIDForP2P && DistanceRequestUtils_1.default.getDefaultMileageRate(policy)) {
            const defaultMileageRatePolicy = DistanceRequestUtils_1.default.getDefaultMileageRate(policy);
            (0, IOU_1.setCustomUnitRateID)(transactionID, defaultMileageRatePolicy?.customUnitRateID);
            return;
        }
        // If none of the above conditions are met, display the rate error
        setFormError(errorKey);
    }, [
        isDistanceRequest,
        isPolicyExpenseChat,
        transactionID,
        mileageRate,
        customUnitRateID,
        policy,
        isMovingTransactionFromTrackExpense,
        setFormError,
        clearFormErrors,
        isCustomUnitRateIDForP2P,
    ]);
    const routeError = Object.values(transaction?.errorFields?.route ?? {}).at(0);
    const isFirstUpdatedDistanceAmount = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        if (isFirstUpdatedDistanceAmount.current) {
            return;
        }
        if (!isDistanceRequest || !transactionID) {
            return;
        }
        if (isReadOnly) {
            return;
        }
        const amount = DistanceRequestUtils_1.default.getDistanceRequestAmount(distance, unit ?? CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_MILES, rate ?? 0);
        (0, IOU_1.setMoneyRequestAmount)(transactionID, amount, currency ?? '');
        isFirstUpdatedDistanceAmount.current = true;
    }, [distance, rate, isReadOnly, unit, transactionID, currency, isDistanceRequest]);
    (0, react_1.useEffect)(() => {
        if (!shouldCalculateDistanceAmount || !transactionID || isReadOnly) {
            return;
        }
        const amount = distanceRequestAmount;
        (0, IOU_1.setMoneyRequestAmount)(transactionID, amount, currency ?? '');
        // If it's a split request among individuals, set the split shares
        const participantAccountIDs = selectedParticipantsProp.map((participant) => participant.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID);
        if (isTypeSplit && !isPolicyExpenseChat && amount && transaction?.currency) {
            (0, IOU_1.setSplitShares)(transaction, amount, currency, participantAccountIDs);
        }
    }, [shouldCalculateDistanceAmount, isReadOnly, distanceRequestAmount, transactionID, currency, isTypeSplit, isPolicyExpenseChat, selectedParticipantsProp, transaction]);
    const previousTaxCode = (0, usePrevious_1.default)(transaction?.taxCode);
    // Calculate and set tax amount in transaction draft
    (0, react_1.useEffect)(() => {
        if (!shouldShowTax ||
            !transaction ||
            (transaction.taxAmount !== undefined &&
                previousTransactionAmount === transaction.amount &&
                previousTransactionCurrency === transaction.currency &&
                previousCustomUnitRateID === customUnitRateID &&
                previousTaxCode === transaction.taxCode)) {
            return;
        }
        let taxableAmount;
        let taxCode;
        if (isDistanceRequest) {
            if (customUnitRateID) {
                const customUnitRate = (0, PolicyUtils_1.getDistanceRateCustomUnitRate)(policy, customUnitRateID);
                taxCode = customUnitRate?.attributes?.taxRateExternalID;
                taxableAmount = DistanceRequestUtils_1.default.getTaxableAmount(policy, customUnitRateID, distance);
            }
        }
        else {
            taxableAmount = transaction.amount ?? 0;
            taxCode = transaction.taxCode ?? (0, TransactionUtils_1.getDefaultTaxCode)(policy, transaction) ?? '';
        }
        if (taxCode && taxableAmount) {
            const taxPercentage = (0, TransactionUtils_1.getTaxValue)(policy, transaction, taxCode) ?? '';
            const taxAmount = (0, TransactionUtils_1.calculateTaxAmount)(taxPercentage, taxableAmount, transaction.currency);
            const taxAmountInSmallestCurrencyUnits = (0, CurrencyUtils_1.convertToBackendAmount)(Number.parseFloat(taxAmount.toString()));
            (0, IOU_1.setMoneyRequestTaxAmount)(transaction.transactionID, taxAmountInSmallestCurrencyUnits);
        }
    }, [
        policy,
        shouldShowTax,
        previousTransactionAmount,
        previousTransactionCurrency,
        transaction,
        isDistanceRequest,
        customUnitRateID,
        previousCustomUnitRateID,
        previousTaxCode,
        distance,
    ]);
    // If completing a split expense fails, set didConfirm to false to allow the user to edit the fields again
    if (isEditingSplitBill && didConfirm) {
        setDidConfirm(false);
    }
    (0, react_1.useEffect)(() => {
        setDidConfirm(isConfirmed);
    }, [isConfirmed]);
    const splitOrRequestOptions = (0, react_1.useMemo)(() => {
        let text;
        if (expensesNumber > 1) {
            text = translate('iou.createExpenses', { expensesNumber });
        }
        else if (isTypeInvoice) {
            if ((0, Policy_1.hasInvoicingDetails)(policy)) {
                text = translate('iou.sendInvoice', { amount: formattedAmount });
            }
            else {
                text = translate('common.next');
            }
        }
        else if (isTypeTrackExpense) {
            text = translate('iou.createExpense');
            if (iouAmount !== 0) {
                text = translate('iou.createExpenseWithAmount', { amount: formattedAmount });
            }
        }
        else if (isTypeSplit && iouAmount === 0) {
            text = translate('iou.splitExpense');
        }
        else if ((receiptPath && isTypeRequest) || isDistanceRequestWithPendingRoute || isPerDiemRequest) {
            text = translate('iou.createExpense');
            if (iouAmount !== 0) {
                text = translate('iou.createExpenseWithAmount', { amount: formattedAmount });
            }
        }
        else {
            const translationKey = isTypeSplit ? 'iou.splitAmount' : 'iou.createExpenseWithAmount';
            text = translate(translationKey, { amount: formattedAmount });
        }
        return [
            {
                text: text[0].toUpperCase() + text.slice(1),
                value: iouType,
            },
        ];
    }, [
        isTypeInvoice,
        isTypeTrackExpense,
        isTypeSplit,
        expensesNumber,
        iouAmount,
        receiptPath,
        isTypeRequest,
        isDistanceRequestWithPendingRoute,
        isPerDiemRequest,
        iouType,
        policy,
        translate,
        formattedAmount,
    ]);
    const onSplitShareChange = (0, react_1.useCallback)((accountID, value) => {
        if (!transaction?.transactionID) {
            return;
        }
        const amountInCents = (0, CurrencyUtils_1.convertToBackendAmount)(value);
        (0, IOU_1.setIndividualShare)(transaction?.transactionID, accountID, amountInCents);
    }, [transaction]);
    (0, react_1.useEffect)(() => {
        if (!isTypeSplit || !transaction?.splitShares) {
            return;
        }
        const splitSharesMap = transaction.splitShares;
        const shares = Object.values(splitSharesMap).map((splitShare) => splitShare?.amount ?? 0);
        const sumOfShares = shares?.reduce((prev, current) => prev + current, 0);
        if (sumOfShares !== iouAmount) {
            setFormError('iou.error.invalidSplit');
            return;
        }
        const participantsWithAmount = Object.keys(transaction?.splitShares ?? {})
            .filter((accountID) => (transaction?.splitShares?.[Number(accountID)]?.amount ?? 0) > 0)
            .map((accountID) => Number(accountID));
        // A split must have at least two participants with amounts bigger than 0
        if (participantsWithAmount.length === 1) {
            setFormError('iou.error.invalidSplitParticipants');
            return;
        }
        // Amounts should be bigger than 0 for the split bill creator (yourself)
        if (transaction?.splitShares[currentUserPersonalDetails.accountID] && (transaction.splitShares[currentUserPersonalDetails.accountID]?.amount ?? 0) === 0) {
            setFormError('iou.error.invalidSplitYourself');
            return;
        }
        setFormError('');
    }, [isFocused, transaction, isTypeSplit, transaction?.splitShares, currentUserPersonalDetails.accountID, iouAmount, iouCurrencyCode, setFormError, translate]);
    (0, react_1.useEffect)(() => {
        if (!isTypeSplit || !transaction?.splitShares) {
            return;
        }
        (0, IOU_1.adjustRemainingSplitShares)(transaction);
    }, [isTypeSplit, transaction]);
    const selectedParticipants = (0, react_1.useMemo)(() => selectedParticipantsProp.filter((participant) => participant.selected), [selectedParticipantsProp]);
    const payeePersonalDetails = (0, react_1.useMemo)(() => payeePersonalDetailsProp ?? currentUserPersonalDetails, [payeePersonalDetailsProp, currentUserPersonalDetails]);
    const shouldShowReadOnlySplits = (0, react_1.useMemo)(() => isPolicyExpenseChat || isReadOnly || isScanRequest, [isPolicyExpenseChat, isReadOnly, isScanRequest]);
    const splitParticipants = (0, react_1.useMemo)(() => {
        if (!isTypeSplit) {
            return [];
        }
        const payeeOption = (0, OptionsListUtils_1.getIOUConfirmationOptionsFromPayeePersonalDetail)(payeePersonalDetails);
        if (shouldShowReadOnlySplits) {
            return [payeeOption, ...selectedParticipants].map((participantOption) => {
                const isPayer = participantOption.accountID === payeeOption.accountID;
                let amount = 0;
                if (iouAmount > 0) {
                    amount =
                        transaction?.comment?.splits?.find((split) => split.accountID === participantOption.accountID)?.amount ??
                            (0, IOUUtils_1.calculateAmount)(selectedParticipants.length, iouAmount, iouCurrencyCode ?? '', isPayer);
                }
                return {
                    ...participantOption,
                    isSelected: false,
                    isInteractive: false,
                    rightElement: (<react_native_1.View style={[styles.flexWrap, styles.pl2]}>
                            <Text_1.default style={[styles.textLabel]}>{amount ? (0, CurrencyUtils_1.convertToDisplayString)(amount, iouCurrencyCode) : ''}</Text_1.default>
                        </react_native_1.View>),
                };
            });
        }
        const currencySymbol = currencyList?.[iouCurrencyCode ?? '']?.symbol ?? iouCurrencyCode;
        const formattedTotalAmount = (0, CurrencyUtils_1.convertToDisplayStringWithoutCurrency)(iouAmount, iouCurrencyCode);
        return [payeeOption, ...selectedParticipants].map((participantOption) => ({
            ...participantOption,
            tabIndex: -1,
            isSelected: false,
            isInteractive: false,
            rightElement: (<MoneyRequestAmountInput_1.default autoGrow={false} amount={transaction?.splitShares?.[participantOption.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID]?.amount} currency={iouCurrencyCode} prefixCharacter={currencySymbol} disableKeyboard={false} isCurrencyPressable={false} hideFocusedState={false} hideCurrencySymbol formatAmountOnBlur prefixContainerStyle={[styles.pv0, styles.h100]} prefixStyle={styles.lineHeightUndefined} inputStyle={[styles.optionRowAmountInput, styles.lineHeightUndefined]} containerStyle={[styles.textInputContainer, styles.pl2, styles.pr1]} touchableInputWrapperStyle={[styles.ml3]} onFormatAmount={CurrencyUtils_1.convertToDisplayStringWithoutCurrency} onAmountChange={(value) => onSplitShareChange(participantOption.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, Number(value))} maxLength={formattedTotalAmount.length + 1} contentWidth={(formattedTotalAmount.length + 1) * 8} shouldApplyPaddingToContainer shouldUseDefaultLineHeightForPrefix={false} shouldWrapInputInContainer={false}/>),
        }));
    }, [
        isTypeSplit,
        payeePersonalDetails,
        shouldShowReadOnlySplits,
        currencyList,
        iouCurrencyCode,
        iouAmount,
        selectedParticipants,
        styles.flexWrap,
        styles.pl2,
        styles.pr1,
        styles.h100,
        styles.textLabel,
        styles.pv0,
        styles.lineHeightUndefined,
        styles.optionRowAmountInput,
        styles.textInputContainer,
        styles.ml3,
        transaction?.comment?.splits,
        transaction?.splitShares,
        onSplitShareChange,
    ]);
    const isSplitModified = (0, react_1.useMemo)(() => {
        if (!transaction?.splitShares) {
            return;
        }
        return Object.keys(transaction.splitShares).some((key) => transaction.splitShares?.[Number(key) ?? -1]?.isModified);
    }, [transaction?.splitShares]);
    const getSplitSectionHeader = (0, react_1.useCallback)(() => (<react_native_1.View style={[styles.mt2, styles.mb1, styles.flexRow, styles.justifyContentBetween]}>
                <Text_1.default style={[styles.ph5, styles.textLabelSupporting]}>{translate('iou.participants')}</Text_1.default>
                {!shouldShowReadOnlySplits && !!isSplitModified && (<Pressable_1.PressableWithFeedback onPress={() => {
                (0, IOU_1.resetSplitShares)(transaction);
            }} accessibilityLabel={CONST_1.default.ROLE.BUTTON} role={CONST_1.default.ROLE.BUTTON} shouldUseAutoHitSlop>
                        <Text_1.default style={[styles.pr5, styles.textLabelSupporting, styles.link]}>{translate('common.reset')}</Text_1.default>
                    </Pressable_1.PressableWithFeedback>)}
            </react_native_1.View>), [
        isSplitModified,
        shouldShowReadOnlySplits,
        styles.flexRow,
        styles.justifyContentBetween,
        styles.link,
        styles.mb1,
        styles.mt2,
        styles.ph5,
        styles.pr5,
        styles.textLabelSupporting,
        transaction,
        translate,
    ]);
    const sections = (0, react_1.useMemo)(() => {
        const options = [];
        if (isTypeSplit) {
            options.push(...[
                {
                    title: translate('moneyRequestConfirmationList.paidBy'),
                    data: [(0, OptionsListUtils_1.getIOUConfirmationOptionsFromPayeePersonalDetail)(payeePersonalDetails)],
                    shouldShow: true,
                },
                {
                    CustomSectionHeader: getSplitSectionHeader,
                    data: splitParticipants,
                    shouldShow: true,
                },
            ]);
            options.push();
        }
        else {
            const formattedSelectedParticipants = selectedParticipants.map((participant) => ({
                ...participant,
                isSelected: false,
                isInteractive: isCreateExpenseFlow && !isTestReceipt,
                shouldShowRightIcon: isCreateExpenseFlow && !isTestReceipt,
            }));
            options.push({
                title: translate('common.to'),
                data: formattedSelectedParticipants,
                shouldShow: true,
            });
        }
        return options;
    }, [isTypeSplit, translate, payeePersonalDetails, getSplitSectionHeader, splitParticipants, selectedParticipants, isCreateExpenseFlow, isTestReceipt]);
    (0, react_1.useEffect)(() => {
        if (!isDistanceRequest || (isMovingTransactionFromTrackExpense && !isPolicyExpenseChat) || !transactionID || isReadOnly) {
            // We don't want to recalculate the distance merchant when moving a transaction from Track Expense to a 1:1 chat, because the distance rate will be the same default P2P rate.
            // When moving to a policy chat (e.g. sharing with an accountant), we should recalculate the distance merchant with the policy's rate.
            return;
        }
        /*
         Set pending waypoints based on the route status. We should handle this dynamically to cover cases such as:
         When the user completes the initial steps of the IOU flow offline and then goes online on the confirmation page.
         In this scenario, the route will be fetched from the server, and the waypoints will no longer be pending.
        */
        (0, IOU_1.setMoneyRequestPendingFields)(transactionID, { waypoints: isDistanceRequestWithPendingRoute ? CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD : null });
        const distanceMerchant = DistanceRequestUtils_1.default.getDistanceMerchant(hasRoute, distance, unit, rate ?? 0, currency ?? CONST_1.default.CURRENCY.USD, translate, toLocaleDigit);
        (0, IOU_1.setMoneyRequestMerchant)(transactionID, distanceMerchant, true);
    }, [
        isDistanceRequestWithPendingRoute,
        hasRoute,
        distance,
        unit,
        rate,
        currency,
        translate,
        toLocaleDigit,
        isDistanceRequest,
        isPolicyExpenseChat,
        transaction,
        transactionID,
        action,
        isReadOnly,
        isMovingTransactionFromTrackExpense,
    ]);
    // Auto select the category if there is only one enabled category and it is required
    (0, react_1.useEffect)(() => {
        const enabledCategories = Object.values(policyCategories ?? {}).filter((category) => category.enabled);
        if (!transactionID || iouCategory || !shouldShowCategories || enabledCategories.length !== 1 || !isCategoryRequired) {
            return;
        }
        (0, IOU_1.setMoneyRequestCategory)(transactionID, enabledCategories.at(0)?.name ?? '', policy?.id);
        // Keep 'transaction' out to ensure that we auto select the option only once
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [shouldShowCategories, policyCategories, isCategoryRequired, policy?.id]);
    // Auto select the tag if there is only one enabled tag and it is required
    (0, react_1.useEffect)(() => {
        if (!transactionID) {
            return;
        }
        let updatedTagsString = (0, TransactionUtils_1.getTag)(transaction);
        policyTagLists.forEach((tagList, index) => {
            const isTagListRequired = tagList.required ?? false;
            if (!isTagListRequired) {
                return;
            }
            const enabledTags = Object.values(tagList.tags).filter((tag) => tag.enabled);
            if (enabledTags.length !== 1 || (0, TransactionUtils_1.getTag)(transaction, index)) {
                return;
            }
            updatedTagsString = (0, IOUUtils_1.insertTagIntoTransactionTagsString)(updatedTagsString, enabledTags.at(0)?.name ?? '', index, policy?.hasMultipleTagLists ?? false);
        });
        if (updatedTagsString !== (0, TransactionUtils_1.getTag)(transaction) && updatedTagsString) {
            (0, IOU_1.setMoneyRequestTag)(transactionID, updatedTagsString);
        }
        // Keep 'transaction' out to ensure that we auto select the option only once
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [transactionID, policyTagLists, policyTags]);
    /**
     * Navigate to the participant step
     */
    const navigateToParticipantPage = () => {
        if (!isCreateExpenseFlow) {
            return;
        }
        const newIOUType = iouType === CONST_1.default.IOU.TYPE.SUBMIT || iouType === CONST_1.default.IOU.TYPE.TRACK ? CONST_1.default.IOU.TYPE.CREATE : iouType;
        Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_PARTICIPANTS.getRoute(newIOUType, transactionID, transaction.reportID, Navigation_1.default.getActiveRoute()));
    };
    /**
     * @param {String} paymentMethod
     */
    const confirm = (0, react_1.useCallback)((paymentMethod) => {
        if (!!routeError || !transactionID) {
            return;
        }
        if (iouType === CONST_1.default.IOU.TYPE.INVOICE && !(0, Policy_1.hasInvoicingDetails)(policy)) {
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_COMPANY_INFO.getRoute(iouType, transactionID, reportID, Navigation_1.default.getActiveRoute()));
            return;
        }
        if (selectedParticipants.length === 0) {
            setFormError('iou.error.noParticipantSelected');
            return;
        }
        if (!isEditingSplitBill && isMerchantRequired && (isMerchantEmpty || (shouldDisplayFieldError && (0, TransactionUtils_1.isMerchantMissing)(transaction)))) {
            setFormError('iou.error.invalidMerchant');
            return;
        }
        if (iouCategory.length > CONST_1.default.API_TRANSACTION_CATEGORY_MAX_LENGTH) {
            setFormError('iou.error.invalidCategoryLength');
            return;
        }
        if ((0, TransactionUtils_1.getTag)(transaction).length > CONST_1.default.API_TRANSACTION_TAG_MAX_LENGTH) {
            setFormError('iou.error.invalidTagLength');
            return;
        }
        if (isPerDiemRequest && (transaction.comment?.customUnit?.subRates ?? []).length === 0) {
            setFormError('iou.error.invalidSubrateLength');
            return;
        }
        if (iouType !== CONST_1.default.IOU.TYPE.PAY) {
            // validate the amount for distance expenses
            const decimals = (0, CurrencyUtils_1.getCurrencyDecimals)(iouCurrencyCode);
            if (isDistanceRequest && !isDistanceRequestWithPendingRoute && !(0, MoneyRequestUtils_1.validateAmount)(String(iouAmount), decimals, CONST_1.default.IOU.DISTANCE_REQUEST_AMOUNT_MAX_LENGTH)) {
                setFormError('common.error.invalidAmount');
                return;
            }
            if (isEditingSplitBill && (0, TransactionUtils_1.areRequiredFieldsEmpty)(transaction)) {
                setDidConfirmSplit(true);
                setFormError('iou.error.genericSmartscanFailureMessage');
                return;
            }
            if (formError) {
                return;
            }
            onConfirm?.(selectedParticipants);
        }
        else {
            if (!paymentMethod) {
                return;
            }
            if (isDelegateAccessRestricted) {
                showDelegateNoAccessModal();
                return;
            }
            if (formError) {
                return;
            }
            Log_1.default.info(`[IOU] Sending money via: ${paymentMethod}`);
            onSendMoney?.(paymentMethod);
        }
    }, [
        selectedParticipants,
        isEditingSplitBill,
        isMerchantRequired,
        isMerchantEmpty,
        shouldDisplayFieldError,
        transaction,
        iouCategory.length,
        formError,
        iouType,
        setFormError,
        onSendMoney,
        iouCurrencyCode,
        isDistanceRequest,
        isPerDiemRequest,
        isDistanceRequestWithPendingRoute,
        iouAmount,
        onConfirm,
        transactionID,
        reportID,
        policy,
        routeError,
        isDelegateAccessRestricted,
        showDelegateNoAccessModal,
    ]);
    const focusTimeoutRef = (0, react_1.useRef)(null);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        focusTimeoutRef.current = setTimeout(() => {
            react_native_1.InteractionManager.runAfterInteractions(() => {
                (0, blurActiveElement_1.default)();
            });
        }, CONST_1.default.ANIMATED_TRANSITION);
        return () => focusTimeoutRef.current && clearTimeout(focusTimeoutRef.current);
    }, []));
    const errorMessage = (0, react_1.useMemo)(() => {
        if (routeError) {
            return routeError;
        }
        if (isTypeSplit && !shouldShowReadOnlySplits) {
            return debouncedFormError && translate(debouncedFormError);
        }
        return formError && translate(formError);
    }, [routeError, isTypeSplit, shouldShowReadOnlySplits, debouncedFormError, formError, translate]);
    const footerContent = (0, react_1.useMemo)(() => {
        if (isReadOnly) {
            return;
        }
        const shouldShowSettlementButton = iouType === CONST_1.default.IOU.TYPE.PAY;
        const button = shouldShowSettlementButton ? (<SettlementButton_1.default pressOnEnter onPress={confirm} enablePaymentsRoute={ROUTES_1.default.IOU_SEND_ENABLE_PAYMENTS} chatReportID={reportID} shouldShowPersonalBankAccountOption currency={iouCurrencyCode} policyID={policyID} buttonSize={CONST_1.default.DROPDOWN_BUTTON_SIZE.LARGE} kycWallAnchorAlignment={{
                horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
            }} paymentMethodDropdownAnchorAlignment={{
                horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
            }} enterKeyEventListenerPriority={1} useKeyboardShortcuts 
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        isLoading={isConfirmed || isConfirming}/>) : (<>
                {expensesNumber > 1 && (<Button_1.default large text={translate('iou.removeThisExpense')} onPress={showRemoveExpenseConfirmModal} style={styles.mb3}/>)}
                <ButtonWithDropdownMenu_1.default pressOnEnter onPress={(event, value) => confirm(value)} options={splitOrRequestOptions} buttonSize={CONST_1.default.DROPDOWN_BUTTON_SIZE.LARGE} enterKeyEventListenerPriority={1} useKeyboardShortcuts 
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        isLoading={isConfirmed || isConfirming}/>
            </>);
        return (<>
                {!!errorMessage && (<FormHelpMessage_1.default style={[styles.ph1, styles.mb2]} isError message={errorMessage}/>)}

                <EducationalTooltip_1.default shouldRender={shouldShowProductTrainingTooltip} renderTooltipContent={renderProductTrainingTooltip} anchorAlignment={{
                horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.CENTER,
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
            }} wrapperStyle={styles.productTrainingTooltipWrapper} shouldHideOnNavigate shiftVertical={-10}>
                    <react_native_1.View>{button}</react_native_1.View>
                </EducationalTooltip_1.default>
            </>);
    }, [
        isReadOnly,
        iouType,
        confirm,
        iouCurrencyCode,
        policyID,
        isConfirmed,
        splitOrRequestOptions,
        errorMessage,
        expensesNumber,
        translate,
        showRemoveExpenseConfirmModal,
        styles.mb3,
        styles.ph1,
        styles.mb2,
        styles.productTrainingTooltipWrapper,
        shouldShowProductTrainingTooltip,
        renderProductTrainingTooltip,
        isConfirming,
        reportID,
    ]);
    const listFooterContent = (<MoneyRequestConfirmationListFooter_1.default action={action} currency={currency} didConfirm={!!didConfirm} distance={distance} formattedAmount={formattedAmount} formattedAmountPerAttendee={formattedAmountPerAttendee} formError={formError} hasRoute={hasRoute} iouAttendees={iouAttendees} iouCategory={iouCategory} iouComment={iouComment} iouCreated={iouCreated} iouCurrencyCode={iouCurrencyCode} iouIsBillable={iouIsBillable} iouMerchant={iouMerchant} iouType={iouType} isCategoryRequired={isCategoryRequired} isDistanceRequest={isDistanceRequest} isManualDistanceRequest={isManualDistanceRequest} isPerDiemRequest={isPerDiemRequest} isMerchantEmpty={isMerchantEmpty} isMerchantRequired={isMerchantRequired} isPolicyExpenseChat={isPolicyExpenseChat} isReadOnly={isReadOnly} isTypeInvoice={isTypeInvoice} onToggleBillable={onToggleBillable} policy={policy} policyTags={policyTags} policyTagLists={policyTagLists} rate={rate} receiptFilename={receiptFilename} receiptPath={receiptPath} reportActionID={reportActionID} reportID={reportID} selectedParticipants={selectedParticipantsProp} shouldDisplayFieldError={shouldDisplayFieldError} shouldDisplayReceipt={shouldDisplayReceipt} shouldShowCategories={shouldShowCategories} shouldShowMerchant={shouldShowMerchant} shouldShowSmartScanFields={shouldShowSmartScanFields} shouldShowAmountField={!isPerDiemRequest} shouldShowTax={shouldShowTax} transaction={transaction} transactionID={transactionID} unit={unit} onPDFLoadError={onPDFLoadError} onPDFPassword={onPDFPassword} iouIsReimbursable={iouIsReimbursable} onToggleReimbursable={onToggleReimbursable} isReceiptEditable={isReceiptEditable}/>);
    return (<useMouseContext_1.MouseProvider>
            <SelectionList_1.default sections={sections} ListItem={UserListItem_1.default} onSelectRow={navigateToParticipantPage} shouldSingleExecuteRowSelect canSelectMultiple={false} shouldPreventDefaultFocusOnSelectRow shouldShowListEmptyContent={false} footerContent={footerContent} listFooterContent={listFooterContent} containerStyle={[styles.flexBasisAuto]} removeClippedSubviews={false} disableKeyboardShortcuts/>
        </useMouseContext_1.MouseProvider>);
}
MoneyRequestConfirmationList.displayName = 'MoneyRequestConfirmationList';
exports.default = (0, react_1.memo)(MoneyRequestConfirmationList, (prevProps, nextProps) => (0, fast_equals_1.deepEqual)(prevProps.transaction, nextProps.transaction) &&
    prevProps.onSendMoney === nextProps.onSendMoney &&
    prevProps.onConfirm === nextProps.onConfirm &&
    prevProps.iouType === nextProps.iouType &&
    prevProps.iouAmount === nextProps.iouAmount &&
    prevProps.isDistanceRequest === nextProps.isDistanceRequest &&
    prevProps.isPolicyExpenseChat === nextProps.isPolicyExpenseChat &&
    prevProps.expensesNumber === nextProps.expensesNumber &&
    prevProps.iouCategory === nextProps.iouCategory &&
    prevProps.shouldShowSmartScanFields === nextProps.shouldShowSmartScanFields &&
    prevProps.isEditingSplitBill === nextProps.isEditingSplitBill &&
    prevProps.iouCurrencyCode === nextProps.iouCurrencyCode &&
    prevProps.iouMerchant === nextProps.iouMerchant &&
    (0, fast_equals_1.deepEqual)(prevProps.selectedParticipants, nextProps.selectedParticipants) &&
    (0, fast_equals_1.deepEqual)(prevProps.payeePersonalDetails, nextProps.payeePersonalDetails) &&
    prevProps.isReadOnly === nextProps.isReadOnly &&
    prevProps.policyID === nextProps.policyID &&
    prevProps.reportID === nextProps.reportID &&
    prevProps.receiptPath === nextProps.receiptPath &&
    prevProps.iouAttendees === nextProps.iouAttendees &&
    prevProps.iouComment === nextProps.iouComment &&
    prevProps.receiptFilename === nextProps.receiptFilename &&
    prevProps.iouCreated === nextProps.iouCreated &&
    prevProps.iouIsBillable === nextProps.iouIsBillable &&
    prevProps.onToggleBillable === nextProps.onToggleBillable &&
    prevProps.hasSmartScanFailed === nextProps.hasSmartScanFailed &&
    prevProps.reportActionID === nextProps.reportActionID &&
    (0, fast_equals_1.deepEqual)(prevProps.action, nextProps.action) &&
    prevProps.shouldDisplayReceipt === nextProps.shouldDisplayReceipt);
