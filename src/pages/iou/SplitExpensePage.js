"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_keyboard_controller_1 = require("react-native-keyboard-controller");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const Button_1 = require("@components/Button");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SearchContext_1 = require("@components/Search/SearchContext");
const SelectionList_1 = require("@components/SelectionList");
const useDisplayFocusedInputUnderKeyboard_1 = require("@hooks/useDisplayFocusedInputUnderKeyboard");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const IOU_1 = require("@libs/actions/IOU");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const DateUtils_1 = require("@libs/DateUtils");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportSecondaryActionUtils_1 = require("@libs/ReportSecondaryActionUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function SplitExpensePage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { listRef, viewRef, footerRef, bottomOffset, scrollToFocusedInput, SplitListItem } = (0, useDisplayFocusedInputUnderKeyboard_1.default)();
    const { reportID, transactionID, splitExpenseTransactionID, backTo } = route.params;
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const [errorMessage, setErrorMessage] = react_1.default.useState('');
    const { currentSearchHash } = (0, SearchContext_1.useSearchContext)();
    const [draftTransaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SPLIT_TRANSACTION_DRAFT}${transactionID}`, { canBeMissing: false });
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(transactionID)}`, { canBeMissing: false });
    const [currencyList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CURRENCY_LIST, { canBeMissing: true });
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${(0, getNonEmptyStringOnyxID_1.default)(reportID)}`, { canBeMissing: true });
    const policy = (0, usePolicy_1.default)(report?.policyID);
    const isSplitAvailable = report && transaction && (0, ReportSecondaryActionUtils_1.isSplitAction)(report, [transaction], policy);
    const transactionDetails = (0, react_1.useMemo)(() => (0, ReportUtils_1.getTransactionDetails)(transaction) ?? {}, [transaction]);
    const transactionDetailsAmount = transactionDetails?.amount ?? 0;
    const sumOfSplitExpenses = (0, react_1.useMemo)(() => (draftTransaction?.comment?.splitExpenses ?? []).reduce((acc, item) => acc + Math.abs(item.amount ?? 0), 0), [draftTransaction]);
    const currencySymbol = currencyList?.[transactionDetails.currency ?? '']?.symbol ?? transactionDetails.currency ?? CONST_1.default.CURRENCY.USD;
    const isPerDiem = (0, TransactionUtils_1.isPerDiemRequest)(transaction);
    const isCard = (0, TransactionUtils_1.isCardTransaction)(transaction);
    (0, react_1.useEffect)(() => {
        const errorString = (0, ErrorUtils_1.getLatestErrorMessage)(draftTransaction ?? {});
        if (errorString) {
            setErrorMessage(errorString);
        }
    }, [draftTransaction, draftTransaction?.errors]);
    (0, react_1.useEffect)(() => {
        setErrorMessage('');
    }, [sumOfSplitExpenses, draftTransaction?.comment?.splitExpenses?.length]);
    const onAddSplitExpense = (0, react_1.useCallback)(() => {
        if (draftTransaction?.errors) {
            (0, IOU_1.clearSplitTransactionDraftErrors)(transactionID);
        }
        (0, IOU_1.addSplitExpenseField)(transaction, draftTransaction);
    }, [draftTransaction, transaction, transactionID]);
    const onSaveSplitExpense = (0, react_1.useCallback)(() => {
        if (draftTransaction?.errors) {
            (0, IOU_1.clearSplitTransactionDraftErrors)(transactionID);
        }
        if (sumOfSplitExpenses > Math.abs(transactionDetailsAmount)) {
            const difference = sumOfSplitExpenses - Math.abs(transactionDetailsAmount);
            setErrorMessage(translate('iou.totalAmountGreaterThanOriginal', { amount: (0, CurrencyUtils_1.convertToDisplayString)(difference, transactionDetails?.currency) }));
            return;
        }
        if (sumOfSplitExpenses < Math.abs(transactionDetailsAmount) && (isPerDiem || isCard)) {
            const difference = Math.abs(transactionDetailsAmount) - sumOfSplitExpenses;
            setErrorMessage(translate('iou.totalAmountLessThanOriginal', { amount: (0, CurrencyUtils_1.convertToDisplayString)(difference, transactionDetails?.currency) }));
            return;
        }
        if ((draftTransaction?.comment?.splitExpenses ?? []).find((item) => item.amount === 0)) {
            setErrorMessage(translate('iou.splitExpenseZeroAmount'));
            return;
        }
        (0, IOU_1.saveSplitTransactions)(draftTransaction, currentSearchHash);
    }, [draftTransaction, sumOfSplitExpenses, transactionDetailsAmount, isPerDiem, isCard, currentSearchHash, transactionID, translate, transactionDetails?.currency]);
    const onSplitExpenseAmountChange = (0, react_1.useCallback)((currentItemTransactionID, value) => {
        const amountInCents = (0, CurrencyUtils_1.convertToBackendAmount)(value);
        (0, IOU_1.updateSplitExpenseAmountField)(draftTransaction, currentItemTransactionID, amountInCents);
    }, [draftTransaction]);
    const getTranslatedText = (0, react_1.useCallback)((item) => (item.translationPath ? translate(item.translationPath) : (item.text ?? '')), [translate]);
    const [sections] = (0, react_1.useMemo)(() => {
        const dotSeparator = { text: ` ${CONST_1.default.DOT_SEPARATOR} ` };
        const isTransactionMadeWithCard = (0, TransactionUtils_1.isCardTransaction)(transaction);
        const showCashOrCard = { translationPath: isTransactionMadeWithCard ? 'iou.card' : 'iou.cash' };
        const items = (draftTransaction?.comment?.splitExpenses ?? []).map((item) => {
            const previewHeaderText = [showCashOrCard];
            const date = DateUtils_1.default.formatWithUTCTimeZone(item.created, DateUtils_1.default.doesDateBelongToAPastYear(item.created) ? CONST_1.default.DATE.MONTH_DAY_YEAR_ABBR_FORMAT : CONST_1.default.DATE.MONTH_DAY_ABBR_FORMAT);
            previewHeaderText.unshift({ text: date }, dotSeparator);
            const headerText = previewHeaderText.reduce((text, currentKey) => {
                return `${text}${getTranslatedText(currentKey)}`;
            }, '');
            return {
                ...item,
                headerText,
                originalAmount: transactionDetailsAmount,
                amount: transactionDetailsAmount >= 0 ? Math.abs(Number(item.amount)) : Number(item.amount),
                merchant: draftTransaction?.merchant ?? '',
                currency: draftTransaction?.currency ?? CONST_1.default.CURRENCY.USD,
                transactionID: item?.transactionID ?? CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID,
                currencySymbol,
                onSplitExpenseAmountChange,
                isTransactionLinked: splitExpenseTransactionID === item.transactionID,
                keyForList: item?.transactionID,
            };
        });
        const newSections = [{ data: items }];
        return [newSections];
    }, [transaction, draftTransaction, getTranslatedText, transactionDetailsAmount, currencySymbol, onSplitExpenseAmountChange, splitExpenseTransactionID]);
    const headerContent = (0, react_1.useMemo)(() => (<react_native_1.View style={[styles.w100, styles.ph5, styles.flexRow, styles.gap2, shouldUseNarrowLayout && styles.mb3]}>
                <Button_1.default success onPress={onAddSplitExpense} icon={Expensicons.Plus} text={translate('iou.addSplit')} style={[shouldUseNarrowLayout && styles.flex1]}/>
            </react_native_1.View>), [onAddSplitExpense, shouldUseNarrowLayout, styles.flex1, styles.flexRow, styles.gap2, styles.mb3, styles.ph5, styles.w100, translate]);
    const footerContent = (0, react_1.useMemo)(() => {
        const shouldShowWarningMessage = sumOfSplitExpenses < Math.abs(transactionDetailsAmount);
        const warningMessage = shouldShowWarningMessage
            ? translate('iou.totalAmountLessThanOriginal', { amount: (0, CurrencyUtils_1.convertToDisplayString)(Math.abs(transactionDetailsAmount) - sumOfSplitExpenses, transactionDetails.currency) })
            : '';
        return (<react_native_1.View ref={footerRef} style={styles.pt3}>
                {(!!errorMessage || !!warningMessage) && (<FormHelpMessage_1.default style={[styles.ph1, styles.mb2]} isError={!!errorMessage} isInfo={!errorMessage && shouldShowWarningMessage} message={errorMessage || warningMessage}/>)}
                <Button_1.default success large style={[styles.w100]} text={translate('common.save')} onPress={onSaveSplitExpense} pressOnEnter enterKeyEventListenerPriority={1}/>
            </react_native_1.View>);
    }, [sumOfSplitExpenses, transactionDetailsAmount, translate, transactionDetails.currency, errorMessage, styles.ph1, styles.mb2, styles.w100, onSaveSplitExpense, styles.pt3, footerRef]);
    const initiallyFocusedOptionKey = (0, react_1.useMemo)(() => sections.at(0)?.data.find((option) => option.transactionID === splitExpenseTransactionID)?.keyForList, [sections, splitExpenseTransactionID]);
    return (<ScreenWrapper_1.default testID={SplitExpensePage.displayName} shouldEnableMaxHeight={(0, DeviceCapabilities_1.canUseTouchScreen)()} keyboardAvoidingViewBehavior="height" shouldDismissKeyboardBeforeClose={false}>
            <FullPageNotFoundView_1.default shouldShow={!reportID || (0, EmptyObject_1.isEmptyObject)(draftTransaction) || !isSplitAvailable}>
                <react_native_1.View ref={viewRef} style={styles.flex1} onLayout={() => {
            scrollToFocusedInput();
        }}>
                    <HeaderWithBackButton_1.default title={translate('iou.split')} subtitle={translate('iou.splitExpenseSubtitle', {
            amount: (0, CurrencyUtils_1.convertToDisplayString)(transactionDetailsAmount, transactionDetails?.currency),
            merchant: draftTransaction?.merchant ?? '',
        })} onBackButtonPress={() => Navigation_1.default.goBack(backTo)}/>
                    <SelectionList_1.default 
    /* Keeps input fields visible above keyboard on mobile */
    renderScrollComponent={(props) => (<react_native_keyboard_controller_1.KeyboardAwareScrollView 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props} bottomOffset={bottomOffset.current} /* Bottom offset ensures inputs stay above the "save" button *//>)} onSelectRow={(item) => {
            react_native_1.Keyboard.dismiss();
            react_native_1.InteractionManager.runAfterInteractions(() => {
                (0, IOU_1.initDraftSplitExpenseDataForEdit)(draftTransaction, item.transactionID, reportID);
            });
        }} ref={listRef} headerContent={headerContent} sections={sections} initiallyFocusedOptionKey={initiallyFocusedOptionKey} ListItem={SplitListItem} containerStyle={[styles.flexBasisAuto, styles.pt1]} footerContent={footerContent} disableKeyboardShortcuts shouldSingleExecuteRowSelect canSelectMultiple={false} shouldPreventDefaultFocusOnSelectRow removeClippedSubviews={false}/>
                </react_native_1.View>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
SplitExpensePage.displayName = 'SplitExpensePage';
exports.default = SplitExpensePage;
