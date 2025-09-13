"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fast_equals_1 = require("fast-equals");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const useOnyx_1 = require("@hooks/useOnyx");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const AttachmentCarouselView_1 = require("./AttachmentCarouselView");
const extractAttachments_1 = require("./extractAttachments");
const useCarouselArrows_1 = require("./useCarouselArrows");
function AttachmentCarousel({ report, attachmentID, source, onNavigate, setDownloadButtonVisibility, type, accountID, onClose, attachmentLink, onAttachmentError, onAttachmentLoaded, }) {
    const [parentReportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.parentReportID}`, { canEvict: false, canBeMissing: true });
    const [reportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`, { canEvict: false, canBeMissing: true });
    const canUseTouchScreen = (0, DeviceCapabilities_1.canUseTouchScreen)();
    const styles = (0, useThemeStyles_1.default)();
    const isReportArchived = (0, useReportIsArchived_1.default)(report.reportID);
    const [page, setPage] = (0, react_1.useState)();
    const [attachments, setAttachments] = (0, react_1.useState)([]);
    const { shouldShowArrows, setShouldShowArrows, autoHideArrows, cancelAutoHideArrows } = (0, useCarouselArrows_1.default)();
    (0, react_1.useEffect)(() => {
        if (!canUseTouchScreen) {
            return;
        }
        setShouldShowArrows(true);
    }, [canUseTouchScreen, page, setShouldShowArrows]);
    const compareImage = (0, react_1.useCallback)((attachment) => (attachmentID ? attachment.attachmentID === attachmentID : attachment.source === source) && (!attachmentLink || attachment.attachmentLink === attachmentLink), [attachmentLink, attachmentID, source]);
    (0, react_1.useEffect)(() => {
        const parentReportAction = report.parentReportActionID && parentReportActions ? parentReportActions[report.parentReportActionID] : undefined;
        let newAttachments = [];
        if (type === CONST_1.default.ATTACHMENT_TYPE.NOTE && accountID) {
            newAttachments = (0, extractAttachments_1.default)(CONST_1.default.ATTACHMENT_TYPE.NOTE, { privateNotes: report.privateNotes, accountID, report, isReportArchived });
        }
        else if (type === CONST_1.default.ATTACHMENT_TYPE.ONBOARDING) {
            newAttachments = (0, extractAttachments_1.default)(CONST_1.default.ATTACHMENT_TYPE.ONBOARDING, { parentReportAction, reportActions: reportActions ?? undefined, report, isReportArchived });
        }
        else {
            newAttachments = (0, extractAttachments_1.default)(CONST_1.default.ATTACHMENT_TYPE.REPORT, { parentReportAction, reportActions: reportActions ?? undefined, report, isReportArchived });
        }
        if ((0, fast_equals_1.deepEqual)(attachments, newAttachments)) {
            if (attachments.length === 0) {
                setPage(-1);
                setDownloadButtonVisibility?.(false);
            }
            return;
        }
        let newIndex = newAttachments.findIndex(compareImage);
        const index = attachments.findIndex(compareImage);
        // If newAttachments includes an attachment with the same index, update newIndex to that index.
        // Previously, uploading an attachment offline would dismiss the modal when the image was previewed and the connection was restored.
        // Now, instead of dismissing the modal, we replace it with the new attachment that has the same index.
        if (newIndex === -1 && index !== -1 && newAttachments.at(index)) {
            newIndex = index;
        }
        // If no matching attachment with the same index, dismiss the modal
        if (newIndex === -1 && index !== -1 && attachments.at(index)) {
            Navigation_1.default.dismissModal();
        }
        else {
            setPage(newIndex);
            setAttachments(newAttachments);
            // Update the download button visibility in the parent modal
            if (setDownloadButtonVisibility) {
                setDownloadButtonVisibility(newIndex !== -1);
            }
            const attachment = newAttachments.at(newIndex);
            // Update the parent modal's state with the source and name from the mapped attachments
            if (newIndex !== -1 && attachment !== undefined && onNavigate) {
                onNavigate(attachment);
            }
        }
    }, [reportActions, parentReportActions, compareImage, attachments, setDownloadButtonVisibility, onNavigate, accountID, type, report, isReportArchived]);
    if (page == null) {
        return (<react_native_1.View style={[styles.flex1, styles.attachmentCarouselContainer]}>
                <FullscreenLoadingIndicator_1.default />
            </react_native_1.View>);
    }
    return (<AttachmentCarouselView_1.default page={page} setPage={setPage} attachments={attachments} shouldShowArrows={shouldShowArrows} autoHideArrows={autoHideArrows} cancelAutoHideArrow={cancelAutoHideArrows} setShouldShowArrows={setShouldShowArrows} onClose={onClose} onAttachmentError={onAttachmentError} report={report} attachmentID={attachmentID} source={source} onNavigate={onNavigate} onAttachmentLoaded={onAttachmentLoaded}/>);
}
AttachmentCarousel.displayName = 'AttachmentCarousel';
exports.default = AttachmentCarousel;
