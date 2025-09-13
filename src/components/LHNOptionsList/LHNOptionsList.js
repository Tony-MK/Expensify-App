"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const flash_list_1 = require("@shopify/flash-list");
const react_1 = require("react");
const react_native_1 = require("react-native");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const LottieAnimations_1 = require("@components/LottieAnimations");
const ScrollOffsetContextProvider_1 = require("@components/ScrollOffsetContextProvider");
const TextBlock_1 = require("@components/TextBlock");
const useLHNEstimatedListSize_1 = require("@hooks/useLHNEstimatedListSize");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useRootNavigationState_1 = require("@hooks/useRootNavigationState");
const useScrollEventEmitter_1 = require("@hooks/useScrollEventEmitter");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DraftCommentUtils_1 = require("@libs/DraftCommentUtils");
const getPlatform_1 = require("@libs/getPlatform");
const Log_1 = require("@libs/Log");
const ModifiedExpenseMessage_1 = require("@libs/ModifiedExpenseMessage");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TooltipUtils_1 = require("@libs/TooltipUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const OptionRowLHNData_1 = require("./OptionRowLHNData");
const OptionRowRendererComponent_1 = require("./OptionRowRendererComponent");
const keyExtractor = (item) => `report_${item.reportID}`;
function LHNOptionsList({ style, contentContainerStyles, data, onSelectRow, optionMode, shouldDisableFocusOptions = false, onFirstItemRendered = () => { } }) {
    const { saveScrollOffset, getScrollOffset, saveScrollIndex, getScrollIndex } = (0, react_1.useContext)(ScrollOffsetContextProvider_1.ScrollOffsetContext);
    const { isOffline } = (0, useNetwork_1.default)();
    const flashListRef = (0, react_1.useRef)(null);
    const route = (0, native_1.useRoute)();
    const isScreenFocused = (0, native_1.useIsFocused)();
    const [reports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: false });
    const [reportAttributes] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { selector: (attributes) => attributes?.reports, canBeMissing: false });
    const [reportNameValuePairs] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS, { canBeMissing: true });
    const [reportActions] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, { canBeMissing: false });
    const [policy] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: false });
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: true });
    const [transactions] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, { canBeMissing: false });
    const [draftComments] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT, { canBeMissing: false });
    const [transactionViolations] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS, { canBeMissing: false });
    const [dismissedProductTraining, dismissedProductTrainingMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_DISMISSED_PRODUCT_TRAINING, { canBeMissing: true });
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: true });
    const [introSelected] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_INTRO_SELECTED, { canBeMissing: true });
    const [isFullscreenVisible] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FULLSCREEN_VISIBILITY, { canBeMissing: true });
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate, preferredLocale, localeCompare } = (0, useLocalize_1.default)();
    const estimatedListSize = (0, useLHNEstimatedListSize_1.default)();
    const isReportsSplitNavigatorLast = (0, useRootNavigationState_1.default)((state) => state?.routes?.at(-1)?.name === NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR);
    const shouldShowEmptyLHN = data.length === 0;
    const estimatedItemSize = optionMode === CONST_1.default.OPTION_MODE.COMPACT ? variables_1.default.optionRowHeightCompact : variables_1.default.optionRowHeight;
    const platform = (0, getPlatform_1.default)();
    const isWebOrDesktop = platform === CONST_1.default.PLATFORM.WEB || platform === CONST_1.default.PLATFORM.DESKTOP;
    const isGBRorRBRTooltipDismissed = !(0, isLoadingOnyxValue_1.default)(dismissedProductTrainingMetadata) && (0, TooltipUtils_1.default)(CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.GBR_RBR_CHAT, dismissedProductTraining);
    const firstReportIDWithGBRorRBR = (0, react_1.useMemo)(() => {
        if (isGBRorRBRTooltipDismissed) {
            return undefined;
        }
        const firstReportWithGBRorRBR = data.find((report) => {
            const itemReportErrors = reportAttributes?.[report.reportID]?.reportErrors;
            if (!report) {
                return false;
            }
            if (!(0, EmptyObject_1.isEmptyObject)(itemReportErrors)) {
                return true;
            }
            const hasGBR = reportAttributes?.[report.reportID]?.requiresAttention;
            return hasGBR;
        });
        return firstReportWithGBRorRBR?.reportID;
    }, [isGBRorRBRTooltipDismissed, data, reportAttributes]);
    // When the first item renders we want to call the onFirstItemRendered callback.
    // At this point in time we know that the list is actually displaying items.
    const hasCalledOnLayout = react_1.default.useRef(false);
    const onLayoutItem = (0, react_1.useCallback)(() => {
        if (hasCalledOnLayout.current) {
            return;
        }
        hasCalledOnLayout.current = true;
        onFirstItemRendered();
    }, [onFirstItemRendered]);
    // Controls the visibility of the educational tooltip based on user scrolling.
    // Hides the tooltip when the user is scrolling and displays it once scrolling stops.
    const triggerScrollEvent = (0, useScrollEventEmitter_1.default)();
    const emptyLHNSubtitle = (0, react_1.useMemo)(() => (<react_native_1.View style={[styles.alignItemsCenter, styles.flexRow, styles.justifyContentCenter, styles.flexWrap, styles.textAlignCenter]}>
                <TextBlock_1.default color={theme.textSupporting} textStyles={[styles.textAlignCenter, styles.textNormal]} text={translate('common.emptyLHN.subtitleText1')}/>
                <Icon_1.default src={Expensicons.MagnifyingGlass} width={variables_1.default.emptyLHNIconWidth} height={variables_1.default.emptyLHNIconHeight} fill={theme.icon} small additionalStyles={styles.mh1}/>
                <TextBlock_1.default color={theme.textSupporting} textStyles={[styles.textAlignCenter, styles.textNormal]} text={translate('common.emptyLHN.subtitleText2')}/>
                <Icon_1.default src={Expensicons.Plus} width={variables_1.default.emptyLHNIconWidth} height={variables_1.default.emptyLHNIconHeight} fill={theme.icon} small additionalStyles={styles.mh1}/>
                <TextBlock_1.default color={theme.textSupporting} textStyles={[styles.textAlignCenter, styles.textNormal]} text={translate('common.emptyLHN.subtitleText3')}/>
            </react_native_1.View>), [
        styles.alignItemsCenter,
        styles.flexRow,
        styles.justifyContentCenter,
        styles.flexWrap,
        styles.textAlignCenter,
        styles.mh1,
        theme.icon,
        theme.textSupporting,
        styles.textNormal,
        translate,
    ]);
    /**
     * Function which renders a row in the list
     */
    const renderItem = (0, react_1.useCallback)(({ item }) => {
        const reportID = item.reportID;
        const itemParentReport = reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${item.parentReportID}`];
        const itemReportNameValuePairs = reportNameValuePairs?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${reportID}`];
        const chatReport = reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${item.chatReportID}`];
        const itemReportActions = reportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`];
        const itemOneTransactionThreadReport = reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${(0, ReportActionsUtils_1.getOneTransactionThreadReportID)(item, chatReport, itemReportActions, isOffline)}`];
        const itemParentReportActions = reportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${item?.parentReportID}`];
        const itemParentReportAction = item?.parentReportActionID ? itemParentReportActions?.[item?.parentReportActionID] : undefined;
        const itemReportAttributes = reportAttributes?.[reportID];
        let invoiceReceiverPolicyID = '-1';
        if (item?.invoiceReceiver && 'policyID' in item.invoiceReceiver) {
            invoiceReceiverPolicyID = item.invoiceReceiver.policyID;
        }
        if (itemParentReport?.invoiceReceiver && 'policyID' in itemParentReport.invoiceReceiver) {
            invoiceReceiverPolicyID = itemParentReport.invoiceReceiver.policyID;
        }
        const itemInvoiceReceiverPolicy = policy?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${invoiceReceiverPolicyID}`];
        const iouReportIDOfLastAction = (0, OptionsListUtils_1.getIOUReportIDOfLastAction)(item);
        const itemIouReportReportActions = iouReportIDOfLastAction ? reportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${iouReportIDOfLastAction}`] : undefined;
        const itemPolicy = policy?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${item?.policyID}`];
        const transactionID = (0, ReportActionsUtils_1.isMoneyRequestAction)(itemParentReportAction)
            ? ((0, ReportActionsUtils_1.getOriginalMessage)(itemParentReportAction)?.IOUTransactionID ?? CONST_1.default.DEFAULT_NUMBER_ID)
            : CONST_1.default.DEFAULT_NUMBER_ID;
        const itemTransaction = transactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`];
        const hasDraftComment = (0, DraftCommentUtils_1.isValidDraftComment)(draftComments?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT}${reportID}`]);
        const isReportArchived = !!itemReportNameValuePairs?.private_isArchived;
        const canUserPerformWrite = (0, ReportUtils_1.canUserPerformWriteAction)(item, isReportArchived);
        const sortedReportActions = (0, ReportActionsUtils_1.getSortedReportActionsForDisplay)(itemReportActions, canUserPerformWrite);
        const lastReportAction = sortedReportActions.at(0);
        // Get the transaction for the last report action
        const lastReportActionTransactionID = (0, ReportActionsUtils_1.isMoneyRequestAction)(lastReportAction)
            ? ((0, ReportActionsUtils_1.getOriginalMessage)(lastReportAction)?.IOUTransactionID ?? CONST_1.default.DEFAULT_NUMBER_ID)
            : CONST_1.default.DEFAULT_NUMBER_ID;
        const lastReportActionTransaction = transactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${lastReportActionTransactionID}`];
        // SidebarUtils.getOptionData in OptionRowLHNData does not get re-evaluated when the linked task report changes, so we have the lastMessageTextFromReport evaluation logic here
        let lastActorDetails = item?.lastActorAccountID && personalDetails?.[item.lastActorAccountID] ? personalDetails[item.lastActorAccountID] : null;
        if (!lastActorDetails && lastReportAction) {
            const lastActorDisplayName = lastReportAction?.person?.[0]?.text;
            lastActorDetails = lastActorDisplayName
                ? {
                    displayName: lastActorDisplayName,
                    accountID: item?.lastActorAccountID,
                }
                : null;
        }
        const movedFromReport = reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${(0, ModifiedExpenseMessage_1.getMovedReportID)(lastReportAction, CONST_1.default.REPORT.MOVE_TYPE.FROM)}`];
        const movedToReport = reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${(0, ModifiedExpenseMessage_1.getMovedReportID)(lastReportAction, CONST_1.default.REPORT.MOVE_TYPE.TO)}`];
        const lastMessageTextFromReport = (0, OptionsListUtils_1.getLastMessageTextForReport)({
            report: item,
            lastActorDetails,
            movedFromReport,
            movedToReport,
            policy: itemPolicy,
            isReportArchived: !!itemReportNameValuePairs?.private_isArchived,
        });
        const shouldShowRBRorGBRTooltip = firstReportIDWithGBRorRBR === reportID;
        return (<OptionRowLHNData_1.default reportID={reportID} fullReport={item} reportAttributes={itemReportAttributes} oneTransactionThreadReport={itemOneTransactionThreadReport} reportNameValuePairs={itemReportNameValuePairs} reportActions={itemReportActions} parentReportAction={itemParentReportAction} iouReportReportActions={itemIouReportReportActions} policy={itemPolicy} invoiceReceiverPolicy={itemInvoiceReceiverPolicy} personalDetails={personalDetails ?? {}} transaction={itemTransaction} lastReportActionTransaction={lastReportActionTransaction} receiptTransactions={transactions} viewMode={optionMode} isOptionFocused={!shouldDisableFocusOptions} lastMessageTextFromReport={lastMessageTextFromReport} onSelectRow={onSelectRow} preferredLocale={preferredLocale} hasDraftComment={hasDraftComment} transactionViolations={transactionViolations} onLayout={onLayoutItem} shouldShowRBRorGBRTooltip={shouldShowRBRorGBRTooltip} activePolicyID={activePolicyID} onboardingPurpose={introSelected?.choice} isFullscreenVisible={isFullscreenVisible} isReportsSplitNavigatorLast={isReportsSplitNavigatorLast} isScreenFocused={isScreenFocused} localeCompare={localeCompare} isReportArchived={isReportArchived}/>);
    }, [
        draftComments,
        onSelectRow,
        optionMode,
        personalDetails,
        policy,
        preferredLocale,
        reportActions,
        reports,
        reportAttributes,
        reportNameValuePairs,
        shouldDisableFocusOptions,
        transactions,
        transactionViolations,
        onLayoutItem,
        isOffline,
        firstReportIDWithGBRorRBR,
        activePolicyID,
        introSelected?.choice,
        isFullscreenVisible,
        isReportsSplitNavigatorLast,
        isScreenFocused,
        localeCompare,
    ]);
    const extraData = (0, react_1.useMemo)(() => [
        reportActions,
        reports,
        reportAttributes,
        reportNameValuePairs,
        transactionViolations,
        policy,
        personalDetails,
        data.length,
        draftComments,
        optionMode,
        preferredLocale,
        transactions,
        isOffline,
        isScreenFocused,
        isReportsSplitNavigatorLast,
    ], [
        reportActions,
        reports,
        reportAttributes,
        reportNameValuePairs,
        transactionViolations,
        policy,
        personalDetails,
        data.length,
        draftComments,
        optionMode,
        preferredLocale,
        transactions,
        isOffline,
        isScreenFocused,
        isReportsSplitNavigatorLast,
    ]);
    const previousOptionMode = (0, usePrevious_1.default)(optionMode);
    (0, react_1.useEffect)(() => {
        if (previousOptionMode === null || previousOptionMode === optionMode || !flashListRef.current) {
            return;
        }
        if (!flashListRef.current) {
            return;
        }
        // If the option mode changes want to scroll to the top of the list because rendered items will have different height.
        flashListRef.current.scrollToOffset({ offset: 0 });
    }, [previousOptionMode, optionMode]);
    const onScroll = (0, react_1.useCallback)((e) => {
        // If the layout measurement is 0, it means the FlashList is not displayed but the onScroll may be triggered with offset value 0.
        // We should ignore this case.
        if (e.nativeEvent.layoutMeasurement.height === 0) {
            return;
        }
        saveScrollOffset(route, e.nativeEvent.contentOffset.y);
        if (isWebOrDesktop) {
            saveScrollIndex(route, Math.floor(e.nativeEvent.contentOffset.y / estimatedItemSize));
        }
        triggerScrollEvent();
    }, [estimatedItemSize, isWebOrDesktop, route, saveScrollIndex, saveScrollOffset, triggerScrollEvent]);
    const onLayout = (0, react_1.useCallback)(() => {
        const offset = getScrollOffset(route);
        if (!(offset && flashListRef.current) || isWebOrDesktop) {
            return;
        }
        // We need to use requestAnimationFrame to make sure it will scroll properly on iOS.
        requestAnimationFrame(() => {
            if (!(offset && flashListRef.current)) {
                return;
            }
            flashListRef.current.scrollToOffset({ offset });
        });
    }, [getScrollOffset, route, isWebOrDesktop]);
    // eslint-disable-next-line rulesdir/prefer-early-return
    (0, react_1.useEffect)(() => {
        if (shouldShowEmptyLHN) {
            Log_1.default.info('Woohoo! All caught up. Was rendered', false, {
                reportsCount: Object.keys(reports ?? {}).length,
                reportActionsCount: Object.keys(reportActions ?? {}).length,
                policyCount: Object.keys(policy ?? {}).length,
                personalDetailsCount: Object.keys(personalDetails ?? {}).length,
                route,
                reportsIDsFromUseReportsCount: data.length,
            });
        }
    }, [data, shouldShowEmptyLHN, route, reports, reportActions, policy, personalDetails]);
    return (<react_native_1.View style={[style ?? styles.flex1, shouldShowEmptyLHN ? styles.emptyLHNWrapper : undefined]}>
            {shouldShowEmptyLHN ? (<BlockingView_1.default animation={LottieAnimations_1.default.Fireworks} animationStyles={styles.emptyLHNAnimation} animationWebStyle={styles.emptyLHNAnimation} title={translate('common.emptyLHN.title')} CustomSubtitle={emptyLHNSubtitle} accessibilityLabel={translate('common.emptyLHN.title')}/>) : (<flash_list_1.FlashList ref={flashListRef} indicatorStyle="white" keyboardShouldPersistTaps="always" CellRendererComponent={OptionRowRendererComponent_1.default} contentContainerStyle={react_native_1.StyleSheet.flatten(contentContainerStyles)} data={data} testID="lhn-options-list" keyExtractor={keyExtractor} renderItem={renderItem} estimatedItemSize={estimatedItemSize} overrideProps={{ estimatedHeightSize: estimatedItemSize * CONST_1.default.LHN_VIEWPORT_ITEM_COUNT }} extraData={extraData} showsVerticalScrollIndicator={false} onLayout={onLayout} onScroll={onScroll} estimatedListSize={estimatedListSize} initialScrollIndex={isWebOrDesktop ? getScrollIndex(route) : undefined}/>)}
        </react_native_1.View>);
}
LHNOptionsList.displayName = 'LHNOptionsList';
exports.default = (0, react_1.memo)(LHNOptionsList);
