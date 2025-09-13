"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js/proposals/promise-with-resolvers");
// eslint-disable-next-line import/extensions
const pdf_worker_min_mjs_1 = require("pdfjs-dist/build/pdf.worker.min.mjs");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_pdf_1 = require("react-pdf");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const addEncryptedAuthTokenToURL_1 = require("@libs/addEncryptedAuthTokenToURL");
const PDFThumbnailError_1 = require("./PDFThumbnailError");
if (!react_pdf_1.pdfjs.GlobalWorkerOptions.workerSrc) {
    react_pdf_1.pdfjs.GlobalWorkerOptions.workerSrc = URL.createObjectURL(new Blob([pdf_worker_min_mjs_1.default], { type: 'text/javascript' }));
}
function PDFThumbnail({ previewSourceURL, style, isAuthTokenRequired = false, enabled = true, onPassword, onLoadError, onLoadSuccess }) {
    const styles = (0, useThemeStyles_1.default)();
    const [failedToLoad, setFailedToLoad] = (0, react_1.useState)(false);
    const thumbnail = (0, react_1.useMemo)(() => (<react_pdf_1.Document loading={<FullscreenLoadingIndicator_1.default />} file={isAuthTokenRequired ? (0, addEncryptedAuthTokenToURL_1.default)(previewSourceURL) : previewSourceURL} options={{
            cMapUrl: 'cmaps/',
            cMapPacked: true,
        }} externalLinkTarget="_blank" onPassword={onPassword} onLoad={() => {
            setFailedToLoad(false);
        }} onLoadSuccess={() => {
            if (!onLoadSuccess) {
                return;
            }
            onLoadSuccess();
        }} onLoadError={() => {
            if (onLoadError) {
                onLoadError();
            }
            setFailedToLoad(true);
        }} error={() => null}>
                <react_native_1.View pointerEvents="none">
                    <react_pdf_1.Thumbnail pageIndex={0}/>
                </react_native_1.View>
            </react_pdf_1.Document>), [isAuthTokenRequired, previewSourceURL, onPassword, onLoadError, onLoadSuccess]);
    return (<react_native_1.View style={[style, styles.overflowHidden, failedToLoad && styles.h100]}>
            <react_native_1.View style={[styles.w100, styles.h100, !failedToLoad && { ...styles.alignItemsCenter, ...styles.justifyContentCenter }]}>
                {enabled && !failedToLoad && thumbnail}
                {failedToLoad && <PDFThumbnailError_1.default />}
            </react_native_1.View>
        </react_native_1.View>);
}
PDFThumbnail.displayName = 'PDFThumbnail';
exports.default = react_1.default.memo(PDFThumbnail);
