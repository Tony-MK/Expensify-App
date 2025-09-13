"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_pdf_1 = require("react-native-pdf");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const addEncryptedAuthTokenToURL_1 = require("@libs/addEncryptedAuthTokenToURL");
const PDFThumbnailError_1 = require("./PDFThumbnailError");
function PDFThumbnail({ previewSourceURL, style, isAuthTokenRequired = false, enabled = true, fitPolicy = 0, onPassword, onLoadError, onLoadSuccess }) {
    const styles = (0, useThemeStyles_1.default)();
    const sizeStyles = [styles.w100, styles.h100];
    const [failedToLoad, setFailedToLoad] = (0, react_1.useState)(false);
    return (<react_native_1.View style={[style, styles.overflowHidden]}>
            <react_native_1.View style={[sizeStyles, !failedToLoad && styles.alignItemsCenter, styles.justifyContentCenter]}>
                {enabled && !failedToLoad && (<react_native_pdf_1.default fitPolicy={fitPolicy} trustAllCerts={false} renderActivityIndicator={() => <FullscreenLoadingIndicator_1.default />} source={{ uri: isAuthTokenRequired ? (0, addEncryptedAuthTokenToURL_1.default)(previewSourceURL) : previewSourceURL }} singlePage style={sizeStyles} onError={(error) => {
                if ('message' in error && typeof error.message === 'string' && error.message.match(/password/i) && onPassword) {
                    onPassword();
                    return;
                }
                if (onLoadError) {
                    onLoadError();
                }
                setFailedToLoad(true);
            }} onLoadComplete={() => {
                if (!onLoadSuccess) {
                    return;
                }
                onLoadSuccess();
            }}/>)}
                {failedToLoad && <PDFThumbnailError_1.default />}
            </react_native_1.View>
        </react_native_1.View>);
}
PDFThumbnail.displayName = 'PDFThumbnail';
exports.default = react_1.default.memo(PDFThumbnail);
