"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const AnimatedSubmitButton_1 = require("@components/AnimatedSubmitButton");
const Button_1 = require("@components/Button");
const utils_1 = require("@components/Button/utils");
const ButtonWithDropdownMenu_1 = require("@components/ButtonWithDropdownMenu");
const DelegateNoAccessModalProvider_1 = require("@components/DelegateNoAccessModalProvider");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const ImageSVG_1 = require("@components/ImageSVG");
const MoneyReportHeaderStatusBarSkeleton_1 = require("@components/MoneyReportHeaderStatusBarSkeleton");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const Pressable_1 = require("@components/Pressable");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const ProcessMoneyReportHoldMenu_1 = require("@components/ProcessMoneyReportHoldMenu");
const ExportWithDropdownMenu_1 = require("@components/ReportActionItem/ExportWithDropdownMenu");
const AnimatedSettlementButton_1 = require("@components/SettlementButton/AnimatedSettlementButton");
const ShowContextMenuContext_1 = require("@components/ShowContextMenuContext");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useParticipantsInvoiceReport_1 = require("@hooks/useParticipantsInvoiceReport");
const usePaymentAnimations_1 = require("@hooks/usePaymentAnimations");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@libs/actions/Report");
const ControlSelection_1 = require("@libs/ControlSelection");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const MoneyRequestReportUtils_1 = require("@libs/MoneyRequestReportUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Performance_1 = require("@libs/Performance");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportPreviewActionUtils_1 = require("@libs/ReportPreviewActionUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const shouldAdjustScroll_1 = require("@libs/shouldAdjustScroll");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const colors_1 = require("@styles/theme/colors");
const variables_1 = require("@styles/variables");
const IOU_1 = require("@userActions/IOU");
const Timing_1 = require("@userActions/Timing");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyMoneyRequestReportPreview_1 = require("./EmptyMoneyRequestReportPreview");
function MoneyRequestReportPreviewContent({ iouReportID, chatReportID, action, containerStyles, contextMenuAnchor, isHovered = false, isWhisper = false, checkIfContextMenuActive = () => { }, onPaymentOptionsShow, onPaymentOptionsHide, chatReport, invoiceReceiverPolicy, iouReport, transactions, violations, policy, invoiceReceiverPersonalDetail, lastTransactionViolations, renderTransactionItem, onCarouselLayout, onWrapperLayout, currentWidth, reportPreviewStyles, shouldDisplayContextMenu = true, isInvoice, shouldShowBorder = false, onPress, forwardedFSClass, }) {
    const [chatReportMetadata] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${chatReportID}`, { canBeMissing: true, allowStaleData: true });
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: true });
    const shouldShowLoading = !chatReportMetadata?.hasOnceLoadedReportActions && transactions.length === 0 && !chatReportMetadata?.isOptimisticReport;
    // `hasOnceLoadedReportActions` becomes true before transactions populate fully,
    // so we defer the loading state update to ensure transactions are loaded
    const shouldShowLoadingDeferred = (0, react_1.useDeferredValue)(shouldShowLoading);
    const lastTransaction = transactions?.at(0);
    const shouldShowSkeleton = shouldShowLoading && transactions.length === 0;
    const shouldShowEmptyPlaceholder = transactions.length === 0 && !shouldShowLoading;
    const showStatusAndSkeleton = !shouldShowEmptyPlaceholder;
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { areAllRequestsBeingSmartScanned, hasNonReimbursableTransactions } = (0, react_1.useMemo)(() => ({
        areAllRequestsBeingSmartScanned: (0, ReportUtils_1.areAllRequestsBeingSmartScanned)(iouReportID, action),
        hasOnlyTransactionsWithPendingRoutes: (0, ReportUtils_1.hasOnlyTransactionsWithPendingRoutes)(iouReportID),
        hasNonReimbursableTransactions: (0, ReportUtils_1.hasNonReimbursableTransactions)(iouReportID),
    }), 
    // When transactions get updated these values may have changed, so that is a case where we also want to recompute them
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    [transactions, iouReportID, action]);
    const { isPaidAnimationRunning, isApprovedAnimationRunning, isSubmittingAnimationRunning, stopAnimation, startAnimation, startApprovedAnimation, startSubmittingAnimation } = (0, usePaymentAnimations_1.default)();
    const [isHoldMenuVisible, setIsHoldMenuVisible] = (0, react_1.useState)(false);
    const [requestType, setRequestType] = (0, react_1.useState)();
    const [paymentType, setPaymentType] = (0, react_1.useState)();
    const isIouReportArchived = (0, useReportIsArchived_1.default)(iouReportID);
    const isChatReportArchived = (0, useReportIsArchived_1.default)(chatReport?.reportID);
    const getCanIOUBePaid = (0, react_1.useCallback)((shouldShowOnlyPayElsewhere = false, shouldCheckApprovedState = true) => (0, IOU_1.canIOUBePaid)(iouReport, chatReport, policy, transactions, shouldShowOnlyPayElsewhere, undefined, undefined, shouldCheckApprovedState), [iouReport, chatReport, policy, transactions]);
    const canIOUBePaid = (0, react_1.useMemo)(() => getCanIOUBePaid(), [getCanIOUBePaid]);
    const onlyShowPayElsewhere = (0, react_1.useMemo)(() => !canIOUBePaid && getCanIOUBePaid(true), [canIOUBePaid, getCanIOUBePaid]);
    const shouldShowPayButton = isPaidAnimationRunning || canIOUBePaid || onlyShowPayElsewhere;
    const { nonHeldAmount, fullAmount, hasValidNonHeldAmount } = (0, ReportUtils_1.getNonHeldAndFullAmount)(iouReport, shouldShowPayButton);
    const canIOUBePaidAndApproved = (0, react_1.useMemo)(() => getCanIOUBePaid(false, false), [getCanIOUBePaid]);
    const connectedIntegration = (0, PolicyUtils_1.getConnectedIntegration)(policy);
    const hasOnlyHeldExpenses = (0, ReportUtils_1.hasOnlyHeldExpenses)(iouReport?.reportID);
    const managerID = iouReport?.managerID ?? action.childManagerAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const { totalDisplaySpend } = (0, ReportUtils_1.getMoneyRequestSpendBreakdown)(iouReport);
    const iouSettled = (0, ReportUtils_1.isSettled)(iouReportID) || action?.childStatusNum === CONST_1.default.REPORT.STATUS_NUM.REIMBURSED;
    const previewMessageOpacity = (0, react_native_reanimated_1.useSharedValue)(1);
    const previewMessageStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        opacity: previewMessageOpacity.get(),
    }));
    const checkMarkScale = (0, react_native_reanimated_1.useSharedValue)(iouSettled ? 1 : 0);
    const isApproved = (0, ReportUtils_1.isReportApproved)({ report: iouReport, parentReportAction: action });
    const thumbsUpScale = (0, react_native_reanimated_1.useSharedValue)(isApproved ? 1 : 0);
    const isPolicyExpenseChat = (0, ReportUtils_1.isPolicyExpenseChat)(chatReport);
    const isInvoiceRoom = (0, ReportUtils_1.isInvoiceRoom)(chatReport);
    const isTripRoom = (0, ReportUtils_1.isTripRoom)(chatReport);
    const canAllowSettlement = (0, ReportUtils_1.hasUpdatedTotal)(iouReport, policy);
    const numberOfRequests = transactions?.length ?? 0;
    const transactionsWithReceipts = (0, ReportUtils_1.getTransactionsWithReceipts)(iouReportID);
    const numberOfPendingRequests = transactionsWithReceipts.filter((transaction) => (0, TransactionUtils_1.isPending)(transaction) && (0, TransactionUtils_1.isCardTransaction)(transaction)).length;
    const shouldShowRTERViolationMessage = numberOfRequests === 1 && (0, TransactionUtils_1.hasPendingUI)(lastTransaction, lastTransactionViolations);
    const shouldShowOnlyPayElsewhere = (0, react_1.useMemo)(() => !canIOUBePaid && getCanIOUBePaid(true), [canIOUBePaid, getCanIOUBePaid]);
    const hasReceipts = transactionsWithReceipts.length > 0;
    const isScanning = hasReceipts && areAllRequestsBeingSmartScanned;
    const existingB2BInvoiceReport = (0, useParticipantsInvoiceReport_1.default)(activePolicyID, CONST_1.default.REPORT.INVOICE_RECEIVER_TYPE.BUSINESS, chatReport?.policyID);
    const { isDelegateAccessRestricted, showDelegateNoAccessModal } = (0, react_1.useContext)(DelegateNoAccessModalProvider_1.DelegateNoAccessContext);
    const [reportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReportID}`, { canBeMissing: true });
    const hasReportBeenRetracted = (0, ReportUtils_1.hasReportBeenReopened)(iouReport, reportActions) || (0, ReportUtils_1.hasReportBeenRetracted)(iouReport, reportActions);
    // The submit button should be success green color only if the user is submitter and the policy does not have Scheduled Submit turned on
    // Or if the report has been reopened or retracted
    const isWaitingForSubmissionFromCurrentUser = (0, react_1.useMemo)(() => {
        const isOwnAndReportHasBeenRetracted = (0, ReportUtils_1.isReportOwner)(iouReport) && hasReportBeenRetracted;
        return isOwnAndReportHasBeenRetracted || (0, ReportUtils_1.isWaitingForSubmissionFromCurrentUser)(chatReport, policy);
    }, [chatReport, policy, hasReportBeenRetracted, iouReport]);
    const confirmPayment = (0, react_1.useCallback)((type, payAsBusiness) => {
        if (!type) {
            return;
        }
        setPaymentType(type);
        setRequestType(CONST_1.default.IOU.REPORT_ACTION_TYPE.PAY);
        if (isDelegateAccessRestricted) {
            showDelegateNoAccessModal();
        }
        else if ((0, ReportUtils_1.hasHeldExpenses)(iouReport?.reportID)) {
            setIsHoldMenuVisible(true);
        }
        else if (chatReport && iouReport) {
            startAnimation();
            if ((0, ReportUtils_1.isInvoiceReport)(iouReport)) {
                (0, IOU_1.payInvoice)(type, chatReport, iouReport, payAsBusiness, existingB2BInvoiceReport);
            }
            else {
                (0, IOU_1.payMoneyRequest)(type, chatReport, iouReport);
            }
        }
    }, [chatReport, iouReport, isDelegateAccessRestricted, showDelegateNoAccessModal, startAnimation, existingB2BInvoiceReport]);
    const confirmApproval = () => {
        setRequestType(CONST_1.default.IOU.REPORT_ACTION_TYPE.APPROVE);
        if (isDelegateAccessRestricted) {
            showDelegateNoAccessModal();
        }
        else if ((0, ReportUtils_1.hasHeldExpenses)(iouReport?.reportID)) {
            setIsHoldMenuVisible(true);
        }
        else {
            startApprovedAnimation();
            (0, IOU_1.approveMoneyRequest)(iouReport, true);
        }
    };
    const previewMessage = (0, react_1.useMemo)(() => {
        if (isScanning) {
            return totalDisplaySpend ? `${translate('common.receipt')} ${CONST_1.default.DOT_SEPARATOR} ${translate('common.scanning')}` : `${translate('common.receipt')}`;
        }
        if (numberOfPendingRequests === 1 && numberOfRequests === 1) {
            return `${translate('common.receipt')} ${CONST_1.default.DOT_SEPARATOR} ${translate('iou.pending')}`;
        }
        if (shouldShowRTERViolationMessage) {
            return `${translate('common.receipt')} ${CONST_1.default.DOT_SEPARATOR} ${translate('iou.pendingMatch')}`;
        }
        let payerOrApproverName;
        if (isPolicyExpenseChat || isTripRoom) {
            payerOrApproverName = (0, ReportUtils_1.getPolicyName)({ report: chatReport, policy });
        }
        else if (isInvoiceRoom) {
            payerOrApproverName = (0, ReportUtils_1.getInvoicePayerName)(chatReport, invoiceReceiverPolicy, invoiceReceiverPersonalDetail);
        }
        else {
            payerOrApproverName = (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID: managerID, shouldUseShortForm: true });
        }
        if (isApproved) {
            return translate('iou.managerApproved', { manager: payerOrApproverName });
        }
        let paymentVerb = 'iou.payerOwes';
        if (iouSettled || iouReport?.isWaitingOnBankAccount) {
            paymentVerb = 'iou.payerPaid';
        }
        else if (hasNonReimbursableTransactions) {
            paymentVerb = 'iou.payerSpent';
            payerOrApproverName = (0, ReportUtils_1.getDisplayNameForParticipant)({ accountID: chatReport?.ownerAccountID, shouldUseShortForm: true });
        }
        return translate(paymentVerb, { payer: payerOrApproverName });
    }, [
        isScanning,
        numberOfPendingRequests,
        numberOfRequests,
        shouldShowRTERViolationMessage,
        isPolicyExpenseChat,
        isTripRoom,
        isInvoiceRoom,
        isApproved,
        iouSettled,
        iouReport?.isWaitingOnBankAccount,
        hasNonReimbursableTransactions,
        translate,
        totalDisplaySpend,
        chatReport,
        policy,
        invoiceReceiverPolicy,
        invoiceReceiverPersonalDetail,
        managerID,
    ]);
    /*
     Show subtitle if at least one of the expenses is not being smart scanned, and either:
     - There is more than one expense – in this case, the "X expenses, Y scanning" subtitle is shown;
     - There is only one expense, it has a receipt and is not being smart scanned – in this case, the expense merchant or description is shown;

     * There is an edge case when there is only one distance expense with a pending route and amount = 0.
       In this case, we don't want to show the merchant or description because it says: "Pending route...", which is already displayed in the amount field.
     */
    const expenseCount = (0, react_1.useMemo)(() => translate('iou.expenseCount', {
        count: numberOfRequests,
    }), [translate, numberOfRequests]);
    const reportStatus = (0, react_1.useMemo)(() => (0, ReportUtils_1.getReportStatusTranslation)(iouReport?.stateNum ?? action?.childStateNum, iouReport?.statusNum ?? action?.childStatusNum), [action?.childStateNum, action?.childStatusNum, iouReport?.stateNum, iouReport?.statusNum]);
    const totalAmountStyle = shouldUseNarrowLayout ? [styles.flexColumnReverse, styles.alignItemsStretch] : [styles.flexRow, styles.alignItemsCenter];
    (0, react_1.useEffect)(() => {
        if (!isPaidAnimationRunning || isApprovedAnimationRunning || isSubmittingAnimationRunning) {
            return;
        }
        previewMessageOpacity.set((0, react_native_reanimated_1.withTiming)(0.75, { duration: CONST_1.default.ANIMATION_PAID_DURATION / 2 }, () => {
            previewMessageOpacity.set((0, react_native_reanimated_1.withTiming)(1, { duration: CONST_1.default.ANIMATION_PAID_DURATION / 2 }));
        }));
        // We only want to animate the text when the text changes
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [previewMessage, previewMessageOpacity]);
    (0, react_1.useEffect)(() => {
        if (!iouSettled) {
            return;
        }
        checkMarkScale.set(isPaidAnimationRunning ? (0, react_native_reanimated_1.withDelay)(CONST_1.default.ANIMATION_PAID_CHECKMARK_DELAY, (0, react_native_reanimated_1.withSpring)(1, { duration: CONST_1.default.ANIMATION_PAID_DURATION })) : 1);
    }, [isPaidAnimationRunning, iouSettled, checkMarkScale]);
    (0, react_1.useEffect)(() => {
        if (!isApproved) {
            return;
        }
        thumbsUpScale.set(isApprovedAnimationRunning ? (0, react_native_reanimated_1.withDelay)(CONST_1.default.ANIMATION_THUMBS_UP_DELAY, (0, react_native_reanimated_1.withSpring)(1, { duration: CONST_1.default.ANIMATION_THUMBS_UP_DURATION })) : 1);
    }, [isApproved, isApprovedAnimationRunning, thumbsUpScale]);
    const carouselTransactions = transactions.slice(0, 11);
    const prevCarouselTransactionLength = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(() => {
        return () => {
            prevCarouselTransactionLength.current = carouselTransactions.length;
        };
    }, [carouselTransactions.length]);
    const [currentIndex, setCurrentIndex] = (0, react_1.useState)(0);
    const [currentVisibleItems, setCurrentVisibleItems] = (0, react_1.useState)([0]);
    const [footerWidth, setFooterWidth] = (0, react_1.useState)(0);
    // optimisticIndex - value for index we are scrolling to with an arrow button or undefined after scroll is completed
    // value ensures that disabled state is applied instantly and not overridden by onViewableItemsChanged when scrolling
    // undefined makes arrow buttons react on currentIndex changes when scrolling manually
    const [optimisticIndex, setOptimisticIndex] = (0, react_1.useState)(undefined);
    const carouselRef = (0, react_1.useRef)(null);
    const visibleItemsOnEndCount = (0, react_1.useMemo)(() => {
        const lastItemWidth = transactions.length > 10 ? footerWidth : reportPreviewStyles.transactionPreviewCarouselStyle.width;
        const lastItemWithGap = lastItemWidth + styles.gap2.gap;
        const itemWithGap = reportPreviewStyles.transactionPreviewCarouselStyle.width + styles.gap2.gap;
        return Math.floor((currentWidth - 2 * styles.pl2.paddingLeft - lastItemWithGap) / itemWithGap) + 1;
    }, [transactions.length, footerWidth, reportPreviewStyles.transactionPreviewCarouselStyle.width, styles.gap2.gap, styles.pl2.paddingLeft, currentWidth]);
    const viewabilityConfig = (0, react_1.useMemo)(() => {
        return { itemVisiblePercentThreshold: 100 };
    }, []);
    // eslint-disable-next-line react-compiler/react-compiler
    const onViewableItemsChanged = (0, react_1.useRef)(({ viewableItems }) => {
        const newIndex = viewableItems.at(0)?.index;
        if (typeof newIndex === 'number') {
            setCurrentIndex(newIndex);
        }
        const viewableItemsIndexes = viewableItems.map((item) => item.index).filter((item) => item !== null);
        setCurrentVisibleItems(viewableItemsIndexes);
    }).current;
    const handleChange = (index) => {
        if (index > carouselTransactions.length - visibleItemsOnEndCount) {
            setOptimisticIndex(carouselTransactions.length - visibleItemsOnEndCount);
            carouselRef.current?.scrollToIndex({ index: carouselTransactions.length - visibleItemsOnEndCount, animated: true, viewOffset: 2 * styles.gap2.gap });
            return;
        }
        if (index < 0) {
            setOptimisticIndex(0);
            carouselRef.current?.scrollToIndex({ index: 0, animated: true, viewOffset: 2 * styles.gap2.gap });
            return;
        }
        setOptimisticIndex(index);
        carouselRef.current?.scrollToIndex({ index, animated: true, viewOffset: 2 * styles.gap2.gap });
    };
    const renderFlatlistItem = (itemInfo) => {
        if (itemInfo.index > 9) {
            return (<react_native_1.View style={[styles.flex1, styles.p5, styles.justifyContentCenter]} onLayout={(e) => setFooterWidth(e.nativeEvent.layout.width)}>
                    <Text_1.default style={{ color: colors_1.default.blue600 }}>
                        +{transactions.length - 10} {translate('common.more').toLowerCase()}
                    </Text_1.default>
                </react_native_1.View>);
        }
        return renderTransactionItem(itemInfo);
    };
    // The button should expand up to transaction width
    const buttonMaxWidth = !shouldUseNarrowLayout && reportPreviewStyles.transactionPreviewCarouselStyle.width >= CONST_1.default.REPORT.TRANSACTION_PREVIEW.CAROUSEL.MIN_WIDE_WIDTH
        ? { maxWidth: reportPreviewStyles.transactionPreviewCarouselStyle.width }
        : {};
    // We also show icons in case of Approved or Paid report for easier identification at glance
    const isIconNeeded = (0, react_1.useMemo)(() => {
        return iouSettled || isApproved;
    }, [iouSettled, isApproved]);
    const approvedOrSettledIcon = isIconNeeded && (<ImageSVG_1.default src={isApproved ? Expensicons.ThumbsUp : Expensicons.Checkmark} fill={isApproved ? theme.icon : theme.iconSuccessFill} width={variables_1.default.iconSizeExtraSmall} height={variables_1.default.iconSizeExtraSmall} contentFit="cover"/>);
    (0, react_1.useEffect)(() => {
        if (optimisticIndex === undefined ||
            optimisticIndex !== currentIndex ||
            // currentIndex is still the same as target (f.ex. 0), but not yet scrolled to the far left
            (currentVisibleItems.at(0) !== optimisticIndex && optimisticIndex !== undefined) ||
            // currentIndex reached, but not scrolled to the end
            (optimisticIndex === carouselTransactions.length - visibleItemsOnEndCount && currentVisibleItems.length !== visibleItemsOnEndCount)) {
            return;
        }
        setOptimisticIndex(undefined);
    }, [carouselTransactions.length, currentIndex, currentVisibleItems, currentVisibleItems.length, optimisticIndex, visibleItemsOnEndCount]);
    const openReportFromPreview = (0, react_1.useCallback)(() => {
        if (!iouReportID) {
            return;
        }
        Performance_1.default.markStart(CONST_1.default.TIMING.OPEN_REPORT_FROM_PREVIEW);
        Timing_1.default.start(CONST_1.default.TIMING.OPEN_REPORT_FROM_PREVIEW);
        Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(iouReportID, undefined, undefined, Navigation_1.default.getActiveRoute()));
    }, [iouReportID]);
    const reportPreviewAction = (0, react_1.useMemo)(() => {
        return (0, ReportPreviewActionUtils_1.getReportPreviewAction)(violations, isIouReportArchived || isChatReportArchived, iouReport, policy, transactions, invoiceReceiverPolicy, isPaidAnimationRunning, isSubmittingAnimationRunning);
    }, [isPaidAnimationRunning, isSubmittingAnimationRunning, violations, iouReport, policy, transactions, isIouReportArchived, invoiceReceiverPolicy, isChatReportArchived]);
    const addExpenseDropdownOptions = (0, react_1.useMemo)(() => [
        {
            value: CONST_1.default.REPORT.ADD_EXPENSE_OPTIONS.CREATE_NEW_EXPENSE,
            text: translate('iou.createExpense'),
            icon: Expensicons.Plus,
            onSelected: () => {
                if (!iouReport?.reportID) {
                    return;
                }
                if (policy && (0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(policy.id)) {
                    Navigation_1.default.navigate(ROUTES_1.default.RESTRICTED_ACTION.getRoute(policy.id));
                    return;
                }
                (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.SUBMIT, iouReport?.reportID, undefined, false, chatReportID);
            },
        },
        {
            value: CONST_1.default.REPORT.ADD_EXPENSE_OPTIONS.ADD_UNREPORTED_EXPENSE,
            text: translate('iou.addUnreportedExpense'),
            icon: Expensicons.ReceiptPlus,
            onSelected: () => {
                if (policy && (0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(policy.id)) {
                    Navigation_1.default.navigate(ROUTES_1.default.RESTRICTED_ACTION.getRoute(policy.id));
                    return;
                }
                (0, Report_1.openUnreportedExpense)(iouReport?.reportID, iouReport?.parentReportID);
            },
        },
    ], [chatReportID, iouReport?.parentReportID, iouReport?.reportID, policy, translate]);
    const isReportDeleted = action?.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
    const formattedAmount = (0, MoneyRequestReportUtils_1.getTotalAmountForIOUReportPreviewButton)(iouReport, policy, reportPreviewAction);
    const reportPreviewActions = {
        [CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.SUBMIT]: (<AnimatedSubmitButton_1.default success={isWaitingForSubmissionFromCurrentUser} text={translate('iou.submitAmount', { amount: (0, MoneyRequestReportUtils_1.getTotalAmountForIOUReportPreviewButton)(iouReport, policy, reportPreviewAction) })} onPress={() => {
                startSubmittingAnimation();
                (0, IOU_1.submitReport)(iouReport);
            }} isSubmittingAnimationRunning={isSubmittingAnimationRunning} onAnimationFinish={stopAnimation}/>),
        [CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.APPROVE]: (<Button_1.default text={translate('iou.approve')} success onPress={() => confirmApproval()}/>),
        [CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.PAY]: (<AnimatedSettlementButton_1.default onlyShowPayElsewhere={shouldShowOnlyPayElsewhere} isPaidAnimationRunning={isPaidAnimationRunning} isApprovedAnimationRunning={isApprovedAnimationRunning} canIOUBePaid={canIOUBePaidAndApproved || isPaidAnimationRunning} onAnimationFinish={stopAnimation} chatReportID={chatReportID} policyID={policy?.id} iouReport={iouReport} currency={iouReport?.currency} wrapperStyle={buttonMaxWidth} onPress={confirmPayment} onPaymentOptionsShow={onPaymentOptionsShow} onPaymentOptionsHide={onPaymentOptionsHide} formattedAmount={formattedAmount} confirmApproval={confirmApproval} enablePaymentsRoute={ROUTES_1.default.ENABLE_PAYMENTS} shouldHidePaymentOptions={!shouldShowPayButton} kycWallAnchorAlignment={{
                horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
            }} paymentMethodDropdownAnchorAlignment={{
                horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
            }} isDisabled={isOffline && !canAllowSettlement} isLoading={!isOffline && !canAllowSettlement}/>),
        [CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.EXPORT_TO_ACCOUNTING]: connectedIntegration ? (<ExportWithDropdownMenu_1.default report={iouReport} reportActions={reportActions} connectionName={connectedIntegration} wrapperStyle={styles.flexReset} dropdownAnchorAlignment={{
                horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
            }}/>) : null,
        [CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.REVIEW]: (<Button_1.default icon={Expensicons.DotIndicator} iconFill={theme.danger} iconHoverFill={theme.danger} text={translate('common.review')} onPress={() => openReportFromPreview()}/>),
        [CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.VIEW]: (<Button_1.default text={translate('common.view')} onPress={() => {
                openReportFromPreview();
            }}/>),
        [CONST_1.default.REPORT.REPORT_PREVIEW_ACTIONS.ADD_EXPENSE]: (<ButtonWithDropdownMenu_1.default onPress={() => { }} shouldAlwaysShowDropdownMenu customText={translate('iou.addExpense')} options={addExpenseDropdownOptions} isSplitButton={false} anchorAlignment={{
                horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
            }}/>),
    };
    const adjustScroll = (0, react_1.useCallback)(() => {
        // Workaround for a known React Native bug on Android (https://github.com/facebook/react-native/issues/27504):
        // When the FlatList is scrolled to the end and the last item is deleted, a blank space is left behind.
        // To fix this, we detect when onEndReached is triggered due to an item deletion,
        // and programmatically scroll to the end to fill the space.
        if (carouselTransactions.length >= prevCarouselTransactionLength.current || !shouldAdjustScroll_1.default) {
            return;
        }
        prevCarouselTransactionLength.current = carouselTransactions.length;
        carouselRef.current?.scrollToEnd();
    }, [carouselTransactions.length]);
    return (<react_native_1.View onLayout={onWrapperLayout} testID="MoneyRequestReportPreviewContent-wrapper" fsClass={forwardedFSClass}>
            <OfflineWithFeedback_1.default pendingAction={iouReport?.pendingFields?.preview} shouldDisableOpacity={!!(action.pendingAction ?? action.isOptimisticAction)} needsOffscreenAlphaCompositing style={styles.mt1}>
                <react_native_1.View style={[styles.chatItemMessage, isReportDeleted && [styles.cursorDisabled, styles.pointerEventsAuto], containerStyles]} onLayout={onCarouselLayout} testID="carouselWidthSetter">
                    <PressableWithoutFeedback_1.default onPress={onPress} onPressIn={() => (0, DeviceCapabilities_1.canUseTouchScreen)() && ControlSelection_1.default.block()} onPressOut={() => ControlSelection_1.default.unblock()} onLongPress={(event) => {
            if (!shouldDisplayContextMenu) {
                return;
            }
            (0, ShowContextMenuContext_1.showContextMenuForReport)(event, contextMenuAnchor, chatReportID, action, checkIfContextMenuActive);
        }} shouldUseHapticsOnLongPress style={[
            styles.flexRow,
            styles.justifyContentBetween,
            StyleUtils.getBackgroundColorStyle(theme.cardBG),
            shouldShowBorder ? styles.borderedContentCardLarge : styles.reportContainerBorderRadius,
            isReportDeleted && styles.pointerEventsNone,
        ]} role={(0, utils_1.getButtonRole)(true)} isNested accessibilityLabel={translate('iou.viewDetails')}>
                        <react_native_1.View style={[
            StyleUtils.getBackgroundColorStyle(theme.cardBG),
            styles.reportContainerBorderRadius,
            styles.w100,
            (isHovered || isScanning || isWhisper) && styles.reportPreviewBoxHoverBorder,
        ]}>
                            <react_native_1.View style={[reportPreviewStyles.wrapperStyle]}>
                                <react_native_1.View style={[reportPreviewStyles.contentContainerStyle, styles.gap4]}>
                                    <react_native_1.View style={[styles.expenseAndReportPreviewTextContainer, styles.overflowHidden]}>
                                        <react_native_1.View style={[styles.flexRow, styles.justifyContentBetween, styles.flexShrink1, styles.gap1]}>
                                            <react_native_1.View style={[styles.flexColumn, styles.gap1, styles.flexShrink1]}>
                                                <react_native_1.View style={[styles.flexRow, styles.mw100, styles.flexShrink1]}>
                                                    <react_native_reanimated_1.default.View style={[styles.flexRow, styles.alignItemsCenter, previewMessageStyle, styles.flexShrink1]}>
                                                        <Text_1.default style={[styles.headerText]} testID="MoneyRequestReportPreview-reportName">
                                                            {(0, ReportUtils_1.getMoneyReportPreviewName)(action, iouReport, isInvoice)}
                                                        </Text_1.default>
                                                    </react_native_reanimated_1.default.View>
                                                </react_native_1.View>
                                                {showStatusAndSkeleton && shouldShowSkeleton ? (<MoneyReportHeaderStatusBarSkeleton_1.default />) : (!shouldShowEmptyPlaceholder && (<react_native_1.View style={[styles.flexRow, styles.justifyContentStart, styles.alignItemsCenter]}>
                                                            {isIconNeeded && <react_native_1.View style={[styles.alignItemsCenter, styles.lh16, styles.mr1]}>{approvedOrSettledIcon}</react_native_1.View>}
                                                            <Text_1.default style={[styles.textLabelSupporting, styles.lh16]}>{`${reportStatus} ${CONST_1.default.DOT_SEPARATOR} ${expenseCount}`}</Text_1.default>
                                                        </react_native_1.View>))}
                                            </react_native_1.View>
                                            {!shouldUseNarrowLayout && transactions.length > 2 && reportPreviewStyles.expenseCountVisible && (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter]}>
                                                    <Pressable_1.PressableWithFeedback accessibilityRole="button" accessible accessibilityLabel="button" style={[styles.reportPreviewArrowButton, { backgroundColor: theme.buttonDefaultBG }]} onPress={() => handleChange(currentIndex - 1)} disabled={optimisticIndex !== undefined ? optimisticIndex === 0 : currentIndex === 0 && currentVisibleItems.at(0) === 0} disabledStyle={[styles.cursorDefault, styles.buttonOpacityDisabled]}>
                                                        <Icon_1.default src={Expensicons.BackArrow} small fill={theme.icon} isButtonIcon/>
                                                    </Pressable_1.PressableWithFeedback>
                                                    <Pressable_1.PressableWithFeedback accessibilityRole="button" accessible accessibilityLabel="button" style={[styles.reportPreviewArrowButton, { backgroundColor: theme.buttonDefaultBG }]} onPress={() => handleChange(currentIndex + 1)} disabled={optimisticIndex
                ? optimisticIndex + visibleItemsOnEndCount >= carouselTransactions.length
                : currentVisibleItems.at(-1) === carouselTransactions.length - 1} disabledStyle={[styles.cursorDefault, styles.buttonOpacityDisabled]}>
                                                        <Icon_1.default src={Expensicons.ArrowRight} small fill={theme.icon} isButtonIcon/>
                                                    </Pressable_1.PressableWithFeedback>
                                                </react_native_1.View>)}
                                        </react_native_1.View>
                                    </react_native_1.View>
                                    {!currentWidth || shouldShowLoading || shouldShowLoadingDeferred ? (<react_native_1.View style={[
                {
                    height: CONST_1.default.REPORT.TRANSACTION_PREVIEW.CAROUSEL.WIDE_HEIGHT,
                    minWidth: shouldUseNarrowLayout
                        ? CONST_1.default.REPORT.TRANSACTION_PREVIEW.CAROUSEL.MIN_NARROW_WIDTH
                        : CONST_1.default.REPORT.TRANSACTION_PREVIEW.CAROUSEL.MIN_WIDE_WIDTH,
                },
                styles.justifyContentCenter,
                styles.mtn1,
            ]}>
                                            <react_native_1.ActivityIndicator color={theme.spinner} size={40}/>
                                        </react_native_1.View>) : (<react_native_1.View style={[styles.flex1, styles.flexColumn, styles.overflowVisible]}>
                                            <react_native_1.FlatList snapToAlignment="start" decelerationRate="fast" snapToInterval={reportPreviewStyles.transactionPreviewCarouselStyle.width + styles.gap2.gap} horizontal data={carouselTransactions} ref={carouselRef} nestedScrollEnabled bounces={false} keyExtractor={(item) => `${item.transactionID}_${reportPreviewStyles.transactionPreviewCarouselStyle.width}`} contentContainerStyle={[styles.gap2]} style={reportPreviewStyles.flatListStyle} showsHorizontalScrollIndicator={false} renderItem={renderFlatlistItem} onViewableItemsChanged={onViewableItemsChanged} onEndReached={adjustScroll} viewabilityConfig={viewabilityConfig} ListFooterComponent={<react_native_1.View style={styles.pl2}/>} ListHeaderComponent={<react_native_1.View style={styles.pr2}/>}/>
                                            {shouldShowEmptyPlaceholder && <EmptyMoneyRequestReportPreview_1.default />}
                                        </react_native_1.View>)}
                                    <react_native_1.View style={[styles.expenseAndReportPreviewTextContainer]}>
                                        <react_native_1.View style={[totalAmountStyle, styles.justifyContentBetween, styles.gap4, StyleUtils.getMinimumHeight(variables_1.default.h28)]}>
                                            {/* height is needed to avoid flickering on animation */}
                                            <react_native_1.View style={[buttonMaxWidth, styles.flex1, { height: variables_1.default.h40 }]}>{reportPreviewActions[reportPreviewAction]}</react_native_1.View>
                                            {transactions.length > 1 && (<react_native_1.View style={[styles.flexRow, shouldUseNarrowLayout ? styles.justifyContentBetween : styles.gap2, styles.alignItemsCenter]}>
                                                    <Text_1.default style={[styles.textLabelSupporting]} numberOfLines={1}>
                                                        {translate('common.total')}
                                                    </Text_1.default>
                                                    <Text_1.default style={[styles.headerText]}>{(0, CurrencyUtils_1.convertToDisplayString)(totalDisplaySpend, iouReport?.currency)}</Text_1.default>
                                                </react_native_1.View>)}
                                        </react_native_1.View>
                                    </react_native_1.View>
                                </react_native_1.View>
                            </react_native_1.View>
                        </react_native_1.View>
                    </PressableWithoutFeedback_1.default>
                </react_native_1.View>
                {isHoldMenuVisible && !!iouReport && !!requestType && (<ProcessMoneyReportHoldMenu_1.default nonHeldAmount={!hasOnlyHeldExpenses && hasValidNonHeldAmount ? nonHeldAmount : undefined} requestType={requestType} fullAmount={fullAmount} onClose={() => setIsHoldMenuVisible(false)} isVisible={isHoldMenuVisible} paymentType={paymentType} chatReport={chatReport} moneyRequestReport={iouReport} transactionCount={numberOfRequests} startAnimation={() => {
                if (requestType === CONST_1.default.IOU.REPORT_ACTION_TYPE.APPROVE) {
                    startApprovedAnimation();
                }
                else {
                    startAnimation();
                }
            }}/>)}
            </OfflineWithFeedback_1.default>
        </react_native_1.View>);
}
MoneyRequestReportPreviewContent.displayName = 'MoneyRequestReportPreviewContent';
exports.default = MoneyRequestReportPreviewContent;
