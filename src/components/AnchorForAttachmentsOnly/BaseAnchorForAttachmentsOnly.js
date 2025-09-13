"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AttachmentView_1 = require("@components/Attachments/AttachmentView");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const ShowContextMenuContext_1 = require("@components/ShowContextMenuContext");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const addEncryptedAuthTokenToURL_1 = require("@libs/addEncryptedAuthTokenToURL");
const Browser_1 = require("@libs/Browser");
const fileDownload_1 = require("@libs/fileDownload");
const ReportUtils_1 = require("@libs/ReportUtils");
const Download_1 = require("@userActions/Download");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function BaseAnchorForAttachmentsOnly({ style, source = '', displayName = '', onPressIn, onPressOut, isDeleted }) {
    const sourceURLWithAuth = (0, addEncryptedAuthTokenToURL_1.default)(source);
    const sourceID = (source.match(CONST_1.default.REGEX.ATTACHMENT_ID) ?? [])[1];
    const [download] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.DOWNLOAD}${sourceID}`, { canBeMissing: true });
    const { isOffline } = (0, useNetwork_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const isDownloading = download?.isDownloading ?? false;
    return (<ShowContextMenuContext_1.ShowContextMenuContext.Consumer>
            {({ anchor, report, isReportArchived, action, checkIfContextMenuActive, isDisabled, shouldDisplayContextMenu }) => (<PressableWithoutFeedback_1.default style={[style, (isOffline || !sourceID) && styles.cursorDefault]} onPress={() => {
                if (isDownloading || isOffline || !sourceID) {
                    return;
                }
                (0, Download_1.setDownload)(sourceID, true);
                (0, fileDownload_1.default)(sourceURLWithAuth, displayName, '', (0, Browser_1.isMobileSafari)()).then(() => (0, Download_1.setDownload)(sourceID, false));
            }} onPressIn={onPressIn} onPressOut={onPressOut} onLongPress={(event) => {
                if (isDisabled || !shouldDisplayContextMenu) {
                    return;
                }
                (0, ShowContextMenuContext_1.showContextMenuForReport)(event, anchor, report?.reportID, action, checkIfContextMenuActive, (0, ReportUtils_1.isArchivedNonExpenseReport)(report, isReportArchived));
            }} shouldUseHapticsOnLongPress accessibilityLabel={displayName} role={CONST_1.default.ROLE.BUTTON}>
                    <AttachmentView_1.default source={source} file={{ name: displayName }} shouldShowDownloadIcon={!!sourceID && !isOffline} shouldShowLoadingSpinnerIcon={isDownloading} isUsedAsChatAttachment isDeleted={!!isDeleted} isUploading={!sourceID} isAuthTokenRequired={!!sourceID}/>
                </PressableWithoutFeedback_1.default>)}
        </ShowContextMenuContext_1.ShowContextMenuContext.Consumer>);
}
BaseAnchorForAttachmentsOnly.displayName = 'BaseAnchorForAttachmentsOnly';
exports.default = BaseAnchorForAttachmentsOnly;
