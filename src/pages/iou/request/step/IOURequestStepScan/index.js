"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_permissions_1 = require("react-native-permissions");
const react_native_reanimated_1 = require("react-native-reanimated");
const educational_illustration__multi_scan_svg_1 = require("@assets/images/educational-illustration__multi-scan.svg");
const fake_receipt_png_1 = require("@assets/images/fake-receipt.png");
const hand_svg_1 = require("@assets/images/hand.svg");
const receipt_upload_svg_1 = require("@assets/images/receipt-upload.svg");
const shutter_svg_1 = require("@assets/images/shutter.svg");
const AttachmentPicker_1 = require("@components/AttachmentPicker");
const Button_1 = require("@components/Button");
const CopyTextToClipboard_1 = require("@components/CopyTextToClipboard");
const DownloadAppBanner_1 = require("@components/DownloadAppBanner");
const Consumer_1 = require("@components/DragAndDrop/Consumer");
const Provider_1 = require("@components/DragAndDrop/Provider");
const DropZoneUI_1 = require("@components/DropZone/DropZoneUI");
const FeatureTrainingModal_1 = require("@components/FeatureTrainingModal");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const LocationPermissionModal_1 = require("@components/LocationPermissionModal");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
const useFilesValidation_1 = require("@hooks/useFilesValidation");
const useIOUUtils_1 = require("@hooks/useIOUUtils");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const usePolicy_1 = require("@hooks/usePolicy");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const setTestReceipt_1 = require("@libs/actions/setTestReceipt");
const UserLocation_1 = require("@libs/actions/UserLocation");
const Welcome_1 = require("@libs/actions/Welcome");
const Browser_1 = require("@libs/Browser");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const getCurrentPosition_1 = require("@libs/getCurrentPosition");
const IOUUtils_1 = require("@libs/IOUUtils");
const Log_1 = require("@libs/Log");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const StepScreenDragAndDropWrapper_1 = require("@pages/iou/request/step/StepScreenDragAndDropWrapper");
const withFullTransactionOrNotFound_1 = require("@pages/iou/request/step/withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("@pages/iou/request/step/withWritableReportOrNotFound");
const IOU_1 = require("@userActions/IOU");
const TransactionEdit_1 = require("@userActions/TransactionEdit");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const cropImageToAspectRatio_1 = require("./cropImageToAspectRatio");
const LocationPermission_1 = require("./LocationPermission");
const WebCamera_1 = require("./NavigationAwareCamera/WebCamera");
const ReceiptPreviews_1 = require("./ReceiptPreviews");
function IOURequestStepScan({ report, route: { params: { action, iouType, reportID, transactionID: initialTransactionID, backTo, backToReport }, }, transaction: initialTransaction, currentUserPersonalDetails, onLayout, isMultiScanEnabled = false, setIsMultiScanEnabled, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [startLocationPermissionFlow, setStartLocationPermissionFlow] = (0, react_1.useState)(false);
    const [receiptFiles, setReceiptFiles] = (0, react_1.useState)([]);
    // we need to use isSmallScreenWidth instead of shouldUseNarrowLayout because drag and drop is not supported on mobile
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const { isDraggingOver } = (0, react_1.useContext)(Provider_1.DragAndDropContext);
    const [cameraPermissionState, setCameraPermissionState] = (0, react_1.useState)('prompt');
    const [isFlashLightOn, toggleFlashlight] = (0, react_1.useReducer)((state) => !state, false);
    const [isTorchAvailable, setIsTorchAvailable] = (0, react_1.useState)(false);
    const cameraRef = (0, react_1.useRef)(null);
    const trackRef = (0, react_1.useRef)(null);
    const [isQueriedPermissionState, setIsQueriedPermissionState] = (0, react_1.useState)(false);
    const [shouldShowMultiScanEducationalPopup, setShouldShowMultiScanEducationalPopup] = (0, react_1.useState)(false);
    const getScreenshotTimeoutRef = (0, react_1.useRef)(null);
    const [reportNameValuePairs] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report?.reportID}`, { canBeMissing: true });
    const policy = (0, usePolicy_1.default)(report?.policyID);
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false });
    const [skipConfirmation] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SKIP_CONFIRMATION}${initialTransactionID}`, { canBeMissing: true });
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: false });
    const [activePolicy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${activePolicyID}`, { canBeMissing: true });
    const [dismissedProductTraining] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_DISMISSED_PRODUCT_TRAINING, { canBeMissing: true });
    const [reportAttributesDerived] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true, selector: (val) => val?.reports });
    const isEditing = action === CONST_1.default.IOU.ACTION.EDIT;
    const canUseMultiScan = !isEditing && iouType !== CONST_1.default.IOU.TYPE.SPLIT && !backTo && !backToReport;
    const isReplacingReceipt = (isEditing && (0, TransactionUtils_1.hasReceipt)(initialTransaction)) || (!!initialTransaction?.receipt && !!backTo);
    const { shouldStartLocationPermissionFlow } = (0, useIOUUtils_1.default)();
    const shouldGenerateTransactionThreadReport = !isBetaEnabled(CONST_1.default.BETAS.NO_OPTIMISTIC_TRANSACTION_THREADS) || !account?.shouldBlockTransactionThreadReportCreation;
    const [optimisticTransactions] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT, {
        selector: (items) => Object.values(items ?? {}),
        canBeMissing: true,
    });
    const transactions = (0, react_1.useMemo)(() => {
        const allTransactions = optimisticTransactions && optimisticTransactions.length > 1 ? optimisticTransactions : [initialTransaction];
        return allTransactions.filter((transaction) => !!transaction);
    }, [initialTransaction, optimisticTransactions]);
    const [videoConstraints, setVideoConstraints] = (0, react_1.useState)();
    const isTabActive = (0, native_1.useIsFocused)();
    const defaultTaxCode = (0, TransactionUtils_1.getDefaultTaxCode)(policy, initialTransaction);
    const transactionTaxCode = (initialTransaction?.taxCode ? initialTransaction?.taxCode : defaultTaxCode) ?? '';
    const transactionTaxAmount = initialTransaction?.taxAmount ?? 0;
    const shouldAcceptMultipleFiles = !isEditing && !backTo;
    const selfDMReportID = (0, react_1.useMemo)(() => (0, ReportUtils_1.findSelfDMReportID)(), []);
    const blinkOpacity = (0, react_native_reanimated_1.useSharedValue)(0);
    const blinkStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        opacity: blinkOpacity.get(),
    }));
    const showBlink = (0, react_1.useCallback)(() => {
        blinkOpacity.set((0, react_native_reanimated_1.withTiming)(0.4, { duration: 10 }, () => {
            blinkOpacity.set((0, react_native_reanimated_1.withTiming)(0, { duration: 50 }));
        }));
    }, [blinkOpacity]);
    // For quick button actions, we'll skip the confirmation page unless the report is archived or this is a workspace
    // request and the workspace requires a category or a tag
    const shouldSkipConfirmation = (0, react_1.useMemo)(() => {
        if (!skipConfirmation || !report?.reportID) {
            return false;
        }
        return !(0, ReportUtils_1.isArchivedReport)(reportNameValuePairs) && !((0, ReportUtils_1.isPolicyExpenseChat)(report) && ((policy?.requiresCategory ?? false) || (policy?.requiresTag ?? false)));
    }, [report, skipConfirmation, policy, reportNameValuePairs]);
    /**
     * On phones that have ultra-wide lens, react-webcam uses ultra-wide by default.
     * The last deviceId is of regular len camera.
     */
    const requestCameraPermission = (0, react_1.useCallback)(() => {
        if (!(0, Browser_1.isMobile)()) {
            return;
        }
        const defaultConstraints = { facingMode: { exact: 'environment' } };
        navigator.mediaDevices
            .getUserMedia({ video: { facingMode: { exact: 'environment' }, zoom: { ideal: 1 } } })
            .then((stream) => {
            setCameraPermissionState('granted');
            stream.getTracks().forEach((track) => track.stop());
            // Only Safari 17+ supports zoom constraint
            if ((0, Browser_1.isMobileWebKit)() && stream.getTracks().length > 0) {
                let deviceId;
                for (const track of stream.getTracks()) {
                    const setting = track.getSettings();
                    if (setting.zoom === 1) {
                        deviceId = setting.deviceId;
                        break;
                    }
                }
                if (deviceId) {
                    setVideoConstraints({ deviceId });
                    return;
                }
            }
            if (!navigator.mediaDevices.enumerateDevices) {
                setVideoConstraints(defaultConstraints);
                return;
            }
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                let lastBackDeviceId = '';
                for (let i = devices.length - 1; i >= 0; i--) {
                    const device = devices.at(i);
                    if (device?.kind === 'videoinput') {
                        lastBackDeviceId = device.deviceId;
                        break;
                    }
                }
                if (!lastBackDeviceId) {
                    setVideoConstraints(defaultConstraints);
                    return;
                }
                setVideoConstraints({ deviceId: lastBackDeviceId });
            });
        })
            .catch(() => {
            setVideoConstraints(defaultConstraints);
            setCameraPermissionState('denied');
        });
    }, []);
    // When the component mounts, if there is a receipt, see if the image can be read from the disk. If not, make the user star scanning flow from scratch.
    // This is because until the request is saved, the receipt file is only stored in the browsers memory as a blob:// and if the browser is refreshed, then
    // the image ceases to exist. The best way for the user to recover from this is to start over from the start of the request process.
    (0, react_1.useEffect)(() => {
        let isAllScanFilesCanBeRead = true;
        Promise.all(transactions.map((item) => {
            const itemReceiptPath = item.receipt?.source;
            const isLocalFile = (0, FileUtils_1.isLocalFile)(itemReceiptPath);
            if (!isLocalFile) {
                return;
            }
            const onFailure = () => {
                isAllScanFilesCanBeRead = false;
            };
            return (0, IOU_1.checkIfScanFileCanBeRead)(item.filename, itemReceiptPath, item.receipt?.type, () => { }, onFailure);
        })).then(() => {
            if (isAllScanFilesCanBeRead) {
                return;
            }
            setIsMultiScanEnabled?.(false);
            (0, TransactionEdit_1.removeTransactionReceipt)(CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID);
            (0, TransactionEdit_1.removeDraftTransactions)(true);
        });
        // We want this hook to run on mounting only
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    (0, react_1.useEffect)(() => {
        if (!(0, Browser_1.isMobile)() || !isTabActive) {
            setVideoConstraints(undefined);
            return;
        }
        navigator.permissions
            .query({
            name: 'camera',
        })
            .then((permissionState) => {
            setCameraPermissionState(permissionState.state);
            if (permissionState.state === 'granted') {
                requestCameraPermission();
            }
        })
            .catch(() => {
            setCameraPermissionState('denied');
        })
            .finally(() => {
            setIsQueriedPermissionState(true);
        });
        // We only want to get the camera permission status when the component is mounted
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isTabActive]);
    // this effect will pre-fetch location in web and desktop if the location permission is already granted to optimize the flow
    (0, react_1.useEffect)(() => {
        const gpsRequired = initialTransaction?.amount === 0 && iouType !== CONST_1.default.IOU.TYPE.SPLIT;
        if (!gpsRequired) {
            return;
        }
        (0, LocationPermission_1.getLocationPermission)().then((status) => {
            if (status !== react_native_permissions_1.RESULTS.GRANTED && status !== react_native_permissions_1.RESULTS.LIMITED) {
                return;
            }
            (0, UserLocation_1.clearUserLocation)();
            (0, getCurrentPosition_1.default)((successData) => {
                (0, UserLocation_1.setUserLocation)({ longitude: successData.coords.longitude, latitude: successData.coords.latitude });
            }, () => { }, {
                maximumAge: CONST_1.default.GPS.MAX_AGE,
                timeout: CONST_1.default.GPS.TIMEOUT,
            });
        });
    }, [initialTransaction?.amount, iouType]);
    (0, react_1.useEffect)(() => {
        if (isMultiScanEnabled) {
            return;
        }
        setReceiptFiles([]);
    }, [isMultiScanEnabled]);
    const navigateBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo);
    }, [backTo]);
    const navigateToConfirmationPage = (0, react_1.useCallback)((shouldNavigateToSubmit = false, reportIDParam = undefined) => {
        switch (iouType) {
            case CONST_1.default.IOU.TYPE.REQUEST:
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, CONST_1.default.IOU.TYPE.SUBMIT, initialTransactionID, reportID, backToReport));
                break;
            case CONST_1.default.IOU.TYPE.SEND:
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, CONST_1.default.IOU.TYPE.PAY, initialTransactionID, reportID));
                break;
            default:
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, shouldNavigateToSubmit ? CONST_1.default.IOU.TYPE.SUBMIT : iouType, initialTransactionID, 
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                reportIDParam || reportID, backToReport));
        }
    }, [backToReport, iouType, reportID, initialTransactionID]);
    const createTransaction = (0, react_1.useCallback)((files, participant, gpsPoints, policyParams, billable, reimbursable = true) => {
        files.forEach((receiptFile, index) => {
            const transaction = transactions.find((item) => item.transactionID === receiptFile.transactionID);
            const receipt = receiptFile.file ?? {};
            receipt.source = receiptFile.source;
            receipt.state = CONST_1.default.IOU.RECEIPT_STATE.SCAN_READY;
            if (iouType === CONST_1.default.IOU.TYPE.TRACK && report) {
                (0, IOU_1.trackExpense)({
                    report,
                    isDraftPolicy: false,
                    participantParams: {
                        payeeEmail: currentUserPersonalDetails.login,
                        payeeAccountID: currentUserPersonalDetails.accountID,
                        participant,
                    },
                    transactionParams: {
                        amount: 0,
                        currency: transaction?.currency ?? 'USD',
                        created: transaction?.created,
                        receipt,
                        billable,
                        reimbursable,
                        ...(gpsPoints ?? {}),
                    },
                    ...(policyParams ?? {}),
                    shouldHandleNavigation: index === files.length - 1,
                });
            }
            else {
                (0, IOU_1.requestMoney)({
                    report,
                    participantParams: {
                        payeeEmail: currentUserPersonalDetails.login,
                        payeeAccountID: currentUserPersonalDetails.accountID,
                        participant,
                    },
                    ...(policyParams ?? {}),
                    ...(gpsPoints ?? {}),
                    transactionParams: {
                        amount: 0,
                        attendees: transaction?.comment?.attendees,
                        currency: transaction?.currency ?? 'USD',
                        created: transaction?.created ?? '',
                        merchant: '',
                        receipt,
                        billable,
                        reimbursable,
                    },
                    shouldHandleNavigation: index === files.length - 1,
                    backToReport,
                    shouldGenerateTransactionThreadReport,
                });
            }
        });
    }, [backToReport, currentUserPersonalDetails.accountID, currentUserPersonalDetails.login, iouType, report, transactions, shouldGenerateTransactionThreadReport]);
    const navigateToConfirmationStep = (0, react_1.useCallback)((files, locationPermissionGranted = false, isTestTransaction = false) => {
        if (backTo) {
            Navigation_1.default.goBack(backTo);
            return;
        }
        if (isTestTransaction) {
            const managerMcTestParticipant = (0, OptionsListUtils_1.getManagerMcTestParticipant)() ?? {};
            let reportIDParam = managerMcTestParticipant.reportID;
            if (!managerMcTestParticipant.reportID && report?.reportID) {
                reportIDParam = (0, ReportUtils_1.generateReportID)();
            }
            (0, IOU_1.setMoneyRequestParticipants)(initialTransactionID, [
                {
                    ...managerMcTestParticipant,
                    reportID: reportIDParam,
                    selected: true,
                },
            ], true).then(() => {
                navigateToConfirmationPage(true, reportIDParam);
            });
            return;
        }
        // If a reportID exists in the report object, it's because either:
        // - The user started this flow from using the + button in the composer inside a report.
        // - The user started this flow from using the global create menu by selecting the Track expense option.
        // In this case, the participants can be automatically assigned from the report and the user can skip the participants step and go straight
        // to the confirm step.
        // If the user is started this flow using the Create expense option (combined submit/track flow), they should be redirected to the participants page.
        if (report?.reportID && !(0, ReportUtils_1.isArchivedReport)(reportNameValuePairs) && iouType !== CONST_1.default.IOU.TYPE.CREATE) {
            const selectedParticipants = (0, IOU_1.getMoneyRequestParticipantsFromReport)(report);
            const participants = selectedParticipants.map((participant) => {
                const participantAccountID = participant?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
                return participantAccountID ? (0, OptionsListUtils_1.getParticipantsOption)(participant, personalDetails) : (0, OptionsListUtils_1.getReportOption)(participant, reportAttributesDerived);
            });
            if (shouldSkipConfirmation) {
                const firstReceiptFile = files.at(0);
                if (iouType === CONST_1.default.IOU.TYPE.SPLIT && firstReceiptFile) {
                    const splitReceipt = firstReceiptFile.file ?? {};
                    splitReceipt.source = firstReceiptFile.source;
                    splitReceipt.state = CONST_1.default.IOU.RECEIPT_STATE.SCAN_READY;
                    (0, IOU_1.startSplitBill)({
                        participants,
                        currentUserLogin: currentUserPersonalDetails?.login ?? '',
                        currentUserAccountID: currentUserPersonalDetails.accountID,
                        comment: '',
                        receipt: splitReceipt,
                        existingSplitChatReportID: reportID,
                        billable: false,
                        category: '',
                        tag: '',
                        currency: initialTransaction?.currency ?? 'USD',
                        taxCode: transactionTaxCode,
                        taxAmount: transactionTaxAmount,
                    });
                    return;
                }
                const participant = participants.at(0);
                if (!participant) {
                    return;
                }
                if (locationPermissionGranted) {
                    (0, getCurrentPosition_1.default)((successData) => {
                        const policyParams = { policy };
                        const gpsPoints = {
                            lat: successData.coords.latitude,
                            long: successData.coords.longitude,
                        };
                        createTransaction(files, participant, gpsPoints, policyParams, false, true);
                    }, (errorData) => {
                        Log_1.default.info('[IOURequestStepScan] getCurrentPosition failed', false, errorData);
                        // When there is an error, the money can still be requested, it just won't include the GPS coordinates
                        createTransaction(files, participant);
                    }, {
                        maximumAge: CONST_1.default.GPS.MAX_AGE,
                        timeout: CONST_1.default.GPS.TIMEOUT,
                    });
                    return;
                }
                createTransaction(files, participant);
                return;
            }
            const transactionIDs = files.map((receiptFile) => receiptFile.transactionID);
            (0, IOU_1.setMultipleMoneyRequestParticipantsFromReport)(transactionIDs, report).then(() => navigateToConfirmationPage());
            return;
        }
        // If there was no reportID, then that means the user started this flow from the global + menu
        // and an optimistic reportID was generated. In that case, the next step is to select the participants for this expense.
        if (iouType === CONST_1.default.IOU.TYPE.CREATE && (0, PolicyUtils_1.isPaidGroupPolicy)(activePolicy) && activePolicy?.isPolicyExpenseChatEnabled && !(0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(activePolicy.id)) {
            const activePolicyExpenseChat = (0, ReportUtils_1.getPolicyExpenseChat)(currentUserPersonalDetails.accountID, activePolicy?.id);
            // If the initial transaction has different participants selected that means that the user has changed the participant in the confirmation step
            if (initialTransaction?.participants && initialTransaction?.participants?.at(0)?.reportID !== activePolicyExpenseChat?.reportID) {
                const isTrackExpense = initialTransaction?.participants?.at(0)?.reportID === selfDMReportID;
                const setParticipantsPromises = files.map((receiptFile) => (0, IOU_1.setMoneyRequestParticipants)(receiptFile.transactionID, initialTransaction?.participants));
                Promise.all(setParticipantsPromises).then(() => {
                    if (isTrackExpense) {
                        Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, CONST_1.default.IOU.TYPE.TRACK, initialTransactionID, selfDMReportID));
                    }
                    else {
                        navigateToConfirmationPage(iouType === CONST_1.default.IOU.TYPE.CREATE, initialTransaction?.reportID);
                    }
                });
                return;
            }
            const setParticipantsPromises = files.map((receiptFile) => (0, IOU_1.setMoneyRequestParticipantsFromReport)(receiptFile.transactionID, activePolicyExpenseChat));
            Promise.all(setParticipantsPromises).then(() => Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType === CONST_1.default.IOU.TYPE.CREATE ? CONST_1.default.IOU.TYPE.SUBMIT : iouType, initialTransactionID, activePolicyExpenseChat?.reportID)));
        }
        else {
            (0, IOUUtils_1.navigateToParticipantPage)(iouType, initialTransactionID, reportID);
        }
    }, [
        backTo,
        report,
        reportNameValuePairs,
        iouType,
        activePolicy,
        initialTransactionID,
        navigateToConfirmationPage,
        shouldSkipConfirmation,
        personalDetails,
        reportAttributesDerived,
        createTransaction,
        currentUserPersonalDetails?.login,
        currentUserPersonalDetails.accountID,
        reportID,
        initialTransaction?.currency,
        initialTransaction?.participants,
        initialTransaction?.reportID,
        transactionTaxCode,
        transactionTaxAmount,
        policy,
        selfDMReportID,
    ]);
    const updateScanAndNavigate = (0, react_1.useCallback)((file, source) => {
        (0, IOU_1.replaceReceipt)({ transactionID: initialTransactionID, file: file, source });
        navigateBack();
    }, [initialTransactionID, navigateBack]);
    const setReceiptFilesAndNavigate = (files) => {
        if (files.length === 0) {
            return;
        }
        // Store the receipt on the transaction object in Onyx
        const newReceiptFiles = [];
        if (isEditing) {
            const file = files.at(0);
            if (!file) {
                return;
            }
            const source = URL.createObjectURL(file);
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            (0, IOU_1.setMoneyRequestReceipt)(initialTransactionID, source, file.name || '', !isEditing);
            updateScanAndNavigate(file, source);
            return;
        }
        files.forEach((file, index) => {
            const source = URL.createObjectURL(file);
            const transaction = !shouldAcceptMultipleFiles || (index === 0 && transactions.length === 1 && !initialTransaction?.receipt?.source)
                ? initialTransaction
                : (0, TransactionEdit_1.buildOptimisticTransactionAndCreateDraft)({
                    initialTransaction: initialTransaction,
                    currentUserPersonalDetails,
                    reportID,
                });
            const transactionID = transaction.transactionID ?? initialTransactionID;
            newReceiptFiles.push({ file, source, transactionID });
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            (0, IOU_1.setMoneyRequestReceipt)(transactionID, source, file.name || '', true);
        });
        if (shouldSkipConfirmation) {
            setReceiptFiles(newReceiptFiles);
            const gpsRequired = initialTransaction?.amount === 0 && iouType !== CONST_1.default.IOU.TYPE.SPLIT && files.length;
            if (gpsRequired) {
                const beginLocationPermissionFlow = shouldStartLocationPermissionFlow();
                if (beginLocationPermissionFlow) {
                    setStartLocationPermissionFlow(true);
                    return;
                }
            }
        }
        navigateToConfirmationStep(newReceiptFiles, false);
    };
    const { validateFiles, PDFValidationComponent, ErrorModal } = (0, useFilesValidation_1.default)(setReceiptFilesAndNavigate);
    const handleDropReceipt = (e) => {
        const files = Array.from(e?.dataTransfer?.files ?? []);
        if (files.length === 0) {
            return;
        }
        files.forEach((file) => {
            // eslint-disable-next-line no-param-reassign
            file.uri = URL.createObjectURL(file);
        });
        validateFiles(files, Array.from(e.dataTransfer?.items ?? []));
    };
    /**
     * Sets a test receipt from CONST.TEST_RECEIPT_URL and navigates to the confirmation step
     */
    const setTestReceiptAndNavigate = (0, react_1.useCallback)(() => {
        (0, setTestReceipt_1.default)(fake_receipt_png_1.default, 'png', (source, file, filename) => {
            (0, IOU_1.setMoneyRequestReceipt)(initialTransactionID, source, filename, !isEditing, CONST_1.default.TEST_RECEIPT.FILE_TYPE, true);
            navigateToConfirmationStep([{ file, source, transactionID: initialTransactionID }], false, true);
        });
    }, [initialTransactionID, isEditing, navigateToConfirmationStep]);
    const setupCameraPermissionsAndCapabilities = (stream) => {
        setCameraPermissionState('granted');
        const [track] = stream.getVideoTracks();
        const capabilities = track.getCapabilities();
        if ('torch' in capabilities && capabilities.torch) {
            trackRef.current = track;
        }
        setIsTorchAvailable('torch' in capabilities && !!capabilities.torch);
    };
    const submitReceipts = (0, react_1.useCallback)((files) => {
        if (shouldSkipConfirmation) {
            const gpsRequired = initialTransaction?.amount === 0 && iouType !== CONST_1.default.IOU.TYPE.SPLIT;
            if (gpsRequired) {
                const beginLocationPermissionFlow = shouldStartLocationPermissionFlow();
                if (beginLocationPermissionFlow) {
                    setStartLocationPermissionFlow(true);
                    return;
                }
            }
        }
        navigateToConfirmationStep(files, false);
    }, [initialTransaction, iouType, shouldStartLocationPermissionFlow, navigateToConfirmationStep, shouldSkipConfirmation]);
    const viewfinderLayout = (0, react_1.useRef)(null);
    const getScreenshot = (0, react_1.useCallback)(() => {
        if (!cameraRef.current) {
            requestCameraPermission();
            return;
        }
        const imageBase64 = cameraRef.current.getScreenshot();
        if (imageBase64 === null) {
            return;
        }
        if (isMultiScanEnabled) {
            showBlink();
        }
        const originalFileName = `receipt_${Date.now()}.png`;
        const originalFile = (0, FileUtils_1.base64ToFile)(imageBase64 ?? '', originalFileName);
        const imageObject = { file: originalFile, filename: originalFile.name, source: URL.createObjectURL(originalFile) };
        // Some browsers center-crop the viewfinder inside the video element (due to object-position: center),
        // while other browsers let the video element overflow and the container crops it from the top.
        // We crop and algin the result image the same way.
        const videoHeight = cameraRef.current.video?.getBoundingClientRect?.()?.height ?? NaN;
        const viewFinderHeight = viewfinderLayout.current?.height ?? NaN;
        const shouldAlignTop = videoHeight > viewFinderHeight;
        (0, cropImageToAspectRatio_1.cropImageToAspectRatio)(imageObject, viewfinderLayout.current?.width, viewfinderLayout.current?.height, shouldAlignTop).then(({ file, filename, source }) => {
            const transaction = isMultiScanEnabled && initialTransaction?.receipt?.source
                ? (0, TransactionEdit_1.buildOptimisticTransactionAndCreateDraft)({
                    initialTransaction,
                    currentUserPersonalDetails,
                    reportID,
                })
                : initialTransaction;
            const transactionID = transaction?.transactionID ?? initialTransactionID;
            const newReceiptFiles = [...receiptFiles, { file, source, transactionID }];
            (0, IOU_1.setMoneyRequestReceipt)(transactionID, source, filename, !isEditing);
            setReceiptFiles(newReceiptFiles);
            if (isMultiScanEnabled) {
                return;
            }
            if (isEditing) {
                updateScanAndNavigate(file, source);
                return;
            }
            submitReceipts(newReceiptFiles);
        });
    }, [
        isMultiScanEnabled,
        initialTransaction,
        currentUserPersonalDetails,
        reportID,
        initialTransactionID,
        receiptFiles,
        isEditing,
        submitReceipts,
        requestCameraPermission,
        showBlink,
        updateScanAndNavigate,
    ]);
    const toggleMultiScan = () => {
        if (!dismissedProductTraining?.[CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.MULTI_SCAN_EDUCATIONAL_MODAL]) {
            setShouldShowMultiScanEducationalPopup(true);
        }
        if (isMultiScanEnabled) {
            (0, TransactionEdit_1.removeDraftTransactions)(true);
        }
        (0, TransactionEdit_1.removeTransactionReceipt)(CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID);
        setIsMultiScanEnabled?.(!isMultiScanEnabled);
    };
    const clearTorchConstraints = (0, react_1.useCallback)(() => {
        if (!trackRef.current) {
            return;
        }
        trackRef.current.applyConstraints({
            advanced: [{ torch: false }],
        });
    }, []);
    const capturePhoto = (0, react_1.useCallback)(() => {
        if (trackRef.current && isFlashLightOn) {
            trackRef.current
                .applyConstraints({
                advanced: [{ torch: true }],
            })
                .then(() => {
                getScreenshotTimeoutRef.current = setTimeout(() => {
                    getScreenshot();
                    clearTorchConstraints();
                }, 2000);
            });
            return;
        }
        getScreenshot();
    }, [isFlashLightOn, getScreenshot, clearTorchConstraints]);
    const panResponder = (0, react_1.useRef)(react_native_1.PanResponder.create({
        onPanResponderTerminationRequest: () => false,
    })).current;
    (0, react_1.useEffect)(() => () => {
        if (!getScreenshotTimeoutRef.current) {
            return;
        }
        clearTimeout(getScreenshotTimeoutRef.current);
    }, []);
    const dismissMultiScanEducationalPopup = () => {
        react_native_1.InteractionManager.runAfterInteractions(() => {
            (0, Welcome_1.dismissProductTraining)(CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.MULTI_SCAN_EDUCATIONAL_MODAL);
            setShouldShowMultiScanEducationalPopup(false);
        });
    };
    const mobileCameraView = () => (<>
            <react_native_1.View style={[styles.cameraView]}>
                {PDFValidationComponent}
                {((cameraPermissionState === 'prompt' && !isQueriedPermissionState) || (cameraPermissionState === 'granted' && (0, EmptyObject_1.isEmptyObject)(videoConstraints))) && (<react_native_1.ActivityIndicator size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} style={[styles.flex1]} color={theme.textSupporting}/>)}
                {cameraPermissionState !== 'granted' && isQueriedPermissionState && (<react_native_1.View style={[styles.flex1, styles.permissionView, styles.userSelectNone]}>
                        <Icon_1.default src={hand_svg_1.default} width={CONST_1.default.RECEIPT.HAND_ICON_WIDTH} height={CONST_1.default.RECEIPT.HAND_ICON_HEIGHT} additionalStyles={[styles.pb5]}/>
                        <Text_1.default style={[styles.textFileUpload]}>{translate('receipt.takePhoto')}</Text_1.default>
                        {cameraPermissionState === 'denied' ? (<Text_1.default style={[styles.subTextFileUpload]}>
                                {translate('receipt.deniedCameraAccess')}
                                <TextLink_1.default href={CONST_1.default.DENIED_CAMERA_ACCESS_INSTRUCTIONS_URL}>{translate('receipt.deniedCameraAccessInstructions')}</TextLink_1.default>.
                            </Text_1.default>) : (<Text_1.default style={[styles.subTextFileUpload]}>{translate('receipt.cameraAccess')}</Text_1.default>)}
                        <Button_1.default success text={translate('common.continue')} accessibilityLabel={translate('common.continue')} style={[styles.p9, styles.pt5]} onPress={capturePhoto}/>
                    </react_native_1.View>)}
                {cameraPermissionState === 'granted' && !(0, EmptyObject_1.isEmptyObject)(videoConstraints) && (<react_native_1.View style={styles.flex1} onLayout={(e) => (viewfinderLayout.current = e.nativeEvent.layout)}>
                        <WebCamera_1.default onUserMedia={setupCameraPermissionsAndCapabilities} onUserMediaError={() => setCameraPermissionState('denied')} style={{
                ...styles.videoContainer,
                display: cameraPermissionState !== 'granted' ? 'none' : 'block',
            }} ref={cameraRef} screenshotFormat="image/png" videoConstraints={videoConstraints} forceScreenshotSourceSize audio={false} disablePictureInPicture={false} imageSmoothing={false} mirrored={false} screenshotQuality={0}/>
                        {canUseMultiScan && (0, Browser_1.isMobile)() ? (<react_native_1.View style={[styles.flashButtonContainer, styles.primaryMediumIcon, isFlashLightOn && styles.bgGreenSuccess, !isTorchAvailable && styles.opacity0]}>
                                <PressableWithFeedback_1.default role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('receipt.flash')} disabled={!isTorchAvailable} onPress={toggleFlashlight}>
                                    <Icon_1.default height={16} width={16} src={Expensicons.Bolt} fill={isFlashLightOn ? theme.white : theme.icon}/>
                                </PressableWithFeedback_1.default>
                            </react_native_1.View>) : null}
                        <react_native_reanimated_1.default.View pointerEvents="none" style={[react_native_1.StyleSheet.absoluteFillObject, styles.backgroundWhite, blinkStyle, styles.zIndex10]}/>
                    </react_native_1.View>)}
            </react_native_1.View>

            <react_native_1.View style={[styles.flexRow, styles.justifyContentAround, styles.alignItemsCenter, styles.pv3]}>
                <AttachmentPicker_1.default acceptedFileTypes={[...CONST_1.default.API_ATTACHMENT_VALIDATIONS.ALLOWED_RECEIPT_EXTENSIONS]} allowMultiple={shouldAcceptMultipleFiles}>
                    {({ openPicker }) => (<PressableWithFeedback_1.default accessibilityLabel={translate(shouldAcceptMultipleFiles ? 'common.chooseFiles' : 'common.chooseFile')} role={CONST_1.default.ROLE.BUTTON} style={isMultiScanEnabled && styles.opacity0} onPress={() => {
                openPicker({
                    onPicked: (data) => validateFiles(data),
                });
            }}>
                            <Icon_1.default height={32} width={32} src={Expensicons.Gallery} fill={theme.textSupporting}/>
                        </PressableWithFeedback_1.default>)}
                </AttachmentPicker_1.default>
                <PressableWithFeedback_1.default role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('receipt.shutter')} style={[styles.alignItemsCenter]} onPress={capturePhoto}>
                    <shutter_svg_1.default width={CONST_1.default.RECEIPT.SHUTTER_SIZE} height={CONST_1.default.RECEIPT.SHUTTER_SIZE}/>
                </PressableWithFeedback_1.default>
                {canUseMultiScan && (0, Browser_1.isMobile)() ? (<PressableWithFeedback_1.default accessibilityRole="button" role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('receipt.multiScan')} style={styles.alignItemsEnd} onPress={toggleMultiScan}>
                        <Icon_1.default height={32} width={32} src={Expensicons.ReceiptMultiple} fill={isMultiScanEnabled ? theme.iconMenu : theme.textSupporting}/>
                    </PressableWithFeedback_1.default>) : (<PressableWithFeedback_1.default role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('receipt.flash')} style={[styles.alignItemsEnd, !isTorchAvailable && styles.opacity0]} onPress={toggleFlashlight} disabled={!isTorchAvailable}>
                        <Icon_1.default height={32} width={32} src={isFlashLightOn ? Expensicons.Bolt : Expensicons.boltSlash} fill={theme.textSupporting}/>
                    </PressableWithFeedback_1.default>)}
            </react_native_1.View>
            {canUseMultiScan && (0, Browser_1.isMobile)() && shouldShowMultiScanEducationalPopup && (<FeatureTrainingModal_1.default title={translate('iou.scanMultipleReceipts')} image={educational_illustration__multi_scan_svg_1.default} shouldRenderSVG imageHeight="auto" imageWidth="auto" modalInnerContainerStyle={styles.pt0} illustrationOuterContainerStyle={styles.multiScanEducationalPopupImage} onConfirm={dismissMultiScanEducationalPopup} titleStyles={styles.mb2} confirmText={translate('common.buttonConfirm')} description={translate('iou.scanMultipleReceiptsDescription')} contentInnerContainerStyles={styles.mb6} shouldGoBack={false}/>)}

            {canUseMultiScan && (<ReceiptPreviews_1.default isMultiScanEnabled={isMultiScanEnabled} submit={submitReceipts}/>)}
        </>);
    const [containerHeight, setContainerHeight] = (0, react_1.useState)(0);
    const [desktopUploadViewHeight, setDesktopUploadViewHeight] = (0, react_1.useState)(0);
    const [downloadAppBannerHeight, setDownloadAppBannerHeight] = (0, react_1.useState)(0);
    /*  We use isMobile() here to explicitly hide DownloadAppBanner component on both mobile web and native apps */
    const shouldHideDownloadAppBanner = (0, Browser_1.isMobile)() || downloadAppBannerHeight + desktopUploadViewHeight + styles.uploadFileView(isSmallScreenWidth).paddingVertical * 2 > containerHeight;
    const desktopUploadView = () => (<react_native_1.View style={[styles.alignItemsCenter, styles.justifyContentCenter]} onLayout={(e) => {
            setDesktopUploadViewHeight(e.nativeEvent.layout.height);
        }}>
            {PDFValidationComponent}
            <receipt_upload_svg_1.default width={CONST_1.default.RECEIPT.ICON_SIZE} height={CONST_1.default.RECEIPT.ICON_SIZE}/>
            <react_native_1.View style={[styles.uploadFileViewTextContainer, styles.userSelectNone]} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...panResponder.panHandlers}>
                <Text_1.default style={[styles.textFileUpload]}>{translate(shouldAcceptMultipleFiles ? 'receipt.uploadMultiple' : 'receipt.upload')}</Text_1.default>
                <Text_1.default style={[styles.subTextFileUpload]}>
                    {isSmallScreenWidth
            ? translate(shouldAcceptMultipleFiles ? 'receipt.chooseReceipts' : 'receipt.chooseReceipt')
            : translate(shouldAcceptMultipleFiles ? 'receipt.dragReceiptsBeforeEmail' : 'receipt.dragReceiptBeforeEmail')}
                    <CopyTextToClipboard_1.default text={CONST_1.default.EMAIL.RECEIPTS} textStyles={[styles.textBlue]}/>
                    {isSmallScreenWidth ? null : translate(shouldAcceptMultipleFiles ? 'receipt.dragReceiptsAfterEmail' : 'receipt.dragReceiptAfterEmail')}
                </Text_1.default>
            </react_native_1.View>

            <AttachmentPicker_1.default allowMultiple={shouldAcceptMultipleFiles}>
                {({ openPicker }) => (<Button_1.default success text={translate(shouldAcceptMultipleFiles ? 'common.chooseFiles' : 'common.chooseFile')} accessibilityLabel={translate(shouldAcceptMultipleFiles ? 'common.chooseFiles' : 'common.chooseFile')} style={[styles.p9]} onPress={() => {
                openPicker({
                    onPicked: (data) => validateFiles(data),
                });
            }}/>)}
            </AttachmentPicker_1.default>
        </react_native_1.View>);
    return (<StepScreenDragAndDropWrapper_1.default headerTitle={translate('common.receipt')} onBackButtonPress={navigateBack} shouldShowWrapper={!!backTo || isEditing} testID={IOURequestStepScan.displayName}>
            {(isDraggingOverWrapper) => (<react_native_1.View onLayout={(event) => {
                setContainerHeight(event.nativeEvent.layout.height);
                if (!onLayout) {
                    return;
                }
                onLayout(setTestReceiptAndNavigate);
            }} style={[styles.flex1, !(0, Browser_1.isMobile)() && styles.uploadFileView(isSmallScreenWidth)]}>
                    <react_native_1.View style={[styles.flex1, !(0, Browser_1.isMobile)() && styles.alignItemsCenter, styles.justifyContentCenter]}>
                        {!(isDraggingOver ?? isDraggingOverWrapper) && ((0, Browser_1.isMobile)() ? mobileCameraView() : desktopUploadView())}
                    </react_native_1.View>
                    <Consumer_1.default onDrop={handleDropReceipt}>
                        <DropZoneUI_1.default icon={isReplacingReceipt ? Expensicons.ReplaceReceipt : Expensicons.SmartScan} dropStyles={styles.receiptDropOverlay(true)} dropTitle={isReplacingReceipt ? translate('dropzone.replaceReceipt') : translate(shouldAcceptMultipleFiles ? 'dropzone.scanReceipts' : 'quickAction.scanReceipt')} dropTextStyles={styles.receiptDropText} dashedBorderStyles={styles.activeDropzoneDashedBorder(theme.receiptDropBorderColorActive, true)}/>
                    </Consumer_1.default>
                    {!shouldHideDownloadAppBanner && <DownloadAppBanner_1.default onLayout={(e) => setDownloadAppBannerHeight(e.nativeEvent.layout.height)}/>}
                    {ErrorModal}
                    {startLocationPermissionFlow && !!receiptFiles.length && (<LocationPermissionModal_1.default startPermissionFlow={startLocationPermissionFlow} resetPermissionFlow={() => setStartLocationPermissionFlow(false)} onGrant={() => navigateToConfirmationStep(receiptFiles, true)} onDeny={() => {
                    (0, IOU_1.updateLastLocationPermissionPrompt)();
                    navigateToConfirmationStep(receiptFiles, false);
                }}/>)}
                </react_native_1.View>)}
        </StepScreenDragAndDropWrapper_1.default>);
}
IOURequestStepScan.displayName = 'IOURequestStepScan';
const IOURequestStepScanWithOnyx = IOURequestStepScan;
const IOURequestStepScanWithCurrentUserPersonalDetails = (0, withCurrentUserPersonalDetails_1.default)(IOURequestStepScanWithOnyx);
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepScanWithWritableReportOrNotFound = (0, withWritableReportOrNotFound_1.default)(IOURequestStepScanWithCurrentUserPersonalDetails, true);
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepScanWithFullTransactionOrNotFound = (0, withFullTransactionOrNotFound_1.default)(IOURequestStepScanWithWritableReportOrNotFound);
exports.default = IOURequestStepScanWithFullTransactionOrNotFound;
