"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const EmptyStateComponent_1 = require("@components/EmptyStateComponent");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const LottieAnimations_1 = require("@components/LottieAnimations");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const UnreportedExpensesSkeleton_1 = require("@components/Skeletons/UnreportedExpensesSkeleton");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const UnreportedExpenses_1 = require("@libs/actions/UnreportedExpenses");
const interceptAnonymousUser_1 = require("@libs/interceptAnonymousUser");
const Permissions_1 = require("@libs/Permissions");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const Navigation_1 = require("@navigation/Navigation");
const IOU_1 = require("@userActions/IOU");
const Transaction_1 = require("@userActions/Transaction");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const getEmptyArray_1 = require("@src/types/utils/getEmptyArray");
const NewChatSelectorPage_1 = require("./NewChatSelectorPage");
const UnreportedExpenseListItem_1 = require("./UnreportedExpenseListItem");
function AddUnreportedExpense({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const [errorMessage, setErrorMessage] = (0, react_1.useState)('');
    const [offset, setOffset] = (0, react_1.useState)(0);
    const { isOffline } = (0, useNetwork_1.default)();
    const [selectedIds, setSelectedIds] = (0, react_1.useState)(new Set());
    const { reportID, backToReport } = route.params;
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, { canBeMissing: true });
    const [reportNextStep] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${reportID}`, { canBeMissing: true });
    const policy = (0, usePolicy_1.default)(report?.policyID);
    const [hasMoreUnreportedTransactionsResults] = (0, useOnyx_1.default)(ONYXKEYS_1.default.HAS_MORE_UNREPORTED_TRANSACTIONS_RESULTS, { canBeMissing: true });
    const [isLoadingUnreportedTransactions] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_UNREPORTED_TRANSACTIONS, { canBeMissing: true });
    const [allBetas] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BETAS, { canBeMissing: true });
    const isASAPSubmitBetaEnabled = Permissions_1.default.isBetaEnabled(CONST_1.default.BETAS.ASAP_SUBMIT, allBetas);
    const session = (0, OnyxListItemProvider_1.useSession)();
    const shouldShowUnreportedTransactionsSkeletons = isLoadingUnreportedTransactions && hasMoreUnreportedTransactionsResults && !isOffline;
    function getUnreportedTransactions(transactions) {
        if (!transactions) {
            return [];
        }
        return Object.values(transactions || {}).filter((item) => {
            const isUnreported = item?.reportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID || item?.reportID === '';
            if (!isUnreported) {
                return false;
            }
            if ((0, TransactionUtils_1.isPerDiemRequest)(item)) {
                // Only show per diem expenses if the target workspace has per diem enabled and the per diem expense was created in the same workspace
                const workspacePerDiemUnit = (0, PolicyUtils_1.getPerDiemCustomUnit)(policy);
                const perDiemCustomUnitID = item?.comment?.customUnit?.customUnitID;
                return (0, PolicyUtils_1.canSubmitPerDiemExpenseFromWorkspace)(policy) && (!perDiemCustomUnitID || perDiemCustomUnitID === workspacePerDiemUnit?.customUnitID);
            }
            return true;
        });
    }
    const [transactions = (0, getEmptyArray_1.default)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, {
        selector: (_transactions) => getUnreportedTransactions(_transactions),
        canBeMissing: true,
    });
    const fetchMoreUnreportedTransactions = () => {
        if (!hasMoreUnreportedTransactionsResults || isLoadingUnreportedTransactions) {
            return;
        }
        (0, UnreportedExpenses_1.fetchUnreportedExpenses)(offset + CONST_1.default.UNREPORTED_EXPENSES_PAGE_SIZE);
        setOffset((prevOffset) => prevOffset + CONST_1.default.UNREPORTED_EXPENSES_PAGE_SIZE);
    };
    (0, react_1.useEffect)(() => {
        (0, UnreportedExpenses_1.fetchUnreportedExpenses)(0);
    }, []);
    const styles = (0, useThemeStyles_1.default)();
    const selectionListRef = (0, react_1.useRef)(null);
    const sections = (0, react_1.useMemo)(() => (0, TransactionUtils_1.createUnreportedExpenseSections)(transactions), [transactions]);
    const thereIsNoUnreportedTransaction = !((sections.at(0)?.data.length ?? 0) > 0);
    if (thereIsNoUnreportedTransaction && isLoadingUnreportedTransactions) {
        return (<ScreenWrapper_1.default shouldEnableKeyboardAvoidingView={false} includeSafeAreaPaddingBottom shouldShowOfflineIndicator={false} shouldEnablePickerAvoiding={false} testID={NewChatSelectorPage_1.default.displayName} focusTrapSettings={{ active: false }}>
                <HeaderWithBackButton_1.default title={translate('iou.addUnreportedExpense')} onBackButtonPress={Navigation_1.default.goBack}/>
                <UnreportedExpensesSkeleton_1.default />
            </ScreenWrapper_1.default>);
    }
    if (thereIsNoUnreportedTransaction) {
        return (<ScreenWrapper_1.default shouldEnableKeyboardAvoidingView={false} includeSafeAreaPaddingBottom shouldShowOfflineIndicator={false} shouldEnablePickerAvoiding={false} testID={NewChatSelectorPage_1.default.displayName} focusTrapSettings={{ active: false }}>
                <HeaderWithBackButton_1.default title={translate('iou.addUnreportedExpense')} onBackButtonPress={Navigation_1.default.goBack}/>
                <EmptyStateComponent_1.default cardStyles={[styles.appBG]} cardContentStyles={[styles.pt5, styles.pb0]} headerMediaType={CONST_1.default.EMPTY_STATE_MEDIA.ANIMATION} headerMedia={LottieAnimations_1.default.GenericEmptyState} title={translate('iou.emptyStateUnreportedExpenseTitle')} subtitle={translate('iou.emptyStateUnreportedExpenseSubtitle')} headerStyles={[styles.emptyStateMoneyRequestReport]} lottieWebViewStyles={styles.emptyStateFolderWebStyles} headerContentStyles={styles.emptyStateFolderWebStyles} buttons={[
                {
                    buttonText: translate('iou.createExpense'),
                    buttonAction: () => {
                        if (report && report.policyID && (0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(report.policyID)) {
                            Navigation_1.default.navigate(ROUTES_1.default.RESTRICTED_ACTION.getRoute(report.policyID));
                            return;
                        }
                        (0, interceptAnonymousUser_1.default)(() => {
                            (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.SUBMIT, reportID, undefined, false, backToReport);
                        });
                    },
                    success: true,
                },
            ]}/>
            </ScreenWrapper_1.default>);
    }
    return (<ScreenWrapper_1.default shouldEnableKeyboardAvoidingView={false} includeSafeAreaPaddingBottom shouldShowOfflineIndicator={false} shouldEnablePickerAvoiding={false} testID={NewChatSelectorPage_1.default.displayName} focusTrapSettings={{ active: false }}>
            <HeaderWithBackButton_1.default title={translate('iou.addUnreportedExpense')} onBackButtonPress={Navigation_1.default.goBack}/>
            <SelectionList_1.default ref={selectionListRef} onSelectRow={(item) => {
            setSelectedIds((prevIds) => {
                const newIds = new Set(prevIds);
                if (newIds.has(item.transactionID)) {
                    newIds.delete(item.transactionID);
                }
                else {
                    newIds.add(item.transactionID);
                    if (errorMessage) {
                        setErrorMessage('');
                    }
                }
                return newIds;
            });
        }} shouldShowTextInput={false} canSelectMultiple sections={sections} ListItem={UnreportedExpenseListItem_1.default} confirmButtonStyles={[styles.justifyContentCenter]} showConfirmButton confirmButtonText={translate('iou.addUnreportedExpenseConfirm')} onConfirm={() => {
            if (selectedIds.size === 0) {
                setErrorMessage(translate('iou.selectUnreportedExpense'));
                return;
            }
            Navigation_1.default.dismissModal();
            react_native_1.InteractionManager.runAfterInteractions(() => {
                if (report && (0, ReportUtils_1.isIOUReport)(report)) {
                    (0, IOU_1.convertBulkTrackedExpensesToIOU)([...selectedIds], report.reportID);
                }
                else {
                    (0, Transaction_1.changeTransactionsReport)([...selectedIds], report?.reportID ?? CONST_1.default.REPORT.UNREPORTED_REPORT_ID, isASAPSubmitBetaEnabled, session?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, session?.email ?? '', policy, reportNextStep);
                }
            });
            setErrorMessage('');
        }} onEndReached={fetchMoreUnreportedTransactions} onEndReachedThreshold={0.75} listFooterContent={shouldShowUnreportedTransactionsSkeletons ? <UnreportedExpensesSkeleton_1.default fixedNumberOfItems={3}/> : undefined}>
                {!!errorMessage && (<FormHelpMessage_1.default style={[styles.mb2, styles.ph4]} isError message={errorMessage}/>)}
            </SelectionList_1.default>
        </ScreenWrapper_1.default>);
}
AddUnreportedExpense.displayName = 'AddUnreportedExpense';
exports.default = AddUnreportedExpense;
