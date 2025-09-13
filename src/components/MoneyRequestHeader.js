"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useDuplicateTransactionsAndViolations_1 = require("@hooks/useDuplicateTransactionsAndViolations");
const useLoadingBarVisibility_1 = require("@hooks/useLoadingBarVisibility");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useTransactionViolations_1 = require("@hooks/useTransactionViolations");
const IOU_1 = require("@libs/actions/IOU");
const MergeTransaction_1 = require("@libs/actions/MergeTransaction");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportPrimaryActionUtils_1 = require("@libs/ReportPrimaryActionUtils");
const ReportSecondaryActionUtils_1 = require("@libs/ReportSecondaryActionUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const variables_1 = require("@styles/variables");
const IOU_2 = require("@userActions/IOU");
const Transaction_1 = require("@userActions/Transaction");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const BrokenConnectionDescription_1 = require("./BrokenConnectionDescription");
const Button_1 = require("./Button");
const ButtonWithDropdownMenu_1 = require("./ButtonWithDropdownMenu");
const ConfirmModal_1 = require("./ConfirmModal");
const DecisionModal_1 = require("./DecisionModal");
const DelegateNoAccessModalProvider_1 = require("./DelegateNoAccessModalProvider");
const HeaderWithBackButton_1 = require("./HeaderWithBackButton");
const HoldOrRejectEducationalModal_1 = require("./HoldOrRejectEducationalModal");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const LoadingBar_1 = require("./LoadingBar");
const MoneyRequestHeaderStatusBar_1 = require("./MoneyRequestHeaderStatusBar");
const MoneyRequestReportTransactionsNavigation_1 = require("./MoneyRequestReportView/MoneyRequestReportTransactionsNavigation");
const SearchContext_1 = require("./Search/SearchContext");
function MoneyRequestHeader({ report, parentReportAction, policy, onBackButtonPress }) {
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout to use a correct layout for the hold expense modal https://github.com/Expensify/App/pull/47990#issuecomment-2362382026
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { shouldUseNarrowLayout, isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const route = (0, native_1.useRoute)();
    const [parentReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.parentReportID}`, {
        canBeMissing: false,
    });
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, ReportActionsUtils_1.isMoneyRequestAction)(parentReportAction) ? ((0, ReportActionsUtils_1.getOriginalMessage)(parentReportAction)?.IOUTransactionID ?? CONST_1.default.DEFAULT_NUMBER_ID) : CONST_1.default.DEFAULT_NUMBER_ID}`, { canBeMissing: true });
    const transactionViolations = (0, useTransactionViolations_1.default)(transaction?.transactionID);
    const { duplicateTransactions, duplicateTransactionViolations } = (0, useDuplicateTransactionsAndViolations_1.default)(transaction?.transactionID ? [transaction.transactionID] : []);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = (0, react_1.useState)(false);
    const [downloadErrorModalVisible, setDownloadErrorModalVisible] = (0, react_1.useState)(false);
    const [isRejectEducationalModalVisible, setIsRejectEducationalModalVisible] = (0, react_1.useState)(false);
    const [dismissedRejectUseExplanation] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_DISMISSED_REJECT_USE_EXPLANATION, { canBeMissing: true });
    const [dismissedHoldUseExplanation, dismissedHoldUseExplanationResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_DISMISSED_HOLD_USE_EXPLANATION, { canBeMissing: true });
    const shouldShowLoadingBar = (0, useLoadingBarVisibility_1.default)();
    const isLoadingHoldUseExplained = (0, isLoadingOnyxValue_1.default)(dismissedHoldUseExplanationResult);
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const isOnHold = (0, TransactionUtils_1.isOnHold)(transaction);
    const isDuplicate = (0, TransactionUtils_1.isDuplicate)(transaction);
    const reportID = report?.reportID;
    const { removeTransaction } = (0, SearchContext_1.useSearchContext)();
    const { isDelegateAccessRestricted, showDelegateNoAccessModal } = (0, react_1.useContext)(DelegateNoAccessModalProvider_1.DelegateNoAccessContext);
    const isReportInRHP = route.name === SCREENS_1.default.SEARCH.REPORT_RHP;
    const shouldDisplayTransactionNavigation = !!(reportID && isReportInRHP);
    const hasPendingRTERViolation = (0, TransactionUtils_1.hasPendingRTERViolation)(transactionViolations);
    const shouldShowBrokenConnectionViolation = (0, TransactionUtils_1.shouldShowBrokenConnectionViolation)(parentReport, policy, transactionViolations);
    // If the parent report is a selfDM, it should always be opened in the Inbox tab
    const shouldOpenParentReportInCurrentTab = !(0, ReportUtils_1.isSelfDM)(parentReport);
    const markAsCash = (0, react_1.useCallback)(() => {
        (0, Transaction_1.markAsCash)(transaction?.transactionID, reportID);
    }, [reportID, transaction?.transactionID]);
    const getStatusIcon = (src) => (<Icon_1.default src={src} height={variables_1.default.iconSizeSmall} width={variables_1.default.iconSizeSmall} fill={theme.icon}/>);
    const getStatusBarProps = () => {
        if (isOnHold) {
            return { icon: getStatusIcon(Expensicons.Stopwatch), description: translate('iou.expenseOnHold') };
        }
        if ((0, ReportPrimaryActionUtils_1.isMarkAsResolvedAction)(parentReport, transactionViolations, policy)) {
            return { icon: getStatusIcon(Expensicons.Hourglass), description: translate('iou.reject.rejectedStatus') };
        }
        if (isDuplicate) {
            return { icon: getStatusIcon(Expensicons.Flag), description: translate('iou.expenseDuplicate') };
        }
        if ((0, TransactionUtils_1.isExpensifyCardTransaction)(transaction) && (0, TransactionUtils_1.isPending)(transaction)) {
            return { icon: getStatusIcon(Expensicons.CreditCardHourglass), description: translate('iou.transactionPendingDescription') };
        }
        if (shouldShowBrokenConnectionViolation) {
            return {
                icon: getStatusIcon(Expensicons.Hourglass),
                description: (<BrokenConnectionDescription_1.default transactionID={transaction?.transactionID} report={parentReport} policy={policy}/>),
            };
        }
        if (hasPendingRTERViolation) {
            return { icon: getStatusIcon(Expensicons.Hourglass), description: translate('iou.pendingMatchWithCreditCardDescription') };
        }
        if ((0, TransactionUtils_1.isScanning)(transaction)) {
            return { icon: getStatusIcon(Expensicons.ReceiptScan), description: translate('iou.receiptScanInProgressDescription') };
        }
    };
    const statusBarProps = getStatusBarProps();
    (0, react_1.useEffect)(() => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (isLoadingHoldUseExplained || dismissedHoldUseExplanation || !isOnHold) {
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.PROCESS_MONEY_REQUEST_HOLD.getRoute(Navigation_1.default.getReportRHPActiveRoute()));
    }, [dismissedHoldUseExplanation, isLoadingHoldUseExplained, isOnHold]);
    const primaryAction = (0, react_1.useMemo)(() => {
        if (!report || !parentReport || !transaction) {
            return '';
        }
        return (0, ReportPrimaryActionUtils_1.getTransactionThreadPrimaryAction)(report, parentReport, transaction, transactionViolations, policy);
    }, [parentReport, policy, report, transaction, transactionViolations]);
    const primaryActionImplementation = {
        [CONST_1.default.REPORT.TRANSACTION_PRIMARY_ACTIONS.REMOVE_HOLD]: (<Button_1.default success text={translate('iou.unhold')} onPress={() => {
                (0, ReportUtils_1.changeMoneyRequestHoldStatus)(parentReportAction);
            }}/>),
        [CONST_1.default.REPORT.TRANSACTION_PRIMARY_ACTIONS.MARK_AS_RESOLVED]: (<Button_1.default success onPress={() => {
                if (!transaction?.transactionID) {
                    return;
                }
                (0, IOU_1.markRejectViolationAsResolved)(transaction?.transactionID, reportID);
            }} text={translate('iou.reject.markAsResolved')}/>),
        [CONST_1.default.REPORT.TRANSACTION_PRIMARY_ACTIONS.REVIEW_DUPLICATES]: (<Button_1.default success text={translate('iou.reviewDuplicates')} onPress={() => {
                if (!reportID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_PAGE.getRoute(reportID, Navigation_1.default.getReportRHPActiveRoute()));
            }}/>),
        [CONST_1.default.REPORT.TRANSACTION_PRIMARY_ACTIONS.MARK_AS_CASH]: (<Button_1.default success text={translate('iou.markAsCash')} onPress={markAsCash}/>),
    };
    const secondaryActions = (0, react_1.useMemo)(() => {
        const reportActions = !!parentReport && (0, ReportActionsUtils_1.getReportActions)(parentReport);
        if (!transaction || !reportActions) {
            return [];
        }
        return (0, ReportSecondaryActionUtils_1.getSecondaryTransactionThreadActions)(parentReport, transaction, Object.values(reportActions), policy, report);
    }, [report, parentReport, policy, transaction]);
    const dismissModalAndUpdateUseReject = () => {
        setIsRejectEducationalModalVisible(false);
        (0, IOU_2.dismissRejectUseExplanation)();
        if (parentReportAction) {
            (0, ReportUtils_1.rejectMoneyRequestReason)(parentReportAction);
        }
    };
    const secondaryActionsImplementation = {
        [CONST_1.default.REPORT.TRANSACTION_SECONDARY_ACTIONS.HOLD]: {
            text: translate('iou.hold'),
            icon: Expensicons.Stopwatch,
            value: CONST_1.default.REPORT.TRANSACTION_SECONDARY_ACTIONS.HOLD,
            onSelected: () => {
                if (!parentReportAction) {
                    throw new Error('Parent action does not exist');
                }
                if (isDelegateAccessRestricted) {
                    showDelegateNoAccessModal();
                    return;
                }
                (0, ReportUtils_1.changeMoneyRequestHoldStatus)(parentReportAction);
            },
        },
        [CONST_1.default.REPORT.TRANSACTION_SECONDARY_ACTIONS.REMOVE_HOLD]: {
            text: translate('iou.unhold'),
            icon: Expensicons.Stopwatch,
            value: CONST_1.default.REPORT.TRANSACTION_SECONDARY_ACTIONS.REMOVE_HOLD,
            onSelected: () => {
                if (!parentReportAction) {
                    throw new Error('Parent action does not exist');
                }
                (0, ReportUtils_1.changeMoneyRequestHoldStatus)(parentReportAction);
            },
        },
        [CONST_1.default.REPORT.TRANSACTION_SECONDARY_ACTIONS.SPLIT]: {
            text: translate('iou.split'),
            icon: Expensicons.ArrowSplit,
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.SPLIT,
            onSelected: () => {
                (0, IOU_1.initSplitExpense)(transaction);
            },
        },
        [CONST_1.default.REPORT.TRANSACTION_SECONDARY_ACTIONS.MERGE]: {
            text: translate('common.merge'),
            icon: Expensicons.ArrowCollapse,
            value: CONST_1.default.REPORT.TRANSACTION_SECONDARY_ACTIONS.MERGE,
            onSelected: () => {
                if (!transaction) {
                    return;
                }
                (0, MergeTransaction_1.setupMergeTransactionData)(transaction.transactionID, { targetTransactionID: transaction.transactionID });
                Navigation_1.default.navigate(ROUTES_1.default.MERGE_TRANSACTION_LIST_PAGE.getRoute(transaction.transactionID, Navigation_1.default.getActiveRoute()));
            },
        },
        [CONST_1.default.REPORT.TRANSACTION_SECONDARY_ACTIONS.VIEW_DETAILS]: {
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.VIEW_DETAILS,
            text: translate('iou.viewDetails'),
            icon: Expensicons.Info,
            onSelected: () => {
                (0, ReportUtils_1.navigateToDetailsPage)(report, Navigation_1.default.getActiveRoute());
            },
        },
        [CONST_1.default.REPORT.TRANSACTION_SECONDARY_ACTIONS.DELETE]: {
            text: translate('common.delete'),
            icon: Expensicons.Trashcan,
            value: CONST_1.default.REPORT.SECONDARY_ACTIONS.DELETE,
            onSelected: () => {
                setIsDeleteModalVisible(true);
            },
        },
        [CONST_1.default.REPORT.TRANSACTION_SECONDARY_ACTIONS.REJECT]: {
            text: translate('common.reject'),
            icon: Expensicons.ThumbsDown,
            value: CONST_1.default.REPORT.TRANSACTION_SECONDARY_ACTIONS.REJECT,
            onSelected: () => {
                if (dismissedRejectUseExplanation) {
                    if (parentReportAction) {
                        (0, ReportUtils_1.rejectMoneyRequestReason)(parentReportAction);
                    }
                }
                else {
                    setIsRejectEducationalModalVisible(true);
                }
            },
        },
    };
    const applicableSecondaryActions = secondaryActions.map((action) => secondaryActionsImplementation[action]);
    return (<react_native_1.View style={[styles.pl0, styles.borderBottom]}>
            <HeaderWithBackButton_1.default shouldShowBorderBottom={false} shouldShowReportAvatarWithDisplay shouldShowPinButton={false} report={reportID
            ? {
                ...report,
                reportID,
                ownerAccountID: parentReport?.ownerAccountID,
            }
            : undefined} shouldShowBackButton={shouldUseNarrowLayout} shouldDisplaySearchRouter={!isReportInRHP} shouldDisplayHelpButton={!isReportInRHP} onBackButtonPress={onBackButtonPress} shouldEnableDetailPageNavigation openParentReportInCurrentTab={shouldOpenParentReportInCurrentTab}>
                {!shouldUseNarrowLayout && (<react_native_1.View style={[styles.flexRow, styles.gap2]}>
                        {!!primaryAction && primaryActionImplementation[primaryAction]}
                        {!!applicableSecondaryActions.length && (<ButtonWithDropdownMenu_1.default success={false} onPress={() => { }} shouldAlwaysShowDropdownMenu customText={translate('common.more')} options={applicableSecondaryActions} isSplitButton={false}/>)}
                    </react_native_1.View>)}
                {shouldDisplayTransactionNavigation && <MoneyRequestReportTransactionsNavigation_1.default currentReportID={reportID}/>}
            </HeaderWithBackButton_1.default>
            {shouldUseNarrowLayout && (<react_native_1.View style={[styles.flexRow, styles.gap2, styles.pb3, styles.ph5, styles.w100, styles.alignItemsCenter, styles.justifyContentCenter]}>
                    {!!primaryAction && <react_native_1.View style={[styles.flexGrow4]}>{primaryActionImplementation[primaryAction]}</react_native_1.View>}
                    {!!applicableSecondaryActions.length && (<ButtonWithDropdownMenu_1.default success={false} onPress={() => { }} shouldAlwaysShowDropdownMenu customText={translate('common.more')} options={applicableSecondaryActions} isSplitButton={false} wrapperStyle={[!primaryAction && styles.flexGrow4]}/>)}
                </react_native_1.View>)}
            {!!statusBarProps && (<react_native_1.View style={[styles.ph5, styles.pb3]}>
                    <MoneyRequestHeaderStatusBar_1.default icon={statusBarProps.icon} description={statusBarProps.description}/>
                </react_native_1.View>)}
            <LoadingBar_1.default shouldShow={shouldShowLoadingBar && shouldUseNarrowLayout}/>
            <DecisionModal_1.default title={translate('common.downloadFailedTitle')} prompt={translate('common.downloadFailedDescription')} isSmallScreenWidth={isSmallScreenWidth} onSecondOptionSubmit={() => setDownloadErrorModalVisible(false)} secondOptionText={translate('common.buttonConfirm')} isVisible={downloadErrorModalVisible} onClose={() => setDownloadErrorModalVisible(false)}/>
            <ConfirmModal_1.default title={translate('iou.deleteExpense', { count: 1 })} isVisible={isDeleteModalVisible} onConfirm={() => {
            setIsDeleteModalVisible(false);
            if (!parentReportAction || !transaction) {
                throw new Error('Data missing');
            }
            if ((0, ReportActionsUtils_1.isTrackExpenseAction)(parentReportAction)) {
                (0, IOU_1.deleteTrackExpense)(report?.parentReportID, transaction.transactionID, parentReportAction, duplicateTransactions, duplicateTransactionViolations, true);
            }
            else {
                (0, IOU_1.deleteMoneyRequest)(transaction.transactionID, parentReportAction, duplicateTransactions, duplicateTransactionViolations, true);
                removeTransaction(transaction.transactionID);
            }
            onBackButtonPress();
        }} onCancel={() => setIsDeleteModalVisible(false)} prompt={translate('iou.deleteConfirmation', { count: 1 })} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger shouldEnableNewFocusManagement/>
            {!!isRejectEducationalModalVisible && (<HoldOrRejectEducationalModal_1.default onClose={dismissModalAndUpdateUseReject} onConfirm={dismissModalAndUpdateUseReject}/>)}
        </react_native_1.View>);
}
MoneyRequestHeader.displayName = 'MoneyRequestHeader';
exports.default = MoneyRequestHeader;
