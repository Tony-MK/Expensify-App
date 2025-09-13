"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@react-navigation/core");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_blob_util_1 = require("react-native-blob-util");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_permissions_1 = require("react-native-permissions");
const react_native_reanimated_1 = require("react-native-reanimated");
const react_native_vision_camera_1 = require("react-native-vision-camera");
const educational_illustration__multi_scan_svg_1 = require("@assets/images/educational-illustration__multi-scan.svg");
const fake_receipt_png_1 = require("@assets/images/fake-receipt.png");
const hand_svg_1 = require("@assets/images/hand.svg");
const shutter_svg_1 = require("@assets/images/shutter.svg");
const AttachmentPicker_1 = require("@components/AttachmentPicker");
const Button_1 = require("@components/Button");
const FeatureTrainingModal_1 = require("@components/FeatureTrainingModal");
const FullScreenLoaderContext_1 = require("@components/FullScreenLoaderContext");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const ImageSVG_1 = require("@components/ImageSVG");
const LocationPermissionModal_1 = require("@components/LocationPermissionModal");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const Text_1 = require("@components/Text");
const withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
const useFilesValidation_1 = require("@hooks/useFilesValidation");
const useIOUUtils_1 = require("@hooks/useIOUUtils");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const usePolicy_1 = require("@hooks/usePolicy");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const setTestReceipt_1 = require("@libs/actions/setTestReceipt");
const Welcome_1 = require("@libs/actions/Welcome");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const getPhotoSource_1 = require("@libs/fileDownload/getPhotoSource");
const getCurrentPosition_1 = require("@libs/getCurrentPosition");
const getPlatform_1 = require("@libs/getPlatform");
const getReceiptsUploadFolderPath_1 = require("@libs/getReceiptsUploadFolderPath");
const HapticFeedback_1 = require("@libs/HapticFeedback");
const IOUUtils_1 = require("@libs/IOUUtils");
const Log_1 = require("@libs/Log");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const StepScreenWrapper_1 = require("@pages/iou/request/step/StepScreenWrapper");
const withFullTransactionOrNotFound_1 = require("@pages/iou/request/step/withFullTransactionOrNotFound");
const withWritableReportOrNotFound_1 = require("@pages/iou/request/step/withWritableReportOrNotFound");
const IOU_1 = require("@userActions/IOU");
const TransactionEdit_1 = require("@userActions/TransactionEdit");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const CameraPermission_1 = require("./CameraPermission");
const cropImageToAspectRatio_1 = require("./cropImageToAspectRatio");
const Camera_1 = require("./NavigationAwareCamera/Camera");
const ReceiptPreviews_1 = require("./ReceiptPreviews");
function IOURequestStepScan({ report, route: { params: { action, iouType, reportID, transactionID: initialTransactionID, backTo, backToReport }, }, transaction: initialTransaction, currentUserPersonalDetails, onLayout, isMultiScanEnabled = false, setIsMultiScanEnabled, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const { isLoaderVisible, setIsLoaderVisible } = (0, FullScreenLoaderContext_1.useFullScreenLoader)();
    const device = (0, react_native_vision_camera_1.useCameraDevice)('back', {
        physicalDevices: ['wide-angle-camera', 'ultra-wide-angle-camera'],
    });
    const isEditing = action === CONST_1.default.IOU.ACTION.EDIT;
    const hasFlash = !!device?.hasFlash;
    const camera = (0, react_1.useRef)(null);
    const [flash, setFlash] = (0, react_1.useState)(false);
    const canUseMultiScan = !isEditing && iouType !== CONST_1.default.IOU.TYPE.SPLIT && !backTo && !backToReport;
    const [startLocationPermissionFlow, setStartLocationPermissionFlow] = (0, react_1.useState)(false);
    const [receiptFiles, setReceiptFiles] = (0, react_1.useState)([]);
    const [reportNameValuePairs] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report?.reportID}`, { canBeMissing: true });
    const policy = (0, usePolicy_1.default)(report?.policyID);
    const [personalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false });
    const [skipConfirmation] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SKIP_CONFIRMATION}${initialTransactionID}`, { canBeMissing: true });
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: false });
    const [activePolicy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${activePolicyID}`, { canBeMissing: true });
    const [dismissedProductTraining] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_DISMISSED_PRODUCT_TRAINING, { canBeMissing: true });
    const [reportAttributesDerived] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true, selector: (val) => val?.reports });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const platform = (0, getPlatform_1.default)(true);
    const [mutedPlatforms = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_MUTED_PLATFORMS, { canBeMissing: true });
    const isPlatformMuted = mutedPlatforms[platform];
    const [cameraPermissionStatus, setCameraPermissionStatus] = (0, react_1.useState)(null);
    const [didCapturePhoto, setDidCapturePhoto] = (0, react_1.useState)(false);
    const [shouldShowMultiScanEducationalPopup, setShouldShowMultiScanEducationalPopup] = (0, react_1.useState)(false);
    const [cameraKey, setCameraKey] = (0, react_1.useState)(0);
    const { shouldStartLocationPermissionFlow } = (0, useIOUUtils_1.default)();
    const shouldGenerateTransactionThreadReport = !isBetaEnabled(CONST_1.default.BETAS.NO_OPTIMISTIC_TRANSACTION_THREADS) || !account?.shouldBlockTransactionThreadReportCreation;
    const defaultTaxCode = (0, TransactionUtils_1.getDefaultTaxCode)(policy, initialTransaction);
    const transactionTaxCode = (initialTransaction?.taxCode ? initialTransaction?.taxCode : defaultTaxCode) ?? '';
    const transactionTaxAmount = initialTransaction?.taxAmount ?? 0;
    const [optimisticTransactions] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT, {
        selector: (items) => Object.values(items ?? {}),
        canBeMissing: true,
    });
    const transactions = (0, react_1.useMemo)(() => {
        const allTransactions = optimisticTransactions && optimisticTransactions.length > 1 ? optimisticTransactions : [initialTransaction];
        return allTransactions.filter((transaction) => !!transaction);
    }, [initialTransaction, optimisticTransactions]);
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
        HapticFeedback_1.default.press();
    }, [blinkOpacity]);
    // For quick button actions, we'll skip the confirmation page unless the report is archived or this is a workspace
    // request and the workspace requires a category or a tag
    const shouldSkipConfirmation = (0, react_1.useMemo)(() => {
        if (!skipConfirmation || !report?.reportID) {
            return false;
        }
        return !(0, ReportUtils_1.isArchivedReport)(reportNameValuePairs) && !((0, ReportUtils_1.isPolicyExpenseChat)(report) && ((policy?.requiresCategory ?? false) || (policy?.requiresTag ?? false)));
    }, [report, skipConfirmation, policy, reportNameValuePairs]);
    const { translate } = (0, useLocalize_1.default)();
    const askForPermissions = () => {
        // There's no way we can check for the BLOCKED status without requesting the permission first
        // https://github.com/zoontek/react-native-permissions/blob/a836e114ce3a180b2b23916292c79841a267d828/README.md?plain=1#L670
        CameraPermission_1.default.requestCameraPermission?.()
            .then((status) => {
            setCameraPermissionStatus(status);
            if (status === react_native_permissions_1.RESULTS.BLOCKED) {
                (0, FileUtils_1.showCameraPermissionsAlert)();
            }
        })
            .catch(() => {
            setCameraPermissionStatus(react_native_permissions_1.RESULTS.UNAVAILABLE);
        });
    };
    const focusIndicatorOpacity = (0, react_native_reanimated_1.useSharedValue)(0);
    const focusIndicatorScale = (0, react_native_reanimated_1.useSharedValue)(2);
    const focusIndicatorPosition = (0, react_native_reanimated_1.useSharedValue)({ x: 0, y: 0 });
    const cameraFocusIndicatorAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        opacity: focusIndicatorOpacity.get(),
        transform: [{ translateX: focusIndicatorPosition.get().x }, { translateY: focusIndicatorPosition.get().y }, { scale: focusIndicatorScale.get() }],
    }));
    const focusCamera = (point) => {
        if (!camera.current) {
            return;
        }
        camera.current.focus(point).catch((error) => {
            if (error.message === '[unknown/unknown] Cancelled by another startFocusAndMetering()') {
                return;
            }
            Log_1.default.warn('Error focusing camera', error);
        });
    };
    const tapGesture = react_native_gesture_handler_1.Gesture.Tap()
        .enabled(device?.supportsFocus ?? false)
        // eslint-disable-next-line react-compiler/react-compiler
        .onStart((ev) => {
        const point = { x: ev.x, y: ev.y };
        focusIndicatorOpacity.set((0, react_native_reanimated_1.withSequence)((0, react_native_reanimated_1.withTiming)(0.8, { duration: 250 }), (0, react_native_reanimated_1.withDelay)(1000, (0, react_native_reanimated_1.withTiming)(0, { duration: 250 }))));
        focusIndicatorScale.set(2);
        focusIndicatorScale.set((0, react_native_reanimated_1.withSpring)(1, { damping: 10, stiffness: 200 }));
        focusIndicatorPosition.set(point);
        (0, react_native_reanimated_1.runOnJS)(focusCamera)(point);
    });
    (0, core_1.useFocusEffect)((0, react_1.useCallback)(() => {
        setDidCapturePhoto(false);
        const refreshCameraPermissionStatus = () => {
            CameraPermission_1.default?.getCameraPermissionStatus?.()
                .then(setCameraPermissionStatus)
                .catch(() => setCameraPermissionStatus(react_native_permissions_1.RESULTS.UNAVAILABLE));
        };
        react_native_1.InteractionManager.runAfterInteractions(() => {
            // Check initial camera permission status
            refreshCameraPermissionStatus();
        });
        // Refresh permission status when app gain focus
        const subscription = react_native_1.AppState.addEventListener('change', (appState) => {
            if (appState !== 'active') {
                return;
            }
            setCameraKey((prev) => prev + 1);
            refreshCameraPermissionStatus();
        });
        return () => {
            subscription.remove();
            if (isLoaderVisible) {
                setIsLoaderVisible(false);
            }
        };
    }, [isLoaderVisible, setIsLoaderVisible]));
    (0, react_1.useEffect)(() => {
        if (isMultiScanEnabled) {
            return;
        }
        setReceiptFiles([]);
    }, [isMultiScanEnabled]);
    const navigateBack = () => {
        Navigation_1.default.goBack();
    };
    const navigateToConfirmationPage = (0, react_1.useCallback)((isTestTransaction = false, reportIDParam = undefined) => {
        switch (iouType) {
            case CONST_1.default.IOU.TYPE.REQUEST:
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, CONST_1.default.IOU.TYPE.SUBMIT, initialTransactionID, reportID, backToReport));
                break;
            case CONST_1.default.IOU.TYPE.SEND:
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, CONST_1.default.IOU.TYPE.PAY, initialTransactionID, reportID));
                break;
            default:
                Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, isTestTransaction ? CONST_1.default.IOU.TYPE.SUBMIT : iouType, initialTransactionID, 
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
                        createTransaction(files, participant, gpsPoints, policyParams, false);
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
            const setParticipantsPromises = files.map((receiptFile) => (0, IOU_1.setMoneyRequestParticipantsFromReport)(receiptFile.transactionID, report));
            Promise.all(setParticipantsPromises).then(() => navigateToConfirmationPage());
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
        navigateBack();
        (0, IOU_1.replaceReceipt)({ transactionID: initialTransactionID, file: file, source });
    }, [initialTransactionID]);
    /**
     * Sets a test receipt from CONST.TEST_RECEIPT_URL and navigates to the confirmation step
     */
    const setTestReceiptAndNavigate = (0, react_1.useCallback)(() => {
        (0, setTestReceipt_1.default)(fake_receipt_png_1.default, 'png', (source, file, filename) => {
            if (!file.uri) {
                return;
            }
            (0, IOU_1.setMoneyRequestReceipt)(initialTransactionID, source, filename, !isEditing, file.type, true);
            navigateToConfirmationStep([{ file, source: file.uri, transactionID: initialTransactionID }], false, true);
        });
    }, [initialTransactionID, isEditing, navigateToConfirmationStep]);
    const dismissMultiScanEducationalPopup = () => {
        react_native_1.InteractionManager.runAfterInteractions(() => {
            (0, Welcome_1.dismissProductTraining)(CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.MULTI_SCAN_EDUCATIONAL_MODAL);
            setShouldShowMultiScanEducationalPopup(false);
        });
    };
    /**
     * Sets the Receipt objects and navigates the user to the next page
     */
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
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            (0, IOU_1.setMoneyRequestReceipt)(initialTransactionID, file.uri || '', file.name || '', !isEditing);
            updateScanAndNavigate(file, file.uri ?? '');
            return;
        }
        files.forEach((file, index) => {
            const transaction = !shouldAcceptMultipleFiles || (index === 0 && transactions.length === 1 && !initialTransaction?.receipt?.source)
                ? initialTransaction
                : (0, TransactionEdit_1.buildOptimisticTransactionAndCreateDraft)({
                    initialTransaction: initialTransaction,
                    currentUserPersonalDetails,
                    reportID,
                });
            const transactionID = transaction.transactionID ?? initialTransactionID;
            newReceiptFiles.push({ file, source: file.uri ?? '', transactionID });
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            (0, IOU_1.setMoneyRequestReceipt)(transactionID, file.uri ?? '', file.name || '', true);
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
    }, [shouldSkipConfirmation, navigateToConfirmationStep, initialTransaction, iouType, shouldStartLocationPermissionFlow]);
    const viewfinderLayout = (0, react_1.useRef)(null);
    const capturePhoto = (0, react_1.useCallback)(() => {
        if (!camera.current && (cameraPermissionStatus === react_native_permissions_1.RESULTS.DENIED || cameraPermissionStatus === react_native_permissions_1.RESULTS.BLOCKED)) {
            askForPermissions();
            return;
        }
        const showCameraAlert = () => {
            react_native_1.Alert.alert(translate('receipt.cameraErrorTitle'), translate('receipt.cameraErrorMessage'));
        };
        if (!camera.current) {
            showCameraAlert();
        }
        if (didCapturePhoto) {
            return;
        }
        if (isMultiScanEnabled) {
            showBlink();
        }
        setDidCapturePhoto(true);
        const path = (0, getReceiptsUploadFolderPath_1.default)();
        react_native_blob_util_1.default.fs
            .isDir(path)
            .then((isDir) => {
            if (isDir) {
                return;
            }
            react_native_blob_util_1.default.fs.mkdir(path).catch((error) => {
                Log_1.default.warn('Error creating the directory', error);
            });
        })
            .catch((error) => {
            Log_1.default.warn('Error checking if the directory exists', error);
        })
            .then(() => {
            camera?.current
                ?.takePhoto({
                flash: flash && hasFlash ? 'on' : 'off',
                enableShutterSound: !isPlatformMuted,
                path,
            })
                .then((photo) => {
                // Store the receipt on the transaction object in Onyx
                const transaction = isMultiScanEnabled && initialTransaction?.receipt?.source
                    ? (0, TransactionEdit_1.buildOptimisticTransactionAndCreateDraft)({
                        initialTransaction,
                        currentUserPersonalDetails,
                        reportID,
                    })
                    : initialTransaction;
                const transactionID = transaction?.transactionID ?? initialTransactionID;
                const imageObject = { file: photo, filename: photo.path, source: (0, getPhotoSource_1.default)(photo.path) };
                (0, cropImageToAspectRatio_1.cropImageToAspectRatio)(imageObject, viewfinderLayout.current?.width, viewfinderLayout.current?.height).then(({ filename, source }) => {
                    (0, IOU_1.setMoneyRequestReceipt)(transactionID, source, filename, !isEditing);
                    (0, FileUtils_1.readFileAsync)(source, filename, (file) => {
                        if (isEditing) {
                            updateScanAndNavigate(file, source);
                            return;
                        }
                        const newReceiptFiles = [...receiptFiles, { file, source, transactionID }];
                        setReceiptFiles(newReceiptFiles);
                        if (isMultiScanEnabled) {
                            setDidCapturePhoto(false);
                            return;
                        }
                        submitReceipts(newReceiptFiles);
                    }, () => {
                        setDidCapturePhoto(false);
                        showCameraAlert();
                        Log_1.default.warn('Error reading photo');
                    });
                });
            })
                .catch((error) => {
                setDidCapturePhoto(false);
                showCameraAlert();
                Log_1.default.warn('Error taking photo', error);
            });
        });
    }, [
        cameraPermissionStatus,
        didCapturePhoto,
        isMultiScanEnabled,
        translate,
        showBlink,
        flash,
        hasFlash,
        isPlatformMuted,
        initialTransaction,
        currentUserPersonalDetails,
        reportID,
        initialTransactionID,
        isEditing,
        receiptFiles,
        submitReceipts,
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
    // Wait for camera permission status to render
    if (cameraPermissionStatus == null) {
        return null;
    }
    return (<StepScreenWrapper_1.default includeSafeAreaPaddingBottom headerTitle={translate('common.receipt')} onBackButtonPress={navigateBack} shouldShowWrapper={!!backTo || isEditing} testID={IOURequestStepScan.displayName}>
            <react_native_1.View style={styles.flex1} onLayout={() => {
            if (!onLayout) {
                return;
            }
            onLayout(setTestReceiptAndNavigate);
        }}>
                {PDFValidationComponent}
                <react_native_1.View style={[styles.flex1]}>
                    {cameraPermissionStatus !== react_native_permissions_1.RESULTS.GRANTED && (<react_native_1.View style={[styles.cameraView, styles.permissionView, styles.userSelectNone]}>
                            <ImageSVG_1.default contentFit="contain" src={hand_svg_1.default} width={CONST_1.default.RECEIPT.HAND_ICON_WIDTH} height={CONST_1.default.RECEIPT.HAND_ICON_HEIGHT} style={styles.pb5}/>

                            <Text_1.default style={[styles.textFileUpload]}>{translate('receipt.takePhoto')}</Text_1.default>
                            <Text_1.default style={[styles.subTextFileUpload]}>{translate('receipt.cameraAccess')}</Text_1.default>
                            <Button_1.default success text={translate('common.continue')} accessibilityLabel={translate('common.continue')} style={[styles.p9, styles.pt5]} onPress={capturePhoto}/>
                        </react_native_1.View>)}
                    {cameraPermissionStatus === react_native_permissions_1.RESULTS.GRANTED && device == null && (<react_native_1.View style={[styles.cameraView]}>
                            <react_native_1.ActivityIndicator size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} style={[styles.flex1]} color={theme.textSupporting}/>
                        </react_native_1.View>)}
                    {cameraPermissionStatus === react_native_permissions_1.RESULTS.GRANTED && device != null && (<react_native_1.View style={[styles.cameraView]}>
                            <react_native_gesture_handler_1.GestureDetector gesture={tapGesture}>
                                <react_native_1.View style={styles.flex1}>
                                    <Camera_1.default key={cameraKey} ref={camera} device={device} style={styles.flex1} zoom={device.neutralZoom} photo cameraTabIndex={1} onLayout={(e) => (viewfinderLayout.current = e.nativeEvent.layout)}/>
                                    <react_native_reanimated_1.default.View style={[styles.cameraFocusIndicator, cameraFocusIndicatorAnimatedStyle]}/>
                                    {canUseMultiScan ? (<react_native_1.View style={[styles.flashButtonContainer, styles.primaryMediumIcon, flash && styles.bgGreenSuccess, !hasFlash && styles.opacity0]}>
                                            <PressableWithFeedback_1.default role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('receipt.flash')} disabled={cameraPermissionStatus !== react_native_permissions_1.RESULTS.GRANTED || !hasFlash} onPress={() => setFlash((prevFlash) => !prevFlash)}>
                                                <Icon_1.default height={16} width={16} src={Expensicons.Bolt} fill={flash ? theme.white : theme.icon}/>
                                            </PressableWithFeedback_1.default>
                                        </react_native_1.View>) : null}
                                    <react_native_reanimated_1.default.View pointerEvents="none" style={[react_native_1.StyleSheet.absoluteFillObject, styles.backgroundWhite, blinkStyle, styles.zIndex10]}/>
                                </react_native_1.View>
                            </react_native_gesture_handler_1.GestureDetector>
                        </react_native_1.View>)}
                </react_native_1.View>
                {shouldShowMultiScanEducationalPopup && (<FeatureTrainingModal_1.default title={translate('iou.scanMultipleReceipts')} image={educational_illustration__multi_scan_svg_1.default} shouldRenderSVG imageHeight={220} modalInnerContainerStyle={styles.pt0} illustrationOuterContainerStyle={styles.multiScanEducationalPopupImage} onConfirm={dismissMultiScanEducationalPopup} titleStyles={styles.mb2} confirmText={translate('common.buttonConfirm')} description={translate('iou.scanMultipleReceiptsDescription')} contentInnerContainerStyles={styles.mb6} shouldGoBack={false}/>)}
                <react_native_1.View style={[styles.flexRow, styles.justifyContentAround, styles.alignItemsCenter, styles.pv3]}>
                    <AttachmentPicker_1.default onOpenPicker={() => setIsLoaderVisible(true)} fileLimit={shouldAcceptMultipleFiles ? CONST_1.default.API_ATTACHMENT_VALIDATIONS.MAX_FILE_LIMIT : 1} shouldValidateImage={false}>
                        {({ openPicker }) => (<PressableWithFeedback_1.default role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('receipt.gallery')} style={[styles.alignItemsStart, isMultiScanEnabled && styles.opacity0]} onPress={() => {
                openPicker({
                    onPicked: (data) => validateFiles(data),
                    onCanceled: () => setIsLoaderVisible(false),
                    // makes sure the loader is not visible anymore e.g. when there is an error while uploading a file
                    onClosed: () => {
                        setIsLoaderVisible(false);
                    },
                });
            }}>
                                <Icon_1.default height={32} width={32} src={Expensicons.Gallery} fill={theme.textSupporting}/>
                            </PressableWithFeedback_1.default>)}
                    </AttachmentPicker_1.default>
                    <PressableWithFeedback_1.default role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('receipt.shutter')} style={[styles.alignItemsCenter]} onPress={capturePhoto}>
                        <ImageSVG_1.default contentFit="contain" src={shutter_svg_1.default} width={CONST_1.default.RECEIPT.SHUTTER_SIZE} height={CONST_1.default.RECEIPT.SHUTTER_SIZE}/>
                    </PressableWithFeedback_1.default>
                    {canUseMultiScan ? (<PressableWithFeedback_1.default accessibilityRole="button" role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('receipt.multiScan')} style={styles.alignItemsEnd} onPress={toggleMultiScan}>
                            <Icon_1.default height={32} width={32} src={Expensicons.ReceiptMultiple} fill={isMultiScanEnabled ? theme.iconMenu : theme.textSupporting}/>
                        </PressableWithFeedback_1.default>) : (<PressableWithFeedback_1.default role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('receipt.flash')} style={[styles.alignItemsEnd, !hasFlash && styles.opacity0]} disabled={cameraPermissionStatus !== react_native_permissions_1.RESULTS.GRANTED || !hasFlash} onPress={() => setFlash((prevFlash) => !prevFlash)}>
                            <Icon_1.default height={32} width={32} src={flash ? Expensicons.Bolt : Expensicons.boltSlash} fill={theme.textSupporting}/>
                        </PressableWithFeedback_1.default>)}
                </react_native_1.View>

                {canUseMultiScan && (<ReceiptPreviews_1.default isMultiScanEnabled={isMultiScanEnabled} submit={submitReceipts}/>)}

                {startLocationPermissionFlow && !!receiptFiles.length && (<LocationPermissionModal_1.default startPermissionFlow={startLocationPermissionFlow} resetPermissionFlow={() => setStartLocationPermissionFlow(false)} onGrant={() => navigateToConfirmationStep(receiptFiles, true)} onDeny={() => {
                (0, IOU_1.updateLastLocationPermissionPrompt)();
                navigateToConfirmationStep(receiptFiles, false);
            }}/>)}
                {ErrorModal}
            </react_native_1.View>
        </StepScreenWrapper_1.default>);
}
IOURequestStepScan.displayName = 'IOURequestStepScan';
const IOURequestStepScanWithOnyx = IOURequestStepScan;
const IOURequestStepScanWithCurrentUserPersonalDetails = (0, withCurrentUserPersonalDetails_1.default)(IOURequestStepScanWithOnyx);
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepScanWithWritableReportOrNotFound = (0, withWritableReportOrNotFound_1.default)(IOURequestStepScanWithCurrentUserPersonalDetails, true);
// eslint-disable-next-line rulesdir/no-negated-variables
const IOURequestStepScanWithFullTransactionOrNotFound = (0, withFullTransactionOrNotFound_1.default)(IOURequestStepScanWithWritableReportOrNotFound);
exports.default = IOURequestStepScanWithFullTransactionOrNotFound;
