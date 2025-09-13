"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fast_equals_1 = require("fast-equals");
const isEmpty_1 = require("lodash/isEmpty");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const DistanceRequestFooter_1 = require("@components/DistanceRequest/DistanceRequestFooter");
const DistanceRequestRenderItem_1 = require("@components/DistanceRequest/DistanceRequestRenderItem");
const DotIndicatorMessage_1 = require("@components/DotIndicatorMessage");
const DraggableList_1 = require("@components/DraggableList");
const withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
const useFetchRoute_1 = require("@hooks/useFetchRoute");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const usePolicy_1 = require("@hooks/usePolicy");
const usePrevious_1 = require("@hooks/usePrevious");
const useShowNotFoundPageInIOUStep_1 = require("@hooks/useShowNotFoundPageInIOUStep");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const IOU_1 = require("@libs/actions/IOU");
const MapboxToken_1 = require("@libs/actions/MapboxToken");
const Report_1 = require("@libs/actions/Report");
const Transaction_1 = require("@libs/actions/Transaction");
const TransactionEdit_1 = require("@libs/actions/TransactionEdit");
const DistanceRequestUtils_1 = require("@libs/DistanceRequestUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const IOUUtils_1 = require("@libs/IOUUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const StepScreenWrapper_1 = require("./StepScreenWrapper");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepDistance({ report, route: { params: { action, iouType, reportID, transactionID, backTo, backToReport, reportActionID }, }, transaction, currentUserPersonalDetails, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const [allReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, { canBeMissing: false });
    const [reportNameValuePairs] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report?.reportID}`, { canBeMissing: true });
    const [transactionBackup] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_BACKUP}${transactionID}`, { canBeMissing: true });
    const policy = (0, usePolicy_1.default)(report?.policyID);
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false });
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: false });
    const [activePolicy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${activePolicyID}`, { canBeMissing: false });
    const [skipConfirmation] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SKIP_CONFIRMATION}${transactionID}`, { canBeMissing: false });
    const [lastSelectedDistanceRates] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_SELECTED_DISTANCE_RATES, { canBeMissing: true });
    const [optimisticWaypoints, setOptimisticWaypoints] = (0, react_1.useState)(null);
    const waypoints = (0, react_1.useMemo)(() => optimisticWaypoints ??
        transaction?.comment?.waypoints ?? {
        waypoint0: { keyForList: 'start_waypoint' },
        waypoint1: { keyForList: 'stop_waypoint' },
    }, [optimisticWaypoints, transaction]);
    const [reportAttributesDerived] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true, selector: (val) => val?.reports });
    const backupWaypoints = transactionBackup?.pendingFields?.waypoints ? transactionBackup?.comment?.waypoints : undefined;
    // When online, fetch the backup route to ensure the map is populated even if the user does not save the transaction.
    // Fetch the backup route first to ensure the backup transaction map is updated before the main transaction map.
    // This prevents a scenario where the main map loads, the user dismisses the map editor, and the backup map has not yet loaded due to delay.
    (0, useFetchRoute_1.default)(transactionBackup, backupWaypoints, action, CONST_1.default.TRANSACTION.STATE.BACKUP);
    const { shouldFetchRoute, validatedWaypoints } = (0, useFetchRoute_1.default)(transaction, waypoints, action, (0, IOUUtils_1.shouldUseTransactionDraft)(action) ? CONST_1.default.TRANSACTION.STATE.DRAFT : CONST_1.default.TRANSACTION.STATE.CURRENT);
    const waypointsList = Object.keys(waypoints);
    const previousWaypoints = (0, usePrevious_1.default)(waypoints);
    const numberOfWaypoints = Object.keys(waypoints).length;
    const numberOfPreviousWaypoints = Object.keys(previousWaypoints).length;
    const scrollViewRef = (0, react_1.useRef)(null);
    const isLoadingRoute = transaction?.comment?.isLoading ?? false;
    const isLoading = transaction?.isLoading ?? false;
    const isSplitRequest = iouType === CONST_1.default.IOU.TYPE.SPLIT;
    const hasRouteError = !!transaction?.errorFields?.route;
    const [shouldShowAtLeastTwoDifferentWaypointsError, setShouldShowAtLeastTwoDifferentWaypointsError] = (0, react_1.useState)(false);
    const isWaypointEmpty = (waypoint) => {
        if (!waypoint) {
            return true;
        }
        const { keyForList, ...waypointWithoutKey } = waypoint;
        return (0, isEmpty_1.default)(waypointWithoutKey);
    };
    const nonEmptyWaypointsCount = (0, react_1.useMemo)(() => Object.keys(waypoints).filter((key) => !isWaypointEmpty(waypoints[key])).length, [waypoints]);
    const duplicateWaypointsError = (0, react_1.useMemo)(() => nonEmptyWaypointsCount >= 2 && Object.keys(validatedWaypoints).length !== nonEmptyWaypointsCount, [nonEmptyWaypointsCount, validatedWaypoints]);
    const atLeastTwoDifferentWaypointsError = (0, react_1.useMemo)(() => Object.keys(validatedWaypoints).length < 2, [validatedWaypoints]);
    const isEditing = action === CONST_1.default.IOU.ACTION.EDIT;
    const transactionWasSaved = (0, react_1.useRef)(false);
    const isCreatingNewRequest = !(backTo || isEditing);
    const [recentWaypoints, { status: recentWaypointsStatus }] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_RECENT_WAYPOINTS, { canBeMissing: true });
    const iouRequestType = (0, TransactionUtils_1.getRequestType)(transaction, isBetaEnabled(CONST_1.default.BETAS.MANUAL_DISTANCE));
    const customUnitRateID = (0, TransactionUtils_1.getRateID)(transaction);
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowNotFoundPage = (0, useShowNotFoundPageInIOUStep_1.default)(action, iouType, reportActionID, report, transaction);
    // Sets `amount` and `split` share data before moving to the next step to avoid briefly showing `0.00` as the split share for participants
    const setDistanceRequestData = (0, react_1.useCallback)((participants) => {
        // Get policy report based on transaction participants
        const isPolicyExpenseChat = participants?.some((participant) => participant.isPolicyExpenseChat);
        const selectedReportID = participants?.length === 1 ? (participants.at(0)?.reportID ?? reportID) : reportID;
        const policyReport = participants.at(0) ? allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${selectedReportID}`] : report;
        const IOUpolicyID = (0, IOU_1.getIOURequestPolicyID)(transaction, policyReport);
        // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
        // eslint-disable-next-line deprecation/deprecation
        const IOUpolicy = (0, PolicyUtils_1.getPolicy)(report?.policyID ?? IOUpolicyID);
        const policyCurrency = policy?.outputCurrency ?? (0, PolicyUtils_1.getPersonalPolicy)()?.outputCurrency ?? CONST_1.default.CURRENCY.USD;
        const mileageRates = DistanceRequestUtils_1.default.getMileageRates(IOUpolicy);
        const defaultMileageRate = DistanceRequestUtils_1.default.getDefaultMileageRate(IOUpolicy);
        const mileageRate = (0, TransactionUtils_1.isCustomUnitRateIDForP2P)(transaction)
            ? DistanceRequestUtils_1.default.getRateForP2P(policyCurrency, transaction)
            : // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                (customUnitRateID && mileageRates?.[customUnitRateID]) || defaultMileageRate;
        const { unit, rate } = mileageRate ?? {};
        const distance = (0, TransactionUtils_1.getDistanceInMeters)(transaction, unit);
        const currency = mileageRate?.currency ?? policyCurrency;
        const amount = DistanceRequestUtils_1.default.getDistanceRequestAmount(distance, unit ?? CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_MILES, rate ?? 0);
        (0, IOU_1.setMoneyRequestAmount)(transactionID, amount, currency);
        const participantAccountIDs = participants?.map((participant) => Number(participant.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID));
        if (isSplitRequest && amount && currency && !isPolicyExpenseChat) {
            (0, IOU_1.setSplitShares)(transaction, amount, currency ?? '', participantAccountIDs ?? []);
        }
    }, [report, allReports, transaction, transactionID, isSplitRequest, policy?.outputCurrency, reportID, customUnitRateID]);
    // For quick button actions, we'll skip the confirmation page unless the report is archived or this is a workspace
    // request and the workspace requires a category or a tag
    const shouldSkipConfirmation = (0, react_1.useMemo)(() => {
        if (!skipConfirmation || !report?.reportID) {
            return false;
        }
        return (iouType !== CONST_1.default.IOU.TYPE.SPLIT &&
            !(0, ReportUtils_1.isArchivedReport)(reportNameValuePairs) &&
            !((0, ReportUtils_1.isPolicyExpenseChat)(report) && ((policy?.requiresCategory ?? false) || (policy?.requiresTag ?? false))));
    }, [report, skipConfirmation, policy, reportNameValuePairs, iouType]);
    let buttonText = !isCreatingNewRequest ? translate('common.save') : translate('common.next');
    if (shouldSkipConfirmation) {
        if (iouType === CONST_1.default.IOU.TYPE.SPLIT) {
            buttonText = translate('iou.split');
        }
        else {
            buttonText = translate('iou.createExpense');
        }
    }
    (0, react_1.useEffect)(() => {
        if (iouRequestType !== CONST_1.default.IOU.REQUEST_TYPE.DISTANCE || isOffline || recentWaypointsStatus === 'loading' || recentWaypoints !== undefined) {
            return;
        }
        // Only load the recent waypoints if they have been read from Onyx as undefined
        // If the account doesn't have recent waypoints they will be returned as an empty array
        (0, Transaction_1.openDraftDistanceExpense)();
    }, [iouRequestType, recentWaypointsStatus, recentWaypoints, isOffline]);
    (0, react_1.useEffect)(() => {
        (0, MapboxToken_1.init)();
        return MapboxToken_1.stop;
    }, []);
    (0, react_1.useEffect)(() => {
        if (numberOfWaypoints <= numberOfPreviousWaypoints) {
            return;
        }
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [numberOfPreviousWaypoints, numberOfWaypoints]);
    (0, react_1.useEffect)(() => {
        if (nonEmptyWaypointsCount >= 2 && (duplicateWaypointsError || atLeastTwoDifferentWaypointsError || hasRouteError || isLoadingRoute || isLoading)) {
            return;
        }
        setShouldShowAtLeastTwoDifferentWaypointsError(false);
    }, [atLeastTwoDifferentWaypointsError, duplicateWaypointsError, hasRouteError, isLoading, isLoadingRoute, nonEmptyWaypointsCount, transaction]);
    // This effect runs when the component is mounted and unmounted. It's purpose is to be able to properly
    // discard changes if the user cancels out of making any changes. This is accomplished by backing up the
    // original transaction, letting the user modify the current transaction, and then if the user ever
    // cancels out of the modal without saving changes, the original transaction is restored from the backup.
    (0, react_1.useEffect)(() => {
        if (isCreatingNewRequest) {
            return () => { };
        }
        const isDraft = (0, IOUUtils_1.shouldUseTransactionDraft)(action);
        // On mount, create the backup transaction.
        (0, TransactionEdit_1.createBackupTransaction)(transaction, isDraft);
        return () => {
            // If the user cancels out of the modal without saving changes, then the original transaction
            // needs to be restored from the backup so that all changes are removed.
            if (transactionWasSaved.current) {
                (0, TransactionEdit_1.removeBackupTransaction)(transaction?.transactionID);
                return;
            }
            (0, TransactionEdit_1.restoreOriginalTransactionFromBackup)(transaction?.transactionID, isDraft);
            // If the user opens IOURequestStepDistance in offline mode and then goes online, re-open the report to fill in missing fields from the transaction backup
            if (!transaction?.reportID || (0, TransactionUtils_1.hasRoute)(transaction, true)) {
                return;
            }
            (0, Report_1.openReport)(transaction?.reportID);
        };
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    const navigateBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo);
    }, [backTo]);
    /**
     * Takes the user to the page for editing a specific waypoint
     * @param index of the waypoint to edit
     */
    const navigateToWaypointEditPage = (0, react_1.useCallback)((index) => {
        Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_WAYPOINT.getRoute(action, CONST_1.default.IOU.TYPE.SUBMIT, transactionID, report?.reportID ?? reportID, index.toString(), Navigation_1.default.getActiveRoute()));
    }, [action, transactionID, report?.reportID, reportID]);
    const navigateToConfirmationPage = (0, react_1.useCallback)(() => {
        switch (iouType) {
            case CONST_1.default.IOU.TYPE.REQUEST:
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, CONST_1.default.IOU.TYPE.SUBMIT, transactionID, reportID, backToReport));
                break;
            case CONST_1.default.IOU.TYPE.SEND:
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, CONST_1.default.IOU.TYPE.PAY, transactionID, reportID));
                break;
            default:
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, transactionID, reportID, backToReport));
        }
    }, [backToReport, iouType, reportID, transactionID]);
    const navigateToNextStep = (0, react_1.useCallback)(() => {
        if (transaction?.splitShares) {
            (0, IOU_1.resetSplitShares)(transaction);
        }
        if (backTo) {
            Navigation_1.default.goBack(backTo);
            return;
        }
        // If a reportID exists in the report object, it's because either:
        // - The user started this flow from using the + button in the composer inside a report.
        // - The user started this flow from using the global create menu by selecting the Track expense option.
        // In this case, the participants can be automatically assigned from the report and the user can skip the participants step and go straight
        // to the confirm step.
        // If the user started this flow using the Create expense option (combined submit/track flow), they should be redirected to the participants page.
        if (report?.reportID && !(0, ReportUtils_1.isArchivedReport)(reportNameValuePairs) && iouType !== CONST_1.default.IOU.TYPE.CREATE) {
            const selectedParticipants = (0, IOU_1.getMoneyRequestParticipantsFromReport)(report);
            const participants = selectedParticipants.map((participant) => {
                const participantAccountID = participant?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
                return participantAccountID ? (0, OptionsListUtils_1.getParticipantsOption)(participant, personalDetails) : (0, OptionsListUtils_1.getReportOption)(participant, reportAttributesDerived);
            });
            setDistanceRequestData(participants);
            if (shouldSkipConfirmation) {
                (0, IOU_1.setMoneyRequestPendingFields)(transactionID, { waypoints: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD });
                (0, IOU_1.setMoneyRequestMerchant)(transactionID, translate('iou.fieldPending'), false);
                const participant = participants.at(0);
                if (iouType === CONST_1.default.IOU.TYPE.TRACK && participant) {
                    (0, IOU_1.trackExpense)({
                        report,
                        isDraftPolicy: false,
                        participantParams: {
                            payeeEmail: currentUserPersonalDetails.login,
                            payeeAccountID: currentUserPersonalDetails.accountID,
                            participant,
                        },
                        policyParams: {
                            policy,
                        },
                        transactionParams: {
                            amount: 0,
                            currency: transaction?.currency ?? 'USD',
                            created: transaction?.created ?? '',
                            merchant: translate('iou.fieldPending'),
                            receipt: {},
                            billable: false,
                            reimbursable: true,
                            validWaypoints: (0, TransactionUtils_1.getValidWaypoints)(waypoints, true),
                            customUnitRateID,
                            attendees: transaction?.comment?.attendees,
                        },
                    });
                    return;
                }
                const isPolicyExpenseChat = !!participant?.isPolicyExpenseChat;
                (0, IOU_1.createDistanceRequest)({
                    report,
                    participants,
                    currentUserLogin: currentUserPersonalDetails.login,
                    currentUserAccountID: currentUserPersonalDetails.accountID,
                    iouType,
                    existingTransaction: transaction,
                    transactionParams: {
                        amount: 0,
                        comment: '',
                        created: transaction?.created ?? '',
                        currency: transaction?.currency ?? 'USD',
                        merchant: translate('iou.fieldPending'),
                        billable: !!policy?.defaultBillable,
                        reimbursable: !!policy?.defaultReimbursable,
                        validWaypoints: (0, TransactionUtils_1.getValidWaypoints)(waypoints, true),
                        customUnitRateID: DistanceRequestUtils_1.default.getCustomUnitRateID({ reportID: report.reportID, isPolicyExpenseChat, policy, lastSelectedDistanceRates }),
                        splitShares: transaction?.splitShares,
                        attendees: transaction?.comment?.attendees,
                    },
                    backToReport,
                });
                return;
            }
            (0, IOU_1.setMoneyRequestParticipantsFromReport)(transactionID, report).then(() => {
                navigateToConfirmationPage();
            });
            return;
        }
        // If there was no reportID, then that means the user started this flow from the global menu
        // and an optimistic reportID was generated. In that case, the next step is to select the participants for this expense.
        if (iouType === CONST_1.default.IOU.TYPE.CREATE && (0, PolicyUtils_1.isPaidGroupPolicy)(activePolicy) && activePolicy?.isPolicyExpenseChatEnabled && !(0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(activePolicy.id)) {
            const activePolicyExpenseChat = (0, ReportUtils_1.getPolicyExpenseChat)(currentUserPersonalDetails.accountID, activePolicy?.id);
            const rateID = DistanceRequestUtils_1.default.getCustomUnitRateID({
                reportID: activePolicyExpenseChat?.reportID,
                isPolicyExpenseChat: true,
                policy: activePolicy,
                lastSelectedDistanceRates,
            });
            (0, IOU_1.setCustomUnitRateID)(transactionID, rateID);
            (0, IOU_1.setMoneyRequestParticipantsFromReport)(transactionID, activePolicyExpenseChat).then(() => {
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType === CONST_1.default.IOU.TYPE.CREATE ? CONST_1.default.IOU.TYPE.SUBMIT : iouType, transactionID, activePolicyExpenseChat?.reportID));
            });
        }
        else {
            (0, IOUUtils_1.navigateToParticipantPage)(iouType, transactionID, reportID);
        }
    }, [
        transaction,
        backTo,
        report,
        reportNameValuePairs,
        iouType,
        activePolicy,
        setDistanceRequestData,
        shouldSkipConfirmation,
        transactionID,
        personalDetails,
        reportAttributesDerived,
        translate,
        currentUserPersonalDetails.login,
        currentUserPersonalDetails.accountID,
        policy,
        waypoints,
        backToReport,
        customUnitRateID,
        navigateToConfirmationPage,
        reportID,
        lastSelectedDistanceRates,
    ]);
    const getError = () => {
        // Get route error if available else show the invalid number of waypoints error.
        if (hasRouteError) {
            return (0, ErrorUtils_1.getLatestErrorField)(transaction, 'route');
        }
        if (duplicateWaypointsError) {
            return { duplicateWaypointsError: translate('iou.error.duplicateWaypointsErrorMessage') };
        }
        if (atLeastTwoDifferentWaypointsError) {
            return { atLeastTwoDifferentWaypointsError: translate('iou.error.atLeastTwoDifferentWaypoints') };
        }
        return {};
    };
    const updateWaypoints = (0, react_1.useCallback)(({ data }) => {
        if ((0, fast_equals_1.deepEqual)(waypointsList, data)) {
            return;
        }
        const newWaypoints = {};
        let emptyWaypointIndex = -1;
        data.forEach((waypoint, index) => {
            newWaypoints[`waypoint${index}`] = waypoints[waypoint] ?? {};
            // Find waypoint that BECOMES empty after dragging
            if (isWaypointEmpty(newWaypoints[`waypoint${index}`]) && !isWaypointEmpty(waypoints[`waypoint${index}`])) {
                emptyWaypointIndex = index;
            }
        });
        setOptimisticWaypoints(newWaypoints);
        Promise.all([
            (0, Transaction_1.removeWaypoint)(transaction, emptyWaypointIndex.toString(), (0, IOUUtils_1.shouldUseTransactionDraft)(action)),
            (0, Transaction_1.updateWaypoints)(transactionID, newWaypoints, (0, IOUUtils_1.shouldUseTransactionDraft)(action)),
        ]).then(() => {
            setOptimisticWaypoints(null);
        });
    }, [transactionID, transaction, waypoints, waypointsList, action]);
    const submitWaypoints = (0, react_1.useCallback)(() => {
        // If there is any error or loading state, don't let user go to next page.
        if (duplicateWaypointsError || atLeastTwoDifferentWaypointsError || hasRouteError || isLoadingRoute || (!isEditing && isLoading)) {
            setShouldShowAtLeastTwoDifferentWaypointsError(true);
            return;
        }
        if (!isCreatingNewRequest && !isEditing) {
            transactionWasSaved.current = true;
        }
        if (isEditing) {
            // If nothing was changed, simply go to transaction thread
            // We compare only addresses because numbers are rounded while backup
            const oldWaypoints = transactionBackup?.comment?.waypoints ?? {};
            const oldAddresses = Object.fromEntries(Object.entries(oldWaypoints).map(([key, waypoint]) => [key, 'address' in waypoint ? waypoint.address : {}]));
            const addresses = Object.fromEntries(Object.entries(waypoints).map(([key, waypoint]) => [key, 'address' in waypoint ? waypoint.address : {}]));
            const hasRouteChanged = !(0, fast_equals_1.deepEqual)(transactionBackup?.routes, transaction?.routes);
            if ((0, fast_equals_1.deepEqual)(oldAddresses, addresses)) {
                navigateBack();
                return;
            }
            if (transaction?.transactionID && report?.reportID) {
                (0, IOU_1.updateMoneyRequestDistance)({
                    transactionID: transaction?.transactionID,
                    transactionThreadReportID: report?.reportID,
                    waypoints,
                    ...(hasRouteChanged ? { routes: transaction?.routes } : {}),
                    policy,
                    transactionBackup,
                });
            }
            transactionWasSaved.current = true;
            navigateBack();
            return;
        }
        navigateToNextStep();
    }, [
        navigateBack,
        duplicateWaypointsError,
        atLeastTwoDifferentWaypointsError,
        hasRouteError,
        isLoadingRoute,
        isLoading,
        isCreatingNewRequest,
        isEditing,
        navigateToNextStep,
        transactionBackup,
        waypoints,
        transaction?.transactionID,
        transaction?.routes,
        report?.reportID,
        policy,
    ]);
    const renderItem = (0, react_1.useCallback)(({ item, drag, isActive, getIndex }) => (<DistanceRequestRenderItem_1.default waypoints={waypoints} item={item} onSecondaryInteraction={drag} isActive={isActive} getIndex={getIndex} onPress={navigateToWaypointEditPage} disabled={isLoadingRoute}/>), [isLoadingRoute, navigateToWaypointEditPage, waypoints]);
    return (<StepScreenWrapper_1.default headerTitle={translate('common.distance')} onBackButtonPress={navigateBack} testID={IOURequestStepDistance.displayName} shouldShowNotFoundPage={(isEditing && !transaction?.comment?.waypoints) || shouldShowNotFoundPage} shouldShowWrapper={!isCreatingNewRequest}>
            <>
                <react_native_1.View style={styles.flex1}>
                    <DraggableList_1.default data={waypointsList} keyExtractor={(item) => (waypoints[item]?.keyForList ?? waypoints[item]?.address ?? '') + item} onDragEnd={updateWaypoints} ref={scrollViewRef} renderItem={renderItem} ListFooterComponent={<DistanceRequestFooter_1.default waypoints={waypoints} navigateToWaypointEditPage={navigateToWaypointEditPage} transaction={transaction} policy={policy}/>}/>
                </react_native_1.View>
                <react_native_1.View style={[styles.w100, styles.pt2]}>
                    {/* Show error message if there is route error or there are less than 2 routes and user has tried submitting, */}
                    {((shouldShowAtLeastTwoDifferentWaypointsError && atLeastTwoDifferentWaypointsError) || duplicateWaypointsError || hasRouteError) && (<DotIndicatorMessage_1.default style={[styles.mh4, styles.mv3]} messages={getError()} type="error"/>)}
                    <Button_1.default success allowBubble pressOnEnter large style={[styles.w100, styles.mb5, styles.ph5, styles.flexShrink0]} onPress={submitWaypoints} text={buttonText} isLoading={!isOffline && (isLoadingRoute || shouldFetchRoute || isLoading)}/>
                </react_native_1.View>
            </>
        </StepScreenWrapper_1.default>);
}
IOURequestStepDistance.displayName = 'IOURequestStepDistance';
const IOURequestStepDistanceWithOnyx = IOURequestStepDistance;
const IOURequestStepDistanceWithCurrentUserPersonalDetails = (0, withCurrentUserPersonalDetails_1.default)(IOURequestStepDistanceWithOnyx);
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepDistanceWithWritableReportOrNotFound = (0, withWritableReportOrNotFound_1.default)(IOURequestStepDistanceWithCurrentUserPersonalDetails, true);
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepDistanceWithFullTransactionOrNotFound = (0, withFullTransactionOrNotFound_1.default)(IOURequestStepDistanceWithWritableReportOrNotFound);
exports.default = IOURequestStepDistanceWithFullTransactionOrNotFound;
