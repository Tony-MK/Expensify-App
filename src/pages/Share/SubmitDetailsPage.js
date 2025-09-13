"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var LocationPermissionModal_1 = require("@components/LocationPermissionModal");
var MoneyRequestConfirmationList_1 = require("@components/MoneyRequestConfirmationList");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var usePermissions_1 = require("@hooks/usePermissions");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var IOU_1 = require("@libs/actions/IOU");
var DateUtils_1 = require("@libs/DateUtils");
var FileUtils_1 = require("@libs/fileDownload/FileUtils");
var getCurrentPosition_1 = require("@libs/getCurrentPosition");
var Log_1 = require("@libs/Log");
var navigateAfterInteraction_1 = require("@libs/Navigation/navigateAfterInteraction");
var Navigation_1 = require("@libs/Navigation/Navigation");
var OptionsListUtils_1 = require("@libs/OptionsListUtils");
var ReceiptUtils_1 = require("@libs/ReceiptUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var TransactionUtils_1 = require("@libs/TransactionUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ShareRootPage_1 = require("./ShareRootPage");
function SubmitDetailsPage(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var reportOrAccountID = _a.route.params.reportOrAccountID;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var unknownUserDetails = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHARE_UNKNOWN_USER_DETAILS, { canBeMissing: true })[0];
    var personalDetails = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST), { canBeMissing: true })[0];
    var report = (0, ReportUtils_1.getReportOrDraftReport)(reportOrAccountID);
    var parentReport = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(report === null || report === void 0 ? void 0 : report.parentReportID), { canBeMissing: true })[0];
    var policy = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(report === null || report === void 0 ? void 0 : report.policyID), { canBeMissing: false })[0];
    var transaction = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT).concat(CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID), { canBeMissing: true })[0];
    var policyCategories = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES).concat((0, IOU_1.getIOURequestPolicyID)(transaction, report)), { canBeMissing: false })[0];
    var policyTags = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY_TAGS).concat((0, IOU_1.getIOURequestPolicyID)(transaction, report)), { canBeMissing: false })[0];
    var lastLocationPermissionPrompt = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_LOCATION_PERMISSION_PROMPT, { canBeMissing: false })[0];
    var account = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true })[0];
    var reportAttributesDerived = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true, selector: function (val) { return val === null || val === void 0 ? void 0 : val.reports; } })[0];
    var currentDate = (0, useOnyx_1.default)(ONYXKEYS_1.default.CURRENT_DATE, { canBeMissing: true })[0];
    var validFilesToUpload = (0, useOnyx_1.default)(ONYXKEYS_1.default.VALIDATED_FILE_OBJECT, { canBeMissing: true })[0];
    var currentAttachment = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHARE_TEMP_FILE, { canBeMissing: true })[0];
    var shouldUsePreValidatedFile = (0, ReceiptUtils_1.shouldValidateFile)(currentAttachment);
    var currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    var _p = (0, react_1.useState)(false), startLocationPermissionFlow = _p[0], setStartLocationPermissionFlow = _p[1];
    var _q = (0, react_1.useState)(undefined), errorTitle = _q[0], setErrorTitle = _q[1];
    var _r = (0, react_1.useState)(undefined), errorMessage = _r[0], setErrorMessage = _r[1];
    var isBetaEnabled = (0, usePermissions_1.default)().isBetaEnabled;
    var shouldGenerateTransactionThreadReport = !isBetaEnabled(CONST_1.default.BETAS.NO_OPTIMISTIC_TRANSACTION_THREADS) || !(account === null || account === void 0 ? void 0 : account.shouldBlockTransactionThreadReportCreation);
    var fileUri = shouldUsePreValidatedFile ? ((_b = validFilesToUpload === null || validFilesToUpload === void 0 ? void 0 : validFilesToUpload.uri) !== null && _b !== void 0 ? _b : '') : ((_c = currentAttachment === null || currentAttachment === void 0 ? void 0 : currentAttachment.content) !== null && _c !== void 0 ? _c : '');
    var fileName = shouldUsePreValidatedFile ? (0, FileUtils_1.getFileName)((_d = validFilesToUpload === null || validFilesToUpload === void 0 ? void 0 : validFilesToUpload.uri) !== null && _d !== void 0 ? _d : CONST_1.default.ATTACHMENT_IMAGE_DEFAULT_NAME) : (0, FileUtils_1.getFileName)((_e = currentAttachment === null || currentAttachment === void 0 ? void 0 : currentAttachment.content) !== null && _e !== void 0 ? _e : '');
    var fileType = shouldUsePreValidatedFile ? ((_f = validFilesToUpload === null || validFilesToUpload === void 0 ? void 0 : validFilesToUpload.type) !== null && _f !== void 0 ? _f : CONST_1.default.RECEIPT_ALLOWED_FILE_TYPES.JPEG) : ((_g = currentAttachment === null || currentAttachment === void 0 ? void 0 : currentAttachment.mimeType) !== null && _g !== void 0 ? _g : '');
    (0, react_1.useEffect)(function () {
        if (!errorTitle || !errorMessage) {
            return;
        }
        (0, ShareRootPage_1.showErrorAlert)(errorTitle, errorMessage);
    }, [errorTitle, errorMessage]);
    (0, react_1.useEffect)(function () {
        (0, IOU_1.initMoneyRequest)({
            reportID: reportOrAccountID,
            policy: policy,
            currentIouRequestType: CONST_1.default.IOU.REQUEST_TYPE.SCAN,
            newIouRequestType: CONST_1.default.IOU.REQUEST_TYPE.SCAN,
            report: report,
            parentReport: parentReport,
            currentDate: currentDate,
        });
    }, [reportOrAccountID, policy, report, parentReport, currentDate]);
    var selectedParticipants = unknownUserDetails ? [unknownUserDetails] : (0, IOU_1.getMoneyRequestParticipantsFromReport)(report);
    var participants = selectedParticipants.map(function (participant) {
        return (participant === null || participant === void 0 ? void 0 : participant.accountID) ? (0, OptionsListUtils_1.getParticipantsOption)(participant, personalDetails) : (0, OptionsListUtils_1.getReportOption)(participant, reportAttributesDerived);
    });
    var trimmedComment = (_k = (_j = (_h = transaction === null || transaction === void 0 ? void 0 : transaction.comment) === null || _h === void 0 ? void 0 : _h.comment) === null || _j === void 0 ? void 0 : _j.trim()) !== null && _k !== void 0 ? _k : '';
    var transactionAmount = (_l = transaction === null || transaction === void 0 ? void 0 : transaction.amount) !== null && _l !== void 0 ? _l : 0;
    var transactionTaxAmount = (_m = transaction === null || transaction === void 0 ? void 0 : transaction.taxAmount) !== null && _m !== void 0 ? _m : 0;
    var defaultTaxCode = (0, TransactionUtils_1.getDefaultTaxCode)(policy, transaction);
    var transactionTaxCode = (_o = ((transaction === null || transaction === void 0 ? void 0 : transaction.taxCode) ? transaction === null || transaction === void 0 ? void 0 : transaction.taxCode : defaultTaxCode)) !== null && _o !== void 0 ? _o : '';
    var finishRequestAndNavigate = function (participant, receipt, gpsPoints) {
        var _a, _b, _c;
        if (!transaction) {
            return;
        }
        if ((0, ReportUtils_1.isSelfDM)(report)) {
            (0, IOU_1.trackExpense)({
                report: report !== null && report !== void 0 ? report : { reportID: reportOrAccountID },
                isDraftPolicy: false,
                participantParams: { payeeEmail: currentUserPersonalDetails.login, payeeAccountID: currentUserPersonalDetails.accountID, participant: participant },
                policyParams: { policy: policy, policyTagList: policyTags, policyCategories: policyCategories },
                action: CONST_1.default.IOU.TYPE.CREATE,
                transactionParams: {
                    amount: transactionAmount,
                    currency: transaction.currency,
                    comment: trimmedComment,
                    receipt: receipt,
                    category: transaction.category,
                    tag: transaction.tag,
                    taxCode: transactionTaxCode,
                    taxAmount: transactionTaxAmount,
                    billable: transaction.billable,
                    reimbursable: transaction.reimbursable,
                    merchant: (_a = transaction.merchant) !== null && _a !== void 0 ? _a : '',
                    created: transaction.created,
                    actionableWhisperReportActionID: transaction.actionableWhisperReportActionID,
                    linkedTrackedExpenseReportAction: transaction.linkedTrackedExpenseReportAction,
                    linkedTrackedExpenseReportID: transaction.linkedTrackedExpenseReportID,
                },
            });
        }
        else {
            (0, IOU_1.requestMoney)({
                report: report,
                participantParams: { payeeEmail: currentUserPersonalDetails.login, payeeAccountID: currentUserPersonalDetails.accountID, participant: participant },
                policyParams: { policy: policy, policyTagList: policyTags, policyCategories: policyCategories },
                gpsPoints: gpsPoints,
                action: CONST_1.default.IOU.TYPE.CREATE,
                transactionParams: {
                    attendees: (_b = transaction.comment) === null || _b === void 0 ? void 0 : _b.attendees,
                    amount: transactionAmount,
                    currency: transaction.currency,
                    comment: trimmedComment,
                    receipt: receipt,
                    category: transaction.category,
                    tag: transaction.tag,
                    taxCode: transactionTaxCode,
                    taxAmount: transactionTaxAmount,
                    billable: transaction.billable,
                    reimbursable: transaction.reimbursable,
                    merchant: (_c = transaction.merchant) !== null && _c !== void 0 ? _c : '',
                    created: transaction.created,
                    actionableWhisperReportActionID: transaction.actionableWhisperReportActionID,
                    linkedTrackedExpenseReportAction: transaction.linkedTrackedExpenseReportAction,
                    linkedTrackedExpenseReportID: transaction.linkedTrackedExpenseReportID,
                },
                shouldGenerateTransactionThreadReport: shouldGenerateTransactionThreadReport,
            });
        }
    };
    var onSuccess = function (file, locationPermissionGranted) {
        var participant = selectedParticipants.at(0);
        if (!participant) {
            return;
        }
        var receipt = file;
        receipt.state = file && CONST_1.default.IOU.RECEIPT_STATE.SCAN_READY;
        if (locationPermissionGranted) {
            (0, getCurrentPosition_1.default)(function (successData) {
                finishRequestAndNavigate(participant, receipt, {
                    lat: successData.coords.latitude,
                    long: successData.coords.longitude,
                });
            }, function (errorData) {
                Log_1.default.info('[SubmitDetailsPage] getCurrentPosition failed', false, errorData);
                finishRequestAndNavigate(participant, receipt);
            }, {
                maximumAge: CONST_1.default.GPS.MAX_AGE,
                timeout: CONST_1.default.GPS.TIMEOUT,
            });
            return;
        }
        finishRequestAndNavigate(participant, receipt);
    };
    var onConfirm = function (gpsRequired) {
        var shouldStartLocationPermissionFlow = gpsRequired &&
            (!lastLocationPermissionPrompt ||
                (DateUtils_1.default.isValidDateString(lastLocationPermissionPrompt !== null && lastLocationPermissionPrompt !== void 0 ? lastLocationPermissionPrompt : '') &&
                    DateUtils_1.default.getDifferenceInDaysFromNow(new Date(lastLocationPermissionPrompt !== null && lastLocationPermissionPrompt !== void 0 ? lastLocationPermissionPrompt : '')) > CONST_1.default.IOU.LOCATION_PERMISSION_PROMPT_THRESHOLD_DAYS));
        if (shouldStartLocationPermissionFlow) {
            setStartLocationPermissionFlow(true);
            return;
        }
        if (!currentAttachment) {
            return;
        }
        (0, FileUtils_1.readFileAsync)(fileUri, fileName, function (file) { return onSuccess(file, shouldStartLocationPermissionFlow); }, function () { }, fileType);
    };
    return (<ScreenWrapper_1.default testID={SubmitDetailsPage.displayName}>
            <FullPageNotFoundView_1.default shouldShow={!reportOrAccountID}>
                <HeaderWithBackButton_1.default title={translate('common.details')} onBackButtonPress={function () { return Navigation_1.default.goBack(); }}/>
                <LocationPermissionModal_1.default startPermissionFlow={startLocationPermissionFlow} resetPermissionFlow={function () { return setStartLocationPermissionFlow(false); }} onGrant={onConfirm} onDeny={function () {
            (0, IOU_1.updateLastLocationPermissionPrompt)();
            setStartLocationPermissionFlow(false);
            (0, navigateAfterInteraction_1.default)(function () {
                onConfirm(false);
            });
        }}/>
                <react_native_1.View style={[styles.containerWithSpaceBetween, styles.pointerEventsBoxNone]}>
                    <MoneyRequestConfirmationList_1.default transaction={transaction} selectedParticipants={participants} iouAmount={0} iouComment={trimmedComment} iouCategory={transaction === null || transaction === void 0 ? void 0 : transaction.category} onConfirm={function () { return onConfirm(true); }} receiptPath={fileUri} receiptFilename={(0, FileUtils_1.getFileName)(fileName)} reportID={reportOrAccountID} shouldShowSmartScanFields={false} isDistanceRequest={false} isManualDistanceRequest={false} onPDFLoadError={function () {
            if (errorTitle) {
                return;
            }
            setErrorTitle(translate('attachmentPicker.attachmentError'));
            setErrorMessage(translate('attachmentPicker.errorWhileSelectingCorruptedAttachment'));
        }} onPDFPassword={function () {
            if (errorTitle) {
                return;
            }
            setErrorTitle(translate('attachmentPicker.attachmentError'));
            setErrorMessage(translate('attachmentPicker.protectedPDFNotSupported'));
        }}/>
                </react_native_1.View>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
SubmitDetailsPage.displayName = 'SubmitDetailsPage';
exports.default = SubmitDetailsPage;
