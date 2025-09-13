"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const Consumer_1 = require("@components/DragAndDrop/Consumer");
const Provider_1 = require("@components/DragAndDrop/Provider");
const DropZoneUI_1 = require("@components/DropZone/DropZoneUI");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const LocationPermissionModal_1 = require("@components/LocationPermissionModal");
const MoneyRequestConfirmationList_1 = require("@components/MoneyRequestConfirmationList");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const PrevNextButtons_1 = require("@components/PrevNextButtons");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useDeepCompareRef_1 = require("@hooks/useDeepCompareRef");
const useFetchRoute_1 = require("@hooks/useFetchRoute");
const useFilesValidation_1 = require("@hooks/useFilesValidation");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useParticipantsInvoiceReport_1 = require("@hooks/useParticipantsInvoiceReport");
const usePermissions_1 = require("@hooks/usePermissions");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Task_1 = require("@libs/actions/Task");
const DateUtils_1 = require("@libs/DateUtils");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const getCurrentPosition_1 = require("@libs/getCurrentPosition");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const IOUUtils_1 = require("@libs/IOUUtils");
const Log_1 = require("@libs/Log");
const navigateAfterInteraction_1 = require("@libs/Navigation/navigateAfterInteraction");
const Navigation_1 = require("@libs/Navigation/Navigation");
const NumberUtils_1 = require("@libs/NumberUtils");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const Performance_1 = require("@libs/Performance");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const IOU_1 = require("@userActions/IOU");
const Policy_1 = require("@userActions/Policy/Policy");
const TransactionEdit_1 = require("@userActions/TransactionEdit");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("./withWritableReportOrNotFound");
function IOURequestStepConfirmation({ report: reportReal, reportDraft, route: { params: { iouType, reportID, transactionID: initialTransactionID, action, participantsAutoAssigned: participantsAutoAssignedFromRoute, backToReport, backTo }, }, transaction: initialTransaction, isLoadingTransaction, }) {
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const personalDetails = (0, OnyxListItemProvider_1.usePersonalDetails)();
    const [isRemoveConfirmModalVisible, setRemoveConfirmModalVisible] = (0, react_1.useState)(false);
    const [optimisticTransactions] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT, {
        selector: (items) => Object.values(items ?? {}),
        canBeMissing: true,
    });
    const transactions = (0, react_1.useMemo)(() => {
        const allTransactions = optimisticTransactions && optimisticTransactions.length > 1 ? optimisticTransactions : [initialTransaction];
        return allTransactions.filter((transaction) => !!transaction);
    }, [initialTransaction, optimisticTransactions]);
    const hasMultipleTransactions = transactions.length > 1;
    // Depend on transactions.length to avoid updating transactionIDs when only the transaction details change
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    const transactionIDs = (0, react_1.useMemo)(() => transactions?.map((transaction) => transaction.transactionID), [transactions.length]);
    // We will use setCurrentTransactionID later to switch between transactions
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [currentTransactionID, setCurrentTransactionID] = (0, react_1.useState)(initialTransactionID);
    const currentTransactionIndex = (0, react_1.useMemo)(() => transactions.findIndex((transaction) => transaction.transactionID === currentTransactionID), [transactions, currentTransactionID]);
    const [existingTransaction, existingTransactionResult] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(currentTransactionID)}`, { canBeMissing: true });
    const [optimisticTransaction, optimisticTransactionResult] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${(0, getNonEmptyStringOnyxID_1.default)(currentTransactionID)}`, { canBeMissing: true });
    const isLoadingCurrentTransaction = (0, isLoadingOnyxValue_1.default)(existingTransactionResult, optimisticTransactionResult);
    const transaction = (0, react_1.useMemo)(() => (!isLoadingCurrentTransaction ? (optimisticTransaction ?? existingTransaction) : undefined), [existingTransaction, optimisticTransaction, isLoadingCurrentTransaction]);
    const transactionsCategories = (0, useDeepCompareRef_1.default)(transactions.map(({ transactionID, category }) => ({
        transactionID,
        category,
    })));
    const realPolicyID = (0, IOU_1.getIOURequestPolicyID)(initialTransaction, reportReal);
    const draftPolicyID = (0, IOU_1.getIOURequestPolicyID)(initialTransaction, reportDraft);
    const [policyDraft] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_DRAFTS}${draftPolicyID}`, { canBeMissing: true });
    const [policyReal] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${realPolicyID}`, { canBeMissing: true });
    const [policyCategoriesReal] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${realPolicyID}`, { canBeMissing: true });
    const [policyCategoriesDraft] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES_DRAFT}${draftPolicyID}`, { canBeMissing: true });
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${realPolicyID}`, { canBeMissing: true });
    const [userLocation] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_LOCATION, { canBeMissing: true });
    const [reportAttributesDerived] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true, selector: (val) => val?.reports });
    const [recentlyUsedDestinations] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_DESTINATIONS}${realPolicyID}`, { canBeMissing: true });
    const [policyRecentlyUsedCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_RECENTLY_USED_CATEGORIES}${realPolicyID}`, { canBeMissing: true });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    /*
     * We want to use a report from the transaction if it exists
     * Also if the report was submitted and delayed submission is on, then we should use an initial report
     */
    const transactionReport = (0, ReportUtils_1.getReportOrDraftReport)(transaction?.reportID);
    const shouldUseTransactionReport = transactionReport && !((0, ReportUtils_1.isProcessingReport)(transactionReport) && !policyReal?.harvesting?.enabled) && (0, ReportUtils_1.isReportOutstanding)(transactionReport, policyReal?.id, undefined, false);
    const report = shouldUseTransactionReport ? transactionReport : (reportReal ?? reportDraft);
    const policy = policyReal ?? policyDraft;
    const isDraftPolicy = policy === policyDraft;
    const policyCategories = policyCategoriesReal ?? policyCategoriesDraft;
    const receiverParticipant = transaction?.participants?.find((participant) => participant?.accountID) ?? report?.invoiceReceiver;
    const receiverAccountID = receiverParticipant && 'accountID' in receiverParticipant && receiverParticipant.accountID ? receiverParticipant.accountID : CONST_1.default.DEFAULT_NUMBER_ID;
    const receiverType = (0, IOU_1.getReceiverType)(receiverParticipant);
    const senderWorkspaceID = transaction?.participants?.find((participant) => participant?.isSender)?.policyID;
    const existingInvoiceReport = (0, useParticipantsInvoiceReport_1.default)(receiverAccountID, receiverType, senderWorkspaceID);
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [startLocationPermissionFlow, setStartLocationPermissionFlow] = (0, react_1.useState)(false);
    const [selectedParticipantList, setSelectedParticipantList] = (0, react_1.useState)([]);
    const [isDraggingOver, setIsDraggingOver] = (0, react_1.useState)(false);
    const [receiptFiles, setReceiptFiles] = (0, react_1.useState)({});
    const requestType = (0, TransactionUtils_1.getRequestType)(transaction, isBetaEnabled(CONST_1.default.BETAS.MANUAL_DISTANCE));
    const isDistanceRequest = requestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE || requestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MAP || requestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MANUAL;
    const isManualDistanceRequest = requestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MANUAL;
    const isPerDiemRequest = requestType === CONST_1.default.IOU.REQUEST_TYPE.PER_DIEM;
    const [lastLocationPermissionPrompt] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_LOCATION_PERMISSION_PROMPT, { canBeMissing: true });
    const receiptFilename = transaction?.filename;
    const receiptPath = transaction?.receipt?.source;
    const isEditingReceipt = (0, TransactionUtils_1.hasReceipt)(transaction);
    const customUnitRateID = (0, TransactionUtils_1.getRateID)(transaction) ?? '';
    const defaultTaxCode = (0, TransactionUtils_1.getDefaultTaxCode)(policy, transaction);
    const transactionTaxCode = (transaction?.taxCode ? transaction?.taxCode : defaultTaxCode) ?? '';
    const transactionTaxAmount = transaction?.taxAmount ?? 0;
    const isSharingTrackExpense = action === CONST_1.default.IOU.ACTION.SHARE;
    const isCategorizingTrackExpense = action === CONST_1.default.IOU.ACTION.CATEGORIZE;
    const isMovingTransactionFromTrackExpense = (0, IOUUtils_1.isMovingTransactionFromTrackExpense)(action);
    const isTestTransaction = transaction?.participants?.some((participant) => (0, ReportUtils_1.isSelectedManagerMcTest)(participant.login));
    const payeePersonalDetails = (0, react_1.useMemo)(() => {
        if (personalDetails?.[transaction?.splitPayerAccountIDs?.at(0) ?? -1]) {
            return personalDetails?.[transaction?.splitPayerAccountIDs?.at(0) ?? -1];
        }
        const participant = transaction?.participants?.find((val) => val.accountID === (transaction?.splitPayerAccountIDs?.at(0) ?? -1));
        return {
            login: participant?.login ?? '',
            accountID: participant?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID,
            avatar: Expensicons.FallbackAvatar,
            displayName: participant?.login ?? '',
            isOptimisticPersonalDetail: true,
        };
    }, [personalDetails, transaction?.participants, transaction?.splitPayerAccountIDs]);
    const gpsRequired = transaction?.amount === 0 && iouType !== CONST_1.default.IOU.TYPE.SPLIT && Object.values(receiptFiles).length && !isTestTransaction;
    const [isConfirmed, setIsConfirmed] = (0, react_1.useState)(false);
    const [isConfirming, setIsConfirming] = (0, react_1.useState)(false);
    const headerTitle = (0, react_1.useMemo)(() => {
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
    const participants = (0, react_1.useMemo)(() => transaction?.participants?.map((participant) => {
        if (participant.isSender && iouType === CONST_1.default.IOU.TYPE.INVOICE) {
            return participant;
        }
        return participant.accountID ? (0, OptionsListUtils_1.getParticipantsOption)(participant, personalDetails) : (0, OptionsListUtils_1.getReportOption)(participant, reportAttributesDerived);
    }) ?? [], [transaction?.participants, iouType, personalDetails, reportAttributesDerived]);
    const isPolicyExpenseChat = (0, react_1.useMemo)(() => participants?.some((participant) => participant.isPolicyExpenseChat), [participants]);
    const shouldGenerateTransactionThreadReport = !isBetaEnabled(CONST_1.default.BETAS.NO_OPTIMISTIC_TRANSACTION_THREADS) || !account?.shouldBlockTransactionThreadReportCreation;
    const formHasBeenSubmitted = (0, react_1.useRef)(false);
    (0, useFetchRoute_1.default)(transaction, transaction?.comment?.waypoints, action, (0, IOUUtils_1.shouldUseTransactionDraft)(action) ? CONST_1.default.TRANSACTION.STATE.DRAFT : CONST_1.default.TRANSACTION.STATE.CURRENT);
    (0, react_1.useEffect)(() => {
        Performance_1.default.markEnd(CONST_1.default.TIMING.OPEN_CREATE_EXPENSE_APPROVE);
    }, []);
    (0, react_1.useEffect)(() => {
        const policyExpenseChat = participants?.find((participant) => participant.isPolicyExpenseChat);
        if (policyExpenseChat?.policyID && policy?.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD) {
            (0, Policy_1.openDraftWorkspaceRequest)(policyExpenseChat.policyID);
        }
        const senderPolicyParticipant = participants?.find((participant) => !!participant && 'isSender' in participant && participant.isSender);
        if (senderPolicyParticipant?.policyID && policy?.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD) {
            (0, Policy_1.openDraftWorkspaceRequest)(senderPolicyParticipant.policyID);
        }
    }, [isOffline, participants, policy?.pendingAction]);
    const defaultBillable = !!policy?.defaultBillable;
    (0, react_1.useEffect)(() => {
        transactionIDs.forEach((transactionID) => {
            (0, IOU_1.setMoneyRequestBillable)(transactionID, defaultBillable);
        });
    }, [transactionIDs, defaultBillable]);
    (0, react_1.useEffect)(() => {
        const defaultReimbursable = isPolicyExpenseChat && (0, PolicyUtils_1.isPaidGroupPolicy)(policy) ? !!policy?.defaultReimbursable : true;
        transactionIDs.forEach((transactionID) => {
            (0, IOU_1.setMoneyRequestReimbursable)(transactionID, defaultReimbursable);
        });
    }, [transactionIDs, policy, isPolicyExpenseChat]);
    (0, react_1.useEffect)(() => {
        // Exit early if the transaction is still loading
        if (isLoadingTransaction) {
            return;
        }
        // Check if the transaction belongs to the current report
        const isCurrentReportID = transaction?.isFromGlobalCreate
            ? transaction?.participants?.at(0)?.reportID === reportID || (!transaction?.participants?.at(0)?.reportID && transaction?.reportID === reportID)
            : transaction?.reportID === reportID;
        // Exit if the transaction already exists and is associated with the current report
        if (transaction?.transactionID &&
            (!transaction?.isFromGlobalCreate || !(0, EmptyObject_1.isEmptyObject)(transaction?.participants)) &&
            (isCurrentReportID || isMovingTransactionFromTrackExpense || iouType === CONST_1.default.IOU.TYPE.INVOICE)) {
            return;
        }
        (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.CREATE, 
        // When starting to create an expense from the global FAB, there is not an existing report yet. A random optimistic reportID is generated and used
        // for all of the routes in the creation flow.
        (0, ReportUtils_1.generateReportID)());
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- we don't want this effect to run again
    }, [isLoadingTransaction, isMovingTransactionFromTrackExpense]);
    (0, react_1.useEffect)(() => {
        transactions.forEach((item) => {
            if (!item.category) {
                return;
            }
            if (policyCategories?.[item.category] && !policyCategories[item.category].enabled) {
                (0, IOU_1.setMoneyRequestCategory)(item.transactionID, '', policy?.id);
            }
        });
        // We don't want to clear out category every time the transactions change
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [policy?.id, policyCategories, transactionsCategories]);
    const policyDistance = Object.values(policy?.customUnits ?? {}).find((customUnit) => customUnit.name === CONST_1.default.CUSTOM_UNITS.NAME_DISTANCE);
    const defaultCategory = policyDistance?.defaultCategory ?? '';
    (0, react_1.useEffect)(() => {
        transactions.forEach((item) => {
            if (!isDistanceRequest || !!item?.category) {
                return;
            }
            (0, IOU_1.setMoneyRequestCategory)(item.transactionID, defaultCategory, policy?.id);
        });
        // Prevent resetting to default when unselect category
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [transactionIDs, requestType, defaultCategory, policy?.id]);
    const navigateBack = (0, react_1.useCallback)(() => {
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
        if (transaction?.isFromGlobalCreate && !transaction.receipt?.isTestReceipt) {
            // If the participants weren't automatically added to the transaction, then we should go back to the IOURequestStepParticipants.
            if (!transaction?.participantsAutoAssigned && participantsAutoAssignedFromRoute !== 'true') {
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                Navigation_1.default.goBack(ROUTES_1.default.MONEY_REQUEST_STEP_PARTICIPANTS.getRoute(iouType, initialTransactionID, transaction?.reportID || reportID, undefined, action), {
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
        if (transaction?.receipt?.isTestDriveReceipt && (transaction.participants?.length ?? 0) > 0) {
            Navigation_1.default.goBack(ROUTES_1.default.TEST_DRIVE_MODAL_ROOT.getRoute(transaction.participants?.at(0)?.login));
            return;
        }
        // This has selected the participants from the beginning and the participant field shouldn't be editable.
        (0, IOUUtils_1.navigateToStartMoneyRequestStep)(requestType, iouType, initialTransactionID, reportID, action);
    }, [
        action,
        isPerDiemRequest,
        transaction?.isFromGlobalCreate,
        transaction?.receipt?.isTestReceipt,
        transaction?.receipt?.isTestDriveReceipt,
        transaction?.participants,
        transaction?.participantsAutoAssigned,
        transaction?.reportID,
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
    (0, react_1.useEffect)(() => {
        let newReceiptFiles = {};
        let isScanFilesCanBeRead = true;
        Promise.all(transactions.map((item) => {
            const itemReceiptFilename = item.filename;
            const itemReceiptPath = item.receipt?.source;
            const itemReceiptType = item.receipt?.type;
            const isLocalFile = (0, FileUtils_1.isLocalFile)(itemReceiptPath);
            if (!isLocalFile) {
                if (item.receipt) {
                    newReceiptFiles = { ...newReceiptFiles, [item.transactionID]: item.receipt };
                }
                return;
            }
            const onSuccess = (file) => {
                const receipt = file;
                if (item?.receipt?.isTestReceipt) {
                    receipt.isTestReceipt = true;
                    receipt.state = CONST_1.default.IOU.RECEIPT_STATE.SCAN_COMPLETE;
                }
                else if (item?.receipt?.isTestDriveReceipt) {
                    receipt.isTestDriveReceipt = true;
                    receipt.state = CONST_1.default.IOU.RECEIPT_STATE.SCAN_COMPLETE;
                }
                else {
                    receipt.state = file && requestType === CONST_1.default.IOU.REQUEST_TYPE.MANUAL ? CONST_1.default.IOU.RECEIPT_STATE.OPEN : CONST_1.default.IOU.RECEIPT_STATE.SCAN_READY;
                }
                newReceiptFiles = { ...newReceiptFiles, [item.transactionID]: receipt };
            };
            const onFailure = () => {
                isScanFilesCanBeRead = false;
                if (initialTransactionID === item.transactionID) {
                    (0, IOU_1.setMoneyRequestReceipt)(item.transactionID, '', '', true);
                }
            };
            return (0, IOU_1.checkIfScanFileCanBeRead)(itemReceiptFilename, itemReceiptPath, itemReceiptType, onSuccess, onFailure);
        })).then(() => {
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
    const requestMoney = (0, react_1.useCallback)((selectedParticipants, gpsPoints) => {
        if (!transactions.length) {
            return;
        }
        const participant = selectedParticipants.at(0);
        if (!participant) {
            return;
        }
        const optimisticChatReportID = (0, ReportUtils_1.generateReportID)();
        const optimisticCreatedReportActionID = (0, NumberUtils_1.rand64)();
        const optimisticIOUReportID = (0, ReportUtils_1.generateReportID)();
        const optimisticReportPreviewActionID = (0, NumberUtils_1.rand64)();
        transactions.forEach((item, index) => {
            const receipt = receiptFiles[item.transactionID];
            const isTestReceipt = receipt?.isTestReceipt ?? false;
            const isTestDriveReceipt = receipt?.isTestDriveReceipt ?? false;
            if (isTestDriveReceipt) {
                (0, Task_1.completeTestDriveTask)();
            }
            (0, IOU_1.requestMoney)({
                report,
                optimisticChatReportID,
                optimisticCreatedReportActionID,
                optimisticIOUReportID,
                optimisticReportPreviewActionID,
                participantParams: {
                    payeeEmail: currentUserPersonalDetails.login,
                    payeeAccountID: currentUserPersonalDetails.accountID,
                    participant,
                },
                policyParams: {
                    policy,
                    policyTagList: policyTags,
                    policyCategories,
                },
                gpsPoints,
                action,
                transactionParams: {
                    amount: isTestReceipt ? CONST_1.default.TEST_RECEIPT.AMOUNT : item.amount,
                    attendees: item.comment?.attendees,
                    currency: isTestReceipt ? CONST_1.default.TEST_RECEIPT.CURRENCY : item.currency,
                    created: item.created,
                    merchant: isTestReceipt ? CONST_1.default.TEST_RECEIPT.MERCHANT : item.merchant,
                    comment: item?.comment?.comment?.trim() ?? '',
                    receipt,
                    category: item.category,
                    tag: item.tag,
                    taxCode: transactionTaxCode,
                    taxAmount: transactionTaxAmount,
                    billable: item.billable,
                    reimbursable: item.reimbursable,
                    actionableWhisperReportActionID: item.actionableWhisperReportActionID,
                    linkedTrackedExpenseReportAction: item.linkedTrackedExpenseReportAction,
                    linkedTrackedExpenseReportID: item.linkedTrackedExpenseReportID,
                    waypoints: Object.keys(item.comment?.waypoints ?? {}).length ? (0, TransactionUtils_1.getValidWaypoints)(item.comment?.waypoints, true) : undefined,
                    customUnitRateID,
                    isTestDrive: item.receipt?.isTestDriveReceipt,
                    originalTransactionID: item.comment?.originalTransactionID,
                    source: item.comment?.source,
                },
                shouldHandleNavigation: index === transactions.length - 1,
                shouldGenerateTransactionThreadReport,
                backToReport,
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
    const submitPerDiemExpense = (0, react_1.useCallback)((selectedParticipants, trimmedComment, policyRecentlyUsedCategoriesParam) => {
        if (!transaction) {
            return;
        }
        const participant = selectedParticipants.at(0);
        if (!participant || (0, EmptyObject_1.isEmptyObject)(transaction.comment) || (0, EmptyObject_1.isEmptyObject)(transaction.comment.customUnit)) {
            return;
        }
        (0, IOU_1.submitPerDiemExpense)({
            report,
            participantParams: {
                payeeEmail: currentUserPersonalDetails.login,
                payeeAccountID: currentUserPersonalDetails.accountID,
                participant,
            },
            policyParams: {
                policy,
                policyTagList: policyTags,
                policyCategories,
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
                customUnit: transaction.comment?.customUnit,
                billable: transaction.billable,
                reimbursable: transaction.reimbursable,
                attendees: transaction.comment?.attendees,
            },
        });
    }, [report, transaction, currentUserPersonalDetails.login, currentUserPersonalDetails.accountID, policy, policyTags, policyCategories, recentlyUsedDestinations]);
    const trackExpense = (0, react_1.useCallback)((selectedParticipants, gpsPoints) => {
        if (!report || !transactions.length) {
            return;
        }
        const participant = selectedParticipants.at(0);
        if (!participant) {
            return;
        }
        transactions.forEach((item, index) => {
            (0, IOU_1.trackExpense)({
                report,
                isDraftPolicy,
                action,
                participantParams: {
                    payeeEmail: currentUserPersonalDetails.login,
                    payeeAccountID: currentUserPersonalDetails.accountID,
                    participant,
                },
                policyParams: {
                    policy,
                    policyCategories,
                    policyTagList: policyTags,
                },
                transactionParams: {
                    amount: item.amount,
                    distance: isManualDistanceRequest ? (item.comment?.customUnit?.quantity ?? undefined) : undefined,
                    currency: item.currency,
                    created: item.created,
                    merchant: item.merchant,
                    comment: item?.comment?.comment?.trim() ?? '',
                    receipt: receiptFiles[item.transactionID],
                    category: item.category,
                    tag: item.tag,
                    taxCode: transactionTaxCode,
                    taxAmount: transactionTaxAmount,
                    billable: item.billable,
                    reimbursable: item.reimbursable,
                    gpsPoints,
                    validWaypoints: Object.keys(item?.comment?.waypoints ?? {}).length ? (0, TransactionUtils_1.getValidWaypoints)(item.comment?.waypoints, true) : undefined,
                    actionableWhisperReportActionID: item.actionableWhisperReportActionID,
                    linkedTrackedExpenseReportAction: item.linkedTrackedExpenseReportAction,
                    linkedTrackedExpenseReportID: item.linkedTrackedExpenseReportID,
                    customUnitRateID,
                    attendees: item.comment?.attendees,
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
    const createDistanceRequest = (0, react_1.useCallback)((selectedParticipants, trimmedComment) => {
        if (!transaction) {
            return;
        }
        (0, IOU_1.createDistanceRequest)({
            report,
            participants: selectedParticipants,
            currentUserLogin: currentUserPersonalDetails.login,
            currentUserAccountID: currentUserPersonalDetails.accountID,
            iouType,
            existingTransaction: transaction,
            policyParams: {
                policy,
                policyCategories,
                policyTagList: policyTags,
            },
            transactionParams: {
                amount: transaction.amount,
                comment: trimmedComment,
                distance: isManualDistanceRequest ? (transaction.comment?.customUnit?.quantity ?? undefined) : undefined,
                created: transaction.created,
                currency: transaction.currency,
                merchant: transaction.merchant,
                category: transaction.category,
                tag: transaction.tag,
                taxCode: transactionTaxCode,
                taxAmount: transactionTaxAmount,
                customUnitRateID,
                splitShares: transaction.splitShares,
                validWaypoints: (0, TransactionUtils_1.getValidWaypoints)(transaction.comment?.waypoints, true),
                billable: transaction.billable,
                reimbursable: transaction.reimbursable,
                attendees: transaction.comment?.attendees,
            },
            backToReport,
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
    const createTransaction = (0, react_1.useCallback)((selectedParticipants, locationPermissionGranted = false) => {
        setIsConfirmed(true);
        let splitParticipants = selectedParticipants;
        // Filter out participants with an amount equal to O
        if (iouType === CONST_1.default.IOU.TYPE.SPLIT && transaction?.splitShares) {
            const participantsWithAmount = Object.keys(transaction.splitShares ?? {})
                .filter((accountID) => (transaction?.splitShares?.[Number(accountID)]?.amount ?? 0) > 0)
                .map((accountID) => Number(accountID));
            splitParticipants = selectedParticipants.filter((participant) => participantsWithAmount.includes(participant.isPolicyExpenseChat ? (participant?.ownerAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID) : (participant.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID)));
        }
        const trimmedComment = transaction?.comment?.comment?.trim() ?? '';
        // Don't let the form be submitted multiple times while the navigator is waiting to take the user to a different page
        if (formHasBeenSubmitted.current) {
            return;
        }
        formHasBeenSubmitted.current = true;
        if (iouType !== CONST_1.default.IOU.TYPE.TRACK && isDistanceRequest && !isMovingTransactionFromTrackExpense) {
            createDistanceRequest(iouType === CONST_1.default.IOU.TYPE.SPLIT ? splitParticipants : selectedParticipants, trimmedComment);
            return;
        }
        const currentTransactionReceiptFile = transaction?.transactionID ? receiptFiles[transaction.transactionID] : undefined;
        if (iouType === CONST_1.default.IOU.TYPE.SPLIT && Object.values(receiptFiles).filter((receipt) => !!receipt).length) {
            const currentUserLogin = currentUserPersonalDetails.login;
            if (currentUserLogin) {
                transactions.forEach((item, index) => {
                    const transactionReceiptFile = receiptFiles[item.transactionID];
                    if (!transactionReceiptFile) {
                        return;
                    }
                    const itemTrimmedComment = item?.comment?.comment?.trim() ?? '';
                    // If we have a receipt let's start the split expense by creating only the action, the transaction, and the group DM if needed
                    (0, IOU_1.startSplitBill)({
                        participants: selectedParticipants,
                        currentUserLogin,
                        currentUserAccountID: currentUserPersonalDetails.accountID,
                        comment: itemTrimmedComment,
                        receipt: transactionReceiptFile,
                        existingSplitChatReportID: report?.reportID,
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
        if (iouType === CONST_1.default.IOU.TYPE.SPLIT && !transaction?.isFromGlobalCreate) {
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
                    existingSplitChatReportID: report?.reportID,
                    billable: transaction.billable,
                    reimbursable: transaction.reimbursable,
                    iouRequestType: transaction.iouRequestType,
                    splitShares: transaction.splitShares,
                    splitPayerAccountIDs: transaction.splitPayerAccountIDs ?? [],
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
            const invoiceChatReport = !(0, EmptyObject_1.isEmptyObject)(report) && report?.reportID ? report : existingInvoiceReport;
            (0, IOU_1.sendInvoice)(currentUserPersonalDetails.accountID, transaction, invoiceChatReport, currentTransactionReceiptFile, policy, policyTags, policyCategories, undefined, undefined, policyRecentlyUsedCategories);
            return;
        }
        if (iouType === CONST_1.default.IOU.TYPE.TRACK || isCategorizingTrackExpense || isSharingTrackExpense) {
            if (Object.values(receiptFiles).filter((receipt) => !!receipt).length && transaction) {
                // If the transaction amount is zero, then the money is being requested through the "Scan" flow and the GPS coordinates need to be included.
                if (transaction.amount === 0 && !isSharingTrackExpense && !isCategorizingTrackExpense && locationPermissionGranted) {
                    if (userLocation) {
                        trackExpense(selectedParticipants, {
                            lat: userLocation.latitude,
                            long: userLocation.longitude,
                        });
                        return;
                    }
                    (0, getCurrentPosition_1.default)((successData) => {
                        trackExpense(selectedParticipants, {
                            lat: successData.coords.latitude,
                            long: successData.coords.longitude,
                        });
                    }, (errorData) => {
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
        if (Object.values(receiptFiles).filter((receipt) => !!receipt).length && !!transaction) {
            // If the transaction amount is zero, then the money is being requested through the "Scan" flow and the GPS coordinates need to be included.
            if (transaction.amount === 0 &&
                !isSharingTrackExpense &&
                !isCategorizingTrackExpense &&
                locationPermissionGranted &&
                !selectedParticipants.some((participant) => (0, ReportUtils_1.isSelectedManagerMcTest)(participant.login))) {
                if (userLocation) {
                    requestMoney(selectedParticipants, {
                        lat: userLocation.latitude,
                        long: userLocation.longitude,
                    });
                    return;
                }
                (0, getCurrentPosition_1.default)((successData) => {
                    requestMoney(selectedParticipants, {
                        lat: successData.coords.latitude,
                        long: successData.coords.longitude,
                    });
                }, (errorData) => {
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
    const sendMoney = (0, react_1.useCallback)((paymentMethod) => {
        const currency = transaction?.currency;
        const trimmedComment = transaction?.comment?.comment?.trim() ?? '';
        const participant = participants?.at(0);
        if (!participant || !transaction?.amount || !currency) {
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
    }, [transaction?.amount, transaction?.comment, transaction?.currency, participants, currentUserPersonalDetails.accountID, report]);
    const setBillable = (0, react_1.useCallback)((billable) => {
        (0, IOU_1.setMoneyRequestBillable)(currentTransactionID, billable);
    }, [currentTransactionID]);
    const setReimbursable = (0, react_1.useCallback)((reimbursable) => {
        (0, IOU_1.setMoneyRequestReimbursable)(currentTransactionID, reimbursable);
    }, [currentTransactionID]);
    // This loading indicator is shown because the transaction originalCurrency is being updated later than the component mounts.
    // To prevent the component from rendering with the wrong currency, we show a loading indicator until the correct currency is set.
    const isLoading = !!transaction?.originalCurrency;
    const onConfirm = (listOfParticipants) => {
        setIsConfirming(true);
        setSelectedParticipantList(listOfParticipants);
        if (gpsRequired) {
            const shouldStartLocationPermissionFlow = !lastLocationPermissionPrompt ||
                (DateUtils_1.default.isValidDateString(lastLocationPermissionPrompt ?? '') &&
                    DateUtils_1.default.getDifferenceInDaysFromNow(new Date(lastLocationPermissionPrompt ?? '')) > CONST_1.default.IOU.LOCATION_PERMISSION_PROMPT_THRESHOLD_DAYS);
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
    const setReceiptOnDrop = (files) => {
        const file = files.at(0);
        if (!file) {
            return;
        }
        const source = URL.createObjectURL(file);
        (0, IOU_1.setMoneyRequestReceipt)(currentTransactionID, source, file.name ?? '', true);
    };
    const { validateFiles, PDFValidationComponent, ErrorModal } = (0, useFilesValidation_1.default)(setReceiptOnDrop);
    const handleDroppingReceipt = (e) => {
        const file = e?.dataTransfer?.files[0];
        if (file) {
            file.uri = URL.createObjectURL(file);
            validateFiles([file], Array.from(e.dataTransfer?.items));
        }
    };
    if (isLoadingTransaction) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    const showNextTransaction = () => {
        const nextTransaction = transactions.at(currentTransactionIndex + 1);
        if (nextTransaction) {
            setCurrentTransactionID(nextTransaction.transactionID);
        }
    };
    const showPreviousTransaction = () => {
        const previousTransaction = transactions.at(currentTransactionIndex - 1);
        if (previousTransaction) {
            setCurrentTransactionID(previousTransaction.transactionID);
        }
    };
    const removeCurrentTransaction = () => {
        if (currentTransactionID === CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID) {
            const nextTransaction = transactions.at(currentTransactionIndex + 1);
            (0, TransactionEdit_1.replaceDefaultDraftTransaction)(nextTransaction);
            setRemoveConfirmModalVisible(false);
            return;
        }
        (0, TransactionEdit_1.removeDraftTransaction)(currentTransactionID);
        setRemoveConfirmModalVisible(false);
        showPreviousTransaction();
    };
    const showReceiptEmptyState = (0, IOUUtils_1.shouldShowReceiptEmptyState)(iouType, action, policy, isPerDiemRequest, isManualDistanceRequest);
    const shouldShowSmartScanFields = !!transaction?.receipt?.isTestDriveReceipt || (isMovingTransactionFromTrackExpense ? transaction?.amount !== 0 : requestType !== CONST_1.default.IOU.REQUEST_TYPE.SCAN);
    return (<ScreenWrapper_1.default shouldEnableMaxHeight={(0, DeviceCapabilities_1.canUseTouchScreen)()} testID={IOURequestStepConfirmation.displayName} headerGapStyles={isDraggingOver ? [styles.dropWrapper] : []}>
            <Provider_1.default setIsDraggingOver={setIsDraggingOver} isDisabled={!showReceiptEmptyState}>
                <react_native_1.View style={styles.flex1}>
                    <HeaderWithBackButton_1.default title={headerTitle} subtitle={hasMultipleTransactions ? `${currentTransactionIndex + 1} ${translate('common.of')} ${transactions.length}` : undefined} onBackButtonPress={navigateBack} shouldDisplayHelpButton={!hasMultipleTransactions}>
                        {hasMultipleTransactions ? (<PrevNextButtons_1.default isPrevButtonDisabled={currentTransactionIndex === 0} isNextButtonDisabled={currentTransactionIndex === transactions.length - 1} onNext={showNextTransaction} onPrevious={showPreviousTransaction}/>) : null}
                    </HeaderWithBackButton_1.default>
                    {(isLoading || ((0, TransactionUtils_1.isScanRequest)(transaction) && !Object.values(receiptFiles).length)) && <FullscreenLoadingIndicator_1.default />}
                    {PDFValidationComponent}
                    <Consumer_1.default onDrop={handleDroppingReceipt}>
                        <DropZoneUI_1.default icon={isEditingReceipt ? Expensicons.ReplaceReceipt : Expensicons.SmartScan} dropStyles={styles.receiptDropOverlay(true)} dropTitle={translate(isEditingReceipt ? 'dropzone.replaceReceipt' : 'quickAction.scanReceipt')} dropTextStyles={styles.receiptDropText} dashedBorderStyles={styles.activeDropzoneDashedBorder(theme.receiptDropBorderColorActive, true)}/>
                    </Consumer_1.default>
                    {ErrorModal}
                    {!!gpsRequired && (<LocationPermissionModal_1.default startPermissionFlow={startLocationPermissionFlow} resetPermissionFlow={() => setStartLocationPermissionFlow(false)} onGrant={() => {
                (0, navigateAfterInteraction_1.default)(() => {
                    createTransaction(selectedParticipantList, true);
                });
            }} onDeny={() => {
                (0, IOU_1.updateLastLocationPermissionPrompt)();
                (0, navigateAfterInteraction_1.default)(() => {
                    createTransaction(selectedParticipantList, false);
                });
            }} onInitialGetLocationCompleted={() => {
                setIsConfirming(false);
            }}/>)}
                    <MoneyRequestConfirmationList_1.default transaction={transaction} selectedParticipants={participants} iouAmount={Math.abs(transaction?.amount ?? 0)} iouAttendees={(0, TransactionUtils_1.getAttendees)(transaction)} iouComment={transaction?.comment?.comment ?? ''} iouCurrencyCode={transaction?.currency} iouIsBillable={transaction?.billable} onToggleBillable={setBillable} iouCategory={transaction?.category} onConfirm={onConfirm} onSendMoney={sendMoney} showRemoveExpenseConfirmModal={() => setRemoveConfirmModalVisible(true)} receiptPath={receiptPath} receiptFilename={receiptFilename} iouType={iouType} reportID={reportID} shouldDisplayReceipt={!isMovingTransactionFromTrackExpense && !isDistanceRequest && !isPerDiemRequest} isPolicyExpenseChat={isPolicyExpenseChat} policyID={(0, IOU_1.getIOURequestPolicyID)(transaction, report)} iouMerchant={transaction?.merchant} iouCreated={transaction?.created} isDistanceRequest={isDistanceRequest} isManualDistanceRequest={isManualDistanceRequest} isPerDiemRequest={isPerDiemRequest} shouldShowSmartScanFields={shouldShowSmartScanFields} action={action} payeePersonalDetails={payeePersonalDetails} isConfirmed={isConfirmed} isConfirming={isConfirming} iouIsReimbursable={transaction?.reimbursable} onToggleReimbursable={setReimbursable} expensesNumber={transactions.length} isReceiptEditable/>
                </react_native_1.View>
                <ConfirmModal_1.default title={translate('iou.removeExpense')} isVisible={isRemoveConfirmModalVisible} onConfirm={removeCurrentTransaction} onCancel={() => setRemoveConfirmModalVisible(false)} prompt={translate('iou.removeExpenseConfirmation')} confirmText={translate('common.remove')} cancelText={translate('common.cancel')} danger/>
            </Provider_1.default>
        </ScreenWrapper_1.default>);
}
IOURequestStepConfirmation.displayName = 'IOURequestStepConfirmation';
/* eslint-disable rulesdir/no-negated-variables */
const IOURequestStepConfirmationWithFullTransactionOrNotFound = (0, withFullTransactionOrNotFound_1.default)(IOURequestStepConfirmation);
/* eslint-disable rulesdir/no-negated-variables */
const IOURequestStepConfirmationWithWritableReportOrNotFound = (0, withWritableReportOrNotFound_1.default)(IOURequestStepConfirmationWithFullTransactionOrNotFound);
exports.default = IOURequestStepConfirmationWithWritableReportOrNotFound;
