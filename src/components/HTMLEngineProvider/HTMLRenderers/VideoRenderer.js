"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AttachmentContext_1 = require("@components/AttachmentContext");
const htmlEngineUtils_1 = require("@components/HTMLEngineProvider/htmlEngineUtils");
const ShowContextMenuContext_1 = require("@components/ShowContextMenuContext");
const VideoPlayerPreview_1 = require("@components/VideoPlayerPreview");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const tryResolveUrlFromApiRoot_1 = require("@libs/tryResolveUrlFromApiRoot");
const Navigation_1 = require("@navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function VideoRenderer({ tnode, key }) {
    const htmlAttribs = tnode.attributes;
    const attrHref = htmlAttribs[CONST_1.default.ATTACHMENT_SOURCE_ATTRIBUTE] || htmlAttribs.src || htmlAttribs.href || '';
    const sourceURL = (0, tryResolveUrlFromApiRoot_1.default)(attrHref);
    const fileName = (0, FileUtils_1.getFileName)(`${sourceURL}`);
    const thumbnailUrl = (0, tryResolveUrlFromApiRoot_1.default)(htmlAttribs[CONST_1.default.ATTACHMENT_THUMBNAIL_URL_ATTRIBUTE]);
    const width = Number(htmlAttribs[CONST_1.default.ATTACHMENT_THUMBNAIL_WIDTH_ATTRIBUTE]);
    const height = Number(htmlAttribs[CONST_1.default.ATTACHMENT_THUMBNAIL_HEIGHT_ATTRIBUTE]);
    const duration = Number(htmlAttribs[CONST_1.default.ATTACHMENT_DURATION_ATTRIBUTE]);
    const isDeleted = (0, htmlEngineUtils_1.isDeletedNode)(tnode);
    const attachmentID = htmlAttribs[CONST_1.default.ATTACHMENT_ID_ATTRIBUTE];
    return (<ShowContextMenuContext_1.ShowContextMenuContext.Consumer>
            {({ report }) => (<AttachmentContext_1.AttachmentContext.Consumer>
                    {({ accountID, type, hashKey, reportID }) => (<VideoPlayerPreview_1.default key={key} videoUrl={sourceURL} reportID={reportID ?? report?.reportID} fileName={fileName} thumbnailUrl={thumbnailUrl} videoDimensions={{ width, height }} videoDuration={duration} isDeleted={isDeleted} onShowModalPress={() => {
                    if (!sourceURL || !type) {
                        return;
                    }
                    const isAuthTokenRequired = !!htmlAttribs[CONST_1.default.ATTACHMENT_SOURCE_ATTRIBUTE];
                    const route = ROUTES_1.default.ATTACHMENTS.getRoute({ attachmentID, reportID: report?.reportID, type, source: sourceURL, accountID, isAuthTokenRequired, hashKey });
                    Navigation_1.default.navigate(route);
                }}/>)}
                </AttachmentContext_1.AttachmentContext.Consumer>)}
        </ShowContextMenuContext_1.ShowContextMenuContext.Consumer>);
}
VideoRenderer.displayName = 'VideoRenderer';
exports.default = VideoRenderer;
