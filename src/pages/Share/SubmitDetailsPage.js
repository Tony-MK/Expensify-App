"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const LocationPermissionModal_1 = require("@components/LocationPermissionModal");
const MoneyRequestConfirmationList_1 = require("@components/MoneyRequestConfirmationList");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const IOU_1 = require("@libs/actions/IOU");
const DateUtils_1 = require("@libs/DateUtils");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const getCurrentPosition_1 = require("@libs/getCurrentPosition");
const Log_1 = require("@libs/Log");
const navigateAfterInteraction_1 = require("@libs/Navigation/navigateAfterInteraction");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const ReceiptUtils_1 = require("@libs/ReceiptUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ShareRootPage_1 = require("./ShareRootPage");
function SubmitDetailsPage({ route: { params: { reportOrAccountID }, }, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [unknownUserDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHARE_UNKNOWN_USER_DETAILS, { canBeMissing: true });
    const [personalDetails] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.PERSONAL_DETAILS_LIST}`, { canBeMissing: true });
    const report = (0, ReportUtils_1.getReportOrDraftReport)(reportOrAccountID);
    const [parentReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.parentReportID}`, { canBeMissing: true });
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${report?.policyID}`, { canBeMissing: false });
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${CONST_1.default.IOU.OPTIMISTIC_TRANSACTION_ID}`, { canBeMissing: true });
    const [policyCategories] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_CATEGORIES}${(0, IOU_1.getIOURequestPolicyID)(transaction, report)}`, { canBeMissing: false });
    const [policyTags] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${(0, IOU_1.getIOURequestPolicyID)(transaction, report)}`, { canBeMissing: false });
    const [lastLocationPermissionPrompt] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_LOCATION_PERMISSION_PROMPT, { canBeMissing: false });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [reportAttributesDerived] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { canBeMissing: true, selector: (val) => val?.reports });
    const [currentDate] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CURRENT_DATE, { canBeMissing: true });
    const [validFilesToUpload] = (0, useOnyx_1.default)(ONYXKEYS_1.default.VALIDATED_FILE_OBJECT, { canBeMissing: true });
    const [currentAttachment] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHARE_TEMP_FILE, { canBeMissing: true });
    const shouldUsePreValidatedFile = (0, ReceiptUtils_1.shouldValidateFile)(currentAttachment);
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const [startLocationPermissionFlow, setStartLocationPermissionFlow] = (0, react_1.useState)(false);
    const [errorTitle, setErrorTitle] = (0, react_1.useState)(undefined);
    const [errorMessage, setErrorMessage] = (0, react_1.useState)(undefined);
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const shouldGenerateTransactionThreadReport = !isBetaEnabled(CONST_1.default.BETAS.NO_OPTIMISTIC_TRANSACTION_THREADS) || !account?.shouldBlockTransactionThreadReportCreation;
    const fileUri = shouldUsePreValidatedFile ? (validFilesToUpload?.uri ?? '') : (currentAttachment?.content ?? '');
    const fileName = shouldUsePreValidatedFile ? (0, FileUtils_1.getFileName)(validFilesToUpload?.uri ?? CONST_1.default.ATTACHMENT_IMAGE_DEFAULT_NAME) : (0, FileUtils_1.getFileName)(currentAttachment?.content ?? '');
    const fileType = shouldUsePreValidatedFile ? (validFilesToUpload?.type ?? CONST_1.default.RECEIPT_ALLOWED_FILE_TYPES.JPEG) : (currentAttachment?.mimeType ?? '');
    (0, react_1.useEffect)(() => {
        if (!errorTitle || !errorMessage) {
            return;
        }
        (0, ShareRootPage_1.showErrorAlert)(errorTitle, errorMessage);
    }, [errorTitle, errorMessage]);
    (0, react_1.useEffect)(() => {
        (0, IOU_1.initMoneyRequest)({
            reportID: reportOrAccountID,
            policy,
            currentIouRequestType: CONST_1.default.IOU.REQUEST_TYPE.SCAN,
            newIouRequestType: CONST_1.default.IOU.REQUEST_TYPE.SCAN,
            report,
            parentReport,
            currentDate,
        });
    }, [reportOrAccountID, policy, report, parentReport, currentDate]);
    const selectedParticipants = unknownUserDetails ? [unknownUserDetails] : (0, IOU_1.getMoneyRequestParticipantsFromReport)(report);
    const participants = selectedParticipants.map((participant) => participant?.accountID ? (0, OptionsListUtils_1.getParticipantsOption)(participant, personalDetails) : (0, OptionsListUtils_1.getReportOption)(participant, reportAttributesDerived));
    const trimmedComment = transaction?.comment?.comment?.trim() ?? '';
    const transactionAmount = transaction?.amount ?? 0;
    const transactionTaxAmount = transaction?.taxAmount ?? 0;
    const defaultTaxCode = (0, TransactionUtils_1.getDefaultTaxCode)(policy, transaction);
    const transactionTaxCode = (transaction?.taxCode ? transaction?.taxCode : defaultTaxCode) ?? '';
    const finishRequestAndNavigate = (participant, receipt, gpsPoints) => {
        if (!transaction) {
            return;
        }
        if ((0, ReportUtils_1.isSelfDM)(report)) {
            (0, IOU_1.trackExpense)({
                report: report ?? { reportID: reportOrAccountID },
                isDraftPolicy: false,
                participantParams: { payeeEmail: currentUserPersonalDetails.login, payeeAccountID: currentUserPersonalDetails.accountID, participant },
                policyParams: { policy, policyTagList: policyTags, policyCategories },
                action: CONST_1.default.IOU.TYPE.CREATE,
                transactionParams: {
                    amount: transactionAmount,
                    currency: transaction.currency,
                    comment: trimmedComment,
                    receipt,
                    category: transaction.category,
                    tag: transaction.tag,
                    taxCode: transactionTaxCode,
                    taxAmount: transactionTaxAmount,
                    billable: transaction.billable,
                    reimbursable: transaction.reimbursable,
                    merchant: transaction.merchant ?? '',
                    created: transaction.created,
                    actionableWhisperReportActionID: transaction.actionableWhisperReportActionID,
                    linkedTrackedExpenseReportAction: transaction.linkedTrackedExpenseReportAction,
                    linkedTrackedExpenseReportID: transaction.linkedTrackedExpenseReportID,
                },
            });
        }
        else {
            (0, IOU_1.requestMoney)({
                report,
                participantParams: { payeeEmail: currentUserPersonalDetails.login, payeeAccountID: currentUserPersonalDetails.accountID, participant },
                policyParams: { policy, policyTagList: policyTags, policyCategories },
                gpsPoints,
                action: CONST_1.default.IOU.TYPE.CREATE,
                transactionParams: {
                    attendees: transaction.comment?.attendees,
                    amount: transactionAmount,
                    currency: transaction.currency,
                    comment: trimmedComment,
                    receipt,
                    category: transaction.category,
                    tag: transaction.tag,
                    taxCode: transactionTaxCode,
                    taxAmount: transactionTaxAmount,
                    billable: transaction.billable,
                    reimbursable: transaction.reimbursable,
                    merchant: transaction.merchant ?? '',
                    created: transaction.created,
                    actionableWhisperReportActionID: transaction.actionableWhisperReportActionID,
                    linkedTrackedExpenseReportAction: transaction.linkedTrackedExpenseReportAction,
                    linkedTrackedExpenseReportID: transaction.linkedTrackedExpenseReportID,
                },
                shouldGenerateTransactionThreadReport,
            });
        }
    };
    const onSuccess = (file, locationPermissionGranted) => {
        const participant = selectedParticipants.at(0);
        if (!participant) {
            return;
        }
        const receipt = file;
        receipt.state = file && CONST_1.default.IOU.RECEIPT_STATE.SCAN_READY;
        if (locationPermissionGranted) {
            (0, getCurrentPosition_1.default)((successData) => {
                finishRequestAndNavigate(participant, receipt, {
                    lat: successData.coords.latitude,
                    long: successData.coords.longitude,
                });
            }, (errorData) => {
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
    const onConfirm = (gpsRequired) => {
        const shouldStartLocationPermissionFlow = gpsRequired &&
            (!lastLocationPermissionPrompt ||
                (DateUtils_1.default.isValidDateString(lastLocationPermissionPrompt ?? '') &&
                    DateUtils_1.default.getDifferenceInDaysFromNow(new Date(lastLocationPermissionPrompt ?? '')) > CONST_1.default.IOU.LOCATION_PERMISSION_PROMPT_THRESHOLD_DAYS));
        if (shouldStartLocationPermissionFlow) {
            setStartLocationPermissionFlow(true);
            return;
        }
        if (!currentAttachment) {
            return;
        }
        (0, FileUtils_1.readFileAsync)(fileUri, fileName, (file) => onSuccess(file, shouldStartLocationPermissionFlow), () => { }, fileType);
    };
    return (<ScreenWrapper_1.default testID={SubmitDetailsPage.displayName}>
            <FullPageNotFoundView_1.default shouldShow={!reportOrAccountID}>
                <HeaderWithBackButton_1.default title={translate('common.details')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
                <LocationPermissionModal_1.default startPermissionFlow={startLocationPermissionFlow} resetPermissionFlow={() => setStartLocationPermissionFlow(false)} onGrant={onConfirm} onDeny={() => {
            (0, IOU_1.updateLastLocationPermissionPrompt)();
            setStartLocationPermissionFlow(false);
            (0, navigateAfterInteraction_1.default)(() => {
                onConfirm(false);
            });
        }}/>
                <react_native_1.View style={[styles.containerWithSpaceBetween, styles.pointerEventsBoxNone]}>
                    <MoneyRequestConfirmationList_1.default transaction={transaction} selectedParticipants={participants} iouAmount={0} iouComment={trimmedComment} iouCategory={transaction?.category} onConfirm={() => onConfirm(true)} receiptPath={fileUri} receiptFilename={(0, FileUtils_1.getFileName)(fileName)} reportID={reportOrAccountID} shouldShowSmartScanFields={false} isDistanceRequest={false} isManualDistanceRequest={false} onPDFLoadError={() => {
            if (errorTitle) {
                return;
            }
            setErrorTitle(translate('attachmentPicker.attachmentError'));
            setErrorMessage(translate('attachmentPicker.errorWhileSelectingCorruptedAttachment'));
        }} onPDFPassword={() => {
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
