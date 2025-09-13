"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AttachmentContext_1 = require("@components/AttachmentContext");
const utils_1 = require("@components/Button/utils");
const htmlEngineUtils_1 = require("@components/HTMLEngineProvider/htmlEngineUtils");
const Expensicons_1 = require("@components/Icon/Expensicons");
const PressableWithoutFocus_1 = require("@components/Pressable/PressableWithoutFocus");
const ShowContextMenuContext_1 = require("@components/ShowContextMenuContext");
const ThumbnailImage_1 = require("@components/ThumbnailImage");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const tryResolveUrlFromApiRoot_1 = require("@libs/tryResolveUrlFromApiRoot");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function ImageRenderer({ tnode }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const htmlAttribs = tnode.attributes;
    const isDeleted = (0, htmlEngineUtils_1.isDeletedNode)(tnode);
    // There are two kinds of images that need to be displayed:
    //
    //     - Chat Attachment images
    //
    //           Images uploaded by the user account via the app or email.
    //           These have a full-sized image `htmlAttribs[CONST.ATTACHMENT_SOURCE_ATTRIBUTE]`
    //           and a thumbnail `htmlAttribs.src`. Both of these URLs need to have
    //           an authToken added to them in order to control who
    //           can see the images.
    //
    //     - Non-Attachment Images
    //
    //           These could be hosted from anywhere (Expensify or another source)
    //           and are not protected by any kind of access control e.g. certain
    //           Concierge responder attachments are uploaded to S3 without any access
    //           control and thus require no authToken to verify access.
    //
    const attachmentSourceAttribute = htmlAttribs[CONST_1.default.ATTACHMENT_SOURCE_ATTRIBUTE] ?? (new RegExp(CONST_1.default.ATTACHMENT_OR_RECEIPT_LOCAL_URL, 'i').test(htmlAttribs.src) ? htmlAttribs.src : null);
    const isAttachmentOrReceipt = !!attachmentSourceAttribute;
    const attachmentID = htmlAttribs[CONST_1.default.ATTACHMENT_ID_ATTRIBUTE];
    // Files created/uploaded/hosted by App should resolve from API ROOT. Other URLs aren't modified
    const previewSource = (0, tryResolveUrlFromApiRoot_1.default)(htmlAttribs.src);
    // The backend always returns these thumbnails with a .jpg extension, even for .png images.
    // As a workaround, we remove the .1024.jpg or .320.jpg suffix only for .png images,
    // For other image formats, we retain the thumbnail as is to avoid unnecessary modifications.
    const processedPreviewSource = typeof previewSource === 'string' ? previewSource.replace(/\.png\.(1024|320)\.jpg$/, '.png') : previewSource;
    const source = (0, tryResolveUrlFromApiRoot_1.default)(isAttachmentOrReceipt ? attachmentSourceAttribute : htmlAttribs.src);
    const alt = htmlAttribs.alt;
    const imageWidth = (htmlAttribs['data-expensify-width'] && parseInt(htmlAttribs['data-expensify-width'], 10)) || undefined;
    const imageHeight = (htmlAttribs['data-expensify-height'] && parseInt(htmlAttribs['data-expensify-height'], 10)) || undefined;
    const imagePreviewModalDisabled = htmlAttribs['data-expensify-preview-modal-disabled'] === 'true';
    const fileType = (0, FileUtils_1.getFileType)(attachmentSourceAttribute);
    const fallbackIcon = fileType === CONST_1.default.ATTACHMENT_FILE_TYPE.FILE ? Expensicons_1.Document : Expensicons_1.GalleryNotFound;
    const theme = (0, useTheme_1.default)();
    let fileName = htmlAttribs[CONST_1.default.ATTACHMENT_ORIGINAL_FILENAME_ATTRIBUTE] || (0, FileUtils_1.getFileName)(`${isAttachmentOrReceipt ? attachmentSourceAttribute : htmlAttribs.src}`);
    const fileInfo = (0, FileUtils_1.splitExtensionFromFileName)(fileName);
    if (!fileInfo.fileExtension) {
        fileName = `${fileInfo?.fileName || CONST_1.default.DEFAULT_IMAGE_FILE_NAME}.jpg`;
    }
    const thumbnailImageComponent = (<ThumbnailImage_1.default previewSourceURL={processedPreviewSource} style={styles.webViewStyles.tagStyles.img} isAuthTokenRequired={isAttachmentOrReceipt} fallbackIcon={fallbackIcon} imageWidth={imageWidth} imageHeight={imageHeight} isDeleted={isDeleted} altText={alt} fallbackIconBackground={theme.highlightBG} fallbackIconColor={theme.border}/>);
    return imagePreviewModalDisabled ? (thumbnailImageComponent) : (<ShowContextMenuContext_1.ShowContextMenuContext.Consumer>
            {({ onShowContextMenu, anchor, report, isReportArchived, action, checkIfContextMenuActive, isDisabled, shouldDisplayContextMenu }) => (<AttachmentContext_1.AttachmentContext.Consumer>
                    {({ reportID, accountID, type }) => (<PressableWithoutFocus_1.default style={[styles.noOutline]} onPress={() => {
                    if (!source || !type) {
                        return;
                    }
                    const attachmentLink = tnode.parent?.attributes?.href;
                    const route = ROUTES_1.default.ATTACHMENTS?.getRoute({
                        attachmentID,
                        reportID,
                        type,
                        source,
                        accountID,
                        isAuthTokenRequired: isAttachmentOrReceipt,
                        originalFileName: fileName,
                        attachmentLink,
                    });
                    Navigation_1.default.navigate(route);
                }} onLongPress={(event) => {
                    if (isDisabled || !shouldDisplayContextMenu) {
                        return;
                    }
                    return onShowContextMenu(() => (0, ShowContextMenuContext_1.showContextMenuForReport)(event, anchor, report?.reportID, action, checkIfContextMenuActive, (0, ReportUtils_1.isArchivedNonExpenseReport)(report, isReportArchived)));
                }} isNested shouldUseHapticsOnLongPress role={(0, utils_1.getButtonRole)(true)} accessibilityLabel={translate('accessibilityHints.viewAttachment')}>
                            {thumbnailImageComponent}
                        </PressableWithoutFocus_1.default>)}
                </AttachmentContext_1.AttachmentContext.Consumer>)}
        </ShowContextMenuContext_1.ShowContextMenuContext.Consumer>);
}
ImageRenderer.displayName = 'ImageRenderer';
const ImageRendererMemorize = (0, react_1.memo)(ImageRenderer, (prevProps, nextProps) => prevProps.tnode.attributes === nextProps.tnode.attributes && prevProps.shouldUseStagingServer === nextProps.shouldUseStagingServer);
function ImageRendererWrapper(props) {
    const [shouldUseStagingServer] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SHOULD_USE_STAGING_SERVER, { canBeMissing: true });
    return (<ImageRendererMemorize 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} shouldUseStagingServer={shouldUseStagingServer}/>);
}
exports.default = ImageRendererWrapper;
