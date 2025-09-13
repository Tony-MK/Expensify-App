"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const htmlparser2_1 = require("htmlparser2");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const tryResolveUrlFromApiRoot_1 = require("@libs/tryResolveUrlFromApiRoot");
const CONST_1 = require("@src/CONST");
/**
 * Constructs the initial component state from report actions
 */
function extractAttachments(type, { privateNotes, accountID, parentReportAction, reportActions, report, isReportArchived, }) {
    const targetNote = privateNotes?.[Number(accountID)]?.note ?? '';
    const description = report?.description ?? '';
    const attachments = [];
    const canUserPerformAction = (0, ReportUtils_1.canUserPerformWriteAction)(report, isReportArchived);
    let currentLink = '';
    const htmlParser = new htmlparser2_1.Parser({
        onopentag: (name, attribs) => {
            if (name === 'a' && attribs.href) {
                currentLink = attribs.href;
            }
            if (name === 'video') {
                const source = (0, tryResolveUrlFromApiRoot_1.default)(attribs[CONST_1.default.ATTACHMENT_SOURCE_ATTRIBUTE]);
                const fileName = attribs[CONST_1.default.ATTACHMENT_ORIGINAL_FILENAME_ATTRIBUTE] || (0, FileUtils_1.getFileName)(`${source}`);
                attachments.unshift({
                    reportActionID: attribs['data-id'],
                    attachmentID: attribs[CONST_1.default.ATTACHMENT_ID_ATTRIBUTE],
                    source: (0, tryResolveUrlFromApiRoot_1.default)(attribs[CONST_1.default.ATTACHMENT_SOURCE_ATTRIBUTE]),
                    isAuthTokenRequired: !!attribs[CONST_1.default.ATTACHMENT_SOURCE_ATTRIBUTE],
                    file: { name: fileName },
                    duration: Number(attribs[CONST_1.default.ATTACHMENT_DURATION_ATTRIBUTE]),
                    isReceipt: false,
                    hasBeenFlagged: attribs['data-flagged'] === 'true',
                });
                return;
            }
            if (name === 'img' && attribs.src) {
                const expensifySource = attribs[CONST_1.default.ATTACHMENT_SOURCE_ATTRIBUTE] ?? (new RegExp(CONST_1.default.ATTACHMENT_OR_RECEIPT_LOCAL_URL, 'i').test(attribs.src) ? attribs.src : null);
                const source = (0, tryResolveUrlFromApiRoot_1.default)(expensifySource || attribs.src);
                const previewSource = (0, tryResolveUrlFromApiRoot_1.default)(attribs.src);
                let fileName = attribs[CONST_1.default.ATTACHMENT_ORIGINAL_FILENAME_ATTRIBUTE] || (0, FileUtils_1.getFileName)(`${source}`);
                const width = (attribs['data-expensify-width'] && parseInt(attribs['data-expensify-width'], 10)) || undefined;
                const height = (attribs['data-expensify-height'] && parseInt(attribs['data-expensify-height'], 10)) || undefined;
                // Public image URLs might lack a file extension in the source URL, without an extension our
                // AttachmentView fails to recognize them as images and renders fallback content instead.
                // We apply this small hack to add an image extension and ensure AttachmentView renders the image.
                const fileInfo = (0, FileUtils_1.splitExtensionFromFileName)(fileName);
                if (!fileInfo.fileExtension) {
                    fileName = `${fileInfo.fileName || 'image'}.jpg`;
                }
                // By iterating actions in chronological order and prepending each attachment
                // we ensure correct order of attachments even across actions with multiple attachments.
                attachments.unshift({
                    reportActionID: attribs['data-id'],
                    attachmentID: attribs[CONST_1.default.ATTACHMENT_ID_ATTRIBUTE],
                    source,
                    previewSource,
                    isAuthTokenRequired: !!expensifySource,
                    file: { name: fileName, width, height },
                    isReceipt: false,
                    hasBeenFlagged: attribs['data-flagged'] === 'true',
                    attachmentLink: currentLink,
                });
            }
        },
        onclosetag: (name) => {
            if (name !== 'a' || !currentLink) {
                return;
            }
            currentLink = '';
        },
    });
    if (type === CONST_1.default.ATTACHMENT_TYPE.NOTE) {
        htmlParser.write(targetNote);
        htmlParser.end();
        return attachments.reverse();
    }
    if (type === CONST_1.default.ATTACHMENT_TYPE.ONBOARDING) {
        htmlParser.write(description);
        htmlParser.end();
        return attachments.reverse();
    }
    const actions = [...(parentReportAction ? [parentReportAction] : []), ...(0, ReportActionsUtils_1.getSortedReportActions)(Object.values(reportActions ?? {}))];
    actions.forEach((action, key) => {
        if (!(0, ReportActionsUtils_1.shouldReportActionBeVisible)(action, key, canUserPerformAction) || (0, ReportActionsUtils_1.isMoneyRequestAction)(action)) {
            return;
        }
        const decision = (0, ReportActionsUtils_1.getReportActionMessage)(action)?.moderationDecision?.decision;
        const hasBeenFlagged = decision === CONST_1.default.MODERATION.MODERATOR_DECISION_PENDING_HIDE || decision === CONST_1.default.MODERATION.MODERATOR_DECISION_HIDDEN;
        const html = (0, ReportActionsUtils_1.getReportActionHtml)(action)
            .replaceAll('/>', `data-flagged="${hasBeenFlagged}" data-id="${action.reportActionID}"/>`)
            .replaceAll('<video ', `<video data-flagged="${hasBeenFlagged}" data-id="${action.reportActionID}" `);
        htmlParser.write((0, ReportActionsUtils_1.getHtmlWithAttachmentID)(html, action.reportActionID));
    });
    htmlParser.end();
    return attachments.reverse();
}
exports.default = extractAttachments;
