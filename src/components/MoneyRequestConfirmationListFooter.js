"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const expensify_common_1 = require("expensify-common");
const fast_equals_1 = require("fast-equals");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const DistanceRequestUtils_1 = require("@libs/DistanceRequestUtils");
const IOUUtils_1 = require("@libs/IOUUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PerDiemRequestUtils_1 = require("@libs/PerDiemRequestUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReceiptUtils_1 = require("@libs/ReceiptUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TagsOptionsListUtils_1 = require("@libs/TagsOptionsListUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const tryResolveUrlFromApiRoot_1 = require("@libs/tryResolveUrlFromApiRoot");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const Badge_1 = require("./Badge");
const ConfirmedRoute_1 = require("./ConfirmedRoute");
const MentionReportContext_1 = require("./HTMLEngineProvider/HTMLRenderers/MentionReportRenderer/MentionReportContext");
const Expensicons = require("./Icon/Expensicons");
const MenuItem_1 = require("./MenuItem");
const MenuItemWithTopDescription_1 = require("./MenuItemWithTopDescription");
const PDFThumbnail_1 = require("./PDFThumbnail");
const PressableWithoutFocus_1 = require("./Pressable/PressableWithoutFocus");
const ReceiptEmptyState_1 = require("./ReceiptEmptyState");
const ReceiptImage_1 = require("./ReceiptImage");
const ShowContextMenuContext_1 = require("./ShowContextMenuContext");
function MoneyRequestConfirmationListFooter({ action, currency, didConfirm, distance, formattedAmount, formattedAmountPerAttendee, formError, hasRoute, iouAttendees, iouCategory, iouComment, iouCreated, iouCurrencyCode, iouIsBillable, iouMerchant, iouType, isCategoryRequired, isDistanceRequest, isManualDistanceRequest, isPerDiemRequest, isMerchantEmpty, isMerchantRequired, isPolicyExpenseChat, isReadOnly, isTypeInvoice, onToggleBillable, policy, policyTags, policyTagLists, rate, receiptFilename, receiptPath, reportActionID, reportID, selectedParticipants, shouldDisplayFieldError, shouldDisplayReceipt, shouldShowCategories, shouldShowMerchant, shouldShowSmartScanFields, shouldShowAmountField = true, shouldShowTax, transaction, transactionID, unit, onPDFLoadError, onPDFPassword, iouIsReimbursable, onToggleReimbursable, isReceiptEditable = false, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, toLocaleDigit, localeCompare } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [allPolicies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const [allReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: true });
    const [reportNameValuePairs] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS, { canBeMissing: true });
    const [outstandingReportsByPolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID, {
        canBeMissing: true,
    });
    const [currentUserLogin] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (session) => session?.email, canBeMissing: true });
    const allOutstandingReports = (0, react_1.useMemo)(() => {
        const outstandingReports = Object.values(outstandingReportsByPolicyID ?? {}).flatMap((outstandingReportsPolicy) => Object.values(outstandingReportsPolicy ?? {}));
        return outstandingReports.filter((report) => {
            const reportNameValuePair = reportNameValuePairs?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report?.reportID}`];
            return !(0, ReportUtils_1.isArchivedReport)(reportNameValuePair);
        });
    }, [outstandingReportsByPolicyID, reportNameValuePairs]);
    const shouldShowTags = (0, react_1.useMemo)(() => isPolicyExpenseChat && (0, TagsOptionsListUtils_1.hasEnabledTags)(policyTagLists), [isPolicyExpenseChat, policyTagLists]);
    const shouldShowAttendees = (0, react_1.useMemo)(() => (0, TransactionUtils_1.shouldShowAttendees)(iouType, policy), [iouType, policy]);
    const hasPendingWaypoints = transaction && (0, TransactionUtils_1.isFetchingWaypointsFromServer)(transaction);
    const hasErrors = !(0, EmptyObject_1.isEmptyObject)(transaction?.errors) || !(0, EmptyObject_1.isEmptyObject)(transaction?.errorFields?.route) || !(0, EmptyObject_1.isEmptyObject)(transaction?.errorFields?.waypoints);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const shouldShowMap = isDistanceRequest && !isManualDistanceRequest && !!(hasErrors || hasPendingWaypoints || iouType !== CONST_1.default.IOU.TYPE.SPLIT || !isReadOnly);
    const isFromGlobalCreate = !!transaction?.isFromGlobalCreate;
    const senderWorkspace = (0, react_1.useMemo)(() => {
        const senderWorkspaceParticipant = selectedParticipants.find((participant) => participant.isSender);
        return allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${senderWorkspaceParticipant?.policyID}`];
    }, [allPolicies, selectedParticipants]);
    const canUpdateSenderWorkspace = (0, react_1.useMemo)(() => {
        const isInvoiceRoomParticipant = selectedParticipants.some((participant) => participant.isInvoiceRoom);
        return (0, PolicyUtils_1.canSendInvoice)(allPolicies, currentUserLogin) && isFromGlobalCreate && !isInvoiceRoomParticipant;
    }, [allPolicies, currentUserLogin, selectedParticipants, isFromGlobalCreate]);
    /**
     * We need to check if the transaction report exists first in order to prevent the outstanding reports from being used.
     * Also we need to check if transaction report exists in outstanding reports in order to show a correct report name.
     */
    const transactionReport = transaction?.reportID ? Object.values(allReports ?? {}).find((report) => report?.reportID === transaction.reportID) : undefined;
    const policyID = selectedParticipants?.at(0)?.policyID;
    const selectedPolicy = allPolicies?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`];
    const shouldUseTransactionReport = !!transactionReport && (0, ReportUtils_1.isReportOutstanding)(transactionReport, policyID, undefined, false);
    const availableOutstandingReports = (0, ReportUtils_1.getOutstandingReportsForUser)(policyID, selectedParticipants?.at(0)?.ownerAccountID, allReports, reportNameValuePairs, false).sort((a, b) => localeCompare(a?.reportName?.toLowerCase() ?? '', b?.reportName?.toLowerCase() ?? ''));
    const iouReportID = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`]?.iouReportID;
    const outstandingReportID = isPolicyExpenseChat ? (iouReportID ?? availableOutstandingReports.at(0)?.reportID) : reportID;
    let selectedReportID = shouldUseTransactionReport ? transactionReport.reportID : outstandingReportID;
    const selectedReport = (0, react_1.useMemo)(() => {
        if (!selectedReportID) {
            return;
        }
        return allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${selectedReportID}`];
    }, [allReports, selectedReportID]);
    let reportName = (0, ReportUtils_1.getReportName)(selectedReport, selectedPolicy);
    if (!reportName) {
        const optimisticReport = (0, ReportUtils_1.buildOptimisticExpenseReport)(reportID, selectedPolicy?.id, selectedPolicy?.ownerAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID, Number(formattedAmount), currency);
        selectedReportID = !selectedReportID ? optimisticReport.reportID : selectedReportID;
        reportName = (0, ReportUtils_1.populateOptimisticReportFormula)(selectedPolicy?.fieldList?.text_title?.defaultValue ?? '', optimisticReport, selectedPolicy);
    }
    // When creating an expense in an individual report, the report field becomes read-only
    // since the destination is already determined and there's no need to show a selectable list.
    const shouldReportBeEditable = (isFromGlobalCreate ? allOutstandingReports.length > 1 : availableOutstandingReports.length > 1) && !(0, ReportUtils_1.isMoneyRequestReport)(reportID, allReports);
    const isTypeSend = iouType === CONST_1.default.IOU.TYPE.PAY;
    const taxRates = policy?.taxRates ?? null;
    // In Send Money and Split Bill with Scan flow, we don't allow the Merchant or Date to be edited. For distance requests, don't show the merchant as there's already another "Distance" menu item
    const shouldShowDate = (shouldShowSmartScanFields || isDistanceRequest) && !isTypeSend;
    // Determines whether the tax fields can be modified.
    // The tax fields can only be modified if the component is not in read-only mode
    // and it is not a distance request.
    const canModifyTaxFields = !isReadOnly && !isDistanceRequest && !isPerDiemRequest;
    // A flag for showing the billable field
    const shouldShowBillable = policy?.disabledFields?.defaultBillable === false;
    const shouldShowReimbursable = isPolicyExpenseChat && policy?.disabledFields?.reimbursable === false && !(0, TransactionUtils_1.isCardTransaction)(transaction) && !isTypeInvoice;
    // Calculate the formatted tax amount based on the transaction's tax amount and the IOU currency code
    const taxAmount = (0, TransactionUtils_1.getTaxAmount)(transaction, false);
    const formattedTaxAmount = (0, CurrencyUtils_1.convertToDisplayString)(taxAmount, iouCurrencyCode);
    // Get the tax rate title based on the policy and transaction
    const taxRateTitle = (0, TransactionUtils_1.getTaxName)(policy, transaction);
    // Determine if the merchant error should be displayed
    const shouldDisplayMerchantError = isMerchantRequired && (shouldDisplayFieldError || formError === 'iou.error.invalidMerchant') && isMerchantEmpty;
    const shouldDisplayDistanceRateError = formError === 'iou.error.invalidRate';
    const showReceiptEmptyState = (0, IOUUtils_1.shouldShowReceiptEmptyState)(iouType, action, policy, isPerDiemRequest, isManualDistanceRequest);
    // The per diem custom unit
    const perDiemCustomUnit = (0, PolicyUtils_1.getPerDiemCustomUnit)(policy);
    const { image: receiptImage, thumbnail: receiptThumbnail, isThumbnail, fileExtension, isLocalFile, } = receiptPath && receiptFilename ? (0, ReceiptUtils_1.getThumbnailAndImageURIs)(transaction, receiptPath, receiptFilename) : {};
    const resolvedThumbnail = isLocalFile ? receiptThumbnail : (0, tryResolveUrlFromApiRoot_1.default)(receiptThumbnail ?? '');
    const resolvedReceiptImage = isLocalFile ? receiptImage : (0, tryResolveUrlFromApiRoot_1.default)(receiptImage ?? '');
    const contextMenuContextValue = (0, react_1.useMemo)(() => ({
        anchor: null,
        report: undefined,
        isReportArchived: false,
        action: undefined,
        checkIfContextMenuActive: () => { },
        onShowContextMenu: () => { },
        isDisabled: true,
        shouldDisplayContextMenu: false,
    }), []);
    const tagVisibility = (0, react_1.useMemo)(() => (0, TagsOptionsListUtils_1.getTagVisibility)({
        shouldShowTags,
        policy,
        policyTags,
        transaction,
    }), [shouldShowTags, policy, policyTags, transaction]);
    const previousTagsVisibility = (0, usePrevious_1.default)(tagVisibility.map((v) => v.shouldShow)) ?? [];
    const mentionReportContextValue = (0, react_1.useMemo)(() => ({ currentReportID: reportID, exactlyMatch: true }), [reportID]);
    const fields = [
        {
            item: (<MenuItemWithTopDescription_1.default key={translate('iou.amount')} shouldShowRightIcon={!isReadOnly && !isDistanceRequest} title={formattedAmount} description={translate('iou.amount')} interactive={!isReadOnly} onPress={() => {
                    if (isDistanceRequest || !transactionID) {
                        return;
                    }
                    Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_AMOUNT.getRoute(action, iouType, transactionID, reportID, reportActionID, CONST_1.default.IOU.PAGE_INDEX.CONFIRM, Navigation_1.default.getActiveRoute()));
                }} style={[styles.moneyRequestMenuItem, styles.mt2]} titleStyle={styles.moneyRequestConfirmationAmount} disabled={didConfirm} brickRoadIndicator={shouldDisplayFieldError && (0, TransactionUtils_1.isAmountMissing)(transaction) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={shouldDisplayFieldError && (0, TransactionUtils_1.isAmountMissing)(transaction) ? translate('common.error.enterAmount') : ''}/>),
            shouldShow: shouldShowSmartScanFields && shouldShowAmountField,
        },
        {
            item: (<react_native_1.View key={translate('common.description')}>
                    <ShowContextMenuContext_1.ShowContextMenuContext.Provider value={contextMenuContextValue}>
                        <MentionReportContext_1.default.Provider value={mentionReportContextValue}>
                            <MenuItemWithTopDescription_1.default shouldShowRightIcon={!isReadOnly} shouldParseTitle excludedMarkdownRules={!policy ? ['reportMentions'] : []} title={iouComment} description={translate('common.description')} onPress={() => {
                    if (!transactionID) {
                        return;
                    }
                    Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_DESCRIPTION.getRoute(action, iouType, transactionID, reportID, Navigation_1.default.getActiveRoute(), reportActionID));
                }} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} disabled={didConfirm} interactive={!isReadOnly} numberOfLinesTitle={2}/>
                        </MentionReportContext_1.default.Provider>
                    </ShowContextMenuContext_1.ShowContextMenuContext.Provider>
                </react_native_1.View>),
            shouldShow: true,
        },
        {
            item: (<MenuItemWithTopDescription_1.default key={translate('common.distance')} shouldShowRightIcon={!isReadOnly} title={DistanceRequestUtils_1.default.getDistanceForDisplay(hasRoute, distance, unit, rate, translate)} description={translate('common.distance')} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} onPress={() => {
                    if (!transactionID) {
                        return;
                    }
                    Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_DISTANCE.getRoute(action, iouType, transactionID, reportID, Navigation_1.default.getActiveRoute(), reportActionID));
                }} disabled={didConfirm} interactive={!isReadOnly}/>),
            shouldShow: isDistanceRequest,
        },
        {
            item: (<MenuItemWithTopDescription_1.default key={translate('common.rate')} shouldShowRightIcon={!!rate && !isReadOnly && isPolicyExpenseChat} title={DistanceRequestUtils_1.default.getRateForDisplay(unit, rate, currency, translate, toLocaleDigit, isOffline)} description={translate('common.rate')} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} onPress={() => {
                    if (!transactionID) {
                        return;
                    }
                    Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_DISTANCE_RATE.getRoute(action, iouType, transactionID, reportID, Navigation_1.default.getActiveRoute(), reportActionID));
                }} brickRoadIndicator={shouldDisplayDistanceRateError ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} disabled={didConfirm} interactive={!!rate && !isReadOnly && isPolicyExpenseChat}/>),
            shouldShow: isDistanceRequest,
        },
        {
            item: (<MenuItemWithTopDescription_1.default key={translate('common.merchant')} shouldShowRightIcon={!isReadOnly} title={isMerchantEmpty ? '' : iouMerchant} description={translate('common.merchant')} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} onPress={() => {
                    if (!transactionID) {
                        return;
                    }
                    Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_MERCHANT.getRoute(action, iouType, transactionID, reportID, Navigation_1.default.getActiveRoute(), reportActionID));
                }} disabled={didConfirm} interactive={!isReadOnly} brickRoadIndicator={shouldDisplayMerchantError ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={shouldDisplayMerchantError ? translate('common.error.fieldRequired') : ''} rightLabel={isMerchantRequired && !shouldDisplayMerchantError ? translate('common.required') : ''} numberOfLinesTitle={2}/>),
            shouldShow: shouldShowMerchant,
        },
        {
            item: (<MenuItemWithTopDescription_1.default key={translate('common.category')} shouldShowRightIcon={!isReadOnly} title={iouCategory} description={translate('common.category')} numberOfLinesTitle={2} onPress={() => {
                    if (!transactionID) {
                        return;
                    }
                    Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CATEGORY.getRoute(action, iouType, transactionID, reportID, Navigation_1.default.getActiveRoute(), reportActionID));
                }} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} disabled={didConfirm} interactive={!isReadOnly} rightLabel={isCategoryRequired ? translate('common.required') : ''}/>),
            shouldShow: shouldShowCategories,
        },
        {
            item: (<MenuItemWithTopDescription_1.default key={translate('common.date')} shouldShowRightIcon={!isReadOnly} 
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            title={iouCreated || (0, date_fns_1.format)(new Date(), CONST_1.default.DATE.FNS_FORMAT_STRING)} description={translate('common.date')} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} onPress={() => {
                    if (!transactionID) {
                        return;
                    }
                    Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_DATE.getRoute(action, iouType, transactionID, reportID, Navigation_1.default.getActiveRoute(), reportActionID));
                }} disabled={didConfirm} interactive={!isReadOnly} brickRoadIndicator={shouldDisplayFieldError && (0, TransactionUtils_1.isCreatedMissing)(transaction) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={shouldDisplayFieldError && (0, TransactionUtils_1.isCreatedMissing)(transaction) ? translate('common.error.enterDate') : ''}/>),
            shouldShow: shouldShowDate,
        },
        ...policyTagLists.map(({ name }, index) => {
            const tagVisibilityItem = tagVisibility.at(index);
            const isTagRequired = tagVisibilityItem?.isTagRequired ?? false;
            const shouldShow = tagVisibilityItem?.shouldShow ?? false;
            const prevShouldShow = previousTagsVisibility.at(index) ?? false;
            return {
                item: (<MenuItemWithTopDescription_1.default highlighted={shouldShow && !(0, TransactionUtils_1.getTagForDisplay)(transaction, index) && !prevShouldShow} key={name} shouldShowRightIcon={!isReadOnly} title={(0, TransactionUtils_1.getTagForDisplay)(transaction, index)} description={name} shouldShowBasicTitle shouldShowDescriptionOnTop numberOfLinesTitle={2} onPress={() => {
                        if (!transactionID) {
                            return;
                        }
                        Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_TAG.getRoute(action, iouType, index, transactionID, reportID, Navigation_1.default.getActiveRoute(), reportActionID));
                    }} style={[styles.moneyRequestMenuItem]} disabled={didConfirm} interactive={!isReadOnly} rightLabel={isTagRequired ? translate('common.required') : ''}/>),
                shouldShow,
            };
        }),
        {
            item: (<MenuItemWithTopDescription_1.default key={`${taxRates?.name}${taxRateTitle}`} shouldShowRightIcon={canModifyTaxFields} title={taxRateTitle} description={taxRates?.name} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} onPress={() => {
                    if (!transactionID) {
                        return;
                    }
                    Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_TAX_RATE.getRoute(action, iouType, transactionID, reportID, Navigation_1.default.getActiveRoute()));
                }} disabled={didConfirm} interactive={canModifyTaxFields}/>),
            shouldShow: shouldShowTax,
        },
        {
            item: (<MenuItemWithTopDescription_1.default key={`${taxRates?.name}${formattedTaxAmount}`} shouldShowRightIcon={canModifyTaxFields} title={formattedTaxAmount} description={translate('iou.taxAmount')} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} onPress={() => {
                    if (!transactionID) {
                        return;
                    }
                    Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_TAX_AMOUNT.getRoute(action, iouType, transactionID, reportID, Navigation_1.default.getActiveRoute()));
                }} disabled={didConfirm} interactive={canModifyTaxFields}/>),
            shouldShow: shouldShowTax,
        },
        {
            item: (<MenuItemWithTopDescription_1.default key="attendees" shouldShowRightIcon title={iouAttendees?.map((item) => item?.displayName ?? item?.login).join(', ')} description={`${translate('iou.attendees')} ${iouAttendees?.length && iouAttendees.length > 1 && formattedAmountPerAttendee ? `\u00B7 ${formattedAmountPerAttendee} ${translate('common.perPerson')}` : ''}`} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} onPress={() => {
                    if (!transactionID) {
                        return;
                    }
                    Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_ATTENDEE.getRoute(action, iouType, transactionID, reportID, Navigation_1.default.getActiveRoute()));
                }} interactive shouldRenderAsHTML/>),
            shouldShow: shouldShowAttendees,
        },
        {
            item: (<react_native_1.View key={expensify_common_1.Str.UCFirst(translate('iou.reimbursable'))} style={[styles.flexRow, styles.justifyContentBetween, styles.alignItemsCenter, styles.ml5, styles.mr8, styles.optionRow]}>
                    <ToggleSettingsOptionRow_1.default switchAccessibilityLabel={expensify_common_1.Str.UCFirst(translate('iou.reimbursable'))} title={expensify_common_1.Str.UCFirst(translate('iou.reimbursable'))} onToggle={(isOn) => onToggleReimbursable?.(isOn)} isActive={iouIsReimbursable} disabled={isReadOnly} wrapperStyle={styles.flex1}/>
                </react_native_1.View>),
            shouldShow: shouldShowReimbursable,
            isSupplementary: true,
        },
        {
            item: (<react_native_1.View key={translate('common.billable')} style={[styles.flexRow, styles.justifyContentBetween, styles.alignItemsCenter, styles.ml5, styles.mr8, styles.optionRow]}>
                    <ToggleSettingsOptionRow_1.default switchAccessibilityLabel={translate('common.billable')} title={translate('common.billable')} onToggle={(isOn) => onToggleBillable?.(isOn)} isActive={iouIsBillable} disabled={isReadOnly} wrapperStyle={styles.flex1}/>
                </react_native_1.View>),
            shouldShow: shouldShowBillable,
        },
        {
            item: (<MenuItemWithTopDescription_1.default key={translate('common.report')} shouldShowRightIcon={shouldReportBeEditable} title={reportName} description={translate('common.report')} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} onPress={() => {
                    if (!transactionID || !selectedReportID) {
                        return;
                    }
                    Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_REPORT.getRoute(action, iouType, transactionID, selectedReportID, Navigation_1.default.getActiveRoute(), reportActionID));
                }} interactive={shouldReportBeEditable} shouldRenderAsHTML/>),
            shouldShow: isPolicyExpenseChat,
        },
    ];
    const subRates = (0, PerDiemRequestUtils_1.getSubratesFields)(perDiemCustomUnit, transaction);
    const shouldDisplaySubrateError = isPerDiemRequest && (shouldDisplayFieldError || formError === 'iou.error.invalidSubrateLength') && (subRates.length === 0 || (subRates.length === 1 && !subRates.at(0)));
    const subRateFields = subRates.map((field, index) => (<MenuItemWithTopDescription_1.default key={`${translate('common.subrate')}${field?.key ?? index}`} shouldShowRightIcon={!isReadOnly} title={(0, PerDiemRequestUtils_1.getSubratesForDisplay)(field, translate('iou.qty'))} description={translate('common.subrate')} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} onPress={() => {
            if (!transactionID) {
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_SUBRATE_EDIT.getRoute(action, iouType, transactionID, reportID, index, Navigation_1.default.getActiveRoute()));
        }} disabled={didConfirm} interactive={!isReadOnly} brickRoadIndicator={index === 0 && shouldDisplaySubrateError ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={index === 0 && shouldDisplaySubrateError ? translate('common.error.fieldRequired') : ''}/>));
    const { firstDay, tripDays, lastDay } = (0, PerDiemRequestUtils_1.getTimeDifferenceIntervals)(transaction);
    const badgeElements = (0, react_1.useMemo)(() => {
        const badges = [];
        if (firstDay) {
            badges.push(<Badge_1.default key="firstDay" icon={Expensicons.Stopwatch} text={translate('iou.firstDayText', { count: firstDay })}/>);
        }
        if (tripDays) {
            badges.push(<Badge_1.default key="tripDays" icon={Expensicons.CalendarSolid} text={translate('iou.tripLengthText', { count: tripDays })}/>);
        }
        if (lastDay) {
            badges.push(<Badge_1.default key="lastDay" icon={Expensicons.Stopwatch} text={translate('iou.lastDayText', { count: lastDay })}/>);
        }
        return badges;
    }, [firstDay, lastDay, translate, tripDays]);
    const receiptThumbnailContent = (0, react_1.useMemo)(() => (<react_native_1.View style={[styles.moneyRequestImage, styles.expenseViewImageSmall]}>
                {isLocalFile && expensify_common_1.Str.isPDF(receiptFilename) ? (<PressableWithoutFocus_1.default onPress={() => {
                if (!transactionID) {
                    return;
                }
                Navigation_1.default.navigate(isReceiptEditable
                    ? ROUTES_1.default.MONEY_REQUEST_RECEIPT_PREVIEW.getRoute(reportID, transactionID, action, iouType)
                    : ROUTES_1.default.TRANSACTION_RECEIPT.getRoute(reportID, transactionID));
            }} accessibilityRole={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('accessibilityHints.viewAttachment')} disabled={!shouldDisplayReceipt} disabledStyle={styles.cursorDefault}>
                        <PDFThumbnail_1.default 
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        previewSourceURL={resolvedReceiptImage} onLoadError={onPDFLoadError} onPassword={onPDFPassword}/>
                    </PressableWithoutFocus_1.default>) : (<PressableWithoutFocus_1.default onPress={() => {
                if (!transactionID) {
                    return;
                }
                Navigation_1.default.navigate(isReceiptEditable
                    ? ROUTES_1.default.MONEY_REQUEST_RECEIPT_PREVIEW.getRoute(reportID, transactionID, action, iouType)
                    : ROUTES_1.default.TRANSACTION_RECEIPT.getRoute(reportID, transactionID));
            }} disabled={!shouldDisplayReceipt || isThumbnail} accessibilityRole={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('accessibilityHints.viewAttachment')} disabledStyle={styles.cursorDefault} style={[styles.h100, styles.flex1]}>
                        <ReceiptImage_1.default isThumbnail={isThumbnail} 
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        source={resolvedThumbnail || resolvedReceiptImage || ''} 
        // AuthToken is required when retrieving the image from the server
        // but we don't need it to load the blob:// or file:// image when starting an expense/split
        // So if we have a thumbnail, it means we're retrieving the image from the server
        isAuthTokenRequired={!!receiptThumbnail && !isLocalFile} fileExtension={fileExtension} shouldUseThumbnailImage shouldUseInitialObjectPosition={isDistanceRequest}/>
                    </PressableWithoutFocus_1.default>)}
            </react_native_1.View>), [
        styles.moneyRequestImage,
        styles.expenseViewImageSmall,
        styles.cursorDefault,
        styles.h100,
        styles.flex1,
        isLocalFile,
        receiptFilename,
        translate,
        shouldDisplayReceipt,
        resolvedReceiptImage,
        onPDFLoadError,
        onPDFPassword,
        isThumbnail,
        resolvedThumbnail,
        receiptThumbnail,
        fileExtension,
        isDistanceRequest,
        transactionID,
        action,
        iouType,
        reportID,
        isReceiptEditable,
    ]);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const hasReceiptImageOrThumbnail = receiptImage || receiptThumbnail;
    return (<>
            {isTypeInvoice && (<MenuItem_1.default key={translate('workspace.invoices.sendFrom')} avatarID={senderWorkspace?.id} shouldShowRightIcon={!isReadOnly && canUpdateSenderWorkspace} title={senderWorkspace?.name} icon={senderWorkspace?.avatarURL ? senderWorkspace?.avatarURL : (0, ReportUtils_1.getDefaultWorkspaceAvatar)(senderWorkspace?.name)} iconType={CONST_1.default.ICON_TYPE_WORKSPACE} description={translate('workspace.common.workspace')} label={translate('workspace.invoices.sendFrom')} isLabelHoverable={false} interactive={!isReadOnly && canUpdateSenderWorkspace} onPress={() => {
                if (!transaction?.transactionID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_SEND_FROM.getRoute(iouType, transaction?.transactionID, reportID, Navigation_1.default.getActiveRoute()));
            }} style={styles.moneyRequestMenuItem} labelStyle={styles.mt2} titleStyle={styles.flex1} disabled={didConfirm}/>)}
            {shouldShowMap && (<react_native_1.View style={styles.confirmationListMapItem}>
                    <ConfirmedRoute_1.default transaction={transaction ?? {}}/>
                </react_native_1.View>)}
            {isPerDiemRequest && action !== CONST_1.default.IOU.ACTION.SUBMIT && (<>
                    <MenuItemWithTopDescription_1.default shouldShowRightIcon={!isReadOnly} title={(0, PerDiemRequestUtils_1.getDestinationForDisplay)(perDiemCustomUnit, transaction)} description={translate('common.destination')} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} onPress={() => {
                if (!transactionID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_DESTINATION_EDIT.getRoute(action, iouType, transactionID, reportID, Navigation_1.default.getActiveRoute()));
            }} disabled={didConfirm} interactive={!isReadOnly}/>
                    <react_native_1.View style={styles.dividerLine}/>
                    <MenuItemWithTopDescription_1.default shouldShowRightIcon={!isReadOnly} title={(0, PerDiemRequestUtils_1.getTimeForDisplay)(transaction)} description={translate('iou.time')} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} onPress={() => {
                if (!transactionID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_TIME_EDIT.getRoute(action, iouType, transactionID, reportID));
            }} disabled={didConfirm} interactive={!isReadOnly} numberOfLinesTitle={2}/>
                    <react_native_1.View style={[styles.flexRow, styles.gap1, styles.justifyContentStart, styles.mh3, styles.flexWrap, styles.pt1]}>{badgeElements}</react_native_1.View>
                    <react_native_1.View style={styles.dividerLine}/>
                    {subRateFields}
                    <react_native_1.View style={styles.dividerLine}/>
                </>)}
            {!shouldShowMap && (<react_native_1.View style={!hasReceiptImageOrThumbnail && !showReceiptEmptyState ? undefined : styles.mv3}>
                    {hasReceiptImageOrThumbnail
                ? receiptThumbnailContent
                : showReceiptEmptyState && (<ReceiptEmptyState_1.default onPress={() => {
                        if (!transactionID) {
                            return;
                        }
                        Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_SCAN.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, transactionID, reportID, Navigation_1.default.getActiveRoute()));
                    }} style={styles.expenseViewImageSmall}/>)}
                </react_native_1.View>)}
            <react_native_1.View style={[styles.mb5]}>{fields.filter((field) => field.shouldShow).map((field) => field.item)}</react_native_1.View>
        </>);
}
MoneyRequestConfirmationListFooter.displayName = 'MoneyRequestConfirmationListFooter';
exports.default = (0, react_1.memo)(MoneyRequestConfirmationListFooter, (prevProps, nextProps) => (0, fast_equals_1.deepEqual)(prevProps.action, nextProps.action) &&
    prevProps.currency === nextProps.currency &&
    prevProps.didConfirm === nextProps.didConfirm &&
    prevProps.distance === nextProps.distance &&
    prevProps.formattedAmount === nextProps.formattedAmount &&
    prevProps.formError === nextProps.formError &&
    prevProps.hasRoute === nextProps.hasRoute &&
    prevProps.iouCategory === nextProps.iouCategory &&
    prevProps.iouComment === nextProps.iouComment &&
    prevProps.iouCreated === nextProps.iouCreated &&
    prevProps.iouCurrencyCode === nextProps.iouCurrencyCode &&
    prevProps.iouIsBillable === nextProps.iouIsBillable &&
    prevProps.iouMerchant === nextProps.iouMerchant &&
    prevProps.iouType === nextProps.iouType &&
    prevProps.isCategoryRequired === nextProps.isCategoryRequired &&
    prevProps.isDistanceRequest === nextProps.isDistanceRequest &&
    prevProps.isMerchantEmpty === nextProps.isMerchantEmpty &&
    prevProps.isMerchantRequired === nextProps.isMerchantRequired &&
    prevProps.isPolicyExpenseChat === nextProps.isPolicyExpenseChat &&
    prevProps.isReadOnly === nextProps.isReadOnly &&
    prevProps.isTypeInvoice === nextProps.isTypeInvoice &&
    prevProps.onToggleBillable === nextProps.onToggleBillable &&
    (0, fast_equals_1.deepEqual)(prevProps.policy, nextProps.policy) &&
    (0, fast_equals_1.deepEqual)(prevProps.policyTagLists, nextProps.policyTagLists) &&
    prevProps.rate === nextProps.rate &&
    prevProps.receiptFilename === nextProps.receiptFilename &&
    prevProps.receiptPath === nextProps.receiptPath &&
    prevProps.reportActionID === nextProps.reportActionID &&
    prevProps.reportID === nextProps.reportID &&
    (0, fast_equals_1.deepEqual)(prevProps.selectedParticipants, nextProps.selectedParticipants) &&
    prevProps.shouldDisplayFieldError === nextProps.shouldDisplayFieldError &&
    prevProps.shouldDisplayReceipt === nextProps.shouldDisplayReceipt &&
    prevProps.shouldShowCategories === nextProps.shouldShowCategories &&
    prevProps.shouldShowMerchant === nextProps.shouldShowMerchant &&
    prevProps.shouldShowSmartScanFields === nextProps.shouldShowSmartScanFields &&
    prevProps.shouldShowTax === nextProps.shouldShowTax &&
    (0, fast_equals_1.deepEqual)(prevProps.transaction, nextProps.transaction) &&
    prevProps.transactionID === nextProps.transactionID &&
    prevProps.unit === nextProps.unit);
