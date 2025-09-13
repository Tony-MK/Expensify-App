"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const Report_1 = require("@libs/actions/Report");
const AttachmentUtils_1 = require("@libs/AttachmentUtils");
const ComposerFocusManager_1 = require("@libs/ComposerFocusManager");
const Localize_1 = require("@libs/Localize");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const tryResolveUrlFromApiRoot_1 = require("@libs/tryResolveUrlFromApiRoot");
const AttachmentModalContainer_1 = require("@pages/media/AttachmentModalScreen/AttachmentModalContainer");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function ReportAttachmentModalContent({ route, navigation }) {
    const { attachmentID, type, file: fileParam, source: sourceParam, isAuthTokenRequired, attachmentLink, originalFileName, accountID = CONST_1.default.DEFAULT_NUMBER_ID, reportID, hashKey, shouldDisableSendButton, headerTitle, onConfirm, onShow, } = route.params;
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, { canBeMissing: false });
    const [reportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportID}`, {
        canEvict: false,
        canBeMissing: true,
    });
    const [reportMetadata] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${reportID}`, {
        canBeMissing: false,
    });
    const [isLoadingApp] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    const { isOffline } = (0, useNetwork_1.default)();
    const [isAttachmentInvalid, setIsAttachmentInvalid] = (0, react_1.useState)(false);
    const [attachmentInvalidReason, setAttachmentInvalidReason] = (0, react_1.useState)(null);
    const [attachmentInvalidReasonTitle, setAttachmentInvalidReasonTitle] = (0, react_1.useState)(null);
    const submitRef = (0, react_1.useRef)(null);
    // Extract the reportActionID from the attachmentID (format: reportActionID_index)
    const reportActionID = (0, react_1.useMemo)(() => attachmentID?.split('_')?.[0], [attachmentID]);
    const shouldFetchReport = (0, react_1.useMemo)(() => {
        return (0, EmptyObject_1.isEmptyObject)(reportActions?.[reportActionID ?? CONST_1.default.DEFAULT_NUMBER_ID]);
    }, [reportActions, reportActionID]);
    const isLoading = (0, react_1.useMemo)(() => {
        if (isOffline || (0, ReportUtils_1.isReportNotFound)(report) || !reportID) {
            return false;
        }
        const isEmptyReport = (0, EmptyObject_1.isEmptyObject)(report);
        return !!isLoadingApp || isEmptyReport || (reportMetadata?.isLoadingInitialReportActions !== false && shouldFetchReport);
    }, [isOffline, reportID, isLoadingApp, report, reportMetadata, shouldFetchReport]);
    const [modalType, setModalType] = (0, react_1.useState)(CONST_1.default.MODAL.MODAL_TYPE.CENTERED_UNSWIPEABLE);
    const [source, setSource] = (0, react_1.useState)(() => Number(sourceParam) || (typeof sourceParam === 'string' ? (0, tryResolveUrlFromApiRoot_1.default)(decodeURIComponent(sourceParam)) : undefined));
    const fetchReport = (0, react_1.useCallback)(() => {
        (0, Report_1.openReport)(reportID, reportActionID);
    }, [reportID, reportActionID]);
    (0, react_1.useEffect)(() => {
        if (!reportID || !shouldFetchReport) {
            return;
        }
        fetchReport();
    }, [reportID, fetchReport, shouldFetchReport]);
    const onCarouselAttachmentChange = (0, react_1.useCallback)((attachment) => {
        const routeToNavigate = ROUTES_1.default.ATTACHMENTS.getRoute({
            reportID,
            attachmentID: attachment.attachmentID,
            type,
            source: String(attachment.source),
            accountID,
            isAuthTokenRequired: attachment?.isAuthTokenRequired,
            originalFileName: attachment?.file?.name,
            attachmentLink: attachment?.attachmentLink,
            hashKey,
        });
        Navigation_1.default.navigate(routeToNavigate);
    }, [reportID, type, accountID, hashKey]);
    const onClose = (0, react_1.useCallback)(() => {
        // This enables Composer refocus when the attachments modal is closed by the browser navigation
        ComposerFocusManager_1.default.setReadyToFocus();
    }, []);
    /**
     * If our attachment is a PDF, return the unswipeable Modal type.
     */
    const getModalType = (0, react_1.useCallback)((sourceURL, fileObject) => sourceURL && (expensify_common_1.Str.isPDF(sourceURL) || (fileObject && expensify_common_1.Str.isPDF(fileObject.name ?? (0, Localize_1.translateLocal)('attachmentView.unknownFilename'))))
        ? CONST_1.default.MODAL.MODAL_TYPE.CENTERED_UNSWIPEABLE
        : CONST_1.default.MODAL.MODAL_TYPE.CENTERED, []);
    // Validates the attachment file and renders the appropriate modal type or errors
    const validateFile = (0, react_1.useCallback)((file, setFile) => {
        if (!file) {
            return;
        }
        (0, AttachmentUtils_1.default)(file).then((result) => {
            if (!result.isValid) {
                const { error } = result;
                setIsAttachmentInvalid?.(true);
                switch (error) {
                    case 'tooLarge':
                        setAttachmentInvalidReasonTitle?.('attachmentPicker.attachmentTooLarge');
                        setAttachmentInvalidReason?.('attachmentPicker.sizeExceeded');
                        break;
                    case 'tooSmall':
                        setAttachmentInvalidReasonTitle?.('attachmentPicker.attachmentTooSmall');
                        setAttachmentInvalidReason?.('attachmentPicker.sizeNotMet');
                        break;
                    case 'fileDoesNotExist':
                        setAttachmentInvalidReasonTitle?.('attachmentPicker.attachmentError');
                        setAttachmentInvalidReason?.('attachmentPicker.folderNotAllowedMessage');
                        break;
                    case 'fileInvalid':
                    default:
                        setAttachmentInvalidReasonTitle?.('attachmentPicker.attachmentError');
                        setAttachmentInvalidReason?.('attachmentPicker.errorWhileSelectingCorruptedAttachment');
                }
                return;
            }
            const { source: fileSource } = result;
            const inputModalType = getModalType(fileSource, file);
            setModalType(inputModalType);
            setSource(fileSource);
            setFile(file);
        });
    }, [getModalType]);
    const contentTypeProps = (0, react_1.useMemo)(() => fileParam
        ? {
            file: fileParam,
            onValidateFile: validateFile,
        }
        : {
            // In native the imported images sources are of type number. Ref: https://reactnative.dev/docs/image#imagesource
            type,
            report,
            shouldShowNotFoundPage: !isLoading && type !== CONST_1.default.ATTACHMENT_TYPE.SEARCH && !report?.reportID,
            allowDownload: true,
            isAuthTokenRequired: !!isAuthTokenRequired,
            attachmentLink: attachmentLink ?? '',
            originalFileName: originalFileName ?? '',
            isLoading,
        }, [attachmentLink, fileParam, isAuthTokenRequired, isLoading, originalFileName, report, type, validateFile]);
    const contentProps = (0, react_1.useMemo)(() => ({
        ...contentTypeProps,
        source,
        attachmentID,
        accountID,
        onConfirm,
        headerTitle,
        isAttachmentInvalid,
        attachmentInvalidReasonTitle,
        attachmentInvalidReason,
        shouldDisableSendButton,
        submitRef,
        onCarouselAttachmentChange,
    }), [
        accountID,
        attachmentID,
        attachmentInvalidReason,
        attachmentInvalidReasonTitle,
        contentTypeProps,
        headerTitle,
        isAttachmentInvalid,
        onCarouselAttachmentChange,
        onConfirm,
        shouldDisableSendButton,
        source,
    ]);
    // If the user refreshes during the send attachment flow, we need to navigate back to the report or home
    (0, react_1.useEffect)(() => {
        if (!!sourceParam || !!fileParam) {
            return;
        }
        Navigation_1.default.isNavigationReady().then(() => {
            if (reportID) {
                Navigation_1.default.goBack(ROUTES_1.default.REPORT_WITH_ID.getRoute(reportID));
            }
            else {
                Navigation_1.default.goBack(ROUTES_1.default.HOME);
            }
        });
    }, [sourceParam, reportID, route.name, fileParam]);
    return (<AttachmentModalContainer_1.default navigation={navigation} contentProps={contentProps} modalType={modalType} onShow={onShow} onClose={onClose}/>);
}
ReportAttachmentModalContent.displayName = 'ReportAttachmentModalContent';
exports.default = ReportAttachmentModalContent;
