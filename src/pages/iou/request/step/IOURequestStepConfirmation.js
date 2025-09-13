"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var ConfirmModal_1 = require("@components/ConfirmModal");
var Consumer_1 = require("@components/DragAndDrop/Consumer");
var Provider_1 = require("@components/DragAndDrop/Provider");
var DropZoneUI_1 = require("@components/DropZone/DropZoneUI");
var FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var Expensicons = require("@components/Icon/Expensicons");
var LocationPermissionModal_1 = require("@components/LocationPermissionModal");
var MoneyRequestConfirmationList_1 = require("@components/MoneyRequestConfirmationList");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var PrevNextButtons_1 = require("@components/PrevNextButtons");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
var useDeepCompareRef_1 = require("@hooks/useDeepCompareRef");
var useFetchRoute_1 = require("@hooks/useFetchRoute");
var useFilesValidation_1 = require("@hooks/useFilesValidation");
var useLocalize_1 = require("@hooks/useLocalize");
var useNetwork_1 = require("@hooks/useNetwork");
var useOnyx_1 = require("@hooks/useOnyx");
var useParticipantsInvoiceReport_1 = require("@hooks/useParticipantsInvoiceReport");
var usePermissions_1 = require("@hooks/usePermissions");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Task_1 = require("@libs/actions/Task");
var DateUtils_1 = require("@libs/DateUtils");
var DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
var FileUtils_1 = require("@libs/fileDownload/FileUtils");
var getCurrentPosition_1 = require("@libs/getCurrentPosition");
var getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
var IOUUtils_1 = require("@libs/IOUUtils");
var Log_1 = require("@libs/Log");
var navigateAfterInteraction_1 = require("@libs/Navigation/navigateAfterInteraction");
var Navigation_1 = require("@libs/Navigation/Navigation");
var NumberUtils_1 = require("@libs/NumberUtils");
var OptionsListUtils_1 = require("@libs/OptionsListUtils");
var Performance_1 = require("@libs/Performance");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var TransactionUtils_1 = require("@libs/TransactionUtils");
var IOU_1 = require("@userActions/IOU");
var Policy_1 = require("@userActions/Policy/Policy");
var TransactionEdit_1 = require("@userActions/TransactionEdit");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
var isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
var withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
var withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepConfirmation(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    var reportReal = _a.report, reportDraft = _a.reportDraft, _w = _a.route.params, iouType = _w.iouType, reportID = _w.reportID, initialTransactionID = _w.transactionID, action = _w.action, participantsAutoAssignedFromRoute = _w.participantsAutoAssigned, backToReport = _w.backToReport, backTo = _w.backTo, initialTransaction = _a.transaction, isLoadingTransaction = _a.isLoadingTransaction;
    var currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    var personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    var _x = (0, react_1.useState)(false), isRemoveConfirmModalVisible = _x[0], setRemoveConfirmModalVisible = _x[1];
    var optimisticTransactions = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT, {
        selector: function (items) { return Object.values(items !== null && items !== void 0 ? items : {}); },
        canBeMissing: true,
    })[0];
    var transactions = (0, react_1.useMemo)(function () {
        var allTransactions = optimisticTransactions && optimisticTransactions.length > 1 ? optimisticTransactions : [initialTransaction];
        return allTransactions.filter(function (transaction) { return !!transaction; });
    }, [initialTransaction, optimisticTransactions]);
    var hasMultipleTransactions = transactions.length > 1;
    // Depend on transactions.length to avoid updating transactionIDs when only the transaction details change
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    var transactionIDs = (0, react_1.useMemo)(function () { return transactions === null || transactions === void 0 ? void 0 : transactions.map(function (transaction) { return transaction.transactionID; }); }, [transactions.length]);
    // We will use setCurrentTransactionID later to switch between transactions
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    var _y = (0, react_1.useState)(initialTransactionID), currentTransactionID = _y[0], setCurrentTransactionID = _y[1];
    var currentTransactionIndex = (0, react_1.useMemo)(function () { return transactions.findIndex(function (transaction) { return transaction.transactionID === currentTransactionID; }); }, [transactions, currentTransactionID]);
    var _z = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat((0, getNonEmptyStringOnyxID_1.default)(currentTransactionID)), { canBeMissing: true }), existingTransaction = _z[0], existingTransactionResult = _z[1];
    var _0 = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT).concat((0, getNonEmptyStringOnyxID_1.default)(currentTransactionID)), { canBeMissing: true }), optimisticTransaction = _0[0], optimisticTransactionResult = _0[1];
    var isLoadingCurrentTransaction = (0, isLoadingOnyxValue_1.default)(existingTransactionResult, optimisticTransactionResult);
    var transaction = (0, react_1.useMemo)(function () { return (!isLoadingCurrentTransaction ? (optimisticTransaction !== null && optimisticTransaction !== void 0 ? optimisticTransaction : existingTransaction) : undefined); }, [existingTransaction, optimisticTransaction, isLoadingCurrentTransaction]);
    var transactionsCategories = (0, useDeepCompareRef_1.default)(transactions.map(function (_a) {
        var transactionID = _a.transactionID, category = _a.category;
        return ({
            transactionID: transactionID,
            category: category,
        });
    }));
    var realPolicyID = (0, IOU_1.getIOURequestPolicyID)(initialTransaction, reportReal);
    var draftPolicyID = (0, IOU_1.getIOURequestPolicyID)(initialTransaction, reportDraft);
    var policyDraft = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY_DRAFTS).concat(draftPolicyID), { canBeMissing: true })[0];
    var policyReal = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(realPolicyID), { canBeMissing: true })[0];
    var policyCategoriesReal = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES).concat(realPolicyID), { canBeMissing: true })[0];
    var policyCategoriesDraft = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES_DRAFT).concat(draftPolicyID), { canBeMissing: true })[0];
    var policyTags = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY_TAGS).concat(realPolicyID), { canBeMissing: true })[0];
    var userLocation = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_LOCATION, { canBeMissing: true })[0];
    var reportAttributesDerived = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true, selector: function (val) { return val === null || val === void 0 ? void 0 : val.reports; } })[0];
    var recentlyUsedDestinations = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_DESTINATIONS).concat(realPolicyID), { canBeMissing: true })[0];
    var policyRecentlyUsedCategories = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_CATEGORIES).concat(realPolicyID), { canBeMissing: true })[0];
    var account = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true })[0];
    /*
     * We want to use a report from the transaction if it exists
     * Also if the report was submitted and delayed submission is on, then we should use an initial report
     */
    var transactionReport = (0, ReportUtils_1.getReportOrDraftReport)(transaction === null || transaction === void 0 ? void 0 : transaction.reportID);
    var shouldUseTransactionReport = transactionReport && !((0, ReportUtils_1.isProcessingReport)(transactionReport) && !((_b = policyReal === null || policyReal === void 0 ? void 0 : policyReal.harvesting) === null || _b === void 0 ? void 0 : _b.enabled)) && (0, ReportUtils_1.isReportOutstanding)(transactionReport, policyReal === null || policyReal === void 0 ? void 0 : policyReal.id, undefined, false);
    var report = shouldUseTransactionReport ? transactionReport : (reportReal !== null && reportReal !== void 0 ? reportReal : reportDraft);
    var policy = policyReal !== null && policyReal !== void 0 ? policyReal : policyDraft;
    var isDraftPolicy = policy === policyDraft;
    var policyCategories = policyCategoriesReal !== null && policyCategoriesReal !== void 0 ? policyCategoriesReal : policyCategoriesDraft;
    var receiverParticipant = (_d = (_c = transaction === null || transaction === void 0 ? void 0 : transaction.participants) === null || _c === void 0 ? void 0 : _c.find(function (participant) { return participant === null || participant === void 0 ? void 0 : participant.accountID; })) !== null && _d !== void 0 ? _d : report === null || report === void 0 ? void 0 : report.invoiceReceiver;
    var receiverAccountID = receiverParticipant && 'accountID' in receiverParticipant && receiverParticipant.accountID ? receiverParticipant.accountID : CONST_1.default.DEFAULT_NUMBER_ID;
    var receiverType = (0, IOU_1.getReceiverType)(receiverParticipant);
    var senderWorkspaceID = (_f = (_e = transaction === null || transaction === void 0 ? void 0 : transaction.participants) === null || _e === void 0 ? void 0 : _e.find(function (participant) { return participant === null || participant === void 0 ? void 0 : participant.isSender; })) === null || _f === void 0 ? void 0 : _f.policyID;
    var existingInvoiceReport = (0, useParticipantsInvoiceReport_1.default)(receiverAccountID, receiverType, senderWorkspaceID);
    var styles = (0, useThemeStyles_1.default)();
    var theme = (0, useTheme_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var isBetaEnabled = (0, usePermissions_1.default)().isBetaEnabled;
    var isOffline = (0, useNetwork_1.default)().isOffline;
    var _1 = (0, react_1.useState)(false), startLocationPermissionFlow = _1[0], setStartLocationPermissionFlow = _1[1];
    var _2 = (0, react_1.useState)([]), selectedParticipantList = _2[0], setSelectedParticipantList = _2[1];
    var _3 = (0, react_1.useState)(false), isDraggingOver = _3[0], setIsDraggingOver = _3[1];
    var _4 = (0, react_1.useState)({}), receiptFiles = _4[0], setReceiptFiles = _4[1];
    var requestType = (0, TransactionUtils_1.getRequestType)(transaction, isBetaEnabled(CONST_1.default.BETAS.MANUAL_DISTANCE));
    var isDistanceRequest = requestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE || requestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MAP || requestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MANUAL;
    var isManualDistanceRequest = requestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MANUAL;
    var isPerDiemRequest = requestType === CONST_1.default.IOU.REQUEST_TYPE.PER_DIEM;
    var lastLocationPermissionPrompt = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_LOCATION_PERMISSION_PROMPT, { canBeMissing: true })[0];
    var receiptFilename = transaction === null || transaction === void 0 ? void 0 : transaction.filename;
    var receiptPath = (_g = transaction === null || transaction === void 0 ? void 0 : transaction.receipt) === null || _g === void 0 ? void 0 : _g.source;
    var isEditingReceipt = (0, TransactionUtils_1.hasReceipt)(transaction);
    var customUnitRateID = (_h = (0, TransactionUtils_1.getRateID)(transaction)) !== null && _h !== void 0 ? _h : '';
    var defaultTaxCode = (0, TransactionUtils_1.getDefaultTaxCode)(policy, transaction);
    var transactionTaxCode = (_j = ((transaction === null || transaction === void 0 ? void 0 : transaction.taxCode) ? transaction === null || transaction === void 0 ? void 0 : transaction.taxCode : defaultTaxCode)) !== null && _j !== void 0 ? _j : '';
    var transactionTaxAmount = (_k = transaction === null || transaction === void 0 ? void 0 : transaction.taxAmount) !== null && _k !== void 0 ? _k : 0;
    var isSharingTrackExpense = action === CONST_1.default.IOU.ACTION.SHARE;
    var isCategorizingTrackExpense = action === CONST_1.default.IOU.ACTION.CATEGORIZE;
    var isMovingTransactionFromTrackExpense = (0, IOUUtils_1.isMovingTransactionFromTrackExpense)(action);
    var isTestTransaction = (_l = transaction === null || transaction === void 0 ? void 0 : transaction.participants) === null || _l === void 0 ? void 0 : _l.some(function (participant) { return (0, ReportUtils_1.isSelectedManagerMcTest)(participant.login); });
    var payeePersonalDetails = (0, react_1.useMemo)(function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (personalDetails === null || personalDetails === void 0 ? void 0 : personalDetails[(_b = (_a = transaction === null || transaction === void 0 ? void 0 : transaction.splitPayerAccountIDs) === null || _a === void 0 ? void 0 : _a.at(0)) !== null && _b !== void 0 ? _b : -1]) {
            return personalDetails === null || personalDetails === void 0 ? void 0 : personalDetails[(_d = (_c = transaction === null || transaction === void 0 ? void 0 : transaction.splitPayerAccountIDs) === null || _c === void 0 ? void 0 : _c.at(0)) !== null && _d !== void 0 ? _d : -1];
        }
        var participant = (_e = transaction === null || transaction === void 0 ? void 0 : transaction.participants) === null || _e === void 0 ? void 0 : _e.find(function (val) { var _a, _b; return val.accountID === ((_b = (_a = transaction === null || transaction === void 0 ? void 0 : transaction.splitPayerAccountIDs) === null || _a === void 0 ? void 0 : _a.at(0)) !== null && _b !== void 0 ? _b : -1); });
        return {
            login: (_f = participant === null || participant === void 0 ? void 0 : participant.login) !== null && _f !== void 0 ? _f : '',
            accountID: (_g = participant === null || participant === void 0 ? void 0 : participant.accountID) !== null && _g !== void 0 ? _g : CONST_1.default.DEFAULT_NUMBER_ID,
            avatar: Expensicons.FallbackAvatar,
            displayName: (_h = participant === null || participant === void 0 ? void 0 : participant.login) !== null && _h !== void 0 ? _h : '',
            isOptimisticPersonalDetail: true,
        };
    }, [personalDetails, transaction === null || transaction === void 0 ? void 0 : transaction.participants, transaction === null || transaction === void 0 ? void 0 : transaction.splitPayerAccountIDs]);
    var gpsRequired = (transaction === null || transaction === void 0 ? void 0 : transaction.amount) === 0 && iouType !== CONST_1.default.IOU.TYPE.SPLIT && Object.values(receiptFiles).length && !isTestTransaction;
    var _5 = (0, react_1.useState)(false), isConfirmed = _5[0], setIsConfirmed = _5[1];
    var _6 = (0, react_1.useState)(false), isConfirming = _6[0], setIsConfirming = _6[1];
    var headerTitle = (0, react_1.useMemo)(function () {
        if (isCategorizingTrackExpense) {
            return translate('iou.categorize');
        }
        if (isSharingTrackExpense) {
            return translate('iou.share');
        }
        if (iouType === CONST_1.default.IOU.TYPE.INVOICE) {
            return translate('workspace.invoices.sendInvoice');
        }
        return translate('iou.confirmDetails');
    }, [iouType, translate, isSharingTrackExpense, isCategorizingTrackExpense]);
    var participants = (0, react_1.useMemo)(function () {
        var _a, _b;
        return (_b = (_a = transaction === null || transaction === void 0 ? void 0 : transaction.participants) === null || _a === void 0 ? void 0 : _a.map(function (participant) {
            if (participant.isSender && iouType === CONST_1.default.IOU.TYPE.INVOICE) {
                return participant;
            }
            return participant.accountID ? (0, OptionsListUtils_1.getParticipantsOption)(participant, personalDetails) : (0, OptionsListUtils_1.getReportOption)(participant, reportAttributesDerived);
        })) !== null && _b !== void 0 ? _b : [];
    }, [transaction === null || transaction === void 0 ? void 0 : transaction.participants, iouType, personalDetails, reportAttributesDerived]);
    var isPolicyExpenseChat = (0, react_1.useMemo)(function () { return participants === null || participants === void 0 ? void 0 : participants.some(function (participant) { return participant.isPolicyExpenseChat; }); }, [participants]);
    var shouldGenerateTransactionThreadReport = !isBetaEnabled(CONST_1.default.BETAS.NO_OPTIMISTIC_TRANSACTION_THREADS) || !(account === null || account === void 0 ? void 0 : account.shouldBlockTransactionThreadReportCreation);
    var formHasBeenSubmitted = (0, react_1.useRef)(false);
    (0, useFetchRoute_1.default)(transaction, (_m = transaction === null || transaction === void 0 ? void 0 : transaction.comment) === null || _m === void 0 ? void 0 : _m.waypoints, action, (0, IOUUtils_1.shouldUseTransactionDraft)(action) ? CONST_1.default.TRANSACTION.STATE.DRAFT : CONST_1.default.TRANSACTION.STATE.CURRENT);
    (0, react_1.useEffect)(function () {
        Performance_1.default.markEnd(CONST_1.default.TIMING.OPEN_CREATE_EXPENSE_APPROVE);
    }, []);
    (0, react_1.useEffect)(function () {
        var policyExpenseChat = participants === null || participants === void 0 ? void 0 : participants.find(function (participant) { return participant.isPolicyExpenseChat; });
        if ((policyExpenseChat === null || policyExpenseChat === void 0 ? void 0 : policyExpenseChat.policyID) && (policy === null || policy === void 0 ? void 0 : policy.pendingAction) !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD) {
            (0, Policy_1.openDraftWorkspaceRequest)(policyExpenseChat.policyID);
        }
        var senderPolicyParticipant = participants === null || participants === void 0 ? void 0 : participants.find(function (participant) { return !!participant && 'isSender' in participant && participant.isSender; });
        if ((senderPolicyParticipant === null || senderPolicyParticipant === void 0 ? void 0 : senderPolicyParticipant.policyID) && (policy === null || policy === void 0 ? void 0 : policy.pendingAction) !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD) {
            (0, Policy_1.openDraftWorkspaceRequest)(senderPolicyParticipant.policyID);
        }
    }, [isOffline, participants, policy === null || policy === void 0 ? void 0 : policy.pendingAction]);
    var defaultBillable = !!(policy === null || policy === void 0 ? void 0 : policy.defaultBillable);
    (0, react_1.useEffect)(function () {
        transactionIDs.forEach(function (transactionID) {
            (0, IOU_1.setMoneyRequestBillable)(transactionID, defaultBillable);
        });
    }, [transactionIDs, defaultBillable]);
    (0, react_1.useEffect)(function () {
        var defaultReimbursable = isPolicyExpenseChat && (0, PolicyUtils_1.isPaidGroupPolicy)(policy) ? !!(policy === null || policy === void 0 ? void 0 : policy.defaultReimbursable) : true;
        transactionIDs.forEach(function (transactionID) {
            (0, IOU_1.setMoneyRequestReimbursable)(transactionID, defaultReimbursable);
        });
    }, [transactionIDs, policy, isPolicyExpenseChat]);
    (0, react_1.useEffect)(function () {
        var _a, _b, _c, _d;
        // Exit early if the transaction is still loading
        if (isLoadingTransaction) {
            return;
        }
        // Check if the transaction belongs to the current report
        var isCurrentReportID = (transaction === null || transaction === void 0 ? void 0 : transaction.isFromGlobalCreate)
            ? ((_b = (_a = transaction === null || transaction === void 0 ? void 0 : transaction.participants) === null || _a === void 0 ? void 0 : _a.at(0)) === null || _b === void 0 ? void 0 : _b.reportID) === reportID || (!((_d = (_c = transaction === null || transaction === void 0 ? void 0 : transaction.participants) === null || _c === void 0 ? void 0 : _c.at(0)) === null || _d === void 0 ? void 0 : _d.reportID) && (transaction === null || transaction === void 0 ? void 0 : transaction.reportID) === reportID)
            : (transaction === null || transaction === void 0 ? void 0 : transaction.reportID) === reportID;
        // Exit if the transaction already exists and is associated with the current report
        if ((transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) &&
            (!(transaction === null || transaction === void 0 ? void 0 : transaction.isFromGlobalCreate) || !(0, EmptyObject_1.isEmptyObject)(transaction === null || transaction === void 0 ? void 0 : transaction.participants)) &&
            (isCurrentReportID || isMovingTransactionFromTrackExpense || iouType === CONST_1.default.IOU.TYPE.INVOICE)) {
            return;
        }
        (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.CREATE, 
        // When starting to create an expense from the global FAB, there is not an existing report yet. A random optimistic reportID is generated and used
        // for all of the routes in the creation flow.
        (0, ReportUtils_1.generateReportID)());
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- we don't want this effect to run again
    }, [isLoadingTransaction, isMovingTransactionFromTrackExpense]);
    (0, react_1.useEffect)(function () {
        transactions.forEach(function (item) {
            if (!item.category) {
                return;
            }
            if ((policyCategories === null || policyCategories === void 0 ? void 0 : policyCategories[item.category]) && !policyCategories[item.category].enabled) {
                (0, IOU_1.setMoneyRequestCategory)(item.transactionID, '', policy === null || policy === void 0 ? void 0 : policy.id);
            }
        });
        // We don't want to clear out category every time the transactions change
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [policy === null || policy === void 0 ? void 0 : policy.id, policyCategories, transactionsCategories]);
    var policyDistance = Object.values((_o = policy === null || policy === void 0 ? void 0 : policy.customUnits) !== null && _o !== void 0 ? _o : {}).find(function (customUnit) { return customUnit.name === CONST_1.default.CUSTOM_UNITS.NAME_DISTANCE; });
    var defaultCategory = (_p = policyDistance === null || policyDistance === void 0 ? void 0 : policyDistance.defaultCategory) !== null && _p !== void 0 ? _p : '';
    (0, react_1.useEffect)(function () {
        transactions.forEach(function (item) {
            if (!isDistanceRequest || !!(item === null || item === void 0 ? void 0 : item.category)) {
                return;
            }
            (0, IOU_1.setMoneyRequestCategory)(item.transactionID, defaultCategory, policy === null || policy === void 0 ? void 0 : policy.id);
        });
        // Prevent resetting to default when unselect category
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [transactionIDs, requestType, defaultCategory, policy === null || policy === void 0 ? void 0 : policy.id]);
    var navigateBack = (0, react_1.useCallback)(function () {
        var _a, _b, _c, _d, _e, _f;
        if (backTo) {
            Navigation_1.default.goBack(backTo);
            return;
        }
        // If the action is categorize and there's no policies other than personal one, we simply call goBack(), i.e: dismiss the whole flow together
        // We don't need to subscribe to policy_ collection as we only need to check on the latest collection value
        if (action === CONST_1.default.IOU.ACTION.CATEGORIZE) {
            Navigation_1.default.goBack();
            return;
        }
        if (isPerDiemRequest) {
            if (isMovingTransactionFromTrackExpense) {
                Navigation_1.default.goBack();
                return;
            }
            Navigation_1.default.goBack(ROUTES_1.default.MONEY_REQUEST_STEP_SUBRATE.getRoute(action, iouType, initialTransactionID, reportID));
            return;
        }
        if ((transaction === null || transaction === void 0 ? void 0 : transaction.isFromGlobalCreate) && !((_a = transaction.receipt) === null || _a === void 0 ? void 0 : _a.isTestReceipt)) {
            // If the participants weren't automatically added to the transaction, then we should go back to the IOURequestStepParticipants.
            if (!(transaction === null || transaction === void 0 ? void 0 : transaction.participantsAutoAssigned) && participantsAutoAssignedFromRoute !== 'true') {
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                Navigation_1.default.goBack(ROUTES_1.default.MONEY_REQUEST_STEP_PARTICIPANTS.getRoute(iouType, initialTransactionID, (transaction === null || transaction === void 0 ? void 0 : transaction.reportID) || reportID, undefined, action), {
                    compareParams: false,
                });
                return;
            }
            // If the participant was auto-assigned, we need to keep the reportID that is already on the stack.
            // This will allow the user to edit the participant field after going back and forward.
            Navigation_1.default.goBack();
            return;
        }
        // If the user came from Test Drive modal, we need to take him back there
        if (((_b = transaction === null || transaction === void 0 ? void 0 : transaction.receipt) === null || _b === void 0 ? void 0 : _b.isTestDriveReceipt) && ((_d = (_c = transaction.participants) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) > 0) {
            Navigation_1.default.goBack(ROUTES_1.default.TEST_DRIVE_MODAL_ROOT.getRoute((_f = (_e = transaction.participants) === null || _e === void 0 ? void 0 : _e.at(0)) === null || _f === void 0 ? void 0 : _f.login));
            return;
        }
        // This has selected the participants from the beginning and the participant field shouldn't be editable.
        (0, IOUUtils_1.navigateToStartMoneyRequestStep)(requestType, iouType, initialTransactionID, reportID, action);
    }, [
        action,
        isPerDiemRequest,
        transaction === null || transaction === void 0 ? void 0 : transaction.isFromGlobalCreate,
        (_q = transaction === null || transaction === void 0 ? void 0 : transaction.receipt) === null || _q === void 0 ? void 0 : _q.isTestReceipt,
        (_r = transaction === null || transaction === void 0 ? void 0 : transaction.receipt) === null || _r === void 0 ? void 0 : _r.isTestDriveReceipt,
        transaction === null || transaction === void 0 ? void 0 : transaction.participants,
        transaction === null || transaction === void 0 ? void 0 : transaction.participantsAutoAssigned,
        transaction === null || transaction === void 0 ? void 0 : transaction.reportID,
        requestType,
        iouType,
        initialTransactionID,
        reportID,
        isMovingTransactionFromTrackExpense,
        participantsAutoAssignedFromRoute,
        backTo,
    ]);
    // When the component mounts, if there is a receipt, see if the image can be read from the disk. If not, redirect the user to the starting step of the flow.
    // This is because until the request is saved, the receipt file is only stored in the browsers memory as a blob:// and if the browser is refreshed, then
    // the image ceases to exist. The best way for the user to recover from this is to start over from the start of the request process.
    // skip this in case user is moving the transaction as the receipt path will be valid in that case
    (0, react_1.useEffect)(function () {
        var newReceiptFiles = {};
        var isScanFilesCanBeRead = true;
        Promise.all(transactions.map(function (item) {
            var _a;
            var _b, _c;
            var itemReceiptFilename = item.filename;
            var itemReceiptPath = (_b = item.receipt) === null || _b === void 0 ? void 0 : _b.source;
            var itemReceiptType = (_c = item.receipt) === null || _c === void 0 ? void 0 : _c.type;
            var isLocalFile = (0, FileUtils_1.isLocalFile)(itemReceiptPath);
            if (!isLocalFile) {
                if (item.receipt) {
                    newReceiptFiles = __assign(__assign({}, newReceiptFiles), (_a = {}, _a[item.transactionID] = item.receipt, _a));
                }
                return;
            }
            var onSuccess = function (file) {
                var _a;
                var _b, _c;
                var receipt = file;
                if ((_b = item === null || item === void 0 ? void 0 : item.receipt) === null || _b === void 0 ? void 0 : _b.isTestReceipt) {
                    receipt.isTestReceipt = true;
                    receipt.state = CONST_1.default.IOU.RECEIPT_STATE.SCAN_COMPLETE;
                }
                else if ((_c = item === null || item === void 0 ? void 0 : item.receipt) === null || _c === void 0 ? void 0 : _c.isTestDriveReceipt) {
                    receipt.isTestDriveReceipt = true;
                    receipt.state = CONST_1.default.IOU.RECEIPT_STATE.SCAN_COMPLETE;
                }
                else {
                    receipt.state = file && requestType === CONST_1.default.IOU.REQUEST_TYPE.MANUAL ? CONST_1.default.IOU.RECEIPT_STATE.OPEN : CONST_1.default.IOU.RECEIPT_STATE.SCAN_READY;
                }
                newReceiptFiles = __assign(__assign({}, newReceiptFiles), (_a = {}, _a[item.transactionID] = receipt, _a));
            };
            var onFailure = function () {
                isScanFilesCanBeRead = false;
                if (initialTransactionID === item.transactionID) {
                    (0, IOU_1.setMoneyRequestReceipt)(item.transactionID, '', '', true);
                }
            };
            return (0, IOU_1.checkIfScanFileCanBeRead)(itemReceiptFilename, itemReceiptPath, itemReceiptType, onSuccess, onFailure);
        })).then(function () {
            if (isScanFilesCanBeRead) {
                setReceiptFiles(newReceiptFiles);
                return;
            }
            if (requestType === CONST_1.default.IOU.REQUEST_TYPE.MANUAL) {
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_SCAN.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, initialTransactionID, reportID, Navigation_1.default.getActiveRouteWithoutParams()));
                return;
            }
            (0, TransactionEdit_1.removeDraftTransactions)(true);
            (0, IOUUtils_1.navigateToStartMoneyRequestStep)(requestType, iouType, initialTransactionID, reportID);
        });
    }, [requestType, iouType, initialTransactionID, reportID, action, report, transactions, participants]);
    var requestMoney = (0, react_1.useCallback)(function (selectedParticipants, gpsPoints) {
        if (!transactions.length) {
            return;
        }
        var participant = selectedParticipants.at(0);
        if (!participant) {
            return;
        }
        var optimisticChatReportID = (0, ReportUtils_1.generateReportID)();
        var optimisticCreatedReportActionID = (0, NumberUtils_1.rand64)();
        var optimisticIOUReportID = (0, ReportUtils_1.generateReportID)();
        var optimisticReportPreviewActionID = (0, NumberUtils_1.rand64)();
        transactions.forEach(function (item, index) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            var receipt = receiptFiles[item.transactionID];
            var isTestReceipt = (_a = receipt === null || receipt === void 0 ? void 0 : receipt.isTestReceipt) !== null && _a !== void 0 ? _a : false;
            var isTestDriveReceipt = (_b = receipt === null || receipt === void 0 ? void 0 : receipt.isTestDriveReceipt) !== null && _b !== void 0 ? _b : false;
            if (isTestDriveReceipt) {
                (0, Task_1.completeTestDriveTask)();
            }
            (0, IOU_1.requestMoney)({
                report: report,
                optimisticChatReportID: optimisticChatReportID,
                optimisticCreatedReportActionID: optimisticCreatedReportActionID,
                optimisticIOUReportID: optimisticIOUReportID,
                optimisticReportPreviewActionID: optimisticReportPreviewActionID,
                participantParams: {
                    payeeEmail: currentUserPersonalDetails.login,
                    payeeAccountID: currentUserPersonalDetails.accountID,
                    participant: participant,
                },
                policyParams: {
                    policy: policy,
                    policyTagList: policyTags,
                    policyCategories: policyCategories,
                },
                gpsPoints: gpsPoints,
                action: action,
                transactionParams: {
                    amount: isTestReceipt ? CONST_1.default.TEST_RECEIPT.AMOUNT : item.amount,
                    attendees: (_c = item.comment) === null || _c === void 0 ? void 0 : _c.attendees,
                    currency: isTestReceipt ? CONST_1.default.TEST_RECEIPT.CURRENCY : item.currency,
                    created: item.created,
                    merchant: isTestReceipt ? CONST_1.default.TEST_RECEIPT.MERCHANT : item.merchant,
                    comment: (_f = (_e = (_d = item === null || item === void 0 ? void 0 : item.comment) === null || _d === void 0 ? void 0 : _d.comment) === null || _e === void 0 ? void 0 : _e.trim()) !== null && _f !== void 0 ? _f : '',
                    receipt: receipt,
                    category: item.category,
                    tag: item.tag,
                    taxCode: transactionTaxCode,
                    taxAmount: transactionTaxAmount,
                    billable: item.billable,
                    reimbursable: item.reimbursable,
                    actionableWhisperReportActionID: item.actionableWhisperReportActionID,
                    linkedTrackedExpenseReportAction: item.linkedTrackedExpenseReportAction,
                    linkedTrackedExpenseReportID: item.linkedTrackedExpenseReportID,
                    waypoints: Object.keys((_h = (_g = item.comment) === null || _g === void 0 ? void 0 : _g.waypoints) !== null && _h !== void 0 ? _h : {}).length ? (0, TransactionUtils_1.getValidWaypoints)((_j = item.comment) === null || _j === void 0 ? void 0 : _j.waypoints, true) : undefined,
                    customUnitRateID: customUnitRateID,
                    isTestDrive: (_k = item.receipt) === null || _k === void 0 ? void 0 : _k.isTestDriveReceipt,
                    originalTransactionID: (_l = item.comment) === null || _l === void 0 ? void 0 : _l.originalTransactionID,
                    source: (_m = item.comment) === null || _m === void 0 ? void 0 : _m.source,
                },
                shouldHandleNavigation: index === transactions.length - 1,
                shouldGenerateTransactionThreadReport: shouldGenerateTransactionThreadReport,
                backToReport: backToReport,
            });
        });
    }, [
        report,
        transactions,
        receiptFiles,
        currentUserPersonalDetails.login,
        currentUserPersonalDetails.accountID,
        policy,
        policyTags,
        policyCategories,
        action,
        transactionTaxCode,
        transactionTaxAmount,
        customUnitRateID,
        backToReport,
        shouldGenerateTransactionThreadReport,
    ]);
    var submitPerDiemExpense = (0, react_1.useCallback)(function (selectedParticipants, trimmedComment, policyRecentlyUsedCategoriesParam) {
        var _a, _b;
        if (!transaction) {
            return;
        }
        var participant = selectedParticipants.at(0);
        if (!participant || (0, EmptyObject_1.isEmptyObject)(transaction.comment) || (0, EmptyObject_1.isEmptyObject)(transaction.comment.customUnit)) {
            return;
        }
        (0, IOU_1.submitPerDiemExpense)({
            report: report,
            participantParams: {
                payeeEmail: currentUserPersonalDetails.login,
                payeeAccountID: currentUserPersonalDetails.accountID,
                participant: participant,
            },
            policyParams: {
                policy: policy,
                policyTagList: policyTags,
                policyCategories: policyCategories,
                policyRecentlyUsedCategories: policyRecentlyUsedCategoriesParam,
            },
            recentlyUsedParams: {
                destinations: recentlyUsedDestinations,
            },
            transactionParams: {
                currency: transaction.currency,
                created: transaction.created,
                comment: trimmedComment,
                category: transaction.category,
                tag: transaction.tag,
                customUnit: (_a = transaction.comment) === null || _a === void 0 ? void 0 : _a.customUnit,
                billable: transaction.billable,
                reimbursable: transaction.reimbursable,
                attendees: (_b = transaction.comment) === null || _b === void 0 ? void 0 : _b.attendees,
            },
        });
    }, [report, transaction, currentUserPersonalDetails.login, currentUserPersonalDetails.accountID, policy, policyTags, policyCategories, recentlyUsedDestinations]);
    var trackExpense = (0, react_1.useCallback)(function (selectedParticipants, gpsPoints) {
        if (!report || !transactions.length) {
            return;
        }
        var participant = selectedParticipants.at(0);
        if (!participant) {
            return;
        }
        transactions.forEach(function (item, index) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            (0, IOU_1.trackExpense)({
                report: report,
                isDraftPolicy: isDraftPolicy,
                action: action,
                participantParams: {
                    payeeEmail: currentUserPersonalDetails.login,
                    payeeAccountID: currentUserPersonalDetails.accountID,
                    participant: participant,
                },
                policyParams: {
                    policy: policy,
                    policyCategories: policyCategories,
                    policyTagList: policyTags,
                },
                transactionParams: {
                    amount: item.amount,
                    distance: isManualDistanceRequest ? ((_c = (_b = (_a = item.comment) === null || _a === void 0 ? void 0 : _a.customUnit) === null || _b === void 0 ? void 0 : _b.quantity) !== null && _c !== void 0 ? _c : undefined) : undefined,
                    currency: item.currency,
                    created: item.created,
                    merchant: item.merchant,
                    comment: (_f = (_e = (_d = item === null || item === void 0 ? void 0 : item.comment) === null || _d === void 0 ? void 0 : _d.comment) === null || _e === void 0 ? void 0 : _e.trim()) !== null && _f !== void 0 ? _f : '',
                    receipt: receiptFiles[item.transactionID],
                    category: item.category,
                    tag: item.tag,
                    taxCode: transactionTaxCode,
                    taxAmount: transactionTaxAmount,
                    billable: item.billable,
                    reimbursable: item.reimbursable,
                    gpsPoints: gpsPoints,
                    validWaypoints: Object.keys((_h = (_g = item === null || item === void 0 ? void 0 : item.comment) === null || _g === void 0 ? void 0 : _g.waypoints) !== null && _h !== void 0 ? _h : {}).length ? (0, TransactionUtils_1.getValidWaypoints)((_j = item.comment) === null || _j === void 0 ? void 0 : _j.waypoints, true) : undefined,
                    actionableWhisperReportActionID: item.actionableWhisperReportActionID,
                    linkedTrackedExpenseReportAction: item.linkedTrackedExpenseReportAction,
                    linkedTrackedExpenseReportID: item.linkedTrackedExpenseReportID,
                    customUnitRateID: customUnitRateID,
                    attendees: (_k = item.comment) === null || _k === void 0 ? void 0 : _k.attendees,
                },
                accountantParams: {
                    accountant: item.accountant,
                },
                shouldHandleNavigation: index === transactions.length - 1,
            });
        });
    }, [
        report,
        transactions,
        receiptFiles,
        currentUserPersonalDetails.login,
        currentUserPersonalDetails.accountID,
        transactionTaxCode,
        transactionTaxAmount,
        policy,
        policyTags,
        policyCategories,
        action,
        customUnitRateID,
        isDraftPolicy,
        isManualDistanceRequest,
    ]);
    var createDistanceRequest = (0, react_1.useCallback)(function (selectedParticipants, trimmedComment) {
        var _a, _b, _c, _d, _e;
        if (!transaction) {
            return;
        }
        (0, IOU_1.createDistanceRequest)({
            report: report,
            participants: selectedParticipants,
            currentUserLogin: currentUserPersonalDetails.login,
            currentUserAccountID: currentUserPersonalDetails.accountID,
            iouType: iouType,
            existingTransaction: transaction,
            policyParams: {
                policy: policy,
                policyCategories: policyCategories,
                policyTagList: policyTags,
            },
            transactionParams: {
                amount: transaction.amount,
                comment: trimmedComment,
                distance: isManualDistanceRequest ? ((_c = (_b = (_a = transaction.comment) === null || _a === void 0 ? void 0 : _a.customUnit) === null || _b === void 0 ? void 0 : _b.quantity) !== null && _c !== void 0 ? _c : undefined) : undefined,
                created: transaction.created,
                currency: transaction.currency,
                merchant: transaction.merchant,
                category: transaction.category,
                tag: transaction.tag,
                taxCode: transactionTaxCode,
                taxAmount: transactionTaxAmount,
                customUnitRateID: customUnitRateID,
                splitShares: transaction.splitShares,
                validWaypoints: (0, TransactionUtils_1.getValidWaypoints)((_d = transaction.comment) === null || _d === void 0 ? void 0 : _d.waypoints, true),
                billable: transaction.billable,
                reimbursable: transaction.reimbursable,
                attendees: (_e = transaction.comment) === null || _e === void 0 ? void 0 : _e.attendees,
            },
            backToReport: backToReport,
        });
    }, [
        transaction,
        report,
        currentUserPersonalDetails.login,
        currentUserPersonalDetails.accountID,
        iouType,
        isManualDistanceRequest,
        policy,
        policyCategories,
        policyTags,
        transactionTaxCode,
        transactionTaxAmount,
        customUnitRateID,
        backToReport,
    ]);
    var createTransaction = (0, react_1.useCallback)(function (selectedParticipants, locationPermissionGranted) {
        var _a, _b, _c, _d, _e;
        if (locationPermissionGranted === void 0) { locationPermissionGranted = false; }
        setIsConfirmed(true);
        var splitParticipants = selectedParticipants;
        // Filter out participants with an amount equal to O
        if (iouType === CONST_1.default.IOU.TYPE.SPLIT && (transaction === null || transaction === void 0 ? void 0 : transaction.splitShares)) {
            var participantsWithAmount_1 = Object.keys((_a = transaction.splitShares) !== null && _a !== void 0 ? _a : {})
                .filter(function (accountID) { var _a, _b, _c; return ((_c = (_b = (_a = transaction === null || transaction === void 0 ? void 0 : transaction.splitShares) === null || _a === void 0 ? void 0 : _a[Number(accountID)]) === null || _b === void 0 ? void 0 : _b.amount) !== null && _c !== void 0 ? _c : 0) > 0; })
                .map(function (accountID) { return Number(accountID); });
            splitParticipants = selectedParticipants.filter(function (participant) {
                var _a, _b;
                return participantsWithAmount_1.includes(participant.isPolicyExpenseChat ? ((_a = participant === null || participant === void 0 ? void 0 : participant.ownerAccountID) !== null && _a !== void 0 ? _a : CONST_1.default.DEFAULT_NUMBER_ID) : ((_b = participant.accountID) !== null && _b !== void 0 ? _b : CONST_1.default.DEFAULT_NUMBER_ID));
            });
        }
        var trimmedComment = (_d = (_c = (_b = transaction === null || transaction === void 0 ? void 0 : transaction.comment) === null || _b === void 0 ? void 0 : _b.comment) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : '';
        // Don't let the form be submitted multiple times while the navigator is waiting to take the user to a different page
        if (formHasBeenSubmitted.current) {
            return;
        }
        formHasBeenSubmitted.current = true;
        if (iouType !== CONST_1.default.IOU.TYPE.TRACK && isDistanceRequest && !isMovingTransactionFromTrackExpense) {
            createDistanceRequest(iouType === CONST_1.default.IOU.TYPE.SPLIT ? splitParticipants : selectedParticipants, trimmedComment);
            return;
        }
        var currentTransactionReceiptFile = (transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) ? receiptFiles[transaction.transactionID] : undefined;
        if (iouType === CONST_1.default.IOU.TYPE.SPLIT && Object.values(receiptFiles).filter(function (receipt) { return !!receipt; }).length) {
            var currentUserLogin_1 = currentUserPersonalDetails.login;
            if (currentUserLogin_1) {
                transactions.forEach(function (item, index) {
                    var _a, _b, _c;
                    var transactionReceiptFile = receiptFiles[item.transactionID];
                    if (!transactionReceiptFile) {
                        return;
                    }
                    var itemTrimmedComment = (_c = (_b = (_a = item === null || item === void 0 ? void 0 : item.comment) === null || _a === void 0 ? void 0 : _a.comment) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : '';
                    // If we have a receipt let's start the split expense by creating only the action, the transaction, and the group DM if needed
                    (0, IOU_1.startSplitBill)({
                        participants: selectedParticipants,
                        currentUserLogin: currentUserLogin_1,
                        currentUserAccountID: currentUserPersonalDetails.accountID,
                        comment: itemTrimmedComment,
                        receipt: transactionReceiptFile,
                        existingSplitChatReportID: report === null || report === void 0 ? void 0 : report.reportID,
                        billable: item.billable,
                        reimbursable: item.reimbursable,
                        category: item.category,
                        tag: item.tag,
                        currency: item.currency,
                        taxCode: transactionTaxCode,
                        taxAmount: transactionTaxAmount,
                        shouldPlaySound: index === transactions.length - 1,
                    });
                });
            }
            return;
        }
        // IOUs created from a group report will have a reportID param in the route.
        // Since the user is already viewing the report, we don't need to navigate them to the report
        if (iouType === CONST_1.default.IOU.TYPE.SPLIT && !(transaction === null || transaction === void 0 ? void 0 : transaction.isFromGlobalCreate)) {
            if (currentUserPersonalDetails.login && !!transaction) {
                (0, IOU_1.splitBill)({
                    participants: splitParticipants,
                    currentUserLogin: currentUserPersonalDetails.login,
                    currentUserAccountID: currentUserPersonalDetails.accountID,
                    amount: transaction.amount,
                    comment: trimmedComment,
                    currency: transaction.currency,
                    merchant: transaction.merchant,
                    created: transaction.created,
                    category: transaction.category,
                    tag: transaction.tag,
                    existingSplitChatReportID: report === null || report === void 0 ? void 0 : report.reportID,
                    billable: transaction.billable,
                    reimbursable: transaction.reimbursable,
                    iouRequestType: transaction.iouRequestType,
                    splitShares: transaction.splitShares,
                    splitPayerAccountIDs: (_e = transaction.splitPayerAccountIDs) !== null && _e !== void 0 ? _e : [],
                    taxCode: transactionTaxCode,
                    taxAmount: transactionTaxAmount,
                });
            }
            return;
        }
        // If the split expense is created from the global create menu, we also navigate the user to the group report
        if (iouType === CONST_1.default.IOU.TYPE.SPLIT) {
            if (currentUserPersonalDetails.login && !!transaction) {
                (0, IOU_1.splitBillAndOpenReport)({
                    participants: splitParticipants,
                    currentUserLogin: currentUserPersonalDetails.login,
                    currentUserAccountID: currentUserPersonalDetails.accountID,
                    amount: transaction.amount,
                    comment: trimmedComment,
                    currency: transaction.currency,
                    merchant: transaction.merchant,
                    created: transaction.created,
                    category: transaction.category,
                    tag: transaction.tag,
                    billable: !!transaction.billable,
                    reimbursable: !!transaction.reimbursable,
                    iouRequestType: transaction.iouRequestType,
                    splitShares: transaction.splitShares,
                    splitPayerAccountIDs: transaction.splitPayerAccountIDs,
                    taxCode: transactionTaxCode,
                    taxAmount: transactionTaxAmount,
                });
            }
            return;
        }
        if (iouType === CONST_1.default.IOU.TYPE.INVOICE) {
            var invoiceChatReport = !(0, EmptyObject_1.isEmptyObject)(report) && (report === null || report === void 0 ? void 0 : report.reportID) ? report : existingInvoiceReport;
            (0, IOU_1.sendInvoice)(currentUserPersonalDetails.accountID, transaction, invoiceChatReport, currentTransactionReceiptFile, policy, policyTags, policyCategories, undefined, undefined, policyRecentlyUsedCategories);
            return;
        }
        if (iouType === CONST_1.default.IOU.TYPE.TRACK || isCategorizingTrackExpense || isSharingTrackExpense) {
            if (Object.values(receiptFiles).filter(function (receipt) { return !!receipt; }).length && transaction) {
                // If the transaction amount is zero, then the money is being requested through the "Scan" flow and the GPS coordinates need to be included.
                if (transaction.amount === 0 && !isSharingTrackExpense && !isCategorizingTrackExpense && locationPermissionGranted) {
                    if (userLocation) {
                        trackExpense(selectedParticipants, {
                            lat: userLocation.latitude,
                            long: userLocation.longitude,
                        });
                        return;
                    }
                    (0, getCurrentPosition_1.default)(function (successData) {
                        trackExpense(selectedParticipants, {
                            lat: successData.coords.latitude,
                            long: successData.coords.longitude,
                        });
                    }, function (errorData) {
                        Log_1.default.info('[IOURequestStepConfirmation] getCurrentPosition failed', false, errorData);
                        // When there is an error, the money can still be requested, it just won't include the GPS coordinates
                        trackExpense(selectedParticipants);
                    }, {
                        maximumAge: CONST_1.default.GPS.MAX_AGE,
                        timeout: CONST_1.default.GPS.TIMEOUT,
                    });
                    return;
                }
                // Otherwise, the money is being requested through the "Manual" flow with an attached image and the GPS coordinates are not needed.
                trackExpense(selectedParticipants);
                return;
            }
            trackExpense(selectedParticipants);
            return;
        }
        if (isPerDiemRequest) {
            submitPerDiemExpense(selectedParticipants, trimmedComment, policyRecentlyUsedCategories);
            return;
        }
        if (Object.values(receiptFiles).filter(function (receipt) { return !!receipt; }).length && !!transaction) {
            // If the transaction amount is zero, then the money is being requested through the "Scan" flow and the GPS coordinates need to be included.
            if (transaction.amount === 0 &&
                !isSharingTrackExpense &&
                !isCategorizingTrackExpense &&
                locationPermissionGranted &&
                !selectedParticipants.some(function (participant) { return (0, ReportUtils_1.isSelectedManagerMcTest)(participant.login); })) {
                if (userLocation) {
                    requestMoney(selectedParticipants, {
                        lat: userLocation.latitude,
                        long: userLocation.longitude,
                    });
                    return;
                }
                (0, getCurrentPosition_1.default)(function (successData) {
                    requestMoney(selectedParticipants, {
                        lat: successData.coords.latitude,
                        long: successData.coords.longitude,
                    });
                }, function (errorData) {
                    Log_1.default.info('[IOURequestStepConfirmation] getCurrentPosition failed', false, errorData);
                    // When there is an error, the money can still be requested, it just won't include the GPS coordinates
                    requestMoney(selectedParticipants);
                }, {
                    maximumAge: CONST_1.default.GPS.MAX_AGE,
                    timeout: CONST_1.default.GPS.TIMEOUT,
                });
                return;
            }
            // Otherwise, the money is being requested through the "Manual" flow with an attached image and the GPS coordinates are not needed.
            requestMoney(selectedParticipants);
            return;
        }
        requestMoney(selectedParticipants);
    }, [
        iouType,
        transaction,
        transactions,
        isDistanceRequest,
        isMovingTransactionFromTrackExpense,
        receiptFiles,
        isCategorizingTrackExpense,
        isSharingTrackExpense,
        isPerDiemRequest,
        requestMoney,
        createDistanceRequest,
        currentUserPersonalDetails.login,
        currentUserPersonalDetails.accountID,
        report,
        transactions,
        transactionTaxCode,
        transactionTaxAmount,
        policy,
        policyTags,
        policyCategories,
        policyRecentlyUsedCategories,
        trackExpense,
        userLocation,
        submitPerDiemExpense,
        existingInvoiceReport,
    ]);
    /**
     * Checks if user has a GOLD wallet then creates a paid IOU report on the fly
     */
    var sendMoney = (0, react_1.useCallback)(function (paymentMethod) {
        var _a, _b, _c;
        var currency = transaction === null || transaction === void 0 ? void 0 : transaction.currency;
        var trimmedComment = (_c = (_b = (_a = transaction === null || transaction === void 0 ? void 0 : transaction.comment) === null || _a === void 0 ? void 0 : _a.comment) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : '';
        var participant = participants === null || participants === void 0 ? void 0 : participants.at(0);
        if (!participant || !(transaction === null || transaction === void 0 ? void 0 : transaction.amount) || !currency) {
            return;
        }
        if (paymentMethod === CONST_1.default.IOU.PAYMENT_TYPE.ELSEWHERE) {
            setIsConfirmed(true);
            (0, IOU_1.sendMoneyElsewhere)(report, transaction.amount, currency, trimmedComment, currentUserPersonalDetails.accountID, participant);
            return;
        }
        if (paymentMethod === CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY) {
            setIsConfirmed(true);
            (0, IOU_1.sendMoneyWithWallet)(report, transaction.amount, currency, trimmedComment, currentUserPersonalDetails.accountID, participant);
        }
    }, [transaction === null || transaction === void 0 ? void 0 : transaction.amount, transaction === null || transaction === void 0 ? void 0 : transaction.comment, transaction === null || transaction === void 0 ? void 0 : transaction.currency, participants, currentUserPersonalDetails.accountID, report]);
    var setBillable = (0, react_1.useCallback)(function (billable) {
        (0, IOU_1.setMoneyRequestBillable)(currentTransactionID, billable);
    }, [currentTransactionID]);
    var setReimbursable = (0, react_1.useCallback)(function (reimbursable) {
        (0, IOU_1.setMoneyRequestReimbursable)(currentTransactionID, reimbursable);
    }, [currentTransactionID]);
    // This loading indicator is shown because the transaction originalCurrency is being updated later than the component mounts.
    // To prevent the component from rendering with the wrong currency, we show a loading indicator until the correct currency is set.
    var isLoading = !!(transaction === null || transaction === void 0 ? void 0 : transaction.originalCurrency);
    var onConfirm = function (listOfParticipants) {
        setIsConfirming(true);
        setSelectedParticipantList(listOfParticipants);
        if (gpsRequired) {
            var shouldStartLocationPermissionFlow = !lastLocationPermissionPrompt ||
                (DateUtils_1.default.isValidDateString(lastLocationPermissionPrompt !== null && lastLocationPermissionPrompt !== void 0 ? lastLocationPermissionPrompt : '') &&
                    DateUtils_1.default.getDifferenceInDaysFromNow(new Date(lastLocationPermissionPrompt !== null && lastLocationPermissionPrompt !== void 0 ? lastLocationPermissionPrompt : '')) > CONST_1.default.IOU.LOCATION_PERMISSION_PROMPT_THRESHOLD_DAYS);
            if (shouldStartLocationPermissionFlow) {
                setStartLocationPermissionFlow(true);
                return;
            }
        }
        createTransaction(listOfParticipants);
        setIsConfirming(false);
    };
    /**
     * Sets the Receipt object when dragging and dropping a file
     */
    var setReceiptOnDrop = function (files) {
        var _a;
        var file = files.at(0);
        if (!file) {
            return;
        }
        var source = URL.createObjectURL(file);
        (0, IOU_1.setMoneyRequestReceipt)(currentTransactionID, source, (_a = file.name) !== null && _a !== void 0 ? _a : '', true);
    };
    var _7 = (0, useFilesValidation_1.default)(setReceiptOnDrop), validateFiles = _7.validateFiles, PDFValidationComponent = _7.PDFValidationComponent, ErrorModal = _7.ErrorModal;
    var handleDroppingReceipt = function (e) {
        var _a, _b;
        var file = (_a = e === null || e === void 0 ? void 0 : e.dataTransfer) === null || _a === void 0 ? void 0 : _a.files[0];
        if (file) {
            file.uri = URL.createObjectURL(file);
            validateFiles([file], Array.from((_b = e.dataTransfer) === null || _b === void 0 ? void 0 : _b.items));
        }
    };
    if (isLoadingTransaction) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    var showNextTransaction = function () {
        var nextTransaction = transactions.at(currentTransactionIndex + 1);
        if (nextTransaction) {
            setCurrentTransactionID(nextTransaction.transactionID);
        }
    };
    var showPreviousTransaction = function () {
        var previousTransaction = transactions.at(currentTransactionIndex - 1);
        if (previousTransaction) {
            setCurrentTransactionID(previousTransaction.transactionID);
        }
    };
    var removeCurrentTransaction = function () {
        if (currentTransactionID === CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID) {
            var nextTransaction = transactions.at(currentTransactionIndex + 1);
            (0, TransactionEdit_1.replaceDefaultDraftTransaction)(nextTransaction);
            setRemoveConfirmModalVisible(false);
            return;
        }
        (0, TransactionEdit_1.removeDraftTransaction)(currentTransactionID);
        setRemoveConfirmModalVisible(false);
        showPreviousTransaction();
    };
    var showReceiptEmptyState = (0, IOUUtils_1.shouldShowReceiptEmptyState)(iouType, action, policy, isPerDiemRequest, isManualDistanceRequest);
    var shouldShowSmartScanFields = !!((_s = transaction === null || transaction === void 0 ? void 0 : transaction.receipt) === null || _s === void 0 ? void 0 : _s.isTestDriveReceipt) || (isMovingTransactionFromTrackExpense ? (transaction === null || transaction === void 0 ? void 0 : transaction.amount) !== 0 : requestType !== CONST_1.default.IOU.REQUEST_TYPE.SCAN);
    return (<ScreenWrapper_1.default shouldEnableMaxHeight={(0, DeviceCapabilities_1.canUseTouchScreen)()} testID={IOURequestStepConfirmation.displayName} headerGapStyles={isDraggingOver ? [styles.dropWrapper] : []}>
            <Provider_1.default setIsDraggingOver={setIsDraggingOver} isDisabled={!showReceiptEmptyState}>
                <react_native_1.View style={styles.flex1}>
                    <HeaderWithBackButton_1.default title={headerTitle} subtitle={hasMultipleTransactions ? "".concat(currentTransactionIndex + 1, " ").concat(translate('common.of'), " ").concat(transactions.length) : undefined} onBackButtonPress={navigateBack} shouldDisplayHelpButton={!hasMultipleTransactions}>
                        {hasMultipleTransactions ? (<PrevNextButtons_1.default isPrevButtonDisabled={currentTransactionIndex === 0} isNextButtonDisabled={currentTransactionIndex === transactions.length - 1} onNext={showNextTransaction} onPrevious={showPreviousTransaction}/>) : null}
                    </HeaderWithBackButton_1.default>
                    {(isLoading || ((0, TransactionUtils_1.isScanRequest)(transaction) && !Object.values(receiptFiles).length)) && <FullscreenLoadingIndicator_1.default />}
                    {PDFValidationComponent}
                    <Consumer_1.default onDrop={handleDroppingReceipt}>
                        <DropZoneUI_1.default icon={isEditingReceipt ? Expensicons.ReplaceReceipt : Expensicons.SmartScan} dropStyles={styles.receiptDropOverlay(true)} dropTitle={translate(isEditingReceipt ? 'dropzone.replaceReceipt' : 'quickAction.scanReceipt')} dropTextStyles={styles.receiptDropText} dashedBorderStyles={styles.activeDropzoneDashedBorder(theme.receiptDropBorderColorActive, true)}/>
                    </Consumer_1.default>
                    {ErrorModal}
                    {!!gpsRequired && (<LocationPermissionModal_1.default startPermissionFlow={startLocationPermissionFlow} resetPermissionFlow={function () { return setStartLocationPermissionFlow(false); }} onGrant={function () {
                (0, navigateAfterInteraction_1.default)(function () {
                    createTransaction(selectedParticipantList, true);
                });
            }} onDeny={function () {
                (0, IOU_1.updateLastLocationPermissionPrompt)();
                (0, navigateAfterInteraction_1.default)(function () {
                    createTransaction(selectedParticipantList, false);
                });
            }} onInitialGetLocationCompleted={function () {
                setIsConfirming(false);
            }}/>)}
                    <MoneyRequestConfirmationList_1.default transaction={transaction} selectedParticipants={participants} iouAmount={Math.abs((_t = transaction === null || transaction === void 0 ? void 0 : transaction.amount) !== null && _t !== void 0 ? _t : 0)} iouAttendees={(0, TransactionUtils_1.getAttendees)(transaction)} iouComment={(_v = (_u = transaction === null || transaction === void 0 ? void 0 : transaction.comment) === null || _u === void 0 ? void 0 : _u.comment) !== null && _v !== void 0 ? _v : ''} iouCurrencyCode={transaction === null || transaction === void 0 ? void 0 : transaction.currency} iouIsBillable={transaction === null || transaction === void 0 ? void 0 : transaction.billable} onToggleBillable={setBillable} iouCategory={transaction === null || transaction === void 0 ? void 0 : transaction.category} onConfirm={onConfirm} onSendMoney={sendMoney} showRemoveExpenseConfirmModal={function () { return setRemoveConfirmModalVisible(true); }} receiptPath={receiptPath} receiptFilename={receiptFilename} iouType={iouType} reportID={reportID} shouldDisplayReceipt={!isMovingTransactionFromTrackExpense && !isDistanceRequest && !isPerDiemRequest} isPolicyExpenseChat={isPolicyExpenseChat} policyID={(0, IOU_1.getIOURequestPolicyID)(transaction, report)} iouMerchant={transaction === null || transaction === void 0 ? void 0 : transaction.merchant} iouCreated={transaction === null || transaction === void 0 ? void 0 : transaction.created} isDistanceRequest={isDistanceRequest} isManualDistanceRequest={isManualDistanceRequest} isPerDiemRequest={isPerDiemRequest} shouldShowSmartScanFields={shouldShowSmartScanFields} action={action} payeePersonalDetails={payeePersonalDetails} isConfirmed={isConfirmed} isConfirming={isConfirming} iouIsReimbursable={transaction === null || transaction === void 0 ? void 0 : transaction.reimbursable} onToggleReimbursable={setReimbursable} expensesNumber={transactions.length} isReceiptEditable/>
                </react_native_1.View>
                <ConfirmModal_1.default title={translate('iou.removeExpense')} isVisible={isRemoveConfirmModalVisible} onConfirm={removeCurrentTransaction} onCancel={function () { return setRemoveConfirmModalVisible(false); }} prompt={translate('iou.removeExpenseConfirmation')} confirmText={translate('common.remove')} cancelText={translate('common.cancel')} danger/>
            </Provider_1.default>
        </ScreenWrapper_1.default>);
}
IOURequestStepConfirmation.displayName = 'IOURequestStepConfirmation';
/* eslint-disable rulesdir/no-negated-variables */
var IOURequestStepConfirmationWithFullTransactionOrNotFound = (0, withFullTransactionOrNotFound_1.default)(IOURequestStepConfirmation);
/* eslint-disable rulesdir/no-negated-variables */
var IOURequestStepConfirmationWithWritableReportOrNotFound = (0, withWritableReportOrNotFound_1.default)(IOURequestStepConfirmationWithFullTransactionOrNotFound);
exports.default = IOURequestStepConfirmationWithWritableReportOrNotFound;
