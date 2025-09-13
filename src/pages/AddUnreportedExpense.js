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
var react_native_1 = require("react-native");
var EmptyStateComponent_1 = require("@components/EmptyStateComponent");
var FormHelpMessage_1 = require("@components/FormHelpMessage");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var LottieAnimations_1 = require("@components/LottieAnimations");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var SelectionList_1 = require("@components/SelectionList");
var UnreportedExpensesSkeleton_1 = require("@components/Skeletons/UnreportedExpensesSkeleton");
var useLocalize_1 = require("@hooks/useLocalize");
var useNetwork_1 = require("@hooks/useNetwork");
var useOnyx_1 = require("@hooks/useOnyx");
var usePolicy_1 = require("@hooks/usePolicy");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var UnreportedExpenses_1 = require("@libs/actions/UnreportedExpenses");
var interceptAnonymousUser_1 = require("@libs/interceptAnonymousUser");
var Permissions_1 = require("@libs/Permissions");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
var TransactionUtils_1 = require("@libs/TransactionUtils");
var Navigation_1 = require("@navigation/Navigation");
var IOU_1 = require("@userActions/IOU");
var Transaction_1 = require("@userActions/Transaction");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var getEmptyArray_1 = require("@src/types/utils/getEmptyArray");
var NewChatSelectorPage_1 = require("./NewChatSelectorPage");
var UnreportedExpenseListItem_1 = require("./UnreportedExpenseListItem");
function AddUnreportedExpense(_a) {
    var _b, _c;
    var route = _a.route;
    var translate = (0, useLocalize_1.default)().translate;
    var _d = (0, react_1.useState)(''), errorMessage = _d[0], setErrorMessage = _d[1];
    var _e = (0, react_1.useState)(0), offset = _e[0], setOffset = _e[1];
    var isOffline = (0, useNetwork_1.default)().isOffline;
    var _f = (0, react_1.useState)(new Set()), selectedIds = _f[0], setSelectedIds = _f[1];
    var _g = route.params, reportID = _g.reportID, backToReport = _g.backToReport;
    var report = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID), { canBeMissing: true })[0];
    var reportNextStep = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.NEXT_STEP).concat(reportID), { canBeMissing: true })[0];
    var policy = (0, usePolicy_1.default)(report === null || report === void 0 ? void 0 : report.policyID);
    var hasMoreUnreportedTransactionsResults = (0, useOnyx_1.default)(ONYXKEYS_1.default.HAS_MORE_UNREPORTED_TRANSACTIONS_RESULTS, { canBeMissing: true })[0];
    var isLoadingUnreportedTransactions = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_UNREPORTED_TRANSACTIONS, { canBeMissing: true })[0];
    var allBetas = (0, useOnyx_1.default)(ONYXKEYS_1.default.BETAS, { canBeMissing: true })[0];
    var isASAPSubmitBetaEnabled = Permissions_1.default.isBetaEnabled(CONST_1.default.BETAS.ASAP_SUBMIT, allBetas);
    var session = (0, OnyxListItemProvider_1.useSession)();
    var shouldShowUnreportedTransactionsSkeletons = isLoadingUnreportedTransactions && hasMoreUnreportedTransactionsResults && !isOffline;
    function getUnreportedTransactions(transactions) {
        if (!transactions) {
            return [];
        }
        return Object.values(transactions || {}).filter(function (item) {
            var _a, _b;
            var isUnreported = (item === null || item === void 0 ? void 0 : item.reportID) === CONST_1.default.REPORT.UNREPORTED_REPORT_ID || (item === null || item === void 0 ? void 0 : item.reportID) === '';
            if (!isUnreported) {
                return false;
            }
            if ((0, TransactionUtils_1.isPerDiemRequest)(item)) {
                // Only show per diem expenses if the target workspace has per diem enabled and the per diem expense was created in the same workspace
                var workspacePerDiemUnit = (0, PolicyUtils_1.getPerDiemCustomUnit)(policy);
                var perDiemCustomUnitID = (_b = (_a = item === null || item === void 0 ? void 0 : item.comment) === null || _a === void 0 ? void 0 : _a.customUnit) === null || _b === void 0 ? void 0 : _b.customUnitID;
                return (0, PolicyUtils_1.canSubmitPerDiemExpenseFromWorkspace)(policy) && (!perDiemCustomUnitID || perDiemCustomUnitID === (workspacePerDiemUnit === null || workspacePerDiemUnit === void 0 ? void 0 : workspacePerDiemUnit.customUnitID));
            }
            return true;
        });
    }
    var _h = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, {
        selector: function (_transactions) { return getUnreportedTransactions(_transactions); },
        canBeMissing: true,
    })[0], transactions = _h === void 0 ? (0, getEmptyArray_1.default)() : _h;
    var fetchMoreUnreportedTransactions = function () {
        if (!hasMoreUnreportedTransactionsResults || isLoadingUnreportedTransactions) {
            return;
        }
        (0, UnreportedExpenses_1.fetchUnreportedExpenses)(offset + CONST_1.default.UNREPORTED_EXPENSES_PAGE_SIZE);
        setOffset(function (prevOffset) { return prevOffset + CONST_1.default.UNREPORTED_EXPENSES_PAGE_SIZE; });
    };
    (0, react_1.useEffect)(function () {
        (0, UnreportedExpenses_1.fetchUnreportedExpenses)(0);
    }, []);
    var styles = (0, useThemeStyles_1.default)();
    var selectionListRef = (0, react_1.useRef)(null);
    var sections = (0, react_1.useMemo)(function () { return (0, TransactionUtils_1.createUnreportedExpenseSections)(transactions); }, [transactions]);
    var thereIsNoUnreportedTransaction = !(((_c = (_b = sections.at(0)) === null || _b === void 0 ? void 0 : _b.data.length) !== null && _c !== void 0 ? _c : 0) > 0);
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
                    buttonAction: function () {
                        if (report && report.policyID && (0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(report.policyID)) {
                            Navigation_1.default.navigate(ROUTES_1.default.RESTRICTED_ACTION.getRoute(report.policyID));
                            return;
                        }
                        (0, interceptAnonymousUser_1.default)(function () {
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
            <SelectionList_1.default ref={selectionListRef} onSelectRow={function (item) {
            setSelectedIds(function (prevIds) {
                var newIds = new Set(prevIds);
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
        }} shouldShowTextInput={false} canSelectMultiple sections={sections} ListItem={UnreportedExpenseListItem_1.default} confirmButtonStyles={[styles.justifyContentCenter]} showConfirmButton confirmButtonText={translate('iou.addUnreportedExpenseConfirm')} onConfirm={function () {
            if (selectedIds.size === 0) {
                setErrorMessage(translate('iou.selectUnreportedExpense'));
                return;
            }
            Navigation_1.default.dismissModal();
            react_native_1.InteractionManager.runAfterInteractions(function () {
                var _a, _b, _c;
                if (report && (0, ReportUtils_1.isIOUReport)(report)) {
                    (0, IOU_1.convertBulkTrackedExpensesToIOU)(__spreadArray([], selectedIds, true), report.reportID);
                }
                else {
                    (0, Transaction_1.changeTransactionsReport)(__spreadArray([], selectedIds, true), (_a = report === null || report === void 0 ? void 0 : report.reportID) !== null && _a !== void 0 ? _a : CONST_1.default.REPORT.UNREPORTED_REPORT_ID, isASAPSubmitBetaEnabled, (_b = session === null || session === void 0 ? void 0 : session.accountID) !== null && _b !== void 0 ? _b : CONST_1.default.DEFAULT_NUMBER_ID, (_c = session === null || session === void 0 ? void 0 : session.email) !== null && _c !== void 0 ? _c : '', policy, reportNextStep);
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
