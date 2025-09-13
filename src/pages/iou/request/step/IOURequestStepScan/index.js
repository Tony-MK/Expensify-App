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
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_permissions_1 = require("react-native-permissions");
var react_native_reanimated_1 = require("react-native-reanimated");
var educational_illustration__multi_scan_svg_1 = require("@assets/images/educational-illustration__multi-scan.svg");
var fake_receipt_png_1 = require("@assets/images/fake-receipt.png");
var hand_svg_1 = require("@assets/images/hand.svg");
var receipt_upload_svg_1 = require("@assets/images/receipt-upload.svg");
var shutter_svg_1 = require("@assets/images/shutter.svg");
var AttachmentPicker_1 = require("@components/AttachmentPicker");
var Button_1 = require("@components/Button");
var CopyTextToClipboard_1 = require("@components/CopyTextToClipboard");
var DownloadAppBanner_1 = require("@components/DownloadAppBanner");
var Consumer_1 = require("@components/DragAndDrop/Consumer");
var Provider_1 = require("@components/DragAndDrop/Provider");
var DropZoneUI_1 = require("@components/DropZone/DropZoneUI");
var FeatureTrainingModal_1 = require("@components/FeatureTrainingModal");
var Icon_1 = require("@components/Icon");
var Expensicons = require("@components/Icon/Expensicons");
var LocationPermissionModal_1 = require("@components/LocationPermissionModal");
var PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
var Text_1 = require("@components/Text");
var TextLink_1 = require("@components/TextLink");
var withCurrentUserPersonalDetails_1 = require("@components/withCurrentUserPersonalDetails");
var useFilesValidation_1 = require("@hooks/useFilesValidation");
var useIOUUtils_1 = require("@hooks/useIOUUtils");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var usePermissions_1 = require("@hooks/usePermissions");
var usePolicy_1 = require("@hooks/usePolicy");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var setTestReceipt_1 = require("@libs/actions/setTestReceipt");
var UserLocation_1 = require("@libs/actions/UserLocation");
var Welcome_1 = require("@libs/actions/Welcome");
var Browser_1 = require("@libs/Browser");
var FileUtils_1 = require("@libs/fileDownload/FileUtils");
var getCurrentPosition_1 = require("@libs/getCurrentPosition");
var IOUUtils_1 = require("@libs/IOUUtils");
var Log_1 = require("@libs/Log");
var Navigation_1 = require("@libs/Navigation/Navigation");
var OptionsListUtils_1 = require("@libs/OptionsListUtils");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
var TransactionUtils_1 = require("@libs/TransactionUtils");
var StepScreenDragAndDropWrapper_1 = require("@pages/iou/request/step/StepScreenDragAndDropWrapper");
var withFullTransactionOrNotFound_1 = require("@pages/iou/request/step/withFullTransactionOrNotFound");
var withWritableReportOrNotFound_1 = require("@pages/iou/request/step/withWritableReportOrNotFound");
var IOU_1 = require("@userActions/IOU");
var TransactionEdit_1 = require("@userActions/TransactionEdit");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
var cropImageToAspectRatio_1 = require("./cropImageToAspectRatio");
var LocationPermission_1 = require("./LocationPermission");
var WebCamera_1 = require("./NavigationAwareCamera/WebCamera");
var ReceiptPreviews_1 = require("./ReceiptPreviews");
function IOURequestStepScan(_a) {
    var _b, _c;
    var report = _a.report, _d = _a.route.params, action = _d.action, iouType = _d.iouType, reportID = _d.reportID, initialTransactionID = _d.transactionID, backTo = _d.backTo, backToReport = _d.backToReport, initialTransaction = _a.transaction, currentUserPersonalDetails = _a.currentUserPersonalDetails, onLayout = _a.onLayout, _e = _a.isMultiScanEnabled, isMultiScanEnabled = _e === void 0 ? false : _e, setIsMultiScanEnabled = _a.setIsMultiScanEnabled;
    var theme = (0, useTheme_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    var _f = (0, react_1.useState)(false), startLocationPermissionFlow = _f[0], setStartLocationPermissionFlow = _f[1];
    var _g = (0, react_1.useState)([]), receiptFiles = _g[0], setReceiptFiles = _g[1];
    // we need to use isSmallScreenWidth instead of shouldUseNarrowLayout because drag and drop is not supported on mobile
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    var isSmallScreenWidth = (0, useResponsiveLayout_1.default)().isSmallScreenWidth;
    var translate = (0, useLocalize_1.default)().translate;
    var isBetaEnabled = (0, usePermissions_1.default)().isBetaEnabled;
    var isDraggingOver = (0, react_1.useContext)(Provider_1.DragAndDropContext).isDraggingOver;
    var _h = (0, react_1.useState)('prompt'), cameraPermissionState = _h[0], setCameraPermissionState = _h[1];
    var _j = (0, react_1.useReducer)(function (state) { return !state; }, false), isFlashLightOn = _j[0], toggleFlashlight = _j[1];
    var _k = (0, react_1.useState)(false), isTorchAvailable = _k[0], setIsTorchAvailable = _k[1];
    var cameraRef = (0, react_1.useRef)(null);
    var trackRef = (0, react_1.useRef)(null);
    var _l = (0, react_1.useState)(false), isQueriedPermissionState = _l[0], setIsQueriedPermissionState = _l[1];
    var _m = (0, react_1.useState)(false), shouldShowMultiScanEducationalPopup = _m[0], setShouldShowMultiScanEducationalPopup = _m[1];
    var getScreenshotTimeoutRef = (0, react_1.useRef)(null);
    var reportNameValuePairs = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS).concat(report === null || report === void 0 ? void 0 : report.reportID), { canBeMissing: true })[0];
    var policy = (0, usePolicy_1.default)(report === null || report === void 0 ? void 0 : report.policyID);
    var account = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true })[0];
    var personalDetails = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false })[0];
    var skipConfirmation = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.SKIP_CONFIRMATION).concat(initialTransactionID), { canBeMissing: true })[0];
    var activePolicyID = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: false })[0];
    var activePolicy = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(activePolicyID), { canBeMissing: true })[0];
    var dismissedProductTraining = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_DISMISSED_PRODUCT_TRAINING, { canBeMissing: true })[0];
    var reportAttributesDerived = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true, selector: function (val) { return val === null || val === void 0 ? void 0 : val.reports; } })[0];
    var isEditing = action === CONST_1.default.IOU.ACTION.EDIT;
    var canUseMultiScan = !isEditing && iouType !== CONST_1.default.IOU.TYPE.SPLIT && !backTo && !backToReport;
    var isReplacingReceipt = (isEditing && (0, TransactionUtils_1.hasReceipt)(initialTransaction)) || (!!(initialTransaction === null || initialTransaction === void 0 ? void 0 : initialTransaction.receipt) && !!backTo);
    var shouldStartLocationPermissionFlow = (0, useIOUUtils_1.default)().shouldStartLocationPermissionFlow;
    var shouldGenerateTransactionThreadReport = !isBetaEnabled(CONST_1.default.BETAS.NO_OPTIMISTIC_TRANSACTION_THREADS) || !(account === null || account === void 0 ? void 0 : account.shouldBlockTransactionThreadReportCreation);
    var optimisticTransactions = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT, {
        selector: function (items) { return Object.values(items !== null && items !== void 0 ? items : {}); },
        canBeMissing: true,
    })[0];
    var transactions = (0, react_1.useMemo)(function () {
        var allTransactions = optimisticTransactions && optimisticTransactions.length > 1 ? optimisticTransactions : [initialTransaction];
        return allTransactions.filter(function (transaction) { return !!transaction; });
    }, [initialTransaction, optimisticTransactions]);
    var _o = (0, react_1.useState)(), videoConstraints = _o[0], setVideoConstraints = _o[1];
    var isTabActive = (0, native_1.useIsFocused)();
    var defaultTaxCode = (0, TransactionUtils_1.getDefaultTaxCode)(policy, initialTransaction);
    var transactionTaxCode = (_b = ((initialTransaction === null || initialTransaction === void 0 ? void 0 : initialTransaction.taxCode) ? initialTransaction === null || initialTransaction === void 0 ? void 0 : initialTransaction.taxCode : defaultTaxCode)) !== null && _b !== void 0 ? _b : '';
    var transactionTaxAmount = (_c = initialTransaction === null || initialTransaction === void 0 ? void 0 : initialTransaction.taxAmount) !== null && _c !== void 0 ? _c : 0;
    var shouldAcceptMultipleFiles = !isEditing && !backTo;
    var selfDMReportID = (0, react_1.useMemo)(function () { return (0, ReportUtils_1.findSelfDMReportID)(); }, []);
    var blinkOpacity = (0, react_native_reanimated_1.useSharedValue)(0);
    var blinkStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        opacity: blinkOpacity.get(),
    }); });
    var showBlink = (0, react_1.useCallback)(function () {
        blinkOpacity.set((0, react_native_reanimated_1.withTiming)(0.4, { duration: 10 }, function () {
            blinkOpacity.set((0, react_native_reanimated_1.withTiming)(0, { duration: 50 }));
        }));
    }, [blinkOpacity]);
    // For quick button actions, we'll skip the confirmation page unless the report is archived or this is a workspace
    // request and the workspace requires a category or a tag
    var shouldSkipConfirmation = (0, react_1.useMemo)(function () {
        var _a, _b;
        if (!skipConfirmation || !(report === null || report === void 0 ? void 0 : report.reportID)) {
            return false;
        }
        return !(0, ReportUtils_1.isArchivedReport)(reportNameValuePairs) && !((0, ReportUtils_1.isPolicyExpenseChat)(report) && (((_a = policy === null || policy === void 0 ? void 0 : policy.requiresCategory) !== null && _a !== void 0 ? _a : false) || ((_b = policy === null || policy === void 0 ? void 0 : policy.requiresTag) !== null && _b !== void 0 ? _b : false)));
    }, [report, skipConfirmation, policy, reportNameValuePairs]);
    /**
     * On phones that have ultra-wide lens, react-webcam uses ultra-wide by default.
     * The last deviceId is of regular len camera.
     */
    var requestCameraPermission = (0, react_1.useCallback)(function () {
        if (!(0, Browser_1.isMobile)()) {
            return;
        }
        var defaultConstraints = { facingMode: { exact: 'environment' } };
        navigator.mediaDevices
            .getUserMedia({ video: { facingMode: { exact: 'environment' }, zoom: { ideal: 1 } } })
            .then(function (stream) {
            setCameraPermissionState('granted');
            stream.getTracks().forEach(function (track) { return track.stop(); });
            // Only Safari 17+ supports zoom constraint
            if ((0, Browser_1.isMobileWebKit)() && stream.getTracks().length > 0) {
                var deviceId = void 0;
                for (var _i = 0, _a = stream.getTracks(); _i < _a.length; _i++) {
                    var track = _a[_i];
                    var setting = track.getSettings();
                    if (setting.zoom === 1) {
                        deviceId = setting.deviceId;
                        break;
                    }
                }
                if (deviceId) {
                    setVideoConstraints({ deviceId: deviceId });
                    return;
                }
            }
            if (!navigator.mediaDevices.enumerateDevices) {
                setVideoConstraints(defaultConstraints);
                return;
            }
            navigator.mediaDevices.enumerateDevices().then(function (devices) {
                var lastBackDeviceId = '';
                for (var i = devices.length - 1; i >= 0; i--) {
                    var device = devices.at(i);
                    if ((device === null || device === void 0 ? void 0 : device.kind) === 'videoinput') {
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
            .catch(function () {
            setVideoConstraints(defaultConstraints);
            setCameraPermissionState('denied');
        });
    }, []);
    // When the component mounts, if there is a receipt, see if the image can be read from the disk. If not, make the user star scanning flow from scratch.
    // This is because until the request is saved, the receipt file is only stored in the browsers memory as a blob:// and if the browser is refreshed, then
    // the image ceases to exist. The best way for the user to recover from this is to start over from the start of the request process.
    (0, react_1.useEffect)(function () {
        var isAllScanFilesCanBeRead = true;
        Promise.all(transactions.map(function (item) {
            var _a, _b;
            var itemReceiptPath = (_a = item.receipt) === null || _a === void 0 ? void 0 : _a.source;
            var isLocalFile = (0, FileUtils_1.isLocalFile)(itemReceiptPath);
            if (!isLocalFile) {
                return;
            }
            var onFailure = function () {
                isAllScanFilesCanBeRead = false;
            };
            return (0, IOU_1.checkIfScanFileCanBeRead)(item.filename, itemReceiptPath, (_b = item.receipt) === null || _b === void 0 ? void 0 : _b.type, function () { }, onFailure);
        })).then(function () {
            if (isAllScanFilesCanBeRead) {
                return;
            }
            setIsMultiScanEnabled === null || setIsMultiScanEnabled === void 0 ? void 0 : setIsMultiScanEnabled(false);
            (0, TransactionEdit_1.removeTransactionReceipt)(CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID);
            (0, TransactionEdit_1.removeDraftTransactions)(true);
        });
        // We want this hook to run on mounting only
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    (0, react_1.useEffect)(function () {
        if (!(0, Browser_1.isMobile)() || !isTabActive) {
            setVideoConstraints(undefined);
            return;
        }
        navigator.permissions
            .query({
            name: 'camera',
        })
            .then(function (permissionState) {
            setCameraPermissionState(permissionState.state);
            if (permissionState.state === 'granted') {
                requestCameraPermission();
            }
        })
            .catch(function () {
            setCameraPermissionState('denied');
        })
            .finally(function () {
            setIsQueriedPermissionState(true);
        });
        // We only want to get the camera permission status when the component is mounted
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isTabActive]);
    // this effect will pre-fetch location in web and desktop if the location permission is already granted to optimize the flow
    (0, react_1.useEffect)(function () {
        var gpsRequired = (initialTransaction === null || initialTransaction === void 0 ? void 0 : initialTransaction.amount) === 0 && iouType !== CONST_1.default.IOU.TYPE.SPLIT;
        if (!gpsRequired) {
            return;
        }
        (0, LocationPermission_1.getLocationPermission)().then(function (status) {
            if (status !== react_native_permissions_1.RESULTS.GRANTED && status !== react_native_permissions_1.RESULTS.LIMITED) {
                return;
            }
            (0, UserLocation_1.clearUserLocation)();
            (0, getCurrentPosition_1.default)(function (successData) {
                (0, UserLocation_1.setUserLocation)({ longitude: successData.coords.longitude, latitude: successData.coords.latitude });
            }, function () { }, {
                maximumAge: CONST_1.default.GPS.MAX_AGE,
                timeout: CONST_1.default.GPS.TIMEOUT,
            });
        });
    }, [initialTransaction === null || initialTransaction === void 0 ? void 0 : initialTransaction.amount, iouType]);
    (0, react_1.useEffect)(function () {
        if (isMultiScanEnabled) {
            return;
        }
        setReceiptFiles([]);
    }, [isMultiScanEnabled]);
    var navigateBack = (0, react_1.useCallback)(function () {
        Navigation_1.default.goBack(backTo);
    }, [backTo]);
    var navigateToConfirmationPage = (0, react_1.useCallback)(function (shouldNavigateToSubmit, reportIDParam) {
        if (shouldNavigateToSubmit === void 0) { shouldNavigateToSubmit = false; }
        if (reportIDParam === void 0) { reportIDParam = undefined; }
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
    var createTransaction = (0, react_1.useCallback)(function (files, participant, gpsPoints, policyParams, billable, reimbursable) {
        if (reimbursable === void 0) { reimbursable = true; }
        files.forEach(function (receiptFile, index) {
            var _a, _b, _c, _d, _e;
            var transaction = transactions.find(function (item) { return item.transactionID === receiptFile.transactionID; });
            var receipt = (_a = receiptFile.file) !== null && _a !== void 0 ? _a : {};
            receipt.source = receiptFile.source;
            receipt.state = CONST_1.default.IOU.RECEIPT_STATE.SCAN_READY;
            if (iouType === CONST_1.default.IOU.TYPE.TRACK && report) {
                (0, IOU_1.trackExpense)(__assign(__assign({ report: report, isDraftPolicy: false, participantParams: {
                        payeeEmail: currentUserPersonalDetails.login,
                        payeeAccountID: currentUserPersonalDetails.accountID,
                        participant: participant,
                    }, transactionParams: __assign({ amount: 0, currency: (_b = transaction === null || transaction === void 0 ? void 0 : transaction.currency) !== null && _b !== void 0 ? _b : 'USD', created: transaction === null || transaction === void 0 ? void 0 : transaction.created, receipt: receipt, billable: billable, reimbursable: reimbursable }, (gpsPoints !== null && gpsPoints !== void 0 ? gpsPoints : {})) }, (policyParams !== null && policyParams !== void 0 ? policyParams : {})), { shouldHandleNavigation: index === files.length - 1 }));
            }
            else {
                (0, IOU_1.requestMoney)(__assign(__assign(__assign({ report: report, participantParams: {
                        payeeEmail: currentUserPersonalDetails.login,
                        payeeAccountID: currentUserPersonalDetails.accountID,
                        participant: participant,
                    } }, (policyParams !== null && policyParams !== void 0 ? policyParams : {})), (gpsPoints !== null && gpsPoints !== void 0 ? gpsPoints : {})), { transactionParams: {
                        amount: 0,
                        attendees: (_c = transaction === null || transaction === void 0 ? void 0 : transaction.comment) === null || _c === void 0 ? void 0 : _c.attendees,
                        currency: (_d = transaction === null || transaction === void 0 ? void 0 : transaction.currency) !== null && _d !== void 0 ? _d : 'USD',
                        created: (_e = transaction === null || transaction === void 0 ? void 0 : transaction.created) !== null && _e !== void 0 ? _e : '',
                        merchant: '',
                        receipt: receipt,
                        billable: billable,
                        reimbursable: reimbursable,
                    }, shouldHandleNavigation: index === files.length - 1, backToReport: backToReport, shouldGenerateTransactionThreadReport: shouldGenerateTransactionThreadReport }));
            }
        });
    }, [backToReport, currentUserPersonalDetails.accountID, currentUserPersonalDetails.login, iouType, report, transactions, shouldGenerateTransactionThreadReport]);
    var navigateToConfirmationStep = (0, react_1.useCallback)(function (files, locationPermissionGranted, isTestTransaction) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (locationPermissionGranted === void 0) { locationPermissionGranted = false; }
        if (isTestTransaction === void 0) { isTestTransaction = false; }
        if (backTo) {
            Navigation_1.default.goBack(backTo);
            return;
        }
        if (isTestTransaction) {
            var managerMcTestParticipant = (_a = (0, OptionsListUtils_1.getManagerMcTestParticipant)()) !== null && _a !== void 0 ? _a : {};
            var reportIDParam_1 = managerMcTestParticipant.reportID;
            if (!managerMcTestParticipant.reportID && (report === null || report === void 0 ? void 0 : report.reportID)) {
                reportIDParam_1 = (0, ReportUtils_1.generateReportID)();
            }
            (0, IOU_1.setMoneyRequestParticipants)(initialTransactionID, [
                __assign(__assign({}, managerMcTestParticipant), { reportID: reportIDParam_1, selected: true }),
            ], true).then(function () {
                navigateToConfirmationPage(true, reportIDParam_1);
            });
            return;
        }
        // If a reportID exists in the report object, it's because either:
        // - The user started this flow from using the + button in the composer inside a report.
        // - The user started this flow from using the global create menu by selecting the Track expense option.
        // In this case, the participants can be automatically assigned from the report and the user can skip the participants step and go straight
        // to the confirm step.
        // If the user is started this flow using the Create expense option (combined submit/track flow), they should be redirected to the participants page.
        if ((report === null || report === void 0 ? void 0 : report.reportID) && !(0, ReportUtils_1.isArchivedReport)(reportNameValuePairs) && iouType !== CONST_1.default.IOU.TYPE.CREATE) {
            var selectedParticipants = (0, IOU_1.getMoneyRequestParticipantsFromReport)(report);
            var participants = selectedParticipants.map(function (participant) {
                var _a;
                var participantAccountID = (_a = participant === null || participant === void 0 ? void 0 : participant.accountID) !== null && _a !== void 0 ? _a : CONST_1.default.DEFAULT_NUMBER_ID;
                return participantAccountID ? (0, OptionsListUtils_1.getParticipantsOption)(participant, personalDetails) : (0, OptionsListUtils_1.getReportOption)(participant, reportAttributesDerived);
            });
            if (shouldSkipConfirmation) {
                var firstReceiptFile = files.at(0);
                if (iouType === CONST_1.default.IOU.TYPE.SPLIT && firstReceiptFile) {
                    var splitReceipt = (_b = firstReceiptFile.file) !== null && _b !== void 0 ? _b : {};
                    splitReceipt.source = firstReceiptFile.source;
                    splitReceipt.state = CONST_1.default.IOU.RECEIPT_STATE.SCAN_READY;
                    (0, IOU_1.startSplitBill)({
                        participants: participants,
                        currentUserLogin: (_c = currentUserPersonalDetails === null || currentUserPersonalDetails === void 0 ? void 0 : currentUserPersonalDetails.login) !== null && _c !== void 0 ? _c : '',
                        currentUserAccountID: currentUserPersonalDetails.accountID,
                        comment: '',
                        receipt: splitReceipt,
                        existingSplitChatReportID: reportID,
                        billable: false,
                        category: '',
                        tag: '',
                        currency: (_d = initialTransaction === null || initialTransaction === void 0 ? void 0 : initialTransaction.currency) !== null && _d !== void 0 ? _d : 'USD',
                        taxCode: transactionTaxCode,
                        taxAmount: transactionTaxAmount,
                    });
                    return;
                }
                var participant_1 = participants.at(0);
                if (!participant_1) {
                    return;
                }
                if (locationPermissionGranted) {
                    (0, getCurrentPosition_1.default)(function (successData) {
                        var policyParams = { policy: policy };
                        var gpsPoints = {
                            lat: successData.coords.latitude,
                            long: successData.coords.longitude,
                        };
                        createTransaction(files, participant_1, gpsPoints, policyParams, false, true);
                    }, function (errorData) {
                        Log_1.default.info('[IOURequestStepScan] getCurrentPosition failed', false, errorData);
                        // When there is an error, the money can still be requested, it just won't include the GPS coordinates
                        createTransaction(files, participant_1);
                    }, {
                        maximumAge: CONST_1.default.GPS.MAX_AGE,
                        timeout: CONST_1.default.GPS.TIMEOUT,
                    });
                    return;
                }
                createTransaction(files, participant_1);
                return;
            }
            var transactionIDs = files.map(function (receiptFile) { return receiptFile.transactionID; });
            (0, IOU_1.setMultipleMoneyRequestParticipantsFromReport)(transactionIDs, report).then(function () { return navigateToConfirmationPage(); });
            return;
        }
        // If there was no reportID, then that means the user started this flow from the global + menu
        // and an optimistic reportID was generated. In that case, the next step is to select the participants for this expense.
        if (iouType === CONST_1.default.IOU.TYPE.CREATE && (0, PolicyUtils_1.isPaidGroupPolicy)(activePolicy) && (activePolicy === null || activePolicy === void 0 ? void 0 : activePolicy.isPolicyExpenseChatEnabled) && !(0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(activePolicy.id)) {
            var activePolicyExpenseChat_1 = (0, ReportUtils_1.getPolicyExpenseChat)(currentUserPersonalDetails.accountID, activePolicy === null || activePolicy === void 0 ? void 0 : activePolicy.id);
            // If the initial transaction has different participants selected that means that the user has changed the participant in the confirmation step
            if ((initialTransaction === null || initialTransaction === void 0 ? void 0 : initialTransaction.participants) && ((_f = (_e = initialTransaction === null || initialTransaction === void 0 ? void 0 : initialTransaction.participants) === null || _e === void 0 ? void 0 : _e.at(0)) === null || _f === void 0 ? void 0 : _f.reportID) !== (activePolicyExpenseChat_1 === null || activePolicyExpenseChat_1 === void 0 ? void 0 : activePolicyExpenseChat_1.reportID)) {
                var isTrackExpense_1 = ((_h = (_g = initialTransaction === null || initialTransaction === void 0 ? void 0 : initialTransaction.participants) === null || _g === void 0 ? void 0 : _g.at(0)) === null || _h === void 0 ? void 0 : _h.reportID) === selfDMReportID;
                var setParticipantsPromises_1 = files.map(function (receiptFile) { return (0, IOU_1.setMoneyRequestParticipants)(receiptFile.transactionID, initialTransaction === null || initialTransaction === void 0 ? void 0 : initialTransaction.participants); });
                Promise.all(setParticipantsPromises_1).then(function () {
                    if (isTrackExpense_1) {
                        Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, CONST_1.default.IOU.TYPE.TRACK, initialTransactionID, selfDMReportID));
                    }
                    else {
                        navigateToConfirmationPage(iouType === CONST_1.default.IOU.TYPE.CREATE, initialTransaction === null || initialTransaction === void 0 ? void 0 : initialTransaction.reportID);
                    }
                });
                return;
            }
            var setParticipantsPromises = files.map(function (receiptFile) { return (0, IOU_1.setMoneyRequestParticipantsFromReport)(receiptFile.transactionID, activePolicyExpenseChat_1); });
            Promise.all(setParticipantsPromises).then(function () {
                return Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_CONFIRMATION.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType === CONST_1.default.IOU.TYPE.CREATE ? CONST_1.default.IOU.TYPE.SUBMIT : iouType, initialTransactionID, activePolicyExpenseChat_1 === null || activePolicyExpenseChat_1 === void 0 ? void 0 : activePolicyExpenseChat_1.reportID));
            });
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
        currentUserPersonalDetails === null || currentUserPersonalDetails === void 0 ? void 0 : currentUserPersonalDetails.login,
        currentUserPersonalDetails.accountID,
        reportID,
        initialTransaction === null || initialTransaction === void 0 ? void 0 : initialTransaction.currency,
        initialTransaction === null || initialTransaction === void 0 ? void 0 : initialTransaction.participants,
        initialTransaction === null || initialTransaction === void 0 ? void 0 : initialTransaction.reportID,
        transactionTaxCode,
        transactionTaxAmount,
        policy,
        selfDMReportID,
    ]);
    var updateScanAndNavigate = (0, react_1.useCallback)(function (file, source) {
        (0, IOU_1.replaceReceipt)({ transactionID: initialTransactionID, file: file, source: source });
        navigateBack();
    }, [initialTransactionID, navigateBack]);
    var setReceiptFilesAndNavigate = function (files) {
        if (files.length === 0) {
            return;
        }
        // Store the receipt on the transaction object in Onyx
        var newReceiptFiles = [];
        if (isEditing) {
            var file = files.at(0);
            if (!file) {
                return;
            }
            var source = URL.createObjectURL(file);
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            (0, IOU_1.setMoneyRequestReceipt)(initialTransactionID, source, file.name || '', !isEditing);
            updateScanAndNavigate(file, source);
            return;
        }
        files.forEach(function (file, index) {
            var _a, _b;
            var source = URL.createObjectURL(file);
            var transaction = !shouldAcceptMultipleFiles || (index === 0 && transactions.length === 1 && !((_a = initialTransaction === null || initialTransaction === void 0 ? void 0 : initialTransaction.receipt) === null || _a === void 0 ? void 0 : _a.source))
                ? initialTransaction
                : (0, TransactionEdit_1.buildOptimisticTransactionAndCreateDraft)({
                    initialTransaction: initialTransaction,
                    currentUserPersonalDetails: currentUserPersonalDetails,
                    reportID: reportID,
                });
            var transactionID = (_b = transaction.transactionID) !== null && _b !== void 0 ? _b : initialTransactionID;
            newReceiptFiles.push({ file: file, source: source, transactionID: transactionID });
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            (0, IOU_1.setMoneyRequestReceipt)(transactionID, source, file.name || '', true);
        });
        if (shouldSkipConfirmation) {
            setReceiptFiles(newReceiptFiles);
            var gpsRequired = (initialTransaction === null || initialTransaction === void 0 ? void 0 : initialTransaction.amount) === 0 && iouType !== CONST_1.default.IOU.TYPE.SPLIT && files.length;
            if (gpsRequired) {
                var beginLocationPermissionFlow = shouldStartLocationPermissionFlow();
                if (beginLocationPermissionFlow) {
                    setStartLocationPermissionFlow(true);
                    return;
                }
            }
        }
        navigateToConfirmationStep(newReceiptFiles, false);
    };
    var _p = (0, useFilesValidation_1.default)(setReceiptFilesAndNavigate), validateFiles = _p.validateFiles, PDFValidationComponent = _p.PDFValidationComponent, ErrorModal = _p.ErrorModal;
    var handleDropReceipt = function (e) {
        var _a, _b, _c, _d;
        var files = Array.from((_b = (_a = e === null || e === void 0 ? void 0 : e.dataTransfer) === null || _a === void 0 ? void 0 : _a.files) !== null && _b !== void 0 ? _b : []);
        if (files.length === 0) {
            return;
        }
        files.forEach(function (file) {
            // eslint-disable-next-line no-param-reassign
            file.uri = URL.createObjectURL(file);
        });
        validateFiles(files, Array.from((_d = (_c = e.dataTransfer) === null || _c === void 0 ? void 0 : _c.items) !== null && _d !== void 0 ? _d : []));
    };
    /**
     * Sets a test receipt from CONST.TEST_RECEIPT_URL and navigates to the confirmation step
     */
    var setTestReceiptAndNavigate = (0, react_1.useCallback)(function () {
        (0, setTestReceipt_1.default)(fake_receipt_png_1.default, 'png', function (source, file, filename) {
            (0, IOU_1.setMoneyRequestReceipt)(initialTransactionID, source, filename, !isEditing, CONST_1.default.TEST_RECEIPT.FILE_TYPE, true);
            navigateToConfirmationStep([{ file: file, source: source, transactionID: initialTransactionID }], false, true);
        });
    }, [initialTransactionID, isEditing, navigateToConfirmationStep]);
    var setupCameraPermissionsAndCapabilities = function (stream) {
        setCameraPermissionState('granted');
        var track = stream.getVideoTracks()[0];
        var capabilities = track.getCapabilities();
        if ('torch' in capabilities && capabilities.torch) {
            trackRef.current = track;
        }
        setIsTorchAvailable('torch' in capabilities && !!capabilities.torch);
    };
    var submitReceipts = (0, react_1.useCallback)(function (files) {
        if (shouldSkipConfirmation) {
            var gpsRequired = (initialTransaction === null || initialTransaction === void 0 ? void 0 : initialTransaction.amount) === 0 && iouType !== CONST_1.default.IOU.TYPE.SPLIT;
            if (gpsRequired) {
                var beginLocationPermissionFlow = shouldStartLocationPermissionFlow();
                if (beginLocationPermissionFlow) {
                    setStartLocationPermissionFlow(true);
                    return;
                }
            }
        }
        navigateToConfirmationStep(files, false);
    }, [initialTransaction, iouType, shouldStartLocationPermissionFlow, navigateToConfirmationStep, shouldSkipConfirmation]);
    var viewfinderLayout = (0, react_1.useRef)(null);
    var getScreenshot = (0, react_1.useCallback)(function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (!cameraRef.current) {
            requestCameraPermission();
            return;
        }
        var imageBase64 = cameraRef.current.getScreenshot();
        if (imageBase64 === null) {
            return;
        }
        if (isMultiScanEnabled) {
            showBlink();
        }
        var originalFileName = "receipt_".concat(Date.now(), ".png");
        var originalFile = (0, FileUtils_1.base64ToFile)(imageBase64 !== null && imageBase64 !== void 0 ? imageBase64 : '', originalFileName);
        var imageObject = { file: originalFile, filename: originalFile.name, source: URL.createObjectURL(originalFile) };
        // Some browsers center-crop the viewfinder inside the video element (due to object-position: center),
        // while other browsers let the video element overflow and the container crops it from the top.
        // We crop and algin the result image the same way.
        var videoHeight = (_d = (_c = (_b = (_a = cameraRef.current.video) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect) === null || _b === void 0 ? void 0 : _b.call(_a)) === null || _c === void 0 ? void 0 : _c.height) !== null && _d !== void 0 ? _d : NaN;
        var viewFinderHeight = (_f = (_e = viewfinderLayout.current) === null || _e === void 0 ? void 0 : _e.height) !== null && _f !== void 0 ? _f : NaN;
        var shouldAlignTop = videoHeight > viewFinderHeight;
        (0, cropImageToAspectRatio_1.cropImageToAspectRatio)(imageObject, (_g = viewfinderLayout.current) === null || _g === void 0 ? void 0 : _g.width, (_h = viewfinderLayout.current) === null || _h === void 0 ? void 0 : _h.height, shouldAlignTop).then(function (_a) {
            var _b, _c;
            var file = _a.file, filename = _a.filename, source = _a.source;
            var transaction = isMultiScanEnabled && ((_b = initialTransaction === null || initialTransaction === void 0 ? void 0 : initialTransaction.receipt) === null || _b === void 0 ? void 0 : _b.source)
                ? (0, TransactionEdit_1.buildOptimisticTransactionAndCreateDraft)({
                    initialTransaction: initialTransaction,
                    currentUserPersonalDetails: currentUserPersonalDetails,
                    reportID: reportID,
                })
                : initialTransaction;
            var transactionID = (_c = transaction === null || transaction === void 0 ? void 0 : transaction.transactionID) !== null && _c !== void 0 ? _c : initialTransactionID;
            var newReceiptFiles = __spreadArray(__spreadArray([], receiptFiles, true), [{ file: file, source: source, transactionID: transactionID }], false);
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
    var toggleMultiScan = function () {
        if (!(dismissedProductTraining === null || dismissedProductTraining === void 0 ? void 0 : dismissedProductTraining[CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.MULTI_SCAN_EDUCATIONAL_MODAL])) {
            setShouldShowMultiScanEducationalPopup(true);
        }
        if (isMultiScanEnabled) {
            (0, TransactionEdit_1.removeDraftTransactions)(true);
        }
        (0, TransactionEdit_1.removeTransactionReceipt)(CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID);
        setIsMultiScanEnabled === null || setIsMultiScanEnabled === void 0 ? void 0 : setIsMultiScanEnabled(!isMultiScanEnabled);
    };
    var clearTorchConstraints = (0, react_1.useCallback)(function () {
        if (!trackRef.current) {
            return;
        }
        trackRef.current.applyConstraints({
            advanced: [{ torch: false }],
        });
    }, []);
    var capturePhoto = (0, react_1.useCallback)(function () {
        if (trackRef.current && isFlashLightOn) {
            trackRef.current
                .applyConstraints({
                advanced: [{ torch: true }],
            })
                .then(function () {
                getScreenshotTimeoutRef.current = setTimeout(function () {
                    getScreenshot();
                    clearTorchConstraints();
                }, 2000);
            });
            return;
        }
        getScreenshot();
    }, [isFlashLightOn, getScreenshot, clearTorchConstraints]);
    var panResponder = (0, react_1.useRef)(react_native_1.PanResponder.create({
        onPanResponderTerminationRequest: function () { return false; },
    })).current;
    (0, react_1.useEffect)(function () { return function () {
        if (!getScreenshotTimeoutRef.current) {
            return;
        }
        clearTimeout(getScreenshotTimeoutRef.current);
    }; }, []);
    var dismissMultiScanEducationalPopup = function () {
        react_native_1.InteractionManager.runAfterInteractions(function () {
            (0, Welcome_1.dismissProductTraining)(CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.MULTI_SCAN_EDUCATIONAL_MODAL);
            setShouldShowMultiScanEducationalPopup(false);
        });
    };
    var mobileCameraView = function () { return (<>
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
                {cameraPermissionState === 'granted' && !(0, EmptyObject_1.isEmptyObject)(videoConstraints) && (<react_native_1.View style={styles.flex1} onLayout={function (e) { return (viewfinderLayout.current = e.nativeEvent.layout); }}>
                        <WebCamera_1.default onUserMedia={setupCameraPermissionsAndCapabilities} onUserMediaError={function () { return setCameraPermissionState('denied'); }} style={__assign(__assign({}, styles.videoContainer), { display: cameraPermissionState !== 'granted' ? 'none' : 'block' })} ref={cameraRef} screenshotFormat="image/png" videoConstraints={videoConstraints} forceScreenshotSourceSize audio={false} disablePictureInPicture={false} imageSmoothing={false} mirrored={false} screenshotQuality={0}/>
                        {canUseMultiScan && (0, Browser_1.isMobile)() ? (<react_native_1.View style={[styles.flashButtonContainer, styles.primaryMediumIcon, isFlashLightOn && styles.bgGreenSuccess, !isTorchAvailable && styles.opacity0]}>
                                <PressableWithFeedback_1.default role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('receipt.flash')} disabled={!isTorchAvailable} onPress={toggleFlashlight}>
                                    <Icon_1.default height={16} width={16} src={Expensicons.Bolt} fill={isFlashLightOn ? theme.white : theme.icon}/>
                                </PressableWithFeedback_1.default>
                            </react_native_1.View>) : null}
                        <react_native_reanimated_1.default.View pointerEvents="none" style={[react_native_1.StyleSheet.absoluteFillObject, styles.backgroundWhite, blinkStyle, styles.zIndex10]}/>
                    </react_native_1.View>)}
            </react_native_1.View>

            <react_native_1.View style={[styles.flexRow, styles.justifyContentAround, styles.alignItemsCenter, styles.pv3]}>
                <AttachmentPicker_1.default acceptedFileTypes={__spreadArray([], CONST_1.default.API_ATTACHMENT_VALIDATIONS.ALLOWED_RECEIPT_EXTENSIONS, true)} allowMultiple={shouldAcceptMultipleFiles}>
                    {function (_a) {
            var openPicker = _a.openPicker;
            return (<PressableWithFeedback_1.default accessibilityLabel={translate(shouldAcceptMultipleFiles ? 'common.chooseFiles' : 'common.chooseFile')} role={CONST_1.default.ROLE.BUTTON} style={isMultiScanEnabled && styles.opacity0} onPress={function () {
                    openPicker({
                        onPicked: function (data) { return validateFiles(data); },
                    });
                }}>
                            <Icon_1.default height={32} width={32} src={Expensicons.Gallery} fill={theme.textSupporting}/>
                        </PressableWithFeedback_1.default>);
        }}
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
        </>); };
    var _q = (0, react_1.useState)(0), containerHeight = _q[0], setContainerHeight = _q[1];
    var _r = (0, react_1.useState)(0), desktopUploadViewHeight = _r[0], setDesktopUploadViewHeight = _r[1];
    var _s = (0, react_1.useState)(0), downloadAppBannerHeight = _s[0], setDownloadAppBannerHeight = _s[1];
    /*  We use isMobile() here to explicitly hide DownloadAppBanner component on both mobile web and native apps */
    var shouldHideDownloadAppBanner = (0, Browser_1.isMobile)() || downloadAppBannerHeight + desktopUploadViewHeight + styles.uploadFileView(isSmallScreenWidth).paddingVertical * 2 > containerHeight;
    var desktopUploadView = function () { return (<react_native_1.View style={[styles.alignItemsCenter, styles.justifyContentCenter]} onLayout={function (e) {
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
                {function (_a) {
            var openPicker = _a.openPicker;
            return (<Button_1.default success text={translate(shouldAcceptMultipleFiles ? 'common.chooseFiles' : 'common.chooseFile')} accessibilityLabel={translate(shouldAcceptMultipleFiles ? 'common.chooseFiles' : 'common.chooseFile')} style={[styles.p9]} onPress={function () {
                    openPicker({
                        onPicked: function (data) { return validateFiles(data); },
                    });
                }}/>);
        }}
            </AttachmentPicker_1.default>
        </react_native_1.View>); };
    return (<StepScreenDragAndDropWrapper_1.default headerTitle={translate('common.receipt')} onBackButtonPress={navigateBack} shouldShowWrapper={!!backTo || isEditing} testID={IOURequestStepScan.displayName}>
            {function (isDraggingOverWrapper) { return (<react_native_1.View onLayout={function (event) {
                setContainerHeight(event.nativeEvent.layout.height);
                if (!onLayout) {
                    return;
                }
                onLayout(setTestReceiptAndNavigate);
            }} style={[styles.flex1, !(0, Browser_1.isMobile)() && styles.uploadFileView(isSmallScreenWidth)]}>
                    <react_native_1.View style={[styles.flex1, !(0, Browser_1.isMobile)() && styles.alignItemsCenter, styles.justifyContentCenter]}>
                        {!(isDraggingOver !== null && isDraggingOver !== void 0 ? isDraggingOver : isDraggingOverWrapper) && ((0, Browser_1.isMobile)() ? mobileCameraView() : desktopUploadView())}
                    </react_native_1.View>
                    <Consumer_1.default onDrop={handleDropReceipt}>
                        <DropZoneUI_1.default icon={isReplacingReceipt ? Expensicons.ReplaceReceipt : Expensicons.SmartScan} dropStyles={styles.receiptDropOverlay(true)} dropTitle={isReplacingReceipt ? translate('dropzone.replaceReceipt') : translate(shouldAcceptMultipleFiles ? 'dropzone.scanReceipts' : 'quickAction.scanReceipt')} dropTextStyles={styles.receiptDropText} dashedBorderStyles={styles.activeDropzoneDashedBorder(theme.receiptDropBorderColorActive, true)}/>
                    </Consumer_1.default>
                    {!shouldHideDownloadAppBanner && <DownloadAppBanner_1.default onLayout={function (e) { return setDownloadAppBannerHeight(e.nativeEvent.layout.height); }}/>}
                    {ErrorModal}
                    {startLocationPermissionFlow && !!receiptFiles.length && (<LocationPermissionModal_1.default startPermissionFlow={startLocationPermissionFlow} resetPermissionFlow={function () { return setStartLocationPermissionFlow(false); }} onGrant={function () { return navigateToConfirmationStep(receiptFiles, true); }} onDeny={function () {
                    (0, IOU_1.updateLastLocationPermissionPrompt)();
                    navigateToConfirmationStep(receiptFiles, false);
                }}/>)}
                </react_native_1.View>); }}
        </StepScreenDragAndDropWrapper_1.default>);
}
IOURequestStepScan.displayName = 'IOURequestStepScan';
var IOURequestStepScanWithOnyx = IOURequestStepScan;
var IOURequestStepScanWithCurrentUserPersonalDetails = (0, withCurrentUserPersonalDetails_1.default)(IOURequestStepScanWithOnyx);
// eslint-disable-next-line rulesdir/no-negated-variables
var IOURequestStepScanWithWritableReportOrNotFound = (0, withWritableReportOrNotFound_1.default)(IOURequestStepScanWithCurrentUserPersonalDetails, true);
// eslint-disable-next-line rulesdir/no-negated-variables
var IOURequestStepScanWithFullTransactionOrNotFound = (0, withFullTransactionOrNotFound_1.default)(IOURequestStepScanWithWritableReportOrNotFound);
exports.default = IOURequestStepScanWithFullTransactionOrNotFound;
